import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth"; // Import AuthContext hook
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/SignUp.css";

const SignUp = () => {
  const { logInWithGoogle, signUp } = useAuth(); // Use Google login and sign-up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      await logInWithGoogle(); // Google login
      navigate("/");
    } catch (err) {
      setError(err.message || "Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password); // Email/password sign-up
      navigate("/");
    } catch (err) {
      setError(err.message || "Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSignUp} className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
            placeholder="Create a strong password"
            required
            disabled={loading}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
      <div className="google-signup">
        <p>or</p>
        <button
          onClick={handleGoogleSignUp}
          className="google-btn"
          disabled={loading}
        >
          {loading ? "Processing..." : "Sign Up with Google"}
        </button>
      </div>
      <p>
        Already have an account?{" "}
        <Link to="/login" className="toggle-auth">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
