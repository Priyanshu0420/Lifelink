import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import PatientRegister from "./pages/auth/PatientRegister";
import HospitalRegister from "./pages/auth/HospitalRegister";
import Login from "./pages/auth/Login";
import QRCodePage from "./pages/patient/QRCode";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HospitalEmergencyDetails from "./pages/hospital/HospitalEmergencyDetails";
import HospitalProfile from "./pages/hospital/HospitalProfile";
import HospitalPatients from "./pages/hospital/HospitalPatients";
import HospitalEmergencies from "./pages/hospital/HospitalEmergencies";
import HospitalEmergencyHistory from "./pages/hospital/HospitalEmergencyHistory";
import EmergencyPatient from "./pages/public/EmergencyPatient";


import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import EmergencyContacts from "./pages/patient/EmergencyContacts";
import Insurance from "./pages/patient/Insurance";

import ProtectedRoute from "./components/ProtectedRoute";


// =====================================================
// TEMPORARY DASHBOARDS
// =====================================================

// function HospitalDashboard() {
//   return (
//     <div style={{ padding: "40px" }}>
//       <h1>Hospital Dashboard</h1>
//       <p>Hospital dashboard coming next.</p>
//     </div>
//   );
// }


// function AdminDashboard() {
//   return (
//     <div style={{ padding: "40px" }}>
//       <h1>Admin Dashboard</h1>
//       <p>Admin dashboard coming next.</p>
//     </div>
//   );
// }



// =====================================================
// APP
// =====================================================

function App() {

  return (
    <BrowserRouter>

      <Routes>


        {/* =========================================
            PUBLIC
        ========================================= */}

        <Route
          path="/"
          element={<Home />}
        />
        <Route path="/public/patient/:patientId" element={<EmergencyPatient />} />


        {/* =========================================
            AUTH
        ========================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register/patient"
          element={<PatientRegister />}
        />
        <Route
  path="/register/hospital"
  element={<HospitalRegister />}
/>


        {/* =========================================
            PATIENT
        ========================================= */}

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientProfile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/patient/emergency-contacts"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <EmergencyContacts />
            </ProtectedRoute>
          }
        />


        {/* INSURANCE */}

        <Route
          path="/patient/insurance"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <Insurance />
            </ProtectedRoute>
          }
        />

        {/* QR CODE */}
        <Route
  path="/patient/qr-code"
  element={
    <ProtectedRoute allowedRoles={["PATIENT"]}>
      <QRCodePage />
    </ProtectedRoute>
  }
/>


        {/* =========================================
            HOSPITAL
        ========================================= */}

        <Route
          path="/hospital/dashboard"
          element={
            <ProtectedRoute allowedRoles={["HOSPITAL"]}>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/hospital/profile"
  element={
    <ProtectedRoute allowedRoles={["HOSPITAL"]}>
      <HospitalProfile />
    </ProtectedRoute>
  }
/>

<Route
  path="/hospital/patients"
  element={
    <ProtectedRoute allowedRoles={["HOSPITAL"]}>
      <HospitalPatients />
    </ProtectedRoute>
  }
/>

<Route
  path="/hospital/emergencies"
  element={
    <ProtectedRoute allowedRoles={["HOSPITAL"]}>
      <HospitalEmergencies />
    </ProtectedRoute>
  }
/>

<Route
  path="/hospital/emergency-history"
  element={
    <ProtectedRoute allowedRoles={["HOSPITAL"]}>
      <HospitalEmergencyHistory />
    </ProtectedRoute>
  }
/>


<Route
  path="/hospital/emergencies/:alertId"
  element={
    <ProtectedRoute allowedRoles={["HOSPITAL"]}>
      <HospitalEmergencyDetails />
    </ProtectedRoute>
  }
/>


        {/* =========================================
            ADMIN
        ========================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/patients"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminPatients />
    </ProtectedRoute>
  }
/>


      </Routes>

    </BrowserRouter>
  );
}


export default App;