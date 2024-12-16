import styles from "./createFeed.module.css";
import photoIcon from "../../images/photo-icon.svg";
import vedioIcon from "../../images/video-icon.svg";
import { useContexData } from "../ContextApi/ContextApi";
import CameraModal from "./CameraModal";
import { Dispatch, SetStateAction } from "react";

function UploadContainer() {
  const { handleFileChange } = useContexData();

  return (
    <div className={styles.uploadContainer}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="photoInput"
      />
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="videoInput"
      />
      <button
        type="button"
        onClick={() => document.getElementById("photoInput")?.click()}
        className={styles.uploadButton}
      >
        <img src={photoIcon} />
        Photos
      </button>
      <button
        type="button"
        onClick={() => document.getElementById("videoInput")?.click()}
        className={styles.uploadButton}
      >
        <img src={vedioIcon} />
        Videos
      </button>
      <CameraModal />
    </div>
  );
}

export default function CreateFeed({
  discription,
  setDiscription,
}: {
  discription: string;
  setDiscription: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className={styles.newFeedBox}>
      <textarea
        className={styles.feedTextInput}
        placeholder="Enter Description ..."
        onChange={(event) => {
          setDiscription(event.target.value);
        }}
        value={discription}
      />
      <UploadContainer />
    </div>
  );
}
