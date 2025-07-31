// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAp5ihWxHzyWDCZLd1yYGO9NIC_2RT9pq4",
  authDomain: "pet-sos-web.firebaseapp.com",
  projectId: "pet-sos-web",
  storageBucket: "pet-sos-web.firebasestorage.app",
  messagingSenderId: "468811225879",
  appId: "1:468811225879:web:c3f892e9983926b3e4b552",
  measurementId: "G-THQC3L5T4Z",
};

const app = initializeApp(firebaseConfig);
//this was imp
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

 const analytics = getAnalytics(app);

export { auth, provider };
