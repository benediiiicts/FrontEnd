import '../css/profile_page.css';
import Header from './header'; // Pastikan path benar
import { useNavigate } from "@solidjs/router";
import { createSignal, onMount } from 'solid-js';

// Daftar agama dan sifat kepribadian (sama seperti di RegisterPage)
const daftarAgama = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'];
const daftarSifatKepribadian = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

function ProfilePage() {
    const navigate = useNavigate();
    let fileInputRef; // Ref untuk input file

    const [isEditing, setIsEditing] = createSignal(false);
    const [nama, setNama] = createSignal('');
    const [tanggalLahir, setTanggalLahir] = createSignal('');
    const [jenisKelamin, setJenisKelamin] = createSignal('');
    const [sifatKepribadian, setSifatKepribadian] = createSignal('');
    const [lokasiNama, setLokasiNama] = createSignal(''); // Untuk nama kota (display)
    const [lokasiId, setLokasiId] = createSignal(''); // Untuk ID kota (value for select/send to server)
    const [pendidikanTerakhir, setPendidikanTerakhir] = createSignal('');
    const [agama, setAgama] = createSignal('');
    const [tinggiBadan, setTinggiBadan] = createSignal(null);
    const [pekerjaan, setPekerjaan] = createSignal('');
    const [hobiNames, setHobiNames] = createSignal([]); // Untuk menampilkan nama hobi (display)
    const [hobiIds, setHobiIds] = createSignal([]); // Untuk menyimpan ID hobi (value for checkboxes/send to server)
    const [bio, setBio] = createSignal('');
    const [profilePictureUrl, setProfilePictureUrl] = createSignal(null); // URL gambar profil yang sedang ditampilkan
    const [newProfilePictureFile, setNewProfilePictureFile] = createSignal(null); // File baru yang diupload
    const [error, setError] = createSignal(null);
    const [isLoading, setIsLoading] = createSignal(true);

    // State untuk menyimpan data asli saat memulai edit, untuk tombol cancel
    const [originalData, setOriginalData] = createSignal(null);

    // Data dari server untuk dropdown (di-fetch sekali saat mount)
    const [daftarKota, setDaftarKota] = createSignal([]);
    const [daftarHobi, setDaftarHobi] = createSignal([]);

    const handleBackClick = () => {
        navigate('/dashboard');
    };

    const handleInput = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleHobiCheckboxChange = (hobiId, isChecked) => {
        if (isChecked) {
            setHobiIds([...hobiIds(), hobiId]);
        } else {
            setHobiIds(hobiIds().filter(id => id !== hobiId));
        }
    };

    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        setNewProfilePictureFile(file);
        // Optionally, update profilePictureUrl for preview
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setProfilePictureUrl(e.target.result);
            reader.readAsDataURL(file);
        } else {
            // Revert to original URL if file is cleared
            setProfilePictureUrl(`http://localhost:3001/users/profile-picture/${localStorage.getItem('userId')}`);
        }
    };

    const handleProfilePictureUploadClick = () => {
        fileInputRef.click();
    };

    const handleCancelEdit = () => {
        // Kembalikan semua state ke data asli
        if (originalData()) {
            const user = originalData();
            setNama(user.nama || '');
            setTanggalLahir(user.tanggal_lahir ? user.tanggal_lahir.split('T')[0] : '');
            setJenisKelamin(user.jenis_kelamin || '');
            setSifatKepribadian(user.sifat_kepribadian || '');
            setLokasiNama(user.lokasi_nama || '');
            setLokasiId(user.kota_id || '');
            setPendidikanTerakhir(user.pendidikan_terakhir || '');
            setAgama(user.agama || '');
            setTinggiBadan(user.tinggi_badan || null);
            setPekerjaan(user.pekerjaan || '');
            setHobiNames(user.hobi_names || []);
            setHobiIds(user.hobi_ids || []);
            setBio(user.bio || '');
            // Kembalikan URL gambar profil ke yang asli
            setProfilePictureUrl(`http://localhost:3001/users/profile-picture/${localStorage.getItem('userId')}`);
            setNewProfilePictureFile(null); // Hapus file baru yang mungkin dipilih
        }
        setIsEditing(false); // Keluar dari mode edit
        setError(null); // Bersihkan error
    };

    const fetchUserProfileData = async () => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!authToken || !userId) {
            navigate('/login', { replace: true });
            return;
        }

        try {
            const profileResponse = await fetch('http://localhost:3001/users/profile', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!profileResponse.ok) {
                if (profileResponse.status === 401 || profileResponse.status === 403) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userId');
                    navigate('/login', { replace: true });
                    return;
                }
                throw new Error(`Gagal mengambil profil: ${profileResponse.statusText}`);
            }

            const profileData = await profileResponse.json();
            const user = profileData.user;

            // Save original data for "Cancel" functionality
            setOriginalData(user);

            // Populate states with user data
            setNama(user.nama || '');
            setTanggalLahir(user.tanggal_lahir ? user.tanggal_lahir.split('T')[0] : '');
            setJenisKelamin(user.jenis_kelamin || '');
            setSifatKepribadian(user.sifat_kepribadian || '');
            setLokasiNama(user.lokasi_nama || '');
            setLokasiId(user.kota_id || '');
            setPendidikanTerakhir(user.pendidikan_terakhir || '');
            setAgama(user.agama || '');
            setTinggiBadan(user.tinggi_badan || null);
            setPekerjaan(user.pekerjaan || '');
            setHobiNames(user.hobi_names || []);
            setHobiIds(user.hobi_ids ? user.hobi_ids.map(String) : []); // Ensure IDs are strings for comparison
            setBio(user.bio || '');
            
            // Update profile picture URL with cache-busting to ensure latest image is loaded
            if (userId) {
                setProfilePictureUrl(`http://localhost:3001/users/profile-picture/${userId}?t=${Date.now()}`);
            } else {
                setProfilePictureUrl(null);
            }

        } catch (err) {
            console.error('Error fetching profile data:', err);
            setError(err);
        }
    };

    onMount(async () => {
        setIsLoading(true);
        setError(null);
        
        await fetchUserProfileData(); // Fetch user profile data

        // Fetch static data (cities and hobbies) for dropdowns/checkboxes
        try {
            const kotaResponse = await fetch('http://localhost:3001/users/kota'); // Note: /kota, not /users/kota
            if (kotaResponse.ok) {
                const data = await kotaResponse.json();
                setDaftarKota(data.kota);
            } else {
                console.error('Gagal mengambil daftar kota untuk edit.');
            }

            const hobiResponse = await fetch('http://localhost:3001/users/hobi'); // Note: /hobi, not /users/hobi
            if (hobiResponse.ok) {
                const data = await hobiResponse.json();
                setDaftarHobi(data.hobi);
            } else {
                console.error('Gagal mengambil daftar hobi untuk edit.');
            }

        } catch (err) {
            console.error('Error fetching static data (kota/hobi):', err);
        } finally {
            setIsLoading(false);
        }
    });

    const handleSaveProfile = async () => {
        setIsLoading(true); // Start loading state
        setError(null); // Reset errors

        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!authToken || !userId) {
            navigate('/login', { replace: true });
            return;
        }

        const formData = new FormData();
        formData.append('nama', nama());
        formData.append('tanggal_lahir', tanggalLahir());
        formData.append('jenis_kelamin', jenisKelamin());
        formData.append('sifat_kepribadian', sifatKepribadian());
        formData.append('kota_id', lokasiId());
        formData.append('pendidikan_terakhir', pendidikanTerakhir());
        formData.append('agama', agama());
        // Ensure tinggiBadan is sent as a string or empty string if null/undefined
        formData.append('tinggi_badan', tinggiBadan() !== null && tinggiBadan() !== undefined ? String(tinggiBadan()) : '');
        formData.append('pekerjaan', pekerjaan());
        formData.append('hobi', JSON.stringify(hobiIds())); // Send array of hobby IDs as JSON string
        formData.append('bio', bio());

        if (newProfilePictureFile()) {
            formData.append('profile_picture', newProfilePictureFile());
        }

        try {
            const response = await fetch(`http://localhost:3001/users/profile/${userId}`, {
                method: 'PUT', // Use PUT method for updates
                headers: {
                    'Authorization': `Bearer ${authToken}`
                    // Content-Type is not set for FormData; browser handles it
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                alert("Profil berhasil disimpan!"); // Success feedback
                setIsEditing(false); // Exit edit mode
                setNewProfilePictureFile(null); // Clear the new file state

                // Re-fetch profile data to ensure the display is updated with the latest data,
                // especially for the profile picture (due to cache-busting in fetchUserProfileData)
                await fetchUserProfileData(); 

            } else {
                const errorData = await response.json();
                setError(new Error(errorData.error || 'Gagal menyimpan profil.'));
                alert(`Gagal menyimpan profil: ${errorData.error || 'Terjadi kesalahan.'}`); // Error feedback
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            setError(new Error('Terjadi kesalahan jaringan saat menyimpan profil.'));
            alert('Terjadi kesalahan jaringan saat menyimpan profil.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk menampilkan nama hobi yang dipilih
    const getSelectedHobiNames = () => {
        if (hobiNames().length === 0) {
            return "Tidak ada hobi terpilih";
        }
        return hobiNames().join(', ');
    };

    // Fungsi untuk menampilkan nama kota
    const getSelectedKotaName = () => {
        return lokasiNama() || "Tidak ada kota terpilih";
    };

    return (
        <div class="profile-page-container">
            <Header />
            <div class="profile-card">
                {isLoading() ? (
                    <p>Memuat profil...</p>
                ) : error() ? (
                    <p style={{ color: 'red' }}>Error memuat profil: {error().message}</p>
                ) : (
                    <div class="profile-main-content">
                        <div class="profile-avatar-section">
                            <div class="profile-avatar-placeholder">
                                {profilePictureUrl() ? (
                                    <img src={profilePictureUrl()} alt="Profile" class="profile-avatar-img"/>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="avatar-icon">
                                        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            {isEditing() && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        style={{ display: 'none' }}
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button type="button" onClick={handleProfilePictureUploadClick} class="upload-photo-button">
                                        Ganti Foto
                                    </button>
                                </>
                            )}
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
                                {isEditing() ? (
                                    <select id="jenis-kelamin" class="input-field" value={jenisKelamin()} onChange={handleInput(setJenisKelamin)}>
                                        <option value="">-- Pilih --</option>
                                        <option value="Pria">Pria</option>
                                        <option value="Wanita">Wanita</option>
                                    </select>
                                ) : (
                                    <input id="jenis-kelamin" type="text" class="input-field" value={jenisKelamin()} disabled/>
                                )}
                            </div>

                            <div class="detail-item">
                                <label htmlFor="sifat-kepribadian">Sifat Kepribadian</label>
                                {isEditing() ? (
                                    <select id="sifat-kepribadian" class="input-field" value={sifatKepribadian()} onChange={handleInput(setSifatKepribadian)}>
                                        <option value="">-- Pilih Sifat --</option>
                                        {daftarSifatKepribadian.map(sifat => (
                                            <option key={sifat} value={sifat}>{sifat}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input id="sifat-kepribadian" type="text" class="input-field" value={sifatKepribadian()} disabled/>
                                )}
                            </div>

                            <div class="detail-item">
                                <label htmlFor="lokasi">Lokasi</label>
                                {isEditing() ? (
                                    <select id="lokasi" class="input-field" value={lokasiId()} onChange={handleInput(setLokasiId)}>
                                        <option value="">-- Pilih Kota --</option>
                                        {daftarKota().map(kota => (
                                            <option key={kota.kota_id} value={kota.kota_id}>{kota.nama_kota}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input id="lokasi" type="text" class="input-field" value={getSelectedKotaName()} disabled/>
                                )}
                            </div>

                            <div class="detail-item">
                                <label htmlFor="pendidikan-terakhir">Pendidikan Terakhir</label>
                                <input id="pendidikan-terakhir" type="text" class="input-field" value={pendidikanTerakhir()} onInput={handleInput(setPendidikanTerakhir)} disabled={!isEditing()}/>
                            </div>

                            <div class="detail-item">
                                <label htmlFor="agama">Agama</label>
                                {isEditing() ? (
                                    <select id="agama" class="input-field" value={agama()} onChange={handleInput(setAgama)}>
                                        <option value="">-- Pilih Agama --</option>
                                        {daftarAgama.map(agamaItem => (
                                            <option key={agamaItem} value={agamaItem}>{agamaItem}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input id="agama" type="text" class="input-field" value={agama()} disabled/>
                                )}
                            </div>

                            <div class="detail-item">
                                <label htmlFor="tinggi-badan">Tinggi Badan</label>
                                <input id="tinggi-badan" type="number" class="input-field" value={tinggiBadan() !== null ? tinggiBadan() : ''} onInput={handleInput(setTinggiBadan)} disabled={!isEditing()}/>
                            </div>

                            <div class="detail-item">
                                <label htmlFor="pekerjaan">Pekerjaan</label>
                                <input id="pekerjaan" type="text" class="input-field" value={pekerjaan()} onInput={handleInput(setPekerjaan)} disabled={!isEditing()}/>
                            </div>

                            <div class="detail-item">
                                <label htmlFor="hobi">Hobi</label>
                                {isEditing() ? (
                                    <div class="hobi-checkbox-scroll-box input-field">
                                        {daftarHobi().map(hobi => (
                                            <label key={hobi.hobi_id} class="hobi-option-item">
                                                <input
                                                    type="checkbox"
                                                    value={hobi.hobi_id}
                                                    checked={hobiIds().includes(String(hobi.hobi_id))}
                                                    onChange={(e) => handleHobiCheckboxChange(String(hobi.hobi_id), e.currentTarget.checked)}
                                                />
                                                {hobi.nama_hobi}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <input id="hobi" type="text" class="input-field" value={getSelectedHobiNames()} disabled/>
                                )}
                            </div>
                        </div>

                        {/* Bagian Bio */}
                        <div class="bio-section">
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio" class="textarea-field" rows="5" value={bio()} onInput={handleInput(setBio)} disabled={!isEditing()}></textarea>
                        </div>
                    </div>
                )}

                <div class="button-container">
                    {isEditing() && (
                        <button class="action-button cancel-button" onClick={handleCancelEdit} disabled={isLoading()}>
                            Cancel
                        </button>
                    )}
                    <button class="action-button" onClick={isEditing() ? handleSaveProfile : () => setIsEditing(true)} disabled={isLoading()}>
                        {isEditing() ? 'Save Profile' : 'Edit Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
