import LoginPage from "./pages/login.jsx";
import SignUpPage from "./pages/signup.jsx";
import RegisterPage from "./pages/register.jsx";
import ProfilePage from "./pages/profile.jsx";
import { Router, Route } from "@solidjs/router";

function App() {
  return (
    <div>
        <Router>
            <Route path="/login" component={LoginPage} />
        </Router>
        <Router>
            <Route path="/signup" component={SignUpPage}/>      
        </Router>
        <Router>
            <Route path="/profile" component={ProfilePage} />
        </Router>
    </div>
  );
}

export default App;