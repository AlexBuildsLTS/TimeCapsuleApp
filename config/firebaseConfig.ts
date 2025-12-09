import { initializeApp } from 'firebase/app';
import { initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2SD_MxUAl1_ndxVTHcIeZHvHMDzM-t4Q",
  authDomain: "timecapsuleapp-d81e9.firebaseapp.com",
  projectId: "timecapsuleapp-d81e9",
  storageBucket: "timecapsuleapp-d81e9.firebasestorage.app",
  messagingSenderId: "129693062825",
  appId: "1:129693062825:web:acfa93a79a9dd2dc7efbb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth: Auth = initializeAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { auth, db, storage, functions };
export default app;
