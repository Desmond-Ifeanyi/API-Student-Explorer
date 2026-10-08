const API_URL = "https://jsonplaceholder.typicode.com"

const usersContainer = document.querySelector('#users')
const statusTxt = document.querySelector('#status')
const studentCount = document.querySelector('#studentCount')
const toast = document.querySelector('#toast')
const postsList = document.querySelector('#postsList')
const commentsList = document.querySelector('#commentsList')
const postCount = document.querySelector('#postCount')
const commentCount = document.querySelector('#commentCount')
const postsTitle = document.querySelector('#postsTitle')
const commentsTitle = document.querySelector('#commentsTitle')
const searchInput = document.querySelector('#searchInput')

let users = []
let selectedUserId = null
let selectedPostId = null

function showToast(msg) {
    toast.textContent = msg
    toast.classList.add("show")
    setTimeout(() => toast.classList.remove("show"), 2200)
}

function getInitials(name) {
    return name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
}


// Get users
loadUsers()
// Using .then()
async function loadUsers() {
    try {
        statusTxt.textContent = "Loading students"
        usersContainer.classList.add("loading")

        const response = await fetch(`${API_URL}/users`)

        if(!response.ok) 
            throw new Error(`Request failed: ${response.status}`)
        
        users = await response.json()
        studentCount.textContent = users.length
        renderUsers(users)
        statusTxt.textContent = `${users.length} students loaded`

    } catch (error) {
        statusTxt.textContent = "Unable to load students."
        showToast("Could not load students.")
        console.error(error);
    }finally {
        usersContainer.classList.remove("loading")
    }
}

function loadPosts(userId) {
    selectedUserId = userId
    postsList.classList.add('loading')
    postsList.innerHTML = `
        <div class="empty-state">
            <div>⏳</div>
            <strong>Loading posts...</strong>
        </div>
    `
    commentsList.innerHTML = `
        <div class="empty-state">
            <div>💬</div>
            <strong>No post selected</strong>
            <p>Choose a post to load comments.</p>
        </div>
    `
    commentCount.innerHTML = "—"

    const user = users.find(item => item.id === userId)
    postsTitle.textContent = user ? `Posts by ${user.name}` : 'Posts'

    // fetch posts
    fetch(`${API_URL}/posts?userId=${userId}`)
    .then(res => {
        if(!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
    })
    .then(posts => {
        postCount.textContent = posts.length
        renderPosts(posts)
        showToast(`${posts.length} posts loaded`)
    })
    .catch(error => {
        postsList.innerHTML = `
            <div class="empty-state">
                <strong>Failed to load posts</strong>
                <p>Please try again.</p>
            </div>`;
        console.error(error);
    })
    .finally(() => {
        postsList.classList.remove('loading')
    })
    
}

function loadComments(postId) {
    selectedPostId = postId
    commentsList.classList.add('loading')
    commentsList.innerHTML = `
        <div class="empty-state">
            <div>⏳</div>
            <strong>Loading comments...</strong>
        </div>
    `
    fetch(`${API_URL}/comments?postId=${postId}`)
    .then(res => {
        if(!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
    })
    .then(comments => {
        commentCount.textContent = comments.length
        commentsTitle.textContent = `${comments.length} comments`
        renderComments(comments)
        showToast(`${comments.length} comments loaded`)

        document.querySelectorAll('.post-card').forEach(card => {
            card.classList.toggle("selected", Number(card.dataset.postId) === postId)
        })
    })
    .catch(error => {
        commentsList.innerHTML = `
            <div class="empty-state">
                <strong>Failed to load comments</strong>
            </div>
        `
        console.error(error);
    })
    .finally(() => {
        commentsList.classList.remove('loading')
    })
}

// Utilities
function renderUsers(list) {
    usersContainer.innerHTML = ''

    list.forEach(user => {
        const card = document.createElement("article");
        card.className = 'card';
        card.innerHTML = `
            <div class="student-top">
                <div class="avatar">${getInitials(user.name)}</div>
            </div>
            <div>
                <h4>${user.name}</h4>
                <p>${user.email}</p>
            </div>
            <button class="view-btn" data-user-id="${user.id}">View Posts →</button>
        `;
        usersContainer.appendChild(card)
    })
}

function renderPosts(posts) {
    postsList.innerHTML = '';

    if(!posts.length) {
        postsList.innerHTML = `
            <div class="empty-state">
                <div>☷</div>
                <strong>No student selected</strong>
                <p>Choose a student to load their posts.</p>
            </div>
        `
        return;
    }

    posts.forEach(post => {
        const article = document.createElement("article")
        article.className = 'post-card'
        article.dataset.postId = post.id
        article.innerHTML = `
            <h4>${post.title}</h4>
            <p>${post.body}</p>
        `
        postsList.appendChild(article)
    })
}

function renderComments(comments) {
    commentsList.innerHTML = ""

    comments.forEach(comment => {
        const article = document.createElement('article')
        article.className = 'comment'
        article.innerHTML = `
            <strong>${comment.name}</strong>
            <p>${comment.body}</p>
        `
        commentsList.appendChild(article)
    })
}

// Events
const menuBtn = document.querySelector('#menuBtn');
const menuIcon = document.querySelector('#menuIcon');
const sidebar = document.querySelector('.sidebar');

menuBtn.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);

 
  if (isOpen) {
    menuIcon.className = 'ri-close-large-line';
  } else {
    menuIcon.className = 'ri-menu-line';
  }
});

usersContainer.addEventListener('click', e => {
    const btn = e.target.closest('[data-user-id]')
    if(!btn) return

    loadPosts(Number(btn.dataset.userId))
})

postsList.addEventListener('click', e => {
    const card = e.target.closest('[data-post-id')
    if(!card) return

    loadComments(Number(card.dataset.postId))
})

// Search
searchInput.addEventListener("input", e => {
    const query = e.target.value.toLowerCase().trim();

    const filtered = users.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )

    renderUsers(filtered)
})

// =====STUDENT ONLY============

const navitems = document.querySelectorAll('.nav-item');
const studentbtn = document.getElementById('studentbtn')
const student = document.querySelectorAll('#students')
const post = document.querySelector('#postbtn')
const mainview = document.querySelector('.main')


navitems.forEach(link => {
  link.addEventListener('click', function(e) {
    
    e.preventDefault();

    const target = this.dataset.target;


    navitems.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');

    if (target === 'students') {
      mainview.classList.add('studfull-page-mode');
    } else {
      mainview.classList.remove('studfull-page-mode');
    }
  });
});






// ======POST BUTTON==============
const commentsModal = document.querySelector('#commentsModal');
const closeModalBtn = document.querySelector('#closeModalBtn');
const modalCommentsList = document.querySelector('#modalCommentsList');
const modalCommentsTitle = document.querySelector('#modalCommentsTitle');

// 1. Navigation Switching
navitems.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.dataset.target || this.getAttribute('href').replace('#', '');

    navitems.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');

    // Reset modes
    mainview.classList.remove('studfull-page-mode', 'postfull-page-mode');

    if (target === 'students') {
      mainview.classList.add('studfull-page-mode');
    } else if (target === 'posts') {
      mainview.classList.add('postfull-page-mode');
      // If no student post is selected, load all posts
      if (!postsList.querySelectorAll('.post-card').length) {
        loadAllPosts();
      }
    }
  });
});

function loadAllPosts() {
  postsList.classList.add('loading');
  postsTitle.textContent = "All Posts";
  
  fetch(`${API_URL}/posts`)
    .then(res => res.json())
    .then(posts => {
      postCount.textContent = posts.length;
      renderPosts(posts);
      showToast(`${posts.length} posts loaded`);
    })
    .catch(err => console.error(err))
    .finally(() => postsList.classList.remove('loading'));
}

// 2. Render Posts (Preserves original structure, appends hidden button)
function renderPosts(posts) {
  postsList.innerHTML = '';

  if (!posts.length) {
    postsList.innerHTML = `
      <div class="empty-state">
        <div>☷</div>
        <strong>No posts found</strong>
      </div>`;
    return;
  }

  posts.forEach(post => {
    const article = document.createElement("article");
    article.className = 'post-card';
    article.dataset.postId = post.id;
    article.innerHTML = `
      <h4>${post.title}</h4>
      <p>${post.body}</p>
      <button class="view-comments-btn" data-post-id="${post.id}">View Comments →</button>
    `;
    postsList.appendChild(article);
  });
}

// 3. Separate Click Interactions for Dashboard vs. Posts Page
postsList.addEventListener('click', e => {
  const commentBtn = e.target.closest('.view-comments-btn');
  
  // A) Clicked "View Comments" button on Posts Page -> Open Modal
  if (commentBtn) {
    e.stopPropagation();
    const postId = Number(commentBtn.dataset.postId);
    openCommentsModal(postId);
    return;
  }

  // B) Clicked post card on Dashboard -> Load comments into bottom dashboard panel
  const card = e.target.closest('[data-post-id]');
  if (card && !mainview.classList.contains('postfull-page-mode')) {
    loadComments(Number(card.dataset.postId));
  }
});
// Open Modal & Load Comments for Selected Post
function openCommentsModal(postId) {
  modalCommentsList.innerHTML = `
    <div class="empty-state">
      <div>⏳</div>
      <strong>Loading comments...</strong>
    </div>`;
  modalCommentsTitle.textContent = `Comments for Post #${postId}`;
  commentsModal.classList.add('active');

  fetch(`${API_URL}/comments?postId=${postId}`)
    .then(res => {
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return res.json();
    })
    .then(comments => {
      renderModalComments(comments);
    })
    .catch(error => {
      modalCommentsList.innerHTML = `
        <div class="empty-state">
          <strong>Failed to load comments</strong>
          <p>Please try again.</p>
        </div>`;
      console.error(error);
    });
}

// Render Comments inside the Modal
function renderModalComments(comments) {
  modalCommentsList.innerHTML = '';

  if (!comments.length) {
    modalCommentsList.innerHTML = `
      <div class="empty-state">
        <strong>No comments found</strong>
      </div>`;
    return;
  }

  comments.forEach(comment => {
    const article = document.createElement('article');
    article.className = 'comment';
    article.innerHTML = `
      <strong>${comment.name}</strong>
      <p>${comment.body}</p>
    `;
    modalCommentsList.appendChild(article);
  });
}

// Event Listener for "View Comments" Buttons
postsList.addEventListener('click', e => {
  const commentBtn = e.target.closest('.view-comments-btn');
  if (!commentBtn) return;

  const postId = Number(commentBtn.dataset.postId);
  openCommentsModal(postId);
});

// Close Modal Controls
closeModalBtn.addEventListener('click', () => {
  commentsModal.classList.remove('active');
});

// Close when clicking overlay background
commentsModal.addEventListener('click', e => {
  if (e.target === commentsModal) {
    commentsModal.classList.remove('active');
  }
});

// Close when pressing ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && commentsModal.classList.contains('active')) {
    commentsModal.classList.remove('active');
  }
});