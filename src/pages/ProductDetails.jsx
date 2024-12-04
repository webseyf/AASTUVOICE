import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContexts";
import "../styles/PostDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPostById, addComment, fetchComments } = useFirestore();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchPostById(id);
        if (postData) {
          setPost(postData);
        } else {
          navigate("/not-found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, fetchPostById, navigate]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchComments(id);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setCommentsLoading(false);
      }
    };
    loadComments();
  }, [id, fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }
    const newComment = {
      text: comment,
      author: currentUser?.displayName || "Anonymous",
      authorId: currentUser?.uid || "guest",
      createdAt: new Date().toISOString(),
    };
    try {
      await addComment(id, newComment);
      setComment("");
      setComments((prev) => [newComment, ...prev]);
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment.");
    }
  };

  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div key={comment.id} className="comment">
        <strong>{comment.author}</strong>: {comment.text}
        <small>{new Date(comment.createdAt).toLocaleString()}</small>
      </div>
    ));
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="product-details-container">
      <header className="product-header">
        <h1>{post.title}</h1>
        <p>
          By <span>{post.author || "Anonymous"}</span>
        </p>
      </header>

      {/* Display multiple product images */}
      <div className="product-images">
        {post.imageURLs && post.imageURLs.length > 0 ? (
          post.imageURLs.map((url, index) => (
            <img key={index} src={url} alt={post.title} className="product-image" />
          ))
        ) : (
          <div className="image-placeholder">No Images Available</div>
        )}
      </div>

      <section className="product-content">
        <p>{post.content}</p>
      </section>

      {/* Price and Phone Number Section */}
      {post.category === "Product To Sale" && (
        <section className="product-info">
          {post.price && <p><strong>Price:</strong> Br {post.price}</p>}
          {post.phone && <p><strong>Phone:</strong> {post.phone}</p>}
        </section>
      )}

      <div className="comments-container">
        <h2>Comments</h2>
        {currentUser && (
          <form onSubmit={handleCommentSubmit}>
            <div className="comment-form">
              <textarea
                className="comment-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                required
              ></textarea>
              <button type="submit" className="comment-submit-button">
                Post Comment
              </button>
            </div>
          </form>
        )}
        {commentsLoading ? (
          <p>Loading comments...</p>
        ) : comments.length > 0 ? (
          renderComments(comments)
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
