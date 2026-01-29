import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdK7oZI8JHA4Hs73_ZRmNoHT3-REPlwfo",
  authDomain: "overflow-cc7c4.firebaseapp.com",
  projectId: "overflow-cc7c4",
  storageBucket: "overflow-cc7c4.firebasestorage.app",
  messagingSenderId: "256147673016",
  appId: "1:256147673016:web:7f75abf414f47c5839c94d",
  measurementId: "G-V7GGRBW3H3"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const githubprovider = new GithubAuthProvider();

export default app;
