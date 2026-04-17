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

async function checkCollections() {
    console.log("Checking Firebase collections...");
    for (const c of collections) {
        try {
            const querySnapshot = await getDocs(collection(db, c));
            console.log(`Collection '${c}': ${querySnapshot.size} documents found.`);
            if (querySnapshot.size === 0) {
                 console.log(`-> ⚠️ Collection '${c}' is EMPTY OR MISSING.`);
            }
        } catch (error) {
            console.error(`Collection '${c}': ERROR reading - ${error.message}`);
        }
    }
    process.exit(0);
}

checkCollections();
