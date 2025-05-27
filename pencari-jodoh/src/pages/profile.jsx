import '../css/profile_page.css';
import { useNavigate } from "@solidjs/router";

function ProfilePage() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/dashboard');
    };

    const handleProfileIconClick = () => {
        navigate('/profile');
    };

    return (
        <div class="profile-page-container">
            {/* Header Halaman (Ikon Pengguna di Kanan Atas) */}
            <header class="page-header">
                <div class="user-profile-icon" onClick={handleProfileIconClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-lg">
                        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                    </svg>
                </div>
            </header>

            {/* Kartu Profil Utama yang akan mengisi sebagian besar layar */}
            <div class="profile-card">
                {/* Tombol kembali (panah kiri) */}
                <div class="back-button" onClick={handleBackClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-md">
                        <path fill-rule="evenodd" d="M11.03 4.293a1.5 1.5 0 0 0-2.072 0L3.22 9.998a1.5 1.5 0 0 0 0 2.072l5.738 5.738a1.5 1.5 0 0 0 2.072-2.072L7.31 12.75l3.72-3.72a1.5 1.5 0 0 0 0-2.072Z" clip-rule="evenodd" />
                    </svg>
                </div>

                <div class="profile-main-content">
                    {/* Bagian Gambar Profil (Avatar) */}
                    <div class="profile-avatar-section">
                        <div class="profile-avatar-placeholder">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="avatar-icon">
                                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Grid Detail Profil */}
                    <div class="profile-details-grid">
                        <div class="detail-item">
                            <label htmlFor="nama">Nama</label>
                            <input id="nama" type="text" class="input-field" value="Manuel" disabled />
                        </div>
                        <div class="detail-item">
                            <label htmlFor="tanggal-lahir">Tanggal Lahir</label>
                            <input id="tanggal-lahir" type="text" class="input-field" value="10/02/2004" disabled />
                        </div>

                        <div class="detail-item">
                            <label htmlFor="jenis-kelamin">Jenis Kelamin</label>
                            <input id="jenis-kelamin" type="text" class="input-field" value="Pria" disabled />
                        </div>
                        <div class="detail-item">
                            <label htmlFor="sifat-kepribadian">Sifat Kepribadian</label>
                            <input id="sifat-kepribadian" type="text" class="input-field" value="Introvert" disabled />
                        </div>

                        <div class="detail-item">
                            <label htmlFor="lokasi">Lokasi</label>
                            <input id="lokasi" type="text" class="input-field" value="Antapani" disabled />
                        </div>
                        <div class="detail-item">
                            <label htmlFor="pendidikan-terakhir">Pendidikan Terakhir</label>
                            <input id="pendidikan-terakhir" type="text" class="input-field" value="SMA" disabled />
                        </div>

                        <div class="detail-item">
                            <label htmlFor="agama">Agama</label>
                            <input id="agama" type="text" class="input-field" value="Yahudi" disabled />
                        </div>
                        <div class="detail-item">
                            <label htmlFor="tinggi-badan">Tinggi Badan</label>
                            <input id="tinggi-badan" type="text" class="input-field" value="170" disabled />
                        </div>

                        <div class="detail-item">
                            <label htmlFor="pekerjaan">Pekerjaan</label>
                            <input id="pekerjaan" type="text" class="input-field" value="Mahasiswa" disabled />
                        </div>
                        <div class="detail-item">
                            <label htmlFor="hobi">Hobi</label>
                            <input id="hobi" type="text" class="input-field" value="Gamers" disabled />
                        </div>
                    </div>

                    {/* Bagian Bio */}
                    <div class="bio-section">
                        <label htmlFor="bio">Bio</label>
                        <textarea id="bio" class="textarea-field" rows="5" disabled> Tulis bio Anda di sini...</textarea>
                    </div>
                </div>

                <div class="button-container">
                    <button class="action-button">Edit Profile</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;