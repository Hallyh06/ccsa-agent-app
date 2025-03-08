import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Make sure this imports your Firebase config
import '../styles/FarmerDetail.css'; // Import CSS file for styling

function FarmerDetail() {
  const { id } = useParams(); // Retrieve the farmer's ID from the URL
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmer = async () => {
      const farmerRef = doc(firestore, 'farmers', id); // Reference to the 'farmers' collection and the specific farmer document
      const farmerSnapshot = await getDoc(farmerRef);

      if (farmerSnapshot.exists()) {
        setFarmer(farmerSnapshot.data()); // Set the fetched farmer data
      } else {
        console.log("No such farmer!");
      }
      setLoading(false);
    };

    fetchFarmer();
  }, [id]); // Re-run the effect when the 'id' changes

  if (loading) {
    return <div className="loading">Loading...</div>; // Display loading indicator until the data is fetched
  }

  return (
    <div className="farmer-detail-container">
      <header className="farmer-header">
        <img src="../cosmologo.png" alt="Logo" className="logo" />
        <h1>Farmer Profile</h1>
      </header>
      
      {farmer ? (
        <div className="farmer-details">
          <div className="detail-category">
            <h2>Personal Information</h2>
            <div className="detail">
              <strong>ID:</strong> <span>{id}</span>
            </div>
            <div className="detail">
              <strong>Name:</strong> <span>{farmer.name}</span>
            </div>
            <div className="detail">
              <strong>Phone:</strong> <span>{farmer.phone}</span>
            </div>
            <div className="detail">
              <strong>Email:</strong> <span>{farmer.email}</span>
            </div>
          </div>

          <div className="detail-category">
            <h2>Farm Information</h2>
            <div className="detail">
              <strong>Farm Size:</strong> <span>{farmer.farmSize} acres</span>
            </div>
            <div className="detail">
              <strong>Crops:</strong> <span>{farmer.crops}</span>
            </div>
          </div>

          <div className="detail-category">
            <h2>Geospatial Information</h2>
            <div className="detail">
              <strong>Location:</strong> <span>{farmer.location}</span>
            </div>
            {/* Add more geospatial info if available */}
          </div>
        </div>
      ) : (
        <p>No farmer data available.</p>
      )}
    </div>
  );
}

export default FarmerDetail;
