import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAMifcZweS5BG3BfMQpjbbDP-pkF9cow2s",
  authDomain: "shepherd-app-382114.firebaseapp.com",
  projectId: "shepherd-app-382114",
  storageBucket: "shepherd-app-382114.appspot.com",
  messagingSenderId: "675537393578",
  appId: "1:675537393578:web:9a57af7df8fec9f8293dd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);