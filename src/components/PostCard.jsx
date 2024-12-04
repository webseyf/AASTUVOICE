/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { Link } from "react-router-dom";
import "../styles/PostCard.css"; // Ensure proper styles are applied

const PostCard = ({ post }) => {
  const { id, title, content, imageURL, author, price, phoneNumber, category } = post || {}; // Added price and phoneNumber

  if (!post) {
    return (
      <div className="post-card error-card">
        <p>No post data available or something went wrong.</p>
      </div>
    );
  }

  const handleImageError = (e) => {
    e.target.src = "/path-to-placeholder-image.png"; // Replace with your placeholder image URL
    e.target.alt = "Image not available";
  };

  return (
    <div className="post-card">
      <Link to={`/posts/${id}`} aria-label={`View details of ${title || "post"}`}>
        {imageURL ? (
          <img
            src={imageURL}
            alt={title || "Post Image"}
            className="post-image"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="image-placeholder">No Image Available</div>
        )}

        <div className="post-details">
          <h2 className="post-title">{title || "Untitled Post"}</h2>
          <p className="post-snippet">
            {content?.length > 100
              ? `${content.substring(0, 100)}...`
              : content || "No content available"}
          </p>
          <p className="post-meta">
            <i>{author || "Anonymous"}</i>
          </p>

          {/* Display price if the post is a product for sale or has a price */}
          {(category === "Product To Sale" || (price && phoneNumber)) && (
            <p className="post-price">
              Price: <strong>${price.toFixed(2)}</strong> {/* Format price */}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default memo(PostCard);