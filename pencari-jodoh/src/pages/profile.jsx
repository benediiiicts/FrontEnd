import { createStore } from 'solid-js/store';
import '../css/profile_page.css';
import Header from './header';
import { useNavigate } from "@solidjs/router";
import { createSignal, onMount } from 'solid-js';

function ProfilePage() {
    const navigate = useNavigate();
    let fileInputRef;

    const [isEditing, setIsEditing] = createSignal(false);

    const [daftarKota, setDaftarKota] = createSignal([]);
    const [daftarHobi, setDaftarHobi] = createSignal([]);
    const [daftarAgama, setDaftarAgama] = createSignal([]);
    const [daftarSifatKepribadian, setDaftarSifatKepribadian] = createSignal([]);

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
        const userId = localStorage.getItem('userId');

        if (!authToken || !userId) {
            console.log('onMount: Tidak ada token atau ID user. Mengarahkan ke halaman login.');
            navigate('/login', { replace: true });
            return;
        }

        try {
            const [kotaRes, hobiRes, agamaRes, kepribadianRes] = await Promise.all([
                fetch('http://localhost:3001/data/kota'),
                fetch('http://localhost:3001/data/hobi'),
                fetch('http://localhost:3001/data/agama'),
                fetch('http://localhost:3001/data/kepribadian')
            ]);

            if (kotaRes.ok) {
                const data = await kotaRes.json();
                setDaftarKota(data.kota);
            } else {
                console.error('Gagal mengambil data kota saat onMount');
            }
            if (hobiRes.ok) {
                const data = await hobiRes.json();
                setDaftarHobi(data.hobi);
            } else {
                console.error('Gagal mengambil data hobi saat onMount');
            }
            if (agamaRes.ok) {
                const data = await agamaRes.json();
                setDaftarAgama(data.agama);
            } else {
                console.error('Gagal mengambil data agama saat onMount');
            }
            if (kepribadianRes.ok) {
                const data = await kepribadianRes.json();
                setDaftarSifatKepribadian(data.kepribadian);
            } else {
                console.error('Gagal mengambil data kepribadian saat onMount');
            }

            const userProfileResponse = await fetch('http://localhost:3001/user/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    idUser: userId,
                }),
            });

            if (userProfileResponse.ok) {
                const data = await userProfileResponse.json();
                const dataProfile = data.user;

                const initialIdHobiList = dataProfile.idHobiList ? dataProfile.idHobiList.map(String) : [];
                const initialHobiList = dataProfile.hobiList || [];

                setDataAwal({
                    nama: dataProfile.nama || '',
                    tanggalLahir: dataProfile.tanggal_lahir || '',
                    jenisKelamin: dataProfile.jenis_kelamin || '',
                    idKota: dataProfile.kota_id || null,
                    kota: dataProfile.nama_kota || '',
                    idKepribadian: dataProfile.kepribadian_id || null,
                    kepribadian: dataProfile.jenis_kepribadian || '',
                    idAgama: dataProfile.agama_id || null,
                    agama: dataProfile.nama_agama || '',
                    idHobiList: initialIdHobiList,
                    hobiList: initialHobiList,
                    pendidikanTerakhir: dataProfile.pendidikan_terakhir || '',
                    tinggiBadan: dataProfile.tinggi_badan || null,
                    pekerjaan: dataProfile.pekerjaan || '',
                    profilePicture: dataProfile.profile_picture || null,
                    bio: dataProfile.bio || '',
                });

                setDataBaru({
                    nama: dataProfile.nama || '',
                    tanggalLahir: dataProfile.tanggal_lahir || '',
                    jenisKelamin: dataProfile.jenis_kelamin || '',
                    idKota: dataProfile.kota_id || null,
                    kota: dataProfile.nama_kota || '',
                    idKepribadian: dataProfile.kepribadian_id || null,
                    kepribadian: dataProfile.jenis_kepribadian || '',
                    idAgama: dataProfile.agama_id || null,
                    agama: dataProfile.nama_agama || '',
                    idHobiList: initialIdHobiList,
                    hobiList: initialHobiList,
                    pendidikanTerakhir: dataProfile.pendidikan_terakhir || '',
                    tinggiBadan: dataProfile.tinggi_badan || null,
                    pekerjaan: dataProfile.pekerjaan || '',
                    profilePicture: dataProfile.profile_picture || null,
                    profilePictureUrl: dataProfile.profile_picture || '',
                    bio: dataProfile.bio || '',
                });
            } else {
                console.error('Gagal mengambil data profile saat onMount');
                const errorData = await userProfileResponse.json();
                console.error('Error detail:', errorData);
            }

        } catch (error) {
            console.error('onMount: Error saat fetch data:', error);
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
        const { name, value, selectedOptions } = event.currentTarget;
        let idFromOption = null;
        if (selectedOptions && selectedOptions.length > 0) {
            idFromOption = selectedOptions[0].id;
        }

        switch (name) {
            case 'nama': setDataBaru('nama', value); break;
            case 'tanggalLahir': setDataBaru('tanggalLahir', value); break;
            case 'jenisKelamin': setDataBaru('jenisKelamin', value); break;
            case 'kota':
                setDataBaru('idKota', idFromOption ? parseInt(idFromOption, 10) : null);
                setDataBaru('kota', value);
                break;
            case 'kepribadian':
                setDataBaru('idKepribadian', idFromOption ? parseInt(idFromOption, 10) : null);
                setDataBaru('kepribadian', value);
                break;
            case 'agama':
                setDataBaru('idAgama', idFromOption ? parseInt(idFromOption, 10) : null);
                setDataBaru('agama', value);
                break;
            case 'pendidikan': setDataBaru('pendidikanTerakhir', value); break;
            case 'tinggiBadan': setDataBaru('tinggiBadan', parseInt(value, 10) || null); break;
            case 'pekerjaan': setDataBaru('pekerjaan', value); break;
            case 'bio': setDataBaru('bio', value); break;
        }
    };

    const handleHobiCheckboxChange = (hobiId, isChecked, hobiName) => {
        const id = String(hobiId);

        setDataBaru(prev => {
            const currentIdHobiList = Array.isArray(prev.idHobiList) ? prev.idHobiList : [];
            const currentHobiList = Array.isArray(prev.hobiList) ? prev.hobiList : [];

            let newIdHobiList;
            let newHobiList;

            if (isChecked) {
                if (!currentIdHobiList.includes(id)) {
                    newIdHobiList = [...currentIdHobiList, id];
                    newHobiList = [...currentHobiList, hobiName];
                } else {
                    newIdHobiList = currentIdHobiList;
                    newHobiList = currentHobiList;
                }
            } else {
                newIdHobiList = currentIdHobiList.filter(item => item !== id);
                newHobiList = currentHobiList.filter(name => name !== hobiName);
            }

            return {
                ...prev,
                idHobiList: newIdHobiList,
                hobiList: newHobiList,
            };
        });
    };

    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            setDataBaru('profilePicture', file);
            setDataBaru('profilePictureUrl', URL.createObjectURL(file));
        } else {
            setDataBaru('profilePicture', dataAwal.profilePicture);
            setDataBaru('profilePictureUrl', dataAwal.profilePicture);
        }
    };

    const handleProfilePictureUploadClick = () => {
        fileInputRef.click();
    };

    const resetDataBaru = () => {
        setDataBaru({ ...dataAwal, profilePictureUrl: dataAwal.profilePicture || '' });
    };

    const handleCancelEdit = () => {
        resetDataBaru();
        setIsEditing(false);
    };

    const handleSaveBtn = async () => {
        const userId = localStorage.getItem('userId');
        const authToken = localStorage.getItem('authToken');

        const formData = new FormData();
        formData.append('nama', dataBaru.nama);
        formData.append('tanggal_lahir', dataBaru.tanggalLahir);
        formData.append('jenis_kelamin', dataBaru.jenisKelamin);
        formData.append('kepribadian_id', dataBaru.idKepribadian || '');
        formData.append('kota_id', dataBaru.idKota || '');
        formData.append('pendidikan_terakhir', dataBaru.pendidikanTerakhir);
        formData.append('agama_id', dataBaru.idAgama || ''); 
        formData.append('pekerjaan', dataBaru.pekerjaan);
        formData.append('hobiList', JSON.stringify(dataBaru.idHobiList)); 
        formData.append('bio', dataBaru.bio);
        formData.append('tinggi_badan', dataBaru.tinggiBadan || ''); 

        if (dataBaru.profilePicture instanceof File) {
            formData.append('profile_picture', dataBaru.profilePicture);
        }

        try {
            const userProfileUpdateResponse = await fetch(`http://localhost:3001/user/updateProfile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData,
            });

            const responseData = await userProfileUpdateResponse.json();

            if (userProfileUpdateResponse.ok) {
                console.log('Profil berhasil diupdate!');
                const reFetchProfileResponse = await fetch('http://localhost:3001/user/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ idUser: userId }),
                });

                if (reFetchProfileResponse.ok) {
                    const updatedProfileData = await reFetchProfileResponse.json();
                    const profile = updatedProfileData.user;
                    
                    const initialIdHobiList = profile.idHobiList ? profile.idHobiList.map(String) : [];
                    const initialHobiList = profile.hobiList || [];

                    setDataAwal({
                        nama: profile.nama || '',
                        tanggalLahir: profile.tanggal_lahir || '',
                        jenisKelamin: profile.jenis_kelamin || '',
                        idKota: profile.kota_id || null,
                        kota: profile.nama_kota || '',
                        idKepribadian: profile.kepribadian_id || null,
                        kepribadian: profile.jenis_kepribadian || '',
                        idAgama: profile.agama_id || null,
                        agama: profile.nama_agama || '',
                        idHobiList: initialIdHobiList,
                        hobiList: initialHobiList,
                        pendidikanTerakhir: profile.pendidikan_terakhir || '',
                        tinggiBadan: profile.tinggi_badan || null,
                        pekerjaan: profile.pekerjaan || '',
                        profilePicture: profile.profile_picture || null,
                        bio: profile.bio || '',
                    });
                    setDataBaru({ ...dataAwal(), profilePictureUrl: profile.profile_picture || '' });

                } else {
                    console.error('Gagal me-refresh data profil setelah update.');
                }
                setIsEditing(false);
            } else {
                console.error(`Error updating profile: ${responseData.error}`);
                alert(`Gagal menyimpan profil: ${responseData.error || 'Terjadi kesalahan.'}`);
            }
        } catch (error) {
            console.error('Error in handleSaveBtn:', error);
            alert('Terjadi kesalahan jaringan atau server saat menyimpan profil.');
        }
    };

    return (
        <div class="profile-page-container">
            <Header />
            <div class="profile-card">
                <div class="profile-main-content">
                    <div class="profile-avatar-section">
                        <div class="profile-avatar-placeholder">
                            {dataBaru.profilePictureUrl ? (
                                <img src={dataBaru.profilePictureUrl} alt="Profile" class="profile-avatar-img" />
                            ) : (
                                <img src={dataAwal.profilePicture} alt="Profile" class="profile-avatar-img" />
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
                            <input name="nama" type="text" class="input-field" value={isEditing() ? dataBaru.nama : dataAwal.nama} onInput={handleInputChange} disabled={!isEditing()} />
                        </div>

                        <div class="detail-item">
                            <label htmlFor="tanggal-lahir">Tanggal Lahir</label>
                            <input name="tanggalLahir" type="date" class="input-field" value={formatDate(isEditing() ? dataBaru.tanggalLahir : dataAwal.tanggalLahir)} onInput={handleInputChange} disabled={!isEditing()} />
                        </div>

                        <div class="detail-item">
                            <label htmlFor="jenis-kelamin">Jenis Kelamin</label>
                            {isEditing() ? (
                                <select name="jenisKelamin" class="input-field" value={dataBaru.jenisKelamin} onChange={handleInputChange}>
                                    <option value="">-- Pilih --</option>
                                    <option value="Pria">Pria</option>
                                    <option value="Wanita">Wanita</option>
                                </select>
                            ) : (
                                <input name="jenisKelamin" type="text" class="input-field" value={dataAwal.jenisKelamin} disabled />
                            )}
                        </div>

                        <div class="detail-item">
                            <label htmlFor="sifat-kepribadian">Sifat Kepribadian</label>
                            {isEditing() ? (
                                <select name='kepribadian' class="input-field" value={dataBaru.kepribadian || ''} onChange={handleInputChange}>
                                    <option value="" id="">-- Pilih Sifat --</option>
                                    {daftarSifatKepribadian().map(sifat => (
                                        <option key={sifat.kepribadian_id} id={sifat.kepribadian_id} value={sifat.jenis_kepribadian}>{sifat.jenis_kepribadian}</option>
                                    ))}
                                </select>
                            ) : (
                                <input id={dataAwal.idKepribadian} name='kepribadian' type="text" class="input-field" value={dataAwal.kepribadian} disabled />
                            )}
                        </div>

                        <div class="detail-item">
                            <label htmlFor="lokasi">Lokasi</label>
                            {isEditing() ? (
                                <select name="kota" class="input-field" value={dataBaru.kota || ''} onChange={handleInputChange}>
                                    <option value="" id="">-- Pilih Kota --</option>
                                    {daftarKota().map(kota => (
                                        <option key={kota.kota_id} id={kota.kota_id} value={kota.nama_kota}>{kota.nama_kota}</option>
                                    ))}
                                </select>
                            ) : (
                                <input id="lokasi" type="text" class="input-field" value={dataAwal.kota} disabled />
                            )}
                        </div>

                        <div class="detail-item">
                            <label htmlFor="pendidikan-terakhir">Pendidikan Terakhir</label>
                            <input name="pendidikan" type="text" class="input-field" value={isEditing() ? dataBaru.pendidikanTerakhir : dataAwal.pendidikanTerakhir} onInput={handleInputChange} disabled={!isEditing()} />
                        </div>

                        <div class="detail-item">
                            <label htmlFor="agama">Agama</label>
                            {isEditing() ? (
                                <select name="agama" class="input-field" value={dataBaru.agama || ''} onChange={handleInputChange}>
                                    <option value="" id="">-- Pilih Agama --</option>
                                    {daftarAgama().map(agamaItem => (
                                        <option key={agamaItem.agama_id} id={agamaItem.agama_id} value={agamaItem.nama_agama}>{agamaItem.nama_agama}</option>
                                    ))}
                                </select>
                            ) : (
                                <input id="agama" type="text" class="input-field" value={dataAwal.agama} disabled />
                            )}
                        </div>

                        <div class="detail-item">
                            <label htmlFor="tinggi-badan">Tinggi Badan</label>
                            <input name="tinggiBadan" type="number" class="input-field" value={isEditing() ? (dataBaru.tinggiBadan === null ? '' : dataBaru.tinggiBadan) : dataAwal.tinggiBadan} onInput={handleInputChange} disabled={!isEditing()} />
                        </div>

                        <div class="detail-item">
                            <label htmlFor="pekerjaan">Pekerjaan</label>
                            <input name="pekerjaan" type="text" class="input-field" value={isEditing() ? dataBaru.pekerjaan : dataAwal.pekerjaan} onInput={handleInputChange} disabled={!isEditing()} />
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
                                                checked={dataBaru.idHobiList.includes(String(hobi.hobi_id))}
                                                onChange={(e) => handleHobiCheckboxChange(hobi.hobi_id, e.currentTarget.checked, hobi.nama_hobi)}
                                            />
                                            {hobi.nama_hobi}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <input name="hobi" type="text" class="input-field" value={dataAwal.hobiList.join(', ')} disabled />
                            )}
                        </div>
                    </div>

                    <div class="bio-section">
                        <label htmlFor="bio">Bio</label>
                        <textarea name="bio" class="textarea-field" rows="5" value={isEditing() ? dataBaru.bio : dataAwal.bio} onInput={handleInputChange} disabled={!isEditing()}></textarea>
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
