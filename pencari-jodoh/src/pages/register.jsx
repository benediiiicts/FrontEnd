    import '../css/register_page.css';
    import { createSignal } from 'solid-js';


    function RegisterPage() {
        let fileInputRef;

        const handleFileClick = () => {
            fileInputRef.click(); // langsung akses DOM
        };

        const handleDeleteFile = () => {
            fileInputRef.value = null; // reset input file
        };
        return (
            <>
              <div class="register-page-background">
                  <div id="containerRegister">
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
                              <div className="upload-box">
                                  <input type="file" name="foto" accept="image/*"  style={{ display: 'none' }} ref={fileInputRef}/>
                                  <button type="button" onClick={handleFileClick} className="choose-btn">
                                      Pilih Foto
                                  </button>
                                  <button type="button" onClick={handleDeleteFile} className="delete-btn">
                                      Hapus
                                  </button>
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
              </div>
            </>
        )
    }
    export default RegisterPage
