import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { db } from "../UiComponents/FireBase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  setDoc,
  arrayRemove,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";

// Define the type for the user object (customize according to your user data structure)

interface UserData {
  email: string;
  username: string;
  photo: string;
  bio_photo: string;
  bio_discription: string;
  userId?: string;
}

interface PostData {
  fileName: string[];
  fileType: "image" | "video";
  description: string;
  likes: string[]; // Initialize empty
}

export interface FeedData extends PostData, UserData {
  createdAt: string;
  docId: string;
}

// Define the type for the context value
interface UserContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  postData: FeedData[];
  setPostData: React.Dispatch<React.SetStateAction<FeedData[]>>;
  selectedFiles: string[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
  generateVideoThumbnail: (file: File) => void;
  fileType: string;
  addUserData: (value: UserData) => void;
  updateUserData: (value: UserData) => void;
  getUserById: (value: string) => Promise<UserData | null>;
  addPost: (value: PostData) => void;
  fetchAllPosts: () => Promise<FeedData[] | undefined>;
  fetchPostsByUser: () => Promise<FeedData[] | undefined>;
  handleLikes: (postId: string, likes: string[]) => void;
}

// Create the User Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserContext Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string>("");
  const [postData, setPostData] = useState<FeedData[]>([]);

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement("video");
      const canvasElement = document.createElement("canvas");
      const context = canvasElement.getContext("2d");
  
      if (!context) {
        reject("Canvas context not available.");
        return;
      }
  
      videoElement.src = URL.createObjectURL(file);
      videoElement.muted = true;
  
      videoElement.onloadeddata = () => {
        // Set canvas dimensions to video frame
        canvasElement.width = videoElement.videoWidth / 2; // Reduce size
        canvasElement.height = videoElement.videoHeight / 2;
  
        // Draw the first frame of the video onto the canvas
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  
        // Convert canvas content to a Base64 image
        const thumbnailBase64 = canvasElement.toDataURL("image/jpeg", 0.7); // Adjust quality
        resolve(thumbnailBase64);
      };
  
      videoElement.onerror = (error: any) => {
        reject(`Error loading video: ${error.message}`);
      };
    });
  };
  

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) {
        console.error("No files selected.");
        return;
      }
  
      Array.from(files).forEach((file) => {
        setFileType(file.type);
  
        // Handle image files
        if (file.type.startsWith("image/")) {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            if (fileReader.result) {
              setSelectedFiles((prev) => [
                ...prev,
                fileReader.result!.toString(),
              ]);
            }
          };
          fileReader.readAsDataURL(file);
  
          // Handle video files
        } else if (file.type.startsWith("video/")) {
          // Use `generateVideoThumbnail` to create a thumbnail
          generateVideoThumbnail(file)
            .then((thumbnail) => {
              if (thumbnail) {
                setSelectedFiles((prev) => [...prev, thumbnail]);
              }
            })
            .catch((error) => {
              console.error("Error generating video thumbnail:", error);
            });
        } else {
          console.error("Unsupported file type:", file.type);
        }
      });
    },
    [setFileType, setSelectedFiles]
  );
  

const handleProfileImageUpload = useCallback(
  (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = event.target.files;

    if (!files) {
      console.error("No files selected.");
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        console.error("File is not an image.");
        return;
      }

      try {
        // Resize image and convert to Base64
        Resizer.imageFileResizer(
          file,
          300, // maxWidth
          300, // maxHeight
          "JPEG", // format
          70, // quality
          0, // rotation
          (uri) => {
            // Handle resized image URI (base64)
            if (type === "profile" && user) {
              setUser({
                ...user,
                photo: uri.toString(),
              });
            } else if (type === "bio" && user) {
              setUser({
                ...user,
                bio_photo: uri.toString(),
              });
            }
          },
          "base64" // Output type
        );
      } catch (error) {
        console.error("Error resizing image:", error);
      }
    });
  },
  [user]
);


  const fetchUserByUUID = useCallback(async (userId: string) => {
    try {
      // Reference to the specific user's document in the "users" collection
      const userRef = doc(db, "users", userId);

      // Fetch the document
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // If the document exists, return its data
        const userData = userSnap.data();
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      toast.error("There is some issue from our side. Please try later");
      throw error;
    }
  }, []);

  const getUserById = useCallback(async (userId: string) => {
    try {
      if (!userId) {
        console.error("User ID is required.");
        return null;
      }

      // Create a reference to the user document
      const userDocRef = doc(db, "users", userId);

      // Fetch the document
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data() as UserData; // Return user data
      } else {
        return null;
      }
    } catch (error) {
      toast.error("There is some issue from our side. Please try later");
      return null;
    }
  }, []);

  const addUserData = useCallback(
    async (data: UserData) => {
      try {
        const id = user?.userId;
        if (id) {
          await setDoc(doc(db, "users", id), {
            ...data,
            userId: id,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        toast.error("There is some issue from our side. Please try later");
      }
    },
    [user]
  );

  const updateUserData = useCallback(
    async (data: UserData) => {
      try {
        const id = user?.userId; // Ensure `user` has the user ID
        if (id) {
          const userDocRef = doc(db, "users", id);

          // Update the document in Firestore
          await updateDoc(userDocRef, {
            ...data,
            updatedAt: new Date().toISOString(), // Track the update timestamp
          });
        } 
      } catch (error) {
        toast.error("There is some issue from our side. Please try later");
      }
    },
    [user]
  );

  const addPost = useCallback(
    async (post: PostData) => {
      try {
        const id = user?.userId;
        if (id) {
          const fetchUser = await fetchUserByUUID(id);
          const newPost = {
            ...post,
            email: fetchUser?.email,
            username: fetchUser?.username,
            photo: fetchUser?.photo,
            userId: fetchUser?.userId,
            createdAt: new Date().toISOString(),
          };

          await addDoc(collection(db, "posts"), newPost);
          toast.success("Post added successfully!");
        }
      } catch (error) {
        toast.error("There is some issue from our side. Please try later");
      }
    },
    [fetchUserByUUID, user]
  );

  const fetchAllPosts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const posts = [] as object[];
      querySnapshot.forEach((doc) => {
        posts.push({ docId: doc.id, ...doc.data() });
      });
      return posts as FeedData[];
    } catch (error) {
      toast.error("There is some issue from our side. Please try later");
    }
  }, []);

  const fetchPostsByUser = useCallback(async () => {
    try {
      const userId = user?.userId;
      if (!userId) {
        return [];
      }
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(postsQuery);

      const posts: object[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({ docId: doc.id, ...doc.data() });
      });
      return posts as FeedData[];
    } catch (error) {
      toast.error("There is some issue from our side. Please try later");
    }
  }, [user]);

  const handleLikes = useCallback(
    async (postId: string, likes: string[]) => {
      try {
        const postRef = doc(db, "posts", postId);
        const currentUserId = user?.userId;
        if (!currentUserId) return;
        if (likes.includes(currentUserId)) {
          await updateDoc(postRef, {
            likes: arrayRemove(currentUserId),
          });
          const data = [];
          for (let i = 0; i < postData.length; i++) {
            const item = postData[i];
            if (item.docId === postId) {
              data.push({
                ...item,
                likes: [...item.likes.filter((id) => id !== currentUserId)],
              });
            } else {
              data.push({...item});
            }
          }

          setPostData(data);
        } else {
          await updateDoc(postRef, {
            likes: arrayUnion(currentUserId),
          });

          const data = [];
          for (let i = 0; i < postData.length; i++) {
            const item = postData[i];
            if (item.docId === postId) {
              data.push({
                ...item,
                likes: [...item.likes, currentUserId],
              });
            } else {
              data.push({...item});
            }
          }

          setPostData(data);
        }
      } catch (error) {
        toast.error("There is some issue from our side. Please try later");
      }
    },
    [user, postData]
  );

  const methods = {
    user,
    setUser,
    postData,
    setPostData,
    selectedFiles,
    setSelectedFiles,
    handleFileChange,
    handleProfileImageUpload,
    generateVideoThumbnail,
    fileType,
    addUserData,
    updateUserData,
    getUserById,
    addPost,
    fetchAllPosts,
    fetchPostsByUser,
    handleLikes,
  };

  return (
    <UserContext.Provider value={methods}>{children}</UserContext.Provider>
  );
};

export const useContexData = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
