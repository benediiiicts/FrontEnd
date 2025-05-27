import '../css/register_page.css'; 

function RegisterPage() {
    return (
        <>
            <div class="register-page-background">
                <div id="container">
                    <h2>Register</h2>
                    <label htmlFor="email">Email<br/>
                        <input type="email" name="email" class="input" />
                    </label> 
                    <label htmlFor="password">Password<br/>
                        <input type="password" name="password" class="input" />
                    </label> 
                    <label htmlFor="password">Confirm Password<br/>
                        <input type="password" name="password" class="input" />
                    </label> 
                    <button type="submit" class="button">Register</button>
                </div>
            </div>
        </>
    )
}
export default RegisterPage