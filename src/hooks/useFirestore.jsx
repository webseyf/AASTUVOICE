import { useState } from "react";
import { db } from "../firebase/config"; // Ensure correct Firebase initialization
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  // arrayUnion,
  // increment,
} from "firebase/firestore";

// Helper function to handle Firestore operations with loading and error states
const firestoreAction = async (action, setLoading, setError) => {
  try {
    setLoading(true);
    setError(null); // Clear previous errors
    return await action();
  } catch (err) {
    setError(err.message || "An error occurred");
    console.error("Firestore operation error:", err);
  } finally {
    setLoading(false);
  }
};

// Custom hook for managing Firestore operations
export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postsRef = collection(db, "posts");
  const commentsRef = collection(db, "comments");

  // Fetch all posts (ordered by creation date)
// Fetch all posts (ordered by creation date)
const fetchPosts = async () => {
  return await firestoreAction(async () => {
    try {
      const q = query(postsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.warn("No posts found in Firestore.");
        return []; // Return an empty array if no posts found
      }

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        // Ensure `createdAt` is present; otherwise, log a warning
        if (!data.createdAt) {
          console.warn(`Document ${doc.id} is missing 'createdAt' field.`);
        }
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null, // Convert Firestore Timestamp to JS Date
        };
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error; // Re-throw to handle in `firestoreAction`
    }
  }, setLoading, setError);
};

  // Fetch a single post by ID
  const fetchPostById = async (postId) => {
    return await firestoreAction(async () => {
      const docRef = doc(postsRef, postId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    }, setLoading, setError);
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    return await firestoreAction(async () => {
      const q = query(
        commentsRef,
        where("postId", "==", postId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.empty
        ? []
        : snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }, setLoading, setError);
  };

  // Add a comment to a post
  const addComment = async (postId, commentData) => {
    return await firestoreAction(async () => {
      await addDoc(commentsRef, {
        ...commentData,
        postId,
        createdAt: Timestamp.now(),
      });
    }, setLoading, setError);
  };

  // Fetch posts created by a specific user
  const fetchUserPosts = async (email) => {
    return await firestoreAction(async () => {
      const q = query(
        postsRef,
        where("email", "==", email),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.empty
        ? []
        : snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }, setLoading, setError);
  };

  // Add a new post
  const addPost = async (postData) => {
    return await firestoreAction(async () => {
      await addDoc(postsRef, {
        ...postData,
        createdAt: Timestamp.now(),
        // likes: 0,
        // likedBy: [],
      });
    }, setLoading, setError);
  };

  // Delete a post by ID
  const deletePost = async (postId) => {
    return await firestoreAction(async () => {
      await deleteDoc(doc(postsRef, postId));
    }, setLoading, setError);
  };

  // Update an existing post
  const updatePost = async (postId, updatedData) => {
    return await firestoreAction(async () => {
      await updateDoc(doc(postsRef, postId), updatedData);
    }, setLoading, setError);
  };

  // Like a post (ensures one like per user)
  // const likePost = async (postId, userId) => {
  //   return await firestoreAction(async () => {
  //     const postRef = doc(postsRef, postId);

  //     await db.runTransaction(async (transaction) => {
  //       const postSnap = await transaction.get(postRef);
  //       if (!postSnap.exists()) {
  //         throw new Error("Post does not exist");
  //       }

  //       const postData = postSnap.data();
  //       const { likedBy = [] } = postData;

  //       if (likedBy.includes(userId)) {
  //         // User already liked, no action needed
  //         return;
  //       }

  //       // Add user to likedBy and increment likes
  //       transaction.update(postRef, {
  //         likedBy: arrayUnion(userId),
  //         likes: increment(1),
  //       });
  //     });
  //   }, setLoading, setError);
  // };

  return {
    fetchPosts,
    fetchPostById,
    fetchComments,
    fetchUserPosts,
    addComment,
    addPost,
    deletePost,
    updatePost,
    // likePost,
    loading,
    error,
  };
};
