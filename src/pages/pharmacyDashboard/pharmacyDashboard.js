import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/pharmacy/requests");
      setPrescriptions(res.data);
    } catch (err) {
      console.error("Failed to load prescriptions", err);
    }
  };

  const fulfillPrescription = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5001/api/pharmacy/prescriptions/${id}/fulfill`);
      setMessage(res.data.message || "Success");
      fetchPrescriptions();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to fulfill prescription.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Pharmacy Dashboard</h1>
      {message && <p className="dashboard-message">{message}</p>}
      <h2>Active Prescription Requests</h2>
      {prescriptions.length === 0 ? (
        <p>No active requests.</p>
      ) : (
        <ul className="prescription-list">
          {prescriptions.map((rx) => (
            <li key={rx.prescription_id} className="prescription-item">
              <strong>{rx.patient_name}</strong> - {rx.medication_name} ({rx.dosage})
              {rx.inventory_conflict ? (
                <span className="inventory-conflict">Inventory conflict</span>
              ) : (
                <button onClick={() => fulfillPrescription(rx.prescription_id)}>
                  Fulfill
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PharmacyDashboard;