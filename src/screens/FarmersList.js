import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { Link } from 'react-router-dom';
import "../styles/FarmersList.css";

const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ cropType: "", state: "", gender: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can change this to adjust the number of items per page

  useEffect(() => {
    const fetchFarmers = async () => {
      const farmersCollection = collection(firestore, "farmers");
      const farmersSnapshot = await getDocs(farmersCollection);
      const farmersList = farmersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFarmers(farmersList);
    };
    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter((farmer) => {
    return (
      (farmer.name.toLowerCase().includes(search.toLowerCase()) ||
        farmer.nin.includes(search) ||
        farmer.phone.includes(search)) &&
      (filter.cropType ? farmer.primaryCrop === filter.cropType : true) &&
      (filter.state ? farmer.state === filter.state : true) &&
      (filter.gender ? farmer.gender === filter.gender : true)
    );
  });

  // Get the current farmers to be displayed on the current page
  const indexOfLastFarmer = currentPage * itemsPerPage;
  const indexOfFirstFarmer = indexOfLastFarmer - itemsPerPage;
  const currentFarmers = filteredFarmers.slice(indexOfFirstFarmer, indexOfLastFarmer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="farmers-list-container">
      <div className="header">
        <div className="logo-title">
          <img src="/cosmologo.png" alt="CCSA Logo" className="logo" />
          <div className="title-section">
            <h1 className="title">Centre for Climate Smart Agriculture</h1>
            <p className="subtitle">Registered Farmers</p>
          </div>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by Name, NIN, or Phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          className="filter-select"
          onChange={(e) => setFilter({ ...filter, cropType: e.target.value })}
        >
          <option value="">All Crops</option>
          <option value="Maize">Maize</option>
          <option value="Groundnut">Groundnut</option>
          <option value="Beans">Beans</option>
        </select>
        <select
          className="filter-select"
          onChange={(e) => setFilter({ ...filter, state: e.target.value })}
        >
          <option value="">All States</option>
          <option value="Kaduna">Kaduna</option>
          <option value="Abuja">Abuja</option>
          <option value="Jigawa">Jigawa</option>
          <option value="Katsina">Katsina</option>
        </select>
        <select
          className="filter-select"
          onChange={(e) => setFilter({ ...filter, gender: e.target.value })}
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <table className="farmers-table">
        <thead>
          <tr className="table-header">
            <th>Serial No.</th>
            <th>Name</th>
            <th>Phone</th>
            <th>NIN</th>
            <th>State</th>
            <th>Primary Crop</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {currentFarmers.map((farmer, index) => (
            <tr key={farmer.id}>
              <td>{indexOfFirstFarmer + index + 1}</td> {/* Serial number */}
              <td>
                {/* Link to navigate to the farmer details page */}
                <Link to={`/FarmerDetail/${farmer.id}`} style={{ color: '#007bff' }}>
                  {farmer.name}
                </Link>
              </td>
              <td>{farmer.phone}</td>
              <td>{farmer.nin}</td>
              <td>{farmer.state}</td>
              <td>{farmer.primaryCrop}</td>
              <td>{farmer.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredFarmers.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FarmersList;
