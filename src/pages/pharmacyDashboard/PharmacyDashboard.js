import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";
import "./PharmacyDashboard.css";
import DashboardTopBar from "../../Components/DashboardTopBar/DashboardTopBar";
import Footer from "../../Components/Footer/Footer";

function PharmacyDashboard() {
  // pull user_id from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const user_id = user?.user_id;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [queue, setQueue] = useState([]);

  // Inventory States
  const [inventory, setInventory] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  // list of drugs offered
  const [drugs, setDrugs] = useState([]);

  // current drug prices
  const [prices, setPrices] = useState([]);

  // state to hold any fill errors (e.g. “Out of stock”)
  const [fillError, setFillError] = useState("");

  // states for Dispensing a Presciption
  const [filledPrescriptions, setFilledPrescriptions] = useState([]);
  const [dispenseMessage, setDispenseMessage] = useState("");
  const [dispenseError, setDispenseError] = useState("");

  const [payments, setPayments] = useState({ fulfilled: [], unfulfilled: [] })

  // fetch payments helper
  const fetchPayments = async () => {
    if (!user_id) return;
    try {
      const res = await axios.get(
        `${window.PHARMA_BASE}/api/pharmacy/payments?user_id=${user_id}`
      );
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const fetchPrices = async () => {
    const res = await axios.get(
      `${window.PHARMA_BASE}/api/prices/current-prices?user_id=${user_id}`
    );
    setPrices(res.data);
  };

  const updatePrice = async (drug_id, price) => {
    await axios.patch(`${window.PHARMA_BASE}/api/prices/update`, {
      user_id, drug_id, price
    });
    fetchPrices();
  };

  const fetchDrugs = async () => {
    try {
      const res = await axios.get(`${window.PHARMA_BASE}/api/prescriptions/drugs`);
      setDrugs(res.data);
      if (res.data.length) {
        setSelectedDrug(res.data[0].name);
      }
    } catch (err) {
      console.error("Error fetching master drug list:", err);
    }
  };

  // fetch current inventory
  const fetchInventory = async () => {
    if (!user_id) return;
    try {
      const res = await axios.get(
        `${window.PHARMA_BASE}/api/pharmacy/inventory?user_id=${user_id}`
      );
      setInventory(res.data);
      // default the dropdown to the first drug, if any
      if (res.data.length && !selectedDrug) {
        setSelectedDrug(res.data[0].drug_name);
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  const fetchFilledPrescriptions = async () => {
    if (!user_id) return;
    try {
      const res = await axios.get(
        `${window.PHARMA_BASE}/api/pharmacy/prescriptions/filled?user_id=${user_id}`
      );
      setFilledPrescriptions(res.data);
    } catch (err) {
      console.error("Error fetching filled prescriptions:", err);
    }
  };

  // Mark a prescription as dispensed
  const markAsDispensed = async (prescId) => {
    if (!user_id) return;
    setDispenseError("");
    setDispenseMessage("");
    try {
      const res = await axios.post(
        `${window.PHARMA_BASE}/api/pharmacy/prescriptions/${prescId}/dispense?user_id=${user_id}`
      );
      setDispenseMessage(`Dispensed ✔️ (Payment $${res.data.amount} created)`);
    } catch (err) {
      console.error("Error dispensing prescription:", err);
      setDispenseError(err.response?.data?.error || "Failed to dispense");
    } finally {
      fetchFilledPrescriptions();
    }
  };

// add to inventory
  const addInventoryItem = async () => {
    if (!user_id || !selectedDrug || !newQuantity) return;
    try {
      await axios.post(
        `${window.PHARMA_BASE}/api/pharmacy/inventory/add`,
        {
          user_id,
          drug_name: selectedDrug,
          stock_quantity: parseInt(newQuantity, 10),
        }
      );
      setNewQuantity("");
      fetchInventory();
    } catch (err) {
      console.error("Error adding inventory:", err);
    }
  };

  // fetch queue by user_id
  const fetchQueue = async () => {
    if (!user_id) return;
    try {
      const res = await axios.get(
        `${window.PHARMA_BASE}/api/pharmacy/queue?user_id=${user_id}`
      );
      setQueue(res.data);
    } catch (err) {
      console.error("Error fetching prescription queue:", err);
    }
  };

  // mark filled by user_id
  const markAsFilled = async (prescriptionId) => {
    if (!user_id) return;

    setFillError("");

    try {
      await axios.post(
        `${window.PHARMA_BASE}/api/pharmacy/prescriptions/${prescriptionId}/fulfill?user_id=${user_id}`
      );
    } catch (err) {
      if (err.response?.status === 400 && err.response.data.error === "Out of stock") {
        setFillError("Out of stock");
      } else {
        console.error("Error marking as filled:", err);
      }
    } finally {
      fetchQueue();
    }
  };

  // reload queue whenever tab or user changes
  useEffect(() => {
    if (activeTab === "prescription-queue") {
      fetchQueue();
    }
    else if (activeTab === "dashboard") {
      fetchInventory();
    }
    else if (activeTab === "prices") {
      fetchPrices();
    }
    else if (activeTab === "dispense") {
      fetchFilledPrescriptions();
    }
    else if (activeTab === "payments") {
      fetchPayments();
    }
    if (drugs.length === 0) {
      fetchDrugs();
    }
  }, [activeTab, user_id]);

  const renderDashboardData = () => {
    if (activeTab === "dashboard") {
      return (
        <div className="data-plane">
          <h1>Pharmacy Dashboard</h1>

          <h2>Current Inventory</h2>
          {inventory.length === 0 ? (
            <p>No inventory on hand.</p>
          ) : (
            <ul className="prescription-list">
              {inventory.map(item => (
                <li key={item.drug_name} className="appointment-card">
                  <p><strong>{item.drug_name}</strong></p>
                  <p>{item.stock_quantity} units</p>
                </li>
              ))}
            </ul>
          )}
          <div className="inventory-form-container">
            <h2>Add Stock</h2>
            <form className="inventory-form" onSubmit={e => { e.preventDefault(); addInventoryItem(); }}>
              <label>
                <span>Drug</span>
                <select
                  value={selectedDrug}
                  onChange={e => setSelectedDrug(e.target.value)}
                >
                  {drugs.map(d => (
                    <option key={d.drug_id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={newQuantity}
                  onChange={e => setNewQuantity(e.target.value)}
                />
              </label>
              <button type="submit">Add to Inventory</button>
            </form>
          </div>
        </div>
      );
    } else if (activeTab === "prescription-queue") {
      return (
        <div className="prescription-queue data-plane">
          <h1>Prescription Queue</h1>

          {fillError && (
            <p className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
              {fillError}
            </p>
          )}

          {queue.length === 0 ? (
            <p>No pending prescriptions.</p>
          ) : (
            <div className="appointments-container">
              {queue.map((rx, idx) => (
                <div key={rx.prescription_id} className="appointment-card">
                  <h5>Prescription #{rx.prescription_id}</h5>
                  <p>
                    <strong>Patient:</strong> {rx.patient_name}
                  </p>
                  <p>
                    <strong>Medication:</strong> {rx.medication_name} ({rx.dosage})
                  </p>
                  <p>
                    <strong>Requested at:</strong>{" "}
                    {new Date(rx.requested_at).toLocaleString()}
                  </p>

                  {idx === 0 ? (
                    <button
                      className="start-appointment-button"
                      onClick={() => markAsFilled(rx.prescription_id)}
                    >
                      Mark as Filled
                    </button>
                  ) : (
                    <span className="pending-label">Pending</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    else if (activeTab === "dispense") {
      return (
        <div className="data-plane">
          <h1>Dispense Prescriptions</h1>

          {dispenseMessage && (
            <p className="success-message" style={{ color: "green" }}>
              {dispenseMessage}
            </p>
          )}
          {dispenseError && (
            <p className="error-message" style={{ color: "red" }}>
              {dispenseError}
            </p>
          )}

          {filledPrescriptions.length === 0 ? (
            <p>No prescriptions ready for dispense.</p>
          ) : (
            <div className="appointments-container">
              {filledPrescriptions.map((rx, idx) => (
                <div key={rx.prescription_id} className="appointment-card">
                  <h5>Prescription #{rx.prescription_id}</h5>
                  <p>
                    <strong>Patient:</strong> {rx.patient_name}
                  </p>
                  <p>
                    <strong>Medication:</strong> {rx.medication_name} ({rx.dosage})
                  </p>
                  <p>
                    <strong>Requested at:</strong>{" "}
                    {new Date(rx.requested_at).toLocaleString()}
                  </p>
                  <button
                    className="start-appointment-button"
                    onClick={() => markAsDispensed(rx.prescription_id)}
                  >
                    Mark as Dispensed
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    else if (activeTab === "prices") {
      return (
        <div className="data-plane">
          <h1>Drug Prices</h1>
          <table className="prices-table">
            <thead>
            <tr>
              <th>Drug</th>
              <th>Description</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {prices.map(({ drug_id, name, description, price }) => (
              <tr key={drug_id}>
                <td>{name}</td>
                <td>{description}</td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={e => {
                      const newPrice = parseFloat(e.target.value);
                      setPrices(ps =>
                        ps.map(p =>
                          p.drug_id === drug_id ? { ...p, price: newPrice } : p
                        )
                      );
                    }}
                  />
                </td>
                <td>
                  <button onClick={() => updatePrice(drug_id, price)}>
                    Save
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      );
    }
    else if (activeTab === "payments") {
      return (
        <div className="data-plane">
          <h1>Payments</h1>

          <h2>Unfulfilled Payments</h2>
          {payments.unfulfilled.length === 0 ? (
            <p>No pending payments.</p>
          ) : (
            <div className="appointments-container">
              {payments.unfulfilled.map(pay => (
                <div key={pay.payment_id} className="payment-card">
                  <h5>Payment #{pay.payment_id}</h5>
                  <p><strong>Patient:</strong> {pay.patient_name}</p>
                  <p>
                    <strong>Amount:</strong>{" "}
                    {isNaN(pay.amount)
                      ? pay.amount
                      : `$${Number(pay.amount).toFixed(2)}`}
                  </p>
                  <p><strong>Date:</strong> {new Date(pay.payment_date).toLocaleString()}</p>
                  <p><strong>Status:</strong> Unfulfilled</p>
                </div>
              ))}
            </div>
          )}

          <h2>Fulfilled Payments</h2>
          {payments.fulfilled.length === 0 ? (
            <p>No fulfilled payments.</p>
          ) : (
            <div className="appointments-container">
              {payments.fulfilled.map(pay => (
                <div key={pay.payment_id} className="payment-card">
                  <h5>Payment #{pay.payment_id}</h5>
                  <p><strong>Patient:</strong> {pay.patient_name}</p>
                  <p>
                    <strong>Amount:</strong>{" "}
                    {isNaN(pay.amount)
                      ? pay.amount
                      : `$${Number(pay.amount).toFixed(2)}`}
                  </p>
                  <p><strong>Date:</strong> {new Date(pay.payment_date).toLocaleString()}</p>
                  <p><strong>Status:</strong> Fulfilled</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <DashboardTopBar />
      <div className="flex-grow flex main-container">
        <div className="side-bar">
          <ul>
            <li>
              <button
                className={activeTab === "dashboard" ? "active-tab" : ""}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={activeTab === "prescription-queue" ? "active-tab" : ""}
                onClick={() => setActiveTab("prescription-queue")}
              >
                Prescription Queue
              </button>
            </li>
            <li>
              <button
                className={activeTab === "dispense" ? "active-tab" : ""}
                onClick={() => setActiveTab("dispense")}
              >
                Dispense
              </button>
            </li>
            <li>
              <button
                className={activeTab === "prices" ? "active-tab" : ""}
                onClick={() => setActiveTab("prices")}
              >
                Prices
              </button>
            </li>
            <li>
              <button
                className={activeTab === "payments" ? "active-tab" : ""}
                onClick={() => setActiveTab("payments")}
              >
                Payments
              </button>
            </li>
          </ul>
        </div>

        <main className="data-plane">{renderDashboardData()}</main>
      </div>
      <Footer />
    </div>
  );
}

export default PharmacyDashboard;
