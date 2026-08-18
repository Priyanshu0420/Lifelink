import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  UserRound,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../../services/api";

function PatientRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/patient/register",
        {
          name: formData.name,
          username: formData.username,
          password: formData.password,
        }
      );

      console.log("Registration response:", response.data);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error("Registration error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(
          "Registration failed. Please check your backend server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}

      <div className="auth-info">

        <Link to="/" className="auth-brand">

          <div className="brand-icon">
            <HeartPulse size={23} />
          </div>

          <span>LifeLink</span>

        </Link>

        <div className="auth-info-content">

          <span className="auth-label">
            PATIENT REGISTRATION
          </span>

          <h1>
            Your emergency
            <span>information matters.</span>
          </h1>

          <p>
            Create your LifeLink profile and securely
            manage the medical information that could
            help during an emergency.
          </p>

          <div className="auth-benefits">

            <div>
              <CheckCircle2 size={18} />
              Secure medical identity
            </div>

            <div>
              <CheckCircle2 size={18} />
              Emergency QR profile
            </div>

            <div>
              <CheckCircle2 size={18} />
              Emergency contact management
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="auth-form-container">

        <div className="auth-form-box">

          <div className="mobile-auth-brand">

            <div className="brand-icon">
              <HeartPulse size={21} />
            </div>

            <span>LifeLink</span>

          </div>


          <div className="form-heading">

            <span>
              CREATE ACCOUNT
            </span>

            <h2>
              Create your patient account
            </h2>

            <p>
              Start by providing your basic information.
            </p>

          </div>


          {error && (
            <div className="form-message error">

              <AlertCircle size={18} />

              <span>{error}</span>

            </div>
          )}


          {success && (
            <div className="form-message success">

              <CheckCircle2 size={18} />

              <span>{success}</span>

            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="input-wrapper">

                <UserRound size={18} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="username">
                Email Address
              </label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  id="username"
                  name="username"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Patient Account"
              }

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>


          <div className="auth-footer">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </div>


          <div className="auth-back">

            <Link to="/">
              ← Back to LifeLink
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PatientRegister;