// Registration.js
import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Assets/Logo/logo.png';
//import Navbar from '../components/Navbar'; // This is for a navbar from my individual if I knew how Michael was making his
const Registration = () => {
    // This is some boiler plate for the Registration page
    // Use State Variables
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleChosen, setRoleChosen] = useState(false);
    // The text fields variables TODO
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [zipcode, setZipCode] = useState('');
    //
    const [licenseNumber, setLicenseNumber] = useState('');
    const [name, setName] = useState('');
    const [ssn, setSSN] = useState('');

    //for navigating to the landing page
    const navigate = useNavigate();
    //
    const handleRoleClick = (role) => {
        setSelectedRole(role);
        setRoleChosen(true);
        //alert(`You selected: ${role}`);
    };

    const handleRoleReset = (role) => {
      setSelectedRole(null);
      setRoleChosen(false);
      //alert(`You selected: ${role}`);
  };

    // Backend request for Registration
    // All post requests for them at the below route
    // '/api/register/patient', methods=['POST']
    // '/api/register/doctor', methods=['POST']
    // '/api/register/pharmacy', methods=['POST']
    const regPatient = async () => {
      const requestData = {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        address: address,
        phone_number: phoneNumber,
        zip_code: zipcode,
      };
  
      try {
        const response = await fetch('http://localhost:5000/api/register/patient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData), // Convert the data to JSON
        });
        // close enough for now
        if (response.ok) {
          alert('Registration Successful');
          const data = await response.json();
          console.log("Data:", data)
          navigate(-1);
        } 
        else {
          const data = await response.json();
          console.log("Data but went wrong:", data)
        }
      } catch (error) {
        //setMessage('Error: ' + error.message); 
        console.log('Error: ' + error.message);
      }
  };
  //
  const regDoctor = async () => {
    const requestData = {
      email: email,
      password: password,
      license_number: licenseNumber,
      first_name: firstName,
      last_name: lastName,
      address: address,
      phone_number: phoneNumber,
      ssn: ssn,
    };

    try {
      const response = await fetch('http://localhost:5000/api/register/doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Convert the data to JSON
      });
      // close enough for now
      if (response.ok) {
        alert('Registration Successful');
        const data = await response.json();
        console.log("Data:", data)
        navigate(-1);
      } 
      else {
        const data = await response.json();
        console.log("Data but went wrong:", data)
      }
    } catch (error) {
      //setMessage('Error: ' + error.message); 
      console.log('Error: ' + error.message);
    }
  };
  //
  const regPharmacy = async () => {
    const requestData = {
      email: email,
      password: password,
      name: name,
      address: address,
      zip_code: zipcode,
      phone_number: phoneNumber,
      license_number: licenseNumber,
    };

    try {
      // Sending POST request (I know that its weird right now, we might change type later)
      const response = await fetch('http://localhost:5000/api/register/pharmacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Convert the data to JSON
      });
      // close enough for now
      if (response.ok) {
        alert('Registration Successful');
        const data = await response.json();
        console.log("Data:", data)
        navigate(-1);
      } 
      else {
        const data = await response.json();
        console.log("Data but went wrong:", data)
      }
    } catch (error) {
      //setMessage('Error: ' + error.message); 
      console.log('Error: ' + error.message);
    }
  };
  /* The React Code Section BELOW  */
  //
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-blue-100'>
      {/* Logo Section FIXED */}
      <div className="absolute top-0 left-0 bg-blue-600 px-4 py-2 rounded-br-md shadow-md">
        <img src={Logo} alt="Smart Eatz Logo" className="h-10" />
      </div>
      {!roleChosen && (
        <div className='bg-white p-6 rounded-xl shadow-lg text-center'>
          <h2 className='text-xl font-semibold'>Please Choose Your Role</h2>
          <p className='text-gray-500 text-sm'>
            Select one of the 3 options below
          </p>
          <p className='text-gray-400 text-xs'>
            (Doctors and Pharmacists will require verification)
          </p>

          <div className='flex justify-center mt-6 space-x-6'>
            {[
              { role: 'Patient', icon: '🧑‍⚕️', color: 'blue' },
              { role: 'Doctor', icon: '👨‍⚕️', color: 'red' },
              { role: 'Pharmacist', icon: '💊', color: 'green' },
            ].map(({ role, icon, color }) => (
              <button
                key={role}
                onClick={() => handleRoleClick(role)}
                className={`w-32 h-32 flex flex-col items-center justify-center p-4 rounded-lg shadow-md border-2 transition ${
                  selectedRole === role
                    ? `border-${color}-500 shadow-lg`
                    : 'border-gray-300'
                }`}
              >
                <div className='text-4xl'>{icon}</div>
                <p className='mt-2 font-medium'>{role}</p>
              </button>
            ))}
          </div>
          {/* Now Return to Landing Page */}
          <p>
            <Link to={"/"} className="text-sm text-black mt-4 cursor-pointer hover:underline" >
              Return to Home Page
            </Link>
          </p>
        </div>
      )}
      {roleChosen && (<div className='bg-white p-6 rounded-xl shadow-lg text-center'>
        {selectedRole === "Patient" && (
            <div className="bg-transparent p-8 rounded-lg flex flex-col items-center">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Patient Registration</h1>
              {/* Name */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="FIRST NAME"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="LAST NAME"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              {/* Email */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                      type="text"
                      placeholder="EMAIL"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                      type="text"
                      placeholder="PASSWORD"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="ADDRESS"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {/* Password */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="PASSWORD"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {/* */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="ADDRESS"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="ZIP CODE"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={zipcode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>
              {/* */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="PHONE NUMBER"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              {/* 
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  
                </div>
              </div>
              */}
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition" onClick={() => regPatient()}>
                REGISTER
              </button>
              <div className="mt-4 mb-4 w-full">
              <button className="w-full bg-gray-200 text-blue-600 font-semibold py-2 rounded hover:bg-gray-300 transition" onClick={handleRoleReset}>
                Go Back
              </button>
              </div>
            </div>
        )}
        {selectedRole === "Doctor" && (
            <div className="bg-transparent p-8 rounded-lg flex flex-col items-center">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Doctor Registration</h1>
              <div className="mb-4 w-full">
                
                {/* */}
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="FIRST NAME"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="LAST NAME"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              {/* Email */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                      type="text"
                      placeholder="EMAIL"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                      type="text"
                      placeholder="PASSWORD"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="ADDRESS"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {/* Password */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="PASSWORD"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {/* */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="ADDRESS"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="ZIP CODE"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={zipcode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>
              {/* */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="PHONE NUMBER"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              {/* 
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  
                </div>
              </div>
              */}
              {/* */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="LICENCE NUMBER"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
              </div>
              {/* */}
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="SSN"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                    required
                    value={ssn}
                    onChange={(e) => setSSN(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition" onClick={() => regDoctor()}>
                REGISTER
              </button>
              <div className="mt-4 mb-4 w-full">
              <button className="w-full bg-gray-200 text-blue-600 font-semibold py-2 rounded hover:bg-gray-300 transition" onClick={handleRoleReset}>
                Go Back
              </button>
              </div>
            </div>
        )}
        {selectedRole === "Pharmacist" && (
            <div className="bg-transparent p-8 rounded-lg flex flex-col items-center">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Pharmacy Registration</h1>
                <div className="mb-4 w-full">
                  {/* Name */}
                  <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                    <input
                      type="text"
                      placeholder="NAME"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="mb-4 w-full">
                  <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                    <input
                      type="email"
                      placeholder="EMAIL"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {/* Password */}
                <div className="mb-4 w-full">
                  <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                    <input
                      type="text"
                      placeholder="PASSWORD"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                {/* */}
                <div className="mb-4 w-full">
                  <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                    <input
                      type="text"
                      placeholder="ADDRESS"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="ZIP CODE"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      required
                      value={zipcode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                </div>
                {/* */}
                <div className="mb-4 w-full">
                  <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                    <input
                      type="text"
                      placeholder="PHONE NUMBER"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
              </div>
                {/* 
                <div className="mb-4 w-full">
                  <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  </div>
                </div>*/}
                {/* */}
                <div className="mb-4 w-full">
                  <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                    <input
                      type="text"
                      placeholder="LISCENCE NUMBER"
                      className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                  </div>
                </div>
                <button type='submit' className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition" onClick={() => regPharmacy()}>
                  REGISTER
                </button>
              <div className="mt-4 mb-4 w-full">
              <button className="w-full bg-gray-200 text-blue-600 font-semibold py-2 rounded hover:bg-gray-300 transition" onClick={handleRoleReset}>
                Go Back
              </button>
              </div>
            </div>
        )}
      </div>
      )}
      <footer className='absolute bottom-0 w-full bg-blue-600 text-white text-center p-2'>
        Smart Eatz &copy; 2025 All Rights Reserved
      </footer>
    </div>
  )
}

export default Registration