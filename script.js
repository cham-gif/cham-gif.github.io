// --- DOM Elements ---
const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const userList = document.getElementById('user-list');
const messages = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const attachmentButton = document.getElementById('attachment-button');
const fileInput = document.getElementById('file-input');

const privateMessageContainer = document.getElementById('private-message-container');
const privateMessageHeader = document.getElementById('private-message-header');
const privateChatWith = document.getElementById('private-chat-with');
const closePrivateChat = document.getElementById('close-private-chat');
const privateMessages = document.getElementById('private-messages');
const privateMessageForm = document.getElementById('private-message-form');
const privateMessageInput = document.getElementById('private-message-input');

const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImage = document.getElementById('lightbox-image');
const closeLightbox = document.getElementById('close-lightbox');

const sendSound = document.getElementById('send-sound');
const receiveSound = document.getElementById('receive-sound');

// --- State ---
let currentUser = null;
let privateChatUser = null;

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Handle user login
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
        currentUser = JSON.parse(userInfo);
        initializeChat();
    } else {
        window.location.href = 'login.html';
    }

    // Setup event listeners that only need to be set once
    messageForm.addEventListener('submit', handlePublicMessageSubmit);
    privateMessageForm.addEventListener('submit', handlePrivateMessageSubmit);
    attachmentButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    closePrivateChat.addEventListener('click', closePrivateChatWindow);
    closeLightbox.addEventListener('click', () => lightboxOverlay.classList.add('hidden'));
});

function initializeChat() {
    displayMessage({ author: 'System', text: `Welcome, ${currentUser.name}! This is a simulated chat.` });
    updateUserList([currentUser]); // Only show the current user
}

// --- Message Handling ---
function handlePublicMessageSubmit(e) {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (text) {
        const message = { author: currentUser.name, text, picture: currentUser.picture };
        displayMessage(message);
        messageInput.value = '';
    }
}

function handlePrivateMessageSubmit(e) {
    e.preventDefault();
    const text = privateMessageInput.value.trim();
    if (text && privateChatUser) {
        const message = { author: currentUser.name, text, picture: currentUser.picture };
        displayPrivateMessage(message);
        privateMessageInput.value = '';
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const message = { author: currentUser.name, picture: currentUser.picture, file: file };
    displayMessage(message);
    e.target.value = ''; // Reset file input
}

function displayMessage(message) {
    const messageElement = createMessageElement(message);
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
    if (message.author === currentUser.name) {
        sendSound.play();
    } else {
        receiveSound.play();
    }
}

function displayPrivateMessage(message) {
    const messageElement = createMessageElement(message);
    privateMessages.appendChild(messageElement);
    privateMessages.scrollTop = privateMessages.scrollHeight;
    if (message.author === currentUser.name) {
        sendSound.play();
    }
}

function createMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', message.author === currentUser.name ? 'sent' : 'received');

    const profilePic = document.createElement('img');
    profilePic.src = message.picture || 'https://via.placeholder.com/40';
    messageElement.appendChild(profilePic);

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    if (message.text) {
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        const linkedText = message.text.replace(linkRegex, '<a href="$1" target="_blank">$1</a>');
        bubble.innerHTML = `<strong>${message.author}:</strong> ${linkedText}`;
    } else if (message.file) {
        if (message.file.type.startsWith('image/')) {
            bubble.classList.add('image-bubble');
            const img = document.createElement('img');
            img.src = URL.createObjectURL(message.file);
            img.addEventListener('click', () => openLightbox(img.src));
            bubble.appendChild(img);
        } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(message.file);
            link.textContent = message.file.name;
            link.download = message.file.name;
            bubble.innerHTML = `<strong>${message.author} sent a file:</strong><br>`;
            bubble.appendChild(link);
        }
    }
    messageElement.appendChild(bubble);
    return messageElement;
}

// --- User List & Private Chat ---
function updateUserList(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        if (!user) return;
        const userElement = document.createElement('li');
        const userImage = document.createElement('img');
        userImage.src = user.picture || 'https://via.placeholder.com/40';
        const userName = document.createElement('span');
        userName.textContent = user.name;
        userElement.appendChild(userImage);
        userElement.appendChild(userName);
        userElement.addEventListener('click', () => openPrivateChat(user));
        userList.appendChild(userElement);
    });
}

function openPrivateChat(user) {
    if (user.name === currentUser.name) return;
    privateChatUser = user;
    privateChatWith.textContent = `Chat with ${user.name}`;
    privateMessageContainer.classList.remove('hidden');
    privateMessages.innerHTML = '';
}

function closePrivateChatWindow() {
    privateMessageContainer.classList.add('hidden');
    privateChatUser = null;
}

// --- Lightbox ---
function openLightbox(src) {
    lightboxImage.src = src;
    lightboxOverlay.classList.remove('hidden');
}
