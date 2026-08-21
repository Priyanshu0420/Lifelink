🏥 LifeLink

 Smart Healthcare & Emergency Response Platform

**A full-stack healthcare platform designed to make critical patient information accessible during emergencies through a secure QR-based digital identity.**

---

 🚀 Project Overview

LifeLink is an end-to-end healthcare management platform built to address a real-world problem: **how can essential patient information be accessed quickly and securely during an emergency?**

The platform provides patients with a **digital emergency profile linked to a unique QR code**. When the QR code is scanned, authorized emergency information such as blood group, allergies, medical conditions, and emergency contacts can be accessed without exposing sensitive account credentials.

Beyond emergency identification, LifeLink provides a broader healthcare ecosystem covering:

* 👤 Patient management
* 👨‍⚕️ Doctor management
* 🏥 Hospital management
* 📅 Appointment management
* 🛡️ Insurance information
* 🚨 Emergency alerts
* 📍 Location-aware emergency workflows
* 📧 Notifications
* 📷 QR-based emergency profiles
* 📱 Mobile application

---

 🎯 The Problem I Wanted to Solve

In an emergency situation, even a small delay in accessing important patient information can make the situation more difficult.

Traditional methods may rely on:

* Physical medical cards
* Verbal communication
* Manually contacting family members
* Searching through separate healthcare records

 💡 My Solution

I designed LifeLink around a simple workflow:

```text
Patient
   ↓
Digital Emergency Profile
   ↓
Unique QR Code
   ↓
Emergency Scan
   ↓
Essential Patient Information
   ↓
Emergency Response
```

The objective is to make essential information **quickly accessible while keeping sensitive user credentials protected**.

---

# ⭐ Key Features

 🚨 Emergency Response

* SOS / emergency alert system
* Emergency event tracking
* Location-aware emergency workflow
* Hospital assignment
* Emergency notification logging

 📷 QR-Based Emergency Identity

* Generate a unique QR code for a patient
* Regenerate QR codes when required
* Download QR codes
* Public emergency profile
* Controlled exposure of emergency information

 👤 Patient Management

* Patient registration and authentication
* Patient profile management
* Emergency contacts
* Medical information
* Insurance information

 🏥 Healthcare Management

* Doctor management
* Hospital management
* Department management
* Appointment management

 🔐 Secure Authentication

* JWT-based authentication
* Spring Security
* Role-based authorization
* Protected REST APIs
* Public/private resource separation

 📧 Notifications

* Emergency email notifications
* Notification logging
* Dedicated notification service

 📱 Mobile Application

* React Native / Expo application
* Android APK
* Mobile access to LifeLink functionality

---

 🧠 How LifeLink Works

``
                    PATIENT
                       │
                       ▼
              Create Emergency Profile
                       │
                       ▼
                Generate QR Code
                       │
                       ▼
                   QR Scan
                       │
                       ▼
           ┌─────────────────────────┐
           │ Emergency Information   │
           ├─────────────────────────┤
           │ Patient Identity        │
           │ Blood Group             │
           │ Allergies               │
           │ Medical Conditions      │
           │ Emergency Contacts      │
           └────────────┬────────────┘
                        │
                        ▼
                 Emergency Alert
                        │
                        ▼
               Location / Hospital
                        │
                        ▼
                  Notifications
```

---

 💼 What This Project Demonstrates

LifeLink was built as a **complete software product**, not just a basic CRUD application.

# Software Engineering

* Designed a layered backend architecture
* Developed RESTful APIs
* Implemented business logic using service layers
* Designed relational database entities
* Integrated PostgreSQL with JPA/Hibernate

# Security

* Implemented JWT authentication
* Configured Spring Security
* Added role-based access control
* Separated public emergency information from private user data

# Full-Stack Development

* Built a React web application
* Connected frontend and backend through REST APIs
* Implemented authentication and protected requests
* Developed healthcare and emergency workflows

# Mobile Development

* Extended the platform to Android
* Built the mobile application using React Native and Expo
* Generated a distributable Android APK

# Deployment & DevOps

* Containerized the backend using Docker
* Configured cloud database connectivity
* Deployed the web application
* Built and distributed the Android application

---

 🏗️ Application Architecture

``
                  ┌─────────────────────┐
                  │     React Web       │
                  │       Client        │
                  └──────────┬──────────┘
                             │
                             │ REST API
                             ▼
              ┌─────────────────────────────┐
              │      Spring Boot API        │
              │                             │
              │  Controllers                │
              │       ↓                     │
              │  Services                   │
              │       ↓                     │
              │  Repositories               │
              │       ↓                     │
              │  PostgreSQL                 │
              │                             │
              │  Security / JWT             │
              │  QR Services                │
              │  Emergency Services         │
              │  Notification Services      │
              └──────────────┬──────────────┘
                             │
                             │ REST API
                             ▼
                    ┌─────────────────┐
                    │  Mobile Client  │
                    │ React Native +  │
                    │      Expo       │
                    └─────────────────┘
```

---

 🛠️ Technology Stack

# Backend

* **Java 21**
* **Spring Boot**
* **Spring Security**
* **JWT / JJWT**
* **Spring Data JPA**
* **Hibernate**
* **PostgreSQL**
* **ZXing**
* **Spring Mail**
* **ModelMapper**
* **SpringDoc OpenAPI**
* **Lombok**

# Frontend

* **React**
* **Vite**
* **Axios**
* **React Router**
* **JavaScript**

# Mobile

* **React Native**
* **Expo**
* **Android**

# Deployment & DevOps

* **Docker**
* **Docker Compose**
* **Vercel**
* **Render**
* **Cloud PostgreSQL**
* **Expo EAS**

---

# 🔐 Security

Security was considered throughout the application architecture.

 Authentication Flow

``
Login
  ↓
Credential Verification
  ↓
JWT Generation
  ↓
Authenticated Request
  ↓
JWT Validation
  ↓
Authorization
  ↓
Protected Resource
```

The public emergency profile is intentionally separated from authenticated patient resources.

The QR-based emergency workflow does not expose sensitive authentication information such as passwords or JWT tokens.

---

# 📊 Project Highlights

| Area                    | Implementation                      |
| ----------------------- | ----------------------------------- |
|   Application Type      | Full-Stack Healthcare Platform      |
|   Backend               | Java + Spring Boot                  |
|   Frontend              | React + Vite                        |
|   Mobile                | React Native + Expo                 |
|   Database              | PostgreSQL                          |
|   Authentication        | Spring Security + JWT               |
|   Emergency Feature     | QR-based Digital Emergency Profile  |
|   Notifications         | Email-based Emergency Notifications |
|   API Architecture      | REST                                |
|   Containerization      | Docker                              |
|   Web Deployment        | Vercel                              |
|   Backend Deployment    | Render                              |
|   Mobile Distribution   | Expo EAS                            |

---

# 🌐 Live Project

 Web Application

Open LifeLink → https://lifelink-frontend-five.vercel.app/

Explore the deployed web application and experience the LifeLink workflow.

 Android Application

Download LifeLink APK → https://expo.dev/accounts/lifelink.apps/projects/lifelink-mobile-shell/builds/6d6271c6-26b7-4b05-8121-ca0990175b32

Try the Android version of the application.

---

 💻 Running Locally

## Prerequisites

* Java 21+
* Maven
* PostgreSQL
* Node.js & npm
* Git
* Docker *(optional)*

## Clone

```bash
git clone https://github.com/Priyanshu0420/Lifelink.git
cd Lifelink
```

## Backend

Configure the required environment variables and run:

### Windows

```powershell
.\mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🐳 Docker

The Spring Boot backend can also be run using Docker.

### Build

```bash
docker build -t lifelink-backend .
```

### Run

```bash
docker run --name lifelink-backend -p 8080:8080 lifelink-backend
```

---

# 📁 Project Structure

```text
Lifelink/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/Lifelink/
│       │       ├── Controller/
│       │       ├── Entity/
│       │       ├── Repository/
│       │       ├── Service/
│       │       ├── Security/
│       │       └── ...
│       │
│       └── resources/
│
├── frontend/
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

# 📈 Future Enhancements

Planned areas for further development include:

* Real-time emergency tracking
* Hospital-side emergency dashboard
* Push notifications
* Advanced appointment scheduling
* Medical document management
* Automated testing
* CI/CD integration
* Monitoring and observability
* AI-assisted healthcare workflows
* Expanded mobile functionality

---

# 👨‍💻 Developer

## Priyanshu Thakur

**B.Tech — Computer Science & Engineering (AI)**

### Technical Interests

**Java · Spring Boot · Backend Development · REST APIs · PostgreSQL · Full-Stack Development · Cloud & DevOps**

---

# ⭐ Why LifeLink?

LifeLink combines **real-world problem solving with full-stack software engineering**.

The project covers the complete journey from:

**Problem Identification**

↓

**System Design**

↓

**Backend Development**

↓

**Database Design**

↓

**Security Implementation**

↓

**Frontend Development**

↓

**Mobile Development**

↓

**Cloud Deployment**

The result is a **working multi-platform healthcare application** demonstrating practical experience in building, integrating, securing, and deploying a complete software product.

---

## 📄 License

This project is maintained as a personal/portfolio project.

For questions regarding usage, modification, or redistribution, please contact the developer.
