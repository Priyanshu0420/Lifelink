import { useEffect, useState } from "react";

import {
  Hospital,
  Users,
  AlertTriangle,
  Clock3,
  Activity,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  LogOut,
  X,
  MapPin,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getHospitalProfile,
  getMyPatients,
  searchPatients,
  filterPatients,
} from "../../services/hospitalApi";


function HospitalPatients() {

  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [hospital, setHospital] = useState(null);

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [searchType, setSearchType] = useState("name");

  const [searchValue, setSearchValue] = useState("");

  const [gender, setGender] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");

  const [city, setCity] = useState("");

  const [state, setState] = useState("");

  const [country, setCountry] = useState("");

  const [email, setEmail] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD HOSPITAL + PATIENTS
  // =====================================================

  const loadPatients = async () => {

    try {

      setError("");

      const [hospitalData, patientsData] =
        await Promise.all([
          getHospitalProfile(),
          getMyPatients(),
        ]);

      setHospital(hospitalData);

      setPatients(
        Array.isArray(patientsData)
          ? patientsData
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load patients:",
        err
      );

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

    loadPatients();

  }, []);


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    await loadPatients();

  };


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = async () => {

    if (!searchValue.trim()) {

      await loadPatients();

      return;

    }

    try {

      setError("");

      const data = await searchPatients(
        searchType === "patientId"
          ? searchValue
          : null,
        searchType === "name"
          ? searchValue
          : null
      );

      setPatients(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Patient search failed:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to search patients."
      );

    }

  };


  // =====================================================
  // FILTER
  // =====================================================

  const handleFilter = async () => {

    try {

      setError("");

      const data = await filterPatients({
        gender,
        bloodGroup,
        city,
        state,
        country,
        email,
      });

      setPatients(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Patient filtering failed:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to filter patients."
      );

    }

  };


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = async () => {

    setGender("");
    setBloodGroup("");
    setCity("");
    setState("");
    setCountry("");
    setEmail("");
    setSearchValue("");

    setShowFilters(false);

    await loadPatients();

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
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="hospital-dashboard-loading">

        <div className="hospital-dashboard-loading-icon">

          <Hospital size={28} />

        </div>

        <h2>
          Loading patients...
        </h2>

        <p>
          Please wait while we fetch your patient records.
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

            <Hospital size={18} />

            <span>
              Hospital Profile
            </span>

          </button>


          <button
            className="hospital-nav-item active"
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
              View and manage patients assigned to{" "}
              <strong>
                {hospital?.hospitalName ||
                  "your hospital"}
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
            PATIENT SUMMARY
        ================================================= */}

        <div className="hospital-patients-summary">

          <div className="hospital-patients-summary-icon">

            <Users size={22} />

          </div>

          <div>

            <span>
              TOTAL PATIENTS
            </span>

            <strong>
              {patients.length}
            </strong>

          </div>

        </div>


        {/* =================================================
            SEARCH BAR
        ================================================= */}

        <section className="hospital-patients-tools">

          <div className="hospital-patient-search">

            <Search size={19} />

            <select
              value={searchType}
              onChange={(e) =>
                setSearchType(e.target.value)
              }
            >

              <option value="name">
                Name
              </option>

              <option value="patientId">
                Patient ID
              </option>

            </select>


            <input
              type="text"
              placeholder={
                searchType === "name"
                  ? "Search patient by name..."
                  : "Enter patient ID..."
              }
              value={searchValue}
              onChange={(e) =>
                setSearchValue(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  handleSearch();
                }

              }}
            />


            {searchValue && (

              <button
                className="hospital-search-clear"
                onClick={() => {
                  setSearchValue("");
                  loadPatients();
                }}
              >

                <X size={17} />

              </button>

            )}


            <button
              className="hospital-search-button"
              onClick={handleSearch}
            >

              Search

            </button>

          </div>


          <button
            className={`hospital-filter-toggle ${
              showFilters ? "active" : ""
            }`}
            onClick={() =>
              setShowFilters(!showFilters)
            }
          >

            <Filter size={17} />

            Filters

          </button>

        </section>


        {/* =================================================
            FILTER PANEL
        ================================================= */}

        {showFilters && (

          <section className="hospital-patient-filter-panel">

            <div className="hospital-filter-header">

              <div>

                <span>
                  FILTER PATIENTS
                </span>

                <h3>
                  Refine patient records
                </h3>

              </div>

              <button
                className="hospital-filter-close"
                onClick={() =>
                  setShowFilters(false)
                }
              >

                <X size={18} />

              </button>

            </div>


            <div className="hospital-filter-grid">


              {/* GENDER */}

              <div className="hospital-filter-field">

                <label>
                  Gender
                </label>

                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value)
                  }
                >

                  <option value="">
                    All genders
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


              {/* BLOOD GROUP */}

              <div className="hospital-filter-field">

                <label>
                  Blood Group
                </label>

                <select
                  value={bloodGroup}
                  onChange={(e) =>
                    setBloodGroup(e.target.value)
                  }
                >

                  <option value="">
                    All blood groups
                  </option>

                  <option value="A_POSITIVE">
                    A+
                  </option>

                  <option value="A_NEGATIVE">
                    A-
                  </option>

                  <option value="B_POSITIVE">
                    B+
                  </option>

                  <option value="B_NEGATIVE">
                    B-
                  </option>

                  <option value="AB_POSITIVE">
                    AB+
                  </option>

                  <option value="AB_NEGATIVE">
                    AB-
                  </option>

                  <option value="O_POSITIVE">
                    O+
                  </option>

                  <option value="O_NEGATIVE">
                    O-
                  </option>

                </select>

              </div>


              {/* CITY */}

              <div className="hospital-filter-field">

                <label>
                  City
                </label>

                <input
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                />

              </div>


              {/* STATE */}

              <div className="hospital-filter-field">

                <label>
                  State
                </label>

                <input
                  type="text"
                  placeholder="Enter state"
                  value={state}
                  onChange={(e) =>
                    setState(e.target.value)
                  }
                />

              </div>


              {/* COUNTRY */}

              <div className="hospital-filter-field">

                <label>
                  Country
                </label>

                <input
                  type="text"
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) =>
                    setCountry(e.target.value)
                  }
                />

              </div>


              {/* EMAIL */}

              <div className="hospital-filter-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="hospital-filter-actions">

              <button
                className="hospital-filter-clear-button"
                onClick={clearFilters}
              >

                Clear filters

              </button>


              <button
                className="hospital-filter-apply-button"
                onClick={handleFilter}
              >

                <Filter size={16} />

                Apply filters

              </button>

            </div>

          </section>

        )}


        {/* =================================================
            PATIENT TABLE
        ================================================= */}

        <section className="hospital-patients-section">


          <div className="hospital-patients-section-header">

            <div>

              <span>
                PATIENT RECORDS
              </span>

              <h2>
                Your Patients
              </h2>

            </div>

            <span className="hospital-patient-count">
              {patients.length} patients
            </span>

          </div>


          {patients.length === 0 ? (

            <div className="hospital-patients-empty">

              <div className="hospital-empty-icon">

                <Users size={25} />

              </div>

              <h3>
                No patients found
              </h3>

              <p>
                Try changing your search or filter criteria.
              </p>

              <button
                onClick={clearFilters}
                className="hospital-filter-clear-button"
              >
                Clear search
              </button>

            </div>

          ) : (

            <div className="hospital-patients-table-wrapper">

              <table className="hospital-patients-table">

                <thead>

                  <tr>

                    <th>
                      PATIENT
                    </th>

                    <th>
                      GENDER
                    </th>

                    <th>
                      BLOOD GROUP
                    </th>

                    <th>
                      CONTACT
                    </th>

                    <th>
                      LOCATION
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {patients.map(
                    (patient, index) => (

                      <tr
                        key={
                          patient.patientId ||
                          patient.id ||
                          index
                        }
                      >


                        {/* PATIENT */}

                        <td>

                          <div className="hospital-patient-cell">

                            <div className="hospital-patient-avatar">

                              <UserRound size={17} />

                            </div>

                            <div>

                              <strong>
                                {patient.patientName ||
                                  patient.name ||
                                  "Unknown Patient"}
                              </strong>

                              <span>
                                ID:{" "}
                                {patient.patientId ||
                                  patient.id ||
                                  "—"}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* GENDER */}

                        <td>

                          <span className="hospital-patient-text">

                            {patient.gender ||
                              "—"}

                          </span>

                        </td>


                        {/* BLOOD GROUP */}

                        <td>

                          <span className="hospital-blood-badge">

                            {formatBloodGroup(
                              patient.bloodGroup
                            )}

                          </span>

                        </td>


                        {/* CONTACT */}

                        <td>

                          <div className="hospital-contact-cell">

                            {patient.phone && (

                              <span>

                                <Phone size={14} />

                                {patient.phone}

                              </span>

                            )}

                            {patient.email && (

                              <span>

                                <Mail size={14} />

                                {patient.email}

                              </span>

                            )}

                            {!patient.phone &&
                              !patient.email && (

                                <span>
                                  —
                                </span>

                              )}

                          </div>

                        </td>


                        {/* LOCATION */}

                        <td>

                          <div className="hospital-patient-location">

                            {patient.city ||
                            patient.state ? (

                              <>

                                <MapPin size={14} />

                                <span>

                                  {patient.city ||
                                    ""}

                                  {patient.city &&
                                  patient.state
                                    ? ", "
                                    : ""}

                                  {patient.state ||
                                    ""}

                                </span>

                              </>

                            ) : (

                              <span>
                                —
                              </span>

                            )}

                          </div>

                        </td>


                        {/* ACTION */}

                        <td>

                          <button
                            className="hospital-patient-view-button"
                            onClick={() => {

                              // Patient details page can be
                              // added later without changing
                              // this table.

                              console.log(
                                "Patient:",
                                patient
                              );

                            }}
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


      </main>

    </div>

  );

}


// =====================================================
// BLOOD GROUP FORMATTER
// =====================================================

function formatBloodGroup(value) {

  if (!value) {
    return "—";
  }

  const bloodGroupMap = {

    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",

    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",

    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",

    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",

  };

  return (
    bloodGroupMap[value] ||
    value.replace("_POSITIVE", "+")
      .replace("_NEGATIVE", "-")
  );

}


export default HospitalPatients;