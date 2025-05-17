import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";

const genderOptions = ["Male", "Female", "Other"];
const stateOptions = ["Abuja", "Lagos", "Kano", "Kaduna", "Rivers"];
const cropOptions = ["Maize", "Rice", "Cassava", "Yam", "Tomato"];
const ownershipOptions = ["Owned", "Leased", "Family Land"];
const seasonOptions = ["Dry Season", "Wet Season", "All Year"];

const EditFarmer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    farmerID: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    whatsappNumber: "",
    email: "",
    state: "",
    localGovernment: "",
    address: "",
    primaryCrop: "",
    farmOwnership: "",
    farmingSeason: "",
    farmSize: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const docRef = doc(firestore, "farmers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData((prev) => ({ ...prev, ...docSnap.data() }));
        } else {
          alert("Farmer not found.");
          navigate(-1);
        }
      } catch (error) {
        console.error("Error fetching farmer:", error);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = "First name is required.";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required.";
    if (!formData.farmerID.trim()) newErrors.farmerID = "Farmer ID is required.";
    if (!/^\d{10,15}$/.test(formData.phone)) newErrors.phone = "Valid phone number required.";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateDoc(doc(firestore, "farmers", id), formData);
      alert("Farmer updated successfully!");
      navigate(`/one-FarmerDetail/${id}`);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update farmer.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-container">
      <h2>Edit Farmer</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        {[
          { label: "First Name", name: "firstname" },
          { label: "Last Name", name: "lastname" },
          { label: "Middle Name", name: "middlename" },
          { label: "Farmer ID", name: "farmerID" },
          { label: "Phone Number", name: "phone" },
          { label: "WhatsApp Number", name: "whatsappNumber" },
          { label: "Email", name: "email" },
          { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          { label: "Local Government", name: "localGovernment" },
          { label: "Address", name: "address" },
          { label: "Farm Size", name: "farmSize" },
        ].map(({ label, name, type = "text" }) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={["firstname", "lastname", "farmerID"].includes(name)}
            />
            {errors[name] && <p className="error">{errors[name]}</p>}
          </div>
        ))}

        {/* Dropdowns */}
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            {genderOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>State</label>
          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="">Select State</option>
            {stateOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Primary Crop</label>
          <select name="primaryCrop" value={formData.primaryCrop} onChange={handleChange}>
            <option value="">Select Crop</option>
            {cropOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Farm Ownership</label>
          <select name="farmOwnership" value={formData.farmOwnership} onChange={handleChange}>
            <option value="">Select Ownership</option>
            {ownershipOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Farming Season</label>
          <select name="farmingSeason" value={formData.farmingSeason} onChange={handleChange}>
            <option value="">Select Season</option>
            {seasonOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit">Update Farmer</button>
          <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>

      <style>{`
        .edit-container {
          padding: 20px;
          background-color: #f3f4f6;
          min-height: 100vh;
        }

        h2 {
          text-align: center;
          color: #1e3a8a;
          margin-bottom: 20px;
        }

        .edit-form {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #1e3a8a;
        }

        input, select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          color: white;
          background-color: #1e40af;
          cursor: pointer;
        }

        .cancel-btn {
          background-color: #6b7280;
        }

        .error {
          color: red;
          font-size: 0.9em;
          margin-top: 5px;
        }

        button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default EditFarmer;
