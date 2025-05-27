// src/pages/ChatPage.jsx
import '../css/chat_page.css'; 

function ChatPage() {
  const activeChatName = "Zefandion"; // Nama chat yang aktif di header

  // Pesan hardcoded 
  const messages = [
    {
      type: 'received',
      sender: 'Nama',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      type: 'sent',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  ];

  // Kontak hardcoded
  const contacts = [
    { name: 'Nama', icon: '👤' },
    { name: 'Nama', icon: '👤' },
    { name: 'Nama', icon: '👤' },
    { name: 'Zefandion', icon: '👤', active: true }
  ];

  return (
    <div class="chat-app-container">
      <header class="app-header">
        <div class="header-left">
          <span class="icon-button">←</span>
        </div>
        <div class="header-center">
          <span class="icon">👤</span>
          <span>{activeChatName}</span>
        </div>
        <div class="header-right">
          <span class="icon">👤</span> 
        </div>
      </header>

      <main class="main-content">
        <aside class="sidebar">
          {contacts.map(contact => (
            <div class={`contact-item ${contact.active ? 'active-contact' : ''}`}>
              <span class="icon">{contact.icon}</span>
              <span>{contact.name}</span>
            </div>
          ))}
        </aside>

        <section class="chat-window">
          <div class="message-list">
            {messages.map(msg => (
              <div class={`message ${msg.type}`}>
                {msg.type === 'received' && msg.sender && (
                  <div class="message-sender-name">{msg.sender}</div>
                )}
                <div class="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div class="message-input-area">
            <input type="text" class="message-input" placeholder="Type a message..." />
            <button class="send-button">Send</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ChatPage;
