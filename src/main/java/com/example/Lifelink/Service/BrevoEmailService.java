package com.example.Lifelink.Service;


public interface BrevoEmailService {

    boolean sendEmail(
            String recipientEmail,
            String recipientName,
            String subject,
            String htmlContent
    );
}
