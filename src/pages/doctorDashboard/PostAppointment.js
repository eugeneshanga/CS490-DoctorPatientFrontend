import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PostAppointment.css';

export default function PostAppointmentPage() {
    const navigate = useNavigate();
    const { appointment_id, doctor_id, patient_id } = useLocation().state || {};

    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [drugs, setDrugs] = useState([]);
    const [selectedDrug, setSelectedDrug] = useState('');
    const [dosage, setDosage] = useState('');
    const [instructions, setInstructions] = useState('');
    const [mealPlan, setMealPlan] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Load the five weight-loss drugs
    useEffect(() => {
        fetch('http://localhost:5001/api/prescriptions/drugs')
          .then(res => res.json())
          .then(setDrugs)
          .catch(err => console.error('Error loading drugs:', err));
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        // 1) Create payment
        try {
            const payRes = await fetch(
              'http://localhost:5000/api/doctor-dashboard/payments/create',
              {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      doctor_id,
                      patient_id,
                      appointment_id,
                      amount: parseFloat(amount),
                  }),
              }
            );
            const payData = await payRes.json();
            if (!payRes.ok) {
                setError(payData.error || 'Failed to create payment.');
                setSubmitting(false);
                return;
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('An unexpected error occurred creating payment.');
            setSubmitting(false);
            return;
        }

        // 2) Request prescription
        try {
            const presRes = await fetch(
              'http://localhost:5001/api/prescriptions/request',
              {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      doctor_id,
                      patient_id,
                      drug_id: parseInt(selectedDrug, 10),
                      dosage,
                      instructions,
                  }),
              }
            );
            const presData = await presRes.json();
            if (!presRes.ok) {
                setError(presData.error || 'Failed to request prescription.');
                setSubmitting(false);
                return;
            }
        } catch (err) {
            console.error('Prescription error:', err);
            setError('An unexpected error occurred requesting prescription.');
            setSubmitting(false);
            return;
        }

        // 3) Confirmation & redirect
        const leave = window.confirm(
          'All done! Appointment summary & prescription submitted.\n\nOK to return to your dashboard?'
        );
        if (leave) {
            navigate('/doctors');
        } else {
            setSubmitting(false);
        }
    };

    return (
        <div className="post-page">
            <div className="post-card">
                <h2 className="card-title">Post‑Appointment Summary</h2>

                <div className="appointment-info">
                    <p><strong>Appointment #:</strong> {appointment_id}</p>
                    <p><strong>Doctor ID:</strong> {doctor_id}</p>
                    <p><strong>Patient ID:</strong> {patient_id}</p>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <div className="section">
                        <h3 className="section-title">Create Payment</h3>
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="section">
                        <h3 className="section-title">Notes</h3>
                        <textarea
                            rows={4}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Enter any follow‑up notes..."
                            className="input"
                        />
                    </div>

                    <div className="section">
                        <h3 className="section-title">Prescribe Drug</h3>
                        <div className="form-group">
                            <label>Drug</label>
                            <select
                              value={selectedDrug}
                              onChange={e => setSelectedDrug(e.target.value)}
                              required
                              className="input"
                            >
                                <option value="">— Select a drug —</option>
                                {drugs.map(drug => (
                                  <option key={drug.drug_id} value={drug.drug_id}>
                                      {drug.name}
                                  </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Dosage</label>
                            <input
                              type="text"
                              value={dosage}
                              onChange={e => setDosage(e.target.value)}
                              placeholder="e.g. 500mg"
                              required
                              className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Instructions</label>
                            <textarea
                              rows={2}
                              value={instructions}
                              onChange={e => setInstructions(e.target.value)}
                              placeholder="e.g. Take twice daily"
                              className="input"
                            />
                        </div>
                    </div>

                    <div className="section">
                        <h3 className="section-title">Assign Meal Plan</h3>
                        <input
                            type="text"
                            value={mealPlan}
                            onChange={e => setMealPlan(e.target.value)}
                            placeholder="e.g. Low‑carb diet plan ID"
                            className="input"
                        />
                    </div>

                    {error && <p className="message" style={{ color: '#b91c1c' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="button button-submit"
                    >
                        {submitting ? 'Finishing...' : 'Finish Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
