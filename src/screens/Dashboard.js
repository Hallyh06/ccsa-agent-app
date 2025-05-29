import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaBars,
  FaUserPlus,
  FaList,
  FaSearch,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";


const Dashboard = () => {
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [farmersByState, setFarmersByState] = useState({});
  const [farmersByCrop, setFarmersByCrop] = useState({});
  const [farmersByGender, setFarmersByGender] = useState({});
  const [farmersByFarmOwnership, setFarmersByFarmOwnership] = useState({});
  const [farmersByFarmingSeason, setFarmersByFarmingSeason] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "farmers"), (snapshot) => {
      const farmersList = snapshot.docs.map((doc) => doc.data());
      setTotalFarmers(farmersList.length);

      const stateCount = {},
        cropCount = {},
        genderCount = {},
        ownershipCount = {},
        seasonCount = {};

      farmersList.forEach((farmer) => {
        stateCount[farmer.state] = (stateCount[farmer.state] || 0) + 1;
        cropCount[farmer.primaryCrop] = (cropCount[farmer.primaryCrop] || 0) + 1;
        genderCount[farmer.gender] = (genderCount[farmer.gender] || 0) + 1;
        ownershipCount[farmer.farmOwnership] = (ownershipCount[farmer.farmOwnership] || 0) + 1;
        seasonCount[farmer.farmingSeason] = (seasonCount[farmer.farmingSeason] || 0) + 1;
      });

      setFarmersByState(stateCount);
      setFarmersByCrop(cropCount);
      setFarmersByGender(genderCount);
      setFarmersByFarmOwnership(ownershipCount);
      setFarmersByFarmingSeason(seasonCount);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const chartData = (dataObj) =>
    Object.entries(dataObj).map(([key, value]) => ({
      name: key,
      value,
    }));

  const colors = ["#FFA500", "#008000", "#800080", "#007AFF", "#A3C1AD", "#008E97"];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">Menu</div>
        <nav className="sidebar-nav">
          <button onClick={() => {navigate("/register-farmer"); setMenuOpen(false);}}><FaUserPlus /> Register Farmer</button>
          <button onClick={() => {navigate("/farmer-list"); setMenuOpen(false);}}><FaList /> Farmer List</button>
          <button onClick={() => {navigate("/search-farmer"); setMenuOpen(false);}}><FaSearch /> Search Farmers</button>
          <button onClick={() => {navigate("/generate-certificate"); setMenuOpen(false);}}><FaFileAlt /> Generate Certificate</button>
          <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1>Dashboard </h1>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars size={20} />
          </button>
        </header>

        <main className="content">
          <div
            className="card total-card clickable"
            onClick={() => navigate("/FarmersList")}
            title="Click to view full list"
            role="button"
            tabIndex={0}
          >
            <h2>Total Number of Registered Farmers</h2>
            <p className="total-count">{totalFarmers}</p>
          </div>

          {/* Bar Chart for Farmers Per State */}
          <div className="card chart full-width">
            <h3>Registered Farmers Per State</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData(farmersByState)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} farmers`} />
                <Bar
                  dataKey="value"
                  fill="#007AFF"
                  onClick={(data, index) => {
                    const stateName = chartData(farmersByState)[index]?.name;
                    if (stateName) {
                      navigate(`/farmers-by-state/${encodeURIComponent(stateName)}`);
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Charts */}
          {[
            {
              title: "Based on Crop Type",
              data: farmersByCrop,
            },
            {
              title: "Based on Gender",
              data: farmersByGender,
              onClick: (item) => {
                if (item?.name) {
                  navigate(`/farmers-by-gender/${encodeURIComponent(item.name)}`);
                }
              },
            },
            {
              title: "Based on Farm Ownership",
              data: farmersByFarmOwnership,
              onClick: (item) => {
                if (item?.name) {
                  navigate(`/farmers-by-ownership/${encodeURIComponent(item.name)}`);
                }
              },
            },
            {
              title: "Based on Farming Season",
              data: farmersByFarmingSeason,
            },
          ].map((section, index) => {
            const pieData = chartData(section.data);
            return (
              <div className="card chart" key={index}>
                <h3>Registered Farmers {section.title}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart
                    onClick={(e) => {
                      if (section.onClick && e?.activePayload?.[0]?.payload) {
                        section.onClick(e.activePayload[0].payload);
                      }
                    }}
                  >
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    > 
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={colors[idx % colors.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => `${value} farmers`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </main>
      </div>

      {/* CSS Styling */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          font-family: Arial, sans-serif;
          overflow: hidden; /* Optional: prevents scrollbars if content fits */
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
          width: 100vw; /* Ensures full screen width */
          background-color: #f8f9fc;
        }

        .clickable {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .clickable:hover {
          transform: scale(1.02);
          background-color: #f0f4ff;
        }

        .sidebar {
          background-color: #1e3a8a;
          color: white;
          width: 0;
          overflow: hidden;
          transition: width 0.3s ease-in-out;
        }

        .sidebar.open {
          width: 240px;
        }

        .sidebar-header {
          padding: 20px;
          font-size: 20px;
          font-weight: bold;
          border-bottom: 1px solid #3b82f6;
        }

        .sidebar-nav {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .sidebar-nav button {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          margin-bottom: 15px;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .main-content {
          width: 100%;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          height: 100vh; /* full screen height */
          overflow: hidden; /* prevent overflow here, scroll will be on content */
        }

        .header {
          background-color: #1e3a8a;
          color: white;
          padding: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 0; 
        }

        .menu-toggle {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .content {
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
          gap: 20px;
          flex-grow: 1;
          overflow-y: auto;
        }

        .card {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
        }

        .total-card {
          text-align: center;
          grid-column: span 3;
        }

        .total-count {
          font-size: 2.5rem;
          color: #2563eb;
          margin-top: 10px;
        }

        .chart h3 {
          text-align: center;
          margin-bottom: 20px;
        }

        .full-width {
          grid-column: span 3;
        }

        @media (max-width: 768px) {
          .total-card,
          .full-width {
            grid-column: span 1;
          }

          .sidebar {
            position: absolute;
            z-index: 999;
            height: 100%;
          }

          .content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
