import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";
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

const TARGET_ORG = "org_1776359355655";

async function fixData() {
    console.log("Fixing Firebase data...");

    // 1. Seed Activities
    console.log("Seeding Activities...");
    await setDoc(doc(db, 'activities', Date.now().toString()), {
        orgId: TARGET_ORG,
        user: "System",
        action: "Platform data restored",
        time: new Date().toLocaleTimeString(),
        timestamp: Date.now()
    });

    // 2. Seed Notes
    console.log("Seeding Notes...");
    await setDoc(doc(db, 'notes', (Date.now() + 1).toString()), {
        orgId: TARGET_ORG,
        author: "Automated System",
        content: "We've restored the organization notice board infrastructure after a minor data wipe. Please continue your work securely.",
        date: new Date().toLocaleDateString(),
        stamp: Date.now() + 1
    });

    console.log("Data fixed.");
    process.exit(0);
}

fixData();
