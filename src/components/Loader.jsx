import React from "react";
import "../styles/Loader.css"; // Make sure to create and import this CSS file

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader">
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Loader;
