import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import cameraIcon from "../../images/camera-icon.svg";
import styles from "./createFeed.module.css";
import { useContexData } from "../ContextApi/ContextApi";

const CameraModal = () => {
  const [open, setOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {setSelectedFiles} = useContexData();

  // Open the modal to start camera preview
  const handleClickOpen = () => {
    setOpen(true);
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  };

  // Close the modal and stop the video stream
  const handleClose = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCapturedImage(null);
    setOpen(false);
  };

  // Capture the image from the video stream
  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
      }
    }
  };

  const handleUpload = useCallback(() => {
    if (capturedImage) {
        setSelectedFiles([capturedImage])
        setCapturedImage(null)
    };
    handleClose();
  },[])

  return (
    <div>
      <button className={styles.uploadButton} onClick={handleClickOpen}>
        <img src={cameraIcon} />
        Camera
      </button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Capture Image</DialogTitle>
        <DialogContent>
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: "100%", maxHeight: "300px" }}
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width="100%"
              height="auto"
            ></video>
          )}

          {/* Canvas Element for Image Capturing */}
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          {!capturedImage ? (
            <Button onClick={handleCapture} color="primary">
              Capture
            </Button>
          ) : (
            <Button onClick={handleUpload} color="primary">
              Upload
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CameraModal;
