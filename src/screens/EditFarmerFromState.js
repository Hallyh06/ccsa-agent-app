import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";

const EditFarmerFromState = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    phone: "",
    primaryCrop: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const docRef = doc(firestore, "farmers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFarmer(docSnap.data());
        } else {
          setMessage("Farmer not found.");
        }
      } catch (error) {
        console.error("Error fetching farmer:", error);
        setMessage("Error loading farmer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [id]);

  const handleChange = (e) => {
    setFarmer({ ...farmer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(firestore, "farmers", id), farmer);
      setMessage("Farmer updated successfully.");
      setTimeout(() => navigate(-1), 1500); // go back after 1.5s
    } catch (error) {
      console.error("Error updating farmer:", error);
      setMessage("Update failed. Try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-container">
      <h2>Edit Farmer</h2>

      {message && <div className="message">{message}</div>}

      <form className="edit-form" onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          type="text"
          name="firstname"
          value={farmer.firstname}
          onChange={handleChange}
          required
        />

        <label>Last Name</label>
        <input
          type="text"
          name="lastname"
          value={farmer.lastname}
          onChange={handleChange}
          required
        />

        <label>Gender</label>
        <select
          name="gender"
          value={farmer.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={farmer.phone}
          onChange={handleChange}
          required
        />

        <label>Primary Crop</label>
        <input
          type="text"
          name="primaryCrop"
          value={farmer.primaryCrop}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Farmer</button>
      </form>

      <style>{`
        .edit-container {
          max-width: 500px;
          margin: 50px auto;
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
        }

        h2 {
          text-align: center;
          color: #1e3a8a;
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 20px;
        }

        .edit-form label {
          font-weight: 600;
          color: #333;
        }

        .edit-form input,
        .edit-form select {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 16px;
        }

        .edit-form button {
          padding: 12px;
          background-color: #1e3a8a;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .edit-form button:hover {
          background-color: #2c4fc1;
        }

        .message {
          text-align: center;
          margin: 10px 0;
          padding: 10px;
          background-color: #f0f9ff;
          border-left: 5px solid #3b82f6;
          color: #1e40af;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default EditFarmerFromState;
