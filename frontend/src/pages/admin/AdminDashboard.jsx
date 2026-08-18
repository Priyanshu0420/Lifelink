import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock3,
  LogOut,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getAllHospitals,
  approveHospital,
  rejectHospital,
} from "../../services/adminApi";


function AdminDashboard() {

  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [processingId, setProcessingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =====================================================
  // LOAD HOSPITALS
  // =====================================================

  const loadHospitals = async () => {

    try {

      setError("");

      const data = await getAllHospitals();

      setHospitals(
        Array.isArray(data) ? data : []
      );

    } catch (err) {

      console.error(
        "Failed to load hospitals:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load hospitals."
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

    loadHospitals();

  }, []);


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    await loadHospitals();

  };


  // =====================================================
  // APPROVE
  // =====================================================

  const handleApprove = async (hospitalId) => {

    try {

      setProcessingId(hospitalId);

      setError("");
      setSuccess("");

      await approveHospital(hospitalId);

      setSuccess(
        "Hospital approved successfully."
      );

      await loadHospitals();

    } catch (err) {

      console.error(
        "Failed to approve hospital:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to approve hospital."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // REJECT
  // =====================================================

  const handleReject = async (hospitalId) => {

    try {

      setProcessingId(hospitalId);

      setError("");
      setSuccess("");

      await rejectHospital(hospitalId);

      setSuccess(
        "Hospital rejected successfully."
      );

      await loadHospitals();

    } catch (err) {

      console.error(
        "Failed to reject hospital:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to reject hospital."
      );

    } finally {

      setProcessingId(null);

    }

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
  // COUNTS
  // =====================================================

  const totalHospitals = hospitals.length;

  const pendingHospitals =
    hospitals.filter(
      hospital =>
        String(hospital.status).toUpperCase() ===
        "PENDING"
    ).length;

  const approvedHospitals =
    hospitals.filter(
      hospital =>
        String(hospital.status).toUpperCase() ===
        "APPROVED"
    ).length;

  const rejectedHospitals =
    hospitals.filter(
      hospital =>
        String(hospital.status).toUpperCase() ===
        "REJECTED"
    ).length;


  // =====================================================
  // FILTER
  // =====================================================

  const filteredHospitals = useMemo(() => {

    return hospitals.filter((hospital) => {

      const hospitalName =
        hospital.hospitalName || "";

      const city =
        hospital.city || "";

      const email =
        hospital.email || "";

      const matchesSearch =
        hospitalName
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        city
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        String(hospital.status).toUpperCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [
    hospitals,
    search,
    statusFilter
  ]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="hospital-dashboard-loading">

        <div className="hospital-dashboard-loading-icon">

          <Activity size={28} />

        </div>

        <h2>
          Loading admin dashboard...
        </h2>

        <p>
          Please wait while we fetch hospital registrations.
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

            <Activity size={22} />

          </div>

          <div>

            <strong>
              LifeLink
            </strong>

            <span>
              Admin Portal
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
          >

            <Activity size={18} />

            <span>
              Dashboard
            </span>

          </button>


          <button
            className="hospital-nav-item"
            onClick={() =>
              document
                .getElementById("admin-hospitals")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >

            <Building2 size={18} />

            <span>
              Hospitals
            </span>

            {pendingHospitals > 0 && (

              <span className="hospital-nav-badge">
                {pendingHospitals}
              </span>

            )}

          </button>


          <button
            className="hospital-nav-item"
            onClick={() =>
              navigate("/admin/patients")
            }
          >

            <Activity size={18} />

            <span>
              Patients
            </span>

          </button>


        </nav>


        {/* ACCOUNT */}

        <div className="hospital-sidebar-bottom">


          <div className="hospital-sidebar-account">

            <div className="hospital-account-avatar">

              <Activity size={17} />

            </div>

            <div>

              <strong>
                Administrator
              </strong>

              <span>
                ADMIN
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
          MAIN
      ================================================= */}

      <main className="hospital-dashboard-main">


        {/* HEADER */}

        <header className="hospital-dashboard-header">


          <div>

            <span className="hospital-dashboard-eyebrow">
              ADMIN PORTAL
            </span>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage hospital registrations and LifeLink access.
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


        {/* SUCCESS */}

        {success && (

          <div className="admin-success-message">

            <CheckCircle2 size={18} />

            <span>
              {success}
            </span>

            <button
              onClick={() => setSuccess("")}
            >
              <XCircle size={16} />
            </button>

          </div>

        )}


        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="hospital-stat-grid">


          <div className="hospital-stat-card">

            <div className="hospital-stat-icon patients">

              <Building2 size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                TOTAL HOSPITALS
              </span>

              <strong>
                {totalHospitals}
              </strong>

              <small>
                Registered hospitals
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
                {pendingHospitals}
              </strong>

              <small>
                Awaiting approval
              </small>

            </div>

          </div>


          <div className="hospital-stat-card">

            <div className="hospital-stat-icon accepted">

              <CheckCircle2 size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                APPROVED
              </span>

              <strong>
                {approvedHospitals}
              </strong>

              <small>
                Active hospital accounts
              </small>

            </div>

          </div>


          <div className="hospital-stat-card">

            <div className="hospital-stat-icon emergency">

              <XCircle size={21} />

            </div>

            <div className="hospital-stat-content">

              <span>
                REJECTED
              </span>

              <strong>
                {rejectedHospitals}
              </strong>

              <small>
                Rejected registrations
              </small>

            </div>

          </div>


        </section>


        {/* =================================================
            HOSPITAL MANAGEMENT
        ================================================= */}

        <section
          className="hospital-dashboard-section"
          id="admin-hospitals"
        >


          <div className="hospital-section-header">

            <div>

              <span>
                HOSPITAL MANAGEMENT
              </span>

              <h2>
                Hospital Registrations
              </h2>

              <p>
                Review hospital registration requests and manage access.
              </p>

            </div>

          </div>


          {/* FILTER BAR */}

          <div className="admin-hospital-filter-bar">


            <div className="admin-hospital-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search hospital, city or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <select
              className="admin-hospital-status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <option value="ALL">
                All Statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="APPROVED">
                Approved
              </option>

              <option value="REJECTED">
                Rejected
              </option>

            </select>


          </div>


          {/* EMPTY */}

          {filteredHospitals.length === 0 ? (

            <div className="hospital-empty-state">

              <div className="hospital-empty-icon">

                <Building2 size={24} />

              </div>

              <h3>
                No hospitals found
              </h3>

              <p>
                No hospital registrations match your current search or filter.
              </p>

            </div>

          ) : (


            <div className="admin-hospital-list">


              {filteredHospitals.map(
                (hospital) => {

                  const status =
                    String(
                      hospital.status || ""
                    ).toUpperCase();

                  const isProcessing =
                    processingId ===
                    hospital.hospitalId;


                  return (

                    <div
                      className="admin-hospital-card"
                      key={hospital.hospitalId}
                    >


                      {/* TOP */}

                      <div className="admin-hospital-card-top">


                        <div className="admin-hospital-identity">

                          <div className="admin-hospital-icon">

                            <Building2 size={21} />

                          </div>


                          <div>

                            <strong>
                              {hospital.hospitalName ||
                                "Unnamed Hospital"}
                            </strong>

                            <span>
                              {hospital.email ||
                                "No email available"}
                            </span>

                          </div>

                        </div>


                        <span
                          className={`admin-hospital-status ${status.toLowerCase()}`}
                        >

                          {status || "UNKNOWN"}

                        </span>


                      </div>


                      {/* DETAILS */}

                      <div className="admin-hospital-details">


                        <div>

                          <span>
                            Location
                          </span>

                          <strong>

                            {hospital.city ||
                              "Unknown city"}

                            {hospital.state &&
                              `, ${hospital.state}`}

                          </strong>

                        </div>


                        <div>

                          <span>
                            Phone
                          </span>

                          <strong>
                            {hospital.phone ||
                              "Not available"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            License
                          </span>

                          <strong>
                            {hospital.licenseNumber ||
                              "Not available"}
                          </strong>

                        </div>


                      </div>


                      {/* ACTIONS */}

                      {status === "PENDING" && (

                        <div className="admin-hospital-actions">


                          <button
                            className="admin-reject-button"
                            disabled={isProcessing}
                            onClick={() =>
                              handleReject(
                                hospital.hospitalId
                              )
                            }
                          >

                            <XCircle size={16} />

                            {isProcessing
                              ? "Processing..."
                              : "Reject"}

                          </button>


                          <button
                            className="admin-approve-button"
                            disabled={isProcessing}
                            onClick={() =>
                              handleApprove(
                                hospital.hospitalId
                              )
                            }
                          >

                            <CheckCircle2 size={16} />

                            {isProcessing
                              ? "Processing..."
                              : "Approve"}

                          </button>


                        </div>

                      )}

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


export default AdminDashboard;