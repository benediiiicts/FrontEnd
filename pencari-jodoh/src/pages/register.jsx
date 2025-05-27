        import '../css/register_page.css';
        import { createSignal } from 'solid-js';


        function RegisterPage() {
            let fileInputRef;
            const [preview, setPreview] = createSignal(null);

            const handleFileChange = (e) => {
            const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                }
            };
                

            const handleFileClick = () => {
                fileInputRef.click(); // langsung akses DOM
            };

            const handleDeleteFile = () => {
                fileInputRef.value = null; // reset input file
                setPreview(null);
            };
            return (
                <>
                    <div id="container">
                        <h2>Data Diri</h2>
                        <div className="form-layout">

                            <div className="form-kiri">
                                <label htmlFor="nama">Nama<br/>
                                    <input type="text" name="nama" className="input" />
                                </label>

                                <label htmlFor="jenisKelamin">JenisKelamin<br/>
                                    <select name="jenisKelamin" id="jenisKelamin" className="input">
                                        <option value="">-- Pilih --</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </label> 

                                <label htmlFor="lokasi">Lokasi
                                    <input type="text" id="lokasi" name="lokasi" className="input" /> 
                                </label>

                                <label htmlFor="agama">Agama
                                    <input type="text" id="agama" name="agama" className="input" /> 
                                </label>

                                <label htmlFor="pekerjaan">Pekerjaan
                                    <input type="text" id="pekerjaan" name="pekerjaan" className="input" /> 
                                </label>
                            </div>
                        
                            <div className="form-tengah">
                                <label htmlFor="tanggalLahir">Tanggal Lahir
                                    <input type="date" id="tanggalLahir" name="tanggalLahir" className="input" />
                                </label>

                                <label htmlFor="sifat">Sifat kepribadian
                                    <input type="text" id="sifat" name="sifat" className="input" />
                                </label>

                                <label htmlFor="pendidikan">Pendidikan terakhir
                                    <input type="text" id="pendidikan" name="pendidikan" className="input" />
                                </label>

                                <label htmlFor="tinggi">Tinggi Badan
                                    <input type="number" id="tinggi" name="tinggi" className="input" />
                                </label>

                                <label htmlFor="hobi">Hobi
                                    <input type="text" id="hobi" name="hobi" className="input" />
                                </label>

                            </div>

                            <div className="form-kanan">
                                <label className="upload-label">Upload Foto</label>
                                <div className='upload-buttons'>
                                        <button type="button" onClick={handleFileClick} className="choose-btn">
                                        Pilih Foto
                                        </button>
                                        <button type="button" onClick={handleDeleteFile} className="delete-btn">
                                            Hapus
                                        </button>
                                    </div>
                                <div className="upload-box">
                                    
                                <input type="file" name="foto" accept="image/*" style={{ display: 'none' }} ref={el => fileInputRef = el} onChange={handleFileChange}/>
                                    {preview() && <img src={preview()} alt="Preview" style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'cover', borderRadius: '8px' }} />}
                                    
                                </div>
                                    
                            </div>
                        </div>
                            <div className="bio-section">
                                <label>Bio
                                    <textarea name="bio" rows="5" className="input" />
                                </label>
                            </div>

                        <div className="button-wrapper">
                            <button type="submit" className="button">Sign Up</button>
                        </div>
                    </div>
                </>
            )
        }
        export default RegisterPage