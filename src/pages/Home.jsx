import React, { useState, useEffect } from "react";
import { useFirestore } from "../hooks/useFirestore.jsx";
import PostCard from "../components/PostCard.jsx";
import "../styles/Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchPosts } = useFirestore();

  // Fetch posts
  useEffect(() => {
    const getPosts = async () => {
      try {
        const postsData = await fetchPosts();
        // Filter out "Product To Sale" category for general display
        const filteredData = postsData.filter(post => post.category !== "Product To Sale");
        setPosts(filteredData);
        setFilteredPosts(filteredData);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [fetchPosts]);

  // Handle search with onChange
  useEffect(() => {
    const filtered = posts.filter((post) => 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  return (
    <div className="home-container">
      <h1 className="page-title">Latest Posts</h1>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
          aria-label="Search posts"
        />
      </div>

      {/* Posts */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div> // Show error message if fetch fails
      ) : filteredPosts.length > 0 ? (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="no-posts-message">
          No posts found. Try a different search.
        </p>
      )}
    </div>
  );
};

export default Home;
