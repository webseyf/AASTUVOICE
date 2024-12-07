import React, { useState, useEffect } from "react";
import { useFirestore } from "../hooks/useFirestore.jsx";
import Fuse from "fuse.js";
import PostCard from "../components/PostCard.jsx";
import "../styles/Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { fetchPosts } = useFirestore();

  // Fuse.js options
  const fuseOptions = {
    keys: ["title", "content"], // Fields to search within
    threshold: 0.3, // Match tolerance (lower = stricter)
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPosts(posts); // Reset to all posts if query is empty
    } else {
      const fuse = new Fuse(posts, fuseOptions);
      const results = fuse.search(searchQuery).map(({ item }) => item); // Extract matched items
      setFilteredPosts(results);
    }
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
      ) : filteredPosts.length > 0 ? (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="no-posts-message">No posts found. Try a different search.</p>
      )}
    </div>
  );
};

export default Home;
