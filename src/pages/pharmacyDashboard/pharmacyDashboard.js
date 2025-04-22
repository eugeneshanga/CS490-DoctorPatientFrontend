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
  //logic for displaying form to add inventory
  const [newMedName, setNewMedName] = useState("");
  const [newStock, setNewStock] = useState("");

  const addInventoryItem = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const pharmacy_id = user?.user_id;

    try {
      const res = await axios.post("http://localhost:5001/api/pharmacy/inventory/add", {
        pharmacy_id,
        drug_name: newMedName,
        stock_quantity: parseInt(newStock),
      });
      setMessage(res.data.message || "Inventory added");
      setNewMedName("");
      setNewStock("");
      fetchInventory();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error adding inventory");
    }
  };

  //logic to display inventory on screen
  const [inventory, setInventory] = useState([]);

  const fetchInventory = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const pharmacy_id = user?.user_id;

    try {
      const res = await axios.get(`http://localhost:5001/api/pharmacy/inventory?pharmacy_id=${pharmacy_id}`);
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchInventory();
  }, []);

  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const pharmacy_id = user?.user_id;
    try {
      const res = await axios.get(`http://localhost:5001/api/pharmacy/logs?pharmacay_id=${pharmacy_id}`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
  };

useEffect(() => {
  fetchTransactions();
}, []);

  console.log("Inventory: ", inventory);
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
      <h2>Add Inventory</h2>
        <div className="inventory-form">
          <input
            type="text"
            placeholder="Medication Name"
            value={newMedName}
            onChange={(e) => setNewMedName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
          />
          <button onClick={addInventoryItem}>Add Medication</button>
        </div>
        <h2>Current Inventory</h2>
        <ul>
          {inventory.map((item, idx) => (
            <li key={idx}>
              {item.drug_name} — {item.stock_quantity} units
            </li>
      ))}
    </ul>
    <h2>Completed Transactions</h2>
      {transactions.length === 0 ? (
        <p>No past transactions found.</p>
      ) : (
        <ul className="transaction-list">
          {transactions.map((tx, idx) => (
            <li key={idx}>
              {tx.patient_name} — {tx.medication_name} — ${Number(tx.amount_billed).toFixed(2)} — {new Date(tx.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PharmacyDashboard;