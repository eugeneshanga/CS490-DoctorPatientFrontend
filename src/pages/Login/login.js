// Login.js
import Footer from '../../Components/Footer/Footer';
import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../Assets/Logo/logo.png';
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
      const response = await fetch(`${window.API_BASE}/api/auth/login`, {
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
        //console.log("Data:", data)
        localStorage.setItem('user', JSON.stringify(data.user));
        if(data.user.user_type === 'patient'){
          navigate('/patient');
        }
        else if(data.user.user_type === 'doctor'){
          navigate('/doctors');
        }
        else if(data.user.user_type === 'pharmacy') {
          navigate('/pharmacy')
        }
      } 
      else {
        const data = await response.json();
        //console.log("Data but went wrong:", data)
        //alert("Data but went wrong:", data)
        setError(data.error)
        setTimeout(() => setError(""), 10000); // Hide message after 10 seconds
      }
    } 
    catch (error) {
      //setMessage('Error: ' + error.message); 
      //console.log('Error: ' + error.message);
      //alert('Error: ' + error.message);
      setError('Error: ' + error.message);
      setTimeout(() => setError(""), 10000); // Hide message after 10 seconds
    }
    finally{
      setLoading(false);
    }
};



  return (
    <div className="flex flex-col min-h-screen bg-[#d8eafe] relative">
      {/* Logo */}
      <div className="fixed top-0 left-0 bg-[#2a8eed] px-4 py-2 rounded-br-md shadow-md z-50">
        <img src={Logo} alt="Smart Eatz Logo" className="h-10" />
      </div>

      {/* Main login content */}
      <div className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-sm">
          <div className="bg-transparent p-8 rounded-lg flex flex-col items-center mt-12">
            {/* Email input */}
            <div className="mb-4 w-full">
              <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                <span className="mr-2">📷</span>
                <input
                  id="email-field"
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

            {/* Password input */}
            <div className="mb-4 w-full">
              <div className="flex items-center border border-gray-500 rounded-md p-2 bg-white">
                <span className="mr-2">🔒</span>
                <input
                  id="password-field"
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

            {/* Login button */}
            <button
              id="login-btn"
              type="submit"
              className="w-full bg-white text-blue-600 font-semibold py-2 rounded-md shadow-md border border-gray-300 hover:bg-gray-100 transition"
              disabled={loading}
              onClick={() => LoginUser(userName, passWord)}
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>

            {/* Error message */}
            {error && (
              <p className="mt-2 text-red-600 shadow-md animate-fadeIn">
                {error}
              </p>
            )}

            {/* Return home */}
            <p>
              <Link to="/" id="return-btn" className="text-sm text-black mt-4 cursor-pointer hover:underline">
                Return to Home Page
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer component */}
        <Footer />
    </div>
  );
}

export default Login