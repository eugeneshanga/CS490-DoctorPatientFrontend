import React, { useEffect, useState } from 'react';
import './doctorDashboard.css';
import Logo from '../../Assets/Logo/logo.png';
import ChatWindow from '../../Components/ChatWindow';
import {useNavigate} from "react-router-dom";
import ChatHistory from "../../Components/ChatHistory";

function DoctorDashboard() {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const user_id = user ? user.user_id : null;
    const [appointments, setAppointments] = useState([]);
    const [payments, setPayments] = useState([]);
    const [acceptedAppointments, setAcceptedAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);
    const [completedAppointments, setCompletedAppointments] = useState([]);
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "meal-plans", or "payments"
    const [updateMessage, setUpdateMessage] = useState('');
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  
    // inside DoctorDashboard()
    const [activeChatAppointment, setActiveChatAppointment] = useState(null);

    const navigate = useNavigate();

    // Meal plan
    const [showMealplanModal, setShowMealplanModal] = useState(false);

    const [officialMealplans, setOfficialMealplans] = useState([]);

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

    const handleMealplanChange = (e) => {
        const { name, value, files } = e.target;
        setMealplanData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const fetchOfficialMealplans = async () => {
        const userId = 1; // or get from localStorage
        try {
            const response = await fetch(`http://localhost:5000/api/doctor-dashboard/official/all?user_id=${userId}`);
            const data = await response.json();
            if (response.ok) {
                setOfficialMealplans(data.mealplans || []);
            } else {
                console.error("Failed to fetch:", data.error);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const submitOfficialMealplan = async () => {
        const userId = 1; // or pull from localStorage if dynamic
        if (!mealplanData.title.trim()) {
            alert("Title is required!");
            return;
        }
    
        const formData = new FormData();
        formData.append("user_id", userId);
        for (let key in mealplanData) {
            if (mealplanData[key]) {
                formData.append(key, mealplanData[key]);
            }
        }
    
        // Optional: Debug what’s being sent
        console.log("Submitting mealplan to: http://localhost:5000/api/doctor-dashboard/official/create");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        try {
            const response = await fetch("http://localhost:5000/api/doctor-dashboard/official/create", {
                method: "POST",
                body: formData
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Official mealplan created!");
                setShowMealplanModal(false);
                fetchOfficialMealplans(); // Refresh list
            } else {
                alert("Error: " + result.error);
            }
        } catch (err) {
            console.error("Submission failed:", err);
            alert("An error occurred while creating the mealplan.");
        }
    };
    // Fetch Mealplan
    useEffect(() => {
        fetchOfficialMealplans();
    }, []);

    // Function to fetch appointments
    const fetchAppointments = () => {
        fetch(`http://localhost:5000/api/doctor-dashboard/appointments?user_id=${user_id}`)
            .then(response => response.json())
            .then(data => setAppointments(data))
            .catch(error => console.error('Error fetching appointments:', error));
    };

    // Fetch appointments when activeTab changes to "dashboard"
    useEffect(() => {
        if (activeTab === "dashboard") {
            fetch(`http://localhost:5000/api/doctor-dashboard/appointments?user_id=${user_id}`)
                .then(response => response.json())
                .then(data => setAppointments(data)) // data is a JSON array of appointments
                .catch(error => console.error('Error fetching appointments:', error));
        }
    }, [user_id, activeTab]);

    // Fetch history appointments (accepted, canceled, completed) when activeTab is "appointments"
    useEffect(() => {
        if (activeTab === "appointments") {
            Promise.all([
                fetch(`http://localhost:5000/api/doctor-dashboard/appointments/accepted?user_id=${user_id}`)
                    .then(response => response.json()),
                fetch(`http://localhost:5000/api/doctor-dashboard/appointments/canceled?user_id=${user_id}`)
                    .then(response => response.json()),
                fetch(`http://localhost:5000/api/doctor-dashboard/appointments/completed?user_id=${user_id}`)
                    .then(response => response.json())
            ])
                .then(([acceptedData, canceledData, completedData]) => {
                    setAcceptedAppointments(acceptedData);
                    setCanceledAppointments(canceledData);
                    setCompletedAppointments(completedData);
                })
                .catch(error => console.error('Error fetching history appointments:', error));
        }
    }, [user_id, activeTab]);

    // Fetch payments when payments tab is active
    useEffect(() => {
        if (activeTab === "payments") {
            fetch(`http://localhost:5000/api/doctor-dashboard/payments?user_id=${user_id}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.payments) {
                        setPayments(data.payments);
                    } else {
                        setPayments([]);
                    }
                })
                .catch(error => console.error('Error fetching payments:', error));
        }
    }, [user_id, activeTab]);

    // Fetch doctor details for the top bar
    useEffect(() => {
        fetch(`http://localhost:5000/api/doctor-dashboard/details?user_id=${user_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.doctor) {
                    setDoctorDetails(data.doctor);
                }
            })
            .catch(error => console.error('Error fetching doctor details:', error));
    }, [user_id]);

    const handleEndAppointment = async () => {
        const apptId = activeChatAppointment.appointment_id;
        try {
            // 1) Mark completed in DB
            await fetch('http://localhost:5000/api/doctor-dashboard/appointments/complete', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointment_id: apptId }),
            });

            // 2) Notify patient via chat
            await fetch('http://localhost:5000/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctor_id: doctorDetails.doctor_id,
                    patient_id: activeChatAppointment.patient_id,
                    sender_type: 'doctor',
                    message: 'The appointment has ended.',
                }),
            });

            // 3) Redirect to post‑appointment placeholder
            navigate('/post-appointment');
        } catch (err) {
            console.error('❌ Error ending appointment:', err);
            alert('Could not end appointment. Please try again.');
        }
    };

    // Function to respond to an appointment
    const respondAppointment = (appointment_id, accepted) => {
        fetch('http://localhost:5000/api/doctor-dashboard/appointments/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user_id,
                appointment_id: appointment_id,
                accepted: accepted
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setUpdateMessage(data.message);
                    setShowUpdatePopup(true);
                } else if (data.error) {
                    alert("Error: " + data.error);
                }
            })
            .catch(error => console.error('Error responding to appointment:', error));
    };

    // Render content based on the active tab.
    const renderDashboardData = () => {
        if (activeTab === "dashboard") {
            return (
                <div>
                    <h3>Requested Appointments</h3>
                    <div className="appointments-container">
                        {appointments.map(app => (
                            <div key={app.appointment_id} className="appointment-card">
                                <h4>Appointment #{app.appointment_id}</h4>
                                <p><strong>Patient ID:</strong> {app.patient_id}</p>
                                <p><strong>Date/Time:</strong> {app.appointment_time}</p>
                                <p><strong>Status:</strong> {app.status}</p>
                                <div className="response-buttons">
                                    <button
                                        className="accept-btn"
                                        onClick={() => respondAppointment(app.appointment_id, true)}
                                    >
                                        &#10003;
                                    </button>
                                    <button
                                        className="reject-btn"
                                        onClick={() => respondAppointment(app.appointment_id, false)}
                                    >
                                        &#10005;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else if (activeTab === "appointments") {
            if (activeTab === "appointments" && activeChatAppointment) {
                return (
                    <div>
                        <button onClick={() => setActiveChatAppointment(null)}>
                            ← Back to Appointments
                        </button>
                        <button
                            className="end-appointment-button"
                            onClick={handleEndAppointment}
                        >
                            End Appointment
                        </button>

                        <ChatWindow
                            doctorId={doctorDetails.doctor_id}
                            patientId={activeChatAppointment.patient_id}
                            isDoctor={true}
                        />
                    </div>
                );
            }
            return (
                <div>
                    <h3>Appointment History</h3>

                    <div>
                        <h4>Accepted Appointments</h4>
                        <div className="appointments-container">
                            {acceptedAppointments.length > 0 ? (
                                acceptedAppointments.map(app => {
                                    const apptDate    = new Date(app.appointment_time);
                                    const now         = new Date();
                                    const diffMs      = apptDate - now;
                                    const isStartable = diffMs >= -30  * 60 * 1000 && diffMs <= 15 * 60 * 1000;

                                    return (
                                        <div key={app.appointment_id} className="appointment-card">
                                            <h5>Appointment #{app.appointment_id}</h5>
                                            <p><strong>Patient ID:</strong> {app.patient_id}</p>
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
                                        </div>
                                    );
                                })
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
                                        <p><strong>Patient ID:</strong> {app.patient_id}</p>
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
                                        <p><strong>Patient ID:</strong> {app.patient_id}</p>
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
        } else if (activeTab === "meal-plans") {
            return (
                <div>
            <h3>Official Meal Plans</h3>
            <button className="submit-metrics-button" onClick={() => setShowMealplanModal(true)}>
                Create Official Mealplan
            </button>

            {/* Mealplan Modal */}
            {showMealplanModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h4>Enter Official Mealplan Info</h4>
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
                            <button onClick={submitOfficialMealplan}>Submit</button>
                            <button onClick={() => setShowMealplanModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Display List of Mealplans */}
            <div style={{ marginTop: '2rem' }}>
                {officialMealplans.length > 0 ? (
                    officialMealplans.map(plan => (
                        <div key={plan.meal_plan_id} className="doctor-card">
                            <h4>{plan.title}</h4>
                            <p><strong>Description:</strong> {plan.description}</p>
                            <p><strong>Calories:</strong> {plan.calories}</p>
                            <p><strong>Fat:</strong> {plan.fat}</p>
                            <p><strong>Sugar:</strong> {plan.sugar}</p>
                            <p><strong>Ingredients:</strong> {plan.ingredients}</p>
                            <p><strong>Instructions:</strong> {plan.instructions}</p>
                        </div>
                    ))
                ) : (
                    <p>No official mealplans yet.</p>
                )}
            </div>
        </div>
    );
        } else if (activeTab === "payments") {
            return (
                <div>
                    <h3>Payments</h3>
                    <div className="payments-container">
                        {payments.map(payment => (
                            <div key={payment.payment_id} className="payment-card">
                                <h4>Payment #{payment.payment_id}</h4>
                                <p>
                                    <strong>Patient:</strong> {payment.first_name} {payment.last_name}
                                </p>
                                <p>
                                    <strong>Amount:</strong> ${payment.amount}
                                </p>
                                <p>
                                    <strong>Fulfilled:</strong> {payment.is_fulfilled ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Date:</strong> {payment.payment_date}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        else if (activeTab === "chat-history") {
            return (
                <div>
                    <h3>Chat History</h3>
                    {doctorDetails && (
                        <ChatHistory
                            doctorId={doctorDetails.doctor_id}
                            isDoctor={true}
                        />
                    )}
                </div>
            );
        }
    };

    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
            {/* Top Bar */}
            <header className="top-bar">
                <img src={Logo} alt="Smart Eatz Logo" style={{ height: '50px' }} />
                <h2>Doctor Dashboard</h2>
                <div className="doctor-details">
                    {doctorDetails ? (
                        <p style={{ margin: 0 }}>
                            Dr. {doctorDetails.first_name} {doctorDetails.last_name}<br />
                            DoctorID: {doctorDetails.doctor_id}
                        </p>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </header>

            {/* Main container with sidebar and data plane */}
            <div style={{ display: 'flex' }}>
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
                            <button onClick={() => setActiveTab("meal-plans")}>Official Meal Plans</button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab("payments")}>Payments</button>
                        </li>
                        <li><button onClick={() => setActiveTab("chat-history")}>Chat History</button></li>

                    </ul>
                </nav>

                {/* Data Plane */}
                <main style={{ flex: 1, padding: '1rem' }}>
                    {renderDashboardData()}
                </main>
            </div>
            {/* Update Popup Modal */}
            {showUpdatePopup && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>{updateMessage}</p>
                        <button onClick={() => {
                            setShowUpdatePopup(false);
                            // Refresh the appointments so the updated one is removed from scheduled list.
                            fetchAppointments();
                        }}>
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorDashboard;
