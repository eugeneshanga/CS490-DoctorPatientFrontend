import { useState, useEffect } from 'react';

export default function ChatHistory({ doctorId, patientId, isDoctor }) {
    const fixed = Boolean(doctorId && patientId);
    const [targetId, setTargetId] = useState('');
    const [messages, setMessages] = useState([]);

    const resolvedDoctorId  = fixed
        ? doctorId
        : isDoctor
            ? doctorId
            : targetId;
    const resolvedPatientId = fixed
        ? patientId
        : isDoctor
            ? targetId
            : patientId;

    const loadHistory = async () => {
        if (!resolvedDoctorId || !resolvedPatientId) return;
        try {
            const res = await fetch(
                `http://localhost:5000/api/chat/history?doctor_id=${resolvedDoctorId}&patient_id=${resolvedPatientId}`
            );
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Error loading chat history:', err);
        }
    };

    // auto-load if both IDs are fixed
    useEffect(() => {
        if (fixed) loadHistory();
    }, [fixed, doctorId, patientId]);

    return (
        <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
            <h3>Chat History</h3>

            {/* If you still need to pick the other side, show Load UI */}
            {!fixed && (
                <div style={{ marginBottom: 10 }}>
                    <label>{isDoctor ? 'Patient ID:' : 'Doctor ID:'}</label>
                    <input
                        value={targetId}
                        onChange={e => setTargetId(e.target.value)}
                        placeholder={isDoctor ? 'Enter patient ID' : 'Enter doctor ID'}
                        style={{ marginLeft: 10 }}
                    />
                    <button onClick={loadHistory} style={{ marginLeft: 10 }}>
                        🔄 Load
                    </button>
                </div>
            )}

            {/* History pane */}
            <div
                style={{
                    height: 200,
                    overflowY: 'scroll',
                    border: '1px solid #eee',
                    padding: 10,
                    backgroundColor: '#f9f9f9',
                }}
            >
                {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                        <div key={idx} style={{ marginBottom: 8 }}>
                            <strong>
                                {msg.sender_type === 'doctor' ? '👨‍⚕️ Doctor' : '🧑 Patient'}:
                            </strong>{' '}
                            {msg.message}
                            <div style={{ fontSize: '0.8em', color: '#888' }}>
                                {new Date(msg.sent_at).toLocaleString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#888' }}>No messages yet.</p>
                )}
            </div>
        </div>
    );
}
