import { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  UserRound,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  X,
  Save,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../../services/patientApi";


function EmergencyContacts() {

  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingContactId, setEditingContactId] = useState(null);


  const [formData, setFormData] = useState({
    contactName: "",
    phone: "",
    relationship: "",
    email: "",
    priority: 1,
  });


  // =====================================================
  // LOAD CONTACTS
  // =====================================================

  useEffect(() => {

    loadContacts();

  }, []);


  const loadContacts = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getEmergencyContacts();

      setContacts(data || []);

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to load emergency contacts."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "priority"
          ? Number(value)
          : value,
    }));

  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {

    setFormData({
      contactName: "",
      phone: "",
      relationship: "",
      email: "",
      priority: 1,
    });

    setEditingContactId(null);

    setError("");

    setSuccess("");

    setShowForm(true);
  };


  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (contact) => {

    setFormData({
      contactName: contact.contactName || "",
      phone: contact.phone || "",
      relationship: contact.relationship || "",
      email: contact.email || "",
      priority: contact.priority || 1,
    });

    setEditingContactId(contact.contactId);

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

    setEditingContactId(null);

    setError("");

  };


  // =====================================================
  // SAVE CONTACT
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);

      setError("");

      setSuccess("");


      if (editingContactId) {

        await updateEmergencyContact(
          editingContactId,
          formData
        );

        setSuccess(
          "Emergency contact updated successfully."
        );

      } else {

        await addEmergencyContact(formData);

        setSuccess(
          "Emergency contact added successfully."
        );
      }


      setShowForm(false);

      setEditingContactId(null);

      await loadContacts();

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to save emergency contact."
      );

    } finally {

      setSaving(false);

    }
  };


  // =====================================================
  // DELETE CONTACT
  // =====================================================

  const handleDelete = async (contactId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this emergency contact?"
    );

    if (!confirmed) {
      return;
    }


    try {

      setError("");

      setSuccess("");

      await deleteEmergencyContact(contactId);

      setSuccess(
        "Emergency contact deleted successfully."
      );

      await loadContacts();

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to delete emergency contact."
      );
    }
  };


  return (

    <div className="contacts-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="contacts-header">

        <button
          className="contacts-back-button"
          onClick={() =>
            navigate("/patient/dashboard")
          }
        >

          <ArrowLeft size={17} />

          Dashboard

        </button>


        <div className="contacts-title-row">

          <div className="contacts-title">

            <div className="contacts-title-icon">
              <Phone size={23} />
            </div>

            <div>

              <span>
                EMERGENCY ACCESS
              </span>

              <h1>
                Emergency Contacts
              </h1>

              <p>
                People who can be contacted during
                an emergency.
              </p>

            </div>

          </div>


          <button
            className="add-contact-button"
            onClick={openAddForm}
          >

            <Plus size={18} />

            Add Contact

          </button>

        </div>

      </div>


      {/* =================================================
          MESSAGES
      ================================================= */}

      {success && (

        <div className="contacts-success">
          {success}
        </div>

      )}


      {error && (

        <div className="contacts-error">
          {error}
        </div>

      )}


      {/* =================================================
          CONTACT LIST
      ================================================= */}

      <div className="contacts-container">


        {loading && (

          <div className="contacts-empty">

            <p>
              Loading emergency contacts...
            </p>

          </div>

        )}


        {!loading && contacts.length === 0 && (

          <div className="contacts-empty">

            <div className="contacts-empty-icon">
              <Phone size={25} />
            </div>

            <h2>
              No emergency contacts
            </h2>

            <p>
              Add someone you trust so they can
              be contacted during an emergency.
            </p>

            <button
              className="add-contact-empty-button"
              onClick={openAddForm}
            >

              <Plus size={17} />

              Add Emergency Contact

            </button>

          </div>

        )}


        {!loading && contacts.length > 0 && (

          <div className="contacts-grid">

            {contacts.map((contact) => (

              <div
                className="contact-card"
                key={contact.contactId}
              >


                {/* CARD HEADER */}

                <div className="contact-card-header">

                  <div className="contact-avatar">
                    <UserRound size={20} />
                  </div>


                  <div className="contact-main-info">

                    <h2>
                      {contact.contactName}
                    </h2>

                    <span>
                      {contact.relationship}
                    </span>

                  </div>


                  <div className="priority-badge">

                    Priority {contact.priority}

                  </div>

                </div>


                {/* CONTACT DETAILS */}

                <div className="contact-details">


                  <div className="contact-detail">

                    <Phone size={16} />

                    <a
                      href={`tel:${contact.phone}`}
                    >
                      {contact.phone}
                    </a>

                  </div>


                  <div className="contact-detail">

                    <Mail size={16} />

                    <a
                      href={`mailto:${contact.email}`}
                    >
                      {contact.email}
                    </a>

                  </div>


                </div>


                {/* ACTIONS */}

                <div className="contact-actions">

                  <button
                    className="contact-edit-button"
                    onClick={() =>
                      openEditForm(contact)
                    }
                  >

                    <Pencil size={15} />

                    Edit

                  </button>


                  <button
                    className="contact-delete-button"
                    onClick={() =>
                      handleDelete(contact.contactId)
                    }
                  >

                    <Trash2 size={15} />

                    Delete

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (

        <div className="contact-modal-overlay">

          <div className="contact-modal">


            <div className="contact-modal-header">

              <div>

                <span>
                  {editingContactId
                    ? "UPDATE CONTACT"
                    : "NEW CONTACT"}
                </span>

                <h2>
                  {editingContactId
                    ? "Edit Emergency Contact"
                    : "Add Emergency Contact"}
                </h2>

              </div>


              <button
                className="contact-modal-close"
                onClick={closeForm}
                disabled={saving}
              >

                <X size={20} />

              </button>

            </div>


            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >


              {/* NAME */}

              <div className="contact-form-field">

                <label>
                  Contact Name
                </label>

                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

              </div>


              {/* PHONE */}

              <div className="contact-form-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />

              </div>


              {/* RELATIONSHIP */}

              <div className="contact-form-field">

                <label>
                  Relationship
                </label>

                <input
                  type="text"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  placeholder="e.g. Father, Mother, Brother"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="contact-form-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />

              </div>


              {/* PRIORITY */}

              <div className="contact-form-field">

                <label>
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >

                  <option value={1}>
                    1 — Highest
                  </option>

                  <option value={2}>
                    2
                  </option>

                  <option value={3}>
                    3
                  </option>

                  <option value={4}>
                    4
                  </option>

                  <option value={5}>
                    5 — Lowest
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="contact-form-actions">

                <button
                  type="button"
                  className="contact-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="contact-save-button"
                  disabled={saving}
                >

                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : editingContactId
                      ? "Update Contact"
                      : "Save Contact"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}


export default EmergencyContacts;