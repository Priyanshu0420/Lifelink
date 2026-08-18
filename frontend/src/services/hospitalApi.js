import api from "./api";


// =====================================================
// HOSPITAL PROFILE
// =====================================================

export const getHospitalProfile = async () => {

  const response = await api.get(
    "/hospital/profile"
  );

  return response.data;
};


// =====================================================
// PATIENTS
// =====================================================

export const getMyPatients = async () => {

  const response = await api.get(
    "/hospital/hospital/patients"
  );

  return response.data;
};


// =====================================================
// TODAY'S EMERGENCIES
// =====================================================

export const getTodaysEmergencies = async () => {

  const response = await api.get(
    "/hospital/emergencies/today"
  );

  return response.data;
};


// =====================================================
// EMERGENCY DETAILS
// =====================================================

export const getEmergencyById = async (alertId) => {

  const response = await api.get(
    `/hospital/emergencies/${alertId}`
  );

  return response.data;
};


// =====================================================
// UPDATE EMERGENCY STATUS
// =====================================================

export const updateEmergencyStatus = async (
  alertId,
  status
) => {

  const response = await api.patch(
    `/hospital/emergencies/${alertId}/status`,
    {
      status: status
    }
  );

  return response.data;
};


// =====================================================
// EMERGENCY HISTORY
// =====================================================

export const getEmergencyHistory = async () => {

  const response = await api.get(
    "/hospital/emergencies/history"
  );

  return response.data;
};


// =====================================================
// SEARCH PATIENT
// =====================================================

export const searchPatients = async (
  patientId,
  name
) => {

  const params = {};

  if (patientId) {
    params.patientId = patientId;
  }

  if (name) {
    params.name = name;
  }

  const response = await api.get(
    "/hospital/hospital/patient/search/",
    {
      params
    }
  );

  return response.data;
};


// =====================================================
// FILTER PATIENTS
// =====================================================

export const filterPatients = async ({
  gender,
  bloodGroup,
  city,
  state,
  country,
  email
}) => {

  const params = {};

  if (gender) {
    params.gender = gender;
  }

  if (bloodGroup) {
    params.bloodGroup = bloodGroup;
  }

  if (city) {
    params.city = city;
  }

  if (state) {
    params.state = state;
  }

  if (country) {
    params.country = country;
  }

  if (email) {
    params.email = email;
  }

  const response = await api.get(
    "/hospital/patients/search&filter/",
    {
      params
    }
  );

  return response.data;
};
// =====================================================
// UPDATE HOSPITAL PROFILE
// =====================================================

export const updateHospitalProfile = async (hospitalData) => {
  const response = await api.patch(
    "/hospital/profile",
    hospitalData
  );

  return response.data;
};