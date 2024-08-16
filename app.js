import { auth, db, storage } from './firebase-config.js';
import { getDownloadURL, ref } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';
import { collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

// Check for user authentication
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'signin.html';
    } else {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('home-container').style.display = 'block';

        // Set user name and email
        document.getElementById('user-name').textContent = user.displayName || 'User Name';
        document.getElementById('user-email').textContent = user.email || 'user@example.com';

        // Set profile picture URL
        const profilePicRef = ref(storage, `profile_pictures/${user.uid}`);
        getDownloadURL(profilePicRef).then((url) => {
            document.getElementById('profilePicture').src = url;
        }).catch((error) => {
            console.error('Error fetching profile picture:', error);
        });
    }
});

// Add blog event listener
document.getElementById('add-blog').addEventListener('click', async () => {
    const blogContent = document.getElementById('blog-content').value;

    if (blogContent.trim() === '') {
        alert('Please write something before adding a blog.');
        return;
    }

    try {
        const user = auth.currentUser;
        if (user) {
            // Add blog to Firestore
            await addDoc(collection(db, 'users', user.uid, 'blogs'), {
                content: blogContent,
                timestamp: new Date()
            });

            // Show popup message
            alert('Blog added successfully!');

            // Optionally, you could reload the blogs or add logic to display the new blog on the page
            // displayBlogs(); // Call function to update the list of blogs
        }
    } catch (error) {
        console.error('Error adding blog:', error);
    }
});

// Display blogs function
async function displayBlogs() {
    const user = auth.currentUser;
    if (user) {
        try {
            const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'blogs'));
            const blogContainer = document.getElementById('blog-container');

            if (blogContainer) {
                blogContainer.innerHTML = ''; // Clear existing blogs

                querySnapshot.forEach((doc) => {
                    const blog = doc.data();
                    const blogDiv = document.createElement('div');
                    blogDiv.className = 'blog-item';
                    blogDiv.textContent = blog.content;
                    blogContainer.appendChild(blogDiv);
                });
            } else {
                console.error('Blog container element not found.');
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    }
}

// Add event listener for "My Blogs" button
document.getElementById('my-blogs').addEventListener('click', () => {
    window.location.href = 'myblogs.html'; // Redirect to My Blogs page
});

// Sign out event listener
document.getElementById('sign-out').addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'signin.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
});
