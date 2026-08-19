package com.example.Lifelink.Service.ServicesImplementation;

import com.example.Lifelink.Service.BrevoEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
@RequiredArgsConstructor
public class BrevoEmailServiceImpl implements BrevoEmailService {

    @Value("${BREVO_API_KEY}")
    private String brevoApiKey;

    @Value("${BREVO_FROM}")
    private String fromEmail;

    @Value("${BREVO_FROM_NAME}")
    private String fromName;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Override
    public boolean sendEmail(
            String recipientEmail,
            String recipientName,
            String subject,
            String htmlContent
    ) {

        try {

            if (recipientEmail == null || recipientEmail.isBlank()) {
                System.err.println("Brevo email skipped: recipient email is empty.");
                return false;
            }

            String safeRecipientName =
                    recipientName == null || recipientName.isBlank()
                            ? "Recipient"
                            : recipientName;

            String jsonBody = """
                    {
                        "sender": {
                            "name": "%s",
                            "email": "%s"
                        },
                        "to": [
                            {
                                "email": "%s",
                                "name": "%s"
                            }
                        ],
                        "subject": "%s",
                        "htmlContent": %s
                    }
                    """.formatted(
                    escapeJson(fromName),
                    escapeJson(fromEmail),
                    escapeJson(recipientEmail.trim()),
                    escapeJson(safeRecipientName),
                    escapeJson(subject),
                    jsonString(htmlContent)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("accept", "application/json")
                    .header("api-key", brevoApiKey)
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            int statusCode = response.statusCode();

            if (statusCode >= 200 && statusCode < 300) {

                System.out.println("==============================================");
                System.out.println("LIFELINK EMAIL SENT SUCCESSFULLY VIA BREVO API");
                System.out.println("To      : " + recipientEmail);
                System.out.println("Subject : " + subject);
                System.out.println("Status  : " + statusCode);
                System.out.println("==============================================");

                return true;
            }

            System.err.println("==============================================");
            System.err.println("BREVO API EMAIL FAILED");
            System.err.println("To       : " + recipientEmail);
            System.err.println("Status   : " + statusCode);
            System.err.println("Response : " + response.body());
            System.err.println("==============================================");

            return false;

        } catch (Exception e) {

            System.err.println("==============================================");
            System.err.println("BREVO API EMAIL ERROR");
            System.err.println("To      : " + recipientEmail);
            System.err.println("Error   : " + e.getMessage());
            System.err.println("==============================================");

            e.printStackTrace();

            return false;
        }
    }

    private String escapeJson(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n")
                .replace("\t", "\\t");
    }

    private String jsonString(String value) {

        return "\"" + escapeJson(value) + "\"";
    }
}