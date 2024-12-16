import styles from "./profileTopHeader.module.css";
import bioImage from "../../images/bio.svg";
import userPhoto from "../../images/user-photo.svg";
import { clsx } from "clsx";
import { IconArrowLeft, IconPencil } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useContexData } from "../ContextApi/ContextApi";
import { useState } from "react";

export default function ProfileTopHeader({ isEdit }: { isEdit: boolean }) {
  const { user, handleProfileImageUpload } = useContexData();
  const [imageType, setImageType] = useState<string>("")
  const navigate = useNavigate();
 
  return (
    <div className={styles.profileImageContainer}>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => handleProfileImageUpload(event, imageType)}
        style={{ display: "none" }}
        id="photoInput"
      />
      <div className={styles.profileHeader}>
        <button
          className={styles.backButton}
          onClick={() => {
            if (isEdit) navigate("/profile");
            else navigate("/");
          }}
        >
          <IconArrowLeft stroke={2} className={styles.backIcon} />
        </button>
        {isEdit && <div>Edit Profile</div>}
      </div>
      <div className={styles.userBioBox}>
        <img src={user?.bio_photo || bioImage} alt="bio" className={styles.bioImage} />
        {isEdit && (
          <button
            className={clsx(styles.editButton, styles.bioEdit)}
            onClick={() => {
              setImageType("bio")
              document.getElementById("photoInput")?.click()
            }}
          >
            <IconPencil className={styles.editIcon} />
          </button>
        )}
      </div>
      <div className={styles.userPhotoBox}>
        <div className={styles.userPhoto}>
          <img src={user?.photo || userPhoto} alt="userphoto" className={styles.userImage} />
          {isEdit && (
            <button
              className={clsx(styles.editButton, styles.profileEdit)}
              onClick={() => {
                setImageType("profile")
                document.getElementById("photoInput")?.click()
              }}
            >
              <IconPencil className={styles.editIcon} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
