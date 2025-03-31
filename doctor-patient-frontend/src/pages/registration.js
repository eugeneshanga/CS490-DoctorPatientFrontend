// Registration.js
import React from 'react'
import { useState } from "react";
//import Navbar from '../components/Navbar'; // This is for a navbar from my individual if I knew how Michael was making his
const Registration = () => {
    // This is some boiler plate for the Registration page
    // Use State Variables
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleChosen, setRoleChosen] = useState(false);
    // The text fields variables TODO

    //

    const handleRoleClick = (role) => {
        setSelectedRole(role);
        setRoleChosen(true);
        //alert(`You selected: ${role}`);
    };

    // Backend request for Registration
    // All post requests for them at the below route
    // '/api/register/patient', methods=['POST']
    // '/api/register/doctor', methods=['POST']
    // '/api/register/pharmacy', methods=['POST']


    // 

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-blue-100'>
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
                className={`p-4 rounded-lg shadow-md border-2 transition ${
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
        </div>
      )}
      {roleChosen && (<div className='bg-white p-6 rounded-xl shadow-lg text-center'>
        {selectedRole === "Patient" && (
            <div className="bg-transparent p-8 rounded-lg flex flex-col items-center">
              <div className="mb-4 w-full">
                <h1>Patient Reg</h1>
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="FIRST NAME"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="LAST NAME"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="ADDRESS"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="PHONE NUMBER"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="ZIP CODE"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-md shadow-md border border-gray-300 hover:bg-gray-100 transition">
                REGISTER
              </button>
            </div>
        )}
        {selectedRole === "Doctor" && (
            <div className="bg-transparent p-8 rounded-lg flex flex-col items-center">
              <div className="mb-4 w-full">
                <h1>DOCTOR Reg</h1>
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="FIRST NAME"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="LAST NAME"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="ADDRESS"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="PHONE NUMBER"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="ZIP CODE"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="LISCENCE NUMBER"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="SSN"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-md shadow-md border border-gray-300 hover:bg-gray-100 transition">
                REGISTER
              </button>
            </div>
        )}
        {selectedRole === "Pharmacist" && (
            <div className="bg-transparent p-8 rounded-lg flex flex-col items-center">
              <div className="mb-4 w-full">
                <h1>PHARMA Reg</h1>
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="NAME"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="ADDRESS"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="PHONE NUMBER"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="ZIP CODE"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                  <input
                    type="text"
                    placeholder="LISCENCE NUMBER"
                    className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>
              <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-md shadow-md border border-gray-300 hover:bg-gray-100 transition">
                REGISTER
              </button>
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