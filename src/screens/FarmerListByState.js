import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  FaBars,
  FaUserPlus,
  FaList,
  FaSearch,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const FarmerListByState = () => {
  const { stateName } = useParams();
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const q = query(
      collection(firestore, "farmers"),
      where("state", "==", stateName)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFarmers(list);
    });

    return () => unsubscribe();
  }, [stateName]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      try {
        await deleteDoc(doc(firestore, "farmers", id));
        alert("Farmer deleted successfully");
      } catch (error) {
        console.error("Error deleting farmer:", error);
        alert("Error deleting farmer");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-farmerFromState/${id}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Farmers List in ${stateName}`, 14, 15);

    const tableColumn = ["#", "Farmer ID", "Name", "Gender", "Phone", "Crop"];
    const tableRows = [];

    filteredFarmers.forEach((farmer, index) => {
      tableRows.push([
        index + 1,
        farmer.farmerID,
        `${farmer.firstname} ${farmer.lastname}`,
        farmer.gender,
        farmer.phone,
        farmer.primaryCrop,
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`farmers_list_${stateName}.pdf`);
  };

  const filteredFarmers = farmers.filter((farmer) =>
    `${farmer.firstname} ${farmer.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (farmer.phone || "").includes(searchTerm) ||
    (farmer.primaryCrop || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      {/* Menu Toggle */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">Menu</div>
        <nav className="sidebar-nav">
          <button onClick={() => { navigate("/register-farmer"); setMenuOpen(false); }}>
            <FaUserPlus /> Register Farmer
          </button>
          <button onClick={() => { navigate("/farmer-list"); setMenuOpen(false); }}>
            <FaList /> Farmer List
          </button>
          <button onClick={() => { navigate("/search-farmer"); setMenuOpen(false); }}>
            <FaSearch /> Search Farmers
          </button>
          <button onClick={() => { navigate("/generate-certificate"); setMenuOpen(false); }}>
            <FaFileAlt /> Generate Certificate
          </button>
          <button onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>


      <h2>Farmers in {stateName}</h2>

      <div className="top-controls">
        <input
          type="text"
          placeholder="Search by name, phone, or crop..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="export-btn" onClick={exportPDF}>
          Export PDF
        </button>
      </div>


      <div className="table-container">
        <table className="farmer-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Farmer ID</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Primary Crop</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.map((farmer, index) => (
              <tr key={farmer.id}>
                <td>{index + 1}</td>
                <td>{farmer.farmerID}</td>
                <td>{`${farmer.firstname} ${farmer.lastname}`}</td>
                <td>{farmer.gender}</td>
                <td>{farmer.phone}</td>
                <td>{farmer.primaryCrop}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(farmer.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(farmer.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {filteredFarmers.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No farmers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      
      <style>{`
        .container {
  width: 100vw;
  height: 100vh;
  padding: 10px 20px;
  margin: 0;
  background: #ffffff;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

        .menu-toggle {
          font-size: 24px;
          cursor: pointer;
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: -250px;
          width: 250px;
          height: 100vh;
          background-color: #1e3a8a;
          color: white;
          padding: 20px;
          transition: left 0.3s ease-in-out;
          z-index: 9;
        }

        .sidebar.open {
          left: 0;
        }

        .sidebar-header {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .sidebar-nav button {
          display: block;
          width: 100%;
          background: none;
          border: none;
          color: white;
          padding: 12px;
          font-size: 16px;
          text-align: left;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .sidebar-nav button:hover {
          background-color: #2e4cc7;
          border-radius: 6px;
        }

       h2 {
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
  color: #1e3a8a;
}


       .top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

        .search-input {
          flex: 1;
          min-width: 250px;
          padding: 12px 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 16px;
        }

        .export-btn {
          padding: 12px 20px;
          background-color: #1e3a8a;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .export-btn:hover {
          background-color: #274baf;
        }

        .table-container {
  flex: 1;
  overflow-x: auto;
}


       .farmer-table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
}

        .farmer-table th, .farmer-table td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .farmer-table th {
          background-color: #1e3a8a;
          color: white;
        }

        .farmer-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .farmer-table tr:hover {
          background-color: #f0f4ff;
        }

        .edit-btn, .delete-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          margin-right: 6px;
          cursor: pointer;
        }

        .edit-btn {
          background-color: #2563eb;
          color: white;
        }

        .edit-btn:hover {
          background-color: #1e40af;
        }

        .delete-btn {
          background-color: #ef4444;
          color: white;
        }

        .delete-btn:hover {
          background-color: #b91c1c;
        }

        @media (max-width: 768px) {
          .top-controls {
            flex-direction: column;
          }

          .sidebar {
            width: 80%;
          }
        }
      `}</style>
    </div>
  );
};

export default FarmerListByState;
