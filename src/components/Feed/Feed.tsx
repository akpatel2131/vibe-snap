import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import styles from "./feed.module.css";
import { useContexData } from "../ContextApi/ContextApi";
import UploadedFeed from "./UploadedFeed";
import CreateFeed from "./CreateFeed";
import { useCallback, useState } from "react";
import Button from "../UiComponents/Button";

export default function Feed() {
  const navigate = useNavigate();
  const [discription, setDiscription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedFiles, addPost, fileType, setSelectedFiles } = useContexData();

  const handleCreatePost = useCallback(async () => {
    try {
      setLoading(true);
      const filesData = {
        fileName: selectedFiles,
        fileType: fileType.startsWith("image")
          ? ("image" as const)
          : ("video" as const),
        description: discription,
        likes: [],
      };
      await addPost(filesData);
      setSelectedFiles([]);
      navigate("/")
    } finally {
      setLoading(false);
    }
  }, [addPost, selectedFiles, fileType, discription]);

  return (
    <div className={styles.createFeedContainer}>
      <div className={styles.headerContainer}>
        <button className={styles.backButton} onClick={() => navigate("/")}>
          <IconArrowLeft stroke={2} className={styles.backIcon} />
        </button>
        <div className={styles.newFeedTitle}>New Feed</div>
      </div>
      {selectedFiles.length > 0 ? (
        <UploadedFeed
          discription={discription}
          setDiscription={setDiscription}
        />
      ) : (
        <CreateFeed discription={discription} setDiscription={setDiscription} />
      )}
      <Button
        disabled={selectedFiles.length === 0}
        isBusy={loading}
        onClick={handleCreatePost}
      >
        CREATE
      </Button>
    </div>
  );
}
