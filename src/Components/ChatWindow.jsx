import { useState, useEffect } from 'react';

function ChatWindow({ doctorId, patientId, isDoctor }) {
  // Are both sides “locked in”?
  const fixedParticipants = Boolean(doctorId && patientId);

  // targetId only matters when fixed===false
  const [targetId, setTargetId] = useState('');
  const resolvedDoctorId = fixedParticipants
      ? doctorId
      : isDoctor
          ? doctorId
          : targetId;
  const resolvedPatientId = fixedParticipants
      ? patientId
      : isDoctor
          ? targetId
          : patientId;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  // Fetch the chat history
  const fetchMessages = async () => {
    if (!resolvedDoctorId || !resolvedPatientId) return;
    try {
      const res = await fetch(
          `http://localhost:5000/api/chat/history?doctor_id=${resolvedDoctorId}&patient_id=${resolvedPatientId}`
      );
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error fetching messages:', err);
    }
  };

  // Send a new message
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
      setTimeout(fetchMessages, 150);
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }
  };

  // Poll every 3s once we have both IDs
  useEffect(() => {
    if (!resolvedDoctorId || !resolvedPatientId) return;

    fetchMessages();
    const iv = setInterval(fetchMessages, 3000);
    return () => clearInterval(iv);
  }, [resolvedDoctorId, resolvedPatientId]);

  return (
      <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
        <h3>
          {fixedParticipants
              ? `Chat: ${doctorId === resolvedDoctorId ? '👨‍⚕️ Doctor' : '🧑 Patient'}`
              : isDoctor
                  ? 'Chat with Patient'
                  : 'Chat with Doctor'}
        </h3>

        {/* Only show the ID-picker when participants aren’t fixed */}
        {!fixedParticipants && (
            <div style={{ marginBottom: 10 }}>
              <label>{isDoctor ? 'Patient ID:' : 'Doctor ID:'}</label>
              <input
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder={isDoctor ? 'Enter patient ID' : 'Enter doctor ID'}
                  style={{ marginLeft: 10 }}
              />
              <button onClick={fetchMessages} style={{ marginLeft: 10 }}>
                🔄 Load
              </button>
            </div>
        )}

        {/* Message pane */}
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
              messages.map((msg, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
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

        {/* Input + send */}
        <div style={{ marginTop: 10 }}>
          <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{ width: '70%' }}
          />
          <button onClick={sendMessage} style={{ marginLeft: 10 }}>
            Send
          </button>
        </div>
      </div>
  );
}

export default ChatWindow;
