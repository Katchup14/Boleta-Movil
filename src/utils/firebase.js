// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Importa Firestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfMzeMHrmEWG-DHyMXMHjcNpks2wzk0Wo",
  authDomain: "boleta-movil-580ee.firebaseapp.com",
  projectId: "boleta-movil-580ee",
  storageBucket: "boleta-movil-580ee.firebasestorage.app",
  messagingSenderId: "284359434021",
  appId: "1:284359434021:web:ff5886921f7618469d44cc",
  measurementId: "G-C6DPL3H6EB"
};

const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app); // Obtén la instancia de Firestore

export {app, db }; // Exporta la instancia de Firestore