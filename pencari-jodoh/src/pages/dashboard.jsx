import '../css/dashboard_page.css'; 
import { useNavigate } from '@solidjs/router';

function DashboardPage() {
    const nav = useNavigate();

    function handleLikedBtn() {
        nav('/liked-users')
    }
    function handleChatBtn() {
        nav('/chat')
    }

    function handleProfileBtn() {
        nav('/profile')
    }

  return (
    <div>
        <div class="header">
            <div class="left-items">
                <a onClick={handleLikedBtn} class="header-item">
                <span style="font-size: 24px;">👥</span>
                Liked Users
                </a>
                <a onClick={handleChatBtn} class="header-item">
                <span style="font-size: 24px;">✉️</span>
                Chat
                </a>
            </div>
            <div class="right-item">
                <a onClick={handleProfileBtn}>
                    <div class="profile-icon">
                    👤
                    </div>
                </a>
            </div>
        </div>

        <div class="container">
            <div class="listUser">
                <div class="card" id="3" style="z-index: 3;">
                    <img src="https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="gambar kucing"/>
                </div>
                <div class="card" id="2" style="z-index: 2;">
                    <img src="https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="gambar kucing"/>
                </div>
                <div class="card" id="1" style="z-index: 1;">
                    <img src="https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="gambar kucing"/>
                </div>
            </div>

            <div class="controls">
                <button class="control-button dislike-button">
                    <span style="font-size: 24px;">✕</span>
                </button>
                <button class="control-button like-button">
                    <span style="font-size: 24px;">❤️</span>
                </button>
            </div>
        </div>
    </div>
  );
}

export default DashboardPage;
