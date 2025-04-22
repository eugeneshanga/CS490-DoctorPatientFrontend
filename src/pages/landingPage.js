/* Importanted Components */
import Navbar from '../Components/LandingPage/Navbar';
import HeroSection from '../Components/LandingPage/HeroSection';
import Doctors from '../Components/LandingPage/Doctors';
import Pharmacists from '../Components/LandingPage/Pharmacists';
import Testimonials from '../Components/LandingPage/Testimonials';
import About from '../Components/LandingPage/About';
import Footer from '../Components/Footer/Footer';

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
      <Footer />
    </>
  );
}

export default LandingPage;
