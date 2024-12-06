import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwYnzJsdm17M84vQxV8UYsORnPc7Aq2hM",
  authDomain: "partner-visa-app.firebaseapp.com",
  projectId: "partner-visa-app",
  storageBucket: "partner-visa-app.firebasestorage.app",
  messagingSenderId: "929854927553",
  appId: "1:929854927553:web:f160253cd6afea0dc49a40",
  measurementId: "G-1W3CS92M86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, analytics, auth, storage, db }; 