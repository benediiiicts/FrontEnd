import { createStore } from 'solid-js/store';
import '../css/profile_page.css';
import Header from './header'; // Pastikan path benar
import { useNavigate } from "@solidjs/router";
import { createSignal, onMount } from 'solid-js';

function ProfilePage() {
    const navigate = useNavigate();
    let fileInputRef;
    
    const [isEditing, setIsEditing] = createSignal(false);

    const [daftarKota, setDaftarKota] = createSignal([]);
    const [daftarHobi, setDaftarHobi] = createSignal([]);
    const [daftarAgama, setDaftarAgama] = createSignal([]);
    const [daftarSifatKepribadian, setDaftarSifatKepribadian] = createSignal();

    const [dataAwal, setDataAwal] = createStore({
        nama: '',
        tanggalLahir: '',
        jenisKelamin: '',
        idKota: null,
        kota: '',
        idKepribadian: null,
        kepribadian: '',
        idAgama: null,
        agama: '',
        idHobiList: [],
        hobiList: [],
        pendidikanTerakhir: '',
        tinggiBadan: null,
        pekerjaan: '',
        profilePicture: null,
        bio: '',
    });

    const [dataBaru, setDataBaru] = createStore({
        nama: '',
        tanggalLahir: '',
        jenisKelamin: '',
        idKota: null,
        kota: '',
        idKepribadian: null,
        kepribadian: '',
        idAgama: null,
        agama: '',
        idHobiList: [],
        hobiList: [],
        pendidikanTerakhir: '',
        tinggiBadan: null,
        pekerjaan: '',
        profilePicture: null,
        profilePictureUrl: '',
        bio: '',
    });

    onMount(async () => {
        
        const authToken = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        const userId = localStorage.getItem('userId');

        if (!authToken || !userEmail || !userId) {
            console.log('onMount: Tidak ada token, email, atau ID user. Mengarahkan ke halaman login.');
            nav('/login', { replace: true });
            return;
        }

        try{
            const kotaResponse = await fetch('http://localhost:3001/data/kota');
            if(kotaResponse.ok) {
                const data = await kotaResponse.json();
                const dataKota = data.kota;
                setDaftarKota(dataKota);
            }else {
                console.error('gagal mengambil data kota saat onMount');
            }

            const hobiResponse = await fetch('http://localhost:3001/data/hobi')
            if(hobiResponse.ok) {
                const data = await hobiResponse.json();
                const dataHobi = data.hobi;
                setDaftarHobi(dataHobi);
            }else {
                console.error('gagal mengambil data hobi saat onMount');
            }

            const agamaResponse = await fetch('http://localhost:3001/data/agama')
            if(agamaResponse.ok) {
                const data = await agamaResponse.json();
                const dataAgama = data.agama;
                setDaftarAgama(dataAgama);
            }else {
                console.error('gagal mengambil data agama saat onMount');
            }

            const kepribadianResponse = await fetch('http://localhost:3001/data/kepribadian');
            if(kepribadianResponse.ok) {
                const data = await kepribadianResponse.json();
                const dataKepribadian = data.kepribadian;
                setDaftarSifatKepribadian(dataKepribadian);
            }else {
                console.error('gagal mengambil data kepribadian saat onMount');
            }

            const userProfileResponse = await fetch('http://localhost:3001/user/profile', {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                        idUser: userId,
                }),
            });
            if(userProfileResponse.ok) {
                const data = await userProfileResponse.json();
                const dataProfile = data.user;
                
                setDataAwal('nama', dataProfile.nama);
                setDataAwal('tanggalLahir', dataProfile.tanggal_lahir);
                setDataAwal('jenisKelamin', dataProfile.jenis_kelamin);
                setDataAwal('idKota', dataProfile.kota_id);
                setDataAwal('kota', dataProfile.nama_kota);
                setDataAwal('idKepribadian', dataProfile.kepribadian_id);
                setDataAwal('kepribadian', dataProfile.jenis_kepribadian);
                setDataAwal('idAgama', dataProfile.agama_id);
                setDataAwal('agama', dataProfile.nama_agama);
                setDataAwal('idHobiList', dataProfile.idHobiList);
                setDataAwal('hobiList', dataProfile.hobiList);
                setDataAwal('pendidikanTerakhir', dataProfile.pendidikan_terakhir);
                setDataAwal('tinggiBadan', dataProfile.tinggi_badan);
                setDataAwal('pekerjaan', dataProfile.pekerjaan);
                setDataAwal('profilePicture', dataProfile.profile_picture);
                setDataAwal('bio', dataProfile.bio);

                setDataBaru('nama', dataProfile.nama);
                setDataBaru('tanggalLahir', dataProfile.tanggal_lahir);
                setDataBaru('jenisKelamin', dataProfile.jenis_kelamin);
                setDataBaru('idKota', dataProfile.kota_id);
                setDataBaru('kota', dataProfile.nama_kota);
                setDataBaru('idKepribadian', dataProfile.kepribadian_id);
                setDataBaru('kepribadian', dataProfile.jenis_kepribadian);
                setDataBaru('idAgama', dataProfile.agama_id);
                setDataBaru('agama', dataProfile.nama_agama);
                setDataBaru('idHobiList', dataProfile.idHobiList);
                setDataBaru('hobiList', dataProfile.hobiList);
                setDataBaru('pendidikanTerakhir', dataProfile.pendidikan_terakhir);
                setDataBaru('tinggiBadan', dataProfile.tinggi_badan);
                setDataBaru('pekerjaan', dataProfile.pekerjaan);
                setDataBaru('profilePicture', dataProfile.profile_picture);
                setDataBaru('bio', dataProfile.bio);
            }else {
                console.error('gagal mengambil data profile saat onMount');
            }

        }catch (error) {
            console.error('onMount: Error saat fetch data:', err);
        }   
    });

    const formatDate = (dateString) => {
        if (!dateString) return ''; 
        
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
            console.warn(`Invalid date string: ${dateString}`);
            return '';
        }

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleInputChange = (event) => {
        const {name, value} = event.currentTarget;
        switch(name) {
            case 'nama': setDataBaru('nama', value); break;
            case 'tanggalLahir': setDataBaru('tanggalLahir', value); break;
            case 'jenisKelamin': setDataBaru('jenisKelamin', value); break;
            case 'kota':
                const idKota = event.currentTarget.id;
                setDataBaru('idKota', idKota);
                setDataBaru('kota', value);
                break;
            case 'kepribadian':
                const idKepribadian = event.currentTarget.id;
                setDataBaru('idKepribadian', idKepribadian);
                setDataBaru('kepribadian', value);
                break;
            case 'agama':
                const idAgama = event.currentTarget.id;
                setDataBaru('idAgama', idAgama);
                setDataBaru('agama', value);
                break;
            case 'pendidikan': setDataBaru('pendidikanTerakhir', value); break;
            case 'tinggiBadan': setDataBaru('tinggiBadan', parseInt(value)); break;
            case 'pekerjaan': setDataBaru('pekerjaan', value); break;
            case 'bio': setDataBaru('bio', value); break;
        }
    };

    const handleHobiCheckboxChange = (hobiId, isChecked, hobiName) => {
        // Pastikan hobiId adalah string untuk konsistensi jika Anda menyimpannya sebagai string
        const id = String(hobiId);

        setDataBaru(prev => {
            const currentIdHobiList = Array.isArray(prev.idHobiList) ? prev.idHobiList : [];
            const currentHobiList = Array.isArray(prev.hobiList) ? prev.hobiList : [];

            let newIdHobiList;
            let newHobiList;

            if (isChecked) {
                // Tambahkan ID hobi jika belum ada
                if (!currentIdHobiList.includes(id)) {
                    newIdHobiList = [...currentIdHobiList, id];
                    newHobiList = [...currentHobiList, hobiName];
                } else {
                    newIdHobiList = currentIdHobiList;
                    newHobiList = currentHobiList;
                }
            } else {
                // Hapus ID hobi jika ada
                newIdHobiList = currentIdHobiList.filter(item => item !== id);
                newHobiList = currentHobiList.filter(name => name !== hobiName);
            }

            return {
                ...prev,
                idHobiList: newIdHobiList,
                hobiList: newHobiList, // Penting: update juga hobiList jika Anda menggunakannya untuk tampilan
            };
        });
    };

    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        setDataBaru('profilePicture', file);
        setDataBaru('profilePictureUrl', URL.createObjectURL(file));
    };

    const handleProfilePictureUploadClick = () => {
        fileInputRef.click();
    };

    const resetDataBaru = () => {
        setDataBaru('nama', dataAwal.nama);
        setDataBaru('tanggalLahir', dataAwal.tanggalLahir);
        setDataBaru('jenisKelamin', dataAwal.jenisKelamin);
        setDataBaru('idKota', dataAwal.idKota);
        setDataBaru('kota', dataAwal.kota);
        setDataBaru('idKepribadian', dataAwal.idKepribadian);
        setDataBaru('kepribadian', dataAwal.kepribadian);
        setDataBaru('idAgama', dataAwal.idAgama);
        setDataBaru('agama', dataAwal.agama);
        setDataBaru('idHobiList', dataAwal.idHobiList);
        setDataBaru('hobiList', dataAwal.hobiList);
        setDataBaru('pendidikanTerakhir', dataAwal.pendidikanTerakhir);
        setDataBaru('tinggiBadan', dataAwal.tinggiBadan);
        setDataBaru('pekerjaan', dataAwal.pekerjaan);
        setDataBaru('profilePicture', dataAwal.profilePicture);
        setDataBaru('profilePictureUrl', '');
        setDataBaru('bio', dataAwal.bio);
    };

    const handleCancelEdit = () => {
        resetDataBaru();
        setIsEditing(false);
    };

    const handleSaveBtn = async() => {
        setDataAwal({ ...dataBaru });

        const formData = new FormData();
        formData.append('nama', dataAwal.nama);
        formData.append('tanggal_lahir', dataAwal.tanggalLahir);
        formData.append('jenis_kelamin', dataAwal.jenisKelamin);
        formData.append('kepribadian_id', dataAwal.idKepribadian);
        formData.append('kota_id', dataAwal.idKota);
        formData.append('pendidikan_terakhir', dataAwal.pendidikanTerakhir);
        formData.append('agama_id', dataAwal.idAgama);
        formData.append('pekerjaan', dataAwal.pekerjaan);
        formData.append('hobiList', JSON.stringify(dataAwal.idHobiList));
        formData.append('bio', dataAwal.bio);
        formData.append('profile_picture', dataBaru.profilePicture);
        formData.append('tinggi_badan', dataAwal.tinggiBadan);

        const userProfileUpdateResponse = await fetch(`http://localhost:3001/user/updateProfile/${localStorage.getItem('userId')}`, {
                method: 'PUT',
                body: formData,
        });

        const data = await userProfileUpdateResponse.json();
        if(userProfileUpdateResponse.ok) {
            console.log('Profil berhasil diupdate!');
        }else {
            console.error(`error: ${data.error}`);
        }


        setIsEditing(false);
    };

    return (
        <div class="profile-page-container">
            <Header />
            <div class="profile-card">
                <div class="profile-main-content">
                    <div class="profile-avatar-section">
                        <div class="profile-avatar-placeholder">
                            {dataBaru.profilePictureUrl ? (
                                <img src={dataBaru.profilePictureUrl} alt="Profile" class="profile-avatar-img"/>
                            ) : (
                                <img src={dataAwal.profilePicture} alt="Profile" class="profile-avatar-img"/>
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
                            <input name="nama" type="text" class="input-field" value={dataAwal.nama} onInput={handleInputChange} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="tanggal-lahir">Tanggal Lahir</label>
                            <input name="tanggalLahir" type="date" class="input-field" value={formatDate(dataAwal.tanggalLahir)} onInput={handleInputChange} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="jenis-kelamin">Jenis Kelamin</label>
                            {isEditing() ? (
                                <select name="jenisKelamin" class="input-field" value={dataAwal.jenisKelamin} onChange={handleInputChange}>
                                    <option value="">-- Pilih --</option>
                                    <option value="Pria">Pria</option>
                                    <option value="Wanita">Wanita</option>
                                </select>
                            ) : (
                                <input name="jenisKelamin" type="text" class="input-field" value={dataAwal.jenisKelamin} disabled/>
                            )}
                        </div>

                        <div class="detail-item">
                            <label htmlFor="sifat-kepribadian">Sifat Kepribadian</label>
                            {isEditing() ? (
                                <select name='kepribadian' class="input-field" value={dataAwal.kepribadian} onChange={handleInputChange}>
                                    <option value="">-- Pilih Sifat --</option>
                                    {daftarSifatKepribadian().map(sifat => (
                                        <option id={sifat.kepribadian_id} value={sifat.jenis_kepribadian}>{sifat.jenis_kepribadian}</option>
                                    ))}
                                </select>
                            ) : (
                                <input id={dataAwal.idKepribadian} name='kepribadian' type="text" class="input-field" value={dataAwal.kepribadian} disabled/>
                            )}
                        </div>

                        <div class="detail-item">
                            <label htmlFor="lokasi">Lokasi</label>
                            {isEditing() ? (
                                <select name="kota" class="input-field" value={dataAwal.kota} onChange={handleInputChange}>
                                    <option value="">-- Pilih Kota --</option>
                                    {daftarKota().map(kota => (
                                        <option id={kota.kota_id} value={kota.nama_kota}>{kota.nama_kota}</option>
                                    ))}
                                </select>
                            ) : (
                                <input id="lokasi" type="text" class="input-field" value={dataAwal.kota} disabled/>
                            )}
                        </div>

                        <div class="detail-item">
                            <label htmlFor="pendidikan-terakhir">Pendidikan Terakhir</label>
                            <input name="pendidikan" type="text" class="input-field" value={dataAwal.pendidikanTerakhir} onInput={handleInputChange} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="agama">Agama</label>
                            {isEditing() ? (
                                <select name="agama" class="input-field" value={dataAwal.agama} onChange={handleInputChange}>
                                    <option value="">-- Pilih Agama --</option>
                                    {daftarAgama().map(agamaItem => (
                                        <option id={agamaItem.agama_id} value={agamaItem.nama_agama}>{agamaItem.nama_agama}</option>
                                    ))}
                                </select>
                            ) : (
                                <input id="agama" type="text" class="input-field" value={dataAwal.agama} disabled/>
                            )}
                        </div>

                        <div class="detail-item">
                            <label htmlFor="tinggi-badan">Tinggi Badan</label>
                            <input nama="tinggiBadan" type="number" class="input-field" value={dataAwal.tinggiBadan} onInput={handleInputChange} disabled={!isEditing()}/>
                        </div>

                        <div class="detail-item">
                            <label htmlFor="pekerjaan">Pekerjaan</label>
                            <input name="pekerjaan" type="text" class="input-field" value={dataAwal.pekerjaan} onInput={handleInputChange} disabled={!isEditing()}/>
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
                                                // Cek apakah ID hobi ada di dataBaru.idHobiList
                                                checked={dataBaru.idHobiList.includes(String(hobi.hobi_id))}
                                                onChange={(e) => handleHobiCheckboxChange(hobi.hobi_id, e.currentTarget.checked, hobi.nama_hobi)}
                                            />
                                            {hobi.nama_hobi}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <input name="hobi" type="text" class="input-field" value={dataAwal.hobiList.join(', ')} disabled/>
                            )}
                        </div>
                    </div>

                    {/* Bagian Bio */}
                    <div class="bio-section">
                        <label htmlFor="bio">Bio</label>
                        <textarea name="bio" class="textarea-field" rows="5" value={dataAwal.bio} onInput={handleInputChange} disabled={!isEditing()}></textarea>
                    </div>
                </div>

                <div class="button-container">
                    {isEditing() && (
                        <button class="action-button cancel-button" onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    )}
                    <button class="action-button" onClick={() => setIsEditing(true)} disabled={isEditing()}>Edit Profile</button>
                    <button class="action-button" onClick={handleSaveBtn} disabled={!isEditing()}>Save Profile</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
