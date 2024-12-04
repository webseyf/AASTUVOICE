import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContexts";
import "../styles/PostDetails.css";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPostById, addComment, fetchComments } = useFirestore();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Failed to load post. Please try again later.");
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
        setError("Failed to load comments. Please try again later.");
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
      setError("Failed to add comment. Please try again later.");
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
    <div className="post-details-container">
      <header className="post-header">
        <h1>{post.title}</h1>
        <p>
          By <span>{post.author || "Anonymous"}</span>
        </p>
      </header>

      {post.imageURL && (
        <img src={post.imageURL} alt={post.title} className="post-image" />
      )}

      <section className="post-content">
        <p>{post.content}</p>
      </section>

      {/* Display price and phone number if available */}
      {(post.price || post.phoneNumber) && (
        <div className="post-info">
          {post.price && (
            <p className="post-price">
              Price: <strong>{post.price.toFixed(2)} Br</strong>
            </p>
          )}
          {post.phoneNumber && (
            <p className="post-phone">
              Contact: <strong>{post.phoneNumber}</strong>
            </p>
          )}
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

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

export default PostDetails;