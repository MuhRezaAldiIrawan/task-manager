
db.tasks.createIndex(
    { "status": 1 },
    {
        name: "idx_status",
        background: true
    }
);

db.tasks.createIndex(
    { "priority": 1 },
    {
        name: "idx_priority",
        background: true
    }
);


db.tasks.createIndex(
    { "createdAt": -1 },
    {
        name: "idx_created_desc",
        background: true
    }
);

db.tasks.createIndex(
    { "updatedAt": -1 },
    {
        name: "idx_updated_desc",
        background: true
    }
);

db.tasks.createIndex(
    { "dueDate": 1 },
    {
        name: "idx_due_date",
        background: true,
        sparse: true
    }
);

db.tasks.createIndex(
    { "status": 1, "priority": 1 },
    {
        name: "idx_status_priority",
        background: true
    }
);

db.tasks.createIndex(
    { "status": 1, "dueDate": 1 },
    {
        name: "idx_status_duedate",
        background: true
    }
);

db.tasks.createIndex(
    { "title": "text", "description": "text" },
    {
        name: "idx_text_search",
        background: true,
        weights: {
            "title": 10,
            "description": 5
        }
    }
);

db.tasks.createIndex(
    { "userId": 1, "status": 1, "createdAt": -1 },
    {
        name: "idx_user_status_created",
        background: true
    }
);

db.users.createIndex(
    { "username": 1 },
    {
        name: "idx_username",
        unique: true,
        background: true
    }
);


db.users.createIndex(
    { "email": 1 },
    {
        name: "idx_email",
        unique: true,
        sparse: true,
        background: true
    }
);


db.tasks.createIndex(
    { "updatedAt": 1 },
    {
        name: "idx_ttl_completed",
        expireAfterSeconds: 7776000, // 90 days
        partialFilterExpression: { "status": "completed" },
        background: true
    }
);
