import { useEffect, useState } from "react";

import {
  AlertTriangle,
  Clock3,
  MapPin,
  Phone,
  User,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  Activity,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getTodaysEmergencies,
  updateEmergencyStatus,
} from "../../services/hospitalApi";


function HospitalEmergencies() {

  const navigate = useNavigate();

  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");


  // =====================================================
  // LOAD EMERGENCIES
  // =====================================================

  const loadEmergencies = async () => {

    try {

      setError("");

      const data = await getTodaysEmergencies();

      console.log(
        "EMERGENCY API RESPONSE:",
        JSON.stringify(data, null, 2)
      );

      setEmergencies(
        Array.isArray(data) ? data : []
      );

    } catch (err) {

      console.error(
        "Failed to load emergencies:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load today's emergencies."
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

    loadEmergencies();

  }, []);


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    await loadEmergencies();
  };


  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleStatusUpdate = async (
    alertId,
    status
  ) => {

    if (!alertId) {

      console.error(
        "Cannot update emergency because alertId is missing:",
        alertId
      );

      setError(
        "Emergency ID is missing. Please refresh the page."
      );

      return;
    }

    try {

      setUpdatingId(alertId);
      setError("");

      await updateEmergencyStatus(
        alertId,
        status
      );

      await loadEmergencies();

    } catch (err) {

      console.error(
        "Failed to update emergency:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to update emergency status."
      );

    } finally {

      setUpdatingId(null);
    }
  };


  // =====================================================
  // VIEW EMERGENCY DETAILS
  // =====================================================

  const handleViewDetails = (emergency) => {

    const alertId = emergency?.alertId;

    console.log(
      "Opening emergency:",
      alertId,
      emergency
    );

    if (!alertId) {

      console.error(
        "Emergency alertId is missing:",
        emergency
      );

      setError(
        "Emergency ID is missing. Please refresh the page."
      );

      return;
    }

    navigate(
      `/hospital/emergencies/${alertId}`
    );
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
          Loading emergencies...
        </h2>

        <p>
          Please wait while we fetch today's emergency alerts.
        </p>

      </div>
    );
  }


  // =====================================================
  // COUNTS
  // =====================================================

  const pendingCount =
    emergencies.filter(
      (item) =>
        item.status === "PENDING"
    ).length;


  const acceptedCount =
    emergencies.filter(
      (item) =>
        item.status === "ACCEPTED"
    ).length;


  const resolvedCount =
    emergencies.filter(
      (item) =>
        item.status === "RESOLVED"
    ).length;


  // =====================================================
  // MAIN UI
  // =====================================================

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

            <Activity size={18} />

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

            <User size={18} />

            <span>
              Patients
            </span>

          </button>


          <p className="hospital-nav-title emergency">
            EMERGENCY
          </p>


          <button
            className="hospital-nav-item active"
          >

            <AlertTriangle size={18} />

            <span>
              Today's Emergencies
            </span>

            {pendingCount > 0 && (

              <span className="hospital-nav-badge">
                {pendingCount}
              </span>

            )}

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

            <span>
              Emergency History
            </span>

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
          MAIN CONTENT
      ================================================= */}

      <main className="hospital-dashboard-main">


        {/* HEADER */}

        <header className="hospital-dashboard-header">

          <div>

            <span className="hospital-dashboard-eyebrow">
              EMERGENCY RESPONSE
            </span>

            <h1>
              Today's Emergencies
            </h1>

            <p>
              Monitor and respond to emergency alerts
              assigned to your hospital.
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
              : "Refresh"
            }

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
            SUMMARY
        ================================================= */}

        <section className="hospital-stat-grid">


          <div className="hospital-stat-card">

            <div className="hospital-stat-icon emergency">

              <AlertTriangle size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                TOTAL ALERTS
              </span>

              <strong>
                {emergencies.length}
              </strong>

              <small>
                Emergency alerts received today
              </small>

            </div>

          </div>


          <div className="hospital-stat-card">

            <div className="hospital-stat-icon pending">

              <Clock3 size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                PENDING
              </span>

              <strong>
                {pendingCount}
              </strong>

              <small>
                Waiting for hospital response
              </small>

            </div>

          </div>


          <div className="hospital-stat-card">

            <div className="hospital-stat-icon accepted">

              <Activity size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                ACCEPTED
              </span>

              <strong>
                {acceptedCount}
              </strong>

              <small>
                Currently being handled
              </small>

            </div>

          </div>


          <div className="hospital-stat-card">

            <div className="hospital-stat-icon patients">

              <CheckCircle2 size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                RESOLVED
              </span>

              <strong>
                {resolvedCount}
              </strong>

              <small>
                Emergencies completed today
              </small>

            </div>

          </div>


        </section>


        {/* =================================================
            EMERGENCY LIST
        ================================================= */}

        <section className="hospital-dashboard-section">


          <div className="hospital-section-header">

            <div>

              <span>
                LIVE RESPONSE
              </span>

              <h2>
                Emergency Alerts
              </h2>

              <p>
                Review emergency alerts and update
                their response status.
              </p>

            </div>

          </div>


          {emergencies.length === 0 ? (

            <div className="hospital-empty-state">

              <div className="hospital-empty-icon">

                <CheckCircle2 size={24} />

              </div>

              <h3>
                No emergencies today
              </h3>

              <p>
                There are currently no emergency
                alerts assigned to your hospital.
              </p>

            </div>

          ) : (

            <div className="hospital-emergency-list">

              {emergencies.map(
                (emergency, index) => {

                  const alertId =
                    emergency?.alertId;

                  return (

                    <div
                      className="hospital-emergency-card"
                      key={
                        alertId ??
                        `emergency-${index}`
                      }
                    >


                      {/* =================================================
                          PATIENT
                      ================================================= */}

                      <div className="hospital-emergency-card-top">

                        <div className="hospital-patient-cell">

                          <div className="hospital-patient-avatar">

                            <User size={17} />

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


                        <span
                          className={`hospital-status-badge ${String(
                            emergency.status || ""
                          ).toLowerCase()}`}
                        >

                          {emergency.status ||
                            "UNKNOWN"}

                        </span>

                      </div>


                      {/* =================================================
                          DETAILS
                      ================================================= */}

                      <div className="hospital-emergency-details">


                        <div>

                          <span>

                            <Clock3 size={15} />

                            Scan Time

                          </span>

                          <strong>

                            {emergency.scanTime
                              ? new Date(
                                  emergency.scanTime
                                ).toLocaleString()
                              : "—"}

                          </strong>

                        </div>


                        <div>

                          <span>

                            <Activity size={15} />

                            Blood Group

                          </span>

                          <strong>

                            {emergency.bloodGroup ||
                              "Not available"}

                          </strong>

                        </div>


                        <div>

                          <span>

                            <Phone size={15} />

                            Phone

                          </span>

                          <strong>

                            {emergency.phone ||
                              "Not available"}

                          </strong>

                        </div>


                        <div>

                          <span>

                            <MapPin size={15} />

                            Location

                          </span>

                          <strong>

                            {emergency.latitude != null &&
                            emergency.longitude != null

                              ? `${Number(
                                  emergency.latitude
                                ).toFixed(4)}, ${Number(
                                  emergency.longitude
                                ).toFixed(4)}`

                              : "Unavailable"}

                          </strong>

                        </div>


                      </div>


                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <div className="hospital-emergency-actions">


                        <button
                          className="hospital-action-button"
                          disabled={!alertId}
                          onClick={() =>
                            handleViewDetails(
                              emergency
                            )
                          }
                        >

                          View Details

                          <ChevronRight size={15} />

                        </button>


                        {/* PENDING */}

                        {emergency.status === "PENDING" && (

                          <button
                            className="hospital-emergency-accept"
                            disabled={
                              !alertId ||
                              updatingId === alertId
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                alertId,
                                "ACCEPTED"
                              )
                            }
                          >

                            <CheckCircle2 size={16} />

                            {updatingId === alertId
                              ? "Updating..."
                              : "Accept Emergency"
                            }

                          </button>

                        )}


                        {/* ACCEPTED */}

                        {emergency.status === "ACCEPTED" && (

                          <button
                            className="hospital-emergency-resolve"
                            disabled={
                              !alertId ||
                              updatingId === alertId
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                alertId,
                                "RESOLVED"
                              )
                            }
                          >

                            <CheckCircle2 size={16} />

                            {updatingId === alertId
                              ? "Updating..."
                              : "Mark Resolved"
                            }

                          </button>

                        )}


                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}


export default HospitalEmergencies;