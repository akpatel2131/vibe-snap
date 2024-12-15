import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { auth, db } from "../UiComponents/FireBase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";

// Define the type for the user object (customize according to your user data structure)
interface User {
  displayName: string | null;
  email: string | null;
  authToken: string | null;
}

interface UserData {
  email: string;
  username: string;
  photo: string;
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
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedFiles: string[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  generateVideoThumbnail: (file: File) => void;
  fileType: string;
  addUserData: (value: UserData) => void;
  addPost: (value: PostData) => void;
  fetchAllPosts: () => Promise<FeedData[] | undefined>;
  fetchPostsByUser: (value: string) => Promise<FeedData[] | undefined>;
}

// Create the User Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserContext Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string>("");

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
  },[]);

  const addUserData = useCallback(
    async (data: { email: string; username: string; photo: string }) => {
      try {
        const userData = auth.currentUser;
        if (userData) {
          const userId = userData.uid;
          await setDoc(doc(db, "users", userId), {
            ...data,
            userId,
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
    []
  );

  const addPost = useCallback(async(post: PostData) => {
    try {

      const userData = auth.currentUser;
      if (userData) {
        const fetchUser = await fetchUserByUUID(userData.uid)
        const newPost = {
          ...post,
          email: fetchUser?.email,
          username: fetchUser?.username,
          photo: fetchUser?.photo,
          userId: fetchUser?.userId,  
          createdAt: new Date().toISOString(),
        };

        // Add post to Firestor

        console.log({newPost})


        await addDoc(collection(db, "posts"), newPost);
        console.log("Post added successfully!");
      } else {
        console.error("No user is logged in");
      }
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  }, [fetchUserByUUID]);

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

  const fetchPostsByUser = useCallback(async (userId: string) => {
    try {
      const postsQuery = query(
        collection(db, "posts"),
        where("userID", "==", userId)
      );
      const querySnapshot = await getDocs(postsQuery);
      const posts : object[]= [];
      querySnapshot.forEach((doc) => {
        posts.push({ docId: doc.id, ...doc.data() });
      });
      console.log("Posts by User:", posts);
      return posts as FeedData[]
    } catch (error) {
      console.error("Error fetching posts by user: ", error);
    }
  },[])

  const methods = {
    user,
    setUser,
    selectedFiles,
    setSelectedFiles,
    handleFileChange,
    generateVideoThumbnail,
    fileType,
    addUserData,
    addPost,
    fetchAllPosts,
    fetchPostsByUser,
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
