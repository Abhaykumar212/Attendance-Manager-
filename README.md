# Attendance Manager

## Project Overview

The Attendance Manager is a full-stack web application designed to streamline the process of managing attendance. It provides functionalities for user registration, login, email verification, and the ability to add and track attendance records. The application is built with a modern technology stack, featuring a Node.js backend with Express.js and MongoDB, and a dynamic frontend developed using React.js.

## Features

*   **User Authentication**: Secure user registration, login, and session management.
*   **Email Verification**: Ensures valid user accounts through email verification.
*   **Attendance Tracking**: Functionality to add and manage attendance records.
*   **Role-Based Access (Inferred)**: Routes like `/phome` suggest potential different user roles (e.g., student, professor/admin).
*   **Responsive User Interface**: Built with React.js for a dynamic and interactive user experience.

## Technologies Used

### Backend
*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB**: NoSQL database for flexible data storage.
*   **Mongoose**: MongoDB object data modeling (ODM) for Node.js.
*   **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
*   **Axios**: Promise-based HTTP client for making API requests.

### Frontend
*   **React.js**: JavaScript library for building user interfaces.
*   **React Router DOM**: For declarative routing in React applications.
*   **Axios**: For making HTTP requests to the backend API.

## Installation

To set up and run the project locally, follow these steps:

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn
*   MongoDB instance (local or cloud-hosted)

### Backend Setup

1.  Navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Backend` directory and configure your MongoDB connection string and other environment variables (e.g., `MONGO_URI`, `PORT`, `JWT_SECRET`).
    ```
    MONGO_URI=mongodb://localhost:27017/attendance_db
    PORT=5000
    JWT_SECRET=your_jwt_secret_key
    # Add other necessary environment variables like email service credentials for verification
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React development server:
    ```bash
    npm start
    ```

## Usage

Once both the backend and frontend servers are running:

1.  Open your web browser and navigate to `http://localhost:3000` (or whatever port your frontend is running on).
2.  **Register**: Create a new user account via the `/register` route.
3.  **Verify Email**: Follow the instructions to verify your email address.
4.  **Login**: Log in with your registered credentials.
5.  **Manage Attendance**: Explore the application to add and manage attendance records.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.