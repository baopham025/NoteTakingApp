import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// UPDATE THIS WITH YOUR PROJETC SPECIFIC
var firebaseConfig = {
  apiKey: "AIzaSyDkw3nUcEoZL_voPEjwEftlJcZK5D6WQ2A",
  authDomain: "app-final-project-a9728.firebaseapp.com",
  projectId: "app-final-project-a9728",
  storageBucket: "app-final-project-a9728.appspot.com",
  messagingSenderId: "299962594727",
  appId: "1:299962594727:web:21c1c06ed257f39a543282",
  measurementId: "G-41D53GK5HQ",
};

var app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig); // If no app exists.
} else {
  const APPS = getApps();
  app = APPS[0]; // Choose the first app from the array.
}

export const db = getDatabase(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
