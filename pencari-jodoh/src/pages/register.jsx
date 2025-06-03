import '../css/register_page.css';
import { createSignal, createEffect, onMount } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';

// Daftar agama di Indonesia (tidak lengkap, bisa ditambahkan)
const daftarAgama = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'];

// Daftar sifat kepribadian MBTI (lengkap)
const daftarSifatKepribadian = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

function RegisterPage() {
    let fileInputRef;
    const nav = useNavigate();
    const location = useLocation();

    const initialEmail = location.state?.email || '';
    const initialPassword = location.state?.password || '';

    // State untuk nilai input form
    const [email, setEmail] = createSignal(initialEmail);
    const [password, setPassword] = createSignal(initialPassword);
    const [nama, setNama] = createSignal('');
    const [tanggalLahir, setTanggalLahir] = createSignal('');
    const [jenisKelamin, setJenisKelamin] = createSignal('');
    const [sifatKepribadian, setSifatKepribadian] = createSignal('');
    const [kotaId, setKotaId] = createSignal(''); // Menggunakan kotaId
    const [pendidikanTerakhir, setPendidikanTerakhir] = createSignal('');
    const [agama, setAgama] = createSignal('');
    const [tinggiBadan, setTinggiBadan] = createSignal('');
    const [pekerjaan, setPekerjaan] = createSignal('');
    const [hobiList, setHobiList] = createSignal([]); // Array untuk menyimpan hobi yang dipilih (ID Hobi)
    const [bio, setBio] = createSignal('');
    const [profilePicture, setProfilePicture] = createSignal(null);

    // State untuk menyimpan data dari server
    const [daftarKota, setDaftarKota] = createSignal([]);
    const [daftarHobi, setDaftarHobi] = createSignal([]);

    const handleInputChange = (event) => {
        const { name, value } = event.currentTarget;
        switch (name) {
            case 'nama': setNama(value); break;
            case 'tanggalLahir': setTanggalLahir(value); break;
            case 'jenisKelamin': setJenisKelamin(value); break;
            case 'sifat': setSifatKepribadian(value); break;
            case 'kota': setKotaId(value); break; // Menggunakan value dari option kota
            case 'pendidikan': setPendidikanTerakhir(value); break;
            case 'agama': setAgama(value); break;
            case 'tinggi': setTinggiBadan(value ? parseInt(value, 10) : undefined); break;
            case 'pekerjaan': setPekerjaan(value); break;
            case 'bio': setBio(value); break;
            default: break;
        }
    };

    // Fungsi untuk menangani perubahan pada checkbox hobi (tetap sama)
    const handleHobiCheckboxChange = (hobiId, isChecked) => {
        if (isChecked) {
            setHobiList([...hobiList(), hobiId]);
        } else {
            setHobiList(hobiList().filter(id => id !== hobiId));
        }
    };

    const handleFileClick = () => {
        fileInputRef.click();
    };

    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        setProfilePicture(file);
    };

    const handleDeleteFile = () => {
        if (fileInputRef) {
            fileInputRef.value = null;
        }
        setProfilePicture(null);
    };

    // Fetch data kota dan hobi dari server saat komponen mount
    onMount(async () => {
        // Redirect jika email atau password tidak ada (akses langsung ke register)
        if (!initialEmail || !initialPassword) {
            nav('/signup', { replace: true }); // Kembali ke halaman signup
            return;
        }

        try {
            const kotaResponse = await fetch('http://localhost:3001/users/kota'); // Endpoint untuk mendapatkan daftar kota
            if (kotaResponse.ok) {
                const data = await kotaResponse.json();
                setDaftarKota(data.kota); // Asumsi responsnya { kota: [...] }
            } else {
                console.error('Gagal mengambil daftar kota');
            }

            const hobiResponse = await fetch('http://localhost:3001/users/hobi'); // Endpoint untuk mendapatkan daftar hobi
            if (hobiResponse.ok) {
                const data = await hobiResponse.json();
                setDaftarHobi(data.hobi); // Asumsi responsnya { hobi: [...] }
            } else {
                console.error('Gagal mengambil daftar hobi');
            }
        } catch (error) {
            console.error('Error fetching kota dan hobi:', error);
        }
    });

    async function handleRegisterBtn(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('email', email());
        formData.append('password', password());
        formData.append('nama', nama());
        formData.append('tanggal_lahir', tanggalLahir());
        formData.append('jenis_kelamin', jenisKelamin());
        formData.append('sifat_kepribadian', sifatKepribadian());
        formData.append('kota_id', kotaId()); // Kirim kota_id
        formData.append('pendidikan_terakhir', pendidikanTerakhir());
        formData.append('agama', agama());
        const tinggi = tinggiBadan();
        if (tinggi !== undefined) {
            formData.append('tinggi_badan', tinggi);
        }
        formData.append('pekerjaan', pekerjaan());
        formData.append('hobi', JSON.stringify(hobiList())); // Kirim array hobi sebagai JSON
        const bioText = bio();
        if (bioText) {
            formData.append('bio', bioText);
        }
        if (profilePicture()) {
            formData.append('profile_picture', profilePicture());
        }

        try {
            const response = await fetch('http://localhost:3001/users/register', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Registrasi berhasil:', result);
                nav('/login');
            } else {
                const error = await response.json();
                console.error('Registrasi gagal:', error);
            }
        } catch (error) {
            console.error('Error saat mengirim data registrasi:', error);
        }
    }

    return (
        <>
            <div class="register-page-background">
                <div id="containerRegister">
                    <h2>Data Diri</h2>
                    <form className="form-layout" onSubmit={handleRegisterBtn}>
                        <div className="form-kiri">
                            <label htmlFor="nama">Nama<br/>
                                <input type="text" name="nama" className="input" value={nama()} onInput={handleInputChange} required />
                            </label>

                            <label htmlFor="jenisKelamin">JenisKelamin<br/>
                                <select name="jenisKelamin" id="jenisKelamin" className="input" value={jenisKelamin()} onChange={(e) => setJenisKelamin(e.currentTarget.value)} required>
                                    <option value="">-- Pilih --</option>
                                    <option value="Pria">Pria</option>
                                    <option value="Wanita">Wanita</option>
                                </select>
                            </label>

                            <label htmlFor="lokasi">Lokasi<br/>
                                <select name="kota" id="lokasi" className="input" value={kotaId()} onChange={handleInputChange}>
                                    <option value="">-- Pilih Kota --</option>
                                    {daftarKota().map(kota => (
                                        <option key={kota.kota_id} value={kota.kota_id}>{kota.nama_kota}</option>
                                    ))}
                                </select>
                            </label>

                            <label htmlFor="agama">Agama<br/>
                                <select name="agama" id="agama" className="input" value={agama()} onChange={handleInputChange}>
                                    <option value="">-- Pilih Agama --</option>
                                    {daftarAgama.map(agamaItem => (
                                        <option key={agamaItem} value={agamaItem}>{agamaItem}</option>
                                    ))}
                                </select>
                            </label>

                            <label htmlFor="pekerjaan">Pekerjaan<br/>
                                <input type="text" id="pekerjaan" name="pekerjaan" className="input" value={pekerjaan()} onInput={handleInputChange} />
                            </label>
                        </div>

                        <div className="form-tengah">
                            <label htmlFor="tanggalLahir">Tanggal Lahir<br/>
                                <input type="date" id="tanggalLahir" name="tanggalLahir" className="input" value={tanggalLahir()} onInput={handleInputChange} required />
                            </label>

                            <label htmlFor="sifat">Sifat kepribadian<br/>
                                <select name="sifat" id="sifat" className="input" value={sifatKepribadian()} onChange={handleInputChange}>
                                    <option value="">-- Pilih Sifat --</option>
                                    {daftarSifatKepribadian.map(sifat => (
                                        <option key={sifat} value={sifat}>{sifat}</option>
                                    ))}
                                </select>
                            </label>

                            <label htmlFor="pendidikan">Pendidikan terakhir<br/>
                                <input type="text" id="pendidikan" name="pendidikan" className="input" value={pendidikanTerakhir()} onInput={handleInputChange} />
                            </label>

                            <label htmlFor="tinggi">Tinggi Badan<br/>
                                <input type="number" id="tinggi" name="tinggi" className="input" value={tinggiBadan()} onInput={handleInputChange} />
                            </label>

                            <label htmlFor="hobi">Hobi<br/>
                                <div className="hobi-checkbox-scroll-box input" id="inputHobi"> {/* Tambahkan class 'input' untuk styling dasar */}
                                    {daftarHobi().map(hobi => (
                                        <label key={hobi.hobi_id} className="hobi-option-item">
                                            <input
                                                type="checkbox"
                                                value={hobi.hobi_id}
                                                checked={hobiList().includes(String(hobi.hobi_id))} // Pastikan perbandingan tipe data string
                                                onChange={(e) => handleHobiCheckboxChange(String(hobi.hobi_id), e.currentTarget.checked)}
                                            />
                                            {hobi.nama_hobi}
                                        </label>
                                    ))}
                                </div>
                            </label>
                        </div>

                        <div className="form-kanan">
                            <label className="upload-label">Upload Foto</label>
                            <div className="upload-box">
                                <input type="file" name="foto" accept="image/png, image/jpeg" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
                                <button type="button" onClick={handleFileClick} className="choose-btn">
                                    Pilih Foto
                                </button>
                                <button type="button" onClick={handleDeleteFile} className="delete-btn">
                                    Hapus
                                </button>
                                {profilePicture() && <p>Foto terpilih: {profilePicture().name}</p>}
                            </div>
                        </div>

                        <div className="bio-section">
                            <label>Bio<br/>
                                <textarea name="bio" rows="5" className="input" value={bio()} onInput={handleInputChange} />
                            </label>
                        </div>

                        <div className="button-wrapper">
                            <button type="submit" className="button">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;
