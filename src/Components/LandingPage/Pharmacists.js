import './Pharmacists.css';
import PharmacyImage from '../../Assets/Landing/Pharmacist.png';
import BufoPainkillers from '../../Assets/Landing/BufoPainkillers.png';

function Pharmacists() {
  return (
    <div className="pharmacists-section">
      <div className="pharmacists-content">
        {/* LEFT: Image */}
        <div className="pharmacists-image">
          <img src={BufoPainkillers} alt="Pharmacist" />
        </div>

        {/* RIGHT: Text content */}
        <div className="pharmacists-text">
          <h2>Pharmacists</h2>
          <h3>Trusted Pharmacist For Good Drugs</h3>
          <p>
            Use our built-in pharmacist database to find which drugs would best match your health needs!
          </p>
          <button className="pharmacists-btn">View Our Pharmacies</button>
        </div>
      </div>
    </div>
  );
}

export default Pharmacists;