import React from "react";
import { useNavigate } from "react-router-dom";
import "./startpage.css";

const Start = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="startPageContainer">
      <h1>ChaseEvents</h1>
      <div className="buttonContainer">
        <button
          onClick={() => handleNavigate("/login")}
          className="loginButton"
        >
          Login
        </button>
        <button
          onClick={() => handleNavigate("/signup")}
          className="signupButton"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Start;
