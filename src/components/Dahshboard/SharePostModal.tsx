import { Modal } from "@mui/material";
import styles from "./sharePostModal.module.css";
import { IconX } from "@tabler/icons-react";
import whatsapp from "../../images/whatsapp.svg";
import discord from "../../images/discord.svg";
import facebook from "../../images/facebook.svg";
import copy from "../../images/copy.svg";
import instagram from "../../images/instagram.svg";
import messenger from "../../images/messenger.svg";
import reddit from "../../images/reddit.svg";
import telegram from "../../images/telegram.svg";
import twitter from "../../images/twitter.svg";
import { Dispatch, SetStateAction } from "react";
import { useContexData } from "../ContextApi/ContextApi";
import { toast } from "react-toastify";

const SOCIA_MEDIA = [
  {
    image: twitter,
    title: "Twitter",
  },
  {
    image: facebook,
    title: "Facebook",
  },
  {
    image: reddit,
    title: "Reddit",
  },
  {
    image: discord,
    title: "Discord",
  },
  {
    image: whatsapp,
    title: "Whatsapp",
  },
  {
    image: messenger,
    title: "Messenger",
  },
  {
    image: telegram,
    title: "Telegram",
  },
  {
    image: instagram,
    title: "Instagram",
  },
];

export default function SharePostModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {

  const {user} = useContexData();

  const pageLink = `https://www.${user?.username}/feed`
  const handleShare = (platform: string) => {
    let shareUrl = "";
    switch (platform) {
      case "Twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${pageLink}`;
        break;
      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageLink}`;
        break;
      case "Reddit":
        shareUrl = `https://reddit.com/submit?url=${pageLink}`;
        break;
      case "Discord":
        // Discord doesn't allow direct sharing via link
        alert("Copy the link and share in Discord manually!");
        return;
      case "WhatsApp":
        shareUrl = `https://api.whatsapp.com/send?text=${pageLink}`;
        break;
      case "Messenger":
        shareUrl = `https://www.facebook.com/dialog/send?link=${pageLink}`;
        break;
      case "Telegram":
        shareUrl = `https://t.me/share/url?url=${pageLink}`;
        break;
      case "Instagram":
        alert(
          "Instagram doesn't support direct link sharing. Use the copy link option."
        );
        return;
      default:
        break;
    }
    window.open(shareUrl, "_blank");
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className={styles.shareContainer}>
        <div className={styles.shareHeader}>
          <div className={styles.shareTitle}>Share post</div>
          <button className={styles.closeButton} onClick={() => setOpen(false)}>
            <IconX />
          </button>
        </div>
        <div className={styles.socialMediaContainer}>
          {SOCIA_MEDIA.map((item, index) => (
            <button
              className={styles.socialMedia}
              key={index}
              onClick={() => handleShare(item.title)}
            >
              <div className={styles.socialMediaImage}>
                <img src={item.image} />
              </div>
              <div className={styles.socilaMediaTitle}>{item.title}</div>
            </button>
          ))}
        </div>
        <div className={styles.pageLinkTitle}>Page Link</div>
        <div className={styles.pageLinkContainer}>
          <div className={styles.linkTitle}>{pageLink}</div>
          <button
            className={styles.copyButton}
            onClick={() => {
              navigator.clipboard.writeText(pageLink)
              toast.success("copied!")
            }}
          >
            <img src={copy} />
          </button>
        </div>
      </div>
    </Modal>
  );
}
