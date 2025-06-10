import '../css/signup_page.css';
import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { A } from '@solidjs/router';

function SignUpPage() {
    const nav = useNavigate();

    // State untuk input form
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [confirmPassword, setConfirmPassword] = createSignal('');
    const [warningEmail, setWarningEmail] = createSignal('');
    const [warningPassword, setWarningPassword] = createSignal('');
    const [warningConfirmPassword, setWarningConfirmPassword] = createSignal('');

    const handleEmailChange = (event) => {
        const { value } = event.currentTarget;
        setEmail(value);
        if (!value.includes('@') || !value.includes('.')) {
            setWarningEmail('Email tidak valid.');
        }else {
            setWarningEmail('');
        }
    };

    const handlePasswordChange = (event) => {
        const { value } = event.currentTarget;
        setPassword(value);
        if (value.length < 6) {
            setWarningPassword('Password minimal 6 karakter.');
        }else {
            if(value !== confirmPassword()) {
                setWarningConfirmPassword('Password dan Konfirmasi Password tidak cocok.');
            }
            setWarningPassword('');
        }
    };
    
    const handleConfirmPasswordChange = (event) => {
        const { value } = event.currentTarget;
        setConfirmPassword(value);
        if (value !== password()) {
            setWarningConfirmPassword('Password dan Konfirmasi Password tidak cocok.');
        } else {
            setWarningConfirmPassword('');
        }
    };

    function nextButtonDisabled() {
        if (warningEmail() || warningPassword() || warningConfirmPassword() || !email() || !password() || !confirmPassword()) {
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
        if(!warningEmail() && !warningPassword() && !warningConfirmPassword() && email() && password() && confirmPassword()) {
            nav('/signup/register', {
            state: {
                email: email(),
                password: password()
            }
        });
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
                            value={email()}
                            onInput={handleEmailChange}
                            required
                        />
                    </label>
                    <p style={{ color: 'red' }}>{warningEmail()}</p>
                    <label htmlFor="password">Password<br/>
                        <input
                            type="password"
                            name="password"
                            class="input"
                            value={password()}
                            onInput={handlePasswordChange}
                            required
                        />
                    </label>
                    <p style={{ color: 'red' }}>{warningPassword()}</p>
                    <label htmlFor="confirmPassword">Confirm Password<br/> {/* Ubah name menjadi confirmPassword */}
                        <input
                            type="password"
                            name="confirmPassword" // Ubah name menjadi confirmPassword
                            class="input"
                            value={confirmPassword()}
                            onInput={handleConfirmPasswordChange}
                            required
                        />
                    </label>
                    <p style={{ color: 'red' }}>{warningConfirmPassword()}</p>

                    <button class="button" onClick={handleNextBtn} style={nextButtonDisabled()}>Next</button>
                    <br/>
                    <span>Have an account? <A href='/login' style={{ color: 'green', 'text-decoration': 'none' }}>Log In</A></span>
                </div>
            </div>
        </>
    )
}

export default SignUpPage;