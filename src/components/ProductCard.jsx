/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { Link } from "react-router-dom";
import "../styles/PostCard.css"; // Ensure the styles are updated accordingly

const ProductCard = ({ post }) => {
  // Destructure with default values to handle undefined post data gracefully
  const { id, title, content, images, price, phoneNumber, author, category } = post || {};

  // Return a fallback UI if no post data is available
  if (!post) {
    return (
      <div className="post-card">
        <p className="no-data">No post data available</p>
      </div>
    );
  }

  return (
    <div className="post-card">
      <Link to={`/posts/${id}`} aria-label={`View details of ${title}`} className="post-link">
        {/* Post image container for multiple images */}
        <div className="post-image-container">
          {images && images.length > 0 ? (
            <img
              src={images[0]} // Display first image (can be modified to carousel later)
              alt={title || "Post Image"}
              className="post-image"
              loading="lazy" // Image will only load when it comes into view
            />
          ) : (
            <div className="image-placeholder">No Image Available</div>
          )}
        </div>

        {/* Post details section */}
        <div className="post-details">
          <h2 className="post-title">{title || "Untitled Post"}</h2>
          <p className="post-snippet">
            {content?.substring(0, 100) || "No content available..."} {/* Display first 100 characters */}
          </p>
          
          {/* Display price and phone number for "Product to Sale" */}
          {category === "Product To Sale" && (
            <div className="product-info">
              <p className="post-price">Price: Br {price}</p>
              {phoneNumber && <p className="post-phone">Contact: {phoneNumber}</p>}
            </div>
          )}

          {/* Post author */}
          <p className="post-meta">
            <i>{author || "Anonymous"}</i>
          </p>
        </div>
      </Link>
    </div>
  );
};

export default memo(ProductCard);
