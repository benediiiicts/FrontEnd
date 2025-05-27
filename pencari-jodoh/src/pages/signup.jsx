import '../css/signup_page.css'; 

function SignUpPage() {
    return (
        <>
            <div id="container">
                <h2>Sign Up</h2>
                <label htmlFor="email">Email<br/>
                    <input type="email" name="email" className="input" />
                </label> 
                <label htmlFor="password">Password<br/>
                    <input type="password" name="password" className="input" />
                </label> 
                <label htmlFor="password">Confirm Password<br/>
                    <input type="password" name="password" className="input" />
                </label> 
                <button type="submit" className="button">Sign Up</button>
            </div>
        </>
    )
}
export default SignUpPage