import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import jsPDF from "jspdf";
import "jspdf-autotable";

const OneFarmerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [soilDetails, setSoilDetails] = useState({
    moistureLevel: farmer?.soil?.moistureLevel || "",
    fertility: farmer?.soil?.fertility || "",
    health: farmer?.soil?.health || "",
  });
  const [showChemistryModal, setShowChemistryModal] = useState(false);
  const [chemistry, setChemistry] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    carbon: "",
    atmosphere: "",
  });
  const [showWaterModal, setShowWaterModal] = useState(false);
const [waterDetails, setWaterDetails] = useState({
  ph: "",
  salinity: "",
  ionToxicity: "",
});
const [showFarmModal, setShowFarmModal] = useState(false);
const [farmDetails, setFarmDetails] = useState({
  lowLand: "",
  upLand: "",
});





  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const docRef = doc(firestore, "farmers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFarmer(docSnap.data());
        } else {
          console.error("No such farmer!");
        }
      } catch (error) {
        console.error("Error fetching farmer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmer();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      try {
        await deleteDoc(doc(firestore, "farmers", id));
        alert("Farmer deleted successfully.");
        navigate(-1);
      } catch (error) {
        console.error("Error deleting farmer:", error);
      }
    }
  };

  const handleOpenSoilModal = () => {
  setSoilDetails({
    moistureLevel: farmer?.soil?.moistureLevel || "",
    fertility: farmer?.soil?.fertility || "",
    health: farmer?.soil?.health || "",
  });
  setShowSoilModal(true);
};

const handleSaveSoilDetails = async () => {
  try {
    const updatedFarmer = { ...farmer, soil: soilDetails };
    await setDoc(doc(firestore, "farmers", id), updatedFarmer);
    setFarmer(updatedFarmer);
    setShowSoilModal(false);
    alert("Soil details updated successfully!");
  } catch (error) {
    console.error("Error updating soil details:", error);
    alert("Failed to update soil details.");
  }
};


const handleSubmitFarmDetails = async () => {
  try {
    const docRef = doc(firestore, "farmers", id); // Assuming `id` is the farmer's document ID
    await updateDoc(docRef, {
      farmDetails: farmDetails,
    });
    alert("Farm details updated!");
    setShowFarmModal(false);
  } catch (error) {
    console.error("Error updating farm details: ", error);
    alert("Failed to update farm details");
  }
};



const handleSubmitChemistry = async () => {
  try {
    const docRef = doc(firestore, "farmers", id);
    await updateDoc(docRef, {
      soilChemistry: chemistry,
    });
    //toast.success("Soil chemistry updated!");
    alert("Soil chemistry updated!");
    setShowChemistryModal(false);
  } catch (error) {
    console.error("Error updating chemistry: ", error);
    //toast.error("Failed to update soil chemistry");
    alert("Failed to update soil chemistry");
  }
};


const handleSubmitWaterDetails = async () => {
  try {
    const docRef = doc(firestore, "farmers", id);
    await updateDoc(docRef, {
      waterDetails: waterDetails,
    });
    alert("Water details updated!");
    setShowWaterModal(false);
  } catch (error) {
    console.error("Error updating water details: ", error);
   // toast.error("Failed to update water details");
   alert("Failed to update water details");
  }
};




  const handleGeneratePDF = () => {
    const docPDF = new jsPDF();
    docPDF.setFontSize(18);
    docPDF.text("Farmer Details Report", 20, 20);
    docPDF.autoTable({
      startY: 30,
      head: [["Field", "Value"]],
      body: [
        ["Name", `${farmer.lastname}, ${farmer.firstname} ${farmer.middlename || ""}`],
        ["Gender", farmer.gender],
        ["Phone", farmer.phone],
        ["State", farmer.state],
        ["LGA", farmer.localGovernment],
        ["Primary Crop", farmer.primaryCrop],
        ["Ownership", farmer.farmOwnership],
        ["Season", farmer.farmingSeason],
      ],
    });
    docPDF.save("farmer_details.pdf");
  };

  const handleEdit = () => navigate(`/edit-farmer/${id}`);
  const goTo = (path) => navigate(path);

  if (loading) return <p style={styles.statusText}>Loading farmer details...</p>;
  if (!farmer) return <p style={styles.statusText}>Farmer not found.</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        
        <button style={styles.backButton} onClick={() => navigate("/FarmersList")}>← Back</button>
        <h1 style={styles.title}>Farmer Information</h1>
      </div>

      <div style={styles.card}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Personal Information</h2>

          <div style={styles.nameGrid}>
            <p><strong>Farmer ID:</strong> {farmer.farmerID}</p>
            <p><strong>NIN:</strong> {farmer.nin}</p>
          </div>
          

          <div style={styles.nameGrid}>
            <div><strong>First Name:</strong> {farmer.firstname}</div>
            <div><strong>Middle Name:</strong> {farmer.middlename || "-"}</div>
            <div><strong>Last Name:</strong> {farmer.lastname}</div>
          </div>

          <div style={styles.nameGrid}>
            <p><strong>Gender:</strong> {farmer.gender}</p>
            <p><strong>Age:</strong> {farmer.age}</p>
            <p><strong>Marital Status:</strong> {farmer.maritalStatus}</p>
          </div>
          
          <div style={styles.nameGrid}>
            <p><strong>Phone:</strong> {farmer.phone}</p>
            <p><strong>Email:</strong> {farmer.email || "-"}</p>
            <p><strong>Employment Status:</strong> {farmer.employmenyStatus|| "-"}</p>
          </div>

          <div style={styles.nameGrid}>
            <p><strong>whatsAppNumber:</strong> {farmer.whatsappNumber}</p>
            <p><strong>Home Address:</strong> {farmer.address}</p>
            <p><strong>Educational Qualification:</strong> {farmer.highestQualification}</p>
          </div>

          
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Address</h2>
            <div style={styles.nameGrid}>
              <p><strong>State:</strong> {farmer.state}</p>
              <p><strong>LGA:</strong> {farmer.localGovernment}</p>
              <p><strong>Polling Unit:</strong> {farmer.pollingUnit}</p>
            </div>
            <div style={styles.nameGrid}>
              <p><strong>Ward:</strong> {farmer.ward}</p>
              <p><strong>Address:</strong> {farmer.address || "-"}</p>
            </div>
        </section>


         <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Bank Information</h2>
            <div style={styles.nameGrid}>
              <p><strong>Bank Name:</strong> {farmer.bankname}</p>
              <p><strong>Account Name:</strong> {farmer.accountname}</p>
            </div>
          
            <div style={styles.nameGrid}>
              <p><strong>Account Number:</strong> {farmer.accountnumber || "-"}</p>
              <p><strong>BVN:</strong> {farmer.bvn || "-"}</p>
            </div>
        </section>


        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Farm Details</h2>
            <div style={styles.nameGrid}>
              <p><strong>Farm Ownership:</strong> {farmer.farmOwnership}</p>
              <p><strong>Farming Season:</strong> {farmer.farmingSeason}</p>
              <p><strong>Farm Size:</strong> {farmer.farmsize}</p>
            </div>
            <div style={styles.nameGrid}>
              <p><strong>Latitude:</strong> {farmer.latitude}</p>
              <p><strong>Longitude:</strong> {farmer.longitude}</p>
              <p><strong>Primary Crop:</strong> {farmer.primaryCrop}</p>
            </div>
          
          <div style={styles.nameGrid}>
            <p><strong>Secondary Crop:</strong> {farmer.secondaryCrop}</p>
            <p><strong>Soil Moist:</strong> {farmer.moistureLevel}</p>
          </div>


          {farmer.farmDetails && (
  <div style={{ marginTop: "1.5rem" }}>
    <h2 style={{ fontWeight: "bold", fontSize: "1.2rem" }}>🌿 Farm Details</h2>
    <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
      <li><strong>Low Land:</strong> {farmer.farmDetails.lowLand}</li>
      <li><strong>Up Land:</strong> {farmer.farmDetails.upLand}</li>
    </ul>
  </div>
)}




          {farmer.soil && (
  <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "12px" }}>
    <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>🧪 Soil Details</h2>
    <div style={styles.nameGrid}>
      <div>
        <strong>Moisture Level:</strong>
        <p>{farmer.soil.moistureLevel}</p>
      </div>
      <div>
        <strong>Fertility:</strong>
        <p>{farmer.soil.fertility}</p>
      </div>
      <div>
        <strong>Health:</strong>
        <p>{farmer.soil.health}</p>
      </div>
    </div>
  </div>
)}



{farmer.soilChemistry && (
  <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "12px" }}>
    <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>🧬 Soil Chemistry</h2>
    <div style={styles.nameGrid}>
      <div>
        <strong>Atmosphere:</strong>
        <p>{farmer.soilChemistry.atmosphere}</p>
      </div>
      <div>
        <strong>Carbon:</strong>
        <p>{farmer.soilChemistry.carbon}</p>
      </div>
      <div>
        <strong>Nitrogen:</strong>
        <p>{farmer.soilChemistry.nitrogen}</p>
      </div>
      <div>
        <strong>Phosphorus:</strong>
        <p>{farmer.soilChemistry.phosphorus}</p>
      </div>
      <div>
        <strong>Potassium:</strong>
        <p>{farmer.soilChemistry.potassium}</p>
      </div>
    </div>
  </div>
)}



{farmer.waterDetails && (
  <div style={{ marginTop: "1.5rem" }}>
    <h2 style={{ fontWeight: "bold", fontSize: "1.2rem" }}>💧 Water Details</h2>
    <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
      <li><strong>Water pH:</strong> {farmer.waterDetails.ph}</li>
      <li><strong>Salinity:</strong> {farmer.waterDetails.salinity}</li>
      <li><strong>Ion Toxicity:</strong> {farmer.waterDetails.ionToxicity}</li>
    </ul>
  </div>
)}



{showWaterModal && (
  <div style={modalStyles.overlay}>
    <div style={modalStyles.modal}>
      <h2 style={{ marginBottom: "1rem" }}>🚿 Add Water Details</h2>
      <div style={{ display: "grid", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Water pH"
          value={waterDetails.ph}
          onChange={(e) => setWaterDetails({ ...waterDetails, ph: e.target.value })}
        />
        <input
          type="text"
          placeholder="Salinity"
          value={waterDetails.salinity}
          onChange={(e) => setWaterDetails({ ...waterDetails, salinity: e.target.value })}
        />
        <input
          type="text"
          placeholder="Ion Toxicity"
          value={waterDetails.ionToxicity}
          onChange={(e) => setWaterDetails({ ...waterDetails, ionToxicity: e.target.value })}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <button onClick={handleSubmitWaterDetails}>Submit</button>
          <button variant="outline" onClick={() => setShowWaterModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}





          
          
        </section>

        <div style={styles.buttonRow}>
          <button onClick={handleEdit} style={{ ...styles.button, backgroundColor: "#2563eb" }}>✏️ Edit</button>
          <button onClick={handleDelete} style={{ ...styles.button, backgroundColor: "#dc2626" }}>🗑️ Delete</button>
          <button onClick={handleGeneratePDF} style={{ ...styles.button, backgroundColor: "#059669" }}>📄 Generate PDF</button>
        </div>

        <div style={styles.buttonRow}>
          <button onClick={() => goTo(`/add-cluster/${id}`)} style={styles.button}>➕ Add Clusters</button>
          <button onClick={() => setShowFarmModal(true)} style={styles.button}>🌾 Farm Details</button>
          <button onClick={handleOpenSoilModal} style={styles.button}>🧪 Soil Details</button>

          <button onClick={() => setShowChemistryModal(true)} style={styles.button}>🧬 Add Chemistry</button>
          <button onClick={() => setShowWaterModal(true)} style={styles.button}>💧 Add Water Details</button>
        </div>
      </div>



{showFarmModal && (
  <div style={modalStyles.overlay}>
    <div style={modalStyles.modal}>
      <h2 style={{ marginBottom: "1rem" }}>🌾 Add Farm Details</h2>
      <div style={{ display: "grid", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Low Land"
          value={farmDetails.lowLand}
          onChange={(e) => setFarmDetails({ ...farmDetails, lowLand: e.target.value })}
        />
        <input
          type="text"
          placeholder="Up Land"
          value={farmDetails.upLand}
          onChange={(e) => setFarmDetails({ ...farmDetails, upLand: e.target.value })}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <button onClick={handleSubmitFarmDetails}>Submit</button>
          <button variant="outline" onClick={() => setShowFarmModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}




{showSoilModal && (
  <div style={modalStyles.overlay}>
    <div style={modalStyles.modal}>
      <h2>Update Soil Details</h2>
      <label>
        Moisture Level:
        <input
          type="text"
          value={soilDetails.moistureLevel}
          onChange={(e) => setSoilDetails({ ...soilDetails, moistureLevel: e.target.value })}
          style={modalStyles.input}
        />
      </label>
      <label>
        Fertility:
        <input
          type="text"
          value={soilDetails.fertility}
          onChange={(e) => setSoilDetails({ ...soilDetails, fertility: e.target.value })}
          style={modalStyles.input}
        />
      </label>
      <label>
        Health:
        <input
          type="text"
          value={soilDetails.health}
          onChange={(e) => setSoilDetails({ ...soilDetails, health: e.target.value })}
          style={modalStyles.input}
        />
      </label>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSaveSoilDetails} style={{ ...styles.button, backgroundColor: "#059669" }}>💾 Save</button>
        <button onClick={() => setShowSoilModal(false)} style={{ ...styles.button, backgroundColor: "#dc2626" }}>❌ Cancel</button>
      </div>
    </div>
  </div>
)}





{showChemistryModal && (
  <div style={modalStyles.overlay}>
    <div style={modalStyles.modal}>
      <h2 style={{ marginBottom: "1rem" }}>🧪 Add Soil Chemistry</h2>
      <div style={{ display: "grid", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Nitrogen Level"
          value={chemistry.nitrogen}
          onChange={(e) => setChemistry({ ...chemistry, nitrogen: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phosphorus"
          value={chemistry.phosphorus}
          onChange={(e) => setChemistry({ ...chemistry, phosphorus: e.target.value })}
        />
        <input
          type="text"
          placeholder="Potassium"
          value={chemistry.potassium}
          onChange={(e) => setChemistry({ ...chemistry, potassium: e.target.value })}
        />
        <input
          type="text"
          placeholder="Carbon"
          value={chemistry.carbon}
          onChange={(e) => setChemistry({ ...chemistry, carbon: e.target.value })}
        />
        <input
          type="text"
          placeholder="Atmosphere"
          value={chemistry.atmosphere}
          onChange={(e) => setChemistry({ ...chemistry, atmosphere: e.target.value })}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <button onClick={handleSubmitChemistry}>Submit</button>
          <button variant="outline" onClick={() => setShowChemistryModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>

    
  );
};

export default OneFarmerDetails;

// Inline styling object
const styles = {
  container: {
    padding: "2rem",
    maxeight: "300vh",
    backgroundColor: "#f0f4f8",
    boxSizing: "border-box",
    marginTop: 800
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    color: "#1e3a8a",
    margin: 0,
  },
  backButton: {
    backgroundColor: "#1e40af",
    color: "#fff",
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.08)",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    color: "#111827",
    borderBottom: "2px solid #e5e7eb",
    padding: "0.5rem",
    marginBottom: "1rem",
    textAlign: "left",
    backgroundColor: "#a9cce3"
  },
  nameGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  marginBottom: "1rem",
},
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  button: {
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#3b82f6",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  statusText: {
    textAlign: "center",
    fontSize: "1.2rem",
    marginTop: "2rem",
    color: "#6b7280",
  },
};


const modalStyles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "0.5rem",
    marginTop: "0.5rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
};
