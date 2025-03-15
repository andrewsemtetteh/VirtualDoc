# VirtualDoc - Medical Appointment System

A modern web application for managing medical appointments between patients and doctors.

## Features

- User authentication with email and phone number
- Role-based access control (Patient, Doctor, Admin)
- Secure password handling with bcrypt
- JWT-based authentication
- MongoDB database integration
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/virtualdoc.git
   cd virtualdoc
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
virtualdoc/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── ...               # Other pages
├── Backend/              # Backend code
│   ├── config/           # Configuration files
│   ├── controllers/      # API controllers
│   ├── middleware/       # Middleware functions
│   ├── models/           # Database models
│   └── routes/           # API route handlers
├── public/               # Static files
│   └── uploads/          # User uploaded files
└── ...                   # Config files
```

## Authentication

The application supports authentication using both email and phone number:

- Users can register with both email and phone number
- Users can log in using either their email or phone number
- JWT tokens are used for maintaining sessions

## Database Schema

### User Model

- `fullName`: String (required)
- `email`: String (required, unique)
- `phoneNumber`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: 'patient', 'doctor', 'admin')
- `specialization`: String (required for doctors)
- `licenseNumber`: String (required for doctors)
- `yearsOfExperience`: Number (required for doctors)
- `dateOfBirth`: Date
- `gender`: String (enum: 'male', 'female', 'other')
- `address`: String
- `profileImage`: String (path to uploaded image)
- `isVerified`: Boolean
- `createdAt`: Date

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
