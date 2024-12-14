import Cards from "../UiComponents/Cards";
import vibeSnapLogin from "../../images/vibe-snap-login.svg";
import vibeSnapLogo from "../../images/vibe-snap-logo.svg";
import googleLogo from "../../images/google.svg";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {useUser} from "../ContextApi/UserContext";
import { auth } from "../UiComponents/FireBase";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { setUser } = useUser();
    const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); // Create a Google Auth Provider
    try {
      const result = await signInWithPopup(auth, provider); // Sign in with Google popup
      const user = result.user;

      const userData = {
        displayName: user.displayName,
        email: user.email,
        authToken: user.uid
      }

      setUser(userData);
      navigate("./home")
    } catch (error: any) {
      console.error("Error during Google login:", error.message);
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