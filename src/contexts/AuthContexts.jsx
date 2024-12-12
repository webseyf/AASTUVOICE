import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebase/config"; // Import auth correctly
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import Loader from "../components/Loader";

// Create the AuthContext
export const AuthContext = createContext();

// Custom Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Firebase error message mapper
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'The email is already in use.',
    'auth/invalid-email': 'Invalid email format.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/popup-closed-by-user': 'The sign-in popup was closed before completing the sign-in process.',
  };
  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Track the currently logged-in user
  const [loading, setLoading] = useState(true); // Loading state for initial auth check

  // Set up a listener for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update the current user
      setLoading(false);    // Authentication check complete
    });

    // Clean up the listener on unmount
    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Sign-up error:", error.message);
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Log in with email and password
  const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Log in with Google
  const logInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google Sign-In Successful:", user);
      return user;
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Log out the current user
  const logOut = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error.message);
      throw new Error("Failed to log out. Please try again.");
    }
  };

  // Send a password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully.");
    } catch (error) {
      console.error("Password reset error:", error.message);
      throw new Error(getErrorMessage(error.code));
    }
  };

  // AuthContext values to provide across the application
  const value = {
    currentUser,
    signUp,
    logIn,
    logInWithGoogle, // Add Google login method
    logOut,
    resetPassword,
    auth, // Add the auth object to the context value
  };

  // Render the provider and children components
  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <p><Loader/></p>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
