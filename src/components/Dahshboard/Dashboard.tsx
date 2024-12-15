import { FeedData, useContexData } from "../ContextApi/ContextApi";
import styles from "./dashboard.module.css";
import {
  IconHeart,
  IconHeartFilled,
  IconPlus,
  IconSend,
} from "@tabler/icons-react";
import userPhoto from "../../images/user-photo.svg";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Cards from "../UiComponents/Cards";
import SwiperLayout from "../UiComponents/Swiper";
import { clsx } from "clsx";

const COLOR_PALLET = [
  "#fad4d4",
  "#faecd4",
  "#f2fad4",
  "#e8fad4",
  "#d4faed",
  "#d4f4fa",
  "#d4e5fa",
  "#e8d4fa",
];

const calculateTimeAgo = (dateString: string) => {
  const pastDate = new Date(dateString);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceMs = Number(currentDate) - Number(pastDate);

  // Convert milliseconds to days, hours, and minutes
  const daysAgo = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  const hoursAgo = Math.floor(differenceMs / (1000 * 60 * 60));
  const minutesAgo = Math.floor(differenceMs / (1000 * 60));

  if (daysAgo) return `${daysAgo}days ago`;
  if (hoursAgo) return `${hoursAgo}hr. ago`;
  if (minutesAgo) return `${minutesAgo}min ago`;
};

export default function Dashboard() {
  const { user, fetchAllPosts } = useContexData();
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

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * COLOR_PALLET.length);
    return COLOR_PALLET[randomIndex];
  };
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.topNav}>
        <div className={styles.userInfo}>
          <img src={userPhoto} className={styles.userPhoto} />
          <div>
            <div className={styles.welcomeNote}>Welcome Back</div>
            <div className={styles.username}>{user?.displayName}</div>
          </div>
        </div>
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
              <Cards
                key={index}
                className={styles.feedCard}
                style={{ backgroundColor: getRandomColor() }}
              >
                <div className={styles.feedHeader}>
                  {item.photo ? (
                    <img src={item.photo} className={styles.feedUserImage} />
                  ) : (
                    <div className={styles.userFirstLetter}>
                      {item.username.split("")[0]}
                    </div>
                  )}
                  <div className={styles.feedUserInfo}>
                    <div>{item.username}</div>
                    <div>{calculateTimeAgo(item.createdAt)}</div>
                  </div>
                </div>
                {item.description && (
                  <div className={styles.feedDiscription}>
                    {item.description}
                  </div>
                )}
                <div className={styles.feed} style={{ backgroundColor: "transparent" }}>
                  {item.fileType === "image" ? (
                    item.fileName.map((element, itemIndex) => (
                      <img
                        src={element}
                        key={itemIndex}
                        className={styles.feedImage}
                        style={{ flex: itemIndex === 0 ? "1" : "0.5"}}
                      />
                    ))
                  ) : (
                    <video className={styles.feedImage}></video>
                  )}
                </div>
                <div className={styles.actionButton}>
                  <button
                    className={clsx(styles.likeButton, {
                      [styles.isLiked]: item.likes.includes(
                        user?.authToken ?? ""
                      ),
                    })}
                  >
                    {item.likes.includes(user?.authToken ?? "") ? (
                      <IconHeartFilled className={styles.icon} />
                    ) : (
                      <IconHeart className={styles.icon} />
                    )}
                    {item.likes.length}
                  </button>
                  <button className={styles.sendButton}>
                    <IconSend stroke={2} className={styles.icon} /> Share
                  </button>
                </div>
              </Cards>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
