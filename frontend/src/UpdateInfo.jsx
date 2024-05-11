import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./info.css";

const UpdateInfo = () => {
  const location = useLocation();
  const { userId } = location.state;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  useEffect(() => {
    fetchUserDetails();
  });

  const fetchUserDetails = async () => {
    const responseUser = await fetch(
      `http://localhost:8000/get_user/${userId}`
    );

    const dataUser = await responseUser.json();
    setFirstName(dataUser.firstName);
    setLastName(dataUser.lastName);
    setEmail(dataUser.email);
    setAddress(dataUser.address);
    setPhoneNumber(dataUser.phoneNumber);
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();

    const data = {
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
    };
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(
        `http://localhost:8000/update_user/${userId}`,
        options
      );
      const message = await response.json();

      alert(message.message);
    } catch (error) {
      alert("Failed to update user information", error);
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/delete_user/${userId}`,
        { method: "DELETE" }
      );
      const message = await response.json();

      alert(message.message);
      navigate("/");
    } catch (error) {
      alert("Failed to delete account", error);
    }
  };

  const handleCredentialUpdate = async (e) => {
    e.preventDefault();
    const data = {
      username,
      oldPassword,
      newPassword: password,
    };

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(
        `http://localhost:8000/update_credentials/${userId}`,
        options
      );
      const message = await response.json();

      alert(message.message);
    } catch (error) {
      alert("Failed to update credentials", error);
    }
  };

  return (
    <div className="mainContainer">
      <h1>Edit User Profile</h1>
      <form onSubmit={handleUserUpdate}>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <div></div>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <div></div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <div></div>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <div></div>
        <label>
          Phone Number:
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
        <div></div>
        <button type="submit">Update Profile</button>
        <div></div>
      </form>

      <h1>Edit Login Credentials</h1>
      <form onSubmit={handleCredentialUpdate}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <div></div>
        <label>
          New Password:
          <input
            type="text"
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div></div>
        <label>
          Old Password:
          <input
            type="text"
            placeholder="Old password"
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </label>
        <div></div>
        <button type="submit">Update Credentials</button>
        <div></div>
      </form>

      <button
        onClick={() => navigate("/dashboard", { state: { userId: userId } })}
      >
        Back to Dashboard
      </button>

      <div></div>

      <button
        onClick={() => {
          deleteAccount();
        }}
      >
        Delete Account
      </button>
    </div>
  );
};

export default UpdateInfo;
