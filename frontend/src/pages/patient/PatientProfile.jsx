import { useEffect, useState } from "react";

import {
  UserRound,
  ArrowLeft,
  Save,
  Edit3,
  CalendarDays,
  MapPin,
  HeartPulse,
  Activity,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getMyProfile,
  updateMyProfile,
} from "../../services/patientApi";


function PatientProfile() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {

    loadProfile();

  }, []);


  const loadProfile = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getMyProfile();

      setProfile(data);

    } catch (err) {

      console.error(
        "Failed to load profile:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load your profile."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);

      setError("");

      setSuccess("");


      const requestData = {

        userId: profile.userId,

        gender: profile.gender,

        bloodGroup: profile.bloodGroup,

        dateOfBirth:
          profile.dateOfBirth || null,

        height:
          profile.height !== ""
            ? Number(profile.height)
            : null,

        weight:
          profile.weight !== ""
            ? Number(profile.weight)
            : null,

        allergies:
          profile.allergies || "",

        medicalConditions:
          profile.medicalConditions || "",

        currentMedications:
          profile.currentMedications || "",

        address:
          profile.address || "",

        city:
          profile.city || "",

        pinCode:
          profile.pinCode || "",

        state:
          profile.state || "",

        country:
          profile.country || "",
      };


      const updatedProfile =
        await updateMyProfile(requestData);


      setProfile(updatedProfile);

      setEditing(false);

      setSuccess(
        "Profile updated successfully."
      );

    } catch (err) {

      console.error(
        "Failed to update profile:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to update your profile."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="profile-page">

        <div className="profile-loading">
          Loading profile...
        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error && !profile) {

    return (

      <div className="profile-page">

        <div className="profile-error">
          {error}
        </div>

        <button
          className="profile-back-button"
          onClick={() =>
            navigate("/patient/dashboard")
          }
        >

          <ArrowLeft size={17} />

          Back to Dashboard

        </button>

      </div>

    );

  }


  return (

    <div className="profile-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="profile-header">

        <button
          className="profile-back-button"
          onClick={() =>
            navigate("/patient/dashboard")
          }
        >

          <ArrowLeft size={17} />

          Dashboard

        </button>


        <div className="profile-heading">

          <div className="profile-heading-icon">
            <UserRound size={23} />
          </div>

          <div>

            <span>
              PATIENT PROFILE
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your medical and personal information.
            </p>

          </div>

        </div>


        {!editing && (

          <button
            className="profile-edit-button"
            onClick={() => {

              setEditing(true);

              setError("");

              setSuccess("");

            }}
          >

            <Edit3 size={17} />

            Edit Profile

          </button>

        )}

      </div>


      {/* =================================================
          MESSAGES
      ================================================= */}

      {success && (

        <div className="profile-success">
          {success}
        </div>

      )}


      {error && (

        <div className="profile-error">
          {error}
        </div>

      )}


      {/* =================================================
          PROFILE FORM
      ================================================= */}

      <form
        className="profile-container"
        onSubmit={handleSave}
      >


        {/* =================================================
            MEDICAL INFORMATION
        ================================================= */}

        <section className="profile-card">

          <div className="profile-card-title">

            <div className="profile-section-icon">
              <HeartPulse size={19} />
            </div>

            <div>

              <h2>
                Medical Information
              </h2>

              <p>
                Information that may be important
                during an emergency.
              </p>

            </div>

          </div>


          <div className="profile-fields">


            {/* Gender */}

            <div className="profile-field">

              <label>
                Gender
              </label>

              {editing ? (

                <select
                  name="gender"
                  value={profile.gender || ""}
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

              ) : (

                <div className="profile-value">
                  {profile.gender || "Not provided"}
                </div>

              )}

            </div>


            {/* Blood Group */}

            <div className="profile-field">

              <label>
                Blood Group
              </label>

              {editing ? (

                <select
                  name="bloodGroup"
                  value={profile.bloodGroup || ""}
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

              ) : (

                <div className="profile-value">
                  {profile.bloodGroup || "Not provided"}
                </div>

              )}

            </div>


            {/* Date of Birth */}

            <div className="profile-field">

              <label>
                Date of Birth
              </label>

              {editing ? (

                <div className="input-with-icon">

                  <CalendarDays size={17} />

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={
                      profile.dateOfBirth || ""
                    }
                    onChange={handleChange}
                    required
                  />

                </div>

              ) : (

                <div className="profile-value">

                  {profile.dateOfBirth ||
                    "Not provided"}

                </div>

              )}

            </div>


            {/* Height */}

            <div className="profile-field">

              <label>
                Height
              </label>

              {editing ? (

                <input
                  type="number"
                  name="height"
                  value={profile.height ?? ""}
                  onChange={handleChange}
                  placeholder="Height"
                  step="0.1"
                  required
                />

              ) : (

                <div className="profile-value">

                  {profile.height != null
                    ? `${profile.height} cm`
                    : "Not provided"}

                </div>

              )}

            </div>


            {/* Weight */}

            <div className="profile-field">

              <label>
                Weight
              </label>

              {editing ? (

                <input
                  type="number"
                  name="weight"
                  value={profile.weight ?? ""}
                  onChange={handleChange}
                  placeholder="Weight"
                  step="0.1"
                  required
                />

              ) : (

                <div className="profile-value">

                  {profile.weight != null
                    ? `${profile.weight} kg`
                    : "Not provided"}

                </div>

              )}

            </div>


          </div>

        </section>


        {/* =================================================
            MEDICAL CONDITIONS
        ================================================= */}

        <section className="profile-card">

          <div className="profile-card-title">

            <div className="profile-section-icon">
              <Activity size={19} />
            </div>

            <div>

              <h2>
                Medical Conditions
              </h2>

              <p>
                Help emergency responders understand
                your medical situation.
              </p>

            </div>

          </div>


          <div className="profile-fields single">


            {/* Allergies */}

            <div className="profile-field">

              <label>
                Allergies
              </label>

              {editing ? (

                <textarea
                  name="allergies"
                  value={profile.allergies || ""}
                  onChange={handleChange}
                  placeholder="Enter any known allergies"
                  rows="3"
                />

              ) : (

                <div className="profile-text-value">

                  {profile.allergies ||
                    "No allergies provided"}

                </div>

              )}

            </div>


            {/* Medical Conditions */}

            <div className="profile-field">

              <label>
                Medical Conditions
              </label>

              {editing ? (

                <textarea
                  name="medicalConditions"
                  value={
                    profile.medicalConditions || ""
                  }
                  onChange={handleChange}
                  placeholder="Enter medical conditions"
                  rows="3"
                />

              ) : (

                <div className="profile-text-value">

                  {profile.medicalConditions ||
                    "No medical conditions provided"}

                </div>

              )}

            </div>


            {/* Current Medications */}

            <div className="profile-field">

              <label>
                Current Medications
              </label>

              {editing ? (

                <textarea
                  name="currentMedications"
                  value={
                    profile.currentMedications || ""
                  }
                  onChange={handleChange}
                  placeholder="Enter current medications"
                  rows="3"
                />

              ) : (

                <div className="profile-text-value">

                  {profile.currentMedications ||
                    "No medications provided"}

                </div>

              )}

            </div>


          </div>

        </section>


        {/* =================================================
            LOCATION
        ================================================= */}

        <section className="profile-card">

          <div className="profile-card-title">

            <div className="profile-section-icon">
              <MapPin size={19} />
            </div>

            <div>

              <h2>
                Address & Location
              </h2>

              <p>
                Your current residential information.
              </p>

            </div>

          </div>


          <div className="profile-fields">


            {/* Address */}

            <div className="profile-field profile-wide">

              <label>
                Address
              </label>

              {editing ? (

                <input
                  type="text"
                  name="address"
                  value={profile.address || ""}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />

              ) : (

                <div className="profile-value">

                  {profile.address ||
                    "Not provided"}

                </div>

              )}

            </div>


            {/* City */}

            <div className="profile-field">

              <label>
                City
              </label>

              {editing ? (

                <input
                  type="text"
                  name="city"
                  value={profile.city || ""}
                  onChange={handleChange}
                  placeholder="City"
                />

              ) : (

                <div className="profile-value">

                  {profile.city ||
                    "Not provided"}

                </div>

              )}

            </div>


            {/* PIN Code */}

            <div className="profile-field">

              <label>
                PIN Code
              </label>

              {editing ? (

                <input
                  type="text"
                  name="pinCode"
                  value={profile.pinCode || ""}
                  onChange={handleChange}
                  placeholder="PIN Code"
                />

              ) : (

                <div className="profile-value">

                  {profile.pinCode ||
                    "Not provided"}

                </div>

              )}

            </div>


            {/* State */}

            <div className="profile-field">

              <label>
                State
              </label>

              {editing ? (

                <input
                  type="text"
                  name="state"
                  value={profile.state || ""}
                  onChange={handleChange}
                  placeholder="State"
                />

              ) : (

                <div className="profile-value">

                  {profile.state ||
                    "Not provided"}

                </div>

              )}

            </div>


            {/* Country */}

            <div className="profile-field">

              <label>
                Country
              </label>

              {editing ? (

                <input
                  type="text"
                  name="country"
                  value={profile.country || ""}
                  onChange={handleChange}
                  placeholder="Country"
                />

              ) : (

                <div className="profile-value">

                  {profile.country ||
                    "Not provided"}

                </div>

              )}

            </div>


          </div>

        </section>


        {/* =================================================
            SAVE BUTTONS
        ================================================= */}

        {editing && (

          <div className="profile-actions">

            <button
              type="button"
              className="profile-cancel-button"
              onClick={() => {

                setEditing(false);

                setError("");

                setSuccess("");

                loadProfile();

              }}
              disabled={saving}
            >

              Cancel

            </button>


            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >

              <Save size={17} />

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        )}

      </form>

    </div>

  );

}


export default PatientProfile;