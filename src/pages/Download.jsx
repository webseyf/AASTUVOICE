import React from "react";
import "../styles/Download.css";

const Download = () => {
  return (
    <div className="download-page">
      <h1 className="title">Download Our App</h1>
      <p className="description">
        To get the most out of our services, download our app. Follow the instructions below to get started!
      </p>

      <div className="buttons-container">
        {/* Android Download Button */}
        <a
          href="https://drive.google.com/file/d/1OEr1uQYWVuu2Cg9nQxtDPgAoTU2f-haf/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="download-button android-btn"
        >
          {/* <img className="icon" src="/android-icon.png" alt="Android" /> */}
          Download for Android
        </a>

        {/* iOS Download Button */}
        <a
          href="https://example.com/downloads/your-app.ipa"
          target="_blank"
          rel="noopener noreferrer"
          className="download-button ios-btn"
        >
          {/* <img className="icon" src="/ios-icon.png" alt="iOS" /> */}
          Download for iOS
        </a>
      </div>

      <div className="instructions">
        <h2>How to Download</h2>
        <ul>
          <li>Click the respective button for your device.</li>
          <li>Follow the prompts to install the app.</li>
          <li>Open the app and start exploring!</li>
        </ul>
      </div>
    </div>
  );
};

export default Download;
