import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // for second api call
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleUserCreation = async (e) => {
    e.preventDefault();

    const data = {
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
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
        "http://localhost:8000/create_user",
        options
      );
      const message = await response.json();

      if (!response.ok) {
        alert(message.message);
      } else {
        // Successful creation
        createCredentails(message.userId);
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to connect to the server.");
    }
  };

  const createCredentails = async (userId) => {
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
        `http://localhost:8000/create_credentials/${userId}`,
        options
      );
      const message = await response.json();

      if (!response.ok) {
        alert(message.message);
      } else {
        // Successful creation
        navigate("/dashboard", { state: { userId: userId } });
      }
    } catch (error) {
      console.error("Failed to create credentials:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className={"mainContainer"}>
      <form onSubmit={handleUserCreation}>
        <div className={"titleContainer"}>
          <h1>Signup</h1>
        </div>
        <div className={"inputContainer"}>
          <input
            value={firstName}
            placeholder="Enter your first name here"
            onChange={(e) => setFirstName(e.target.value)}
            className={"inputBox"}
          />
        </div>
        <div className={"inputContainer"}>
          <input
            value={lastName}
            placeholder="Enter your last name here"
            onChange={(e) => setLastName(e.target.value)}
            className={"inputBox"}
          />
        </div>
        <div className={"inputContainer"}>
          <input
            value={email}
            placeholder="Enter your email here"
            onChange={(e) => setEmail(e.target.value)}
            className={"inputBox"}
          />
        </div>
        <div className={"inputContainer"}>
          <input
            value={address}
            placeholder="Enter your address here"
            onChange={(e) => setAddress(e.target.value)}
            className={"inputBox"}
          />
        </div>
        <div className={"inputContainer"}>
          <input
            value={phoneNumber}
            placeholder="Enter your phone number here"
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={"inputBox"}
          />
        </div>
        <div className={"inputContainer"}>
          <input
            value={username}
            placeholder="Choose a username"
            onChange={(e) => setUsername(e.target.value)}
            className={"inputBox"}
          />
        </div>
        <div className={"inputContainer"}>
          <input
            value={password}
            placeholder="Choose a password"
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

export default Signup;
