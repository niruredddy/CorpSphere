import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const EMPTY_DB = { users: [], organizations: [], notes: [], activities: [], tasks: [] };

const loadData = () => {
  try {
    const saved = localStorage.getItem('corpSphereDB');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults so old data missing new fields won't crash
      return { ...EMPTY_DB, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load DB, resetting:', e);
    localStorage.removeItem('corpSphereDB');
  }
  return { ...EMPTY_DB };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [db, setDb] = useState(loadData());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('corpSphereDB', JSON.stringify(db));
  }, [db]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const logActivity = (orgId, action) => {
    if (!orgId) return; // skip for system admin or undefined org
    const entry = { id: Date.now(), orgId, user: user?.name || 'System', action, time: new Date().toLocaleTimeString() };
    setDb(prev => ({ ...prev, activities: [entry, ...(prev.activities || [])].slice(0, 50) }));
  };

  const login = (email, password, expectedRole) => {
    const foundUser = db.users.find(u => u.email === email && u.password === password);
    if (foundUser && (!expectedRole || foundUser.role === expectedRole)) {
      setUser(foundUser);
      logActivity(foundUser.orgId, `${foundUser.name} logged in`);
      showToast(`Welcome back, ${foundUser.name}!`);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (user) logActivity(user.orgId, `${user.name} signed out`);
    setUser(null);
  };

  const checkEmail = (email) => !!db.users.find(u => u.email === email);

  const signupAdmin = (name, email, password) => {
    if (checkEmail(email)) return { error: 'Email already in use' };
    const newUser = { id: `u${Date.now()}`, role: 'SYSTEM_ADMIN', name, email, password, avatar: `https://ui-avatars.com/api/?name=${name}&background=10b981&color=fff`, status: 'online' };
    setDb(prev => ({ ...prev, users: [...prev.users, newUser] }));
    setUser(newUser);
    showToast('System Admin account created!');
    return { success: true };
  };

  const signupOrgOwner = (name, email, password, orgName) => {
    if (checkEmail(email)) return { error: 'Email already in use' };
    const newOrg = {
      id: `org_${Date.now()}`, name: orgName,
      logo: `https://ui-avatars.com/api/?name=${orgName.replace(/ /g, '+')}&background=10b981&color=fff`,
      stats: { velocity: 100, growth: 100, activeProjects: 0 },
      createdAt: new Date().toLocaleDateString()
    };
    const newUser = { id: `u${Date.now()}`, role: 'ORG_OWNER', orgId: newOrg.id, name, email, password, avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=10b981&color=fff`, status: 'online' };
    setDb(prev => ({ ...prev, organizations: [...prev.organizations, newOrg], users: [...prev.users, newUser] }));
    setUser(newUser);
    logActivity(newOrg.id, `Organization "${orgName}" was created`);
    showToast(`Organization "${orgName}" provisioned!`);
    return { success: true };
  };

  const signupMember = (name, email, password, orgId, roleTitle) => {
    if (checkEmail(email)) return { error: 'Email already in use' };
    const orgExists = db.organizations.find(o => o.id === orgId);
    if (!orgExists) return { error: 'Invalid Organization ID. Ask your Org Owner for the correct ID.' };
    const newUser = { id: `u${Date.now()}`, role: 'MEMBER', orgId, name, email, password, roleTitle, progress: 0, avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=10b981&color=fff`, status: 'online', github: '', bio: '' };
    setDb(prev => ({ ...prev, users: [...prev.users, newUser] }));
    setUser(newUser);
    logActivity(orgId, `${name} joined as ${roleTitle}`);
    showToast(`Welcome to ${orgExists.name}!`);
    return { success: true };
  };

  const updateUserProfile = (updatedData) => {
    setDb(prev => ({ ...prev, users: prev.users.map(u => u.id === user.id ? { ...u, ...updatedData } : u) }));
    setUser(prev => ({ ...prev, ...updatedData }));
    logActivity(user.orgId, `${user.name} updated their profile`);
    showToast('Profile saved!');
  };

  const addMemberToOrg = (orgId, memberData) => {
    const newUser = { id: `u${Date.now()}`, orgId, role: 'MEMBER', ...memberData, progress: 0, avatar: `https://ui-avatars.com/api/?name=${memberData.name?.replace(/ /g, '+')}&background=10b981&color=fff`, password: 'password', status: 'offline', github: '', bio: '' };
    setDb(prev => ({ ...prev, users: [...prev.users, newUser] }));
    logActivity(orgId, `${memberData.name} was added to the organization`);
    showToast(`${memberData.name} added!`);
  };

  const removeMember = (memberId) => {
    const member = db.users.find(u => u.id === memberId);
    setDb(prev => ({ ...prev, users: prev.users.filter(u => u.id !== memberId) }));
    if (member) {
      logActivity(member.orgId, `${member.name} was removed`);
      showToast(`${member.name} removed`, 'warning');
    }
  };

  const addOrg = (orgData) => {
    const newOrg = { id: `org_${Date.now()}`, stats: { velocity: 100, growth: 100, activeProjects: 0 }, logo: `https://ui-avatars.com/api/?name=${orgData.name?.replace(/ /g, '+')}&background=10b981&color=fff`, createdAt: new Date().toLocaleDateString(), ...orgData };
    setDb(prev => ({ ...prev, organizations: [...prev.organizations, newOrg] }));
    showToast(`${orgData.name} provisioned!`);
  };

  const removeOrg = (orgId) => {
    const org = db.organizations.find(o => o.id === orgId);
    setDb(prev => ({ ...prev, organizations: prev.organizations.filter(o => o.id !== orgId), users: prev.users.filter(u => u.orgId !== orgId), notes: prev.notes.filter(n => n.orgId !== orgId), activities: prev.activities.filter(a => a.orgId !== orgId) }));
    showToast(`${org?.name || 'Organization'} decommissioned`, 'warning');
  };

  const updateProgress = (progressVal) => {
    updateUserProfile({ progress: progressVal });
  };

  // Notes
  const addNote = (orgId, content) => {
    const newNote = { id: Date.now(), orgId, author: user.name, content, date: new Date().toLocaleDateString() };
    setDb(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
    logActivity(orgId, `${user.name} posted a notice`);
    showToast('Notice posted!');
  };
  const removeNote = (noteId) => {
    setDb(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== noteId) }));
    showToast('Notice removed', 'warning');
  };
  const getOrgNotes = (orgId) => (db.notes || []).filter(n => n.orgId === orgId);

  // Tasks / Kanban
  const addTask = (orgId, title, assignee, priority) => {
    const task = { id: Date.now(), orgId, title, assignee, priority, status: 'todo', createdAt: new Date().toLocaleDateString() };
    setDb(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
    logActivity(orgId, `Task "${title}" created`);
    showToast('Task created!');
  };
  const updateTaskStatus = (taskId, newStatus) => {
    setDb(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t) }));
  };
  const removeTask = (taskId) => {
    setDb(prev => ({ ...prev, tasks: (prev.tasks || []).filter(t => t.id !== taskId) }));
  };

  const getOrgTasks = (orgId) => (db.tasks || []).filter(t => t.orgId === orgId);

  const getOrgActivities = (orgId) => (db.activities || []).filter(a => a.orgId === orgId);

  const getOrgDetails = (orgId) => (db.organizations || []).find(o => o.id === orgId) || { name: 'Unknown', stats: { velocity: 0 } };

  const getOrgMembers = (orgId) => (db.users || []).filter(u => u.orgId === orgId && u.role === 'MEMBER');

  const getAllOrgs = () => (db.organizations || []);

  const clearStorage = () => {
    localStorage.removeItem('corpSphereDB');
    setDb({ ...EMPTY_DB });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, getOrgDetails, getOrgMembers, getAllOrgs, updateUserProfile, db, toast,
      addMemberToOrg, removeMember, addOrg, removeOrg, updateProgress,
      signupAdmin, signupOrgOwner, signupMember, addNote, removeNote, getOrgNotes,
      addTask, updateTaskStatus, removeTask, getOrgTasks, getOrgActivities, showToast, clearStorage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
