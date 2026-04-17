import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve('.env');
const envStr = fs.readFileSync(envPath, 'utf8');
const env = {};
envStr.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key) env[key.trim()] = val.join('=').trim();
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collections = ['users', 'organizations', 'notes', 'activities', 'tasks'];

async function inspectData() {
    console.log("Inspecting Firebase data structure...");
    let orgIds = [];
    
    // Read Organizations
    console.log("--- Organizations ---");
    const orgSnap = await getDocs(collection(db, 'organizations'));
    orgSnap.forEach(doc => {
        orgIds.push(doc.id);
        console.log(`Org: ${doc.id} - ${doc.data().name}`);
    });

    // Read Users
    console.log("--- Users ---");
    const userSnap = await getDocs(collection(db, 'users'));
    userSnap.forEach(doc => {
        const d = doc.data();
        console.log(`User: ${doc.id} | Role: ${d.role} | OrgId: ${d.orgId || 'None'} | ValidOrgRef: ${orgIds.includes(d.orgId)}`);
    });

    process.exit(0);
}

inspectData();
