import { useCallback, useState } from "react";
import { useContexData } from "../ContextApi/ContextApi";
import Button from "../UiComponents/Button";
import ProfileTopHeader from "./ProfileTopHeader";
import styles from "./editProfile.module.css";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user, updateUserData, setUser } = useContexData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(user?.username || "");
  const [biotext, setBioText] = useState<string>(user?.bio_discription || "");

  const handleSaveProfileData = useCallback(async () => {
    try {
      if (!user) return;
      setLoading(true);
      const data = {
        ...user,
        bio_discription: biotext,
        username: name,
      };
      await updateUserData(data);
      setUser(data);
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  }, [updateUserData, user, setLoading, setUser, biotext, name]);

  return (
    <div className={styles.editProfileContainer}>
      <ProfileTopHeader isEdit={true} />
      <div className={styles.inputWrapper}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <label className={styles.label}>Bio</label>
        <textarea
          className={styles.input}
          value={biotext}
          onChange={(event) => setBioText(event.target.value)}
        />
        <Button
          isBusy={loading}
          onClick={handleSaveProfileData}
          className={styles.saveButton}
        >
          save
        </Button>
      </div>
    </div>
  );
}
