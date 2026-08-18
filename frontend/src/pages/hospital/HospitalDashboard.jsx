import { useEffect, useState } from "react";
import "./HospitalDashboard.css";

import {
  Hospital,
  Users,
  AlertTriangle,
  Clock3,
  RefreshCw,
  ChevronRight,
  LogOut,
  MapPin,
  Activity,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getHospitalProfile,
  getMyPatients,
  getTodaysEmergencies,
} from "../../services/hospitalApi";


function HospitalDashboard() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [hospital, setHospital] = useState(null);

  const [patients, setPatients] = useState([]);

  const [emergencies, setEmergencies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = async () => {

    try {

      setError("");

      const [
        hospitalData,
        patientsData,
        emergenciesData,
      ] = await Promise.all([
        getHospitalProfile(),
        getMyPatients(),
        getTodaysEmergencies(),
      ]);

      console.log("EMERGENCIES FROM BACKEND:", emergenciesData);


      setHospital(hospitalData);

      setPatients(
        Array.isArray(patientsData)
          ? patientsData
          : []
      );

      setEmergencies(
        Array.isArray(emergenciesData)
          ? emergenciesData
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load hospital dashboard:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load hospital dashboard."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadDashboard();

  }, []);


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    await loadDashboard();

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };


  // =====================================================
  // CALCULATIONS
  // =====================================================

  const pendingEmergencies =
    emergencies.filter(
      (emergency) =>
        emergency.status === "PENDING"
    ).length;


  const acceptedEmergencies =
    emergencies.filter(
      (emergency) =>
        emergency.status === "ACCEPTED"
    ).length;


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="hospital-dashboard-loading">

        <div className="hospital-dashboard-loading-icon">

          <Hospital size={28} />

        </div>

        <h2>
          Loading hospital dashboard...
        </h2>

        <p>
          Please wait while we fetch your hospital information.
        </p>

      </div>

    );

  }


  return (

    <div className="hospital-dashboard-page">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="hospital-sidebar">


        {/* LOGO */}

        <div className="hospital-sidebar-logo">

          <div className="hospital-sidebar-logo-icon">

            <Hospital size={22} />

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


        {/* NAVIGATION */}

        <nav className="hospital-sidebar-nav">


          <p className="hospital-nav-title">
            MAIN
          </p>


          <button
            className="hospital-nav-item active"
            onClick={() =>
              navigate("/hospital/dashboard")
            }
          >

            <Activity size={18} />

            <span>
              Overview
            </span>

          </button>


          <button
            className="hospital-nav-item"
            onClick={() =>
              navigate("/hospital/profile")
            }
          >

            <Hospital size={18} />

            <span>
              Hospital Profile
            </span>

          </button>


          <button
            className="hospital-nav-item"
            onClick={() =>
              navigate("/hospital/patients")
            }
          >

            <Users size={18} />

            <span>
              Patients
            </span>

          </button>


          <p className="hospital-nav-title emergency">
            EMERGENCY
          </p>


          <button
            className="hospital-nav-item"
            onClick={() =>
              navigate("/hospital/emergencies")
            }
          >

            <AlertTriangle size={18} />

            <span>
              Today's Emergencies
            </span>

            {pendingEmergencies > 0 && (

              <span className="hospital-nav-badge">
                {pendingEmergencies}
              </span>

            )}

          </button>


          <button
            className="hospital-nav-item"
            onClick={() =>
              navigate("/hospital/emergency-history")
            }
          >

            <Clock3 size={18} />

            <span>
              Emergency History
            </span>

          </button>


        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="hospital-sidebar-bottom">


          <div className="hospital-sidebar-account">

            <div className="hospital-account-avatar">

              <Hospital size={17} />

            </div>

            <div>

              <strong>
                {hospital?.hospitalName ||
                  "Hospital"}
              </strong>

              <span>
                HOSPITAL
              </span>

            </div>

          </div>


          <button
            className="hospital-logout-button"
            onClick={handleLogout}
          >

            <LogOut size={17} />

            Logout

          </button>


        </div>


      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="hospital-dashboard-main">


        {/* HEADER */}

        <header className="hospital-dashboard-header">


          <div>

            <span className="hospital-dashboard-eyebrow">
              HOSPITAL PORTAL
            </span>

            <h1>
              Dashboard
            </h1>

            <p>

              Welcome back,{" "}

              <strong>
                {hospital?.hospitalName ||
                  "Hospital"}
              </strong>

            </p>

          </div>


          <button
            className="hospital-refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >

            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "hospital-refresh-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>


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
            STAT CARDS
        ================================================= */}

        <section className="hospital-stat-grid">


          {/* PATIENTS */}

          <div className="hospital-stat-card">

            <div className="hospital-stat-icon patients">

              <Users size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                TOTAL PATIENTS
              </span>

              <strong>
                {patients.length}
              </strong>

              <small>
                Patients assigned to your hospital
              </small>

            </div>

          </div>


          {/* EMERGENCIES */}

          <div className="hospital-stat-card">

            <div className="hospital-stat-icon emergency">

              <AlertTriangle size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                TODAY'S EMERGENCIES
              </span>

              <strong>
                {emergencies.length}
              </strong>

              <small>
                Emergency alerts received today
              </small>

            </div>

          </div>


          {/* PENDING */}

          <div className="hospital-stat-card">

            <div className="hospital-stat-icon pending">

              <Clock3 size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                PENDING ALERTS
              </span>

              <strong>
                {pendingEmergencies}
              </strong>

              <small>
                Alerts waiting for response
              </small>

            </div>

          </div>


          {/* ACCEPTED */}

          <div className="hospital-stat-card">

            <div className="hospital-stat-icon accepted">

              <Activity size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                ACCEPTED TODAY
              </span>

              <strong>
                {acceptedEmergencies}
              </strong>

              <small>
                Emergencies currently accepted
              </small>

            </div>

          </div>


        </section>


        {/* =================================================
            EMERGENCIES
        ================================================= */}

        <section className="hospital-dashboard-section">


          <div className="hospital-section-header">

            <div>

              <span>
                EMERGENCY RESPONSE
              </span>

              <h2>
                Today's Emergencies
              </h2>

              <p>
                Monitor emergency alerts assigned to your hospital.
              </p>

            </div>


            <button
              className="hospital-view-all-button"
              onClick={() =>
                navigate("/hospital/emergencies")
              }
            >

              View all

              <ChevronRight size={17} />

            </button>

          </div>


          {emergencies.length === 0 ? (

            <div className="hospital-empty-state">

              <div className="hospital-empty-icon">

                <AlertTriangle size={24} />

              </div>

              <h3>
                No emergencies today
              </h3>

              <p>
                There are currently no emergency alerts assigned to your hospital.
              </p>

            </div>

          ) : (

            <div className="hospital-emergency-table-wrapper">

              <table className="hospital-emergency-table">

                <thead>

                  <tr>

                    <th>
                      PATIENT
                    </th>

                    <th>
                      SCAN TIME
                    </th>

                    <th>
                      LOCATION
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {emergencies.map(
                    (emergency) => (

                      <tr
                        key={emergency.alertId}
                      >

                        <td>

                          <div className="hospital-patient-cell">

                            <div className="hospital-patient-avatar">

                              <Users size={16} />

                            </div>

                            <div>

                              <strong>
                                {emergency.patientName ||
                                  "Unknown Patient"}
                              </strong>

                              <span>
                                Emergency Alert
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <div className="hospital-time-cell">

                            <Clock3 size={15} />

                            {emergency.scanTime
                              ? new Date(
                                  emergency.scanTime
                                ).toLocaleString()
                              : "—"}

                          </div>

                        </td>


                        <td>

                          {emergency.latitude &&
                          emergency.longitude ? (

                            <div className="hospital-location-cell">

                              <MapPin size={15} />

                              <span>
                                {emergency.latitude.toFixed
                                  ? emergency.latitude.toFixed(4)
                                  : emergency.latitude}
                                ,
                                {" "}
                                {emergency.longitude.toFixed
                                  ? emergency.longitude.toFixed(4)
                                  : emergency.longitude}
                              </span>

                            </div>

                          ) : (

                            <span>
                              Location unavailable
                            </span>

                          )}

                        </td>


                        <td>

                          <span
                            className={`hospital-status-badge ${String(
                              emergency.status || ""
                            ).toLowerCase()}`}
                          >

                            {emergency.status ||
                              "UNKNOWN"}

                          </span>

                        </td>


                        <td>

                          <button
                            className="hospital-action-button"
                            onClick={() =>
                              navigate(
                                `/hospital/emergencies/${emergency.alertId}`
                              )
                            }
                          >

                            View

                            <ChevronRight
                              size={15}
                            />

                          </button>

                        </td>


                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}


        </section>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="hospital-quick-section">


          <div className="hospital-section-header">

            <div>

              <span>
                QUICK ACCESS
              </span>

              <h2>
                Hospital Management
              </h2>

            </div>

          </div>


          <div className="hospital-quick-grid">


            <button
              className="hospital-quick-card"
              onClick={() =>
                navigate("/hospital/patients")
              }
            >

              <div className="hospital-quick-icon">

                <Users size={21} />

              </div>

              <div>

                <strong>
                  Manage Patients
                </strong>

                <span>
                  View and search your patients
                </span>

              </div>

              <ChevronRight size={18} />

            </button>


            <button
              className="hospital-quick-card"
              onClick={() =>
                navigate("/hospital/emergency-history")
              }
            >

              <div className="hospital-quick-icon">

                <Clock3 size={21} />

              </div>

              <div>

                <strong>
                  Emergency History
                </strong>

                <span>
                  Review previous emergency alerts
                </span>

              </div>

              <ChevronRight size={18} />

            </button>


            <button
              className="hospital-quick-card"
              onClick={() =>
                navigate("/hospital/profile")
              }
            >

              <div className="hospital-quick-icon">

                <Hospital size={21} />

              </div>

              <div>

                <strong>
                  Hospital Profile
                </strong>

                <span>
                  Manage hospital information
                </span>

              </div>

              <ChevronRight size={18} />

            </button>


          </div>


        </section>


      </main>


    </div>

  );

}


export default HospitalDashboard;