import '../css/header.css';
import { useNavigate } from "@solidjs/router";
import { createSignal, Show, onCleanup, onMount } from "solid-js";

function Header() {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = createSignal(false);
    let profileMenuRef;

    const handleNavigation = (path) => {
        navigate(path);
        setShowProfileMenu(false);
    };

    const toggleProfileMenu = (event) => {
        event.stopPropagation();
        setShowProfileMenu(!showProfileMenu());
    };

    const user = {
        initials: 'U'
    };

    const handleClickOutside = (event) => {
        if (profileMenuRef && !profileMenuRef.contains(event.target)) {
            setShowProfileMenu(false);
        }
    };

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onCleanup(() => {
        document.removeEventListener('click', handleClickOutside);
    });


    return (
        <header class="independent-header-container">
            <div class="independent-header-left-items">
                {/* Logo ??? */}
            </div>

            <div class="independent-header-middle-items">
                <div class="independent-header-item" onClick={() => handleNavigation('/liked-users')}>
                    <span style="font-size: 24px;" role="img" aria-label="Liked Users Icon">👥</span>
                    <span>Liked Users</span>
                </div>
                <div class="independent-header-item" onClick={() => handleNavigation('/chat')}>
                    <span style="font-size: 24px;" role="img" aria-label="Chat Icon">✉️</span>
                    <span>Chats</span>
                </div>
            </div>

            <div class="independent-header-right-item">
                <div class="independent-header-profile-section" ref={profileMenuRef}>
                    <div class="independent-header-profile-icon" onClick={toggleProfileMenu}>
                        {user.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt="Profile" />
                        ) : (
                            <span>{user.initials}</span>
                        )}
                    </div>
                    <Show when={showProfileMenu()}>
                        <div class="profile-dropdown-menu">
                            <div class="profile-dropdown-item" onClick={() => handleNavigation('/profile')}>
                                Profile
                            </div>
                            <div class="profile-dropdown-item" onClick={() => handleNavigation('/login')} style="color: red">
                                Log Out
                            </div>
                        </div>
                    </Show>
                </div>
            </div>
        </header>
    );
}

export default Header;
