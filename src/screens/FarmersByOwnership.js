import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";

const FarmersByOwnership = () => {
  const { ownershipType } = useParams();
  const [allFarmers, setAllFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    state: "",
    gender: "",
    crop: "",
    maritalStatus: "",
    minAge: "",
    maxAge: ""
  });

  useEffect(() => {
    const q = query(
      collection(firestore, "farmers"),
      where("farmOwnership", "==", ownershipType)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllFarmers(list);
    });

    return () => unsubscribe();
  }, [ownershipType]);

  const filteredFarmers = allFarmers.filter((farmer) => {
    const matchesSearch =
      farmer.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farmerID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (!filters.state || farmer.state === filters.state) &&
      (!filters.gender || farmer.gender === filters.gender) &&
      (!filters.crop || farmer.primaryCrop === filters.crop) &&
      (!filters.maritalStatus || farmer.maritalStatus === filters.maritalStatus) &&
      (!filters.minAge || parseInt(farmer.age) >= parseInt(filters.minAge)) &&
      (!filters.maxAge || parseInt(farmer.age) <= parseInt(filters.maxAge));

    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Farmers with Ownership Type: {ownershipType}</h2>

      <input
        type="text"
        placeholder="Search by Farmer ID, Name, Email or Phone Number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "8px", width: "900px", marginBottom: "20px" }}
      />

      {/* Filter Inputs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
        <select name="state" onChange={handleFilterChange} value={filters.state}>
          <option value="">All States</option>
          <option value="Lagos">Lagos</option>
          <option value="Kano">Kano</option>
          <option value="Kaduna">Kaduna</option>
          {/* Add more states */}
        </select>

        <select name="gender" onChange={handleFilterChange} value={filters.gender}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select name="crop" onChange={handleFilterChange} value={filters.crop}>
          <option value="">All Crops</option>
          <option value="Rice">Rice</option>
          <option value="Maize">Maize</option>
          <option value="Cassava">Cassava</option>
          {/* Add more crops */}
        </select>

        <select name="maritalStatus" onChange={handleFilterChange} value={filters.maritalStatus}>
          <option value="">All Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
        </select>

        <input
          type="number"
          name="minAge"
          placeholder="Min Age"
          value={filters.minAge}
          onChange={handleFilterChange}
          style={{ width: "200px" }}
        />
        <input
          type="number"
          name="maxAge"
          placeholder="Max Age"
          value={filters.maxAge}
          onChange={handleFilterChange}
          style={{ width: "200px" }}
        />
      </div>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th style={thStyle}>Serial</th>
            <th style={thStyle}>Farmer ID</th>
            <th style={thStyle}>Surname</th>
            <th style={thStyle}>First Name</th>
            <th style={thStyle}>Middle Name</th>
            <th style={thStyle}>State</th>
            <th style={thStyle}>Age</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone Number</th>
            <th style={thStyle}>WhatsApp Number</th>
            <th style={thStyle}>Marital Status</th>
            <th style={thStyle}>Primary Crop</th>
            <th style={thStyle}>Gender</th>
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
              <td style={tdStyle}>{farmer.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f0f0f0",
  fontWeight: "bold"
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px"
};

export default FarmersByOwnership;
