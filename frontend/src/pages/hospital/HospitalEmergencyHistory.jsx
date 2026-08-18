import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  User,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getEmergencyHistory } from "../../services/hospitalApi";


function HospitalEmergencyHistory() {

  const navigate = useNavigate();

  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");


  // =====================================================
  // LOAD HISTORY
  // =====================================================

  const loadHistory = async () => {

    try {

      setError("");

      const data = await getEmergencyHistory();

      setEmergencies(
        Array.isArray(data) ? data : []
      );

    } catch (err) {

      console.error(
        "Failed to load emergency history:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load emergency history."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  useEffect(() => {

    loadHistory();

  }, []);


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    await loadHistory();

  };


  // =====================================================
  // FILTER
  // =====================================================

  const filteredEmergencies = useMemo(() => {

    return emergencies.filter((emergency) => {

      const patientName =
        emergency.patientName || "";

      const matchesSearch =
        patientName
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        emergency.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [
    emergencies,
    search,
    statusFilter
  ]);


  // =====================================================
  // COUNTS
  // =====================================================

  const totalCount = emergencies.length;

  const acceptedCount =
    emergencies.filter(
      item => item.status === "ACCEPTED"
    ).length;

  const resolvedCount =
    emergencies.filter(
      item => item.status === "RESOLVED"
    ).length;


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="hospital-dashboard-loading">

        <div className="hospital-dashboard-loading-icon">
          <Clock3 size={28} />
        </div>

        <h2>
          Loading emergency history...
        </h2>

        <p>
          Please wait while we fetch previous emergency alerts.
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

        <div className="hospital-sidebar-logo">

          <div className="hospital-sidebar-logo-icon">
            <Activity size={22} />
          </div>

          <div>
            <strong>LifeLink</strong>
            <span>Hospital Portal</span>
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
            className="hospital-nav-item"
            onClick={() =>
              navigate("/hospital/emergencies")
            }
          >
            <AlertTriangle size={18} />
            <span>Today's Emergencies</span>
          </button>


          <button
            className="hospital-nav-item active"
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
              Emergency History
            </h1>

            <p>
              Review previous emergency alerts handled by your hospital.
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
            SUMMARY
        ================================================= */}

        <section className="hospital-stat-grid">


          <div className="hospital-stat-card">

            <div className="hospital-stat-icon emergency">
              <AlertTriangle size={21} />
            </div>

            <div className="hospital-stat-content">

              <span>
                TOTAL EMERGENCIES
              </span>

              <strong>
                {totalCount}
              </strong>

              <small>
                All recorded emergency alerts
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
                Emergencies accepted by hospital
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
                Successfully completed emergencies
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            HISTORY
        ================================================= */}

        <section className="hospital-dashboard-section">


          <div className="hospital-section-header">

            <div>

              <span>
                RECORDS
              </span>

              <h2>
                Previous Emergencies
              </h2>

              <p>
                Search and review emergency alerts from your hospital.
              </p>

            </div>

          </div>


          {/* FILTER BAR */}

          <div className="hospital-history-filter-bar">


            <div className="hospital-history-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search by patient name..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <select
              className="hospital-history-status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <option value="ALL">
                All Statuses
              </option>

              <option value="ACCEPTED">
                Accepted
              </option>

              <option value="RESOLVED">
                Resolved
              </option>

              <option value="PENDING">
                Pending
              </option>

            </select>


          </div>


          {/* EMPTY */}

          {filteredEmergencies.length === 0 ? (

            <div className="hospital-empty-state">

              <div className="hospital-empty-icon">

                <CheckCircle2 size={24} />

              </div>

              <h3>
                No emergency records found
              </h3>

              <p>
                No emergency history matches your current search or filter.
              </p>

            </div>

          ) : (


            <div className="hospital-history-list">


              {filteredEmergencies.map(
                (emergency) => (

                  <div
                    className="hospital-history-card"
                    key={emergency.alertId}
                  >


                    <div className="hospital-history-main">


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


                    <div className="hospital-history-details">


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
                          Blood Group
                        </span>

                        <strong>
                          {emergency.bloodGroup ||
                            "Not available"}
                        </strong>

                      </div>


                      <div>

                        <span>
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


                    <div className="hospital-history-action">

                      <button
                        className="hospital-action-button"
                        onClick={() =>
                          navigate(
                            `/hospital/emergencies/${emergency.alertId}`
                          )
                        }
                      >

                        View Details

                        <ChevronRight size={15} />

                      </button>

                    </div>


                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>

  );

}


export default HospitalEmergencyHistory;