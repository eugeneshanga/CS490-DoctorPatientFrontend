// Registration.js
import Footer from '../../Components/Footer/Footer';
import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import Logo from '../../Assets/Logo/logo.png';
import {registrationStyles} from './registrationStyles.js';
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
    const [zipError, setZipError] = useState('')
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

    // whenever they type in ZIP, validate it
    const handleZipChange = e => {
        const val = e.target.value
        setZipCode(val)
        if (!/^\d{5}$/.test(val)) {
            setZipError('Zip code must be exactly 5 digits')
        } else {
            setZipError('')
        }
    }

    // Backend request for Registration
    // All post requests for them at the below route
    // '/api/register/patient', methods=['POST']
    // '/api/register/doctor', methods=['POST']
    // '/api/register/pharmacy', methods=['POST']
    const regPatient = async () => {
        if (zipError) return
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
            } else {
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
            } else {
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
        if (zipError) return
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
            } else {
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
        <div className={registrationStyles.background}>
            {/* Logo Section */}
            <div className="fixed top-0 left-0 bg-[#2a8eed] px-4 py-2 rounded-br-md shadow-md z-50">
                <img src={Logo} alt="Smart Eatz Logo" className="h-10"/>
            </div>
            {!roleChosen && (
                <div className={registrationStyles.central_sections}>
                    <h2 className='text-xl font-semibold'>Please Choose Your Role</h2>
                    <p className='text-gray-500 text-sm'>
                        Select one of the 3 options below
                    </p>
                    <p className='text-gray-400 text-xs'>
                        (Doctors and Pharmacists will require verification)
                    </p>

                    <div className='flex justify-center mt-6 space-x-6'>
                        {[
                            {role: 'Patient', icon: '🧑‍⚕️', color: 'blue'},
                            {role: 'Doctor', icon: '👨‍⚕️', color: 'red'},
                            {role: 'Pharmacist', icon: '💊', color: 'green'},
                        ].map(({role, icon, color}) => (
                            <button
                                id="users-btn"
                                key={role}
                                onClick={() => handleRoleClick(role)}
                                className={`w-32 h-32 flex flex-col items-center justify-center p-4 rounded-lg shadow-md border-2 transition
                  ${selectedRole === role ? `border-${color}-500 shadow-lg` : 'border-gray-300'}
                  ${color === 'blue' && 'hover:border-blue-500'}
                  ${color === 'red' && 'hover:border-red-500'}
                  ${color === 'green' && 'hover:border-green-500'}`}
                            >
                                <div className='text-4xl'>{icon}</div>
                                <p className='mt-2 font-medium'>{role}</p>
                            </button>
                        ))}
                    </div>
                    {/* Now Return to Landing Page */}
                    <p className="text-sm mt-2 text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-700 underline hover:text-blue-900">
                            Log In
                        </Link>
                    </p>
                    {/* Return home */}
                    <p>
                        <Link to="/" className="text-sm text-black mt-4 cursor-pointer hover:underline">
                            Return to Home Page
                        </Link>
                    </p>
                </div>
            )}
            {roleChosen && (<div className={registrationStyles.central_sections}>
                    {selectedRole === "Patient" && (
                        <div className={registrationStyles.user_divs}>
                            <h1 className={registrationStyles.userh1}>Patient Registration</h1>
                            {/* Name */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="FIRST NAME"
                                        className={registrationStyles.input}
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="LAST NAME"
                                        className={registrationStyles.input}
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Email */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="EMAIL"
                                        className={registrationStyles.input}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="PASSWORD"
                                        className={registrationStyles.input}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="ADDRESS"
                                        className={registrationStyles.input}
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="ZIP CODE"
                                        className={registrationStyles.input}
                                        required
                                        value={zipcode}
                                        onChange={handleZipChange}
                                    />
                                </div>
                                {zipError && (
                                    <p className="text-red-500 text-sm mt-1">{zipError}</p>
                                )}
                            </div>
                            {/* */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="PHONE NUMBER"
                                        className={registrationStyles.input}
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button id="reg-btn" type="submit" className={registrationStyles.register_button}
                                    onClick={() => regPatient()}
                                    disabled={!!zipError}
                            >
                                REGISTER
                            </button>
                            <div className="mt-4 mb-4 w-full">
                                <button id="back-btn" className={registrationStyles.go_back_button}
                                        onClick={handleRoleReset}>
                                    Go Back
                                </button>
                            </div>
                            <p className="text-sm mt-2 text-center">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-700 underline hover:text-blue-900">
                                    Log In
                                </Link>
                            </p>
                            {/* Return home */}
                            <p>
                                <Link to="/" className="text-sm text-black mt-4 cursor-pointer hover:underline">
                                    Return to Home Page
                                </Link>
                            </p>
                        </div>
                    )}
                    {selectedRole === "Doctor" && (
                        <div className={registrationStyles.user_divs}>
                            <h1 className={registrationStyles.userh1}>Doctor Registration</h1>
                            {/* Name */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="FIRST NAME"
                                        className={registrationStyles.input}
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="LAST NAME"
                                        className={registrationStyles.input}
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Email */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="EMAIL"
                                        className={registrationStyles.input}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="PASSWORD"
                                        className={registrationStyles.input}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="ADDRESS"
                                        className={registrationStyles.input}
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="ZIP CODE"
                                        className={registrationStyles.input}
                                        required
                                        value={zipcode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="PHONE NUMBER"
                                        className={registrationStyles.input}
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="LICENCE NUMBER"
                                        className={registrationStyles.input}
                                        required
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="SSN"
                                        className={registrationStyles.input}
                                        required
                                        value={ssn}
                                        onChange={(e) => setSSN(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Buttons */}
                            <button id="reg-btn" type="submit" className={registrationStyles.register_button}
                                    onClick={() => regDoctor()}>
                                REGISTER
                            </button>
                            <div className="mt-4 mb-4 w-full">
                                <button id="back-btn" className={registrationStyles.go_back_button}
                                        onClick={handleRoleReset}>
                                    Go Back
                                </button>
                            </div>
                            <p className="text-sm mt-2 text-center">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-700 underline hover:text-blue-900">
                                    Log In
                                </Link>
                            </p>
                            {/* Return home */}
                            <p>
                                <Link to="/" className="text-sm text-black mt-4 cursor-pointer hover:underline">
                                    Return to Home Page
                                </Link>
                            </p>
                        </div>
                    )}
                    {selectedRole === "Pharmacist" && (
                        <div className={registrationStyles.user_divs}>
                            <h1 className={registrationStyles.userh1}>Pharmacy Registration</h1>
                            {/* Name */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="NAME"
                                        className={registrationStyles.input}
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Email */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="email"
                                        placeholder="EMAIL"
                                        className={registrationStyles.input}
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Password */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="PASSWORD"
                                        className={registrationStyles.input}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="ADDRESS"
                                        className={registrationStyles.input}
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="ZIP CODE"
                                        className={registrationStyles.input}
                                        required
                                        value={zipcode}
                                        onChange={handleZipChange}
                                    />
                                </div>
                                {zipError && (
                                    <p className="text-red-500 text-sm mt-1">{zipError}</p>
                                )}
                            </div>
                            {/* */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="PHONE NUMBER"
                                        className={registrationStyles.input}
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* */}
                            <div className={registrationStyles.input_div_1}>
                                <div className={registrationStyles.input_div_2}>
                                    <input
                                        id="text-in"
                                        type="text"
                                        placeholder="LISCENCE NUMBER"
                                        className={registrationStyles.input}
                                        required
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Buttons */}
                            <button id="reg-btn" type='submit' className={registrationStyles.register_button}
                                    onClick={() => regPharmacy()}
                                    disabled={!!zipError}
                                >
                                REGISTER
                            </button>
                            <div className="mt-4 mb-4 w-full">
                                <button id="back-btn" className={registrationStyles.go_back_button}
                                        onClick={handleRoleReset}>
                                    Go Back
                                </button>
                            </div>
                            <p className="text-sm mt-2 text-center">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-700 underline hover:text-blue-900">
                                    Log In
                                </Link>
                            </p>
                            {/* Return home */}
                            <p>
                                <Link to="/" className="text-sm text-black mt-4 cursor-pointer hover:underline">
                                    Return to Home Page
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            )}
            <footer className='absolute bottom-0 left-0 w-full'>
                <Footer/>
            </footer>
        </div>
    )
}

export default Registration