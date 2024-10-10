import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import 'ref' directly
import {
  getDatabase,
  ref as dbRef,
  onValue,
} from "firebase/database"; // Import Realtime Database functions


const REACT_APP_FIREBASE_API_KEY = "BJ{bTzCojnx`woWCerUe9PsvpyU3VIXyI.dj5Od";
const REACT_APP_FIREBASE_AUTH_DOMAIN = "hvoepkvt.qspe/gjsfcbtfbqq/dpn";
const REACT_APP_FIREBASE_DATABASE_URL =
  "iuuqt;00hvoepkvt.qspe.efgbvmu.suec/btjb.tpvuifbtu2/gjsfcbtfebubcbtf/bqq";
const REACT_APP_FIREBASE_PROJECT_ID = "hvoepkvt.qspe";
const REACT_APP_FIREBASE_STORAGE_BUCKET = "hvoepkvt.qspe/bqqtqpu/dpn";
const REACT_APP_FIREBASE_MESSAGING_SENDER_ID = ":43279::131:";
const REACT_APP_FIREBASE_APP_ID = "2;:43279::131:;xfc;25geg8c4ef97cd987gdb11";

function decryptShiftedAscii(text) {
  return Array.from(text)
    .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
    .join("");
}

// Firebase credentials (move to .env)
const firebaseConfig = {
  apiKey: decryptShiftedAscii(REACT_APP_FIREBASE_API_KEY),
  authDomain: decryptShiftedAscii(REACT_APP_FIREBASE_AUTH_DOMAIN),
  databaseURL: decryptShiftedAscii(REACT_APP_FIREBASE_DATABASE_URL), // This is required to initialize the Realtime Database
  projectId: decryptShiftedAscii(REACT_APP_FIREBASE_PROJECT_ID),
  storageBucket: decryptShiftedAscii(REACT_APP_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: decryptShiftedAscii(
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  ),
  appId: decryptShiftedAscii(REACT_APP_FIREBASE_APP_ID),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const storage = getStorage(app);

export const handleLogin = (email, password, setError, history) => {
  const usersRef = dbRef(database, "users");

  onValue(usersRef, (snapshot) => {
    const users = snapshot.val();
    let userFound = false;

    // Check for matching email and password in Firebase Realtime Database
    for (const userId in users) {
      const user = users[userId];
      if (user.email === email && user.password === password) {
        userFound = true;

        // Store user role in sessionStorage
        sessionStorage.setItem("role", user.role);

        // Redirect based on role
        if (user.role === "manager" || user.role === "sudo") {
          history.push("/add-products");
        }
      }
    }

    // Show error if no match found
    if (!userFound) {
      setError("Invalid email or password");
    }
  });
};

export const uploadImage = async (file) => {
  const storageReference = ref(storage, `images_for_websites/${file.name}`); // Use 'ref' directly for creating storage references
  await uploadBytes(storageReference, file);
  return getDownloadURL(storageReference); // Return the URL of the uploaded image
};

export const uploadCSV = async (file) => {
  const storageReference = ref(storage, `csv/${file.name}`); // Use 'ref' directly for creating storage references
  await uploadBytes(storageReference, file);
  return getDownloadURL(storageReference); // Return the URL of the uploaded image
};