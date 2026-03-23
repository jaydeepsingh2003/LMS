# LMS - Learning Management System

A modern, full-stack Learning Management System built with **Next.js**, **Node.js**, **Prisma**, and **Aiven MySQL**.


## 🚀 Features

- **Course Management**: Create, edit, and manage courses with ease.
- **Subject-Specific Content**: Organized learning paths for different subjects.
- **AI Integration**: AI-powered tutoring and assistance for students.
- **Premium Video Player**: High-quality video playback for lessons.
- **User Authentication**: Secure login and registration flows.
- **Responsive Design**: optimized for both desktop and mobile devices.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS / Tailwind (as requested)
- **State Management**: Zustand / React Context
- **Icons**: Lucide React / Radix UI

### Backend
- **Runtime**: Node.js
- **Framework**: Express / Fastify (TypeScript)
- **Database**: Aiven MySQL (Cloud)

- **ORM**: Prisma
- **Auth**: JWT & Bcrypt

## 📦 Project Structure

```text
├── backend/            # Express/Prisma server
│   ├── prisma/         # Database schema & migrations
│   └── src/            # API routes, controllers, and services
├── frontend/           # Next.js web application
│   ├── src/app/        # Pages and layouts
│   └── src/components/ # Reusable UI components
└── README.md           # Project documentation
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Aiven MySQL Cloud Instance


### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jaydeepsingh2003/LMS.git
   cd LMS
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env file with Aiven URL and sync schema
   npx prisma db push
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 📄 License

This project is licensed under the MIT License.
