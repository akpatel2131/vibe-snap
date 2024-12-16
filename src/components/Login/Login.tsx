import Cards from "../UiComponents/Cards";
import vibeSnapLogin from "../../images/vibe-snap-login.svg";
import vibeSnapLogo from "../../images/vibe-snap-logo.svg";
import googleLogo from "../../images/google.svg";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useContexData } from "../ContextApi/ContextApi";
import { auth } from "../UiComponents/FireBase";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const { setUser, addUserData, getUserById } = useContexData();
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); // Create a Google Auth Provider
    try {
      const result = await signInWithPopup(auth, provider); // Sign in with Google popup
      const user = result.user;

      const existingUserData = await getUserById(user.uid);

      let userData = {
        username: user.displayName ?? "",
        email: user.email ?? "",
        userId: user.uid ?? "",
        photo: "",
        bio_photo: "",
        bio_discription: "",
      };

      if (existingUserData) {
        userData = {
          ...existingUserData,
          photo: existingUserData.photo,
          bio_photo: existingUserData.photo,
          userId: existingUserData.userId ?? "",
        };
      } else {
        addUserData({
          email: user.email ?? "",
          username: user.displayName ?? "",
          photo: "",
          bio_photo: "",
          bio_discription: "",
        });
      }

      setUser(userData);
      localStorage.setItem("userId", userData.userId);
      localStorage.setItem("username", userData.username || "");
      localStorage.setItem("email", userData.email || "");
      localStorage.setItem("photo", userData.photo || "");
      localStorage.setItem("bio_photo", userData.bio_photo || "");
      localStorage.setItem("bio_discription", userData.bio_discription || "");
      navigate("/");
      toast.success(`Successfully login`)
    } catch (error: any) {
      toast.error(`Error during Google login:, ${error.message}`)
    }
  };
  return (
    <Cards className={styles.loginCard}>
      <img src={vibeSnapLogin} className={styles.loginImage} />
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>
          <img src={vibeSnapLogo} />
          <span>Vibesnap</span>
        </div>
        <div className={styles.loginSubtitle}>
          Moments That Matter, Shared Forever.
        </div>
        <button onClick={handleGoogleLogin} className={styles.loginButton}>
          <img src={googleLogo} />
          Continue with Google
        </button>
      </div>
    </Cards>
  );
}
