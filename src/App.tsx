import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dahshboard/Dashboard";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile/Profile";
import { useEffect, useState } from "react";
import { useContexData } from "./components/ContextApi/ContextApi";
import EditProfile from "./components/Profile/EditProfile";
import styles from "./app.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { setUser } = useContexData();

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      const data = {
        userId: localStorage.getItem("userId") || "",
        email: localStorage.getItem("email") || "",
        username: localStorage.getItem("username") || "",
        photo: localStorage.getItem("photo") || "",
        bio_photo: localStorage.getItem("bio_photo") || "",
        bio_discription: localStorage.getItem("bio_discription") || "",
      };
      setUser(data);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route
          element={
            <div className={styles.container}>
              <Outlet />
            </div>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-post" element={<Feed />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
