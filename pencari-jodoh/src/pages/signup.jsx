import '../css/signup_page.css'; 
import { useNavigate } from '@solidjs/router';

function SignUpPage() {
    const nav = useNavigate();

    function handleNextBtn() {
        nav('/register')
    }

    return (
        <>
            <div id="container">
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
            </div>
        </>
    )
}
export default SignUpPage