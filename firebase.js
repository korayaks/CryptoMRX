// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTyrm0uPCjVwtgzqD1M-qYT9POZEicmLU",
  authDomain: "fir-auth-8a309.firebaseapp.com",
  projectId: "fir-auth-8a309",
  storageBucket: "fir-auth-8a309.appspot.com",
  messagingSenderId: "494474763867",
  appId: "1:494474763867:web:a5e8e40e6985d66371e97e"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { auth };