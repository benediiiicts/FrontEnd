import { A } from '@solidjs/router';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js'; // Import createSignal
import '../css/login_page.css'; 

function LoginPage() {
    const nav = useNavigate();

    // State untuk input form
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [errorEmail, setErrorEmail] = createSignal(''); // State untuk pesan error email
    const [errorPassword, setErrorPassword] = createSignal(''); // State untuk pesan error password
    const [login, setLogin] = createSignal(false); // State untuk status login
    const [errorMessage, setErrorMessage] = createSignal(''); // State untuk pesan error umum

    // Fungsi untuk menangani perubahan input email
    const handleEmailChange = (event) => {
        setEmail(event.currentTarget.value);
        if (!event.currentTarget.value.trim()) {
            setErrorEmail('Email tidak boleh kosong.'); // Set pesan error jika email kosong
        } else {
            setErrorEmail('');
        }
    };

    // Fungsi untuk menangani perubahan input password
    const handlePasswordChange = (event) => {
        setPassword(event.currentTarget.value);
        if (!event.currentTarget.value.trim()) {
            setErrorPassword('Password tidak boleh kosong.'); // Set pesan error jika password kosong
        } else {
            setErrorPassword('');
        }
    };

    const disableLoginButton = () => {
        // Cek apakah email dan password valid
        if(!email().trim() || !password().trim() || errorEmail() || errorPassword()) {
            return {
                cursor: 'not-allowed',
                opacity: 0.5,
            };
        }else {
            setLogin(true); // Set status login menjadi true jika valid
            return {
                cursor: 'pointer',
            };
        }
    };
    // Fungsi untuk menangani tombol Log In
    const handleLoginBtn = async (event) => {
        if(login()) {
            event.preventDefault(); // Mencegah reload halaman saat form disubmit
    
            try {
                const response = await fetch('http://localhost:3001/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email(),
                        password: password(),
                    }),
                });
    
                if (response.ok) {
                    const result = await response.json();
                    console.log('Login berhasil:', result);
                    
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('userEmail', result.email);
                    localStorage.setItem('userId', result.userId);
                    nav('/dashboard'); // Ganti dengan path dashboard Anda
                } else {
                    const error = await response.json();
                    setErrorMessage('Login gagal. Silakan coba lagi.');
                    console.error('Login gagal:', error);
                }
            } catch (error) {
                console.error('Error saat mengirim data login:', error);
            }
        }
    };

    return (
        <>
            <div class="login-page-background">
                <div id="containerLogin">
                    <h2>Log In</h2>
                    {/* Menggunakan form untuk submit data */}
                    <form onSubmit={handleLoginBtn}> 
                        <label htmlFor="email">Email<br/>
                            <input
                                type="email"
                                name="email"
                                class="input"
                                value={email()} // Bind value ke state
                                onInput={handleEmailChange} // Tangani perubahan input
                                required
                            />
                        </label> 
                        <p style={{ color: 'red' }}>{errorEmail()}</p> {/* Tampilkan pesan error email */}
                        <label htmlFor="password">Password<br/>
                            <input
                                type="password"
                                name="password"
                                class="input"
                                value={password()} // Bind value ke state
                                onInput={handlePasswordChange} // Tangani perubahan input
                                required
                            />
                        </label> 
                        <p style={{ color: 'red' }}>{errorPassword()}</p> {/* Tampilkan pesan error password */}

                        <button type="submit" class="button" style={disableLoginButton()}>Log In</button> {/* type="submit" untuk form */}
                        <p style={{ color: 'red' }}>{errorMessage()}</p> {/* Tampilkan pesan error umum */}
                    </form>
                    <br />
                    <span>Don't have an account? <A href='/signup' style={{ color: 'green', 'text-decoration': 'none' }}>Sign Up</A></span>
                </div>
            </div>
        </>
    )
}
export default LoginPage;
