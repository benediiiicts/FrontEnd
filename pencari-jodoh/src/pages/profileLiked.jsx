// untuk tampilannya mirip dengan profile_page
import { onMount, createSignal, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import Header from './header';
import '../css/profile_liked.css';

function ViewProfilePage() {
    const params = useParams(); //untuk ambil url dari parameter
    const [userProfile, setUserProfile] = createSignal(null);

    //fungsi yang pertama kali dijalankan
    onMount(async () => {
        const userIdToFetch = params.id;

        try {
            //fetching
            const response = await fetch(`http://localhost:3001/user/likeduser/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Mengirim user_id di dalam body
                body: JSON.stringify({ idUser: userIdToFetch }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Gagal mengambil data profil');
            }

            const data = await response.json();
            console.log("Data yang diterima dari server:", data);
            setUserProfile(data.user); //simpan data ke signal
        } catch (err) {
            // Jika error, tampilkan di console
            console.error("Gagal mengambil data profil:", err);
        }
    });

    // Helper untuk menampilkan data agar tidak error jika null
    const displayValue = (value) => value || '-';

    return (
        <div class="profile-page-container">
            <Header />
            {/* PERBAIKAN FINAL DI SINI */}
            <Show when={userProfile()} fallback={null}>
                <div class="profile-card">
                    <div class="profile-main-content">
                        <div class="profile-avatar-section">
                            <div class="profile-avatar-placeholder">
                                <img src={userProfile().profile_picture} alt="Profile" class="profile-avatar-img"/>
                            </div>
                        </div>

                        <div class="profile-details-grid">
                            <div class="detail-item-view">
                                <label>Nama</label>
                                <span>{displayValue(userProfile().nama)}</span>
                            </div>
                            <div class="detail-item-view">
                                <label>Jenis Kelamin</label>
                                <span>{displayValue(userProfile().jenis_kelamin)}</span>
                            </div>
                            <div class="detail-item-view">
                                <label>Lokasi</label>
                                <span>{displayValue(userProfile().nama_kota)}</span>
                            </div>
                            <div class="detail-item-view">
                                <label>Sifat Kepribadian</label>
                                <span>{displayValue(userProfile().jenis_kepribadian)}</span>
                            </div>
                            <div class="detail-item-view">
                                <label>Pendidikan Terakhir</label>
                                <span>{displayValue(userProfile().pendidikan_terakhir)}</span>
                            </div>
                            <div class="detail-item-view">
                                <label>Pekerjaan</label>
                                <span>{displayValue(userProfile().pekerjaan)}</span>
                            </div>
                            <div class="detail-item-view">
                                <label>Tinggi Badan</label>
                                <span>{userProfile().tinggi_badan ? `${userProfile().tinggi_badan} cm` : '-'}</span>
                            </div>
                            <div class="detail-item-view">
                                <label>Agama</label>
                                <span>{displayValue(userProfile().nama_agama)}</span>
                            </div>
                        </div>

                        <div class="detail-item-full">
                            <label>Hobi</label>
                            <span>{userProfile().hobiList && userProfile().hobiList.length > 0 ? userProfile().hobiList.join(', ') : '-'}</span>
                        </div>

                        <div class="bio-section-view">
                            <label>Bio</label>
                            <p>{displayValue(userProfile().bio)}</p>
                        </div>
                    </div>
                    {/* TIDAK ADA TOMBOL EDIT/SAVE DI SINI */}
                </div>
            </Show>
        </div>
    );
}

export default ViewProfilePage;