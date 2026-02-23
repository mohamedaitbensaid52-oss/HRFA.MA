/**
 * Chat System Module
 * Handles simulated real-time messaging, contact lists, and typing indicators.
 */

const CONTACTS_STORAGE_KEY = 'HRFA_CHAT_CONTACTS';
const MESSAGES_STORAGE_KEY = 'HRFA_CHAT_MESSAGES';

// Initial Mock Data
const MOCK_CONTACTS = [
    { id: 101, name: 'أحمد السباك', lastMsg: 'واش متاح دابا؟', time: '10:30', online: true, profession: 'سباك' },
    { id: 102, name: 'ياسين الكهربائي', lastMsg: 'صافي نهار الاثنين', time: 'Yesterday', online: false, profession: 'كهربائي' },
    { id: 103, name: 'سناء (زبونة)', lastMsg: 'شكرا بزاف على الخدمة', time: 'Yesterday', online: true, profession: 'Client' }
];

let currentChatId = null;

/**
 * Initialize the chat page
 */
export function initChatPage() {
    loadContacts();
    setupEventListeners();

    // Check for "auto-open" chat from URL params
    const params = new URLSearchParams(window.location.search);
    const targetId = params.get('id');
    if (targetId) {
        openChat(parseInt(targetId));
    }
}

function loadContacts() {
    const contactsList = document.getElementById('contacts-list');
    if (!contactsList) return;

    const contacts = getContacts();
    contactsList.innerHTML = contacts.map(c => `
        <div class="contact-card ${currentChatId === c.id ? 'active' : ''}" onclick="window.openChat(${c.id})">
            <div class="contact-avatar">
                ${c.name.charAt(0)}
                ${c.online ? '<span class="online-indicator"></span>' : ''}
            </div>
            <div class="contact-info">
                <div class="contact-name-row">
                    <span class="contact-name">${c.name}</span>
                    <span class="contact-time">${c.time}</span>
                </div>
                <div class="contact-last-msg">${c.lastMsg}</div>
            </div>
        </div>
    `).join('');
}

function getContacts() {
    const data = localStorage.getItem(CONTACTS_STORAGE_KEY);
    return data ? JSON.parse(data) : MOCK_CONTACTS;
}

function setupEventListeners() {
    const sendBtn = document.getElementById('send-btn');
    const msgInput = document.getElementById('msg-input');

    if (sendBtn && msgInput) {
        sendBtn.onclick = () => sendMessage();
        msgInput.onkeypress = (e) => {
            if (e.key === 'Enter') sendMessage();
        };
    }
}

export function openChat(id) {
    currentChatId = id;
    const contacts = getContacts();
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    // Update UI Header
    const lang = document.documentElement.lang || 'ar';
    document.getElementById('chat-with-name').textContent = contact.name;
    document.getElementById('chat-with-status').textContent = contact.online ?
        (translations[lang]?.online || 'Online') :
        (lang === 'ar' ? 'غير متصل' : 'Offline');

    // Update active state in list
    loadContacts();

    // Load messages
    renderMessages();

    // Switch view on mobile
    document.querySelector('.chat-container').classList.add('chat-open');
}

function renderMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const messages = getMessages(currentChatId);
    container.innerHTML = messages.map(m => `
        <div class="message-row ${m.sentByMe ? 'sent' : 'received'}">
            <div class="message-bubble">
                ${m.text}
                <span class="msg-time">${m.time}</span>
            </div>
        </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
}

function getMessages(chatId) {
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '{}');
    return allMessages[chatId] || [
        { text: 'السلام عليكم، واش متاح اليوم لواحد الخدمة؟', time: '10:00', sentByMe: false },
        { text: 'وعليكم السلام، نعم متاح. شنو الخدمة اللي كتقلب عليها؟', time: '10:15', sentByMe: true }
    ];
}

function sendMessage() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if (!text || !currentChatId) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { text, time, sentByMe: true };

    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '{}');
    if (!allMessages[currentChatId]) allMessages[currentChatId] = [];
    allMessages[currentChatId].push(newMsg);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));

    input.value = '';
    renderMessages();

    // Simulated Reply
    simulateReply();
}

function simulateReply() {
    const messagesContainer = document.getElementById('chat-messages');

    // Show typing indicator
    const typing = document.createElement('div');
    typing.className = 'message-row received typing-row';
    typing.innerHTML = `
        <div class="message-bubble typing">
            <span>.</span><span>.</span><span>.</span>
        </div>
    `;
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
        typing.remove();
        const replyText = "أوكي، صيفط ليا العنوان والوقت المناسب ليك.";
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const replyMsg = { text: replyText, time, sentByMe: false };

        const allMessages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '{}');
        allMessages[currentChatId].push(replyMsg);
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));

        renderMessages();

        // Trigger Notification
        if (typeof window.addNotification === 'function') {
            const lang = document.documentElement.lang || 'ar';
            const notifTitle = translations[lang]?.new_message_notif ?
                translations[lang].new_message_notif.replace('{name}', contact.name) :
                (lang === 'ar' ? 'رسالة جديدة' : 'New message');

            window.addNotification(notifTitle, replyText, 'info', { url: `chat.html?id=${currentChatId}` });
        }
    }, 2000);
}

// Global exposure
window.openChat = openChat;
window.initChatPage = initChatPage;

// Auto-init if on chat page
if (window.location.pathname.includes('chat.html')) {
    document.addEventListener('DOMContentLoaded', initChatPage);
}
