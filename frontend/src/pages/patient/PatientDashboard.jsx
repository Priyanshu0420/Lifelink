import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  HeartPulse,
  LayoutDashboard,
  UserRound,
  Phone,
  ShieldCheck,
  QrCode,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from "lucide-react";

import { getUsername, logout } from "../../services/auth";

import {
  getMyProfile,
  getEmergencyContacts,
} from "../../services/patientApi";


function PatientDashboard() {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profile, setProfile] = useState(null);

  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const username = getUsername();


  // =====================================================
  // LOAD PROFILE + EMERGENCY CONTACTS
  // =====================================================

  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        setLoading(true);

        setError("");


        // Load patient profile
        const profileData = await getMyProfile();

        setProfile(profileData);


        // Load emergency contacts
        const contactData = await getEmergencyContacts();

        setContacts(contactData || []);


      } catch (err) {

        console.error(
          "Failed to load patient dashboard data:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load your dashboard data."
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboardData();

  }, []);


  return (

    <div className="patient-layout">


      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {sidebarOpen && (

        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />

      )}


      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`patient-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >


        {/* Logo */}

        <div className="patient-logo">

          <div className="patient-logo-icon">

            <HeartPulse size={22} />

          </div>

          <span>
            LifeLink
          </span>


          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >

            <X size={20} />

          </button>

        </div>


        {/* Navigation */}

        <nav className="patient-nav">


          <p className="nav-section-title">
            MAIN
          </p>


          {/* Dashboard */}

          <button
            className="patient-nav-item active"
            onClick={() =>
              navigate("/patient/dashboard")
            }
          >

            <LayoutDashboard size={19} />

            <span>
              Overview
            </span>

          </button>


          {/* Profile */}

          <button
            className="patient-nav-item"
            onClick={() =>
              navigate("/patient/profile")
            }
          >

            <UserRound size={19} />

            <span>
              My Profile
            </span>

          </button>


          {/* Emergency Contacts */}

          <button
            className="patient-nav-item"
            onClick={() =>
              navigate("/patient/emergency-contacts")
            }
          >

            <Phone size={19} />

            <span>
              Emergency Contacts
            </span>

          </button>


          {/* Insurance */}

          <button
            className="patient-nav-item"
            onClick={() =>
              navigate("/patient/insurance")
            }
          >

            <ShieldCheck size={19} />

            <span>
              Insurance
            </span>

          </button>


          <p className="nav-section-title second">
            EMERGENCY
          </p>


          {/* QR */}

          <button
            className="patient-nav-item"
            onClick={() =>
              navigate("/patient/qr-code")
            }
          >

            <QrCode size={19} />

            <span>
              QR Code
            </span>

          </button>


        </nav>


        {/* Bottom */}

        <div className="patient-sidebar-bottom">

          <button
            className="patient-logout"
            onClick={logout}
          >

            <LogOut size={19} />

            <span>
              Logout
            </span>

          </button>

        </div>


      </aside>


      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="patient-main">


        {/* Topbar */}

        <header className="patient-topbar">


          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >

            <Menu size={22} />

          </button>


          <div className="topbar-spacer" />


          <button className="notification-button">

            <Bell size={20} />

            <span />

          </button>


          <div className="patient-user">


            <div className="patient-avatar">

              {username
                ? username.charAt(0).toUpperCase()
                : "P"}

            </div>


            <div className="patient-user-info">

              <strong>
                {username || "Patient"}
              </strong>

              <small>
                Patient
              </small>

            </div>


          </div>


        </header>


        {/* Content */}

        <div className="patient-content">


          {/* ==========================================
              WELCOME
          ========================================== */}

          <section className="patient-welcome">


            <div>

              <p>
                PATIENT DASHBOARD
              </p>

              <h1>
                Welcome back.
              </h1>

              <span>
                Manage your medical identity and
                emergency information from one place.
              </span>

            </div>


            <button
              className="dashboard-qr-button"
              onClick={() =>
                navigate("/patient/qr-code")
              }
            >

              <QrCode
                size={19}
                className="qr-button-icon"
              />

              <span>
                View My QR
              </span>

              <ChevronRight
                size={18}
                className="qr-button-arrow"
              />

            </button>


          </section>


          {/* ==========================================
              STATS
          ========================================== */}

          <section className="patient-stats">


            {/* PROFILE */}

            <div className="patient-stat-card">


              <div className="stat-icon">

                <UserRound size={21} />

              </div>


              <div>

                <span>
                  PROFILE
                </span>


                <strong>

                  {loading
                    ? "Loading..."
                    : profile
                      ? "Complete"
                      : "Incomplete"}

                </strong>

              </div>


            </div>


            {/* EMERGENCY CONTACTS */}

            <div className="patient-stat-card">


              <div className="stat-icon">

                <Phone size={21} />

              </div>


              <div>

                <span>
                  EMERGENCY CONTACTS
                </span>


                <strong>

                  {loading
                    ? "Loading..."
                    : contacts.length}

                </strong>

              </div>


            </div>


            {/* INSURANCE */}

            <div className="patient-stat-card">


              <div className="stat-icon">

                <ShieldCheck size={21} />

              </div>


              <div>

                <span>
                  INSURANCE
                </span>


                <strong>
                  —
                </strong>

              </div>


            </div>


            {/* QR */}

            <div className="patient-stat-card">


              <div className="stat-icon">

                <QrCode size={21} />

              </div>


              <div>

                <span>
                  QR STATUS
                </span>


                <strong>
                  Ready
                </strong>

              </div>


            </div>


          </section>


          {/* ==========================================
              MAIN CARDS
          ========================================== */}

          <section className="patient-grid">


            {/* ==========================================
                MEDICAL IDENTITY
            ========================================== */}

            <div className="patient-card medical-card">


              <div className="patient-card-header">


                <div>

                  <span>
                    MEDICAL IDENTITY
                  </span>

                  <h2>
                    Your emergency profile
                  </h2>

                </div>


                <UserRound size={21} />


              </div>


              <div className="medical-information">


                {loading && (

                  <p className="loading-text">
                    Loading your medical information...
                  </p>

                )}


                {error && (

                  <p className="error-text">
                    {error}
                  </p>

                )}


                {!loading &&
                  !error &&
                  profile && (

                    <div className="medical-details">


                      {/* ==================================
                          BLOOD GROUP
                      ================================== */}

                      <div className="medical-detail">

                        <span>
                          BLOOD GROUP
                        </span>

                        <strong>
                          {profile.bloodGroup ||
                            "Not provided"}
                        </strong>

                      </div>


                      {/* ==================================
                          GENDER
                      ================================== */}

                      <div className="medical-detail">

                        <span>
                          GENDER
                        </span>

                        <strong>
                          {profile.gender ||
                            "Not provided"}
                        </strong>

                      </div>


                      {/* ==================================
                          DATE OF BIRTH
                      ================================== */}

                      <div className="medical-detail">

                        <span>
                          DATE OF BIRTH
                        </span>

                        <strong>
                          {profile.dateOfBirth ||
                            profile.dob ||
                            "Not provided"}
                        </strong>

                      </div>


                      {/* ==================================
                          ALLERGIES
                      ================================== */}

                      <div className="medical-detail">

                        <span>
                          ALLERGIES
                        </span>

                        <strong>
                          {profile.allergies ||
                            "None provided"}
                        </strong>

                      </div>


                      {/* ==================================
                          MEDICAL CONDITIONS
                      ================================== */}

                      <div className="medical-detail">

                        <span>
                          MEDICAL CONDITIONS
                        </span>

                        <strong>
                          {profile.medicalConditions ||
                            "None provided"}
                        </strong>

                      </div>


                      {/* ==================================
                          LOCATION
                      ================================== */}

                      <div className="medical-detail">

                        <span>
                          LOCATION
                        </span>

                        <strong>
                          {profile.city ||
                            "Not provided"}
                        </strong>

                      </div>


                    </div>

                  )}


              </div>


            </div>


            {/* ==========================================
                QR CARD
            ========================================== */}

            <div className="patient-card qr-card">


              <div className="patient-card-header">


                <div>

                  <span>
                    EMERGENCY ACCESS
                  </span>

                  <h2>
                    Your LifeLink QR
                  </h2>

                </div>


                <QrCode size={21} />


              </div>


              <div className="qr-placeholder">


                <div className="qr-icon-large">

                  <QrCode size={55} />

                </div>


                <p>

                  Your QR code will allow emergency
                  responders to access your public
                  emergency information.

                </p>


                <button
                  className="dashboard-manage-qr-button"
                  onClick={() =>
                    navigate("/patient/qr-code")
                  }
                >

                  Manage QR Code

                  <ChevronRight size={18} />

                </button>


              </div>


            </div>


          </section>


          {/* ==========================================
              EMERGENCY CONTACTS
          ========================================== */}

          <section className="patient-card">


            <div className="patient-card-header">


              <div>

                <span>
                  EMERGENCY CONTACTS
                </span>

                <h2>
                  People to contact in an emergency
                </h2>

              </div>


              <Phone size={21} />


            </div>


            {/* ERROR */}

            {error && (

              <div className="empty-section">

                <p className="error-text">
                  {error}
                </p>

              </div>

            )}


            {/* LOADING */}

            {loading && !error && (

              <div className="empty-section">

                <p>
                  Loading emergency contacts...
                </p>

              </div>

            )}


            {/* NO CONTACTS */}

            {!loading &&
              !error &&
              contacts.length === 0 && (

                <div className="empty-section">


                  <Phone size={28} />


                  <p>
                    No emergency contacts added yet.
                  </p>


                  <button
                    onClick={() =>
                      navigate(
                        "/patient/emergency-contacts"
                      )
                    }
                  >

                    Add Emergency Contact

                    <ChevronRight size={16} />

                  </button>


                </div>

              )}


            {/* CONTACTS EXIST */}

            {!loading &&
              !error &&
              contacts.length > 0 && (

                <div className="dashboard-contacts-wrapper">

                  <div className="dashboard-contact-list">

                    {contacts.map((contact) => (

                      <div
                        className="dashboard-contact-item"
                        key={contact.contactId}
                      >


                        {/* LEFT SIDE */}

                        <div className="dashboard-contact-person">

                          <div className="dashboard-contact-avatar">

                            <UserRound size={20} />

                          </div>


                          <div className="dashboard-contact-info">

                            <div className="dashboard-contact-name-row">

                              <strong>
                                {contact.contactName}
                              </strong>


                              <span className="dashboard-contact-priority">

                                Priority {contact.priority}

                              </span>

                            </div>


                            <span className="dashboard-contact-relationship">

                              {contact.relationship}

                            </span>

                          </div>

                        </div>


                        {/* CONTACT DETAILS */}

                        <div className="dashboard-contact-details">


                          <a
                            href={`tel:${contact.phone}`}
                            className="dashboard-contact-phone"
                          >

                            <Phone size={16} />

                            <span>
                              {contact.phone}
                            </span>

                          </a>


                          {contact.email && (

                            <a
                              href={`mailto:${contact.email}`}
                              className="dashboard-contact-email"
                            >

                              <span>
                                {contact.email}
                              </span>

                            </a>

                          )}

                        </div>


                      </div>

                    ))}

                  </div>


                  {/* FOOTER */}

                  <div className="dashboard-contacts-footer">

                    <span>

                      {contacts.length}{" "}

                      {contacts.length === 1
                        ? "emergency contact"
                        : "emergency contacts"}{" "}

                      available

                    </span>


                    <button
                      className="dashboard-manage-contacts"
                      onClick={() =>
                        navigate(
                          "/patient/emergency-contacts"
                        )
                      }
                    >

                      Manage Contacts

                      <ChevronRight size={16} />

                    </button>

                  </div>


                </div>

              )}


          </section>


        </div>


      </main>


    </div>

  );

}


export default PatientDashboard;