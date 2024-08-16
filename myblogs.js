import { auth, db } from './firebase-config.js';
import { collection, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

// Check for user authentication and redirect if not authenticated
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = 'signin.html'; // Redirect to Sign In page
    } else {
        // Display blogs if authenticated
        displayBlogs();
    }
});

// Back to Home button event listener
document.getElementById('back-to-home').addEventListener('click', () => {
    window.location.href = 'blog.html'; // Redirect to Home page
});

// Display blogs function
async function displayBlogs() {
    const user = auth.currentUser;
    if (user) {
        try {
            // Fetch blogs from Firestore
            const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'blogs'));
            const blogContainer = document.getElementById('blog-container');

            if (!blogContainer) {
                console.error('Blog container element not found.');
                return;
            }

            blogContainer.innerHTML = ''; // Clear existing blogs

            if (querySnapshot.empty) {
                blogContainer.innerHTML = '<p>No blogs found.</p>';
                return;
            }

            querySnapshot.forEach((docSnapshot) => {
                const blog = docSnapshot.data();
                const blogDiv = document.createElement('div');
                blogDiv.className = 'blog-item';

                const blogContent = document.createElement('p');
                blogContent.textContent = blog.content;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', async () => {
                    try {
                        await deleteDoc(doc(db, 'users', user.uid, 'blogs', docSnapshot.id));
                        alert('Blog deleted successfully!');
                        displayBlogs(); // Refresh the blog list
                    } catch (error) {
                        console.error('Error deleting blog:', error);
                    }
                });

                blogDiv.appendChild(blogContent);
                blogDiv.appendChild(deleteButton);
                blogContainer.appendChild(blogDiv);
            });
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    } else {
        console.error('No user is currently authenticated.');
        window.location.href = 'signin.html'; // Redirect to Sign In page
    }
}
