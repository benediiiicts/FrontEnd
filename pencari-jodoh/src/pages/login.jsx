import { A } from '@solidjs/router';
import { useNavigate } from '@solidjs/router';
import '../css/login_page.css'; 

function LoginPage() {
    const nav = useNavigate();

    function handleLogInBtn() {
        nav('/dashboard')
    }
    return (
        <>
            <div class="login-page-background">
                <div id="containerLogin">
                    <h2>Log In</h2>
                    <label htmlFor="email">Email<br/>
                        <input type="email" name="email" class="input" />
                    </label> 
                    <label htmlFor="password">Password<br/>
                        <input type="password" name="password" class="input" />
                    </label> 
                    <button type="submit" class="button" onClick={handleLogInBtn}>Log In</button>
                    <br />
                    <span>Don't have an account? <A href='/signup' style={{ color: 'green', 'text-decoration': 'none' }}>Sign Up</A></span>
                </div>
            </div>
        </>
    )
}
export default LoginPage