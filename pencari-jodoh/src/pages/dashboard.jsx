import '../css/dashboard_page.css'; 
import Header from './header';
import { useNavigate } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';
import { AiFillHeart } from 'solid-icons/ai'
import { ImCross } from 'solid-icons/im'

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

    const [users, setUsers] = createSignal([]);
    const [loggedInUserEmail, setLoggedInUserEmail] = createSignal('');
    const [loggedInUserId, setLoggedInUserId] = createSignal(null);

    const calculateAge = (dobstring) => {
        const dob = new Date(dobstring);
        const sekarang = new Date();

        let age = sekarang.getFullYear() - dob.getFullYear();
        const bedaBulan = sekarang.getMonth() - dob.getMonth();

        if(bedaBulan < 0 || (bedaBulan === 0 && sekarang.getDate() < dob.getDate())) {
            age --;
        }

        return age;
    };

    console.log('DashboardPage: Component dirender.');

    onMount(async () => {
        console.log('onMount: Menjalankan operasi fetch.');

        const authToken = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        const userId = localStorage.getItem('userId');
        const jenisKelaminUser = localStorage.getItem('jenisKelamin');

        if (!authToken || !userEmail || !userId) {
            console.log('onMount: Tidak ada token, email, atau ID user. Mengarahkan ke halaman login.');
            nav('/login', { replace: true });
            return;
        }

        setLoggedInUserEmail(userEmail); // Set email user yang login
        setLoggedInUserId(userId);

        try {
            const response = await fetch('http://localhost:3001/data/users', {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                        idUser: userId,
                        jenisKelamin: jenisKelaminUser,
                }),
            });

            console.log('onMount: Fetch response received. Status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('onMount: Server response not OK', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText || errorText}`);
            }

            const data = await response.json();
            console.log('onMount: Data received from API:', data);
            console.log('onMount: Data[0]:', data[0]); 

            const usersData = data.users;

            if (Array.isArray(usersData)) {
                const usersUmur = usersData.map(user => ({
                    ...user,
                    umur: calculateAge(user.tanggal_lahir)
                }));

                setUsers([...usersUmur]);
                console.log('onMount: Users signal updated. Current users():', users());
            } else {
                console.error('onMount: Data received is not an array:', usersData);
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
            <Header/>
            <div class="container">
                <div class="listUser">
                    {users().map((user, index) => (
                        <div id={user.user_id} class="profile" style={cardStyle(index)}>
                            {user.profile_picture && (
                                <img
                                    class="card"
                                    src={user.profile_picture}
                                    alt={`Foto profil ${user.nama}`}
                                />
                            )}
                            <p class='keteranganUser'><span>{user.nama}</span>, <span>{user.umur} tahun</span></p>
                        </div>
                    ))}
                </div>

                <div class="controls">
                    <button class="control-button dislike-button" onClick={dislikeCard}>
                        <ImCross size={35}/>
                    </button>
                    <button class="control-button like-button" onClick={likeCard}>
                        <AiFillHeart size={40} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;