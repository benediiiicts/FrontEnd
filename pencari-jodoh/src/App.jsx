import LoginPage from "./pages/login.jsx";
import SignUpPage from "./pages/signup.jsx";
import RegisterPage from "./pages/register.jsx";
import { Router, Route } from "@solidjs/router";

function App() {
  return (
    <div>
        <Router>
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignUpPage}/>
            <Route path="/signup/register" component={RegisterPage}/>
        </Router>
    </div>
  );
}

export default App;