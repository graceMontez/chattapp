



// Redirect to login if not logged in
if (!localStorage.getItem("loggedIn")) {
  window.location.href = "login.html";
}

// Go to settings page
document.getElementById("settingsBtn").onclick = () => {
  window.location.href = "settings.html";
};

// 🔁 Reusable comment + reply creator
function createCommentBlock(text) {
  const wrapper = document.createElement("div");
  wrapper.className = "comment-block";

  const comment = document.createElement("p");
  comment.textContent = text;
  comment.className = "comment";

  let replyBoxVisible = false;

  const replyBtn = document.createElement("button");
  replyBtn.textContent = "Reply";
  replyBtn.style.cursor = "pointer";
  replyBtn.style.marginRight = "10px";

  const replyInput = document.createElement("textarea");
  replyInput.placeholder = "Write a reply...";
  replyInput.style.display = "none";
  replyInput.rows = 2;
  replyInput.style.width = "100%";
  replyInput.style.marginTop = "5px";

  const replySubmitBtn = document.createElement("button");
  replySubmitBtn.textContent = "Post Reply";
  replySubmitBtn.style.display = "none";
  replySubmitBtn.style.marginTop = "5px";

  const replyList = document.createElement("div");
  replyList.className = "reply-list";
  replyList.style.marginLeft = "15px";

  replyBtn.onclick = () => {
    replyBoxVisible = !replyBoxVisible;
    replyInput.style.display = replyBoxVisible ? "block" : "none";
    replySubmitBtn.style.display = replyBoxVisible ? "inline-block" : "none";
  };

  replySubmitBtn.onclick = () => {
    const replyText = replyInput.value.trim();
    if (replyText) {
      const replyBlock = createCommentBlock(replyText);
      replyList.appendChild(replyBlock);
      replyInput.value = "";
    }
  };

  wrapper.appendChild(comment);
  wrapper.appendChild(replyBtn);
  wrapper.appendChild(replyInput);
  wrapper.appendChild(replySubmitBtn);
  wrapper.appendChild(replyList);

  return wrapper;
}

// 📝 Create a new post
function createPost() {
  const caption = document.getElementById("caption").value;
  const media = document.getElementById("mediaUpload").files[0];
  const postFeed = document.getElementById("postFeed");

  const post = document.createElement("div");
  post.className = "post";

  const captionEl = document.createElement("p");
  captionEl.textContent = caption;
  post.appendChild(captionEl);

  if (media) {
    const reader = new FileReader();
    reader.onload = () => {
      const mediaEl = document.createElement(media.type.startsWith("video") ? "video" : "img");
      mediaEl.className = "post-media";
      mediaEl.src = reader.result;
      if (media.type.startsWith("video")) {
        mediaEl.controls = true;
      }
      post.appendChild(mediaEl);
    };
    reader.readAsDataURL(media);
  }

  const actions = document.createElement("div");
  actions.className = "post-actions";

  const likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.textContent = "❤️ Like (0)";
  let liked = false;
  let likeCount = 0;

  likeBtn.onclick = () => {
    liked = !liked;
    likeCount += liked ? 1 : -1;
    likeBtn.textContent = `❤️ Like (${likeCount})`;
    likeBtn.classList.toggle("liked", liked);
  };

  const commentBtn = document.createElement("button");
  commentBtn.className = "comment-btn";
  commentBtn.textContent = "💬 Comment";

  actions.appendChild(likeBtn);
  actions.appendChild(commentBtn);
  post.appendChild(actions);

  const commentSection = document.createElement("div");
  commentSection.className = "comment-section";

  const commentBox = document.createElement("textarea");
  commentBox.placeholder = "Write a comment...";
  commentBox.style.width = "100%";
  commentBox.style.marginBottom = "5px";

  const postCommentBtn = document.createElement("button");
  postCommentBtn.textContent = "Post Comment";

  const commentList = document.createElement("div");

  postCommentBtn.onclick = () => {
    const commentText = commentBox.value.trim();
    if (commentText) {
      const commentBlock = createCommentBlock(commentText);
      commentList.appendChild(commentBlock);
      commentBox.value = "";
    }
  };

  commentSection.appendChild(commentBox);
  commentSection.appendChild(postCommentBtn);
  commentSection.appendChild(commentList);
  post.appendChild(commentSection);

  postFeed.prepend(post);

  document.getElementById("caption").value = "";
  document.getElementById("mediaUpload").value = "";
}

// Load profile and bio from logged in user
window.onload = () => {
  const users = JSON.parse(localStorage.getItem("chatUsers")) || [];
  const loggedInEmail = localStorage.getItem("loggedInUserEmail");
  const savedUser = users.find(u => u.email === loggedInEmail);

  const profilePic = document.getElementById("profilePic");
  const coverPhoto = document.getElementById("coverPhoto");

  if (savedUser && savedUser.coverPhoto) {
    coverPhoto.src = savedUser.coverPhoto;
    coverPhoto.hidden = false;
    document.querySelector(".cover-placeholder .upload-text").style.display = "none";
  }

  if (savedUser && savedUser.profilePic) {
    profilePic.src = savedUser.profilePic;
    profilePic.hidden = false;
    document.getElementById("profilePlaceholder").style.display = "none";
  }

  if (savedUser && savedUser.bio) {
    document.getElementById("bioText").textContent = savedUser.bio;
  }
};

// Placeholder click handlers
const uploadCover = document.getElementById("uploadCover");
document.getElementById("coverPhotoWrapper").onclick = () => uploadCover.click();

const uploadProfile = document.getElementById("uploadProfile");
document.getElementById("profilePlaceholder").onclick = () => uploadProfile.click();

// Save updated profile and cover images
const profilePic = document.getElementById("profilePic");
const changeProfileBtn = document.getElementById("changeProfileBtn");
changeProfileBtn.onclick = () => uploadProfile.click();

uploadProfile.onchange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const users = JSON.parse(localStorage.getItem("chatUsers")) || [];
      const loggedInEmail = localStorage.getItem("loggedInUserEmail");
      const index = users.findIndex(u => u.email === loggedInEmail);
      if (index !== -1) {
        users[index].profilePic = reader.result;
        localStorage.setItem("chatUsers", JSON.stringify(users));
        profilePic.src = reader.result;
        profilePic.hidden = false;
        document.getElementById("profilePlaceholder").style.display = "none";
      }
    };
    reader.readAsDataURL(file);
  }
};

const coverPhoto = document.getElementById("coverPhoto");
coverPhoto.onclick = () => uploadCover.click();

uploadCover.onchange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const users = JSON.parse(localStorage.getItem("chatUsers")) || [];
      const loggedInEmail = localStorage.getItem("loggedInUserEmail");
      const index = users.findIndex(u => u.email === loggedInEmail);
      if (index !== -1) {
        users[index].coverPhoto = reader.result;
        localStorage.setItem("chatUsers", JSON.stringify(users));
        coverPhoto.src = reader.result;
        coverPhoto.hidden = false;
        document.querySelector(".cover-placeholder .upload-text").style.display = "none";
      }
    };
    reader.readAsDataURL(file);
  }
};

// Navbar button demo alerts
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    alert(`${btn.textContent.trim()} clicked`);
  };
});
