package com.example.Lifelink.Service.ServicesImplementation;

import com.example.Lifelink.Entity.EmergencyAlert;
import com.example.Lifelink.Entity.EmergencyContacts;
import com.example.Lifelink.Entity.NotificationLog;
import com.example.Lifelink.Repository.NotificationLogRepository;
import com.example.Lifelink.Service.NotificationService;
import com.example.Lifelink.Type.EnumNotification;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender mailSender;
    private final NotificationLogRepository notificationLogRepository;

    /*
     * This must be the same email address configured in
     * spring.mail.username
     */
    @Value("${spring.mail.username}")
    private String mailUsername;


    // =========================================================
    // MAIN NOTIFICATION METHOD
    // =========================================================

    @Override
    @Async("notificationExecutor")
    public void sendEmergencyNotifications(EmergencyAlert alert) {

        if (alert == null) {
            System.err.println("Cannot send notification: alert is null.");
            return;
        }

        if (alert.getPatient() == null) {
            System.err.println("Cannot send notification: patient is null.");
            return;
        }

        // -----------------------------------------------------
        // HOSPITAL
        // -----------------------------------------------------

        sendHospitalNotification(alert);


        // -----------------------------------------------------
        // FAMILY / EMERGENCY CONTACTS
        // -----------------------------------------------------

        if (alert.getPatient().getEmergencyContacts() != null) {

            for (EmergencyContacts contact :
                    alert.getPatient().getEmergencyContacts()) {

                if (contact == null) {
                    continue;
                }

                if (contact.getEmail() != null &&
                        !contact.getEmail().isBlank()) {

                    sendFamilyNotification(alert, contact);
                }
            }
        }
    }


    // =========================================================
    // HOSPITAL NOTIFICATION
    // =========================================================

    private void sendHospitalNotification(
            EmergencyAlert alert
    ) {

        if (alert.getHospital() == null) {

            System.err.println(
                    "Hospital notification skipped: hospital is null."
            );

            return;
        }

        String hospitalEmail =
                alert.getHospital().getEmail();

        if (hospitalEmail == null ||
                hospitalEmail.isBlank()) {

            System.err.println(
                    "Hospital notification skipped: hospital email unavailable."
            );

            return;
        }

        String hospitalName =
                alert.getHospital().getHospitalName();

        if (hospitalName == null ||
                hospitalName.isBlank()) {

            hospitalName = "Assigned Hospital";
        }

        String subject =
                "🚨 LifeLink Emergency Alert - Immediate Attention Required";

        String message =
                buildEmailMessage(alert);

        sendEmail(
                hospitalEmail,
                hospitalName,
                "HOSPITAL",
                subject,
                message,
                alert
        );
    }


    // =========================================================
    // FAMILY / EMERGENCY CONTACT NOTIFICATION
    // =========================================================

    private void sendFamilyNotification(
            EmergencyAlert alert,
            EmergencyContacts contact
    ) {

        String patientName =
                alert.getPatient().getPatientName();

        if (patientName == null ||
                patientName.isBlank()) {

            patientName = "Patient";
        }

        String contactName =
                contact.getContactName();

        if (contactName == null ||
                contactName.isBlank()) {

            contactName = "Emergency Contact";
        }

        String subject =
                "🚨 LifeLink Emergency Alert - " + patientName;

        String message =
                buildEmailMessage(alert);

        sendEmail(
                contact.getEmail(),
                contactName,
                "FAMILY",
                subject,
                message,
                alert
        );
    }


    // =========================================================
    // SEND EMAIL
    // =========================================================

    private void sendEmail(
            String recipientEmail,
            String recipientName,
            String recipientType,
            String subject,
            String htmlMessage,
            EmergencyAlert alert
    ) {

        // -----------------------------------------------------
        // BASIC VALIDATION
        // -----------------------------------------------------

        if (recipientEmail == null ||
                recipientEmail.isBlank()) {

            System.err.println(
                    "Email skipped: recipient email is empty."
            );

            return;
        }

        if (mailUsername == null ||
                mailUsername.isBlank()) {

            System.err.println(
                    "EMAIL CONFIGURATION ERROR: "
                            + "spring.mail.username is empty."
            );

            return;
        }


        // -----------------------------------------------------
        // SHORT DATABASE MESSAGE
        //
        // IMPORTANT:
        // Do NOT save the complete HTML email here.
        // That was causing:
        //
        // value too long for type character varying(5000)
        // -----------------------------------------------------

        String logMessage =
                buildNotificationLogMessage(alert);


        NotificationLog log =
                NotificationLog.builder()
                        .emergencyAlert(alert)
                        .recipientName(
                                safeText(
                                        recipientName,
                                        "Unknown Recipient"
                                )
                        )
                        .recipientEmail(
                                recipientEmail.trim()
                        )
                        .recipientType(
                                recipientType
                        )
                        .notificationType(
                                "EMAIL"
                        )
                        .status(
                                EnumNotification.PENDING
                        )
                        .message(
                                logMessage
                        )
                        .build();


        // -----------------------------------------------------
        // SAVE PENDING LOG
        // -----------------------------------------------------

        try {

            notificationLogRepository.save(log);

        } catch (Exception databaseException) {

            /*
             * Do not stop the actual email attempt merely because
             * notification logging failed.
             */

            System.err.println(
                    "WARNING: Could not save PENDING notification log."
            );

            databaseException.printStackTrace();
        }


        // -----------------------------------------------------
        // CREATE EMAIL
        // -----------------------------------------------------

        try {

            MimeMessage mail =
                    mailSender.createMimeMessage();


            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mail,
                            false,
                            StandardCharsets.UTF_8.name()
                    );


            // -------------------------------------------------
            // IMPORTANT:
            // Explicit FROM address fixes:
            //
            // can't determine local email address
            // -------------------------------------------------

            helper.setFrom(
                    mailUsername,
                    "LifeLink Emergency System"
            );


            helper.setTo(
                    recipientEmail.trim()
            );


            helper.setSubject(
                    subject
            );


            // TRUE = HTML email
            helper.setText(
                    htmlMessage,
                    true
            );


            // -------------------------------------------------
            // SEND
            // -------------------------------------------------

            mailSender.send(mail);


            // -------------------------------------------------
            // UPDATE LOG
            // -------------------------------------------------

            log.setStatus(
                    EnumNotification.SENT
            );


            System.out.println(
                    "================================================="
            );

            System.out.println(
                    "LIFELINK EMAIL SENT SUCCESSFULLY"
            );

            System.out.println(
                    "To       : " + recipientEmail
            );

            System.out.println(
                    "Type     : " + recipientType
            );

            System.out.println(
                    "Patient  : "
                            + alert.getPatient().getPatientName()
            );

            System.out.println(
                    "Location : "
                            + getLocationText(alert)
            );

            System.out.println(
                    "================================================="
            );


        } catch (MessagingException e) {

            log.setStatus(
                    EnumNotification.FAILED
            );

            System.err.println(
                    "EMAIL FAILED TO: "
                            + recipientEmail
            );

            e.printStackTrace();


        } catch (Exception e) {

            log.setStatus(
                    EnumNotification.FAILED
            );

            System.err.println(
                    "UNEXPECTED EMAIL ERROR TO: "
                            + recipientEmail
            );

            e.printStackTrace();
        }


        // -----------------------------------------------------
        // UPDATE NOTIFICATION LOG
        // -----------------------------------------------------

        try {

            notificationLogRepository.save(log);

        } catch (Exception databaseException) {

            System.err.println(
                    "WARNING: Could not update notification log."
            );

            databaseException.printStackTrace();
        }
    }


    // =========================================================
    // SHORT NOTIFICATION LOG MESSAGE
    // =========================================================

    private String buildNotificationLogMessage(
            EmergencyAlert alert
    ) {

        String patientName =
                "Unknown Patient";

        if (alert.getPatient() != null &&
                alert.getPatient().getPatientName() != null &&
                !alert.getPatient().getPatientName().isBlank()) {

            patientName =
                    alert.getPatient().getPatientName();
        }


        String location =
                getLocationText(alert);


        return
                "LifeLink emergency SOS notification sent for "
                        + patientName
                        + ". "
                        + "Emergency location: "
                        + location;
    }


    // =========================================================
    // LOCATION TEXT
    // =========================================================

    private String getLocationText(
            EmergencyAlert alert
    ) {

        if (alert == null) {
            return "Not available";
        }

        if (alert.getLatitude() == null ||
                alert.getLongitude() == null) {

            return "Location not available";
        }

        return String.format(
                Locale.US,
                "%.6f, %.6f",
                alert.getLatitude(),
                alert.getLongitude()
        );
    }


    // =========================================================
    // GOOGLE MAPS URL
    // =========================================================

    private String buildGoogleMapsUrl(
            EmergencyAlert alert
    ) {

        if (alert == null ||
                alert.getLatitude() == null ||
                alert.getLongitude() == null) {

            return null;
        }

        return String.format(
                Locale.US,
                "https://www.google.com/maps/search/?api=1&query=%.6f,%.6f",
                alert.getLatitude(),
                alert.getLongitude()
        );
    }


    // =========================================================
    // BUILD HTML EMAIL
    // =========================================================

    private String buildEmailMessage(
            EmergencyAlert alert
    ) {

        var patient =
                alert.getPatient();


        String patientName =
                safeText(
                        patient.getPatientName(),
                        "Unknown Patient"
                );


        String bloodGroup =
                patient.getBloodGroup() != null
                        ? patient.getBloodGroup().name()
                        : "Not available";


        String allergies =
                patient.getAllergies() != null &&
                        !patient.getAllergies().isBlank()
                        ? patient.getAllergies()
                        : "None provided";


        String medicalConditions =
                patient.getMedicalConditions() != null &&
                        !patient.getMedicalConditions().isBlank()
                        ? patient.getMedicalConditions()
                        : "None provided";


        String emergencyContacts =
                getEmergencyContactInfoHtml(
                        patient
                );


        String scanTime =
                alert.getScanTime() != null
                        ? alert.getScanTime().toString()
                        : "Not available";


        String hospitalName =
                "Not assigned";


        if (alert.getHospital() != null &&
                alert.getHospital().getHospitalName() != null &&
                !alert.getHospital().getHospitalName().isBlank()) {

            hospitalName =
                    alert.getHospital().getHospitalName();
        }


        String locationSection;


        // =====================================================
        // LOCATION AVAILABLE
        // =====================================================

        if (alert.getLatitude() != null &&
                alert.getLongitude() != null) {

            String mapsUrl =
                    buildGoogleMapsUrl(alert);


            locationSection = """
                    <div style="
                        background:#fff7ed;
                        border:1px solid #fed7aa;
                        border-radius:12px;
                        padding:20px;
                    ">

                        <h2 style="
                            margin:0 0 15px;
                            font-size:19px;
                            color:#9a3412;
                        ">
                            📍 Emergency Location
                        </h2>

                        <p style="
                            margin:7px 0;
                            font-size:14px;
                        ">
                            <strong>Latitude:</strong>
                            %s
                        </p>

                        <p style="
                            margin:7px 0 18px;
                            font-size:14px;
                        ">
                            <strong>Longitude:</strong>
                            %s
                        </p>

                        <p style="
                            margin:0 0 18px;
                            font-size:13px;
                            color:#6b7280;
                        ">
                            These coordinates represent the location
                            captured when the emergency SOS was triggered.
                        </p>

                        <table
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            width="100%%"
                        >
                            <tr>
                                <td align="center">

                                    <a
                                        href="%s"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style="
                                            display:inline-block;
                                            background:#dc2626;
                                            color:#ffffff;
                                            text-decoration:none;
                                            padding:14px 24px;
                                            border-radius:8px;
                                            font-size:15px;
                                            font-weight:bold;
                                        "
                                    >
                                        📍 Open Location in Google Maps
                                    </a>

                                </td>
                            </tr>
                        </table>

                    </div>
                    """.formatted(

                    escapeHtml(
                            String.format(
                                    Locale.US,
                                    "%.6f",
                                    alert.getLatitude()
                            )
                    ),

                    escapeHtml(
                            String.format(
                                    Locale.US,
                                    "%.6f",
                                    alert.getLongitude()
                            )
                    ),

                    mapsUrl
            );

        } else {

            // =================================================
            // LOCATION NOT AVAILABLE
            // =================================================

            locationSection = """
                    <div style="
                        background:#fef2f2;
                        border:1px solid #fecaca;
                        border-radius:12px;
                        padding:20px;
                    ">

                        <h2 style="
                            margin:0 0 10px;
                            font-size:19px;
                            color:#991b1b;
                        ">
                            📍 Emergency Location
                        </h2>

                        <p style="
                            margin:0;
                            font-size:14px;
                            line-height:1.6;
                            color:#7f1d1d;
                        ">
                            Location coordinates were not available
                            when this emergency alert was triggered.
                            Please use the LifeLink dashboard or contact
                            the emergency responder for the current location.
                        </p>

                    </div>
                    """;
        }


        // =====================================================
        // COMPLETE EMAIL
        // =====================================================

        return """
                <!DOCTYPE html>

                <html>

                <head>

                    <meta charset="UTF-8">

                    <meta name="viewport"
                          content="width=device-width,
                          initial-scale=1.0">

                    <title>
                        LifeLink Emergency Alert
                    </title>

                </head>


                <body style="
                    margin:0;
                    padding:0;
                    background-color:#f4f7fb;
                    font-family:Arial,Helvetica,sans-serif;
                    color:#1f2937;
                ">


                <table width="100%%"
                       cellpadding="0"
                       cellspacing="0"
                       border="0"
                       style="
                           background-color:#f4f7fb;
                           padding:30px 15px;
                       ">

                    <tr>

                        <td align="center">


                            <table width="100%%"
                                   cellpadding="0"
                                   cellspacing="0"
                                   border="0"
                                   style="
                                       max-width:650px;
                                       background:#ffffff;
                                       border-radius:16px;
                                       overflow:hidden;
                                   ">


                                <!-- HEADER -->

                                <tr>

                                    <td style="
                                        background:#dc2626;
                                        padding:28px 30px;
                                        text-align:center;
                                        color:white;
                                    ">

                                        <div style="
                                            font-size:34px;
                                            margin-bottom:8px;
                                        ">
                                            🚨
                                        </div>


                                        <h1 style="
                                            margin:0;
                                            font-size:26px;
                                            font-weight:700;
                                        ">
                                            LifeLink Emergency Alert
                                        </h1>


                                        <p style="
                                            margin:8px 0 0;
                                            font-size:14px;
                                        ">
                                            Immediate attention required
                                        </p>

                                    </td>

                                </tr>


                                <!-- INTRODUCTION -->

                                <tr>

                                    <td style="
                                        padding:28px 30px 10px;
                                    ">

                                        <p style="
                                            margin:0;
                                            font-size:16px;
                                            line-height:1.6;
                                        ">

                                            An SOS emergency alert has
                                            been triggered through
                                            <strong>LifeLink</strong>.

                                        </p>

                                    </td>

                                </tr>


                                <!-- PATIENT INFORMATION -->

                                <tr>

                                    <td style="
                                        padding:20px 30px;
                                    ">

                                        <h2 style="
                                            margin:0 0 15px;
                                            font-size:19px;
                                            color:#111827;
                                        ">
                                            👤 Patient Information
                                        </h2>


                                        <table width="100%%"
                                               cellpadding="0"
                                               cellspacing="0"
                                               style="
                                                   border-collapse:collapse;
                                                   background:#f8fafc;
                                               ">

                                            <tr>

                                                <td style="
                                                    padding:12px;
                                                    font-weight:bold;
                                                    width:42%%;
                                                ">
                                                    Name
                                                </td>

                                                <td style="padding:12px;">
                                                    %s
                                                </td>

                                            </tr>


                                            <tr>

                                                <td style="
                                                    padding:12px;
                                                    font-weight:bold;
                                                ">
                                                    Blood Group
                                                </td>

                                                <td style="padding:12px;">
                                                    %s
                                                </td>

                                            </tr>


                                            <tr>

                                                <td style="
                                                    padding:12px;
                                                    font-weight:bold;
                                                ">
                                                    Allergies
                                                </td>

                                                <td style="padding:12px;">
                                                    %s
                                                </td>

                                            </tr>


                                            <tr>

                                                <td style="
                                                    padding:12px;
                                                    font-weight:bold;
                                                ">
                                                    Medical Conditions
                                                </td>

                                                <td style="padding:12px;">
                                                    %s
                                                </td>

                                            </tr>

                                        </table>

                                    </td>

                                </tr>


                                <!-- LOCATION -->

                                <tr>

                                    <td style="
                                        padding:10px 30px 25px;
                                    ">

                                        %s

                                    </td>

                                </tr>


                                <!-- EMERGENCY CONTACTS -->

                                <tr>

                                    <td style="
                                        padding:10px 30px 25px;
                                    ">

                                        <h2 style="
                                            margin:0 0 15px;
                                            font-size:19px;
                                            color:#111827;
                                        ">
                                            👨‍👩‍👧 Emergency Contacts
                                        </h2>


                                        <div style="
                                            background:#f8fafc;
                                            border-radius:10px;
                                            padding:15px;
                                        ">

                                            %s

                                        </div>

                                    </td>

                                </tr>


                                <!-- TIME + HOSPITAL -->

                                <tr>

                                    <td style="
                                        padding:5px 30px 25px;
                                    ">


                                        <table width="100%%"
                                               cellpadding="0"
                                               cellspacing="0"
                                               border="0">

                                            <tr>


                                                <td width="50%%"
                                                    valign="top"
                                                    style="
                                                        padding-right:8px;
                                                    ">

                                                    <div style="
                                                        background:#f8fafc;
                                                        padding:16px;
                                                        border-radius:10px;
                                                    ">

                                                        <div style="
                                                            font-size:13px;
                                                            color:#6b7280;
                                                            margin-bottom:5px;
                                                        ">
                                                            ALERT TIME
                                                        </div>


                                                        <div style="
                                                            font-size:14px;
                                                            font-weight:bold;
                                                        ">
                                                            %s
                                                        </div>

                                                    </div>

                                                </td>


                                                <td width="50%%"
                                                    valign="top"
                                                    style="
                                                        padding-left:8px;
                                                    ">

                                                    <div style="
                                                        background:#f8fafc;
                                                        padding:16px;
                                                        border-radius:10px;
                                                    ">

                                                        <div style="
                                                            font-size:13px;
                                                            color:#6b7280;
                                                            margin-bottom:5px;
                                                        ">
                                                            ASSIGNED HOSPITAL
                                                        </div>


                                                        <div style="
                                                            font-size:14px;
                                                            font-weight:bold;
                                                        ">
                                                            %s
                                                        </div>

                                                    </div>

                                                </td>


                                            </tr>

                                        </table>

                                    </td>

                                </tr>


                                <!-- ACTION -->

                                <tr>

                                    <td style="
                                        padding:5px 30px 30px;
                                    ">

                                        <div style="
                                            background:#fef2f2;
                                            border-left:4px solid #dc2626;
                                            padding:15px 18px;
                                            border-radius:6px;
                                        ">

                                            <p style="
                                                margin:0;
                                                font-size:14px;
                                                line-height:1.6;
                                                color:#7f1d1d;
                                            ">

                                                Please take immediate
                                                appropriate action and
                                                respond to this emergency
                                                alert as soon as possible.

                                            </p>

                                        </div>

                                    </td>

                                </tr>


                                <!-- FOOTER -->

                                <tr>

                                    <td style="
                                        background:#111827;
                                        padding:22px 30px;
                                        text-align:center;
                                    ">

                                        <p style="
                                            margin:0;
                                            color:#ffffff;
                                            font-size:14px;
                                            font-weight:bold;
                                        ">
                                            LifeLink
                                        </p>


                                        <p style="
                                            margin:6px 0 0;
                                            color:#9ca3af;
                                            font-size:12px;
                                        ">
                                            Smart Emergency Response
                                            & Medical Identity System
                                        </p>


                                        <p style="
                                            margin:10px 0 0;
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            This notification was
                                            automatically generated by
                                            LifeLink.
                                        </p>

                                    </td>

                                </tr>


                            </table>

                        </td>

                    </tr>

                </table>


                </body>

                </html>

                """.formatted(

                escapeHtml(patientName),

                escapeHtml(bloodGroup),

                escapeHtml(allergies),

                escapeHtml(medicalConditions),

                locationSection,

                emergencyContacts,

                escapeHtml(scanTime),

                escapeHtml(hospitalName)
        );
    }


    // =========================================================
    // EMERGENCY CONTACT HTML
    // =========================================================

    private String getEmergencyContactInfoHtml(
            com.example.Lifelink.Entity.Patient patient
    ) {

        if (patient.getEmergencyContacts() == null ||
                patient.getEmergencyContacts().isEmpty()) {

            return """
                    <p style="
                        margin:0;
                        color:#6b7280;
                        font-size:14px;
                    ">
                        No emergency contact available.
                    </p>
                    """;
        }


        StringBuilder contacts =
                new StringBuilder();


        for (EmergencyContacts contact :
                patient.getEmergencyContacts()) {

            if (contact == null) {
                continue;
            }


            contacts.append("""
                    <div style="
                        padding:12px 0;
                        border-bottom:1px solid #e5e7eb;
                    ">
                    """);


            String contactName =
                    safeText(
                            contact.getContactName(),
                            "Emergency Contact"
                    );


            contacts.append("""
                    <div style="
                        font-size:15px;
                        font-weight:bold;
                        color:#111827;
                    ">
                    """);


            contacts.append(
                    escapeHtml(contactName)
            );


            contacts.append(
                    "</div>"
            );


            if (contact.getRelationship() != null &&
                    !contact.getRelationship().isBlank()) {

                contacts.append("""
                        <div style="
                            margin-top:4px;
                            font-size:13px;
                            color:#6b7280;
                        ">
                        """);

                contacts.append(
                        escapeHtml(
                                contact.getRelationship()
                        )
                );

                contacts.append(
                        "</div>"
                );
            }


            if (contact.getPhone() != null &&
                    !contact.getPhone().isBlank()) {

                contacts.append("""
                        <div style="
                            margin-top:5px;
                            font-size:13px;
                            color:#374151;
                        ">
                            📞
                        """);

                contacts.append(
                        escapeHtml(
                                contact.getPhone()
                        )
                );

                contacts.append(
                        "</div>"
                );
            }


            if (contact.getEmail() != null &&
                    !contact.getEmail().isBlank()) {

                contacts.append("""
                        <div style="
                            margin-top:4px;
                            font-size:13px;
                            color:#374151;
                        ">
                            ✉️
                        """);

                contacts.append(
                        escapeHtml(
                                contact.getEmail()
                        )
                );

                contacts.append(
                        "</div>"
                );
            }


            contacts.append(
                    "</div>"
            );
        }


        return contacts.toString();
    }


    // =========================================================
    // SAFE TEXT
    // =========================================================

    private String safeText(
            String value,
            String fallback
    ) {

        if (value == null ||
                value.isBlank()) {

            return fallback;
        }

        return value;
    }


    // =========================================================
    // HTML ESCAPING
    // =========================================================

    private String escapeHtml(
            String value
    ) {

        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}