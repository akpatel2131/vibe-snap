import { IconHeart, IconHeartFilled, IconSend } from "@tabler/icons-react";
import { FeedData, useContexData } from "../ContextApi/ContextApi";
import Cards from "../UiComponents/Cards";
import { clsx } from "clsx";
import styles from "./feedCards.module.css";
import { useCallback, useState } from "react";
import SharePostModal from "./SharePostModal";

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

  if (daysAgo) return `${daysAgo} days ago`;
  if (hoursAgo) return `${hoursAgo} hours ago`;
  return `${minutesAgo} minute ago`;
};

export default function FeedCards({
  data,
  onClick,
}: {
  data: FeedData;
  onClick?: () => void;
}) {
  const { user, handleLikes } = useContexData();
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * COLOR_PALLET.length);
    return COLOR_PALLET[randomIndex];
  };

  const handlePostLike = useCallback(async () => {
    await handleLikes(data.docId, data.likes);
  }, []);

  const isLiked = data.likes.includes(user?.authToken ?? "");

  return (
    <>
      <Cards
        className={styles.feedCard}
        style={{ backgroundColor: getRandomColor() }}
      >
        <div className={styles.feedHeader}>
          {data.photo ? (
            <img src={data.photo} className={styles.feedUserImage} />
          ) : (
            <div className={styles.userFirstLetter}>
              {data.username.split("")[0]}
            </div>
          )}
          <div className={styles.feedUserInfo}>
            <div className={styles.username}>{data.username}</div>
            <div className={styles.subtitle}>
              {calculateTimeAgo(data.createdAt)}
            </div>
          </div>
        </div>
        {data.description && (
          <div className={styles.feedDiscription}>{data.description}</div>
        )}
        <div className={styles.feed} style={{ backgroundColor: "transparent" }}>
          {data.fileType === "image" ? (
            data.fileName.map((element, itemIndex) => (
              <img
                src={element}
                key={itemIndex}
                className={styles.feedImage}
                style={{ flex: itemIndex === 0 ? "1" : "0.5" }}
              />
            ))
          ) : (
            <video className={styles.feedImage}></video>
          )}
        </div>
        <div className={styles.actionButton}>
          <button
            className={clsx(styles.likeButton, {
              [styles.isLiked]: isLiked,
            })}
            onClick={() => {
              handlePostLike();
            }}
          >
            {isLiked ? (
              <IconHeartFilled className={styles.icon} />
            ) : (
              <IconHeart className={styles.icon} />
            )}
            {data.likes.length}
          </button>
          <button className={styles.sendButton} onClick={() => setShowShareModal(true)}>
            <IconSend stroke={2} className={styles.icon} /> Share
          </button>
        </div>
      </Cards>
      <SharePostModal
        open={showShareModal}
        setOpen={setShowShareModal}
      />
    </>
  );
}
