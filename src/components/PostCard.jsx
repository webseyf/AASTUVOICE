/* eslint-disable react/prop-types */
import React, { memo, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// import { useFirestore } from "../hooks/useFirestore"; // Import the useFirestore hook
import { AuthContext } from "../contexts/AuthContexts"; // Import the authContext to get currentUser
import "../styles/PostCard.css"; // Ensure proper styles are applied

const PostCard = ({ post }) => {
  const { id, title, content, imageURLs = [], price, category, deliveryOption /* likes, likedBy */ } = post || {};
  // const { likePost } = useFirestore(); // Access the likePost function
  const { currentUser } = useContext(AuthContext); // Get the current user from authContext
  // const [hasLiked, setHasLiked] = useState(false);
  // const [likeCount, setLikeCount] = useState(likes); // Manage like count locally

  // useEffect(() => {
  //   if (likedBy && currentUser) {
  //     setHasLiked(likedBy.includes(currentUser.email)); // Check if the current user has liked the post
  //   }
  // }, [likedBy, currentUser]);

  if (!post) {
    return (
      <div className="post-card error-card">
        <p>No post data available or something went wrong.</p>
      </div>
    );
  }

  // const handleLike = async () => {
  //   if (currentUser) {
  //     try {
  //       // Toggle the like status in Firestore
  //       await likePost(id, currentUser.email);
  //       setHasLiked(!hasLiked); // Toggle the local like state
  //       setLikeCount(prevCount => hasLiked ? prevCount - 1 : prevCount + 1); // Adjust local like count
  //     } catch (error) {
  //       console.error("Error updating like status:", error);
  //       alert("Something went wrong, please try again later.");
  //     }
  //   } else {
  //     alert("You must be logged in to like a post!"); // Alert if not logged in
  //   }
  // };

  const handleImageError = (e) => {
    e.target.src = "/path-to-placeholder-image.png"; // Replace with your placeholder image URL
    e.target.alt = "Image not available";
  };

  return (
    <div className="post-card">
      <Link to={`/posts/${id}`} aria-label={`View details of ${title || "post"}`}>
        {/* Only render the image section if there are images available */}
        {imageURLs.length > 0 && (
          <>
            <img
              src={imageURLs[0]} // Display the first image
              alt={title || "Post Image"}
              className="post-image"
              loading="lazy"
              onError={handleImageError}
            />
            {/* Display more images count if multiple images exist */}
            {imageURLs.length > 1 && (
              <div className="more-images">
                <span className="more-images">{`+${imageURLs.length - 1} more image(s)`}</span>
              </div>
            )}
          </>
        )}
      </Link>

      <div className="post-details">
        <Link to={`/posts/${id}`} aria-label={`View details of ${title || "post"}`}>
          <h2 className="post-title">{title || "Untitled Post"}</h2>
          <p className="post-snippet">
            {content?.length > 100 ? `${content.substring(0, 100)}...` : content || "No content available"}
          </p>
        </Link>
        <span className="one">
          {/* Display price if the post is a product for sale */}
          {category === "Product To Sale" && price && (
            <p className="post-price">
              <strong>{price.toFixed(2)} Br</strong>
            </p>
          )}

          {/* Like button */}
          {/* <div className="like-button">
            <button onClick={handleLike} className={hasLiked ? "liked" : "not-liked"}>
              {hasLiked ? "Unlike" : "Like"} ({likeCount})
            </button>
          </div> */}

          {/* Display delivery option if the post is a product for sale */}
          {category === "Product To Sale" && deliveryOption && (
            <p className="post-delivery">
              <strong>{deliveryOption}</strong>
            </p>
          )}
        </span>
      </div>
    </div>
  );
};

export default memo(PostCard);
