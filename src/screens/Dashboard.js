import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { Bar, Pie } from "react-chartjs-2";
import { FaSignOutAlt, FaBars, FaListAlt, FaUserPlus, FaSignInAlt } from "react-icons/fa";  // Icons for logout, menu, list, add, and login
import "chart.js/auto";
import logo from "../cosmologo.png";  // Ensure you have the logo image in the assets folder
import '../styles/Dashboard.css';  // Add this line to import the CSS


const Dashboard = () => {
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [farmersByState, setFarmersByState] = useState({});
  const [farmersByCrop, setFarmersByCrop] = useState({});
  const [farmersByGender, setFarmersByGender] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchFarmersData = async () => {
      const farmersCollection = collection(firestore, "farmers");
      const farmersSnapshot = await getDocs(farmersCollection);
      const farmersList = farmersSnapshot.docs.map((doc) => doc.data());
      
      setTotalFarmers(farmersList.length);
      
      const stateCount = {};
      const cropCount = {};
      const genderCount = { Male: 0, Female: 0 };
      
      farmersList.forEach((farmer) => {
        stateCount[farmer.state] = (stateCount[farmer.state] || 0) + 1;
        cropCount[farmer.primaryCrop] = (cropCount[farmer.primaryCrop] || 0) + 1;
        genderCount[farmer.gender] += 1;
      });

      setFarmersByState(stateCount);
      setFarmersByCrop(cropCount);
      setFarmersByGender(genderCount);
    };
    fetchFarmersData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/Login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <div className="title-section">
          <h1 className="title">Centre for Climate Smart Agriculture, Cosmopolitan University, Abuja</h1>
          <h2 className="subtitle">Farmer Registration System</h2>
        </div>

         
      </div>

       {/* Menu Toggle Button aligned to the right */}
       <button onClick={toggleMenu} className="menu-toggle-button" >
          <FaBars /> {/* Menu Icon */}
        </button>

     {/* Farmer Menu */}
     {menuOpen && (
        <div className="dashboard-links">
          <div className="menu">
            <div className="menu-item">
              <FaListAlt /> {/* Icon for Farmer List */}
              <Link to="/Farmers" className="dashboard-link">Farmer List</Link>
            </div>
            <div className="menu-item">
              <FaUserPlus /> {/* Icon for Farmer Registration */}
              <Link to="/Register" className="dashboard-link">Farmer Registration</Link>
            </div>
            <div className="menu-item logout-item">
              <FaSignOutAlt /> {/* Icon for Logout */}
              <button onClick={handleLogout} className="dashboard-link logout-button">Logout</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid-container">
        <div className="card">
          <h2>Total Farmers</h2>
          <p>{totalFarmers}</p>
        </div>

        <div className="card">
          <h2>Farmers by State</h2>
          <Bar data={{
            labels: Object.keys(farmersByState),
            datasets: [{
              data: Object.values(farmersByState),
              label: "Farmers",
              backgroundColor: "#4A90E2",
            }]
          }} />
        </div>

        <div className="card">
          <h2>Farmers by Crop Type</h2>
          <Pie data={{
            labels: Object.keys(farmersByCrop),
            datasets: [{
              data: Object.values(farmersByCrop),
              backgroundColor: ["#FFA500", "#008000", "#800080"]
            }]
          }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
