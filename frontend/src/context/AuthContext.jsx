import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db as firestore, googleProvider } from '../firebase';
import { 
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, signInWithPopup
} from 'firebase/auth';
import { 
  collection, doc, setDoc, getDoc, deleteDoc, onSnapshot, getDocs
} from 'firebase/firestore';

const AuthContext = createContext();

const EMPTY_DB = { users: [], organizations: [], notes: [], activities: [], tasks: [] };

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbState, setDbState] = useState(EMPTY_DB);
  const [toast, setToast] = useState(null);

  // Firestore specific: setup real-time listeners
  useEffect(() => {
    const unsubscibers = [];
    
    ['users', 'organizations', 'notes', 'activities', 'tasks'].forEach(collName => {
      const unsub = onSnapshot(collection(firestore, collName), (snapshot) => {
        setDbState(prev => ({
          ...prev,
          [collName]: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        }));
      }, (error) => {
        console.warn(`Error listening to ${collName}:`, error);
      });
      unsubscibers.push(unsub);
    });

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setAuthUser({ id: firebaseUser.uid, ...userDoc.data() });
        } else {
          setAuthUser({ id: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName });
        }
      } else {
        setAuthUser(null);
      }
    });
    unsubscibers.push(unsubAuth);

    return () => unsubscibers.forEach(unsub => unsub());
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const logActivity = async (orgId, action) => {
    if (!orgId) return;
    const entry = { orgId, user: user?.name || 'System', action, time: new Date().toLocaleTimeString(), timestamp: Date.now() };
    await setDoc(doc(firestore, 'activities', Date.now().toString()), entry);
  };

  // Google Sign-in Handler
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(firestore, 'users', result.user.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
         // Create default user profile if they don't exist
         const newUser = {
           role: 'MEMBER', 
           name: result.user.displayName, 
           email: result.user.email,
           avatar: result.user.photoURL,
           status: 'online', github: '', bio: '', orgId: ''
         };
         await setDoc(userRef, newUser);
      }
      showToast(`Welcome, ${result.user.displayName}!`);
      return { success: true };
    } catch (error) {
      showToast(error.message, 'error');
      return { error: error.message };
    }
  };

  const login = async (email, password, expectedRole) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Expected Role checks can be done after fetching the profile
      const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid));
      if (userDoc.exists() && expectedRole && userDoc.data().role !== expectedRole) {
        throw new Error(`Access denied. You do not have the ${expectedRole} role.`);
      }
      showToast(`Welcome back!`);
      return true;
    } catch (error) {
       showToast(error.message, 'error');
       return false;
    }
  };

  const logout = async () => {
    if (user) await logActivity(user.orgId, `${user.name} signed out`);
    await signOut(auth);
    showToast('Logged out');
  };

  const signupAdmin = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = { 
        role: 'SYSTEM_ADMIN', name, email, 
        avatar: `https://ui-avatars.com/api/?name=${name}&background=10b981&color=fff`, 
        status: 'online' 
      };
      await setDoc(doc(firestore, 'users', userCredential.user.uid), newUser);
      showToast('System Admin account created!');
      return { success: true };
    } catch (error) {
       showToast(error.message, 'error');
       return { error: error.message };
    }
  };

  const signupOrgOwner = async (name, email, password, orgName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newOrgId = `org_${Date.now()}`;
      const newOrg = {
        name: orgName,
        logo: `https://ui-avatars.com/api/?name=${orgName.replace(/ /g, '+')}&background=10b981&color=fff`,
        stats: { velocity: 100, growth: 100, activeProjects: 0 },
        createdAt: new Date().toLocaleDateString()
      };
      await setDoc(doc(firestore, 'organizations', newOrgId), newOrg);
      
      const newUser = { 
        role: 'ORG_OWNER', orgId: newOrgId, name, email, 
        avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=10b981&color=fff`, 
        status: 'online' 
      };
      await setDoc(doc(firestore, 'users', userCredential.user.uid), newUser);
      
      await logActivity(newOrgId, `Organization "${orgName}" was created`);
      showToast(`Organization "${orgName}" provisioned!`);
      return { success: true };
    } catch (error) {
       showToast(error.message, 'error');
       return { error: error.message };
    }
  };

  const signupMember = async (name, email, password, orgId, roleTitle) => {
    try {
      const orgDoc = await getDoc(doc(firestore, 'organizations', orgId));
      if (!orgDoc.exists()) return { error: 'Invalid Organization ID. Ask your Org Owner for the correct ID.' };
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = { 
        role: 'MEMBER', orgId, name, email, roleTitle, progress: 0, 
        avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=10b981&color=fff`, 
        status: 'online', github: '', bio: '' 
      };
      await setDoc(doc(firestore, 'users', userCredential.user.uid), newUser);

      // Onboarding "Welcome Mission" tasks based on role
      const onboardingTasks = [
        { title: `Complete ${roleTitle} Profile setup`, priority: 'high' },
        { title: `Review ${roleTitle} documentation and guidelines`, priority: 'medium' },
        { title: `Introduce yourself to the team`, priority: 'low' }
      ];

      for (const t of onboardingTasks) {
        const taskId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        const task = { orgId, title: t.title, assignee: name, priority: t.priority, status: 'todo', createdAt: new Date().toLocaleDateString() };
        await setDoc(doc(firestore, 'tasks', taskId), task);
      }
      
      await logActivity(orgId, `${name} joined as ${roleTitle}`);
      showToast(`Welcome to ${orgDoc.data().name}!`);
      return { success: true };
    } catch (error) {
       showToast(error.message, 'error');
       return { error: error.message };
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      await setDoc(doc(firestore, 'users', user.id), updatedData, { merge: true });
      await logActivity(user.orgId, `${user.name} updated their profile`);
      showToast('Profile saved!');
    } catch(e) {
      showToast('Failed to update profile', 'error');
    }
  };

  const addMemberToOrg = async (orgId, memberData) => {
    // Note: Creating a user via admin auth or link is preferred, but here we just add a stub in the DB
    const newUserId = `u${Date.now()}`;
    const newUser = { 
        orgId, role: 'MEMBER', ...memberData, progress: 0, 
        avatar: `https://ui-avatars.com/api/?name=${memberData.name?.replace(/ /g, '+')}&background=10b981&color=fff`, 
        status: 'offline', github: '', bio: '' 
    };
    await setDoc(doc(firestore, 'users', newUserId), newUser);
    await logActivity(orgId, `${memberData.name} was added to the organization`);
    showToast(`${memberData.name} added!`);
  };

  const removeMember = async (memberId) => {
    try {
      const member = dbState.users.find(u => u.id === memberId);
      await deleteDoc(doc(firestore, 'users', memberId));
      if (member) {
        await logActivity(member.orgId, `${member.name} was removed`);
        showToast(`${member.name} removed`, 'warning');
      }
    } catch(e) {
      console.error(e);
    }
  };

  const addOrg = async (orgData) => {
    const newOrgId = `org_${Date.now()}`;
    const newOrg = { 
      stats: { velocity: 100, growth: 100, activeProjects: 0 }, 
      logo: `https://ui-avatars.com/api/?name=${orgData.name?.replace(/ /g, '+')}&background=10b981&color=fff`, 
      createdAt: new Date().toLocaleDateString(), 
      ...orgData 
    };
    await setDoc(doc(firestore, 'organizations', newOrgId), newOrg);
    showToast(`${orgData.name} provisioned!`);
  };

  const removeOrg = async (orgId) => {
    await deleteDoc(doc(firestore, 'organizations', orgId));
    // Additional cleanup could drop members/tasks. Skipping deep-clean for simplicity in this demo.
    showToast(`Organization decommissioned`, 'warning');
  };

  const updateProgress = async (progressVal) => {
    await updateUserProfile({ progress: progressVal });
  };

  // Notes
  const addNote = async (orgId, content) => {
    const newNoteId = Date.now().toString();
    const newNote = { orgId, author: user.name, content, date: new Date().toLocaleDateString(), stamp: Date.now() };
    await setDoc(doc(firestore, 'notes', newNoteId), newNote);
    await logActivity(orgId, `${user.name} posted a notice`);
    showToast('Notice posted!');
  };
  
  const removeNote = async (noteId) => {
    await deleteDoc(doc(firestore, 'notes', noteId.toString()));
    showToast('Notice removed', 'warning');
  };
  
  const getOrgNotes = (orgId) => (dbState.notes || []).filter(n => n.orgId === orgId).sort((a,b) => b.stamp - a.stamp);

  // Tasks / Kanban
  const addTask = async (orgId, title, assignee, priority) => {
    const taskId = Date.now().toString();
    const task = { orgId, title, assignee, priority, status: 'todo', createdAt: new Date().toLocaleDateString() };
    await setDoc(doc(firestore, 'tasks', taskId), task);
    await logActivity(orgId, `Task "${title}" created`);
    showToast('Task created!');
  };
  const updateTaskStatus = async (taskId, newStatus) => {
    await setDoc(doc(firestore, 'tasks', taskId.toString()), { status: newStatus }, { merge: true });
  };
  const removeTask = async (taskId) => {
    await deleteDoc(doc(firestore, 'tasks', taskId.toString()));
  };

  const getOrgTasks = (orgId) => (dbState.tasks || []).filter(t => t.orgId === orgId);
  const getOrgActivities = (orgId) => (dbState.activities || []).filter(a => a.orgId === orgId).sort((a,b)=> b.timestamp - a.timestamp).slice(0, 50);
  const getOrgDetails = (orgId) => (dbState.organizations || []).find(o => o.id === orgId) || { name: 'Unknown', stats: { velocity: 0 } };
  const getOrgMembers = (orgId) => (dbState.users || []).filter(u => u.orgId === orgId && u.role === 'MEMBER');
  const getAllOrgs = () => (dbState.organizations || []);

  const clearStorage = () => {
    showToast("This feature requires deleting collections in Firebase console.");
  };

  const user = authUser ? { ...authUser, ...(dbState.users.find(u => u.id === authUser.id) || {}) } : null;

  return (
    <AuthContext.Provider value={{
      user, login, loginWithGoogle, logout, getOrgDetails, getOrgMembers, getAllOrgs, updateUserProfile, db: dbState, toast,
      addMemberToOrg, removeMember, addOrg, removeOrg, updateProgress,
      signupAdmin, signupOrgOwner, signupMember, addNote, removeNote, getOrgNotes,
      addTask, updateTaskStatus, removeTask, getOrgTasks, getOrgActivities, showToast, clearStorage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
