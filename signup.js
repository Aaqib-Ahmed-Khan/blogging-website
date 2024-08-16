import { auth, db, storage } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const displayName = document.getElementById('displayName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const profilePicture = document.getElementById('profilePicture').files[0];

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Upload profile picture if selected
        if (profilePicture) {
            const profilePicRef = ref(storage, `profile_pictures/${user.uid}`);
            await uploadBytes(profilePicRef, profilePicture);
        }

        // Update user profile
        await updateProfile(user, {
            displayName: displayName
        });

        // Save user info to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            displayName: displayName,
            email: email
        });

        window.location.href = 'blog.html';
    } catch (error) {
        console.error('Error during sign-up:', error);
        alert('Failed to sign up.');
    }
});
