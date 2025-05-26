import '../css/login_page.css'; 

function SignUpPage() {
    return (
        <>
            <div id="container">
                <h2>Sign In</h2>
                <label htmlFor="email">Email<br/>
                    <input type="email" name="email" class="input" />
                </label> 
                <label htmlFor="password">Password<br/>
                    <input type="password" name="password" class="input" />
                </label> 
                <label htmlFor="password">Confirm Password<br/>
                    <input type="password" name="password" class="input" />
                </label> 
                <button type="submit" class="button">Log In</button>
            </div>
        </>
    )
}
export default SignUpPage