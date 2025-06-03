import '../css/profile_page.css';
import Header from './header';
import { useNavigate } from "@solidjs/router";
import { createSignal } from 'solid-js';

function ProfilePage() {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = createSignal(false);
    const [nama, setNama] = createSignal('Manuel');
    const [tanggalLahir, setTanggalLahir] = createSignal('2004-02-10');
    const [jenisKelamin, setJenisKelamin] = createSignal('Pria');
    const [sifatKepribadian, setSifatKepribadian] = createSignal('Introvert');
    const [lokasi, setLokasi] = createSignal('Antapani');
    const [pendidikanTerakhir, setPendidikanTerakhir] = createSignal('SMA');
    const [agama, setAgama] = createSignal('Yahudi');
    const [tinggiBadan, setTinggiBadan] = createSignal('170');
    const [pekerjaan, setPekerjaan] = createSignal('Mahasiswa');
    const [hobi, setHobi] = createSignal('Gamers');
    const [bio, setBio] = createSignal('Tulis bio Anda di sini...');


    const handleBackClick = () => {
        navigate('/dashboard');
    };

    const handleProfileIconClick = () => {
        navigate('/profile');
    };

    const handleInput = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleEditProfile = () => {
        if (isEditing()) {
            console.log("Menyimpan perubahan profil:", {
                nama: nama(),
                tanggalLahir: tanggalLahir(), // Akan dalam format YYYY-MM-DD
                jenisKelamin: jenisKelamin(),
                sifatKepribadian: sifatKepribadian(),
                lokasi: lokasi(),
                pendidikanTerakhir: pendidikanTerakhir(),
                agama: agama(),
                tinggiBadan: tinggiBadan(),
                pekerjaan: pekerjaan(),
                hobi: hobi(),
                bio: bio()
            });
            alert("Profil berhasil disimpan!");
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    return (
        <div class="profile-page-container">
            <Header />
            <div class="profile-card">
                <div class="back-button" onClick={handleBackClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-md">
                        <path fill-rule="evenodd" d="M11.03 4.293a1.5 1.5 0 0 0-2.072 0L3.22 9.998a1.5 1.5 0 0 0 0 2.072l5.738 5.738a1.5 1.5 0 0 0 2.072-2.072L7.31 12.75l3.72-3.72a1.5 1.5 0 0 0 0-2.072Z" clip-rule="evenodd" />
                    </svg>
                </div>

                <div class="profile-main-content">
                    <div class="profile-avatar-section">
                        <div class="profile-avatar-placeholder">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="avatar-icon">
                                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div class="profile-details-grid">
                        <div class="detail-item">
                            <label htmlFor="nama">Nama</label>
                            <input id="nama" type="text" class="input-field" value={nama()} onInput={handleInput(setNama)} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="tanggal-lahir">Tanggal Lahir</label>
                            <input id="tanggal-lahir" type="date" class="input-field" value={tanggalLahir()} onInput={handleInput(setTanggalLahir)} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="jenis-kelamin">Jenis Kelamin</label>
                            <input id="jenis-kelamin" type="text" class="input-field" value={jenisKelamin()} onInput={handleInput(setJenisKelamin)} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="sifat-kepribadian">Sifat Kepribadian</label>
                            <input id="sifat-kepribadian" type="text" class="input-field" value={sifatKepribadian()} onInput={handleInput(setSifatKepribadian)} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="lokasi">Lokasi</label>
                            <input  id="lokasi" type="text" class="input-field" value={lokasi()} onInput={handleInput(setLokasi)} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="pendidikan-terakhir">Pendidikan Terakhir</label>
                            <input id="pendidikan-terakhir" type="text" class="input-field" value={pendidikanTerakhir()} onInput={handleInput(setPendidikanTerakhir)} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="agama">Agama</label>
                            <input id="agama" type="text" class="input-field" value={agama()} onInput={handleInput(setAgama)} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="tinggi-badan">Tinggi Badan</label>
                            <input id="tinggi-badan" type="text" class="input-field" value={tinggiBadan()} onInput={handleInput(setTinggiBadan)} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="pekerjaan">Pekerjaan</label>
                            <input id="pekerjaan" type="text" class="input-field" value={pekerjaan()} onInput={handleInput(setPekerjaan)} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="hobi">Hobi</label>
                            <input id="hobi" type="text" class="input-field" value={hobi()} onInput={handleInput(setHobi)} disabled={!isEditing()}/>
                        </div>
                    </div>

                    {/* Bagian Bio */}
                    <div class="bio-section">
                        <label htmlFor="bio">Bio</label>
                        <textarea id="bio" class="textarea-field" rows="5" value={bio()} onInput={handleInput(setBio)} disabled={!isEditing()}></textarea>
                    </div>
                </div>

                <div class="button-container">
                    <button class="action-button" onClick={handleEditProfile}>
                        {isEditing() ? 'Save Profile' : 'Edit Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;