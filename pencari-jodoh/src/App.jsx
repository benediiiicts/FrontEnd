import LoginPage from "./pages/login.jsx";
import { Router, Route } from "@solidjs/router";

function App() {
  return (
    <div>
        <Router>
            <Route path="/login" component={LoginPage} />
        </Router>
        <Router>
            <Route path="/signup" component={SignUpPage}>
              <Route path="/register" component={RegisterPage} />
            </Route>      
        </Router>
    </div>
  );
}

export default App;