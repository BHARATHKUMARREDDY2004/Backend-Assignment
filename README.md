Node Js + MySQL CRUD Application

Modules Used:
- Bluebird
- mysql
- http

Features:
- Input Validation.
- Error Handiling.
- SQL Injection Prevenction with placeholders.

Table Structure:
  ```
  users:
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

Endpoints:
- GET /users
- GET /users/:id
- POST /users
- PUT /users/:id
- DELETE /users/:id 
