import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  LogIn,
} from "lucide-react";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (!formData.username || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      console.log("Login response:", response.data);

      const loginData = response.data;

      // Store authentication information
      localStorage.setItem("jwt", loginData.jwt);
      localStorage.setItem("username", loginData.username);
      localStorage.setItem("userId", loginData.userId);

      // Backend returns role as a Set
      // Example: ["PATIENT"]
      const roles = loginData.role || [];

      localStorage.setItem(
        "role",
        JSON.stringify(roles)
      );

      /*
       * Redirect according to role
       */

      if (roles.includes("PATIENT")) {
        navigate("/patient/dashboard");
      } else if (roles.includes("HOSPITAL")) {
        navigate("/hospital/dashboard");
      } else if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        setError("Unknown user role received from server.");
      }

    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(
          "Unable to login. Please make sure the backend is running."
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
            LIFE-LINK EMERGENCY SYSTEM
          </span>

          <h1>
            One login.
            <span>One safer identity.</span>
          </h1>

          <p>
            Access your LifeLink dashboard and manage
            the information that matters when every
            second counts.
          </p>

          <div className="auth-benefits">

            <div>
              <LogIn size={18} />
              Secure authentication
            </div>

            <div>
              <LogIn size={18} />
              Role-based dashboard
            </div>

            <div>
              <LogIn size={18} />
              Emergency-ready profile
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
              WELCOME BACK
            </span>

            <h2>
              Login to LifeLink
            </h2>

            <p>
              Enter your credentials to continue.
            </p>

          </div>


          {error && (
            <div className="form-message error">

              <AlertCircle size={18} />

              <span>{error}</span>

            </div>
          )}


          <form onSubmit={handleSubmit}>

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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Login"
              }

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>


          <div className="auth-footer">

            Don't have an account?

            <Link to="/register/patient">
              Register as Patient
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

export default Login;