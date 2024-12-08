import React, { useState, useEffect } from "react";
import { useFirestore } from "../hooks/useFirestore.jsx";
import PostCard from "../components/PostCard.jsx";
import "../styles/Home.css"; // Update this if needed for Marketplace-specific styling
import Loader from "../components/Loader.jsx";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { fetchPosts } = useFirestore();

  // Fetch posts
  useEffect(() => {
    const getPosts = async () => {
      try {
        const postsData = await fetchPosts();

        // Filter posts to only include "Product To Sale" category
        const productToSalePosts = postsData.filter(
          (post) => post.category === "All General Posts"
        );

        setPosts(productToSalePosts);
        setFilteredPosts(productToSalePosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [fetchPosts]);

  // Handle search
  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  return (
    <div className="home-container">
      <h1 className="page-title name">Latest Posts</h1>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
          aria-label="Search products"
        />
      </div>

      {/* Posts */}
      {loading ? (
        <div ><Loader/></div>
      ) : filteredPosts.length > 0 ? (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="no-posts-message">No posts avalable or something went wrong. We are fixing it stay tuned</p>
      )}
    </div>
  );
};

export default Home;
