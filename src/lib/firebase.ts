import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0931219066",
  appId: "1:346465363462:web:e39a01b082cf2c38dc8587",
  apiKey: "AIzaSyDV9LO9GMHg28mgeWjNEbraMZG0fpagm10",
  authDomain: "gen-lang-client-0931219066.firebaseapp.com",
  storageBucket: "gen-lang-client-0931219066.firebasestorage.app",
  messagingSenderId: "346465363462"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
let db: any;
try {
  db = getFirestore(app, "ai-studio-remixoaicccareer-d01a87a8-80f3-4131-bded-a3ea1c731873");
} catch (e) {
  db = getFirestore(app);
}

export { app, auth, db };
