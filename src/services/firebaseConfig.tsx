import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore,collection, addDoc } from "firebase/firestore";

const{getReactNativePersistence} = require("firebase/auth") as any

const firebaseConfig = {
  apiKey: "AIzaSyDwHhwm80pVQtdwNTE4MlUqK5D5SATp5dk",
  authDomain: "dodonotas.firebaseapp.com",
  projectId: "dodonotas",
  storageBucket: "dodonotas.firebasestorage.app",
  messagingSenderId: "853480095058",
  appId: "1:853480095058:web:15a59a19ea321e4ccfce8b",
  measurementId: "G-3D2TLKXWBD"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication
export const auth = initializeAuth(app,{
  persistence:getReactNativePersistence(AsyncStorage)
});

// Config Firestore
const db = getFirestore(app)

export {db,collection,addDoc}
