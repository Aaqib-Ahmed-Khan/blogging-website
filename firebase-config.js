import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyCQzLhhMvCOJpqQR-63pRT-8XxbJybWPfE",
    authDomain: "blogging-app-bbca7.firebaseapp.com",
    databaseURL: "https://blogging-app-bbca7-default-rtdb.firebaseio.com",
    projectId: "blogging-app-bbca7",
    storageBucket: "blogging-app-bbca7.appspot.com",
    messagingSenderId: "108057234479",
    appId: "1:108057234479:web:08c26e8897c68fa3bacada",
    measurementId: "G-RFRJF16XZ9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
