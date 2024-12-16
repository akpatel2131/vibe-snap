import { FeedData, useContexData } from "../ContextApi/ContextApi";
import styles from "./dashboard.module.css";
import {
  IconPlus,
} from "@tabler/icons-react";
import userPhoto from "../../images/user-photo.svg";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import FeedCards from "./FeedCards";



export default function Dashboard() {
  const { user, fetchAllPosts, handleLikes } = useContexData();
  const [loading, setLoading] = useState<boolean>(false);
  const [postData, setPostData] = useState<FeedData[]>();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllPosts();

      console.log({ response });
      setPostData(response);
    } catch (error: any) {
      console.log("getting error while creating post", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => void fetchData(), []);


  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.topNav}>
        <button className={styles.userInfo} onClick={() => navigate("/profile")}>
          <img src={user?.photo || userPhoto} className={styles.userPhoto} />
          <div>
            <div className={styles.welcomeNote}>Welcome Back</div>
            <div className={styles.username}>{user?.username}</div>
          </div>
        </button>
        <button
          className={styles.createButton}
          onClick={() => navigate("/create-post")}
        >
          <IconPlus stroke={2} />
          Create
        </button>
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
