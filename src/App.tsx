import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dahshboard/Dashboard";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile/Profile";
import { useEffect, useState } from "react";
import { useContexData } from "./components/ContextApi/ContextApi";
import EditProfile from "./components/Profile/EditProfile";

function App() {
  const { setUser } = useContexData();

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      const data = {
        userId: localStorage.getItem("userId") ?? "",
        email: localStorage.getItem("email") ?? "",
        username: localStorage.getItem("username") ?? "",
        photo: localStorage.getItem("photo") ?? "",
        bio_photo: localStorage.getItem("bio_photo") || "",
        bio_discription: localStorage.getItem("bio_discription") || "",
      };
      console.log({data})
      setUser(data);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {!localStorage.getItem("userId") ? (
          <Route element={<Navigate to="/login" />} path="/" />
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-post" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
