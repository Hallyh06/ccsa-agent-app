import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Make sure this imports your Firebase config

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
    return <div>Loading...</div>; // Display loading indicator until the data is fetched
  }

  return (
    <div className="farmer-detail-container">
      {farmer ? (
        <>
          <h2>{farmer.name}'s Details</h2>
          <p><strong>ID:</strong> {id}</p>
          <p><strong>Location:</strong> {farmer.location}</p>
          <p><strong>Phone:</strong> {farmer.phone}</p>
          <p><strong>Email:</strong> {farmer.email}</p>
          <p><strong>Farm Size:</strong> {farmer.farmSize}</p>
          <p><strong>Crops:</strong> {farmer.crops}</p>
        </>
      ) : (
        <p>No farmer data available.</p>
      )}
    </div>
  );
}

export default FarmerDetail;
