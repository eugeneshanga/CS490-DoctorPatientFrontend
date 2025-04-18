import React, {useEffect, useState} from 'react';
import './patientDashboard.css';
import BookAppointmentModal from "./BookAppointmentModal";
import WeightChart from "./WeightChart";
import CalorieChart from "./CalorieChart";
import {useNavigate} from "react-router-dom";
import ChatWindow from '../../Components/ChatWindow';

function PatientDashboard() {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const user_id = user ? user.user_id : null;
    const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "appointments", "metrics", "payments"
    const [patientDetails, setPatientDetails] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [doctorResults, setDoctorResults] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);

    // Additional state for booking confirmation popup
    const [bookingMessage] = useState('');
    const [showBookingPopup, setShowBookingPopup] = useState(false);

    // States for payments
    const [doctorPayments, setDoctorPayments] = useState([]);
    const [pharmacyPayments, setPharmacyPayments] = useState([]);

    // States for Metrics Graphs
    const [latestHeight, setLatestHeight] = useState(null);
    const [weightData, setWeightData] = useState([]);
    const [calorieData, setCalorieData] = useState([]);

    // States for Appointments Tab
    const [acceptedAppointments, setAcceptedAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);
    const [completedAppointments, setCompletedAppointments] = useState([]);

    const navigate = useNavigate();

    // Function to trigger booking modal
    const openBookingModal = (doctor_id) => {
        setSelectedDoctorId(doctor_id);
        setShowBookingModal(true);
    };

    // Modal visibility
    const [showMetricsModal, setShowMetricsModal] = useState(false);

    // Form fields
    const [metricWeight, setMetricWeight] = useState("");
    const [metricHeight, setMetricHeight] = useState("");
    const [metricCalories, setMetricCalories] = useState("");

    // Open / close
    const openMetricsModal = () => setShowMetricsModal(true);
    const closeMetricsModal = () => setShowMetricsModal(false);

    useEffect(() => {
        fetch(`http://localhost:5000/api/patient-dashboard/details?user_id=${user_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.patient) {
                    setPatientDetails(data.patient);
                }
            })
            .catch(error => console.error('Error fetching patient details:', error));
    }, [user_id]);

    // Fetch payments when the payments tab is active.
    useEffect(() => {
        if (activeTab === "payments") {
            Promise.all([
                fetch(`http://localhost:5000/api/patient-dashboard/payments/doctor?user_id=${user_id}`)
                    .then(response => response.json()),
                fetch(`http://localhost:5000/api/patient-dashboard/payments/pharmacy?user_id=${user_id}`)
                    .then(response => response.json())
            ])
                .then(([doctorData, pharmacyData]) => {
                    setDoctorPayments(doctorData);
                    setPharmacyPayments(pharmacyData);
                })
                .catch(error => console.error('Error fetching payments:', error));
        }
    }, [user_id, activeTab]);

    // Submit handler
    const handleMetricsSubmit = () => {
        // simple validation
        if (!metricWeight || !metricHeight || !metricCalories) {
            return alert("All fields are required");
        }

        fetch("http://localhost:5000/api/patient-dashboard/metrics/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id,
                weight: parseFloat(metricWeight),
                height: parseFloat(metricHeight),
                caloric_intake: parseInt(metricCalories, 10)
            })
        })
            .then(res => res.json())
            .then(json => {
                if (json.message) {
                    alert(json.message);
                    // optionally re‑fetch latest height and graph data:
                    fetch(`http://localhost:5000/api/patient-dashboard/metrics/latest-height?user_id=${user_id}`)
                        .then(r => r.json()).then(d => setLatestHeight(d.latest_height));
                    if (activeTab === "metrics") {
                        fetch(`http://localhost:5000/api/patient-dashboard/metrics/graph-data?user_id=${user_id}`)
                            .then(r => r.json()).then(d => {
                            setWeightData(d.weight_data);
                            setCalorieData(d.caloric_intake_data);
                        });
                    }
                } else {
                    alert("Error: " + (json.error||"Unknown"));
                }
            })
            .catch(err => console.error("Error submitting metrics:", err))
            .finally(closeMetricsModal);
    };

    // Function to perform doctor search
    const performDoctorSearch = () => {
        const query = `${firstName} ${lastName}`.trim();
        fetch(`http://localhost:5000/api/patient-dashboard/search-doctors?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => setDoctorResults(data))
            .catch(error => console.error("Error searching doctors:", error));
    };

    // Function to book appointment using the selected time from the modal
    const bookAppointment = (appointment_time) => {
        fetch("http://localhost:5000/api/patient-dashboard/appointments/patient_appointment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user_id,
                doctor_id: selectedDoctorId,
                appointment_time: appointment_time
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message); // Or use another modal for success confirmation
                } else if (data.error) {
                    alert("Error: " + data.error);
                }
            })
            .catch(error => console.error("Error booking appointment:", error))
            .finally(() => {
                setShowBookingModal(false);
                setSelectedDoctorId(null);
            });
    };

    // Gets patients latest recorded height
    useEffect(() => {
        fetch(`http://localhost:5000/api/patient-dashboard/metrics/latest-height?user_id=${user_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.latest_height) {
                    setLatestHeight(data.latest_height);
                }
            })
            .catch(error => console.error("Error fetching latest height:", error));
    }, [user_id])

    // Fetch metrics data when metrics tab is active
    useEffect(() => {
        if (activeTab === "metrics") {
            fetch(`http://localhost:5000/api/patient-dashboard/metrics/graph-data?user_id=${user_id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.weight_data) {
                        setWeightData(data.weight_data);
                    }
                    if (data.caloric_intake_data) {
                        setCalorieData(data.caloric_intake_data);
                    }
                })
                .catch(error => console.error('Error fetching metrics:', error));
        }
    }, [user_id, activeTab]);

    // Fetch appointments data when appointments tab is active
    useEffect(() => {
        if (activeTab === "appointments" && user_id) {
            Promise.all([
                fetch(`http://localhost:5000/api/patient-dashboard/appointments/accepted?user_id=${user_id}`).then(res => res.json()),
                fetch(`http://localhost:5000/api/patient-dashboard/appointments/canceled?user_id=${user_id}`).then(res => res.json()),
                fetch(`http://localhost:5000/api/patient-dashboard/appointments/completed?user_id=${user_id}`).then(res => res.json())
            ])
                .then(([acceptedData, canceledData, completedData]) => {
                    setAcceptedAppointments(acceptedData);
                    setCanceledAppointments(canceledData);
                    setCompletedAppointments(completedData);
                })
                .catch(error => console.error("Error fetching appointments data:", error));
        }
    }, [activeTab, user_id]);

    // Function to cancel an appointment
    const cancelAppointment = (appointment_id) => {
        fetch(`http://localhost:5000/api/patient-dashboard/appointments/cancel_appointment`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user_id,
                appointment_id: appointment_id
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    // Refresh the appointments after canceling
                    // You could call the same promise-all fetch here again:
                    if(activeTab === "appointments") {
                        // Re-fetch appointments to update the lists
                        Promise.all([
                            fetch(`http://localhost:5000/api/patient-dashboard/appointments/accepted?user_id=${user_id}`).then(res => res.json()),
                            fetch(`http://localhost:5000/api/patient-dashboard/appointments/canceled?user_id=${user_id}`).then(res => res.json()),
                            fetch(`http://localhost:5000/api/patient-dashboard/appointments/completed?user_id=${user_id}`).then(res => res.json())
                        ])
                            .then(([acceptedData, canceledData, completedData]) => {
                                setAcceptedAppointments(acceptedData);
                                setCanceledAppointments(canceledData);
                                setCompletedAppointments(completedData);
                            })
                            .catch(error => console.error("Error re-fetching appointments:", error));
                    }
                } else if (data.error) {
                    alert("Error: " + data.error);
                }
            })
            .catch(error => console.error("Error canceling appointment:", error));
    };

    // Somewhere near the top of your component
    const handleCancelClick = (appointment_id) => {
        const ok = window.confirm(
            `Are you sure you want to cancel appointment #${appointment_id}?`
        );
        if (ok) {
            cancelAppointment(appointment_id);
        }
    };

    // Render content based on the active tab.
    const renderDashboardData = () => {
        if (activeTab === "dashboard") {
            return (
                <div>
                    <h3>Doctor Search</h3>
                    <div className="search-form">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <button onClick={performDoctorSearch}>Search</button>
                    </div>
                    <div className="search-results">
                        {doctorResults.length > 0 ? (
                            doctorResults.map(doc => (
                                <div key={doc.doctor_id} className="doctor-card">
                                    <h4>Dr. {doc.first_name} {doc.last_name}</h4>
                                    <p><strong>License:</strong> {doc.license_number}</p>
                                    <p><strong>Phone:</strong> {doc.phone_number}</p>
                                    <button onClick={() => openBookingModal(doc.doctor_id)}>
                                        Book Appointment
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No results found.</p>
                        )}
                    </div>
                </div>
            );
        } else if (activeTab === "appointments") {
            return (
                <div>
                    <h3>Appointments</h3>
                    <div>
                        <h4>Accepted Appointments</h4>
                        <div className="appointments-container">
                            {acceptedAppointments.length > 0 ? (
                                acceptedAppointments.map(app => (
                                    <div key={app.appointment_id} className="appointment-card">
                                        <h5>Appointment #{app.appointment_id}</h5>
                                        <p><strong>Doctor ID:</strong> {app.doctor_id}</p>
                                        <p><strong>Date/Time:</strong> {app.appointment_time}</p>
                                        <p><strong>Status:</strong> {app.status}</p>
                                        <button
                                            className="cancel-button"
                                            onClick={() => handleCancelClick(app.appointment_id)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No accepted appointments.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4>Canceled Appointments</h4>
                        <div className="appointments-container">
                            {canceledAppointments.length > 0 ? (
                                canceledAppointments.map(app => (
                                    <div key={app.appointment_id} className="appointment-card">
                                        <h5>Appointment #{app.appointment_id}</h5>
                                        <p><strong>Doctor ID:</strong> {app.doctor_id}</p>
                                        <p><strong>Date/Time:</strong> {app.appointment_time}</p>
                                        <p><strong>Status:</strong> {app.status}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No canceled appointments.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4>Completed Appointments</h4>
                        <div className="appointments-container">
                            {completedAppointments.length > 0 ? (
                                completedAppointments.map(app => (
                                    <div key={app.appointment_id} className="appointment-card">
                                        <h5>Appointment #{app.appointment_id}</h5>
                                        <p><strong>Doctor ID:</strong> {app.doctor_id}</p>
                                        <p><strong>Date/Time:</strong> {app.appointment_time}</p>
                                        <p><strong>Status:</strong> {app.status}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No completed appointments.</p>
                            )}
                        </div>
                    </div>
                </div>
            );
        } else if (activeTab === "metrics") {
            return (
                <div>
                    <h3>Metrics</h3>
                    {latestHeight !== null ? (
                        <p>Latest Recorded Height: {latestHeight} m</p>
                    ) : (
                        <p>Loading latest height...</p>
                    )}
                    <button className="submit-metrics-button" onClick={openMetricsModal}>
                        Log Daily Metrics
                    </button>
                    <div>
                        <h4>Weight Over Time</h4>
                        <WeightChart weightData={weightData} />
                    </div>
                    <div>
                        <h4>Caloric Intake Over Time</h4>
                        <CalorieChart calorieData={calorieData} />
                    </div>
                    {showMetricsModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h4>Enter Today’s Metrics</h4>
                                <label>
                                    Weight (lbs):
                                    <input
                                        type="number"
                                        value={metricWeight}
                                        onChange={e => setMetricWeight(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Height (inches):
                                    <input
                                        type="number"
                                        value={metricHeight}
                                        onChange={e => setMetricHeight(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Calories:
                                    <input
                                        type="number"
                                        value={metricCalories}
                                        onChange={e => setMetricCalories(e.target.value)}
                                    />
                                </label>
                                <div className="modal-actions">
                                    <button onClick={handleMetricsSubmit}>Submit</button>
                                    <button onClick={closeMetricsModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        } else if (activeTab === "payments") {
            return (
                <div>
                    <h3>Payments</h3>
                    <div className="payments-section">
                        <h4>Doctor Payments</h4>
                        <div className="payments-container">
                            {doctorPayments.length > 0 ? (
                                doctorPayments.map(payment => (
                                    <div key={payment.payment_id} className="payment-card">
                                        <h5>Payment #{payment.payment_id}</h5>
                                        <p><strong>Doctor:</strong> Dr. {payment.first_name} {payment.last_name}</p>
                                        <p><strong>Amount:</strong> ${payment.amount}</p>
                                        <p><strong>Fulfilled:</strong> {payment.is_fulfilled ? "Yes" : "No"}</p>
                                        <p><strong>Date:</strong> {payment.payment_date}</p>
                                        {!payment.is_fulfilled && (
                                            <button className="fulfill-button"
                                                    onClick={() =>
                                                        navigate('/payment', {
                                                            state: {
                                                                transaction_id: payment.payment_id,
                                                                transaction_type: 'doctor'
                                                            }
                                                        })
                                                    }
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No doctor payments found.</p>
                            )}
                        </div>

                        <h4>Pharmacy Payments</h4>
                        <div className="payments-container">
                            {pharmacyPayments.length > 0 ? (
                                pharmacyPayments.map(payment => (
                                    <div key={payment.payment_id} className="payment-card">
                                        <h5>Payment #{payment.payment_id}</h5>
                                        <p><strong>Pharmacy:</strong> {payment.pharmacy_name}</p>
                                        <p><strong>Amount:</strong> ${payment.amount}</p>
                                        <p><strong>Fulfilled:</strong> {payment.is_fulfilled ? "Yes" : "No"}</p>
                                        <p><strong>Date:</strong> {payment.payment_date}</p>
                                        {!payment.is_fulfilled && (
                                            <button className="fulfill-button"
                                                    onClick={() =>
                                                        navigate('/payment', {
                                                            state: {
                                                                transaction_id: payment.payment_id,
                                                                transaction_type: 'pharmacy'
                                                            }
                                                        })
                                                    }
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No pharmacy payments found.</p>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
        else if (activeTab === "chat") {
            return (
              <div>
                <h3>Chat with Doctor</h3>
                {patientDetails && (
                  <ChatWindow patientId={patientDetails.patient_id} />
                )}
              </div>
            );
          }
    };

    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
            {/* Top Bar */}
            <header className="top-bar">
                <h1>Smart Eatz</h1>
                <h2>Patient Dashboard</h2>
                <div className="patient-details">
                    {patientDetails ? (
                        <p style={{ margin: 0 }}>
                            {patientDetails.first_name} {patientDetails.last_name}<br />
                            PatientID: {patientDetails.patient_id}
                        </p>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </header>

            {/* Main container with sidebar and data plane */}
            <div className="main-container">
                {/* Sidebar */}
                <nav className="side-bar">
                    <ul>
                        <li>
                            <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab("appointments")}>Appointments</button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab("metrics")}>Metrics</button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab("payments")}>Payments</button>
                        </li>
                        <li><button onClick={() => setActiveTab("chat")}>Chat</button></li>

                    </ul>
                </nav>

                {/* Data Plane */}
                <main className="data-plane">
                    {renderDashboardData()}
                </main>
            </div>
            {/* Booking Modal */}
            {showBookingModal && (
                <BookAppointmentModal
                    onBook={bookAppointment}
                    onClose={() => setShowBookingModal(false)}
                />
            )}
            {/* Booking Confirmation Modal */}
            {showBookingPopup && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>{bookingMessage}</p>
                        <button onClick={() => setShowBookingPopup(false)}>
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientDashboard;
