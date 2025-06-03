import '../css/dashboard_page.css';
import { useNavigate } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';

function DashboardPage() {
    const nav = useNavigate();

    function handleChatBtn() {
        nav('/chat')
    }

    function handleProfileBtn() {
        nav('/profile')
    }

    const [users, setUsers] = createSignal([]);
    const [error, setError] = createSignal(null);
    const [loggedInUserEmail, setLoggedInUserEmail] = createSignal('');
    const [loggedInUserId, setLoggedInUserId] = createSignal(null);

    console.log('DashboardPage: Component dirender.');

    onMount(async () => {
        console.log('onMount: Menjalankan operasi fetch.');
        setError(null); // Reset error setiap kali fetch dimulai

        const authToken = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        const userId = localStorage.getItem('userId');

        if (!authToken || !userEmail || !userId) {
            console.log('onMount: Tidak ada token, email, atau ID user. Mengarahkan ke halaman login.');
            nav('/login', { replace: true }); // Arahkan ke login jika tidak ada token
            return;
        }

        setLoggedInUserEmail(userEmail); // Set email user yang login
        setLoggedInUserId(userId);

        try {
            const response = await fetch('http://localhost:3001/api/users');
            console.log('onMount: Fetch response received. Status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('onMount: Server response not OK', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText || errorText}`);
            }

            const data = await response.json();
            console.log('onMount: Data received from API:', data);
            console.log('onMount: Data[0]:', data[0]); // Log data pertama setelah fetch

            if (Array.isArray(data)) {
                setUsers([...data]);
                console.log('onMount: Users signal updated. Current users():', users());
            } else {
                console.error('onMount: Data received is not an array:', data);
                setError(new Error('Data yang diterima dari server bukan format yang diharapkan (array).'));
            }

        } catch (err) {
            console.error('onMount: Error during fetch or data processing:', err);
            setError(err);
        } finally {
            console.log('Fetch Data Completed.');
        }
    });

    const [cardIndex, setCardIndex] = createSignal(0);
    const [action, setAction] = createSignal("");

    const nextCard = () => {
        if (cardIndex() <= users().length - 1) {
            setCardIndex(cardIndex() + 1);
        } else {
            return (
                <div>
                    <p>semua user sudah dilihat.</p>
                </div>
            );
            // Tambahkan logika lain jika diperlukan
        }
    };

    const likeCard = () => {
        // Tambahkan logika "like" di sini
        console.log('Liked:', users()[cardIndex()]);
        nextCard();
        setAction((prev) => "like")
    };

    const dislikeCard = () => {
        // Tambahkan logika "dislike" di sini
        console.log('Disliked:', users()[cardIndex()]);
        nextCard();
        setAction((prev) => "dislike")
    };

    const cardStyle = (index) => {
        if(index < cardIndex()) {
            if(action() === "like") {
                return {
                    "z-index": users().length - index,
                    top: '0px',
                    left: "0px",
                    opacity: '0',
                    transform: 'translateX(500px) scale(0.8)',
                    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out, top 0.3s ease-in-out',
                };
            }else {
                return {
                    "z-index": users().length - index,
                    top: '0px',
                    left: "0px",
                    opacity: '0',
                    transform: 'translateX(-500px) scale(0.8)',
                    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out, top 0.3s ease-in-out',
                };
            }
        }else {
            return {
                "z-index": users().length - index,
                top: '0px',
                left: index * 50 + "px",
            };
        }
    };

    return (
        <div>
            <div class="header">
                <div class="left-items">
                    {loggedInUserEmail() && ( // Tampilkan email jika ada
                        <span class="header-item" id="haloUser">
                            Halo {loggedInUserEmail()}
                        </span>
                    )}
                    <a class="header-item">
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
                    {users().map((user, index) => (
                        <div id={user.id} class="profile" style={cardStyle(index)}>
                            {user.profilePicture && (
                                <img
                                    class="card"
                                    src={`http://localhost:3001/images/${user.profilePicture}`}
                                    alt={`Foto profil ${user.nama}`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div class="controls">
                    <button class="control-button dislike-button" onClick={dislikeCard}>
                        <span style="font-size: 24px;">✕</span>
                    </button>
                    <button class="control-button like-button" onClick={likeCard}>
                        <span style="font-size: 24px;">❤️</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;