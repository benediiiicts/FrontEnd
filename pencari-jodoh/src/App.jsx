import LoginPage from "./pages/login.jsx";
import SignUpPage from "./pages/signup.jsx";
import RegisterPage from "./pages/register.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import ProfilePage from "./pages/profile.jsx";
import ChatPage from "./pages/chatPage.jsx";
import LikedPage from "./pages/liked.jsx";
import { Router, Route } from "@solidjs/router";

function App() {
  return (
    <div>
        <Router>
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignUpPage}/>
            <Route path="/dashboard" component={DashboardPage}/>
            <Route path="/signup/register" component={RegisterPage}/>
            <Route path="/chat" component={ChatPage}/>
            <Route path="/profile" component={ProfilePage} />
            <Route path="/liked-users" component={LikedPage} />
        </Router>
    </div>
  );
}
  
export default App;
