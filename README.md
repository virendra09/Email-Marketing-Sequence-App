# Email Marketing Sequence Application

A MERN stack application that allows users to design and implement email marketing sequences using a visual flowchart interface.

## Features

- Visual flowchart interface using React Flow
- Three types of nodes: Cold Email, Wait/Delay, and Lead Source
- Email scheduling using Agenda
- Email sending using Nodemailer
- MongoDB for data persistence
- RESTful API endpoints

## Tech Stack

- Frontend: React, React Flow
- Backend: Node.js, Express.js
- Database: MongoDB
- Job Scheduling: Agenda
- Email Service: Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd email-marketing-sequence
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/email-sequence
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
JWT_SECRET=your-jwt-secret
```

4. Start the development servers:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
email-marketing-sequence/
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   └── App.js       # Main application component
│   └── package.json
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   └── index.js     # Server entry point
│   └── package.json
└── package.json          # Root package.json
```

## API Endpoints

- POST /api/email/schedule - Schedule an email
- GET /api/sequence - Get all sequences
- POST /api/sequence - Create a new sequence
- PUT /api/sequence/:id - Update a sequence
- DELETE /api/sequence/:id - Delete a sequence

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 