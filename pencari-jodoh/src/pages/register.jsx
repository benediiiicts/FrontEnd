import '../css/register_page.css';
import { createSignal, onMount } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import { createStore } from 'solid-js/store';

function RegisterPage() {
    let fileInputRef;
    const nav = useNavigate();
    const location = useLocation();
    
    let userEmail;
    let userPassword;

    if(location.state) {
        userEmail = location.state.email;
        userPassword = location.state.password;
    }

    const [userDetails, setUserDetails] = createStore({
        email: userEmail,
        password: userPassword,
        nama: '',
        tanggalLahir: '',
        jenisKelamin: '',
        kepribadian_id: null,
        idKota: null,
        pendidikanTerakhir: '',
        agama_id: null,
        tinggiBadan: null,
        pekerjaan: '',
        hobiList: [],
        bio: '',
        profilePicture: null,
        profilePictureUrl: null,
    });

    const [dataDariServer, setDataDariServer] = createStore({
        listKota: [],
        listHobi: [],
        listKepribadian: [],
        listAgama: [],
    });

    const [uniqueError, setUniqueError] = createSignal('');
    const [hobiKosongError, setHobiKosongError] = createSignal('');

    const handleInputChange = (event) => {
        const { name, value } = event.currentTarget;
        switch (name) {
            case 'nama': setUserDetails('nama', value); break;
            case 'tanggalLahir': setUserDetails('tanggalLahir', value); break;
            case 'jenisKelamin': setUserDetails('jenisKelamin', value); break;
            case 'sifat': setUserDetails('kepribadian_id', value); break;
            case 'kota': setUserDetails('idKota', value); break; 
            case 'pendidikan': setUserDetails('pendidikanTerakhir',value); break;
            case 'agama': setUserDetails('agama_id', value); break;
            case 'tinggi': setUserDetails('tinggiBadan', parseInt(value)); break;
            case 'pekerjaan': setUserDetails('pekerjaan', value); break;
            case 'bio': setUserDetails('bio', value); break;
            default: break;
        }
    };

    const handleHobiCheckboxChange = (hobiId, isChecked) => {
        if (isChecked) {
            setUserDetails('hobiList', hobiList => [...hobiList, hobiId]);
        } else {
            setUserDetails('hobiList', hobiList => hobiList.filter(id => id !== hobiId));
        }
    };

    const handleFileClick = () => {
        fileInputRef.click();
    };

    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        setUserDetails('profilePicture', file);
        setUserDetails('profilePictureUrl', URL.createObjectURL(file));
    };

    const handleDeleteFile = () => {
        if (fileInputRef) {
            fileInputRef.value = null;
        }
        setUserDetails('profilePicture', null);
        setUserDetails('profilePictureUrl', null);
    };

    const registerBtnStyle = () => {
        if(hobiKosongError()) {
            return {
                cursor: 'not-allowed',
                opacity: 0.5,
            };
        }else {
            return {
                cursor: 'pointer',
            };
        }
    }

    // Fetch data kota dan hobi dari server saat komponen mount
    onMount(async () => {
        // Redirect jika email atau password tidak ada (akses langsung ke register)
        if (!userEmail || !userPassword) {
            nav('/signup', { replace: true }); // Kembali ke halaman signup
            return;
        }

        try {
            const kotaResponse = await fetch('http://localhost:3001/data/kota');
            if (kotaResponse.ok) {
                const data = await kotaResponse.json();
                setDataDariServer('listKota', data.kota);
            } else {
                console.error('Gagal mengambil daftar kota');
            }

            const hobiResponse = await fetch('http://localhost:3001/data/hobi');
            if (hobiResponse.ok) {
                const data = await hobiResponse.json();
                setDataDariServer('listHobi', data.hobi);
            } else {
                console.error('Gagal mengambil daftar hobi');
            }

            const kepribadianResponse = await fetch('http://localhost:3001/data/kepribadian');
            if (kepribadianResponse.ok) {
                const data = await kepribadianResponse.json();
                setDataDariServer('listKepribadian', data.kepribadian);
            } else {
                console.error('Gagal mengambil daftar kepribadian');
            }

            const agamaResponse = await fetch('http://localhost:3001/data/agama');
            if (agamaResponse.ok) {
                const data = await agamaResponse.json();
                setDataDariServer('listAgama', data.agama);
            } else {
                console.error('Gagal mengambil daftar agama');
            }
        } catch (error) {
            console.error('Error fetching kota dan hobi:', error);
        }
    });

    async function handleRegisterBtn(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('email', userDetails.email);
        formData.append('password', userDetails.password);
        formData.append('nama', userDetails.nama);
        formData.append('tanggal_lahir', userDetails.tanggalLahir);
        formData.append('jenis_kelamin', userDetails.jenisKelamin);
        formData.append('kepribadian_id', userDetails.kepribadian_id);
        formData.append('kota_id', userDetails.idKota);
        formData.append('pendidikan_terakhir', userDetails.pendidikanTerakhir);
        formData.append('agama_id', userDetails.agama_id);
        formData.append('pekerjaan', userDetails.pekerjaan);
        formData.append('pendidikanTerakhir', userDetails.pendidikanTerakhir);
        formData.append('hobiList', JSON.stringify(userDetails.hobiList));
        formData.append('bio', userDetails.bio);
        formData.append('profile_picture', userDetails.profilePicture);
        formData.append('tinggi_badan', userDetails.tinggiBadan);

        try {
            const response = await fetch('http://localhost:3001/user/register', {
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
                if(response.status === 409) {
                    setUniqueError('Email sudah terdaftar. Silakan gunakan email lain.');
                }
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
                                <input type="text" name="nama" className="input" value={userDetails.nama} onInput={handleInputChange} required />
                            </label>

                            <label htmlFor="jenisKelamin">JenisKelamin<br/>
                                <select name="jenisKelamin" id="jenisKelamin" className="input" value={userDetails.jenisKelamin} onChange={handleInputChange} required>
                                    <option value="">-- Pilih --</option>
                                    <option value="Pria">Pria</option>
                                    <option value="Wanita">Wanita</option>
                                </select>
                            </label>

                            <label htmlFor="lokasi">Lokasi<br/>
                                <select name="kota" id="lokasi" className="input" value={userDetails.idKota} onChange={handleInputChange} required>
                                    <option value="">-- Pilih Kota --</option>
                                    {dataDariServer.listKota.map(kota => (
                                        <option value={kota.kota_id}>{kota.nama_kota}</option>
                                    ))}
                                </select>
                            </label>

                            <label htmlFor="agama">Agama<br/>
                                <select name="agama" id="agama" className="input" value={userDetails.agama} onChange={handleInputChange} required>
                                    <option value="">-- Pilih Agama --</option>
                                    {dataDariServer.listAgama.map(agama => (
                                        <option value={agama.agama_id}>{agama.nama_agama}</option>
                                    ))}
                                </select>
                            </label>

                            <label htmlFor="pekerjaan">Pekerjaan<br/>
                                <input type="text" id="pekerjaan" name="pekerjaan" className="input" value={userDetails.pekerjaan} onInput={handleInputChange} required/>
                            </label>
                        </div>

                        <div className="form-tengah">
                            <label htmlFor="tanggalLahir">Tanggal Lahir<br/>
                                <input type="date" id="tanggalLahir" name="tanggalLahir" className="input" value={userDetails.tanggalLahir} onInput={handleInputChange} required />
                            </label>

                            <label htmlFor="sifat">Sifat kepribadian<br/>
                                <select name="sifat" id="sifat" className="input" value={userDetails.sifatKepribadian} onChange={handleInputChange} required>
                                    <option value="">-- Pilih Sifat --</option>
                                    {dataDariServer.listKepribadian.map(kepribadian => (
                                        <option value={kepribadian.kepribadian_id}>{kepribadian.jenis_kepribadian}</option>
                                    ))}
                                </select>
                            </label>

                            <label htmlFor="pendidikan">Pendidikan terakhir<br/>
                                <input type="text" id="pendidikan" name="pendidikan" className="input" value={userDetails.pendidikanTerakhir} onInput={handleInputChange} required/>
                            </label>

                            <label htmlFor="tinggi">Tinggi Badan<br/>
                                <input type="number" id="tinggi" name="tinggi" className="input" value={userDetails.tinggiBadan} onInput={handleInputChange} required/>
                            </label>

                            <label htmlFor="hobi">Hobi<br/>
                                <div className="hobi-checkbox-scroll-box input" id="inputHobi"> {/* Tambahkan class 'input' untuk styling dasar */}
                                    {dataDariServer.listHobi.map(hobi => (
                                        <label key={hobi.hobi_id} className="hobi-option-item">
                                            <input
                                                type="checkbox"
                                                value={hobi.hobi_id}
                                                checked={userDetails.hobiList.includes(String(hobi.hobi_id))} // Pastikan perbandingan tipe data string
                                                onChange={(e) => handleHobiCheckboxChange(String(hobi.hobi_id), e.currentTarget.checked)}
                                            />
                                            {hobi.nama_hobi}
                                        </label>
                                    ))}
                                </div>
                            </label>

                            <p></p>
                        </div>

                        <div className="form-kanan">
                            <label className="upload-label">Upload Foto</label>
                            <div className="upload-box">
                                <input type="file" name="foto" accept="image/png, image/jpeg" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} required/>
                                <button type="button" onClick={handleFileClick} className="choose-btn">
                                    Pilih Foto
                                </button>
                                <button type="button" onClick={handleDeleteFile} className="delete-btn">
                                    Hapus
                                </button>
                                {userDetails.profilePictureUrl && (
                                    <div>
                                        <img src={userDetails.profilePictureUrl} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bio-section">
                            <label>Bio<br/>
                                <textarea name="bio" rows="5" className="input" value={userDetails.bio} onInput={handleInputChange} required/>
                            </label>
                        </div>

                        <div className="button-wrapper">
                            <button type="submit" className="button" style={registerBtnStyle}>Sign Up</button>
                        </div>

                        <p style={{ color: 'red' }}>{uniqueError()}</p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;
