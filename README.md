# Homigo - Full-Stack Application

A professional full-stack web application built with React, Express.js, and PostgreSQL.

## 🏗️ Project Structure

```
homigo/
├── backend/                 # Express.js backend server
│   ├── config/             # Database and configuration files
│   │   └── db.js           # PostgreSQL connection setup
│   ├── controllers/        # Request handlers
│   │   └── users.js        # User controller logic
│   ├── routes/             # API route definitions
│   │   └── users.js        # User routes
│   ├── models/             # Data models
│   │   └── User.js         # User model with database queries
│   ├── middleware/         # Custom middleware
│   │   └── errorHandler.js # Error handling middleware
│   ├── utils/              # Utility functions
│   │   └── logger.js       # Logging utilities
│   ├── .env               # Environment variables
│   ├── .gitignore         # Git ignore rules
│   ├── package.json       # Backend dependencies
│   ├── server.js          # Main server file
│   └── database_setup.sql # PostgreSQL setup script
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── UserList.jsx
│   │   │   └── UserForm.jsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useApi.js   # API interaction hooks
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── assets/         # Static assets
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # React entry point
│   │   ├── App.css         # Component styles
│   │   └── index.css       # Global styles
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   ├── package.json        # Frontend dependencies
│   └── .gitignore          # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Database Setup

1. **Install PostgreSQL** and create a database:
   ```sql
   CREATE DATABASE homigo_db;
   ```

2. **Run the setup script**:
   ```bash
   psql -U your_username -d homigo_db -f backend/database_setup.sql
   ```

3. **Update environment variables** in `backend/.env`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/homigo_db
   NODE_ENV=development
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The backend server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The frontend application will start on `http://localhost:3000`

## 📋 API Endpoints

### Users API (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/users` | Get all users |
| GET    | `/api/users/:id` | Get user by ID |
| POST   | `/api/users` | Create new user |
| PUT    | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Example API Usage

**Create a new user:**
```javascript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});
```

**Get all users:**
```javascript
const response = await fetch('/api/users');
const data = await response.json();
```

## 🛠️ Available Scripts

### Backend Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Configuration

### Backend Configuration

The backend uses the following environment variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/homigo_db

# Environment
NODE_ENV=development
```

### Frontend Configuration

The frontend uses Vite with proxy configuration to connect to the backend:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Features

- **Full-Stack Architecture**: Clean separation between frontend and backend
- **PostgreSQL Integration**: Professional database with connection pooling
- **Error Handling**: Comprehensive error handling and logging
- **Responsive Design**: Mobile-friendly user interface
- **API Documentation**: Well-documented REST API endpoints
- **Environment Configuration**: Flexible environment variable setup
- **Modern Stack**: React with Hooks, Express.js, and modern JavaScript

## 🔐 Security Features

- CORS configuration
- Input validation
- SQL injection prevention with parameterized queries
- Error message sanitization
- Environment variable protection

## 📚 Code Organization

### Backend

- **MVC Pattern**: Clear separation of models, views (controllers), and routes
- **Middleware**: Reusable middleware for error handling and logging
- **Database Layer**: Abstracted database operations with connection pooling
- **Async/Await**: Modern JavaScript with proper error handling

### Frontend

- **Component-Based**: Modular React components
- **Custom Hooks**: Reusable logic with custom hooks
- **State Management**: Local state management with useState and useEffect
- **API Integration**: Clean API interaction patterns

## 🚀 Production Deployment

### Backend Deployment

1. Set production environment variables
2. Use process manager like PM2
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Frontend Deployment

1. Build production bundle: `npm run build`
2. Serve static files from `dist/` directory
3. Configure routing for SPA

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the repository.
