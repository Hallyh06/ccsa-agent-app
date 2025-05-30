import logo from './cosmologo.png';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import FarmersList from './screens/FarmersList';
import FarmersListTable from './screens/FarmersListTable'; 
import RegisterFarmer from './screens/RegisterFarmer';
import UserRegisteration from './screens/UserRegistration';
import ForgetPassword from './screens/ForgetPassword';
import FarmerDetail from './screens/FarmerDetail';
import OneFarmerDetail from './screens/OneFarmerDetail';
import EditFarmer from './screens/EditFarmer';
import FarmerListByState from "./screens/FarmerListByState";
import EditFarmerFromState from "./screens/EditFarmerFromState";
import FarmersByGender from "./screens/FarmersByGender";
import FarmersByOwnership from './screens/FarmersByOwnership';

import SearchFarmers from "./screens/SearchFarmers";
import GenerateReport from "./screens/GenerateReport";
//import './App.css';


const Home = () => (
  <div style={styles.container}>
    <img src={logo} className="App-logo" alt="logo" />
    <h2>Center for Climate Smart Agriculture</h2>
    <Link to="Login" style={styles.link}>Proceed</Link>
  </div>
);


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<RegisterFarmer />} />
        <Route path="/Farmers" element={<FarmersList />} />
        <Route path="/FarmersList" element={<FarmersListTable />} />
        <Route path="/UserRegistration" element={<UserRegisteration />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/FarmerDetail/:id" element={<FarmerDetail />} />
        <Route path="/one-FarmerDetail/:id" element={<OneFarmerDetail />} />
        <Route path="/edit-farmer/:id" element={<EditFarmer />} />
        <Route path="/farmers-by-state/:stateName" element={<FarmerListByState />} />
        <Route path="/edit-farmerFromState/:id" element={<EditFarmerFromState />} />
        <Route path="/farmers-by-gender/:gender" element={<FarmersByGender />} />
        <Route path="/farmers-by-ownership/:ownershipType" element={<FarmersByOwnership />} />

        <Route path="/search-farmer" element={<SearchFarmers />} />
        <Route path="/generate-certificate" element={<GenerateReport />} />


      </Routes>
    </Router>
  );
};


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
  },
  link: {
    marginTop: "20px",
    padding: "10px 15px",
    backgroundColor: '#013a64',
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
  },
};


export default App;
