# Task Tracker Backend

## Features
- Full CRUD operations for tasks
- MongoDB database integration
- End-of-day email notifications for incomplete tasks
- Scheduled email job (runs daily at 6 PM)

## Setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure:
   - `MONGODB_URI`: MongoDB connection string
   - `EMAIL_HOST`: SMTP server (e.g., smtp.gmail.com)
   - `EMAIL_PORT`: SMTP port (e.g., 587)
   - `EMAIL_USER`: Your email address
   - `EMAIL_PASS`: Your email password/app password
   - `EMAIL_TO`: Recipient email for notifications
3. Start server: `npm start`

## API Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Email Schedule
- Daily at 6:00 PM (18:00)
- Sends summary of incomplete tasks
