import { supaBase } from "./subabase.js";


async function checkinUser() {
    const { data: { session }, error } = await supaBase.auth.getSession();
    if (error || !session) {

        // iziToast Error Alert
        iziToast.error({
            close: false,
            pauseOnHover: false,
            title: 'Authentication Required',
            message: 'Please sign in to access this page.',
            position: 'center',
            overlay: true,
            timeout: 2000, 
            progressBar: true,
           
            onClosing: function () {
                window.location.href = "https://rafay-1431.github.io/student-portal/";
            }
        });

        return;
    }
}
checkinUser();

let logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
    
    iziToast.question({
        timeout: false,
        close: false,
        overlay: true,
        displayMode: 'once',
        id: 'question',
        zindex: 999,
        title: 'Logout?',
        message: 'Are you sure you want to logout?',
        position: 'center',
        buttons: [
            // Pehla button: Yes
            ['<button><b>YES</b></button>', async function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                const { error } = await supaBase.auth.signOut({ scope: 'local' });
                window.location.href = "https://rafay-1431.github.io/student-portal/"
                if (error) {
                    iziToast.error({ title: 'Error', message: 'Logout nahi ho saka!' });
                }
            }, true],
            // Doosra button: No
            ['<button>NO</button>', function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            }],
        ]
    });
});


async function getUserData() {
    const { data: { user } } = await supaBase.auth.getUser();
    if (user) {
        const avatar_Url = user.user_metadata?.avatar_url;
        const userName = user.user_metadata?.name;

        const sidebarName = document.getElementById('sidebar-name');
        const sidebarAvatar = document.getElementById('sidebar-avatar');
        const postAvatar = document.getElementById('create-avatar');
        const usernameConta = document.getElementById('nav-username');
        const avatarCont = document.getElementById('nav-avatar');

        if (usernameConta) usernameConta.innerText = userName;
        if (avatarCont) avatarCont.src = avatar_Url || 'default-avatarCont.png';
        if (postAvatar) postAvatar.src = avatar_Url || 'default-avatarCont.png';
        if (sidebarName) sidebarName.innerText = userName;
        if (sidebarAvatar) sidebarAvatar.src = avatar_Url || 'default-avatarCont.png';
    }
}

let selectedFile = null;

const imageUpload = document.getElementById('image-upload');
const imagePreiviewContainor = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImgBtn = document.getElementById('remove-image-btn');

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        selectedFile = file;
        const previewUrl = URL.createObjectURL(file);
        imagePreview.src = previewUrl;
        imagePreiviewContainor.style.display = 'block';
    }
});

removeImgBtn.addEventListener('click', () => {
    selectedFile = null;
    imageUpload.value = "";
    imagePreiviewContainor.style.display = "none";
    imagePreview.src = "";
})
const sumbitPostBtn = document.getElementById('submit-post-btn');
sumbitPostBtn.addEventListener('click', async () => {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const category = document.getElementById('post-category').value;


    if (!title || !content) {
        iziToast.warning({ title: 'Hey!', message: 'Please fill in the title and content.' });
        return;
    }

    try {
        const { data: { user } } = await supaBase.auth.getUser();
        let imageUrl = null;

        if (selectedFile) {
            const fileName = `${Date.now()}_${selectedFile.name}`
            const { data: uploadData, error: uploadError } = await supaBase
                .storage
                .from('post-images')
                .upload(fileName, selectedFile);

            if (uploadError) throw uploadError;


            const { data: { publicUrl } } = supaBase
                .storage
                .from('post-images')
                .getPublicUrl(fileName)
            imageUrl = publicUrl;
        }

        const { data, error: insertError } = await supaBase
            .from('posts')
            .insert([
                {
                    user_id: user.id,
                    title: title,
                    content: content,
                    category: category,
                    image_url: imageUrl,
                    created_at: new Date().toISOString()
                }
            ]);
        if (insertError) throw insertError;

        // Success Alert aur Form Reset
        iziToast.success({ title: 'Success', message: 'Post created successfully!' });
        resetForm();
    }
    catch (error) {
        console.error(error);
        iziToast.error({ title: 'Error', message: 'Something went wrong while posting.' });
    }
})
function resetForm() {
    document.getElementById('post-title').value = "";
    document.getElementById('post-content').value = "";
    document.getElementById('post-category').value = "query";
    selectedFile = null;
    imageUpload.value = "";
    imagePreiviewContainor.style.display = 'none';
    imagePreview.src = "";
}









let activeFilter = 'all';

async function renderpost() {
    const postFeed = document.getElementById('posts-feed');
    postFeed.innerHTML = '<div class="loading-spinner">Loading posts...</div>';

    try {
        const { data: posts, error} = await supaBase
            .from('posts')
            .select(`
                id,
                title,
                content,
                category,
                image_url,
                created_at,
                user_id (
                    name,
                    avatar_url
                )
            `)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching data:', error.message);
            postFeed.innerHTML = `<div class="error-msg">Error: ${error.message}</div>`;
            return;
        } 
        if(!posts || posts.length === 0){
            postFeed.innerHTML = '<div class="no-posts">No posts available yet.</div>';
            return;
        }

        postFeed.innerHTML = ``;

        posts.forEach(post => {
            const profile = post.user_id ;

            const postCard = document.createElement('div');
           postCard.classList.add('post-card'); // dashboard.css ke mutabiq styling class

            postCard.innerHTML = `
                <div class="post-header">
                    <img class="nav-avatar" src="${profile.avatar_url }" alt="avatar" />
                    <div class="post-user-info">
                        <span class="sidebar-name">${profile.name}</span>
                        <small class="post-date">${new Date(post.created_at).toLocaleDateString()}</small>
                    </div>
                    <span class="post-category-tag">${post.category || 'general'}</span>
                </div>
                
                <div class="post-body">
                    <h3 class="post-feed-title">${post.title}</h3>
                    <p class="post-feed-content">${post.content}</p>
                    ${post.image_url ? `<img src="${post.image_url}" class="post-attached-image" alt="post image" />` : ''}
                </div>
            `;

            postFeed.appendChild(postCard);
        });

    } catch (err) {
        console.error('Unexpected error:', err);
        postFeed.innerHTML = '<div class="error-msg">Something went wrong!</div>';
    }
}



// 7. Sidebar Filter Buttons Click Logic
// ...Aur is naye wale code ko paste kar do!
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        const selectedFilter = e.target.getAttribute('data-filter');
        const postCards = document.querySelectorAll('#posts-feed .post-card');
        
        postCards.forEach(card => {
            // Card ke andar se category tag text nikaalo
            const categoryTag = card.querySelector('.post-category-tag');
            if (!categoryTag) return;
            
            const postCategory = categoryTag.textContent.trim().toLowerCase();
            if (selectedFilter === 'all' || postCategory === selectedFilter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});




getUserData();
renderpost();