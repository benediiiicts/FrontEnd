import '../css/dashboard_page.css'; 
import Header from './header';
import { useNavigate } from '@solidjs/router';
import { createSignal, onMount, createEffect, Show } from 'solid-js';
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

        if (!authToken || !userEmail || !userId) {
            console.log('onMount: Tidak ada token, email, atau ID user. Mengarahkan ke halaman login.');
            nav('/login', { replace: true });
            return;
        }
        
        // Mengambil data untuk mengisi dropdown filter
        try {
            const [kotaRes, agamaRes, kepribadianRes] = await Promise.all([
                fetch('http://localhost:3001/data/kota'),
                fetch('http://localhost:3001/data/agama'),
                fetch('http://localhost:3001/data/kepribadian')
            ]);
            
            const kotaData = await kotaRes.json();
            const agamaData = await agamaRes.json();
            const kepribadianData = await kepribadianRes.json();
            
            setKotaOptions(kotaData.kota || []);
            setAgamaOptions(agamaData.agama || []);
            setKepribadianOptions(kepribadianData.kepribadian || []);
        } catch (err) {
            console.error("Gagal mengambil data filter dropdown:", err);
            setError(err);
        }

        setLoggedInUserEmail(userEmail);
        setLoggedInUserId(userId);
    });

    createEffect(async () => {
        const userId = loggedInUserId();
        // Jangan jalankan jika ID user belum ada (komponen belum siap)
        if (!userId) {
            return;
        }

        // Baca semua sinyal filter agar SolidJS melacak perubahan mereka
        const kota = selectedKota();
        const agama = selectedAgama();
        const kepribadian = selectedKepribadian();
        const jenisKelaminUser = localStorage.getItem('jenisKelamin');
        
        console.log("createEffect terpicu! Memuat pengguna dengan filter:", { kepribadian, kota, agama });

        try {
            const response = await fetch('http://localhost:3001/data/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idUser: userId,
                    jenisKelamin: jenisKelaminUser,
                    kota_id: kota || null,
                    agama_id: agama || null,
                    kepribadian_id: kepribadian || null,
                }),
            });
            
            if (!response.ok) {
               const errorText = await response.text();
               throw new Error(`Gagal mengambil data pengguna: ${errorText}`);
            }
            
            const data = await response.json();
            
            const usersUmur = Array.isArray(data.users) 
                ? data.users.map(user => ({ ...user, umur: calculateAge(user.tanggal_lahir) }))
                : [];

            setUsers(usersUmur);
            
        } catch (err) {
            console.error("Fetch users error:", err);
            setError(err);
            setUsers([]);
        } finally {
            setCardIndex(0);
            setAction("");
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
        if (cardIndex() >= users().length) return;
        console.log('Liked:', users()[cardIndex()]);
        setAction("like");
        nextCard();
    };

    const dislikeCard = () => {
        if (cardIndex() >= users().length) return;
        console.log('Disliked:', users()[cardIndex()]);
        setAction("dislike")
        nextCard();
    };

    const cardStyle = (index) => {
        const list = users();
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
            // Mengatur posisi dan skala untuk efek tumpukan
            transform: `scale(${1 - (index - cardIndex()) * 0.05}) translateY(${(index - cardIndex()) * -10}px)`,
            // Hanya kartu teratas yang opak, sisanya sedikit transparan
            opacity: index === cardIndex() ? '1' : (index < cardIndex() + 3 ? '0.5' : '0'),
            transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
            // Hapus 'left' agar kartu menumpuk di tengah
        };
    };

    return (
        <div>
            <Header/>
            <div class="container">
                <div class="filter-container">
                    <Show
                        when={showFilters()} fallback={
                            <button class="filter-toggle-button" onClick={() => setShowFilters(true)}>
                                Cari Kriteria Anda
                            </button>
                        }
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