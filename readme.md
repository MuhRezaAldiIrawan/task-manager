# MileApp Fullstack Developer Test - Task Management System

A full-stack task management application built with Vue.js and Express.js, featuring authentication, CRUD operations, advanced filtering, sorting, and pagination.

## 🚀 Live Demo

- **Frontend**: https://task-manager-pearl-theta.vercel.app
- **Backend API**: https://task-manager-production-57e6.up.railway.app

## 📋 Features

### Authentication
- Token-based authentication using JWT
- Protected routes with route guards
- Automatic token validation and expiration handling
- Persistent login sessions

### Task Management (CRUD)
- **Create**: Add new tasks with title, description, status, priority, and due date
- **Read**: View all tasks with rich metadata display
- **Update**: Edit existing tasks with real-time updates
- **Delete**: Remove tasks with confirmation modal

### Advanced Functionality
- **Search**: Real-time search across task titles and descriptions with debouncing
- **Filter**: Filter by status (pending, in-progress, completed) and priority (low, medium, high)
- **Sort**: Sort by creation date, update date, due date, or priority (ascending/descending)
- **Pagination**: Navigate through tasks with configurable page size and metadata

### UI/UX
- Clean, modern, and responsive design
- Color-coded priority indicators
- Status badges for quick identification
- Smooth animations and transitions
- Mobile-first responsive layout
- Empty states and loading indicators
- Error handling with user-friendly messages

## 🛠️ Technology Stack

### Frontend
- **Vue.js 3**: Progressive JavaScript framework with Composition API
- **Vue Router**: Client-side routing with navigation guards
- **Vite**: Next-generation frontend build tool
- **Native CSS**: Custom styles without external UI frameworks

### Backend
- **Express.js**: Fast, minimalist web framework
- **JSON Web Token (JWT)**: Secure token-based authentication
- **CORS**: Cross-origin resource sharing support
- **RESTful API**: Standard HTTP methods and status codes

## 📁 Project Structure

```
mileapp-fullstack-test/
├── backend/
│   ├── server.js              # Express server with mock API
│   ├── package.json           # Backend dependencies
│   └── db/
│       └── indexes.js         # MongoDB index definitions
│
├── frontend/
│   ├── src/
│   │   ├── main.js            # Application entry point
│   │   ├── App.vue            # Root component
│   │   ├── components/
│   │   │   ├── LoginPage.vue  # Login authentication page
│   │   │   └── TasksPage.vue  # Task management dashboard
│   │   └── services/
│   │       └── api.js         # API service layer
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration
│   ├── package.json           # Frontend dependencies
│   └── .env.example           # Environment variables template
│
└── README.md                  # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

The API will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Update .env with your backend URL**
```
VITE_API_URL=http://localhost:3000
```

5. **Start development server**
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 🔐 Default Credentials

Use these credentials to test the application:

- **Admin User**
  - Username: `admin`
  - Password: `admin123`

- **Regular User**
  - Username: `user`
  - Password: `user123`

## 📡 API Documentation

### Authentication

#### POST /login
Login with username and password
```json
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "username": "admin",
      "name": "Admin User"
    }
  }
}
```

### Tasks

All task endpoints require authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

#### GET /tasks
Retrieve tasks with optional filters, sorting, and pagination

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (pending|in-progress|completed)
- `priority` (string): Filter by priority (low|medium|high)
- `search` (string): Search in title and description
- `sortBy` (string): Sort field (createdAt|updatedAt|dueDate|priority)
- `sortOrder` (string): Sort direction (asc|desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2025-10-05",
      "createdAt": "2025-09-25T10:00:00Z",
      "updatedAt": "2025-09-25T10:00:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

#### GET /tasks/:id
Get a single task by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2025-10-05",
    "createdAt": "2025-09-25T10:00:00Z",
    "updatedAt": "2025-09-25T10:00:00Z"
  }
}
```

#### POST /tasks
Create a new task

**Request:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2025-10-10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "1696234567890",
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2025-10-10",
    "createdAt": "2025-10-01T12:00:00Z",
    "updatedAt": "2025-10-01T12:00:00Z"
  }
}
```

#### PUT /tasks/:id
Update an existing task

**Request:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "completed",
  "priority": "high",
  "dueDate": "2025-10-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "1",
    "title": "Updated Task",
    "description": "Updated description",
    "status": "completed",
    "priority": "high",
    "dueDate": "2025-10-15",
    "createdAt": "2025-09-25T10:00:00Z",
    "updatedAt": "2025-10-01T12:30:00Z"
  }
}
```

#### DELETE /tasks/:id
Delete a task

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": "1",
    "title": "Deleted Task"
  }
}
```

## 🗄️ MongoDB Database Design

### Collections

#### tasks Collection
```javascript
{
  _id: ObjectId,
  id: String,              // Unique task identifier
  title: String,           // Task title (required)
  description: String,     // Detailed description
  status: String,          // pending | in-progress | completed
  priority: String,        // low | medium | high
  dueDate: Date,          // Optional deadline
  userId: ObjectId,       // Reference to user (for multi-tenant)
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last modification timestamp
}
```

#### users Collection
```javascript
{
  _id: ObjectId,
  username: String,       // Unique username
  email: String,         // Unique email (optional)
  password: String,      // Hashed password
  name: String,          // Full name
  createdAt: Date
}
```

### Database Indexes

The application includes a comprehensive indexing strategy defined in `db/indexes.js`:

#### 1. **Single-Field Indexes**

```javascript
// Status filtering (most common query)
db.tasks.createIndex({ "status": 1 })

// Priority filtering
db.tasks.createIndex({ "priority": 1 })

// Sort by creation date (default sort)
db.tasks.createIndex({ "createdAt": -1 })

// Sort by update date
db.tasks.createIndex({ "updatedAt": -1 })

// Sort by due date (sparse for optional field)
db.tasks.createIndex({ "dueDate": 1 }, { sparse: true })
```

**Rationale**: These indexes support the most common single-field queries and sorts in the application. Users frequently filter by status and priority, and sort by dates.

#### 2. **Compound Indexes**

```javascript
// Combined status and priority filtering
db.tasks.createIndex({ "status": 1, "priority": 1 })

// Status filtering with due date sorting
db.tasks.createIndex({ "status": 1, "dueDate": 1 })

// User-specific queries with status and sort
db.tasks.createIndex({ "userId": 1, "status": 1, "createdAt": -1 })
```

**Rationale**: Compound indexes optimize queries that filter by multiple fields. They follow the ESR (Equality, Sort, Range) rule for maximum efficiency. For example, "Show me all in-progress high-priority tasks" benefits from the status+priority index.

#### 3. **Text Search Index**

```javascript
// Full-text search across title and description
db.tasks.createIndex(
  { "title": "text", "description": "text" },
  { weights: { "title": 10, "description": 5 } }
)
```

**Rationale**: Enables fast full-text search functionality. Title has higher weight (10) than description (5) because title matches are more relevant. Supports the search feature in the UI.

#### 4. **Unique Indexes**

```javascript
// Unique username for authentication
db.users.createIndex({ "username": 1 }, { unique: true })

// Unique email
db.users.createIndex({ "email": 1 }, { unique: true, sparse: true })
```

**Rationale**: Ensures data integrity by preventing duplicate usernames and emails. Crucial for authentication and user management.

#### 5. **TTL Index (Optional)**

```javascript
// Auto-delete completed tasks after 90 days
db.tasks.createIndex(
  { "updatedAt": 1 },
  {
    expireAfterSeconds: 7776000,
    partialFilterExpression: { "status": "completed" }
  }
)
```

**Rationale**: Automatic data lifecycle management. Removes old completed tasks to reduce storage costs and improve query performance. Only applies to completed tasks (partial filter).

### Index Selection Strategy

The indexes were chosen based on:

1. **Query Patterns**: Analysis of GET /tasks endpoint parameters (filter, sort, search)
2. **Performance Impact**: Balance between read performance and write overhead
3. **Cardinality**: Fields with good distribution (status has 3 values, priority has 3 values)
4. **Access Frequency**: Most-queried fields get priority
5. **Compound vs Single**: Compound indexes for multi-field queries, single for flexibility

### Performance Considerations

- **Background Creation**: All indexes use `{ background: true }` to avoid blocking operations
- **Sparse Indexes**: Used for optional fields (dueDate, email) to reduce index size
- **Index Size**: Monitored to ensure total index size doesn't exceed RAM
- **Write Performance**: Each index adds write overhead; only essential indexes are created
- **Index Selectivity**: High-cardinality fields (createdAt, updatedAt) provide better selectivity

### Monitoring & Maintenance

```javascript
// Check index usage
db.tasks.aggregate([{ $indexStats: {} }])

// Analyze query performance
db.tasks.find({ status: "pending" }).explain("executionStats")

// Remove unused indexes
db.tasks.dropIndex("index_name")
```

## 🎨 Design Decisions

### Architecture

**Separation of Concerns**: Clear separation between frontend (Vue.js) and backend (Express.js) allows independent development and deployment.

**RESTful API Design**: Standard HTTP methods (GET, POST, PUT, DELETE) and status codes make the API intuitive and easy to integrate.

**Token-Based Authentication**: JWT tokens provide stateless authentication, enabling horizontal scaling and mobile app integration.

### Frontend Choices

**Vue 3 Composition API**: Modern, TypeScript-friendly API with better code organization and reusability.

**Vue Router**: Client-side routing with navigation guards provides seamless SPA experience with protected routes.

**No UI Framework**: Custom CSS allows complete design control, smaller bundle size, and better performance. Demonstrates pure CSS skills.

**Debounced Search**: Reduces API calls during typing, improving performance and user experience.

**Optimistic UI Updates**: Immediate feedback on actions (delete, create) before API response improves perceived performance.

### Backend Choices

**Mock Data in Memory**: Simplifies testing and deployment without database setup. Easy to replace with real database later.

**Comprehensive Error Handling**: All endpoints include proper error responses with meaningful messages and correct HTTP status codes.

**Flexible Query Parameters**: Support for multiple filters, sorts, and pagination parameters makes the API powerful and versatile.

**CORS Enabled**: Allows frontend to communicate with backend from different origins during development and deployment.

### Code Quality

**Consistent Naming**: camelCase for JavaScript, kebab-case for CSS, descriptive variable names.

**Modular Structure**: Separate files for components, services, and configuration improves maintainability.

**Comments & Documentation**: Inline comments explain complex logic; README provides comprehensive guide.

**Error Boundaries**: Frontend handles API errors gracefully with user-friendly messages.

## 💪 Strengths of This Module

### 1. **Production-Ready Code Quality**
- Clean, readable, and maintainable code
- Proper error handling at all levels
- Comprehensive validation
- Security best practices (JWT, input sanitization)

### 2. **Advanced Features**
- Real-time search with debouncing
- Multi-criteria filtering
- Flexible sorting options
- Pagination with metadata
- Responsive design for all devices

### 3. **Excellent User Experience**
- Smooth animations and transitions
- Loading states and empty states
- Confirmation modals for destructive actions
- Color-coded priority system
- Intuitive navigation

### 4. **Scalable Architecture**
- Modular component structure
- Service layer abstraction
- Easy to add new features
- Ready for real database integration
- Prepared for multi-tenant scenarios

### 5. **Developer-Friendly**
- Clear project structure
- Comprehensive documentation
- Easy setup process
- Environment configuration
- Well-commented code

### 6. **Performance Optimized**
- Debounced search reduces API calls
- Efficient pagination
- Minimal bundle size
- Optimized MongoDB indexes
- Background index creation

### 7. **Deployment Ready**
- Environment variables for configuration
- Static build for CDN deployment
- CORS configured
- Health check endpoint
- Production-optimized builds

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Create a new project on Railway or Render
2. Connect your GitHub repository
3. Set environment variables:
   - `PORT`: 3000 (or auto-assigned)
   - `NODE_ENV`: production
4. Deploy command: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Create a new project on Vercel or Netlify
2. Connect your GitHub repository
3. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Set environment variables:
   - `VITE_API_URL`: Your deployed backend URL
5. Deploy

## 🧪 Testing the Application

### Manual Testing Checklist

**Authentication**
- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Auto-redirect when accessing protected routes without token
- ✅ Logout functionality

**Task CRUD**
- ✅ Create task with all fields
- ✅ Create task with minimum required fields
- ✅ Read/view all tasks
- ✅ Update existing task
- ✅ Delete task with confirmation

**Filtering & Sorting**
- ✅ Filter by status (pending, in-progress, completed)
- ✅ Filter by priority (low, medium, high)
- ✅ Search by title and description
- ✅ Sort by different fields (created, updated, due date)
- ✅ Sort ascending and descending
- ✅ Combine multiple filters

**Pagination**
- ✅ Navigate to next page
- ✅ Navigate to previous page
- ✅ Correct page count display
- ✅ Disable buttons at boundaries

**UI/UX**
- ✅ Responsive on mobile devices
- ✅ Loading states display correctly
- ✅ Error messages are clear
- ✅ Empty states when no data
- ✅ Smooth animations

## 📝 Future Enhancements

- Real MongoDB database integration
- User registration functionality
- Task assignment to multiple users
- Task comments and attachments
- Email notifications for due dates
- Dark mode toggle
- Task categories/tags
- Export tasks to CSV/PDF
- Advanced analytics dashboard
- Real-time updates with WebSocket

## 👨‍💻 Author

**Muh Reza Aldi Irawan**
- Email: rezaaldiirawan007@gmail.com

## 📄 License

This project is created for the MileApp Fullstack Developer Test.

---

**Note**: This is a demonstration project for technical assessment purposes. The mock API uses in-memory storage and will reset on server restart.