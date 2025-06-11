import '../css/signup_page.css';
import { useNavigate } from '@solidjs/router';
import { A } from '@solidjs/router';
import { createStore } from 'solid-js/store';

function SignUpPage() {
    const nav = useNavigate();

    const [userInfo, setUserInfo] = createStore({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [userInfoError, setUserInfoError] = createStore({
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
    });

    const handleEmailChange = (event) => {
        setUserInfo('email', event.currentTarget.value.trim());
        if (!userInfo.email.includes('@') || !userInfo.email.includes('.')) {
            setUserInfoError('emailError', 'Email tidak valid!');
        }else {
            setUserInfoError('emailError', '');
        }
    };

    const handlePasswordChange = (event) => {
        setUserInfo('password', event.currentTarget.value.trim());
        if (userInfo.password.length < 6) {
            setUserInfoError('passwordError', 'Password minimal 6 karakter.');
        }else {
            if(userInfo.password !== userInfo.confirmPassword) {
                setUserInfoError('confirmPasswordError', 'Password dan Konfirmasi Password tidak cocok.');
            }
            setUserInfoError('passwordError', '');
        }
    };
    
    const handleConfirmPasswordChange = (event) => {
        setUserInfo('confirmPassword', event.currentTarget.value.trim())
        if (userInfo.confirmPassword !== userInfo.password) {
            setUserInfoError('confirmPasswordError', 'Password dan Konfirmasi Password tidak cocok.');
        } else {
            setUserInfoError('confirmPasswordError', '');
        }
    };

    function nextButtonStyle() {
        if (userInfoError.emailError || userInfoError.passwordError || userInfoError.confirmPasswordError || !userInfo.email || !userInfo.password || !userInfo.confirmPassword) {
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

    function handleNextBtn() {
        if(!userInfoError.emailError && !userInfoError.passwordError && !userInfoError.confirmPasswordError && userInfo.email && userInfo.password && userInfo.confirmPassword) {
            nav('/signup/register', {state: {email: userInfo.email, password: userInfo.password}});
        }
    }

    return (
        <>
            <div class="signup-page-background">
                <div id="containerSignup">
                    <h2>Sign Up</h2>
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
                    <label htmlFor="confirmPassword">Confirm Password<br/> {/* Ubah name menjadi confirmPassword */}
                        <input
                            type="password"
                            name="confirmPassword" // Ubah name menjadi confirmPassword
                            class="input"
                            value={userInfo.confirmPassword}
                            onInput={handleConfirmPasswordChange}
                            required
                        />
                    </label>
                    <p style={{ color: 'red' }}>{userInfoError.confirmPasswordError}</p>

                    <button class="button" onClick={handleNextBtn} style={nextButtonStyle()}>Next</button>
                    <br/>
                    <span>Have an account? <A href='/login' style={{ color: 'green', 'text-decoration': 'none' }}>Log In</A></span>
                </div>
            </div>
        </>
    )
}

export default SignUpPage;