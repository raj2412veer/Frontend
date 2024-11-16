import React from "react";
import "../styles/errorpage.css";
import { useNavigate } from "react-router-dom";

function Errorpage() {
  const navigate = useNavigate();
  return (
    <div className="not-found-container">
      <h1 className="error-code">404</h1>
      <p className="error-message">Page not found.</p>
      <span className="back-home" onClick={() => navigate(-1)}>
        Go Back
      </span>
    </div>
  );
}

export default Errorpage;
