import '../css/login_page.css'; 

function LoginPage() {
    return (
        <>
            <div id="container">
                <h2>Sign In</h2>
                <label htmlFor="email">Email<br/>
                    <input type="email" name="email" className="input" />
                </label> 
                <label htmlFor="password">Password<br/>
                    <input type="password" name="password" className="input" />
                </label> 
                <button type="submit" className="button">Log In</button>
            </div>
        </>
    )
}
export default LoginPage