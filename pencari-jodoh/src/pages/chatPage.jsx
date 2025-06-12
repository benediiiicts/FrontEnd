import '../css/chat_page.css';
import { useNavigate } from '@solidjs/router';
import { createSignal, onMount, onCleanup, For, Show } from 'solid-js';
import Header from './header';
import socket from '../socket';

function ChatPage() {
  const nav = useNavigate();
  
  const [contacts, setContacts] = createSignal([]);
  const [activeChat, setActiveChat] = createSignal(null);
  const [messages, setMessages] = createSignal([]);
  const [inputValue, setInputValue] = createSignal("");
  const currentUserId = parseInt(localStorage.getItem('userId'));

  const handleNewMessage = (newMessage) => {
    const activeConvo = activeChat();
    if (activeConvo && newMessage.percakapan_id === activeConvo.percakapan_id) {
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const handleChatHistory = (data) => {
    const { messages, percakapan_id } = data;
    setMessages(messages);
    if (percakapan_id) {
      setActiveChat(prev => ({ ...prev, percakapan_id: percakapan_id }));
    }
  };

  onMount(async () => {
    if (!currentUserId) {
      nav('/login', { replace: true });
      return;
    }
    
    // --- FIX: Manually connect to the socket server ---
    socket.connect();

    try {
      const response = await fetch('http://localhost:3001/user/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId })
      });

      if (response.ok) {
        const matchedUsers = await response.json();
        setContacts(matchedUsers);
      } else {
        console.error("Gagal mengambil daftar match. Status:", response.status);
      }
    } catch (error) {
      console.error("Error saat fetch matches:", error);
    }

    socket.on('pesan_baru', handleNewMessage);
    socket.on('riwayat_chat', handleChatHistory);

    onCleanup(() => {
      socket.off('pesan_baru', handleNewMessage);
      socket.off('riwayat_chat', handleChatHistory);
      // --- FIX: Disconnect when the component is no longer needed ---
      socket.disconnect();
    });
  });

  const handleContactClick = (contact) => {
    if (activeChat()?.user_id === contact.user_id) return;
    
    setActiveChat(contact);
    setMessages([]);

    socket.emit('muat_riwayat_chat', { 
      user1_id: currentUserId, 
      user2_id: contact.user_id 
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue().trim() && activeChat()) {
      socket.emit('kirim_pesan', {
        sender_id: currentUserId,
        receiver_id: activeChat().user_id,
        content: inputValue()
      });
      setInputValue("");
    }
  };

  return (
    <div class="chat-app-container">
      <Header />
      <main class="main-content">
        <aside class="sidebar">
          <For each={contacts()} fallback={<div>Belum ada hasil match</div>}>
            {(contact) => (
              <div 
                class={`contact-item ${activeChat()?.user_id === contact.user_id ? 'active-contact' : ''}`}
                onClick={() => handleContactClick(contact)}
              >
                <Show
                  when={contact.profile_picture}
                  fallback={
                    <div style={{
                      "display": "flex",
                      "align-items": "center",
                      "justify-content": "center",
                      "width": "40px",
                      "height": "40px",
                      "border-radius": "50%",
                      "background-color": "#e0e0e0",
                      "color": "#555",
                      "font-weight": "bold",
                      "font-size": "18px",
                      "margin-right": "12px"
                    }}>
                      {contact.nama.charAt(0).toUpperCase()}
                    </div>
                  }
                >
                  <img 
                    src={`data:image/jpeg;base64,${contact.profile_picture}`}
                    alt={`${contact.nama}'s profile picture`}
                    style={{
                      "width": "40px",
                      "height": "40px",
                      "border-radius": "50%",
                      "object-fit": "cover",
                      "margin-right": "12px"
                    }}
                  />
                </Show>
                <span>{contact.nama}</span>
              </div>
            )}
          </For>
        </aside>

        <section class="chat-window">
          <Show 
            when={activeChat()} 
            fallback={<div class="no-chat-selected"></div>}
          >
            <header class="chat-header">{activeChat()?.nama}</header>
            <div class="message-list">
              <For each={messages()}>
                {(msg) => (
                  <div class={`message ${msg.sender_id === currentUserId ? 'sent' : 'received'}`}>
                    <div class="message-bubble">{msg.content}</div>
                  </div>
                )}
              </For>
            </div>
            <form class="message-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                class="message-input" 
                placeholder="Type a message..." 
                value={inputValue()}
                onInput={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" class="send-button">Send</button>
            </form>
          </Show>
        </section>
      </main>
    </div>
  );
}

export default ChatPage;