package com.example.Lifelink.Service;


import com.example.Lifelink.Entity.EmergencyAlert;

public interface NotificationService {

    void sendEmergencyNotifications(EmergencyAlert alert);
}
