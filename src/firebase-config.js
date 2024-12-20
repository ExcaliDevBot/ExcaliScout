import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCS_UutaEdL1O5fcI0r4qUmvPX6t2PadIg",
    authDomain: "AIzaSyCS_UutaEdL1O5fcI0r4qUmvPX6t2PadIg",
    projectId: "excaliburscouting-6738e",
    storageBucket: "excaliburscouting-6738e.firebasestorage.app",
    messagingSenderId: "1006512770349",
    appId: "1:1006512770349:web:6d457e11718f00237b17a4",
    measurementId: "G-CYR4LETD6T"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app); // Initialize Realtime Database

export { db };
