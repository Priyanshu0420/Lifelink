import { Link } from "react-router-dom";
import {
  ShieldCheck,
  QrCode,
  Siren,
  HeartPulse,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="navbar-container">

          <Link to="/" className="brand">
            <div className="brand-icon">
              <HeartPulse size={24} />
            </div>

            <span>LifeLink</span>
          </Link>

          <nav className="nav-links">

            <a href="#features">
              Features
            </a>

            <a href="#how-it-works">
              How It Works
            </a>

            <Link
              to="/login"
              className="nav-login"
            >
              Login
            </Link>

            {/* Hospital Registration */}
            <Link
              to="/register/hospital"
              className="nav-hospital-register"
            >
              Register as Hospital
            </Link>

            {/* Patient Registration */}
            <Link
              to="/register/patient"
              className="nav-register"
            >
              Get Started
              <ArrowRight size={17} />
            </Link>

          </nav>

        </div>
      </header>


      {/* ================= HERO ================= */}

      <main>

        <section className="hero">

          <div className="hero-container">

            <div className="hero-content">

              <div className="hero-badge">
                <ShieldCheck size={16} />
                Smart Emergency Response
              </div>

              <h1>
                When every second
                <span>matters.</span>
              </h1>

              <p>
                LifeLink connects patients, hospitals and
                emergency contacts through secure medical
                identity and instant emergency response
                technology.
              </p>

              {/* ================= REGISTRATION OPTIONS ================= */}

              <div className="hero-actions">

                {/* Patient Registration */}
                <Link
                  to="/register/patient"
                  className="primary-button"
                >
                  Register as Patient
                  <ArrowRight size={18} />
                </Link>

                {/* Hospital Registration */}
                <Link
                  to="/register/hospital"
                  className="hospital-register-button"
                >
                  Register as Hospital
                  <ArrowRight size={18} />
                </Link>

                {/* Learn More */}
                <a
                  href="#how-it-works"
                  className="secondary-button"
                >
                  Learn How It Works
                </a>

              </div>


              <div className="hero-trust">

                <div>
                  <CheckCircle2 size={17} />
                  Secure medical identity
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  QR-based emergency access
                </div>

              </div>

            </div>


            {/* ================= EMERGENCY CARD ================= */}

            <div className="hero-visual">

              <div className="emergency-card">

                <div className="emergency-card-header">

                  <div className="status-dot"></div>

                  <span>
                    LifeLink Emergency
                  </span>

                  <Siren size={20} />

                </div>


                <div className="patient-preview">

                  <div className="patient-avatar">
                    <HeartPulse size={30} />
                  </div>

                  <div>

                    <h3>
                      Emergency Profile
                    </h3>

                    <p>
                      Accessible through LifeLink QR
                    </p>

                  </div>

                </div>


                <div className="medical-grid">

                  <div className="medical-item">

                    <span>
                      Blood Group
                    </span>

                    <strong>
                      O+
                    </strong>

                  </div>


                  <div className="medical-item">

                    <span>
                      Status
                    </span>

                    <strong>
                      Emergency
                    </strong>

                  </div>

                </div>


                <div className="qr-preview">

                  <QrCode
                    size={110}
                    strokeWidth={1.5}
                  />

                  <div>

                    <strong>
                      Scan to access
                    </strong>

                    <span>
                      Emergency information
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= FEATURES ================= */}

        <section
          id="features"
          className="features-section"
        >

          <div className="section-container">

            <div className="section-heading">

              <span>
                POWERFUL FEATURES
              </span>

              <h2>
                Built for emergencies.
                <br />
                Designed for people.
              </h2>

              <p>
                LifeLink brings critical medical information
                and emergency communication together in one
                secure system.
              </p>

            </div>


            <div className="features-grid">

              <div className="feature-card">

                <div className="feature-icon">
                  <QrCode size={25} />
                </div>

                <h3>
                  Smart QR Identity
                </h3>

                <p>
                  A secure QR code gives authorized
                  responders instant access to essential
                  emergency information.
                </p>

              </div>


              <div className="feature-card">

                <div className="feature-icon">
                  <Siren size={25} />
                </div>

                <h3>
                  Emergency SOS
                </h3>

                <p>
                  Trigger an emergency alert with your
                  location and notify the connected hospital.
                </p>

              </div>


              <div className="feature-card">

                <div className="feature-icon">
                  <HeartPulse size={25} />
                </div>

                <h3>
                  Medical Information
                </h3>

                <p>
                  Keep important medical information,
                  allergies, conditions and emergency
                  contacts organized.
                </p>

              </div>


              <div className="feature-card">

                <div className="feature-icon">
                  <ShieldCheck size={25} />
                </div>

                <h3>
                  Connected Hospitals
                </h3>

                <p>
                  Hospitals can manage patients and respond
                  to emergency alerts through a dedicated
                  dashboard.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================= HOW IT WORKS ================= */}

        <section
          id="how-it-works"
          className="how-section"
        >

          <div className="section-container">

            <div className="section-heading centered">

              <span>
                HOW IT WORKS
              </span>

              <h2>
                Help can start in seconds.
              </h2>

            </div>


            <div className="steps">

              <div className="step">

                <div className="step-number">
                  01
                </div>

                <h3>
                  Create your profile
                </h3>

                <p>
                  Add your essential medical information
                  and emergency contacts.
                </p>

              </div>


              <div className="step">

                <div className="step-number">
                  02
                </div>

                <h3>
                  Get your QR
                </h3>

                <p>
                  LifeLink generates a unique QR identity
                  for your emergency profile.
                </p>

              </div>


              <div className="step">

                <div className="step-number">
                  03
                </div>

                <h3>
                  Stay connected
                </h3>

                <p>
                  In an emergency, responders can access
                  critical information and hospitals can
                  respond.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}

        <section className="cta-section">

          <div className="cta-container">

            <div>

              <span>
                READY TO GET STARTED?
              </span>

              <h2>
                Put your emergency information
                where it can help.
              </h2>

            </div>


            <Link
              to="/register/patient"
              className="cta-button"
            >
              Create LifeLink
              <ArrowRight size={18} />
            </Link>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-container">

          <div className="brand footer-brand">

            <div className="brand-icon">
              <HeartPulse size={22} />
            </div>

            <span>
              LifeLink
            </span>

          </div>

          <p>
            Smart Emergency Response & Medical Identity System
          </p>

          <span>
            © 2026 LifeLink
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;