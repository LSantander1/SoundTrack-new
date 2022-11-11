import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
 
const firebaseConfig = {
  apiKey: "AIzaSyCspfv-IQyzGdWgW4vUQNF8mwziFz3ucSs",
  authDomain: "soundtrack-dev.firebaseapp.com",
  projectId: "soundtrack-dev",
  storageBucket: "soundtrack-dev.appspot.com",
  messagingSenderId: "1065133225416",
  appId: "1:1065133225416:web:cf85c1623a95187e0f7cfd",
  measurementId: "G-YLG01V2R9E"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)