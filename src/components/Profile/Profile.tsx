import { useCallback, useEffect, useState } from "react";
import { FeedData, useContexData } from "../ContextApi/ContextApi";
import ProfileTopHeader from "./ProfileTopHeader";
import styles from "./profile.module.css";
import { IconHeartFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserData, setCurrentUserData] = useState<FeedData[]>();
  const { user, fetchPostsByUser } = useContexData();
  const navigate = useNavigate();

  const fetchDataByUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPostsByUser();
      setCurrentUserData(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) void fetchDataByUser();
  }, [user]);


  return (
    <div className={styles.profileContainer}>
      <ProfileTopHeader isEdit={false} />
      <div className={styles.profileInfoWrapper}>
      <button className={styles.editProfileButton} onClick={() => navigate("/edit-profile")}>Edit Profile</button>
      <div className={styles.profileUserInfo}>
        <div className={styles.username}>{user?.username}</div>
        <div className={styles.userBio}>
          {user?.bio_discription}
        </div>
      </div>
      <div className={styles.userFeedContainer}>
        <div className={styles.myPostTitle}>My Post</div>
        {loading ? (
          "Loading..."
        ) : (
          <div className={styles.postContainer}>
            {currentUserData?.map((item, index) => (
              <div key={index} className={styles.userFeedBox}>
                {item.fileName.length > 1 && (
                  <div className={styles.pagesNumber}>
                    1/{item.fileName.length}
                  </div>
                )}
                <img src={item.fileName[0]} className={styles.feedImage} />
                <button className={styles.likeButton}>
                  <IconHeartFilled className={styles.icon} />
                  {item.likes.length}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
