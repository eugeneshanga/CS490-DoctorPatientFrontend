import React from 'react';
import ReactDOM from 'react-dom/client';
//import { BrowserRouter } from 'react-router-dom';
import './index.css';
import LandingPage from './pages/LandingPage/landingPage';
import LoginPage from './pages/Login/login'
import RegistrationPage from './pages/Registration/registration'
import PatientPage from './pages/patientDashboard/patientDashboard'
import DoctorPage from './pages/doctorDashboard/doctorDashboard'
import PharmacyPage from './pages/pharmacyDashboard/PharmacyDashboard';
import PaymentPage from './pages/paymentPage/paymentPage'
import DiscussionBoard from './pages/discussionPosts/discussion'
import PostAppointmentPage from './pages/doctorDashboard/PostAppointment';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PostAppointmentReview from "./pages/patientDashboard/PostAppointment";

const router = createBrowserRouter([
  {
    path: "",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <RegistrationPage />,
  },
  {
    path: "/patient",
    element: <PatientPage />,
  },
  {
    path: "/doctors",
    element: <DoctorPage />,
  },
  {
    path: "/pharmacy",
    element: <PharmacyPage />
  },
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/post-appointment",
    element: <PostAppointmentPage />,
  },
  {
    path: "/patient-post-appointment",
    element: <PostAppointmentReview/>
  },
  {
    path: "/discuss",
    element: <DiscussionBoard/>
  }
]);

async function loadConfigThenRender() {
  let apiBase = '';
  let pharmaBase = '';
  try {
    const resp = await fetch('/config.json', { cache: 'no-cache' });
    if (resp.ok) {
      const cfg = await resp.json();
      if (cfg.API_BASE)    apiBase    = cfg.API_BASE;
      if (cfg.PHARMA_BASE) pharmaBase = cfg.PHARMA_BASE;
    }
  } catch (e) {
    console.warn('Failed to load config.json:', e);
  }

  // make it globally available
  window.API_BASE = apiBase;
  window.PHARMA_BASE = pharmaBase;

  // now mount your app
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

loadConfigThenRender();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
