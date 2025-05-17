import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";

const FarmersByGender = () => {
  const { gender } = useParams();
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const [filterMaritalStatus, setFilterMaritalStatus] = useState("");
  const [filterCrop, setFilterCrop] = useState("");
  const [filterFarmOwnership, setFilterFarmOwnership] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "farmers"), (snapshot) => {
      const filteredFarmers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(farmer => farmer.gender?.toLowerCase() === gender?.toLowerCase());
      setFarmers(filteredFarmers);
    });

    return () => unsubscribe();
  }, [gender]);

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch =
      (farmer.farmerID?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (farmer.firstname?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (farmer.lastname?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (farmer.phone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (farmer.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesState = filterState === "" || farmer.state === filterState;
    const matchesAge = filterAge === "" || String(farmer.age) === filterAge;
    const matchesMaritalStatus = filterMaritalStatus === "" || farmer.maritalStatus === filterMaritalStatus;
    const matchesCrop = filterCrop === "" || farmer.primaryCrop === filterCrop;
    const matchesFarmOwnership = filterFarmOwnership === "" || farmer.farmOwnership === filterFarmOwnership;

    return matchesSearch && matchesState && matchesAge && matchesMaritalStatus && matchesCrop && matchesFarmOwnership;
  });

  const getUniqueValues = (key) => {
    return [...new Set(farmers.map(f => f[key]).filter(Boolean))];
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ marginBottom: "20px" }}>Farmers Registered as: {gender}</h2>

      {/* Search and Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search Farmer ID, Name, Phone, Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "5px", flex: 1 }}
        />
        <select value={filterState} onChange={e => setFilterState(e.target.value)} style={{ padding: "8px" }}>
          <option value="">Filter by State</option>
          {getUniqueValues("state").map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <select value={filterAge} onChange={e => setFilterAge(e.target.value)} style={{ padding: "8px" }}>
          <option value="">Filter by Age</option>
          {getUniqueValues("age").map(age => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
        <select value={filterMaritalStatus} onChange={e => setFilterMaritalStatus(e.target.value)} style={{ padding: "8px" }}>
          <option value="">Filter by Marital Status</option>
          {getUniqueValues("maritalStatus").map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select value={filterCrop} onChange={e => setFilterCrop(e.target.value)} style={{ padding: "8px" }}>
          <option value="">Filter by Crop</option>
          {getUniqueValues("primaryCrop").map(crop => (
            <option key={crop} value={crop}>{crop}</option>
          ))}
        </select>
        <select value={filterFarmOwnership} onChange={e => setFilterFarmOwnership(e.target.value)} style={{ padding: "8px" }}>
          <option value="">Filter by Farm Ownership</option>
          {getUniqueValues("farmOwnership").map(ownership => (
            <option key={ownership} value={ownership}>{ownership}</option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Serial</th>
            <th style={thStyle}>Farmer ID</th>
            <th style={thStyle}>Surname Name</th>
            <th style={thStyle}>First Name</th>
            <th style={thStyle}>Middle Name</th>
            <th style={thStyle}>State</th>
            <th style={thStyle}>Age</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone Number</th>
            <th style={thStyle}>WhatsApp Number</th>
            <th style={thStyle}>Marital Status</th>
            <th style={thStyle}>Primary Crop</th>
            <th style={thStyle}>Farm Ownership</th>
          </tr>
        </thead>
        <tbody>
          {filteredFarmers.map((farmer, index) => (
            <tr key={farmer.id}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{farmer.farmerID}</td>
              <td style={tdStyle}>{farmer.lastname}</td>
              <td style={tdStyle}>{farmer.firstname}</td>
              <td style={tdStyle}>{farmer.middlename}</td>
              <td style={tdStyle}>{farmer.state}</td>
              <td style={tdStyle}>{farmer.age}</td>
              <td style={tdStyle}>{farmer.email}</td>
              <td style={tdStyle}>{farmer.phone}</td>
              <td style={tdStyle}>{farmer.whatsappNumber}</td>
              <td style={tdStyle}>{farmer.maritalStatus}</td>
              <td style={tdStyle}>{farmer.primaryCrop}</td>
              <td style={tdStyle}>{farmer.farmOwnership}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { border: "1px solid #ccc", padding: "8px", background: "#f0f0f0", fontWeight: "bold" };
const tdStyle = { border: "1px solid #ccc", padding: "8px" };

export default FarmersByGender;
