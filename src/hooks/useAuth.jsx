import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContexts"; // Fixed path (ensure consistency)

// Custom hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context; // Return AuthContext values: currentUser, signUp, logIn, logOut, resetPassword
};
