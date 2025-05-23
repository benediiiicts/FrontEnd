import LoginPage from "./pages/login.jsx";
import { Router, Route } from "@solidjs/router";

function App() {
  return (
    <div>
        <Router>
            <Route path="/login" component={LoginPage} />
        </Router>
    </div>
  );
}

export default App;