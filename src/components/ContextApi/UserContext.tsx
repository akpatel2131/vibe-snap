import { ReactNode, createContext, useContext, useState } from "react";

// Define the type for the user object (customize according to your user data structure)
interface User {
  displayName: string | null;
  email: string | null;
  authToken: string | null;
}

// Define the type for the context value
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create the User Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserContext Provider component
export const UserProvider = ({ children }: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null); // User state

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

