import { useEffect, useState } from "react";

import {
  AlertTriangle,
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Droplets,
  MapPin,
  Phone,
  User,
  HeartPulse,
  ShieldAlert,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import {
  getEmergencyById,
  updateEmergencyStatus,
} from "../../services/hospitalApi";


function HospitalEmergencyDetails() {
  const navigate = useNavigate();
  const { alertId } = useParams();

  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");


  // =====================================================
  // LOAD EMERGENCY
  // =====================================================

  const loadEmergency = async () => {
    try {
      setError("");

      const data = await getEmergencyById(alertId);

      setEmergency(data);

    } catch (err) {
      console.error(
        "Failed to load emergency:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load emergency details."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadEmergency();
  }, [alertId]);


  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleStatusUpdate = async (status) => {
    try {
      setUpdating(true);
      setError("");

      const updated = await updateEmergencyStatus(
        alertId,
        status
      );

      setEmergency(updated);

    } catch (err) {
      console.error(
        "Failed to update emergency status:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to update emergency status."
      );

    } finally {
      setUpdating(false);
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="hospital-dashboard-loading">

        <div className="hospital-dashboard-loading-icon">
          <AlertTriangle size={28} />
        </div>

        <h2>
          Loading emergency details...
        </h2>

        <p>
          Please wait while we retrieve the emergency information.
        </p>

      </div>
    );
  }


  // =====================================================
  // ERROR / NOT FOUND
  // =====================================================

  if (error && !emergency) {
    return (
      <div className="hospital-dashboard-page">

        <main className="hospital-dashboard-main">

          <button
            className="hospital-back-button"
            onClick={() =>
              navigate("/hospital/emergencies")
            }
          >
            <ArrowLeft size={17} />
            Back to Emergencies
          </button>

          <div className="hospital-dashboard-error">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>

        </main>

      </div>
    );
  }


  if (!emergency) {
    return null;
  }


  const status = String(
    emergency.status || "UNKNOWN"
  ).toUpperCase();


  return (
    <div className="hospital-dashboard-page">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="hospital-sidebar">

        <div className="hospital-sidebar-logo">

          <div className="hospital-sidebar-logo-icon">
            <Activity size={22} />
          </div>

          <div>
            <strong>
              LifeLink
            </strong>

            <span>
              Hospital Portal
            </span>
          </div>

        </div>


        <nav className="hospital-sidebar-nav">

          <p className="hospital-nav-title">
            MAIN
          </p>


          <button
            className="hospital-nav-item"
            onClick={() =>
              navigate("/hospital/dashboard")
            }
          >
            <Activity size={18} />
            <span>Overview</span>
          </button>


          <button
            className="hospital-nav-item"
            onClick={() =>
              navigate("/hospital/profile")
            }
          >
            <Activity size={18} />
            <span>Hospital Profile</span>
          </button>


          <button
            className="hospital-nav-item"
            onClick={() =>
              navigate("/hospital/patients")
            }
          >
            <User size={18} />
            <span>Patients</span>
          </button>


          <p className="hospital-nav-title emergency">
            EMERGENCY
          </p>


          <button
            className="hospital-nav-item active"
            onClick={() =>
              navigate("/hospital/emergencies")
            }
          >
            <AlertTriangle size={18} />

            <span>
              Today's Emergencies
            </span>
          </button>


          <button
            className="hospital-nav-item"
            onClick={() =>
              navigate(
                "/hospital/emergency-history"
              )
            }
          >
            <Clock3 size={18} />
            <span>Emergency History</span>
          </button>

        </nav>


        <div className="hospital-sidebar-bottom">

          <button
            className="hospital-logout-button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");

              navigate("/login");
            }}
          >
            Logout
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="hospital-dashboard-main">


        {/* BACK BUTTON */}

        <button
          className="hospital-back-button"
          onClick={() =>
            navigate("/hospital/emergencies")
          }
        >
          <ArrowLeft size={17} />

          Back to Emergencies
        </button>


        {/* HEADER */}

        <header className="hospital-dashboard-header">

          <div>

            <span className="hospital-dashboard-eyebrow">
              EMERGENCY RESPONSE
            </span>

            <h1>
              Emergency Details
            </h1>

            <p>
              Review patient information and manage
              the emergency response.
            </p>

          </div>


          <span
            className={`hospital-status-badge ${status.toLowerCase()}`}
          >
            {status}
          </span>

        </header>


        {/* ERROR */}

        {error && (
          <div className="hospital-dashboard-error">

            <AlertTriangle size={18} />

            <span>
              {error}
            </span>

          </div>
        )}


        {/* =================================================
            EMERGENCY BANNER
        ================================================= */}

        <section className="hospital-emergency-detail-banner">

          <div className="hospital-emergency-detail-banner-icon">

            <ShieldAlert size={28} />

          </div>

          <div>

            <span>
              EMERGENCY ALERT
            </span>

            <h2>
              {emergency.patientName ||
                "Unknown Patient"}
            </h2>

            <p>
              Emergency alert received by your hospital.
            </p>

          </div>

        </section>


        {/* =================================================
            PATIENT INFORMATION
        ================================================= */}

        <section className="hospital-dashboard-section">

          <div className="hospital-section-header">

            <div>

              <span>
                PATIENT INFORMATION
              </span>

              <h2>
                Patient Details
              </h2>

            </div>

          </div>


          <div className="hospital-detail-grid">


            {/* NAME */}

            <div className="hospital-detail-card">

              <div className="hospital-detail-icon">
                <User size={19} />
              </div>

              <div>

                <span>
                  Patient Name
                </span>

                <strong>
                  {emergency.patientName ||
                    "Not available"}
                </strong>

              </div>

            </div>


            {/* BLOOD GROUP */}

            <div className="hospital-detail-card">

              <div className="hospital-detail-icon">
                <Droplets size={19} />
              </div>

              <div>

                <span>
                  Blood Group
                </span>

                <strong>
                  {emergency.bloodGroup ||
                    "Not available"}
                </strong>

              </div>

            </div>


            {/* PHONE */}

            <div className="hospital-detail-card">

              <div className="hospital-detail-icon">
                <Phone size={19} />
              </div>

              <div>

                <span>
                  Phone
                </span>

                <strong>
                  {emergency.phone ||
                    "Not available"}
                </strong>

              </div>

            </div>


            {/* SCAN TIME */}

            <div className="hospital-detail-card">

              <div className="hospital-detail-icon">
                <Clock3 size={19} />
              </div>

              <div>

                <span>
                  Emergency Time
                </span>

                <strong>
                  {emergency.scanTime
                    ? new Date(
                        emergency.scanTime
                      ).toLocaleString()
                    : "Not available"}
                </strong>

              </div>

            </div>


          </div>

        </section>


        {/* =================================================
            MEDICAL INFORMATION
        ================================================= */}

        <section className="hospital-dashboard-section">

          <div className="hospital-section-header">

            <div>

              <span>
                MEDICAL INFORMATION
              </span>

              <h2>
                Important Medical Details
              </h2>

            </div>

          </div>


          <div className="hospital-medical-grid">


            <div className="hospital-medical-card">

              <HeartPulse size={20} />

              <div>

                <span>
                  Allergies
                </span>

                <p>
                  {emergency.allergies ||
                    "No allergy information available."}
                </p>

              </div>

            </div>


            <div className="hospital-medical-card">

              <Activity size={20} />

              <div>

                <span>
                  Medical Conditions
                </span>

                <p>
                  {emergency.medicalConditions ||
                    "No medical condition information available."}
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            LOCATION
        ================================================= */}

        <section className="hospital-dashboard-section">

          <div className="hospital-section-header">

            <div>

              <span>
                EMERGENCY LOCATION
              </span>

              <h2>
                Incident Location
              </h2>

            </div>

          </div>


          <div className="hospital-location-detail-card">

            <div className="hospital-location-detail-icon">
              <MapPin size={23} />
            </div>

            <div>

              <span>
                Coordinates
              </span>

              <strong>

                {emergency.latitude != null &&
                emergency.longitude != null
                  ? `${Number(
                      emergency.latitude
                    ).toFixed(6)}, ${Number(
                      emergency.longitude
                    ).toFixed(6)}`
                  : "Location unavailable"}

              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            ACTIONS
        ================================================= */}

        {(status === "PENDING" ||
          status === "ACCEPTED") && (

          <section className="hospital-dashboard-section">

            <div className="hospital-section-header">

              <div>

                <span>
                  RESPONSE MANAGEMENT
                </span>

                <h2>
                  Emergency Actions
                </h2>

                <p>
                  Update the current emergency response status.
                </p>

              </div>

            </div>


            <div className="hospital-detail-actions">


              {status === "PENDING" && (

                <button
                  className="hospital-emergency-accept"
                  disabled={updating}
                  onClick={() =>
                    handleStatusUpdate("ACCEPTED")
                  }
                >

                  <CheckCircle2 size={18} />

                  {updating
                    ? "Updating..."
                    : "Accept Emergency"}

                </button>

              )}


              {status === "ACCEPTED" && (

                <button
                  className="hospital-emergency-resolve"
                  disabled={updating}
                  onClick={() =>
                    handleStatusUpdate("RESOLVED")
                  }
                >

                  <CheckCircle2 size={18} />

                  {updating
                    ? "Updating..."
                    : "Mark Emergency Resolved"}

                </button>

              )}

            </div>

          </section>

        )}


      </main>

    </div>
  );
}


export default HospitalEmergencyDetails;