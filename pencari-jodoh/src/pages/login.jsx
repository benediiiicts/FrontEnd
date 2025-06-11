import { A, useNavigate } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import '../css/login_page.css'; 

function LoginPage() {
    const nav = useNavigate();

    onMount(async () => {
        const authToken = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        const userId = localStorage.getItem('userId');

        if (authToken && userEmail && userId) {
            console.log('onMount: Sudah ada token, email, dan ID user. Mengarahkan ke halaman dashboard.');
            nav('/dashboard', { replace: true });
            return;
        }
    });

    const[userInfo, setUserInfo] = createStore({
        email: "",
        password: "",
    })

    const[userInfoError, setUserInfoError] = createStore({
        emailError: "",
        passwordError: "",
    })
    
    const[login, setLogin] = createSignal(false);
    const[errorMessage, setErrorMessage] = createSignal("");

    const handleLogin = () => {
        if((userInfo.email !== "" && userInfo.password !== "") && (userInfoError.emailError === "" && userInfoError.passwordError === "")) {
            setLogin(true);
        }else {
            setLogin(false);
        }
    };

    const handleEmailChange = (event) => {
        setUserInfo('email', event.currentTarget.value.trim());
        if(userInfo.email === "") {
            setUserInfoError('emailError', 'Email tidak boleh kosong!');
        }else {
            setUserInfoError('emailError', '');
        }

        handleLogin()
    };

    const handlePasswordChange = (event) => {
        setUserInfo('password', event.currentTarget.value.trim());
        if(userInfo.password === "") {
            setUserInfoError('passwordError', 'Password tidak boleh kosong!');
        }else {
            setUserInfoError('passwordError', '');
        }

        handleLogin()
    };


    const loginBtnStyle = () => {
        if(login()) {
            return {
                cursor: 'pointer',
            };
        }else {
            return {
                cursor: 'not-allowed',
                opacity: 0.5, 
            };
        }
    };

    const handleLoginBtn = async (event) => {
        if(login()) {
            event.preventDefault();
    
            try {
                const response = await fetch('http://localhost:3001/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userInfo.email,
                        password: userInfo.password,
                    }),
                });
    
                if (response.ok) {
                    const result = await response.json();
                    
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('userEmail', result.email);
                    localStorage.setItem('userId', result.userId);
                    localStorage.setItem('jenisKelamin', result.jenisKelamin);
                    localStorage.setItem('nama', result.nama);
                    nav('/dashboard', { replace: true });
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
                    <form onSubmit={handleLoginBtn}> 
                        <label htmlFor="email">Email<br/>
                            <input
                                type="email"
                                name="email"
                                class="input"
                                value={userInfo.email}
                                onInput={handleEmailChange}
                                required
                            />
                        </label> 
                        <p style={{ color: 'red' }}>{userInfoError.emailError}</p>
                        <label htmlFor="password">Password<br/>
                            <input
                                type="password"
                                name="password"
                                class="input"
                                value={userInfo.password}
                                onInput={handlePasswordChange}
                                required
                            />
                        </label> 
                        <p style={{ color: 'red' }}>{userInfoError.passwordError}</p>

                        <button type="submit" class="button" style={loginBtnStyle()}>Log In</button>
                        <p style={{ color: 'red' }}>{errorMessage()}</p>
                    </form>
                    <br />
                    <span>Don't have an account? <A href='/signup' style={{ color: 'green', 'text-decoration': 'none' }}>Sign Up</A></span>
                </div>
            </div>
        </>
    )
}
export default LoginPage;