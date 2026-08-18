import { useState } from "react";

import {
  Hospital,
  Mail,
  Lock,
  FileText,
  User,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { useNavigate, Link } from "react-router-dom";

import api from "../../services/api";


function HospitalRegister() {

  const navigate = useNavigate();


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    licenseNumber: "",
  });


  // =====================================================
  // UI STATES
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    setSuccess("");


    // Basic frontend validation

    if (
      !formData.name.trim() ||
      !formData.username.trim() ||
      !formData.password ||
      !formData.licenseNumber.trim()
    ) {

      setError(
        "Please fill in all required fields."
      );

      return;

    }


    if (formData.password.length < 8) {

      setError(
        "Password must contain at least 8 characters."
      );

      return;

    }


    try {

      setLoading(true);


      const response = await api.post(
        "/auth/hospital/register",
        {
          name: formData.name.trim(),
          username: formData.username.trim(),
          password: formData.password,
          licenseNumber:
            formData.licenseNumber.trim(),
        }
      );


      console.log(
        "Hospital registration successful:",
        response.data
      );


      setSuccess(
        "Hospital registration submitted successfully."
      );


      // Clear form

      setFormData({
        name: "",
        username: "",
        password: "",
        licenseNumber: "",
      });


      // Give the user a moment to see success message

      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (err) {

      console.error(
        "Hospital registration failed:",
        err
      );


      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;


      setError(
        backendMessage ||
        "Unable to register hospital. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="hospital-register-page">


      {/* =================================================
          LEFT / BRAND SECTION
      ================================================= */}

      <div className="hospital-register-brand">


        <button
          className="hospital-register-back"
          onClick={() => navigate("/")}
        >

          <ArrowLeft size={17} />

          Back to Home

        </button>


        <div className="hospital-register-brand-content">


          <div className="hospital-register-logo">

            <Hospital size={30} />

          </div>


          <span className="hospital-register-eyebrow">
            LIFELINK HEALTHCARE NETWORK
          </span>


          <h1>
            Connect your hospital
            <br />
            to LifeLink.
          </h1>


          <p>
            Join the LifeLink emergency response
            network and help healthcare teams
            respond faster when patients need
            immediate assistance.
          </p>


          <div className="hospital-register-feature">

            <div className="hospital-register-feature-icon">

              <Hospital size={18} />

            </div>

            <div>

              <strong>
                Emergency Response
              </strong>

              <span>
                Receive and manage patient emergency
                alerts assigned to your hospital.
              </span>

            </div>

          </div>


          <div className="hospital-register-feature">

            <div className="hospital-register-feature-icon">

              <FileText size={18} />

            </div>

            <div>

              <strong>
                Verified Hospital
              </strong>

              <span>
                Your hospital account is reviewed
                before access is granted.
              </span>

            </div>

          </div>


        </div>


      </div>


      {/* =================================================
          FORM SECTION
      ================================================= */}

      <div className="hospital-register-form-section">


        <div className="hospital-register-form-container">


          <div className="hospital-register-mobile-logo">

            <Hospital size={24} />

            <strong>
              LifeLink
            </strong>

          </div>


          <div className="hospital-register-heading">

            <span>
              HOSPITAL REGISTRATION
            </span>

            <h2>
              Create hospital account
            </h2>

            <p>
              Register your hospital to access
              LifeLink's emergency management system.
            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="hospital-register-error">

              {error}

            </div>

          )}


          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (

            <div className="hospital-register-success">

              {success}

            </div>

          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="hospital-register-form"
            onSubmit={handleSubmit}
          >


            {/* HOSPITAL NAME */}

            <div className="hospital-register-field">

              <label htmlFor="name">
                Hospital Name
              </label>


              <div className="hospital-register-input">

                <Hospital size={17} />

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter hospital name"
                  autoComplete="organization"
                  disabled={loading}
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="hospital-register-field">

              <label htmlFor="username">
                Email Address
              </label>


              <div className="hospital-register-input">

                <Mail size={17} />

                <input
                  id="username"
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="hospital@example.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="hospital-register-field">

              <label htmlFor="password">
                Password
              </label>


              <div className="hospital-register-input">

                <Lock size={17} />

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  disabled={loading}
                  minLength={8}
                  required
                />

              </div>

            </div>


            {/* LICENSE NUMBER */}

            <div className="hospital-register-field">

              <label htmlFor="licenseNumber">
                License Number
              </label>


              <div className="hospital-register-input">

                <FileText size={17} />

                <input
                  id="licenseNumber"
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Enter hospital license number"
                  disabled={loading}
                  required
                />

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="hospital-register-submit"
              disabled={loading}
            >

              {loading ? (

                <>
                  <Loader2
                    size={18}
                    className="hospital-register-spinner"
                  />

                  Registering...

                </>

              ) : (

                <>
                  <User size={18} />

                  Register Hospital

                </>

              )}

            </button>


          </form>


          {/* LOGIN */}

          <div className="hospital-register-login">

            Already have a hospital account?

            <Link to="/login">
              Login
            </Link>

          </div>


          <div className="hospital-register-note">

            Hospital accounts may require approval
            before accessing the dashboard.

          </div>


        </div>


      </div>


    </div>

  );

}


export default HospitalRegister;