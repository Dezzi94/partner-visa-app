import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwYnzJsdm17M84vQxV8UYsORnPc7Aq2hM",
  authDomain: "partner-visa-app.firebaseapp.com",
  projectId: "partner-visa-app",
  storageBucket: "partner-visa-app.appspot.com",
  messagingSenderId: "929854927553",
  appId: "1:929854927553:web:f160253cd6afea0dc49a40",
  measurementId: "G-1W3CS92M86",
  databaseURL: "https://partner-visa-app-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize services
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);
const db = getFirestore(app);

export { app, analytics, auth, storage, database, db }; 