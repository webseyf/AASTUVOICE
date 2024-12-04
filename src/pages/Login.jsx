import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx"; // Import the custom hook
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; 
import { auth } from "../firebase/config"; // Import Firebase auth instance
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const { logIn } = useAuth(); // Use logIn from the custom hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, provider); // Use auth from config
      navigate("/"); 
    } catch (err) {
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await logIn(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <div className="google-login">
        <p>or log in with</p>
        <button
          onClick={handleGoogleLogin}
          className="google-btn"
          disabled={loading}
        >
          {loading ? "Processing..." : "Log In with Google"}
        </button>
      </div>
      <p>
        Don't have an account?{" "}
        <a href="/signup" className="toggle-auth">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
