import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dahshboard/Dashboard";
import Feed from "./components/Feed/Feed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/create-post" element={<Feed />} />
      </Routes>
    </Router>
  );
}

export default App;
