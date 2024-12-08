/* eslint-disable react/prop-types */
import React, { memo, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContexts"; // For accessing currentUser
import "../styles/PostCard.css";

const PostCard = ({ post }) => {
  const {
    id = "unknown-id",
    title = "Untitled Post",
    content = "No content available",
    imageURLs = [],
    price,
    category,
    deliveryOption,
  } = post || {};

  const { currentUser } = useContext(AuthContext);

  if (!post) {
    return (
      <div className="post-card error-card">
        <p>No post data available or something went wrong.</p>
      </div>
    );
  }

  return (
    <div className="post-card">
      <Link to={`/posts/${id}`} aria-label={`View details of ${title}`}>
        {/* Render image only if it exists */}
        {imageURLs.length > 0 && (
          <>
            <img
              src={imageURLs[0]} // Display the first image
              alt={title}
              className="post-image"
              loading="lazy"
            />
            {imageURLs.length > 1 && (
              <div className="more-images">
                <span>{`+${imageURLs.length - 1} more image(s)`}</span>
              </div>
            )}
          </>
        )}
      </Link>

      <div className="post-details">
        <Link to={`/posts/${id}`} aria-label={`View details of ${title}`}>
          <h2 className="post-title">{title}</h2>
          <p className="post-snippet">
            {content.length > 80 ? `${content.substring(0, 80)}...` : content}
          </p>
        </Link>
        <div className="additional-info">
          {/* Display price if the post is a product for sale */}
          {category === "Product To Sale" && price && (
            <p className="post-price">
              <strong>{price.toFixed(2)} Br</strong>
            </p>
          )}
          {/* Display delivery option if applicable */}
          {category === "Product To Sale" && deliveryOption && (
            <p className="post-delivery">
              <strong>{deliveryOption}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(PostCard);
