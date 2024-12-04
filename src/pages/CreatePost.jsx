import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
import { useAuth } from "../hooks/useAuth";
import "../styles/CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addPost } = useFirestore();
  const navigate = useNavigate();

  const categories = [
    "All General Posts",
    "Product To Sale",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validations
    if (!title || !content || !category) {
      alert("All fields are required.");
      setLoading(false);
      return;
    }

    if (category === "Product To Sale" && (!price || !phoneNumber)) {
      alert("Price and phone number are required for products to sale.");
      setLoading(false);
      return;
    }

    const newPost = {
      title,
      content,
      category,
      author: user?.displayName || user?.email || "Anonymous",
      createdAt: new Date(),
      price: category === "Product To Sale" ? parseFloat(price) : null,
      phoneNumber: category === "Product To Sale" ? phoneNumber : null,
      imageURL: imageURL.trim() || null,
    };

    console.log("New Post Object: ", newPost); // Debugging line

    try {
      await addPost(newPost);
      navigate(category === "Product To Sale" ? "/marketplace" : "/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your post title"
            required
          />
        </div>

        {/* Content */}
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content"
            rows="6"
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional fields for "Product To Sale" */}
        {category === "Product To Sale" && (
          <>
            <div className="form-group">
              <label htmlFor="price">Price (Birr)</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter the price"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </>
        )}

        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="imageURL">Add Image URL</label>
          <div className="image-input-group">
            <input
              type="url"
              id="imageURL"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="Enter an image URL"
            />
          </div>
          {imageURL && (
            <div className="image-preview-group">
              <div className="image-preview-item">
                <img src={imageURL} alt="Preview" className="preview-img" />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;