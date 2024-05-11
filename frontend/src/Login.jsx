import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/read_credentials",
        options
      );
      const message = await response.json();

      if (!response.ok) {
        alert(message.message);
      } else {
        // Successful login
        console.log("Login successful"); // Log success message
        navigate("/dashboard", { state: { userId: message.userId } });
      }
    } catch (error) {
      console.error("Failed to login:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className={"mainContainer"}>
      <form onSubmit={handleLogin}>
        <div className={"titleContainer"}>
          <h1>Login</h1>
        </div>
        <div className={"inputContainer"}>
          <input
            value={username}
            placeholder="Enter your username here"
            onChange={(e) => setUsername(e.target.value)}
            className={"inputBox"}
          />
        </div>
        <div className={"inputContainer"}>
          <input
            type="password"
            value={password}
            placeholder="Enter your password here"
            onChange={(e) => setPassword(e.target.value)}
            className={"inputBox"}
          />
        </div>
        <div className={"inputContainer"}>
          <button type="submit" className={"inputButton"}>
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
