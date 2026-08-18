import { useEffect, useState } from "react";

import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Edit3,
  HeartPulse,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getAllPatients,
  updatePatient,
} from "../../services/adminApi";


function AdminPatients() {

  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [editingPatient, setEditingPatient] = useState(null);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =====================================================
  // LOAD PATIENTS
  // =====================================================

  const loadPatients = async (pageNumber = page) => {

    try {

      setError("");

      const data = await getAllPatients(pageNumber, 15);

      setPatients(
        Array.isArray(data?.content)
          ? data.content
          : []
      );

      setTotalPages(data?.totalPages || 0);

      setTotalElements(data?.totalElements || 0);

    } catch (err) {

      console.error("Failed to load patients:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load patients."
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

    loadPatients(0);

  }, []);


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    await loadPatients(page);

  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredPatients = patients.filter((patient) => {

    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    return (
      String(patient.patientId || "")
        .toLowerCase()
        .includes(searchValue) ||

      String(patient.gender || "")
        .toLowerCase()
        .includes(searchValue) ||

      String(patient.bloodGroup || "")
        .toLowerCase()
        .includes(searchValue) ||

      String(patient.city || "")
        .toLowerCase()
        .includes(searchValue) ||

      String(patient.state || "")
        .toLowerCase()
        .includes(searchValue)
    );

  });


  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const changePage = async (newPage) => {

    if (
      newPage < 0 ||
      newPage >= totalPages
    ) {
      return;
    }

    setPage(newPage);

    await loadPatients(newPage);

  };


  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleEdit = (patient) => {

    setError("");
    setSuccess("");

    setEditingPatient({

      patientId: patient.patientId,

      // IMPORTANT:
      // Use actual userId returned by backend.
      userId: patient.userId,

      gender: patient.gender || "",

      bloodGroup: patient.bloodGroup || "",

      dateOfBirth: patient.dateOfBirth || "",

      height: patient.height ?? "",

      weight: patient.weight ?? "",

      allergies: patient.allergies || "",

      medicalConditions:
        patient.medicalConditions || "",

      currentMedications:
        patient.currentMedications || "",

      address: patient.address || "",

      city: patient.city || "",

      pinCode: patient.pinCode || "",

      state: patient.state || "",

      country: patient.country || "",
    });

  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setEditingPatient((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =====================================================
  // SAVE PATIENT
  // =====================================================

  const handleSave = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const patientData = {

        userId: Number(editingPatient.userId),

        gender: editingPatient.gender,

        bloodGroup: editingPatient.bloodGroup,

        dateOfBirth: editingPatient.dateOfBirth,

        height:
          editingPatient.height !== ""
            ? Number(editingPatient.height)
            : null,

        weight:
          editingPatient.weight !== ""
            ? Number(editingPatient.weight)
            : null,

        allergies:
          editingPatient.allergies || "",

        medicalConditions:
          editingPatient.medicalConditions || "",

        currentMedications:
          editingPatient.currentMedications || "",

        address:
          editingPatient.address || "",

        city:
          editingPatient.city || "",

        pinCode:
          editingPatient.pinCode || "",

        state:
          editingPatient.state || "",

        country:
          editingPatient.country || "",
      };


      await updatePatient(
        editingPatient.patientId,
        patientData
      );


      setEditingPatient(null);

      setSuccess(
        "Patient updated successfully."
      );


      // Reload current page so the latest
      // backend data appears immediately.
      await loadPatients(page);

    } catch (err) {

      console.error(
        "Failed to update patient:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to update patient."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    navigate("/login");

  };


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
          Loading patients...
        </h2>

        <p>
          Please wait while we fetch patient records.
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
            <strong>
              LifeLink
            </strong>

            <span>
              Admin Portal
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
              navigate("/admin/dashboard")
            }
          >
            <Activity size={18} />

            <span>
              Dashboard
            </span>

          </button>


          <button
            className="hospital-nav-item"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >

            <HeartPulse size={18} />

            <span>
              Hospitals
            </span>

          </button>


          <button
            className="hospital-nav-item active"
          >

            <User size={18} />

            <span>
              Patients
            </span>

          </button>

        </nav>


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
              PATIENT MANAGEMENT
            </span>

            <h1>
              Patients
            </h1>

            <p>
              View and manage registered LifeLink patients.
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

            <Activity size={18} />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* SUCCESS */}

        {success && (

          <div className="admin-success-message">

            <HeartPulse size={18} />

            <span>
              {success}
            </span>

            <button
              onClick={() =>
                setSuccess("")
              }
            >
              <X size={16} />
            </button>

          </div>

        )}


        {/* =================================================
            STATS
        ================================================= */}

        <section className="hospital-stat-grid">

          <div className="hospital-stat-card">

            <div className="hospital-stat-icon patients">
              <User size={21} />
            </div>

            <div className="hospital-stat-content">

              <span>
                TOTAL PATIENTS
              </span>

              <strong>
                {totalElements}
              </strong>

              <small>
                Registered LifeLink patients
              </small>

            </div>

          </div>


          <div className="hospital-stat-card">

            <div className="hospital-stat-icon accepted">
              <HeartPulse size={21} />
            </div>

            <div className="hospital-stat-content">

              <span>
                CURRENT PAGE
              </span>

              <strong>
                {patients.length}
              </strong>

              <small>
                Patients displayed
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            PATIENT MANAGEMENT
        ================================================= */}

        <section className="hospital-dashboard-section">

          <div className="hospital-section-header">

            <div>

              <span>
                PATIENT DIRECTORY
              </span>

              <h2>
                Registered Patients
              </h2>

              <p>
                Search, review and update patient information.
              </p>

            </div>

          </div>


          {/* SEARCH */}

          <div className="admin-hospital-filter-bar">

            <div className="admin-hospital-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search by patient ID, gender, blood group or location..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>


          {/* PATIENT LIST */}

          {filteredPatients.length === 0 ? (

            <div className="hospital-empty-state">

              <div className="hospital-empty-icon">
                <User size={24} />
              </div>

              <h3>
                No patients found
              </h3>

              <p>
                No patients match your current search.
              </p>

            </div>

          ) : (

            <div className="admin-hospital-list">

              {filteredPatients.map((patient) => (

                <div
                  className="admin-hospital-card"
                  key={patient.patientId}
                >


                  {/* TOP */}

                  <div className="admin-hospital-card-top">

                    <div className="admin-hospital-identity">

                      <div className="admin-hospital-icon">
                        <User size={21} />
                      </div>

                      <div>

                        <strong>
                          Patient #{patient.patientId}
                        </strong>

                        <span>
                          {patient.gender ||
                            "Gender not available"}
                        </span>

                      </div>

                    </div>


                    <span className="admin-hospital-status approved">

                      {patient.bloodGroup ||
                        "Blood group unavailable"}

                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="admin-hospital-details">

                    <div>

                      <span>
                        Date of Birth
                      </span>

                      <strong>
                        {patient.dateOfBirth ||
                          "Not available"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Location
                      </span>

                      <strong>

                        {patient.city ||
                          "Unknown"}

                        {patient.state &&
                          `, ${patient.state}`}

                      </strong>

                    </div>


                    <div>

                      <span>
                        Height / Weight
                      </span>

                      <strong>

                        {patient.height != null
                          ? `${patient.height} cm`
                          : "—"}

                        {" / "}

                        {patient.weight != null
                          ? `${patient.weight} kg`
                          : "—"}

                      </strong>

                    </div>

                  </div>


                  {/* MEDICAL INFO */}

                  <div className="admin-patient-medical">

                    <div>

                      <span>
                        Allergies
                      </span>

                      <p>
                        {patient.allergies ||
                          "None recorded"}
                      </p>

                    </div>


                    <div>

                      <span>
                        Medical Conditions
                      </span>

                      <p>
                        {patient.medicalConditions ||
                          "None recorded"}
                      </p>

                    </div>

                  </div>


                  {/* ACTION */}

                  <div className="admin-hospital-actions">

                    <button
                      className="admin-approve-button"
                      onClick={() =>
                        handleEdit(patient)
                      }
                    >

                      <Edit3 size={16} />

                      Edit Patient

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}


          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages > 1 && (

            <div className="admin-pagination">

              <button
                disabled={page === 0}
                onClick={() =>
                  changePage(page - 1)
                }
              >

                <ChevronLeft size={17} />

                Previous

              </button>


              <span>

                Page{" "}
                <strong>
                  {page + 1}
                </strong>{" "}
                of{" "}
                <strong>
                  {totalPages}
                </strong>

              </span>


              <button
                disabled={
                  page >= totalPages - 1
                }
                onClick={() =>
                  changePage(page + 1)
                }
              >

                Next

                <ChevronRight size={17} />

              </button>

            </div>

          )}

        </section>

      </main>


      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingPatient && (

        <div className="admin-modal-overlay">

          <div className="admin-modal">


            {/* HEADER */}

            <div className="admin-modal-header">

              <div>

                <span>
                  PATIENT MANAGEMENT
                </span>

                <h2>
                  Edit Patient
                </h2>

              </div>


              <button
                onClick={() =>
                  setEditingPatient(null)
                }
              >
                <X size={20} />
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSave}
              className="admin-patient-form"
            >


              {/* BASIC */}

              <div className="admin-form-section">

                <h3>
                  Basic Information
                </h3>


                <div className="admin-form-grid">


                  <div className="admin-form-group">

                    <label>
                      Patient ID
                    </label>

                    <input
                      value={
                        editingPatient.patientId
                      }
                      disabled
                    />

                  </div>


                  <div className="admin-form-group">

                    <label>
                      User ID
                    </label>

                    <input
                      value={
                        editingPatient.userId ?? ""
                      }
                      disabled
                    />

                  </div>


                  <div className="admin-form-group">

                    <label>
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={
                        editingPatient.gender
                      }
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select gender
                      </option>

                      <option value="MALE">
                        Male
                      </option>

                      <option value="FEMALE">
                        Female
                      </option>

                      <option value="OTHER">
                        Other
                      </option>

                    </select>

                  </div>


                  <div className="admin-form-group">

                    <label>
                      Blood Group
                    </label>

                    <select
                      name="bloodGroup"
                      value={
                        editingPatient.bloodGroup
                      }
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select blood group
                      </option>

                      <option value="A_Positive">
                        A+
                      </option>

                      <option value="A_Negative">
                        A-
                      </option>

                      <option value="B_Positive">
                        B+
                      </option>

                      <option value="B_Negative">
                        B-
                      </option>

                      <option value="AB_Positive">
                        AB+
                      </option>

                      <option value="AB_Negative">
                        AB-
                      </option>

                      <option value="O_Positive">
                        O+
                      </option>

                      <option value="O_Negative">
                        O-
                      </option>

                    </select>

                  </div>


                  <div className="admin-form-group">

                    <label>
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={
                        editingPatient.dateOfBirth || ""
                      }
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="admin-form-group">

                    <label>
                      Height
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      name="height"
                      value={
                        editingPatient.height
                      }
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="admin-form-group">

                    <label>
                      Weight
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      name="weight"
                      value={
                        editingPatient.weight
                      }
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

              </div>


              {/* MEDICAL */}

              <div className="admin-form-section">

                <h3>
                  Medical Information
                </h3>


                <div className="admin-form-group">

                  <label>
                    Allergies
                  </label>

                  <textarea
                    name="allergies"
                    value={
                      editingPatient.allergies
                    }
                    onChange={handleChange}
                    rows="3"
                  />

                </div>


                <div className="admin-form-group">

                  <label>
                    Medical Conditions
                  </label>

                  <textarea
                    name="medicalConditions"
                    value={
                      editingPatient.medicalConditions
                    }
                    onChange={handleChange}
                    rows="3"
                  />

                </div>


                <div className="admin-form-group">

                  <label>
                    Current Medications
                  </label>

                  <textarea
                    name="currentMedications"
                    value={
                      editingPatient.currentMedications
                    }
                    onChange={handleChange}
                    rows="3"
                  />

                </div>

              </div>


              {/* LOCATION */}

              <div className="admin-form-section">

                <h3>
                  Address
                </h3>


                <div className="admin-form-grid">


                  <div className="admin-form-group full">

                    <label>
                      Address
                    </label>

                    <input
                      name="address"
                      value={
                        editingPatient.address
                      }
                      onChange={handleChange}
                    />

                  </div>


                  <div className="admin-form-group">

                    <label>
                      City
                    </label>

                    <input
                      name="city"
                      value={
                        editingPatient.city
                      }
                      onChange={handleChange}
                    />

                  </div>


                  <div className="admin-form-group">

                    <label>
                      PIN Code
                    </label>

                    <input
                      name="pinCode"
                      value={
                        editingPatient.pinCode
                      }
                      onChange={handleChange}
                    />

                  </div>


                  <div className="admin-form-group">

                    <label>
                      State
                    </label>

                    <input
                      name="state"
                      value={
                        editingPatient.state
                      }
                      onChange={handleChange}
                    />

                  </div>


                  <div className="admin-form-group">

                    <label>
                      Country
                    </label>

                    <input
                      name="country"
                      value={
                        editingPatient.country
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-modal-cancel"
                  onClick={() =>
                    setEditingPatient(null)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="admin-approve-button"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}

export default AdminPatients;