# AfterInk Agency Dashboard

A comprehensive role-based project management dashboard for agencies with CEO, Founding Member, and Freelancer roles.

## 🚀 Features

- **Role-based Access Control**: CEO, Founding Member, and Freelancer roles
- **Task Management**: Create, assign, and track tasks
- **Time Tracking**: Start, pause, and complete time logs
- **Performance Analytics**: Track productivity and efficiency
- **User Management**: Add and manage team members
- **Real-time Dashboard**: Live updates and statistics
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React.js** with React Router
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Framer Motion** for animations
- **Recharts** for data visualization

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or cloud)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Afterink-agency-dashboard-main
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```

### 4. Environment Configuration

Create a `.env` file in the `Backend` directory:
```env
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/afterink-dashboard?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
PORT=5000
NODE_ENV=development
```

### 5. Database Setup
```bash
cd Backend
node setup-database.js
```

This will create test users and sample data.

## 🚀 Running the Application

### Development Mode

1. **Start Backend Server**
```bash
cd Backend
npm start
```
The backend will run on `http://localhost:5000`

2. **Start Frontend Development Server**
```bash
cd Frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build Frontend**
```bash
cd Frontend
npm run build
```

2. **Start Production Server**
```bash
cd Backend
NODE_ENV=production npm start
```

## 👥 Test Users

After running the database setup, you can login with these test accounts:

| Role | Email | Password |
|------|-------|----------|
| CEO | ceo@afterink.com | TestPass123! |
| Founding Member | founding@afterink.com | TestPass123! |
| Freelancer | freelancer@afterink.com | TestPass123! |

## 📁 Project Structure

```
Afterink-agency-dashboard-main/
├── Backend/
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Authentication & authorization
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── server.js            # Main server file
│   └── setup-database.js    # Database initialization
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   │   ├── CEO/         # CEO-specific pages
│   │   │   └── Founding/    # Founding member pages
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - Register new user (CEO/Founding only)

### Users
- `GET /api/users` - Get all users (CEO only)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/add` - Add new user (CEO only)

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Time Tracking
- `POST /api/time/start` - Start time tracking
- `POST /api/time/hold` - Pause time tracking
- `POST /api/time/complete` - Complete time tracking
- `GET /api/time/summary` - Get time summary

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/leaderboard` - Get performance leaderboard

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your `MONGO_URI` in the `.env` file
   - Ensure your MongoDB instance is running
   - Verify network connectivity

2. **CORS Errors**
   - Check the CORS configuration in `Backend/server.js`
   - Ensure frontend URL is included in allowed origins

3. **JWT Token Issues**
   - Verify `JWT_SECRET` is set in environment variables
   - Check token expiration settings

4. **Port Already in Use**
   - Change the port in `.env` file
   - Kill existing processes using the port

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## 🔧 Development

### Adding New Features

1. Create new routes in `Backend/routes/`
2. Add controllers in `Backend/controllers/`
3. Create React components in `Frontend/src/components/`
4. Add pages in `Frontend/src/pages/`

### Code Style

- Use consistent naming conventions
- Add proper error handling
- Include input validation
- Write meaningful commit messages

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository. 