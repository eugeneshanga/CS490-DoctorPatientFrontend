// src/pages/postAppointment/PostAppointmentPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostAppointmentPage() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Post‑Appointment Summary</h2>
            <p>This is where you’ll add follow‑up actions, notes, or billing.</p>
            <button onClick={() => navigate('/doctors')}>
                Go Back To Dashboard
            </button>
        </div>
    );
}
