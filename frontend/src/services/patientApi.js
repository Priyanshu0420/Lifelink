import api from "./api";



// =====================================================
// PATIENT PROFILE
// =====================================================

export const getMyProfile = async () => {

  const response = await api.get("/patient/profile");

  return response.data;
};


export const updateMyProfile = async (profileData) => {

  const response = await api.patch(
    "/patient/profile",
    profileData
  );

  return response.data;
};


export const deleteMyProfile = async () => {

  const response = await api.delete(
    "/patient/profile"
  );

  return response.data;
};



// =====================================================
// EMERGENCY CONTACTS
// =====================================================

export const getEmergencyContacts = async () => {

  const response = await api.get(
    "/patient/emergency-contact/all-contacts"
  );

  return response.data;
};


export const addEmergencyContact = async (contactData) => {

  const response = await api.post(
    "/patient/emergency-contact/add-contact",
    contactData
  );

  return response.data;
};


export const updateEmergencyContact = async (
  contactId,
  contactData
) => {

  const response = await api.patch(
    `/patient/emergency-contact/?contactId=${contactId}`,
    contactData
  );

  return response.data;
};


export const deleteEmergencyContact = async (contactId) => {

  const response = await api.delete(
    `/patient/emergency-contact/contacts/?contactId=${contactId}`
  );

  return response.data;
};




// =====================================================
// INSURANCE
// =====================================================

export const getMyInsurance = async () => {

  const response = await api.get(
    "/patient/insurance"
  );

  return response.data;
};


export const addInsurance = async (insuranceData) => {

  const response = await api.post(
    "/patient/insurance",
    insuranceData
  );

  return response.data;
};


export const updateInsurance = async (insuranceData) => {

  const response = await api.patch(
    "/patient/insurance",
    insuranceData
  );

  return response.data;
};


export const deleteInsurance = async () => {

  const response = await api.delete(
    "/patient/insurance"
  );

  return response.data;
};