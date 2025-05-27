import '../css/signup_page.css'; 
import { useNavigate } from '@solidjs/router';
import { A } from '@solidjs/router';

function SignUpPage() {
    const nav = useNavigate();

    function handleNextBtn() {
        nav('/signup/register')
    }

    return (
        <>
            <div class="signup-page-background">
                <div id="containerSignup">
                    <h2>Sign Up</h2>
                    <label htmlFor="email">Email<br/>
                        <input type="email" name="email" class="input" />
                    </label> 
                    <label htmlFor="password">Password<br/>
                        <input type="password" name="password" class="input" />
                    </label> 
                    <label htmlFor="password">Confirm Password<br/>
                        <input type="password" name="password" class="input" />
                    </label> 
                    <button class="button" onClick={handleNextBtn}>Next</button>
                    <br/>
                    <span>Have an account? <A href='/login' style={{ color: 'green', 'text-decoration': 'none' }}>Log In</A></span>
                </div>
            </div>
        </>
    )
}
export default SignUpPage