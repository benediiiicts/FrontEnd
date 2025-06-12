import '../css/dashboard_page.css'; 
import Header from './header';
import { useNavigate } from '@solidjs/router';
import { createSignal, onMount, createEffect, createMemo, Show } from 'solid-js';
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

    const [kotaOptions, setKotaOptions] = createSignal([]);
    const [agamaOptions, setAgamaOptions] = createSignal([]);
    const [kepribadianOptions, setKepribadianOptions] = createSignal([]);
    
    const [selectedKota, setSelectedKota] = createSignal('');
    const [selectedAgama, setSelectedAgama] = createSignal('');
    const [selectedKepribadian, setSelectedKepribadian] = createSignal('');

    const [showFilters, setShowFilters] = createSignal(false);

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

        // Ambil SEMUA pengguna, tanpa filter, SATU KALI SAJA.
        try {
            const response = await fetch('http://localhost:3001/data/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idUser: userId, jenisKelamin: jenisKelaminUser }),
            });
            const data = await response.json();
            if (Array.isArray(data.users)) {
                const usersUmur = data.users.map(user => ({
                    ...user,
                    umur: calculateAge(user.tanggal_lahir)
                }));
                setUsers(usersUmur);
            }
        } catch(err) {
            console.error("Fetch users error:", err);
            setError(err);
        }
        
        // Mengambil data untuk mengisi dropdown filter
        try {
            const [kotaRes, agamaRes, kepribadianRes] = await Promise.all([
                fetch('http://localhost:3001/data/kota'),
                fetch('http://localhost:3001/data/agama'),
                fetch('http://localhost:3001/data/kepribadian')
            ]);
            setKotaOptions((await kotaRes.json()).kota || []);
            setAgamaOptions((await agamaRes.json()).agama || []);
            setKepribadianOptions((await kepribadianRes.json()).kepribadian || []);
        } catch (err) {
            console.error("Gagal mengambil data filter dropdown:", err);
        }

        setLoggedInUserEmail(userEmail);
        setLoggedInUserId(userId);
    });

    // --- LOGIKA CLIENT-SIDE FILTERING & SORTING ---
    // createMemo akan membuat signal turunan yang nilainya dihitung ulang setiap kali salah satu dependensinya (users atau filter) berubah.
    const displayedUsers = createMemo(() => {
        const allUsers = users();
        const kota = selectedKota();
        const agama = selectedAgama();
        const kepribadian = selectedKepribadian();

        if (!kota && !agama && !kepribadian) {
            // Jika tidak ada filter, cukup kembalikan daftar pengguna (backend sudah mengacaknya).
            return allUsers;
        }

        const getScore = (user) => {
            let score = 0;
            if (kepribadian && String(user.kepribadian_id) === kepribadian) score++;
            if (kota && String(user.kota_id) === kota) score++;
            if (agama && String(user.agama_id) === agama) score++;
            return score;
        };
        
        // Filter hanya pengguna yang memiliki skor > 0 (cocok dengan setidaknya satu kriteria).
        const filtered = allUsers.filter(user => getScore(user) > 0);

        // Urutkan pengguna yang sudah difilter berdasarkan skor tertinggi.
        return filtered.sort((a, b) => getScore(b) - getScore(a));
    });

    // Reset cardIndex setiap kali daftar pengguna yang ditampilkan berubah.
    createEffect(() => {
        displayedUsers();
        console.log("Daftar pengguna diperbarui, reset card index.");
        setCardIndex(0);
        setAction("");
    });

    const [cardIndex, setCardIndex] = createSignal(0);
    const [action, setAction] = createSignal("");

    const nextCard = () => {
        if (cardIndex() < displayedUsers().length) {
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

    const likeCard = async () => {
        if (cardIndex() >= displayedUsers().length) return;
        const likedUser = displayedUsers()[cardIndex()];
        console.log('Liked:', likedUser);
        setAction("like");

        // Kirim permintaan ke endpoint /data/like
        try {
            await fetch('http://localhost:3001/data/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                liking_user_id: loggedInUserId(),
                liked_user_id: likedUser.user_id
            })
            });
        } catch (err) {
            console.error("Error sending like:", err);
        }

        nextCard();
        };

    // Ubah fungsi dislikeCard menjadi async
    const dislikeCard = async () => {
        if (cardIndex() >= displayedUsers().length) return;
        const dislikedUser = displayedUsers()[cardIndex()];
        console.log('Disliked:', dislikedUser);
        setAction("dislike");

        // Kirim permintaan ke endpoint /data/dislike
        try {
            await fetch('http://localhost:3001/data/dislike', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                disliking_user_id: loggedInUserId(),
                disliked_user_id: dislikedUser.user_id
            })
            });
        } catch (err) {
            console.error("Error sending dislike:", err);
        }

        nextCard();
    };

    const cardStyle = (index) => {
        const list = displayedUsers(); // PERBAIKAN
        if(index < cardIndex()) {
            return {
                "z-index": list.length - index,
                opacity: '0',
                transform: action() === "like" ? 'translateX(500px) scale(0.8)' : 'translateX(-500px) scale(0.8)',
                transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
            };
        }
        return {
            "z-index": list.length - index,
            transform: `scale(${1 - (index - cardIndex()) * 0.05}) translateY(${(index - cardIndex()) * -10}px)`,
            opacity: index === cardIndex() ? '1' : (index < cardIndex() + 3 ? '0.5' : '0'),
            transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        };
    };

    return (
        <div>
            <Header/>
            <div class="container">
                <div class="filter-container">
                    <Show
                        when={showFilters()}
                        fallback={ <button class="filter-toggle-button" onClick={() => setShowFilters(true)}>Cari Kriteria Anda</button> }
                    >
                        <select class="filter-select" value={selectedKepribadian()} onChange={(e) => setSelectedKepribadian(e.target.value)}>
                            <option value="">Pilih Kepribadian</option>
                            {kepribadianOptions().map(p => <option value={p.kepribadian_id}>{p.jenis_kepribadian}</option>)}
                        </select>
                        <select class="filter-select" value={selectedKota()} onChange={(e) => setSelectedKota(e.target.value)}>
                            <option value="">Pilih Kota</option>
                            {kotaOptions().map(k => <option value={k.kota_id}>{k.nama_kota}</option>)}
                        </select>
                        <select class="filter-select" value={selectedAgama()} onChange={(e) => setSelectedAgama(e.target.value)}>
                            <option value="">Pilih Agama</option>
                            {agamaOptions().map(a => <option value={a.agama_id}>{a.nama_agama}</option>)}
                        </select>
                    </Show>
                </div>
                
                <div class="listUser">
                    <Show when={displayedUsers().length > 0 && cardIndex() < displayedUsers().length}
                        fallback={<p class="info-text">Tidak ada lagi pengguna untuk ditampilkan.</p>}
                    >
                        {displayedUsers().map((user, index) => (
                            <div id={user.user_id} class="profile" style={cardStyle(index)}>
                                {user.profile_picture && (
                                    <img class="card" src={user.profile_picture} alt={`Foto profil ${user.nama}`}/>
                                )}
                                <p class='keteranganUser'><span>{user.nama}</span>, <span>{user.umur} tahun</span></p>
                            </div>
                        ))}
                    </Show>
                </div>

                <div class="controls">
                    <button class="control-button dislike-button" onClick={dislikeCard} disabled={cardIndex() >= displayedUsers().length}>
                        <ImCross size={35}/>
                    </button>
                    <button class="control-button like-button" onClick={likeCard} disabled={cardIndex() >= displayedUsers().length}>
                        <AiFillHeart size={40} />
                    </button>  
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
