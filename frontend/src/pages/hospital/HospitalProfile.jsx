import { useEffect, useState } from "react";
import {
  Hospital,
  Save,
  ArrowLeft,
  MapPin,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getHospitalProfile,
  updateHospitalProfile,
} from "../../services/hospitalApi";

function HospitalProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hospitalName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    licenseNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHospitalProfile();

      setForm({
        hospitalName: data.hospitalName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        latitude: data.latitude ?? "",
        longitude: data.longitude ?? "",
        licenseNumber: data.licenseNumber || "",
      });
    } catch (err) {
      console.error("Error loading hospital profile:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load hospital profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear location success message when user manually changes fields
    if (name === "latitude" || name === "longitude") {
      setLocationMessage("");
    }

    // Clear general error while user is editing
    if (error) {
      setError("");
    }
  };

  const handleGetCurrentLocation = () => {
    setLocationMessage("");
    setError("");

    // Check browser support
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setForm((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));

        setLocationMessage(
          "Current location detected successfully."
        );

        setLocationLoading(false);
      },

      (locationError) => {
        console.error(
          "Geolocation error:",
          locationError
        );

        setLocationLoading(false);

        switch (locationError.code) {
          case locationError.PERMISSION_DENIED:
            setError(
              "Location permission was denied. Please allow location access in your browser and try again."
            );
            break;

          case locationError.POSITION_UNAVAILABLE:
            setError(
              "Your current location could not be determined. Please try again."
            );
            break;

          case locationError.TIMEOUT:
            setError(
              "Location request timed out. Please try again."
            );
            break;

          default:
            setError(
              "Unable to get your current location. Please try again."
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updatedData = {
        ...form,

        latitude:
          form.latitude === "" ||
          form.latitude === null
            ? null
            : Number(form.latitude),

        longitude:
          form.longitude === "" ||
          form.longitude === null
            ? null
            : Number(form.longitude),
      };

      // Prevent invalid coordinate values
      if (
        updatedData.latitude !== null &&
        (Number.isNaN(updatedData.latitude) ||
          updatedData.latitude < -90 ||
          updatedData.latitude > 90)
      ) {
        setError(
          "Please enter a valid latitude between -90 and 90."
        );
        setSaving(false);
        return;
      }

      if (
        updatedData.longitude !== null &&
        (Number.isNaN(updatedData.longitude) ||
          updatedData.longitude < -180 ||
          updatedData.longitude > 180)
      ) {
        setError(
          "Please enter a valid longitude between -180 and 180."
        );
        setSaving(false);
        return;
      }

      const response =
        await updateHospitalProfile(updatedData);

      setForm({
        hospitalName: response.hospitalName || "",
        email: response.email || "",
        phone: response.phone || "",
        address: response.address || "",
        city: response.city || "",
        state: response.state || "",
        latitude: response.latitude ?? "",
        longitude: response.longitude ?? "",
        licenseNumber:
          response.licenseNumber || "",
      });

      setMessage(
        "Hospital profile updated successfully."
      );

      setLocationMessage("");
    } catch (err) {
      console.error(
        "Error updating hospital profile:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update hospital profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="hospital-dashboard-loading">
        <div className="hospital-dashboard-loading-icon">
          <Hospital size={28} />
        </div>

        <h2>Loading hospital profile...</h2>

        <p>
          Please wait while we fetch your information.
        </p>
      </div>
    );
  }

  return (
    <div className="hospital-profile-page">
      <div className="hospital-profile-container">

        {/* HEADER */}

        <div className="hospital-profile-header">

          <button
            type="button"
            className="hospital-profile-back"
            onClick={() =>
              navigate("/hospital/dashboard")
            }
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <div className="hospital-profile-title">

            <div className="hospital-profile-title-icon">
              <Hospital size={24} />
            </div>

            <div>
              <span>
                HOSPITAL PORTAL
              </span>

              <h1>
                Hospital Profile
              </h1>

              <p>
                Manage your hospital information
              </p>
            </div>

          </div>

        </div>


        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="hospital-profile-success">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}


        {/* ERROR MESSAGE */}

        {error && (
          <div className="hospital-profile-error">
            {error}
          </div>
        )}


        {/* FORM */}

        <form
          className="hospital-profile-card"
          onSubmit={handleSubmit}
        >

          <div className="hospital-profile-section">

            <h2>
              Basic Information
            </h2>

            <p>
              Update your hospital's basic details.
            </p>

          </div>


          <div className="hospital-profile-grid">

            {/* HOSPITAL NAME */}

            <div className="hospital-form-group">

              <label>
                Hospital Name
              </label>

              <input
                type="text"
                name="hospitalName"
                value={form.hospitalName}
                onChange={handleChange}
                required
              />

            </div>


            {/* EMAIL */}

            <div className="hospital-form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* PHONE */}

            <div className="hospital-form-group">

              <label>
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

            </div>


            {/* LICENSE */}

            <div className="hospital-form-group">

              <label>
                License Number
              </label>

              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
              />

            </div>


            {/* ADDRESS */}

            <div className="hospital-form-group full">

              <label>
                Address
              </label>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
              />

            </div>


            {/* CITY */}

            <div className="hospital-form-group">

              <label>
                City
              </label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
              />

            </div>


            {/* STATE */}

            <div className="hospital-form-group">

              <label>
                State
              </label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
              />

            </div>


            {/* LOCATION SECTION */}

            <div className="hospital-location-section full">

              <div className="hospital-location-header">

                <div className="hospital-location-info">

                  <div className="hospital-location-title-row">

                    <div className="hospital-location-icon">
                      <MapPin size={19} />
                    </div>

                    <h3>
                      Hospital Location
                    </h3>

                  </div>

                  <p>
                    Automatically detect your current
                    location and fill the coordinates.
                  </p>

                </div>


                <button
                  type="button"
                  className="hospital-location-button"
                  onClick={handleGetCurrentLocation}
                  disabled={
                    locationLoading || saving
                  }
                >

                  {locationLoading ? (
                    <>
                      <Loader2
                        size={18}
                        className="location-spinner"
                      />

                      Detecting...
                    </>
                  ) : (
                    <>
                      <MapPin size={18} />

                      Use My Current Location
                    </>
                  )}

                </button>

              </div>


              {/* COORDINATES */}

              <div className="hospital-location-fields">

                <div className="hospital-form-group">

                  <label>
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="e.g. 26.846700"
                  />

                  <small>
                    Range: -90 to 90
                  </small>

                </div>


                <div className="hospital-form-group">

                  <label>
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="e.g. 80.946200"
                  />

                  <small>
                    Range: -180 to 180
                  </small>

                </div>

              </div>


              {/* LOCATION SUCCESS */}

              {locationMessage && (
                <div className="hospital-location-success">

                  <CheckCircle2 size={17} />

                  <span>
                    {locationMessage}
                  </span>

                </div>
              )}

            </div>

          </div>


          {/* ACTIONS */}

          <div className="hospital-profile-actions">

            <button
              type="button"
              className="hospital-profile-cancel"
              onClick={() =>
                navigate("/hospital/dashboard")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="hospital-profile-save"
              disabled={saving}
            >

              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="location-spinner"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />

                  Save Changes
                </>
              )}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default HospitalProfile;