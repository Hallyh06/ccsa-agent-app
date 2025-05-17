import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";
import { useNavigate } from "react-router-dom";

const FarmersListTable = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [farmersPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "farmers"),
      (snapshot) => {
        const list = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          sn: index + 1,
          ...doc.data(),
        }));
        setFarmers(list);
      },
      (error) => {
        console.error("Error fetching farmers:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // 🔍 Search Filter
  const filteredFarmers = farmers.filter((farmer) => {
    const search = searchTerm.toLowerCase();
    return (
      farmer.firstname?.toLowerCase().includes(search) ||
      farmer.lastname?.toLowerCase().includes(search) ||
      farmer.phone?.toLowerCase().includes(search) ||
      farmer.farmerID?.toLowerCase().includes(search)
    );
  });

  // 📄 Pagination Logic
  const indexOfLast = currentPage * farmersPerPage;
  const indexOfFirst = indexOfLast - farmersPerPage;
  const currentFarmers = filteredFarmers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFarmers.length / farmersPerPage);

  const handleRowClick = (id) => {
    navigate(`/one-FarmerDetail/${id}`);
  };

  return (
    <div className="farmer-list-container">
      <h2>Registered Farmers</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search by first name, last name, phone, or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Dashboard
      </button>

      {currentFarmers.length === 0 ? (
        <p>No farmers found.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>Full Name</th>
                <th>Farmer Registration ID</th>
                <th>Gender</th>
                <th>State</th>
                <th>Local Government</th>
                <th>Phone Number</th>
                <th>WhatsApp Number</th>
                <th>Primary Crop</th>
                <th>Farm Ownership</th>
                <th>Farming Season</th>
              </tr>
            </thead>
            <tbody>
              {currentFarmers.map((farmer) => (
                <tr key={farmer.id} onClick={() => handleRowClick(farmer.id)} style={{ cursor: "pointer" }}>
                  <td>{farmer.sn}</td>
                  <td>
                    {farmer.lastname || "-"}, {farmer.firstname || "-"} {farmer.middlename || "-"}
                  </td>
                  <td>{farmer.farmerID || "-"}</td>
                  <td>{farmer.gender || "-"}</td>
                  <td>{farmer.state || "-"}</td>
                  <td>{farmer.localGovernment || "-"}</td>
                  <td>{farmer.phone || "-"}</td>
                  <td>{farmer.whatsappNumber || "-"}</td>
                  <td>{farmer.primaryCrop || "-"}</td>
                  <td>{farmer.farmOwnership || "-"}</td>
                  <td>{farmer.farmingSeason || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Buttons */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  margin: "0 5px",
                  padding: "8px 12px",
                  backgroundColor: currentPage === i + 1 ? "#1e3a8a" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Inline CSS */}
      <style>{`
        .farmer-list-container {
          padding: 20px;
          background-color: #f7f9fc;
          min-height: 100vh;
        }

        h2 {
          text-align: center;
          color: #1e3a8a;
        }

        .back-button {
          background-color: #1e3a8a;
          color: white;
          border: none;
          padding: 10px 20px;
          margin: 10px 0 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        th, td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
        }

        th {
          background-color: #1e3a8a;
          color: white;
        }

        tr:hover {
          background-color: #f1f5ff;
        }
      `}</style>
    </div>
  );
};

export default FarmersListTable;
