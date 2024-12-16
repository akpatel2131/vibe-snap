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

  const generateVideoThumbnail = useCallback(
    (file: File): Promise<string | null> => {
      return new Promise((resolve) => {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.crossOrigin = "anonymous";

        video.onloadeddata = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/png"));
          } else {
            resolve(null);
          }
          URL.revokeObjectURL(video.src);
        };

        video.onerror = () => {
          resolve(null);
        };
      });
    },
    []
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const fileUrls: string[] = [];
        Array.from(files).forEach((file) => {
          setFileType(file.type);
          if (file.type.startsWith("image/")) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
              if (fileReader.result) {
                fileUrls.push(fileReader.result.toString());
                setSelectedFiles((prev) => [
                  ...prev,
                  fileReader.result!.toString(),
                ]);
              }
            };
            fileReader.readAsDataURL(file);
          } else if (file.type.startsWith("video/")) {
            generateVideoThumbnail(file).then((thumbnail) => {
              console.log({ thumbnail });
              if (thumbnail) {
                setSelectedFiles((prev) => [...prev, thumbnail]);
              }
            });
          }
        });
      }
    },
    [generateVideoThumbnail, setFileType, setSelectedFiles]
  );

  // const uploadImageToStorage = useCallback(
  //   async (file: File, path: string): Promise<string> => {
  //     try {
  //       const storage = getStorage();
  //       const storageRef = ref(storage, `${path}/${file.name}`); // Use file name in the path
  //       await uploadBytes(storageRef, file); // Upload the file to Firebase Storage
  //       const downloadURL = await getDownloadURL(storageRef); // Get the public URL
  //       return downloadURL; // Return the URL for Firestore or state
  //     } catch (error) {
  //       console.error("Error uploading image to Firebase Storage:", error);
  //       throw error;
  //     }
  //   },
  //   []
  // );

  // const handleProfileImageUpload = useCallback(
  //   async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
  //     const files = event.target.files;

  //     if (!files) {
  //       console.error("No files selected.");
  //       return;
  //     }

  //     // Upload each file
  //     for (const file of Array.from(files)) {
  //       if (!file.type.startsWith("image/")) {
  //         console.error("File is not an image.");
  //         return;
  //       }

  //       try {
  //         // Upload image to Firebase Storage based on type
  //         const filePath =
  //           type === "profile"
  //             ? `users/${user?.userId}/profile`
  //             : `users/${user?.userId}/bio`;
  //         const downloadURL = await uploadImageToStorage(file, filePath);

  //         // Update user object based on the type
  //         if (type === "profile" && user) {
  //           setUser({
  //             ...user,
  //             photo: downloadURL,
  //           });
  //         } else if (type === "bio" && user) {
  //           setUser({
  //             ...user,
  //             bio_photo: downloadURL,
  //           });
  //         }

  //         console.log(`${type} image uploaded successfully.`);
  //       } catch (error) {
  //         console.error(`Error uploading ${type} image:`, error);
  //       }
  //     }
  //   },
  //   [user]
  // );

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
        console.log("User Data:", userData);
        return userData;
      } else {
        console.log("No such user found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by UUID:", error);
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
        console.log("User data retrieved:", userDoc.data());
        return userDoc.data() as UserData; // Return user data
      } else {
        console.error("No user found with the given ID.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
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
          console.log("Data added successfully!");
        } else {
          console.error("No user is logged in");
        }
      } catch (error) {
        console.error("Error adding document: ", error);
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
          console.log("User data updated successfully!");
        } else {
          console.error("No user is logged in");
        }
      } catch (error) {
        console.error("Error updating document: ", error);
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
          console.log("Post added successfully!");
        } else {
          console.error("No user is logged in");
        }
      } catch (error) {
        console.error("Error adding post: ", error);
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
      console.log("All Posts:", posts);
      return posts as FeedData[];
    } catch (error) {
      console.error("Error fetching all posts: ", error);
    }
  }, []);

  const fetchPostsByUser = useCallback(async () => {
    try {
      console.log({ user });
      const userId = user?.userId;
      console.log({ userId });
      if (!userId) {
        return [];
      }
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", userId)
      );
      console.log({ postsQuery });
      const querySnapshot = await getDocs(postsQuery);

      console.log({ querySnapshot });
      const posts: object[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({ docId: doc.id, ...doc.data() });
      });
      console.log("Posts by User:", posts);
      return posts as FeedData[];
    } catch (error) {
      console.error("Error fetching posts by user: ", error);
    }
  }, [user]);

  const handleLikes = useCallback(
    async (postId: string, likes: string[]) => {
      try {
        console.log("ref");
        const postRef = doc(db, "posts", postId);
        const currentUserId = user?.userId;
        console.log({ currentUserId });
        if (!currentUserId) return;
        if (likes.includes(currentUserId)) {
          await updateDoc(postRef, {
            likes: arrayRemove(currentUserId),
          });
          const data = postData.map((item) => {
            if (item.docId === postId) {
              return {
                ...item,
                likes: item.likes.filter((id) => id !== currentUserId),
              };
            }
            return item;
          });

          setPostData(data);
        } else {
          await updateDoc(postRef, {
            likes: arrayUnion(currentUserId),
          });

          const data = postData.map((item) => {
            if (item.docId === postId) {
              return {
                ...item,
                likes: [...item.likes, currentUserId],
              };
            }
            return item;
          });

          setPostData(data);
        }
      } catch (error) {
        console.error("Error updating likes: ", error);
      }
    },
    [user]
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
