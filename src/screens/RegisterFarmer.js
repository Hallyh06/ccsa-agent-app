import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase";
import '../styles/RegisterFarmer.css';  // Import the CSS file

const RegisterFarmer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    nin: "",
    bvn: "",
    state: "",
    localGovernment: "",
    age: "",
    gender: "",
    primaryCrop: "",
    secondaryCrop: "",
    farmSize: "",
    farmingSeason: "",
    farmOwnership: "",
    latitude: "",
    longitude: ""
  });

  const generateFarmerID = () => {
    const date = new Date();
    return `CCSA-${date.toISOString().replace(/[-:.TZ]/g, "")}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, "farmers"), {
        ...formData,
        farmerID: generateFarmerID(),
        createdAt: serverTimestamp()
      });
      alert("Farmer Registered Successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        nin: "",
        bvn: "",
        state: "",
        localGovernment: "",
        age: "",
        gender: "",
        primaryCrop: "",
        secondaryCrop: "",
        farmSize: "",
        farmingSeason: "",
        farmOwnership: "",
        latitude: "",
        longitude: ""
      });
    } catch (error) {
      console.error("Error adding farmer: ", error);
      alert("Failed to register farmer.");
    }
  };


  const getCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          alert("Error retrieving location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };



  return (
    <div className="container">
      <div className="header-page">
        <img src="./cosmologo.png" alt="CCSA Logo" className="logo" />
        <h1 className="page-title">Centre for Climate Smart Agriculture</h1>
      </div>
      <div className="form-container">
        <h4 className="form-title" style={{textAlign: 'center', fontStyle: 'normal'}}>New Farmer Registration</h4>
        <form onSubmit={handleSubmit}>
        <div className="section">
        <h4 className="section-title" style={{background: '#231369', padding: '10px', color: 'white'}}>Farmer Personal Information</h4>
          <div className="form-grid">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
            <input type="text" name="nin" value={formData.nin} onChange={handleChange} placeholder="NIN" required />
            <select name="state" value={formData.state} onChange={handleChange} required>
              <option value="">Select State</option>
              <option value="Kaduna">Kaduna</option>
              <option value="Abuja">Abuja</option>
              <option value="Jigawa">Jigawa</option>
              <option value="Katsina">Katsina</option>
            </select>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select name="primaryCrop" value={formData.primaryCrop} onChange={handleChange} required>
              <option value="">Primary Crop</option>
              <option value="Maize">Maize</option>
              <option value="Groundnut">Groundnut</option>
              <option value="Beans">Beans</option>
            </select>
            <select name="farmOwnership" value={formData.farmOwnership} onChange={handleChange} required>
              <option value="">Farm Ownership</option>
              <option value="Owned">Owned</option>
              <option value="Rent">Rent</option>
            </select>
            </div>


          <div className="section">
          <h4 className="section-title" style={{background: '#231369', padding: '10px', color: 'white', marginTop: '30px'}}>Farm Information</h4>
          <div className="form-grid">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
            <input type="text" name="nin" value={formData.nin} onChange={handleChange} placeholder="NIN" required />
            <select name="state" value={formData.state} onChange={handleChange} required>
              <option value="">Select State</option>
              <option value="Kaduna">Kaduna</option>
              <option value="Abuja">Abuja</option>
              <option value="Jigawa">Jigawa</option>
              <option value="Katsina">Katsina</option>
            </select>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select name="primaryCrop" value={formData.primaryCrop} onChange={handleChange} required>
              <option value="">Primary Crop</option>
              <option value="Maize">Maize</option>
              <option value="Groundnut">Groundnut</option>
              <option value="Beans">Beans</option>
            </select>
            <select name="farmOwnership" value={formData.farmOwnership} onChange={handleChange} required>
              <option value="">Farm Ownership</option>
              <option value="Owned">Owned</option>
              <option value="Rent">Rent</option>
            </select>
            </div>
            </div>
            
            



            <div className="section">
            <h4 className="section-title" style={{background: '#231369', padding: '10px', color: 'white', marginTop: '30px'}}>Geospatial Information</h4>
            <div className="form-grid">
              <input 
                type="text" 
                name="latitude" 
                value={formData.latitude} 
                onChange={handleChange} 
                placeholder="Latitude" 
                required
              />
              <input 
                type="text" 
                name="longitude" 
                value={formData.longitude} 
                onChange={handleChange} 
                placeholder="Longitude" 
                required
              />
            </div>
            <button type="button" onClick={getCoordinates} className="get-coordinates-btn">
              <i className="fas fa-location-arrow"></i> Get Farm Coordinates
            </button>
          </div>



          </div>
          <button type="submit" className="submit-btn">Register Farmer</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterFarmer;
