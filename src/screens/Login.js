import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';  // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <img src="./cosmologo.png" alt="Logo" className="logo-img" />
        </div>
        <h3 className="page-title" style={{fontSize: '17px'}}>Centre for Climate Smart Agriculture</h3>
        <h2 className="subtitle"  style={{marginTop: 40}}>Farmers Registration System</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="forgot-password">
          <a href="/ForgetPassword" className="forgot-password-link" style={{textAlign: 'center'}}>Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
