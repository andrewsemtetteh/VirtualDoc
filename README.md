# VirtualDoc - Medical Appointment System

A comprehensive web application for managing medical appointments, prescriptions, and patient records between patients and doctors.

## Key Features

- ✅ Role-based dashboards (Patient, Doctor, Admin)
- ✅ Comprehensive appointment management system
- ✅ Prescription management with medication tracking
- ✅ Medical records management
- ✅ Secure messaging system
- ✅ Doctor verification workflow
- ✅ Role-based access control
- ✅ Secure authentication with NextAuth.js
- ✅ MongoDB integration with Prisma ORM
- ✅ Responsive UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14
- **UI**: React 18, Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **API**: Next.js API Routes
- **State Management**: React Context
- **Form Handling**: React Hook Form
- **Date Handling**: Day.js
- **File Upload**: Cloudinary Integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm (latest version)
- Git

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
     DATABASE_URL=your_mongodb_connection_string
     NEXTAUTH_SECRET=your_nextauth_secret
     NEXTAUTH_URL=http://localhost:3000
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
│   ├── dashboard/        # Role-based dashboards
│   │   ├── admin/       # Admin dashboard
│   │   ├── doctor/      # Doctor dashboard
│   │   └── patient/     # Patient dashboard
│   ├── auth/            # Authentication pages
│   ├── components/      # Shared components
│   └── layout/          # Layout components
├── components/          # Shared UI components
├── hooks/              # Custom React hooks
├── lib/               # Utility functions
├── middleware/        # Authentication middleware
├── models/           # Database models
├── public/           # Static assets
└── scripts/          # Build and deployment scripts
```

## Authentication & Security

The application uses NextAuth.js for secure authentication:

- Multi-factor authentication support
- Role-based access control
- Doctor verification workflow
- Secure session management
- Protected routes with middleware
- Password reset functionality

## Database Schema

### Core Models

#### User Model
- `email`: String (unique)
- `role`: String (enum: 'patient', 'doctor', 'admin')
- `status`: String (verification status)
- `createdAt`: Date
- `updatedAt`: Date

#### Appointment Model
- `patientId`: Reference to User
- `doctorId`: Reference to Doctor
- `date`: Date
- `time`: String
- `status`: String
- `notes`: String

#### Prescription Model
- `patientId`: Reference to User
- `doctorId`: Reference to Doctor
- `appointmentId`: Reference to Appointment
- `medications`: Array of medication objects
- `status`: String (enum: 'active', 'completed', 'cancelled')

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
