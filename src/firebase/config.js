
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase config object using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCBGCdycrKLfgLkdFJxc3s6MveN9O9WEaM",
  authDomain: "ethioblogs-93bb4.firebaseapp.com",
  projectId: "ethioblogs-93bb4",
  storageBucket: "ethioblogs-93bb4.firebasestorage.app",
  messagingSenderId: "92397453630",
  appId: "1:92397453630:web:9bfaef989186cdc90cac6f",
  measurementId: "G-SGMKLW6TLC"
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Google Auth Provider Setup
const googleProvider = new GoogleAuthProvider();

// Email/Password Auth Functions
const signUpWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;  // Returning user data for potential use
  } catch (error) {
    throw new Error(error.message);  // Throw error for better error handling
  }
};

const signInWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Google Authentication Function
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Sign out Function
const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Auth State Change Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user);
  } else {
    console.log("User is logged out");
  }
});

// Firestore Database Function: Save Post with Optional Photo URL
const savePost = async (title, content, authorId, photoURL = null) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      title,
      content,
      authorId,
      photoURL,
      createdAt: new Date(),
    });
    console.log("Post added with ID:", docRef.id);
  } catch (error) {
    throw new Error("Error adding post: " + error.message);
  }
};

// Firebase Storage: Upload Photo Function
const uploadPhoto = async (file) => {
  try {
    const storageRef = ref(storage, 'photos/' + file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;  // Return the photo URL to save in Firestore
  } catch (error) {
    throw new Error("Error uploading file: " + error.message);
  }
};

// Example usage of uploading a photo and saving a post with photo URL
const handleCreatePost = async (title, content, file, userId) => {
  let photoURL = null;
  if (file) {
    photoURL = await uploadPhoto(file);  // Upload the file and get URL
  }
  await savePost(title, content, userId, photoURL);  // Save post with or without photo URL
};

// Export functions to be used elsewhere in the app
export {
  auth, db, storage,
  signUpWithEmailPassword, signInWithEmailPassword, signInWithGoogle, signOutUser,
  savePost, uploadPhoto, handleCreatePost
};
