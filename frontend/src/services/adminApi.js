import api from "./api";


// =====================================================
// GET ALL HOSPITALS
// =====================================================

export const getAllHospitals = async () => {

  const response = await api.get(
    "/admin/hospital/get-all-hospitals"
  );

  return response.data;
};


// =====================================================
// APPROVE HOSPITAL
// =====================================================

export const approveHospital = async (hospitalId) => {

  const response = await api.put(
    `/admin/hospital/${hospitalId}/approve`
  );

  return response.data;
};


// =====================================================
// REJECT HOSPITAL
// =====================================================

export const rejectHospital = async (hospitalId) => {

  const response = await api.put(
    `/admin/hospital/${hospitalId}/reject`
  );

  return response.data;
};


// =====================================================
// GET ALL PATIENTS
// =====================================================

export const getAllPatients = async (page = 0, size = 15) => {

  const response = await api.get(
    "/admin/patient/get-all-patients",
    {
      params: {
        page,
        size
      }
    }
  );

  return response.data;
};


// =====================================================
// UPDATE PATIENT
// =====================================================

export const updatePatient = async (
  patientId,
  patientData
) => {

  const response = await api.put(
    `/admin/patient/${patientId}/update-patient`,
    patientData
  );

  return response.data;
};