import '../css/header.css';
import { useNavigate } from "@solidjs/router";

function Header() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleProfileClick = () => {
        navigate('/profile'); // Example navigation
    };

    // Placeholder for user data
    const user = {
        // profileImageUrl: 'path/to/user-profile.jpg',
        initials: 'U' // Fallback if no image
    };

    return (
        <header class="independent-header-container">
            {/* Left items container (can be empty or for future use like a logo) */}
            <div class="independent-header-left-items">
                {/* Example: <span class="header-logo">MyApp</span> */}
            </div>
            <div class="independent-header-middle-items">
                <div class="independent-header-item" onClick={() => handleNavigation('/liked-users')}>
                    <span style="font-size: 24px;" role="img" aria-label="Liked Users Icon">👥</span>
                    <span>Liked Users</span>
                </div>
                <div class="independent-header-item" onClick={() => handleNavigation('/chat')}>
                    <span style="font-size: 24px;" role="img" aria-label="Chat Icon">✉️</span>
                    <span>Chat</span>
                </div>
            </div>

            {/* Right items container */}
            <div class="independent-header-right-item">
                <div class="independent-header-profile-icon" onClick={handleProfileClick}> {/* */}
                    {user.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Profile" />
                    ) : (
                        <span>{user.initials}</span>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;