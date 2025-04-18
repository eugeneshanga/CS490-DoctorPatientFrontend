import { useState, useEffect } from 'react';

function ChatWindow({ doctorId, patientId }) {
  const [targetId, setTargetId] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const isDoctor = !!doctorId;

  const resolvedDoctorId = isDoctor ? doctorId : targetId;
  const resolvedPatientId = isDoctor ? targetId : patientId;

  // loading the message
  const fetchMessages = async () => {
    if (!resolvedDoctorId || !resolvedPatientId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/chat/history?doctor_id=${resolvedDoctorId}&patient_id=${resolvedPatientId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.warn("⚠️ Unexpected response:", data);
        setMessages([]);
      }
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    }
  };

  // send message
  const sendMessage = async () => {
    if (!input.trim() || !resolvedDoctorId || !resolvedPatientId) return;

    try {
      await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: resolvedDoctorId,
          patient_id: resolvedPatientId,
          sender_type: isDoctor ? 'doctor' : 'patient',
          message: input.trim(),
        }),
      });

      setInput('');
      setTimeout(fetchMessages, 150); //wait for teh backend to refresh
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  // every 3 second refresh
  useEffect(() => {
    if (!targetId && !isDoctor) return; // patient must has number doctorId
    if (!resolvedDoctorId || !resolvedPatientId) return;

    fetchMessages(); // first time loading
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [targetId, patientId, doctorId]);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
      <h3>{isDoctor ? 'Chat with Patient' : 'Chat with Doctor'}</h3>

      <div style={{ marginBottom: 10 }}>
        <label>{isDoctor ? 'Patient ID:' : 'Doctor ID:'}</label>
        <input
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          placeholder={isDoctor ? 'Enter patient ID' : 'Enter doctor ID'}
          style={{ marginLeft: 10 }}
        />
        <button onClick={fetchMessages} style={{ marginLeft: 10 }}>🔄 Load</button>
      </div>

      <div style={{
        height: 200,
        overflowY: 'scroll',
        border: '1px solid #eee',
        padding: 10,
        backgroundColor: '#f9f9f9'
      }}>
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <strong>{msg.sender_type === 'doctor' ? '👨‍⚕️ Doctor' : '🧑 Patient'}:</strong> {msg.message}
              <div style={{ fontSize: '0.8em', color: '#888' }}>{new Date(msg.sent_at).toLocaleString()}</div>
            </div>
          ))
        ) : (
          <p style={{ color: '#888' }}>No messages yet.</p>
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '70%' }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 10 }}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
