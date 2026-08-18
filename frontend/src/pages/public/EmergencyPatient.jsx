import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Activity,
  AlertCircle,
  MapPin,
  Phone,
  ShieldCheck,
  Siren,
} from "lucide-react";

import api from "../../services/api";

function EmergencyPatient() {
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sendingSOS, setSendingSOS] = useState(false);
  const [sosSuccess, setSosSuccess] = useState("");
  const [sosError, setSosError] = useState("");

  // =====================================================
  // LOAD PATIENT
  // =====================================================

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/public/patient/${patientId}`
        );

        console.log(
          "PUBLIC PATIENT RESPONSE:",
          response.data
        );

        setPatient(response.data);
      } catch (err) {
        console.error(
          "Failed to load emergency patient:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load patient emergency information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      loadPatient();
    } else {
      setError("Invalid patient ID.");
      setLoading(false);
    }
  }, [patientId]);

  // =====================================================
  // GET CURRENT LOCATION
  // =====================================================

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error(
            "Geolocation is not supported by this browser."
          )
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } =
            position.coords;

          if (
            typeof latitude !== "number" ||
            typeof longitude !== "number"
          ) {
            reject(
              new Error(
                "Unable to retrieve a valid location."
              )
            );

            return;
          }

          resolve({
            latitude,
            longitude,
          });
        },

        (error) => {
          let message =
            "Unable to get your current location.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message =
                "Location permission was denied. Please allow location access and try again.";
              break;

            case error.POSITION_UNAVAILABLE:
              message =
                "Your current location is unavailable. Please try again.";
              break;

            case error.TIMEOUT:
              message =
                "Location request timed out. Please try again.";
              break;

            default:
              message =
                "Unable to get your current location.";
          }

          reject(new Error(message));
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // =====================================================
  // SEND SOS
  // =====================================================

  const handleSOS = async () => {
    if (!patientId || sendingSOS) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to send an emergency SOS alert?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSendingSOS(true);
      setSosSuccess("");
      setSosError("");

      // -------------------------------------------------
      // GET LOCATION
      // -------------------------------------------------

      let location;

      try {
        location = await getCurrentLocation();
      } catch (locationError) {
        console.error(
          "LOCATION ERROR:",
          locationError
        );

        setSosError(
          locationError?.message ||
            "Unable to get your current location. Please enable location access and try again."
        );

        return;
      }

      // -------------------------------------------------
      // VALIDATE LOCATION
      // -------------------------------------------------

      if (
        !location ||
        typeof location.latitude !== "number" ||
        typeof location.longitude !== "number"
      ) {
        setSosError(
          "A valid location is required to send the emergency SOS alert."
        );

        return;
      }

      console.log(
        "SOS LOCATION:",
        location
      );

      // -------------------------------------------------
      // SEND SOS REQUEST
      // -------------------------------------------------

      const requestData = {
        latitude: location.latitude,
        longitude: location.longitude,
      };

      console.log(
        "SOS REQUEST:",
        requestData
      );

      const response = await api.post(
        `/public/patient/${patientId}/sos`,
        requestData
      );

      console.log(
        "SOS RESPONSE:",
        response.data
      );

      setSosSuccess(
        "Emergency SOS alert sent successfully."
      );
    } catch (err) {
      console.error(
        "SOS failed:",
        err
      );

      setSosError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to send emergency SOS alert. Please try again."
      );
    } finally {
      setSendingSOS(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="emergency-page">

        <div className="emergency-loading">

          <div className="emergency-loading-icon">
            <Activity size={30} />
          </div>

          <h2>
            Loading Emergency Information
          </h2>

          <p>
            Please wait while we retrieve the
            patient's emergency information.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !patient) {
    return (
      <div className="emergency-page">

        <div className="emergency-error-card">

          <div className="emergency-error-icon">
            <AlertCircle size={30} />
          </div>

          <h2>
            Patient Information Unavailable
          </h2>

          <p>
            {error ||
              "No emergency information was found for this patient."}
          </p>

          <small>
            Patient ID: {patientId}
          </small>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="emergency-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="emergency-header">

        <div className="emergency-brand">

          <div className="emergency-brand-icon">
            ♥
          </div>

          <div>

            <h1>
              LifeLink
            </h1>

            <span>
              Emergency Medical Information
            </span>

          </div>

        </div>

        <div className="emergency-access-badge">

          <span className="access-dot"></span>

          Emergency Access

        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="emergency-container">

        {/* =================================================
            EMERGENCY NOTICE
        ================================================= */}

        <div className="emergency-notice">

          <div className="notice-icon">
            !
          </div>

          <div>

            <strong>
              Emergency Medical Profile
            </strong>

            <p>
              This information is provided to assist
              authorized emergency responders and
              medical personnel.
            </p>

          </div>

        </div>


        {/* =================================================
            PATIENT IDENTITY
        ================================================= */}

        <section className="patient-card">

          <div className="patient-card-top">

            <div className="patient-avatar">

              {patient?.name
                ?.charAt(0)
                ?.toUpperCase() || "P"}

            </div>

            <div className="patient-identity">

              <span className="patient-label">
                PATIENT
              </span>

              <h2>
                {patient?.name ||
                  "Unknown Patient"}
              </h2>

              <div className="patient-id">

                Patient ID:

                <strong>
                  #{patientId}
                </strong>

              </div>

            </div>

          </div>

          <div className="patient-status">

            <span className="status-dot"></span>

            Emergency profile available

          </div>

        </section>


        {/* =================================================
            CRITICAL MEDICAL INFORMATION
        ================================================= */}

        <section className="medical-section">

          <div className="section-heading">

            <span className="section-icon">
              +
            </span>

            <div>

              <h2>
                Critical Medical Information
              </h2>

              <p>
                Important information for emergency care
              </p>

            </div>

          </div>


          <div className="medical-grid">

            {/* Blood Group */}

            <div className="medical-card blood-card">

              <div className="medical-card-icon">
                🩸
              </div>

              <div>

                <span>
                  Blood Group
                </span>

                <strong>
                  {patient?.bloodGroup ||
                    "Not available"}
                </strong>

              </div>

            </div>


            {/* Allergies */}

            <div className="medical-card">

              <div className="medical-card-icon">
                ⚠
              </div>

              <div>

                <span>
                  Allergies
                </span>

                <strong>
                  {patient?.allergies ||
                    "None reported"}
                </strong>

              </div>

            </div>


            {/* Medical Conditions */}

            <div className="medical-card">

              <div className="medical-card-icon">
                ✚
              </div>

              <div>

                <span>
                  Medical Conditions
                </span>

                <strong>
                  {patient?.medicalConditions ||
                    "None reported"}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            EMERGENCY CONTACTS
        ================================================= */}

        <section className="contacts-section">

          <div className="section-heading">

            <span className="section-icon contact-icon">
              ☎
            </span>

            <div>

              <h2>
                Emergency Contacts
              </h2>

              <p>
                People to contact in case of an emergency
              </p>

            </div>

          </div>


          <div className="contacts-list">

            {patient?.emergencyContacts?.length > 0 ? (

              patient.emergencyContacts.map(
                (contact, index) => {

                  const phoneNumber =
                    contact?.phoneNumber ||
                    contact?.phone;

                  return (
                    <div
                      className="contact-card"
                      key={index}
                    >

                      <div className="contact-avatar">

                        {contact?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}

                      </div>


                      <div className="contact-details">

                        <strong>
                          {contact?.name ||
                            "Emergency Contact"}
                        </strong>

                        {contact?.relationship && (
                          <span>
                            {contact.relationship}
                          </span>
                        )}

                        <small>
                          {phoneNumber ||
                            "Phone number unavailable"}
                        </small>

                      </div>


                      {phoneNumber && (

                        <a
                          className="call-button"
                          href={`tel:${phoneNumber}`}
                        >

                          <Phone size={15} />

                          Call

                        </a>

                      )}

                    </div>
                  );
                }
              )

            ) : (

              <div className="no-contacts">
                No emergency contacts available.
              </div>

            )}

          </div>

        </section>


        {/* =================================================
            EMERGENCY SOS
            BELOW EMERGENCY CONTACTS
        ================================================= */}

        <section className="emergency-sos-section">

          <div className="emergency-sos-card">

            <div className="emergency-sos-icon">

              <Siren size={30} />

            </div>


            <div className="emergency-sos-content">

              <span className="emergency-sos-label">
                EMERGENCY RESPONSE
              </span>

              <h2>
                Need Emergency Assistance?
              </h2>

              <p>
                Send an SOS alert to notify the
                LifeLink emergency system about
                this patient.
              </p>


              {/* SUCCESS MESSAGE */}

              {sosSuccess && (

                <div className="emergency-sos-success">

                  <ShieldCheck size={17} />

                  <span>
                    {sosSuccess}
                  </span>

                </div>

              )}


              {/* ERROR MESSAGE */}

              {sosError && (

                <div className="emergency-sos-error">

                  <AlertCircle size={17} />

                  <span>
                    {sosError}
                  </span>

                </div>

              )}

            </div>


            {/* SOS BUTTON */}

            <button
              type="button"
              className="emergency-sos-button"
              onClick={handleSOS}
              disabled={sendingSOS}
            >

              <Siren size={19} />

              {sendingSOS
                ? "Getting Location..."
                : "SEND SOS ALERT"}

            </button>

          </div>


          {/* LOCATION NOTE */}

          <div className="emergency-sos-note">

            <MapPin size={16} />

            <span>
              Your current device location is required
              to send the emergency alert.
            </span>

          </div>

        </section>


        {/* =================================================
            PRIVACY / SECURITY
        ================================================= */}

        <div className="privacy-card">

          <div className="privacy-icon">
            🔒
          </div>

          <div>

            <strong>
              Emergency Access Only
            </strong>

            <p>
              Only essential medical information is
              displayed on this public emergency profile.
              Sensitive account and security information
              is never exposed.
            </p>

          </div>

        </div>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="emergency-footer">

        <strong>
          ♥ LifeLink Emergency Medical System
        </strong>

        <span>
          Scan • Identify • Respond
        </span>

      </footer>

    </div>
  );
}

export default EmergencyPatient;