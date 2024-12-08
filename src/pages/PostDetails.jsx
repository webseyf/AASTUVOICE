import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContexts";
import "../styles/PostDetails.css";
import Loader from "../components/Loader";

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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const renderComments = useMemo(() => {
    return comments.map((comment) => (
      <div key={comment.id} className="comment">
        <strong>{comment.author}</strong>: {comment.text}
        {/* <small>{new Date(comment.createdAt).toLocaleString()}</small> */}
      </div>
    ));
  }, [comments]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : post.imageURLs.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < post.imageURLs.length - 1 ? prevIndex + 1 : 0));
  };

  if (loading) return <div><Loader/></div>;
  if (!post) return <div className="error">Post not found. <button onClick={() => navigate("/")}>Go back</button></div>;

  return (
    <div className="post-details-container">
      <header className="post-header">
        <h1>{post.title}</h1>
        <p>
          By <span className="ah">{post.author || "Anonymous"}</span>
        </p>
      </header>

      {/* Image Gallery */}
      <div className="image-gallery">
        {post.imageURLs?.length > 0 && (
          <>
            {/* Desktop view: show all images */}
            <div className="desktop-images">
              {post.imageURLs.map((imageURL, index) => (
                <img
                  key={index}
                  src={imageURL}
                  alt={post.title}
                  className="post-image"
                  loading="lazy"
                  style={{ transition: "opacity 0.5s ease-in-out" }}
                />
              ))}
            </div>

            {/* Mobile view: Show image slideshow */}
            <div className="mobile-slideshow">
              <img
                src={post.imageURLs[currentImageIndex]}
                alt={post.title}
                className="post-image"
                loading="lazy"
                style={{ transition: "transform 0.5s ease-in-out" }}
              />
              <button 
                className="prev-button" 
                onClick={handlePrevImage} 
                aria-label="Previous Image"
              >
                &#10094;
              </button>
              <button 
                className="next-button" 
                onClick={handleNextImage} 
                aria-label="Next Image"
              >
                &#10095;
              </button>
            </div>
          </>
        )}
      </div>

      <section className="post-content">
  <p>{post.content}</p>
</section>

{/* Display price, phone number, and delivery option if available */}
{(post.price || post.phoneNumber || post.deliveryOption) && (
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
    {post.deliveryOption && (
      <p className="post-delivery">
        Delivery: <strong>{post.deliveryOption}</strong>
      </p>
    )}
  </div>
)}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
<hr className="hr"/>
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
<div className="comments-container">
  {commentsLoading ? (
    <p className="comments-loading">Loading comments...</p>
  ) : comments.length > 0 ? (
    <div className="comments-list">{renderComments}</div>
  ) : (
    <p className="no-comments">No comments yet. Be the first to comment!</p>
  )}
</div>

      </div>
    </div>
  );
};

export default PostDetails;
