import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
import { useAuth } from "../hooks/useAuth";
import "../styles/CreatePost.css";
import axios from "axios"; // Import Axios for making HTTP requests

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryOption, setDeliveryOption] = useState(""); // State for delivery option
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // State for multiple file selection
  const { user } = useAuth();
  const { addPost } = useFirestore();
  const navigate = useNavigate();

  const categories = ["All General Posts", "Product To Sale"];
  const deliveryOptions = ["Free delivery", "Pick up", "5 Br delivery", "10 Br delivery"]; // Delivery options

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validations
    if (!title || !content || !category) {
      alert("All fields are required.");
      setLoading(false);
      return;
    }

    if (category === "Product To Sale" && (!price || !phoneNumber || !deliveryOption)) {
      alert("Price, phone number, and delivery option are required for products to sell.");
      setLoading(false);
      return;
    }

    let imageURLs = []; // Initialize imageURLs array here

    // Upload images to ImgBB if files are selected
    if (selectedFiles.length > 0) {
      const uploadPromises = selectedFiles.map((file) => {
        const formData = new FormData();
        formData.append("image", file);

        return axios
          .post("https://api.imgbb.com/1/upload?key=970605ee4c09903bbca5c5317f4b1df3", formData)
          .then((response) => response.data.data.url)
          .catch((error) => {
            console.error("Image upload failed:", error.message);
            alert("Image upload failed.");
          });
      });

      imageURLs = await Promise.all(uploadPromises);
    }

    const newPost = {
      title,
      content,
      category,
      author: user?.displayName || user?.email || "Anonymous",
      createdAt: new Date(),
      price: category === "Product To Sale" ? parseFloat(price) : null,
      phoneNumber: category === "Product To Sale" ? phoneNumber : null,
      deliveryOption: category === "Product To Sale" ? deliveryOption : null, // Include delivery option
      imageURLs, // Store array of image URLs
    };

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
            <div className="form-group">
              <label htmlFor="deliveryOption">Delivery Option</label>
              <select
                id="deliveryOption"
                value={deliveryOption}
                onChange={(e) => setDeliveryOption(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a delivery option
                </option>
                {deliveryOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Image Upload */}
        <div className="form-group">
          <label htmlFor="imageFiles">Upload Images</label>
          <input
            type="file"
            id="imageFiles"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {selectedFiles.length > 0 && (
            <div className="image-preview-group">
              <p>Selected Files:</p>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
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
