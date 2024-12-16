import { FeedData, useContexData } from "../ContextApi/ContextApi";
import styles from "./dashboard.module.css";
import { IconLogout, IconPlus } from "@tabler/icons-react";
import userPhoto from "../../images/user-photo.svg";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import FeedCards from "./FeedCards";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { postData, user, fetchAllPosts, setPostData, setUser } = useContexData();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem("userId")) {
      navigate("/login")
    }
  },[localStorage])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllPosts();

      setPostData(response as FeedData[]);
    } catch (error: any) {
      toast.error("There is some issue from our side. Please try later");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(()=> {
    localStorage.clear();
    setUser(null);
    navigate("/login")
  },[])

  useEffect(() => void fetchData(), []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.topNav}>
        <button
          className={styles.userInfo}
          onClick={() => navigate("/profile")}
        >
          <img src={user?.photo || userPhoto} className={styles.userPhoto} />
          <div>
            <div className={styles.welcomeNote}>Welcome Back</div>
            <div className={styles.username}>{user?.username}</div>
          </div>
        </button>
        <div className={styles.buttonContainer}>
          <button
            className={styles.createButton}
            onClick={() => navigate("/create-post")}
          >
            <IconPlus stroke={2} />
            Create
          </button>
          <button
            className={styles.createButton}
            onClick={handleLogout}
          >
            <IconLogout stroke={2} />
            Logout
          </button>
        </div>
      </div>
      <div className={styles.feeds}>
        <div className={styles.feedTitle}>Feeds</div>
        {loading ? (
          "Loading..."
        ) : (
          <div className={styles.feedCardsContainer}>
            {postData?.map((item, index) => (
              <FeedCards data={item} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
