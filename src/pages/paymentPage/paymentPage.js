import React from "react";
import { useState, useEffect}  from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentStyles } from './paymentStyles';

const PaymentPage = () => {
  //for navigating to the landing page
  const navigate = useNavigate();
  //
  //const [error, setError] = useState('');
  //
  const { state } = useLocation();
  const txnId = state?.transaction_id;
  const txnType = state?.transaction_type;
  //
  const [payment, setPayment] = useState(null);
  //
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [exdDate, setExDate] = useState(null);
  const [cvv, setCVV] = useState(null);

  useEffect(() => {
    //const getRealTransaction = async () => {
      console.log("TEST!!!!!!!!!!!")
      if(txnType === "pharmacy"){
        fetch(`http://localhost:5000/api/payment/transaction/payments/pharmacy/${txnId}`)
            .then(response => response.json())
            .then(data => {
              setPayment(data);
              console.log(data);
              console.log(payment)
            })
            .catch(error => console.error('Error fetching patient details:', error));
      }
      else{
        fetch(`http://localhost:5000/api/payment/transaction/payments/doctor/${txnId}`)
            .then(response => response.json())
            .then(data => {
              setPayment(data);
              console.log(data);
              console.log(payment)
            })
            .catch(error => console.error('Error fetching patient details:', error));
      }
  }, []); // END OF USE EFFECT

  function is_numeric(str){
    return /^\d+$/.test(str);
  }

  const isValidExpiry = (value) => {
    const [month, year] = value.split("/");
  
    if (!month || !year || month.length !== 2 || year.length !== 2) return false;
  
    const mm = parseInt(month, 10);
    const yy = parseInt("20" + year, 10); // convert to 4-digit year
  
    if (isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12) return false;
  
    const now = new Date();
    const inputDate = new Date(yy, mm - 1); // JS months are 0-based
  
    return inputDate >= new Date(now.getFullYear(), now.getMonth());
  };

  const handleExDateChange = (e) => {
    let value = e.target.value;

    // Remove all non-digit characters
    value = value.replace(/\D/g, "");

    // Format as MM/YY
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    // Limit to 5 characters
    setExDate(value.slice(0, 5));
  };

  const validInputs = () =>{
    // this code is about to look atrocious
    if(isValidExpiry(exdDate))
      if(is_numeric(cardNumber))
        if(is_numeric(cvv))
          return true;
    return false;
  }

  const fulfillPayment = async (payment_id, requestedData) => {
    if(txnType === "pharmacy"){
      try {
        // Debugging logs to check input values
        if (!payment_id) 
          throw new Error('Invalid id');
        if (!requestedData) 
          throw new Error('Invalid updatedData');
  
        const response = await fetch(`http://localhost:5000/api/payment/transaction/payments/pharmacy/${payment_id}`, {
          method: 'PATCH', // Use PATCH to update
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestedData),
        });
        if (!response.ok) {
          throw new Error(`Failed to mak payment: ${response.statusText}`);
        }
        const data = await response.json();
        // Debugging response data
        console.log('Response data:', data);
        if (data.message) {
          console.log(data.message); // Success message
        } 
        else {
          console.error('No message in response data.');
        }
      } 
      catch (error) {
        console.error('Error making payment:', error);
      }
    }
    else{
      try {
        // Debugging logs to check input values
        if (!payment_id) 
          throw new Error('Invalid id');
        if (!requestedData) 
          throw new Error('Invalid updatedData');
  
        const response = await fetch(`http://localhost:5000/api/payment/transaction/payments/doctor/${payment_id}`, {
          method: 'PATCH', // Use PATCH to update
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestedData),
        });
        if (!response.ok) {
          throw new Error(`Failed to make payment: ${response.statusText}`);
        }
        const data = await response.json();
        // Debugging response data
        console.log('Response data:', data);
        if (data.message) {
          console.log(data.message); // Success message
        } 
        else {
          console.error('No message in response data.');
        }
      } 
      catch (error) {
        console.error('Error making payment:', error);
      }
    }
  }; // END OF UPDATE

  const attemptPayment = () =>{
    if(validInputs){
      const updatedData = {
          cardName,
          cardNumber,
          exdDate,
          cvv
      };
      fulfillPayment(txnId, updatedData)
    }
    else{
      console.log("NOT VALID PAYMENT ATTEMPT!!!")
    }
  }
  
  const returnToLastPlace = () => {
    //console.log("TEST ID", txnId)
    //console.log("TEST TYPE", txnType)
    //console.log(payment.amount)
    navigate(-1);
  };
  // className="min-h-screen bg-[#d8eafe] flex items-center justify-center p-4"
  //
  if (!payment) {
    return <div className="flex justify-center items-center h-screen text-gray-400 text-lg">Loading...</div>;
  }

  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center px-4 py-3 bg-white border rounded-xl shadow-sm hover:shadow-md transition duration-200">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-base font-semibold text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className={paymentStyles.background}>
      {/* */}
      <div className={paymentStyles.card}>
      <h2 className={paymentStyles.h2}>
        Purchase Details
      </h2>
      {txnType === "pharmacy" ? (
        <div className="space-y-4 text-gray-700">
          <DetailItem label="Pharmacy" value={payment.pharmacy_name} />
          <DetailItem label="Amount" value={`$${payment.amount}`} />
          <DetailItem label="Date Charged" value={new Date(payment.payment_date).toLocaleString()} />
        </div>
      ) : (
        <div className="space-y-4 text-gray-700">
        <DetailItem label="Doctor" value={payment.doctor_first_name + " " + payment.doctor_last_name} />
        <DetailItem label="Amount" value={`$${payment.amount}`} />
        <DetailItem label="Date Charged" value={new Date(payment.payment_date).toLocaleString()} />
      </div>
      )}

      </div>
      {/* */}
      <div className={paymentStyles.card}>
        <h2 className={paymentStyles.h2}>
          Enter Your Payment Details
        </h2>
        <div className={paymentStyles.svgimg}>
          {/* I could have tried to store the SVG locally but I don't care that much */}
          <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" 
          alt="Visa Logo" 
          className="h-6"
          />
        </div>

        <form className="space-y-4">
          <div>
            <label className={paymentStyles.label}>
              CARDHOLDER NAME
            </label>
            <input
              type="text"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className={paymentStyles.inputone}
            />
          </div>

          <div>
            <label className={paymentStyles.label}>
              CARD NUMBER
            </label>
            <div className="flex items-center border-b border-gray-400">
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className={paymentStyles.inputtwo}
              />
              <span className="text-xl text-gray-500">→</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className={paymentStyles.label}>
                EXPIRATION DATE (MM/YY)
              </label>
              <input
                type="text"
                required
                value={exdDate}
                onChange={handleExDateChange}
                className={paymentStyles.inputone}
              />
            </div>
            <div className="flex-1">
              <label className={paymentStyles.label}>
                CVV
              </label>
              <div className="flex items-center border-b border-gray-400">
                <input
                  type="text"
                  required
                  value={cvv}
                  onChange={(e) => setCVV(e.target.value)}
                  className={paymentStyles.inputtwo}
                />
                <span className="text-gray-400 ml-1">?</span>
              </div>
            </div>
          </div>
          {/* Saving payment details checkmark */}
          {/* I'm just going to remove it for now while I just try to get this done
          <div className="flex items-center space-x-2 mt-4">
            <input type="checkbox" id="save" className="accent-black" />
            <label htmlFor="save" className="text-sm text-gray-700">
              Save my details for future payments
            </label>
          </div>
          */}
          <button
            type="submit"
            className={paymentStyles.buttonsubmit}
            onClick={attemptPayment}
          >
            Pay Now
          </button>
        </form>
        <button className={paymentStyles.buttonleave} onClick={returnToLastPlace}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default PaymentPage