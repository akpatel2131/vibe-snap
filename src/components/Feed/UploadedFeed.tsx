import { useContexData } from "../ContextApi/ContextApi";
import photoIcon from "../../images/photo-icon.svg";
import styles from "./uploadedFeed.module.css";
import "swiper/swiper-bundle.css";
import { IconTrashFilled } from "@tabler/icons-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import SwiperLayout from "../UiComponents/Swiper";

export default function UploadedFeed({
  discription,
  setDiscription,
}: {
  discription: string;
  setDiscription: Dispatch<SetStateAction<string>>;
}) {
  const { selectedFiles, setSelectedFiles, handleFileChange, fileType } =
    useContexData();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDelete = useCallback(() => {
    if (selectedFiles.length === 0) return;

    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== activeIndex
    );
    setSelectedFiles(updatedFiles);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, [selectedFiles, activeIndex, setSelectedFiles]);

  return (
    <div className={styles.uploadFeedContainer}>
      <div className={styles.imageWrapper}>
        {selectedFiles.length > 1 && (
          <div className={styles.pagesNumber}>
            {activeIndex + 1}/{selectedFiles.length}
          </div>
        )}
        <SwiperLayout setActiveIndex={setActiveIndex}>
          {selectedFiles.map((photo, index) => (
            <img
              src={photo}
              alt={`Slide ${index + 1}`}
              className={styles.uploadedImage}
            />
          ))}
        </SwiperLayout>
        <button className={styles.trashButton} onClick={handleDelete}>
          <IconTrashFilled />
        </button>
      </div>
      <div className={styles.actionContainer}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="photoInput"
        />
        {(fileType.startsWith("image/") && selectedFiles.length < 2) && (
          <button
            type="button"
            onClick={() => document.getElementById("photoInput")?.click()}
            className={styles.uploadButton}
          >
            <img src={photoIcon} />
            Add more Photos
          </button>
        )}
        <textarea
          className={styles.feedTextInput}
          placeholder="Enter Description ..."
          onChange={(event) => {
            setDiscription(event.target.value);
          }}
          value={discription}
        />
      </div>
    </div>
  );
}
