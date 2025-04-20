// Login.js
import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Assets/Logo/logo.png';
//import Navbar from '../components/Navbar'; // This is for a navbar if I knew how Michael was making his
const Login = () => {
 // This is some boiler plate for the login page

 // Backend request for Login
 const [userName, setUserName] = useState('');
 const [passWord, setPassword] = useState('');
 //
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 //for navigating to the dashboards
 const navigate = useNavigate();
 // 
 const LoginUser = async (userName, passWord) => {
    const requestData = {
      email: userName,
      password: passWord,
    };

    setLoading(true);

    try {
      // Sending POST request (I know that its weird right now, we might change type later)
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Convert the data to JSON
      });
      // close enough for now
      if (response.ok) {
        alert('Login Successful');
        const data = await response.json();
        console.log("Data:", data)
        localStorage.setItem('user', JSON.stringify(data.user));
        if(data.user.user_type === 'patient'){
          navigate('/patient');
        }
        else if(data.user.user_type === 'doctor'){
          navigate('/doctors');
        }
      } 
      else {
        const data = await response.json();
        console.log("Data but went wrong:", data)
        //alert("Data but went wrong:", data)
        setError(data.error)
        setTimeout(() => setError(""), 10000); // Hide message after 10 seconds
      }
    } 
    catch (error) {
      //setMessage('Error: ' + error.message); 
      console.log('Error: ' + error.message);
      //alert('Error: ' + error.message);
      setError('Error: ' + error.message);
      setTimeout(() => setError(""), 10000); // Hide message after 10 seconds
    }
    finally{
      setLoading(false);
    }
};

 //

  return (
    <div className="flex justify-center items-center h-screen bg-[#d8eafe]">
      <div className="w-full max-w-sm">
        {/* Logo Section FIXED */}
        <div className="absolute top-0 left-0 bg-blue-600 px-4 py-2 rounded-br-md shadow-md">
          <img src={Logo} alt="Smart Eatz Logo" className="h-10" />
        </div>
        {/* Login Form */}
        <div className="bg-transparent p-8 rounded-lg flex flex-col items-center">
            {/* Username Input */}
            <div className="mb-4 w-full">
              <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                <span className="mr-2">📷</span>
                <input
                  type="email"
                  placeholder="EMAIL"
                  className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4 w-full">
              <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                <span className="mr-2">🔒</span>
                <input
                  type="password"
                  placeholder="PASSWORD"
                  className="w-full outline-none bg-white text-gray-700 placeholder-gray-500"
                  required
                  value={passWord}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Login Button */}
            <button type="submit" className="w-full bg-white text-blue-600 font-semibold py-2 rounded-md shadow-md border border-gray-300 hover:bg-gray-100 transition" disabled={loading} onClick={() => LoginUser(userName, passWord)}>
            {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          {/* Login Error Fade in */}
          {error && <p className="mt-2 text-red-600 shadow-md animate-fadeIn">{error}</p>}  { /*Display error message that fades after a bit */}
          {/* Now Return to Landing Page */}
          {/* WAS Forgot Password Link: Forgot password? */}
          <p>
            <Link to={"/"} className="text-sm text-black mt-4 cursor-pointer hover:underline" >
              Return to Home Page
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login