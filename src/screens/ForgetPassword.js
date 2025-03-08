import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, updatePassword } from "firebase/auth"; // Importing necessary functions
import { auth } from "../firebase"; // Make sure your firebase.js file exports the initialized Firebase app

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Adding state for phone number
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value); // Handling phone number change
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous messages
    setMessage("");
    setError("");

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Authenticate with email and phone number
      const userCredential = await signInWithEmailAndPassword(auth, email, phone);

      // Get the current user
      const user = userCredential.user;

      // Update the password
      await updatePassword(user, newPassword);

      setMessage("Password has been successfully updated!");
    } catch (error) {
      setError("Error updating password: " + error.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <img src="./cosmologo.png" alt="CCSA Logo" className="logo" />
        <h3 className="page-title" style={{fontSize: '17px'}}>Centre for Climate Smart Agriculture</h3>
        <h2 className="subtitle"  style={{marginTop: 40}}>Change Your Password</h2>
        <form onSubmit={handleSubmit}>
         
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              style={{marginTop: 10}}
              required
            />
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter your phone number"
              style={{marginTop: 10}}
              required
            />
             <div className="form-grid">
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Enter new password"
              style={{marginTop: 10}}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm new password"
              style={{marginTop: 10}}
              required
            />
          </div>
          <button type="submit" className="submit-btn" style={{marginTop: 30}}>Change Password</button>
        </form>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default ChangePassword;
