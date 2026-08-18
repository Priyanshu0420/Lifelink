import { useEffect, useState } from "react";

import {
  QrCode,
  ArrowLeft,
  Download,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  generateQRCode,
  downloadQRCode,
  regenerateQRCode,
} from "../../services/qrApi";

import { getMyProfile } from "../../services/patientApi";


function QRCodePage() {

  const navigate = useNavigate();

  const [patientId, setPatientId] = useState(null);

  const [qrImageUrl, setQrImageUrl] = useState("");

  const [qrData, setQrData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);

  const [downloading, setDownloading] = useState(false);

  const [regenerating, setRegenerating] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [copied, setCopied] = useState(false);


  // =====================================================
  // LOAD PATIENT PROFILE
  // =====================================================

  useEffect(() => {

    loadPatient();

  }, []);


  const loadPatient = async () => {

  try {

    setLoading(true);

    setError("");

    const data = await getMyProfile();

    setPatientId(data.patientId);

    // Try to load existing QR
    try {

      const blob = await downloadQRCode(data.patientId);

      const imageUrl =
        window.URL.createObjectURL(blob);

      setQrImageUrl(imageUrl);

      setQrData({
        patientId: data.patientId,
        qrValue: "",
      });

    } catch (qrErr) {

      // No QR exists yet
      console.log("No existing QR Code found.");

    }

  } catch (err) {

    console.error(
      "Failed to load patient profile:",
      err
    );

    setError(
      err.response?.data?.message ||
      "Unable to load patient information."
    );

  } finally {

    setLoading(false);

  }

};

  const loadQRImage = async (id) => {
  try {
    const blob = await downloadQRCode(id);

    const imageUrl = window.URL.createObjectURL(blob);

    setQrImageUrl(imageUrl);

  } catch (err) {

    console.error("Failed to load QR image:", err);

    setError("QR generated, but image could not be displayed.");

  }
};


  // =====================================================
  // GENERATE QR
  // =====================================================

  const handleGenerate = async () => {

    if (!patientId) {
      return;
    }

    try {

      setGenerating(true);

      setError("");

      setSuccess("");

      const data = await generateQRCode(patientId);

console.log("QR RESPONSE:", data);

setQrData(data);

await loadQRImage(patientId);

setSuccess(
  "QR Code generated successfully."
);

    } catch (err) {

      console.error(
        "Failed to generate QR:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to generate QR Code."
      );

    } finally {

      setGenerating(false);

    }

  };


  // =====================================================
  // DOWNLOAD QR
  // =====================================================

  const handleDownload = async () => {

    if (!patientId) {
      return;
    }

    try {

      setDownloading(true);

      setError("");

      const blob = await downloadQRCode(patientId);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `patient-${patientId}-qr.png`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setSuccess(
        "QR Code downloaded successfully."
      );

    } catch (err) {

      console.error(
        "Failed to download QR:",
        err
      );

      setError(
        "Unable to download QR Code."
      );

    } finally {

      setDownloading(false);

    }

  };


  // =====================================================
  // REGENERATE QR
  // =====================================================

  const handleRegenerate = async () => {

    if (!patientId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to regenerate your QR Code?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setRegenerating(true);

      setError("");

      setSuccess("");

      const data =
  await regenerateQRCode(patientId);

setQrData(data);

await loadQRImage(patientId);

setSuccess(
  "QR Code regenerated successfully."
);

    } catch (err) {

      console.error(
        "Failed to regenerate QR:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to regenerate QR Code."
      );

    } finally {

      setRegenerating(false);

    }

  };


  // =====================================================
  // COPY QR VALUE
  // =====================================================

  const handleCopy = async () => {

    if (!qrData?.qrValue) {
      return;
    }

    try {

      await navigator.clipboard.writeText(
        qrData.qrValue
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (err) {

      console.error(
        "Failed to copy QR value:",
        err
      );

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="qr-page">

        <div className="qr-loading">

          Loading QR information...

        </div>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="qr-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="qr-header">

        <button
          className="qr-back-button"
          onClick={() =>
            navigate("/patient/dashboard")
          }
        >

          <ArrowLeft size={17} />

          Dashboard

        </button>


        <div className="qr-title-row">

          <div className="qr-title">

            <div className="qr-title-icon">

              <QrCode size={23} />

            </div>


            <div>

              <span>
                EMERGENCY IDENTIFICATION
              </span>

              <h1>
                QR Code
              </h1>

              <p>
                Your emergency medical identification QR Code.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          MESSAGES
      ================================================= */}

      {success && (

        <div className="qr-success">

          {success}

        </div>

      )}


      {error && (

        <div className="qr-error">

          {error}

        </div>

      )}


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="qr-container">


        {!qrData && (

          <div className="qr-empty">

            <div className="qr-empty-icon">

              <QrCode size={32} />

            </div>


            <h2>
              No QR Code Loaded
            </h2>


            <p>
              Generate your emergency QR Code.
              It can be scanned to access your
              emergency medical information.
            </p>


            <button
              className="qr-primary-button"
              onClick={handleGenerate}
              disabled={generating}
            >

              <QrCode size={18} />

              {generating
                ? "Generating..."
                : "Generate QR Code"}

            </button>

          </div>

        )}


        {qrData && (

          <div className="qr-card">


            {/* QR HEADER */}

            <div className="qr-card-header">

              <div>

                <span>
                  EMERGENCY QR
                </span>

                <h2>
                  Your LifeLink QR Code
                </h2>

              </div>


              <div className="qr-status">

                ACTIVE

              </div>

            </div>


            {/* QR IMAGE */}

            <div className="qr-image-container">

  {qrImageUrl ? (

    <img
      src={qrImageUrl}
      alt="LifeLink QR Code"
      className="qr-image"
    />

  ) : (

    <div className="qr-image-placeholder">

      <QrCode size={100} />

    </div>

  )}

</div>


            {/* PATIENT ID */}

            <div className="qr-info">

              <span>
                PATIENT ID
              </span>

              <strong>
                {qrData.patientId}
              </strong>

            </div>


            {/* QR VALUE */}

            {qrData.qrValue && (

              <div className="qr-value-section">

                <span>
                  QR DESTINATION
                </span>


                <div className="qr-value-row">

                  <input
                    value={qrData.qrValue}
                    readOnly
                  />


                  <button
                    onClick={handleCopy}
                    className="qr-copy-button"
                  >

                    {copied ? (
                      <Check size={17} />
                    ) : (
                      <Copy size={17} />
                    )}

                  </button>

                </div>

              </div>

            )}


            {/* ACTIONS */}

            <div className="qr-actions">


              <button
                className="qr-download-button"
                onClick={handleDownload}
                disabled={downloading}
              >

                <Download size={17} />

                {downloading
                  ? "Downloading..."
                  : "Download QR"}

              </button>


              <button
                className="qr-regenerate-button"
                onClick={handleRegenerate}
                disabled={regenerating}
              >

                <RefreshCw size={17} />

                {regenerating
                  ? "Regenerating..."
                  : "Regenerate"}

              </button>


            </div>


            {/* SECURITY NOTE */}

            <div className="qr-note">

              <strong>
                Important
              </strong>

              <p>
                Keep your QR Code accessible during
                emergencies. Scanning it allows authorized
                emergency users to access your public
                emergency medical information.
              </p>

            </div>


          </div>

        )}

      </div>

    </div>

  );

}


export default QRCodePage;