import '../css/header.css';
import { useNavigate } from "@solidjs/router";
import { createSignal, Show, onCleanup, onMount } from "solid-js";
import { BiSolidHomeHeart } from 'solid-icons/bi'
import { BsPersonHeart } from 'solid-icons/bs'
import { BsChatRightHeartFill } from 'solid-icons/bs'

function Header() {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = createSignal(false);
    let profileMenuRef;

    // State untuk menyimpan informasi user yang login
    const [loggedInUserEmail, setLoggedInUserEmail] = createSignal('');
    const [loggedInUserName, setLoggedInUserName] = createSignal('');
    const [loggedInUserId, setLoggedInUserId] = createSignal(null);
    const [loggedInUserProfilePicture, setLoggedInUserProfilePicture] = createSignal(null);

    const handleNavigation = (path) => {
        navigate(path);
        setShowProfileMenu(false);
    };

    const toggleProfileMenu = (event) => {
        event.stopPropagation();
        setShowProfileMenu(!showProfileMenu());
    };

    // Fungsi untuk menangani logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('nama');

        setLoggedInUserEmail('');
        setLoggedInUserName(null);
        setLoggedInUserId(null);
        setLoggedInUserProfilePicture(null);

        navigate('/login', { replace: true });
        setShowProfileMenu(false);
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
        const email = localStorage.getItem('userEmail');
        const userId = localStorage.getItem('userId');
        const nama = localStorage.getItem('nama');

        if (email) {
            setLoggedInUserEmail(email);
        }
        if (userId) {
            setLoggedInUserId(userId);
        }
        if (nama) {
            setLoggedInUserName(nama);
        }

        document.addEventListener('click', handleClickOutside);
    });

    onCleanup(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    return (
        <header class="independent-header-container">
            <div class="independent-header-left-items">
                {/* Tampilkan email user yang login di sini */}
                {loggedInUserEmail() && (
                    <span class="header-greeting">Halo, {loggedInUserName()}</span>
                )}
            </div>
            <div class="independent-header-middle-items">
                <div class="independent-header-item" onClick={() => handleNavigation('/dashboard')}>
                    <BiSolidHomeHeart size={30}/>
                    <span>Dashboard</span>
                </div>
                <div class="independent-header-item" onClick={() => handleNavigation('/liked-users')}>
                    <BsPersonHeart size={30}/>
                    <span>Liked Users</span>
                </div>
                <div class="independent-header-item" onClick={() => handleNavigation('/chat')}>
                    <BsChatRightHeartFill size={30}/>
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
                            <div class="profile-dropdown-item" onClick={handleLogout} style="color: red">
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
