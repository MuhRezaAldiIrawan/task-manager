// server.js - Mock API Backend
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "mileapp-secret-key-2025";

app.use(cors());
app.use(express.json());

// Mock database
let tasks = [
    {
        id: "1",
        title: "Complete project documentation",
        description: "Write comprehensive documentation for the MileApp project",
        status: "in-progress",
        priority: "high",
        dueDate: "2025-10-05",
        createdAt: "2025-09-25T10:00:00Z",
        updatedAt: "2025-09-25T10:00:00Z",
    },
    {
        id: "2",
        title: "Review code changes",
        description: "Review and approve pull requests from team members",
        status: "pending",
        priority: "medium",
        dueDate: "2025-10-02",
        createdAt: "2025-09-26T11:30:00Z",
        updatedAt: "2025-09-26T11:30:00Z",
    },
    {
        id: "3",
        title: "Fix bug in authentication",
        description: "Resolve token expiration issue in login system",
        status: "completed",
        priority: "high",
        dueDate: "2025-09-30",
        createdAt: "2025-09-24T09:15:00Z",
        updatedAt: "2025-09-29T16:45:00Z",
    },
    {
        id: "4",
        title: "Update dependencies",
        description: "Update npm packages to latest stable versions",
        status: "pending",
        priority: "low",
        dueDate: "2025-10-10",
        createdAt: "2025-09-27T14:20:00Z",
        updatedAt: "2025-09-27T14:20:00Z",
    },
    {
        id: "5",
        title: "Design new UI mockups",
        description: "Create wireframes for the dashboard redesign",
        status: "in-progress",
        priority: "medium",
        dueDate: "2025-10-08",
        createdAt: "2025-09-28T08:00:00Z",
        updatedAt: "2025-09-28T08:00:00Z",
    },
];

// Mock users
const users = [
    { username: "admin", password: "admin123", name: "Admin User" },
    { username: "user", password: "user123", name: "Regular User" },
];

// Middleware untuk verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token is required",
        });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
        req.user = user;
        next();
    });
};

// POST /login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required",
        });
    }

    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password",
        });
    }

    const token = jwt.sign({ username: user.username, name: user.name }, SECRET_KEY, { expiresIn: "24h" });

    res.json({
        success: true,
        message: "Login successful",
        data: {
            token,
            user: {
                username: user.username,
                name: user.name,
            },
        },
    });
});

// GET /tasks - with filter, sort, pagination
app.get("/tasks", authenticateToken, (req, res) => {
    let filteredTasks = [...tasks];

    // Filter by status
    if (req.query.status) {
        filteredTasks = filteredTasks.filter((task) => task.status === req.query.status);
    }

    // Filter by priority
    if (req.query.priority) {
        filteredTasks = filteredTasks.filter((task) => task.priority === req.query.priority);
    }

    // Search by title or description
    if (req.query.search) {
        const searchLower = req.query.search.toLowerCase();
        filteredTasks = filteredTasks.filter((task) => task.title.toLowerCase().includes(searchLower) || task.description.toLowerCase().includes(searchLower));
    }

    // Sort
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";

    filteredTasks.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortBy === "createdAt" || sortBy === "updatedAt" || sortBy === "dueDate") {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        }

        if (sortOrder === "asc") {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    res.json({
        success: true,
        data: paginatedTasks,
        meta: {
            total: filteredTasks.length,
            page,
            limit,
            totalPages: Math.ceil(filteredTasks.length / limit),
            hasNextPage: endIndex < filteredTasks.length,
            hasPrevPage: page > 1,
        },
    });
});

// GET /tasks/:id
app.get("/tasks/:id", authenticateToken, (req, res) => {
    const task = tasks.find((t) => t.id === req.params.id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    res.json({
        success: true,
        data: task,
    });
});

// POST /tasks
app.post("/tasks", authenticateToken, (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Title is required",
        });
    }

    const newTask = {
        id: String(Date.now()),
        title,
        description: description || "",
        status: status || "pending",
        priority: priority || "medium",
        dueDate: dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask,
    });
});

// PUT /tasks/:id
app.put("/tasks/:id", authenticateToken, (req, res) => {
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    const { title, description, status, priority, dueDate } = req.body;

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title || tasks[taskIndex].title,
        description: description !== undefined ? description : tasks[taskIndex].description,
        status: status || tasks[taskIndex].status,
        priority: priority || tasks[taskIndex].priority,
        dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
        updatedAt: new Date().toISOString(),
    };

    res.json({
        success: true,
        message: "Task updated successfully",
        data: tasks[taskIndex],
    });
});

// DELETE /tasks/:id
app.delete("/tasks/:id", authenticateToken, (req, res) => {
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.json({
        success: true,
        message: "Task deleted successfully",
        data: deletedTask,
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "API is running",
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

app.listen(PORT, () => {
    console.log(`Mock API server running on port ${PORT}`);
});

module.exports = app;
