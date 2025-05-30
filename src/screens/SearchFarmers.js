import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

const SearchFarmers = ({ navigate }) => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    state: "",
    gender: "",
    primaryCrop: "",
    secondaryCrop: "",
    farmingSeason: "",
    farmOwnership: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchFarmers = async () => {
      const farmersCollection = collection(firestore, "farmers");
      const farmersSnapshot = await getDocs(farmersCollection);
      const farmersList = farmersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setFarmers(farmersList);
    };
    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter((farmer) =>
    (farmer.firstname?.toLowerCase().includes(search.toLowerCase()) ||
      farmer.middlename?.toLowerCase().includes(search.toLowerCase()) ||
      farmer.lastname?.toLowerCase().includes(search.toLowerCase()) ||
      farmer.nin?.includes(search) ||
      farmer.phone?.includes(search)) &&
    (filter.state ? farmer.state === filter.state : true) &&
    (filter.gender ? farmer.gender === filter.gender : true) &&
    (filter.primaryCrop ? farmer.primaryCrop === filter.primaryCrop : true) &&
    (filter.secondaryCrop ? farmer.secondaryCrop === filter.secondaryCrop : true) &&
    (filter.farmingSeason ? farmer.farmingSeason === filter.farmingSeason : true) &&
    (filter.farmOwnership ? farmer.farmOwnership === filter.farmOwnership : true)
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFarmers = filteredFarmers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container">
      <style>{`
        .container {
          max-width: 900px;
          margin: auto;
          padding: 20px;
          background-color: #f5f5f5;
          font-family: Arial, sans-serif;
        }
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .logo {
          width: 50px;
          height: 50px;
          margin-right: 15px;
        }
        .title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        .subtitle {
          font-size: 14px;
          color: #666;
          margin: 0;
        }
        .back-button {
          margin-right: 10px;
          font-size: 20px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .search-input, .dropdown {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 10px;
          margin-bottom: 10px;
          background: #fff;
        }
        .card {
          background-color: #fff;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 10px;
          box-shadow: 0px 2px 5px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .card:hover {
          background-color: #f0f8ff;
        }
        .card p {
          margin: 5px 0;
          color: #333;
          font-size: 14px;
        }
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
        }
        .pagination button {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: #fff;
          cursor: pointer;
        }
        .pagination button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .pagination span {
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 16px;
          }
          .subtitle {
            font-size: 13px;
          }
          .card p {
            font-size: 13px;
          }
          .pagination {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>

      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <img src="/logo.png" alt="logo" className="logo" />
        <div>
          <h3 className="title">Centre for Climate Smart Agriculture</h3>
          <p className="subtitle">Search Registered Farmers</p>
        </div>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Search by Name, NIN, or Phone"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* Filter Dropdowns */}
      {["state", "gender", "primaryCrop", "secondaryCrop", "farmingSeason", "farmOwnership"].map((key, i) => {
        const options = {
          state: ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Jos", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"],
          gender: ["Male", "Female"],
          primaryCrop: ["Maize", "Groundnut", "Beans"],
          secondaryCrop: ["Maize", "Groundnut", "Beans"],
          farmingSeason: ["Rainy Season", "Dry Season", "Both Seasons"],
          farmOwnership: ["Self Owned", "Inherited", "Rent"]
        }[key];

        return (
          <select
            key={key}
            value={filter[key]}
            onChange={(e) => {
              setFilter({ ...filter, [key]: e.target.value });
              setCurrentPage(1);
            }}
            className="dropdown"
          >
            <option value="">Select {key.charAt(0).toUpperCase() + key.slice(1)}</option>
            {options.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        );
      })}

      {/* Farmers List */}
      {currentFarmers.map((farmer, index) => (
        <div
          key={farmer.id}
          className="card"
          onClick={() => navigate(`/farmer/${farmer.id}`)}
        >
          <p>{indexOfFirst + index + 1}. {farmer.lastname}, {farmer.firstname} {farmer.middlename}</p>
          <p>📞 {farmer.phone} | NIN: {farmer.nin}</p>
          <p>🌾 {farmer.primaryCrop} | 📍 {farmer.state} | ⚥ {farmer.gender}</p>
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default SearchFarmers;
