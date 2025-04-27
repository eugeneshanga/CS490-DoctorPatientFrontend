import React, {useEffect, useState} from 'react';
import './patientDashboard.css';
import BookAppointmentModal from "./BookAppointmentModal";
import WeightChart from "./WeightChart";
import CalorieChart from "./CalorieChart";
import {useNavigate} from "react-router-dom";
import ChatWindow from '../../Components/ChatWindow';
import Footer from '../../Components/Footer/Footer';
import DashboardTopBar from '../../Components/DashboardTopBar/DashboardTopBar';

import ChatHistory from "../../Components/ChatHistory";

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

    // Patient current prescriptions
    const [prescriptions, setPrescriptions] = useState([]);

    // Dark Mode
    const isDark = localStorage.getItem('dashboardDarkMode') === 'true';

    useEffect(() => {
        document.documentElement.classList.toggle("dark-mode", isDark);
      }, [isDark]);
    
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

    // Track the appointment that’s been “started”
    const [activeChatAppointment, setActiveChatAppointment] = useState(null);

    const navigate = useNavigate();

    // Function to trigger booking modal
    const openBookingModal = (doctor_id) => {
        setSelectedDoctorId(doctor_id);
        setShowBookingModal(true);
    };

    // Mealplan state and modal logic
    const [showMealplanModal, setShowMealplanModal] = useState(false);

    const [mealplanData, setMealplanData] = useState({
        title: '',
        description: '',
        instructions: '',
        ingredients: '',
        calories: '',
        fat: '',
        sugar: '',
        image: null
    });
    
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [showMealModal, setShowMealModal] = useState(false);
    const openMealModal = (plan) => {
        setSelectedMeal(plan);
        setShowMealModal(true);
      };

    const handleMealplanChange = (e) => {
        const { name, value, files } = e.target;
        setMealplanData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const submitMealplan = async () => {
        if (!user_id) return alert("User not found.");
        if (!mealplanData.title.trim()) return alert("Title is required!");
    
        const payload = new FormData();
        payload.append('user_id', user_id);
    
        for (let key in mealplanData) {
            if (mealplanData[key]) {
                payload.append(key, mealplanData[key]);
            }
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/patient-dashboard/mealplans/patient/create', {
                method: 'POST',
                body: payload
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Mealplan created successfully!");
                setShowMealplanModal(false);
                fetchMealplans(); // Refresh list
            } else {
                alert("Error: " + result.error);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred. See console.");
        }
    };

    useEffect(() => {
        if (activeTab === "prescriptions") {
            fetch(`http://localhost:5000/api/patient-dashboard/prescriptions?user_id=${user_id}`)
              .then(res => res.json())
              .then(data => {
                  if (Array.isArray(data)) setPrescriptions(data);
                  else console.error("Error loading prescriptions:", data.error);
              })
              .catch(err => console.error("Network error:", err));
        }
    }, [activeTab, user_id]);

    // Fetches mealplans
    const [mealplans, setMealplans] = useState([]);

    const fetchMealplans = async () => {
        if (!user_id) return;
    
        try {
            const response = await fetch(`http://localhost:5000/api/patient-dashboard/mealplans/patient/all?user_id=${user_id}`);
            const data = await response.json();
            if (response.ok) {
                setMealplans(data.mealplans || []);
            } else {
                console.error("Error fetching mealplans:", data.error);
            }
        } catch (err) {
            console.error("Fetch failed:", err);
        }
    };

    useEffect(() => {
        fetchMealplans();
    }, []);

    // Deletes Meal Plans
    const deleteMealplan = async (meal_plan_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this meal plan?");
        if (!confirmDelete) return;
    
        try {
            const response = await fetch(`http://localhost:5000/api/patient-dashboard/mealplans/delete/${meal_plan_id}`, {
                method: 'DELETE'
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Meal plan deleted successfully.");
                fetchMealplans(); // Refresh the list
            } else {
                alert("Error: " + result.error);
            }
        } catch (err) {
            console.error("Delete failed:", err);
            alert("An error occurred.");
        }
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

                    {/* Mealplan Section */}
                    <div style={{ marginTop: '2rem' }}>
                        <h3>Mealplans</h3>
                        <button className="submit-metrics-button" onClick={() => setShowMealplanModal(true)}>
                            Create Mealplan
                        </button>
                    </div>

                    {showMealplanModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h4>Enter Mealplan Info</h4>
                                <label>Title
                                    <input type="text" name="title" value={mealplanData.title} onChange={handleMealplanChange} />
                                </label>
                                <label>Description
                                    <input type="text" name="description" value={mealplanData.description} onChange={handleMealplanChange} />
                                </label>
                                <label>Instructions
                                    <input type="text" name="instructions" value={mealplanData.instructions} onChange={handleMealplanChange} />
                                </label>
                                <label>Ingredients
                                    <input type="text" name="ingredients" value={mealplanData.ingredients} onChange={handleMealplanChange} />
                                </label>
                                <label>Calories
                                    <input type="number" name="calories" value={mealplanData.calories} onChange={handleMealplanChange} />
                                </label>
                                <label>Fat
                                    <input type="number" name="fat" value={mealplanData.fat} onChange={handleMealplanChange} />
                                </label>
                                <label>Sugar
                                    <input type="number" name="sugar" value={mealplanData.sugar} onChange={handleMealplanChange} />
                                </label>
                                <label>Image
                                    <input type="file" name="image" onChange={handleMealplanChange} />
                                </label>
                                <div className="modal-actions">
                                    <button onClick={submitMealplan}>Submit</button>
                                    <button onClick={() => setShowMealplanModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                     <div style={{ marginTop: '2rem' }}>
                        <h4>Your Mealplans</h4>
                        {mealplans.length > 0 ? (
                            <div className="mealplans-wrapper">
                            {mealplans.map(plan => (
                                <div
                                key={plan.meal_plan_id}
                                className="meal-card"
                                onClick={() => openMealModal(plan)}
                                style={{ cursor: 'pointer' }}
                                >
                                {plan.image && (
                                    <img
                                    src={`data:image/jpeg;base64,${plan.image}`}
                                    alt={plan.title}
                                    className="meal-image"
                                    />
                                )}
                                <div className="meal-card-header">
                                    <h4>{plan.title}</h4>
                                </div>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <p>No mealplans yet.</p>
                        )}

                        {/* ✅ Modal */}
                        {showMealModal && selectedMeal && (
                            <div className="modal-overlay" onClick={() => setShowMealModal(false)}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                {selectedMeal.image && (
                                <img
                                    src={`data:image/jpeg;base64,${selectedMeal.image}`}
                                    alt={selectedMeal.title}
                                    className="meal-image"
                                />
                                )}
                                <h3>{selectedMeal.title}</h3>
                                <p><strong>Description:</strong> {selectedMeal.description}</p>
                                <p><strong>Ingredients:</strong> {selectedMeal.ingredients}</p>
                                <p><strong>Instructions:</strong> {selectedMeal.instructions}</p>
                                <p><strong>Calories:</strong> {selectedMeal.calories}</p>
                                <p><strong>Fat:</strong> {selectedMeal.fat}</p>
                                <p><strong>Sugar:</strong> {selectedMeal.sugar}</p>

                                <button
                                className="delete-button"
                                onClick={() => {
                                    deleteMealplan(selectedMeal.meal_plan_id);
                                    setShowMealModal(false);
                                }}
                                >
                                Delete
                                </button>
                                <button className="close-button" onClick={() => setShowMealModal(false)}>
                                Close
                                </button>
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
            );
        } else if (activeTab === "appointments") {
            if (activeChatAppointment) {
                return (
                    <div>
                        <button onClick={() => setActiveChatAppointment(null)}>
                            ← Back to Appointments
                        </button>
                        <ChatWindow
                            doctorId={activeChatAppointment.doctor_id}
                            patientId={patientDetails.patient_id}
                            appointmentId={activeChatAppointment.appointment_id}
                            isDoctor={false}
                        />
                    </div>
                );
            }
            return (
                <div>
                    <h1>Appointments</h1>
                    <div>
                        <h3>Accepted Appointments</h3>
                        <div className="appointments-container">
                            {acceptedAppointments.length > 0 ? (
                                acceptedAppointments.map(app => {
                                    const apptDate = new Date(app.appointment_time);
                                    const now     = new Date();
                                    const diffMs  = apptDate - now;
                                    const isStartable = diffMs >= -30  * 60 * 1000 && diffMs <= 15 * 60 * 1000; // 0–15min

                                    return (
                                        <div key={app.appointment_id} className="appointment-card">
                                            <h5>Appointment #{app.appointment_id}</h5>
                                            <p><strong>Doctor ID:</strong> {app.doctor_id}</p>
                                            <p><strong>Date/Time:</strong> {apptDate.toLocaleString()}</p>
                                            <p><strong>Status:</strong> {app.status}</p>

                                            {isStartable && (
                                                <button
                                                    className="start-appointment-button"
                                                    onClick={() => setActiveChatAppointment(app)}
                                                >
                                                    Start Appointment
                                                </button>
                                            )}

                                            <button
                                                className="cancel-button"
                                                onClick={() => handleCancelClick(app.appointment_id)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No accepted appointments.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3>Canceled Appointments</h3>
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
                        <h3>Completed Appointments</h3>
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
        else if (activeTab === "chat-history") {
            return (
                <div>
                    <h3>Chat History</h3>
                    {patientDetails && (
                        <ChatHistory
                            patientId={patientDetails.patient_id}
                            isDoctor={false}
                        />
                    )}
                </div>
            );
        }
        else if (activeTab === "prescriptions") {
            return (
              <div>
                  <h3>Your Prescriptions</h3>
                  {prescriptions.length > 0 ? (
                    <ul className="prescription-list">
                        {prescriptions.map(p => (
                          <li key={p.prescription_id} className="prescription-card">
                              <p><strong>Drug:</strong> {p.drug_name}</p>
                              <p><strong>Dosage:</strong> {p.dosage}</p>
                              <p><strong>Instructions:</strong> {p.instructions}</p>
                              <p><strong>Requested at:</strong> {new Date(p.requested_at).toLocaleString()}</p>
                              <p><strong>Status</strong>: {p.status}</p>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p>No prescriptions.</p>
                  )}
              </div>
            );
        }
    };

    return (
        <div className={`dashboard-root ${isDark ? 'dark-mode' : ''}`}>
            <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
            {/* Top Bar */}
            <DashboardTopBar />
        
            {/* Main content with sidebar and data */}
            <div className="flex-grow flex main-container">
                {/* Sidebar */}
                <nav className="side-bar">
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
                        className={activeTab === "appointments" ? "active-tab" : ""}
                        onClick={() => setActiveTab("appointments")}
                    >
                        Appointments
                    </button>
                    </li>
                    <li>
                    <button
                        className={activeTab === "metrics" ? "active-tab" : ""}
                        onClick={() => setActiveTab("metrics")}
                    >
                        Metrics
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
                    <li>
                    <button
                        className={activeTab === "chat-history" ? "active-tab" : ""}
                        onClick={() => setActiveTab("chat-history")}
                    >
                        Chat History
                    </button>
                    </li>
                    <li>
                        <button
                          className={activeTab === "prescriptions" ? "active-tab" : ""}
                          onClick={() => setActiveTab("prescriptions")}
                        >
                            Prescriptions
                        </button>
                    </li>
                </ul>
                </nav>
        
                {/* Data Panel */}
                <main className="data-plane">
                {renderDashboardData()}
                </main>
            </div>
        
            {/* Modals */}
            {showBookingModal && (
                <BookAppointmentModal
                onBook={bookAppointment}
                onClose={() => setShowBookingModal(false)}
                />
            )}
            {showBookingPopup && (
                <div className="modal-overlay">
                <div className="modal">
                    <p>{bookingMessage}</p>
                    <button onClick={() => setShowBookingPopup(false)}>Confirm</button>
                </div>
                </div>
            )}
        
            {/* ✅ Sticky Footer at bottom */}
            <Footer />
            </div>
        </div>
      );
}

export default PatientDashboard;
