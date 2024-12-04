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
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file
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

    let imageURL = null; // Initialize imageURL here

    // Upload image to ImgBB if a file is selected
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const imgResponse = await axios.post('https://api.imgbb.com/1/upload?key=970605ee4c09903bbca5c5317f4b1df3', formData);
        imageURL = imgResponse.data.data.url; // Get the image URL from the response
      } catch (error) {
        alert("Image upload failed: " + error.message);
        setLoading(false);
        return;
      }
    }

    const newPost = {
      title,
      content,
      category,
      author: user?.displayName || user?.email || "Anonymous",
      createdAt: new Date(),
      price: category === "Product To Sale" ? parseFloat(price) : null,
      phoneNumber: category === "Product To Sale" ? phoneNumber : null,
      imageURL: imageURL ? imageURL.trim() : null, // Use the imageURL set after upload
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

        {/* Image Upload */}
        <div className="form-group">
          <label htmlFor="imageFile">Upload Image</label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          {selectedFile && (
            <div className="image-preview-group">
              <p>Selected Image: {selectedFile.name}</p>
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