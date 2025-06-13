<h1 align="center">💥 EV Rental 💥</h1>

<p align="center"><i>Revolutionizing Fleet Management with Intelligent Automation</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/last%20commit-last%20sunday-lightgrey?style=flat-square&logo=github" />
  <img src="https://img.shields.io/badge/javascript-97.1%25-blue?style=flat-square&logo=javascript" />
  <img src="https://img.shields.io/badge/languages-3-blue?style=flat-square&logo=code" />
</p>

---

### ✨ Built with the tools and technologies:

<p>
  <img src="https://img.shields.io/badge/Express-black?style=flat-square&logo=express" />
  <img src="https://img.shields.io/badge/JSON-black?style=flat-square&logo=json" />
  <img src="https://img.shields.io/badge/npm-red?style=flat-square&logo=npm&logoColor=white" />
  <img src="https://img.shields.io/badge/Autoprefixer-ff4466?style=flat-square&logo=autoprefixer&logoColor=white" />
  <img src="https://img.shields.io/badge/Mongoose-800000?style=flat-square&logo=mongoose&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-ffca28?style=flat-square&logo=firebase&logoColor=white" />
  <img src="https://img.shields.io/badge/PostCSS-dd3a0a?style=flat-square&logo=postcss&logoColor=white" />
  <img src="https://img.shields.io/badge/.ENV-yellowgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/JavaScript-yellow?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B?style=flat-square&logo=nodemon&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646cff?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/Twilio-F22F46?style=flat-square&logo=twilio&logoColor=white" />
</p>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Why Deep-Drillers-2.0?](#why-deep-drillers-20)
- [Built with the tools and technologies](#-built-with-the-tools-and-technologies)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)

---

## Overview

Deep-Drillers-2.0 is an all-in-one developer toolkit crafted to accelerate the development of electric vehicle rental and fleet management systems. It combines a robust backend architecture with a dynamic React frontend, supporting features like vehicle data management, real-time updates, secure user authentication, and seamless communication workflows.

---

## Why  EV Rental ?

This project simplifies building scalable, feature-rich applications for fleet and user management. The core features include:

- 🛠️ **Vehicle Data Schema**: Defines consistent vehicle attributes, statuses, and damages for efficient fleet tracking.

- 📩 **Messaging & Notifications**: Enables reliable email and SMS alerts via integrated services like Nodemailer and Twilio.

- 🎨 **Frontend Setup**: React-based UI with Tailwind CSS, QR code scanning, and real-time updates for a polished user experience.

- 🔐 **Secure Backend**: Modular API with authentication, location services, booking, and payment processing.

- 🖼️ **Media & KYC**: Handles image uploads, facial verification, and Aadhaar-based identity validation.

- ⚙️ **Utility & Integration**: Utilities for QR code generation, email, and cloud media management streamline development.

---


## 🛠️ Getting Started

To get a local copy up and running follow these simple steps.

---

### 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine
- A MongoDB database (local or cloud)
- Cloudinary account for media uploads

---

### ⚙️ Installation

Build Deep-Drillers-2.0 from the source and install dependencies:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/mihir1816/Deep-Drillers-2.0
    ```

2. **Navigate to the project directory:**

    ```bash
    cd Deep-Drillers-2.0
    ```
3. **Create a .env file in the root directory and add the required environment variables:**

PORT=5000
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
NODE_ENV=development
CORS_ORIGIN=*

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password
  

4. **Install the dependencies:**

    1. cd backend\
    Using [npm](https://www.npmjs.com/):

    ```bash
    npm install
    ```
    2. cd frontend\
   ```bash
    npm install
    ```
---

## 🧩 Usage

### Start the backend server:

```bash
cd backend/src
node app.js
```
### Start the frontend:

```bash
cd frontend
npm run dev
```

---

