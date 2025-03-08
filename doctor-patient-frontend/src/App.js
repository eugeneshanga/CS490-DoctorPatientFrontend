import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [doctors, setDoctors] = useState([]);

  
  useEffect(() => {
    // Call the Flask API
    fetch('http://localhost:5000/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Error loading message');
      });
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/doctors')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setDoctors(data);

      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{message}</h1>
      <h1>Doctors List</h1>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <ul>
          {doctors.map(doctor => (
            <li key={doctor.doctor_id}>
              {doctor.first_name} {doctor.last_name} - {doctor.address}
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
}

export default App;
