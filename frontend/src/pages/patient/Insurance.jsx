import { useEffect, useState } from "react";

import {
  ShieldCheck,
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  X,
  Save,
  CalendarDays,
  Building2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getMyInsurance,
  addInsurance,
  updateInsurance,
  deleteInsurance,
} from "../../services/patientApi";


function Insurance() {

  const navigate = useNavigate();

  const [insurance, setInsurance] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    providerName: "",
    policyNumber: "",
    policyType: "",
    startDate: "",
    expiryDate: "",
    coverageDetails: "",
  });


  // =====================================================
  // LOAD INSURANCE FROM BACKEND
  // =====================================================

  useEffect(() => {

    loadInsurance();

  }, []);


  const loadInsurance = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getMyInsurance();

      setInsurance(data);

      // Keep localStorage only as a cache/display convenience.
      // The backend remains the source of truth.
      localStorage.setItem(
        "lifelink_insurance",
        JSON.stringify(data)
      );

    } catch (err) {

      // 404 means the patient simply has no insurance yet.
      if (err.response?.status === 404) {

        setInsurance(null);

        localStorage.removeItem(
          "lifelink_insurance"
        );

      } else {

        console.error(
          "Failed to load insurance:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load insurance information."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {

    setFormData({
      providerName: "",
      policyNumber: "",
      policyType: "",
      startDate: "",
      expiryDate: "",
      coverageDetails: "",
    });

    setError("");

    setSuccess("");

    setShowForm(true);

  };


  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = () => {

    if (!insurance) {
      return;
    }

    setFormData({
      providerName: insurance.providerName || "",
      policyNumber: insurance.policyNumber || "",
      policyType: insurance.policyType || "",
      startDate: insurance.startDate || "",
      expiryDate: insurance.expiryDate || "",
      coverageDetails: insurance.coverageDetails || "",
    });

    setError("");

    setSuccess("");

    setShowForm(true);

  };


  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {

    if (saving) {
      return;
    }

    setShowForm(false);

  };


  // =====================================================
  // SAVE INSURANCE
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);

      setError("");

      setSuccess("");


      let response;


      // =================================================
      // UPDATE EXISTING INSURANCE
      // =================================================

      if (insurance) {

        response = await updateInsurance(formData);

        setSuccess(
          "Insurance information updated successfully."
        );

      }

      // =================================================
      // ADD NEW INSURANCE
      // =================================================

      else {

        response = await addInsurance(formData);

        setSuccess(
          "Insurance information added successfully."
        );

      }


      // =================================================
      // UPDATE STATE
      // =================================================

      setInsurance(response);

      localStorage.setItem(
        "lifelink_insurance",
        JSON.stringify(response)
      );

      setShowForm(false);

    }

    catch (err) {

      console.error(
        "Failed to save insurance:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to save insurance information."
      );

    }

    finally {

      setSaving(false);

    }

  };


  // =====================================================
  // DELETE INSURANCE
  // =====================================================

  const handleDelete = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to delete your insurance information?"
    );


    if (!confirmed) {
      return;
    }


    try {

      setDeleting(true);

      setError("");

      setSuccess("");


      await deleteInsurance();


      setInsurance(null);

      localStorage.removeItem(
        "lifelink_insurance"
      );


      setSuccess(
        "Insurance information deleted successfully."
      );

    }

    catch (err) {

      console.error(
        "Failed to delete insurance:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to delete insurance information."
      );

    }

    finally {

      setDeleting(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="insurance-page">

        <div className="insurance-loading">

          Loading insurance information...

        </div>

      </div>

    );

  }


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="insurance-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="insurance-header">

        <button
          className="insurance-back-button"
          onClick={() =>
            navigate("/patient/dashboard")
          }
        >

          <ArrowLeft size={17} />

          Dashboard

        </button>


        <div className="insurance-title-row">


          <div className="insurance-title">

            <div className="insurance-title-icon">

              <ShieldCheck size={23} />

            </div>


            <div>

              <span>
                MEDICAL COVERAGE
              </span>

              <h1>
                Insurance
              </h1>

              <p>
                Manage your health insurance information.
              </p>

            </div>

          </div>


          {!insurance && (

            <button
              className="insurance-add-button"
              onClick={openAddForm}
            >

              <Plus size={18} />

              Add Insurance

            </button>

          )}

        </div>

      </div>


      {/* =================================================
          MESSAGES
      ================================================= */}

      {success && (

        <div className="insurance-success">

          {success}

        </div>

      )}


      {error && (

        <div className="insurance-error">

          {error}

        </div>

      )}


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="insurance-container">


        {/* =================================================
            NO INSURANCE
        ================================================= */}

        {!insurance && (

          <div className="insurance-empty">

            <div className="insurance-empty-icon">

              <ShieldCheck size={26} />

            </div>


            <h2>

              No insurance information

            </h2>


            <p>

              Add your health insurance details so
              important coverage information is
              available when needed.

            </p>


            <button
              className="insurance-empty-button"
              onClick={openAddForm}
            >

              <Plus size={17} />

              Add Insurance

            </button>

          </div>

        )}


        {/* =================================================
            INSURANCE CARD
        ================================================= */}

        {insurance && (

          <div className="insurance-card">


            <div className="insurance-card-header">


              <div className="insurance-provider">


                <div className="insurance-provider-icon">

                  <Building2 size={20} />

                </div>


                <div>

                  <span>
                    INSURANCE PROVIDER
                  </span>

                  <h2>
                    {insurance.providerName}
                  </h2>

                </div>


              </div>


              <div className="insurance-status">

                {insurance.status || "ACTIVE"}

              </div>

            </div>


            <div className="insurance-details">


              <div className="insurance-detail">

                <span>
                  POLICY NUMBER
                </span>

                <strong>
                  {insurance.policyNumber ||
                    "Not provided"}
                </strong>

              </div>


              <div className="insurance-detail">

                <span>
                  POLICY TYPE
                </span>

                <strong>
                  {insurance.policyType ||
                    "Not provided"}
                </strong>

              </div>


              <div className="insurance-detail">

                <span>
                  START DATE
                </span>

                <strong>
                  {insurance.startDate ||
                    "Not provided"}
                </strong>

              </div>


              <div className="insurance-detail">

                <span>
                  EXPIRY DATE
                </span>

                <strong>
                  {insurance.expiryDate ||
                    "Not provided"}
                </strong>

              </div>

            </div>


            <div className="insurance-coverage">

              <span>
                COVERAGE DETAILS
              </span>

              <p>

                {insurance.coverageDetails ||
                  "No coverage details provided."}

              </p>

            </div>


            <div className="insurance-actions">


              <button
                className="insurance-edit-button"
                onClick={openEditForm}
                disabled={deleting}
              >

                <Pencil size={15} />

                Edit

              </button>


              <button
                className="insurance-delete-button"
                onClick={handleDelete}
                disabled={deleting}
              >

                <Trash2 size={15} />

                {deleting
                  ? "Deleting..."
                  : "Delete"}

              </button>


            </div>


          </div>

        )}

      </div>


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (

        <div className="insurance-modal-overlay">

          <div className="insurance-modal">


            <div className="insurance-modal-header">

              <div>

                <span>

                  {insurance
                    ? "UPDATE INSURANCE"
                    : "NEW INSURANCE"}

                </span>


                <h2>

                  {insurance
                    ? "Edit Insurance"
                    : "Add Insurance"}

                </h2>

              </div>


              <button
                className="insurance-close-button"
                onClick={closeForm}
                disabled={saving}
              >

                <X size={20} />

              </button>

            </div>


            <form
              className="insurance-form"
              onSubmit={handleSubmit}
            >


              <div className="insurance-field">

                <label>
                  Provider Name
                </label>

                <input
                  type="text"
                  name="providerName"
                  value={formData.providerName}
                  onChange={handleChange}
                  placeholder="e.g. Star Health"
                  required
                />

              </div>


              <div className="insurance-field">

                <label>
                  Policy Number
                </label>

                <input
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  placeholder="Enter policy number"
                  required
                />

              </div>


              <div className="insurance-field">

                <label>
                  Policy Type
                </label>

                <input
                  type="text"
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                  placeholder="e.g. Individual Health"
                  required
                />

              </div>


              <div className="insurance-date-row">


                <div className="insurance-field">

                  <label>
                    Start Date
                  </label>


                  <div className="insurance-input-icon">

                    <CalendarDays size={15} />

                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>


                <div className="insurance-field">

                  <label>
                    Expiry Date
                  </label>


                  <div className="insurance-input-icon">

                    <CalendarDays size={15} />

                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

              </div>


              <div className="insurance-field">

                <label>
                  Coverage Details
                </label>

                <textarea
                  name="coverageDetails"
                  value={formData.coverageDetails}
                  onChange={handleChange}
                  placeholder="Describe your coverage..."
                  rows="4"
                />

              </div>


              <div className="insurance-form-actions">


                <button
                  type="button"
                  className="insurance-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="insurance-save-button"
                  disabled={saving}
                >

                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : insurance
                      ? "Update Insurance"
                      : "Save Insurance"}

                </button>


              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}


export default Insurance;