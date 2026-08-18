import api from "./api";

// =====================================================
// QR CODE
// =====================================================

// Generate QR Code
export const generateQRCode = async (patientId) => {
  const response = await api.post(
    `/qr/generate/${patientId}`
  );

  return response.data;
};


// Download QR Code
export const downloadQRCode = async (patientId) => {
  const response = await api.get(
    `/qr/download/${patientId}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};


// Regenerate QR Code
export const regenerateQRCode = async (patientId) => {
  const response = await api.post(
    `/qr/regenerate/${patientId}`
  );

  return response.data;
};