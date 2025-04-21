/* Importanted Components */
import Navbar from '../Components/LandingPage/Navbar';
import HeroSection from '../Components/LandingPage/HeroSection';
import Doctors from '../Components/LandingPage/Doctors';
import Pharmacists from '../Components/LandingPage/Pharmacists';
import Testimonials from '../Components/LandingPage/Testimonials';
import About from '../Components/LandingPage/About';
import Footer from '../Components/Footer/Footer';
import { Link } from "react-router-dom";

/* For Grey Background */
import './LandingPage.css'



function LandingPage() {
  return (
    <>
      <Navbar />

      {/* Main grey background area */}
      <div className="landing-background">
    
        <section id="home">
          <div className="landing-container">
            <HeroSection />
          </div>
        </section>

        <section id="doctors">
          <div className="landing-container">
            <Doctors />
          </div>
        </section>

        <section id="pharmacists">
          <div className="landing-container">
            <Pharmacists />
          </div>
        </section>

        <section id="testimonials">
          <div className="landing-container">
            <Testimonials />
          </div>
        </section>

        <section id="about">
          <div className="landing-container">
            <About />
          </div>
        </section>

      </div>
      <div style={{ textAlign: 'center', padding: '20px' }}>
  <Link to="/pharmacy-dashboard" style={{
    fontSize: '1.2rem',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none'
  }}>
    Go to Pharmacy Dashboard
  </Link>
</div>

      <Footer />
    </>
  );
}

export default LandingPage;
