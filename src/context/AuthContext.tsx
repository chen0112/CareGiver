import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: number;
  name: string;
  phone: string;
  createtime: string;
  imageurl: string;
  // Add other fields as needed
};

type AuthContextType = {
  currentUser: User | null;
  userType: string | null;
  signIn: (user: User, type: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Load the user from local storage on initial render
    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    console.log("Retrieved from local storage:", storedUser);  // <-- Log here
    return storedUser;
  });
  const [userType, setUserType] = useState<string | null>(() => {
    return localStorage.getItem("userType");
  });

  const signIn = (user: User, type: string): void => {
    console.log("Signing in with user:", user);
    setCurrentUser(user);
    setUserType(type);
    // Save user and type to local storage
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("userType", type);
  };

  const signOut = (): void => {
    setCurrentUser(null);
    setUserType(null);
    // Clear from local storage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userType");
  };

  return (
    <AuthContext.Provider value={{ currentUser, userType, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
