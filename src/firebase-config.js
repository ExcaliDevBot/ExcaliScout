import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCS_UutaEdL1O5fcI0r4qUmvPX6t2PadIg",
    authDomain: "excaliburscouting-6738e.firebaseapp.com",
    projectId: "excaliburscouting-6738e",
    storageBucket: "excaliburscouting-6738e",
    messagingSenderId: "1006512770349",
    appId: "1:1006512770349:web:6d457e11718f00237b17a4",
    measurementId: "G-CYR4LETD6T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };