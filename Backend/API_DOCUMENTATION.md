# Microfinance Backend — API Documentation

Base URL: `http://localhost:5000`

---

## Authentication

Protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are returned upon successful login or registration.

---

## User Routes

### Register a New User

**POST** `/api/users/register`

**Access:** Public

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response — `201 Created`:**

```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "<jwt_token>"
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `400` | Please provide name, email, and password |
| `409` | User with this email already exists |

---

### Login User

**POST** `/api/users/login`

**Access:** Public

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response — `200 OK`:**

```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "<jwt_token>"
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `400` | Please provide email and password |
| `401` | Invalid credentials |

---

### Get All Users

**GET** `/api/users`

**Access:** Private (requires valid JWT)

**Success Response — `200 OK`:**

```json
[
  {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `401` | Not authorized, no token |
| `401` | Not authorized, invalid token |

---

### Get User by ID

**GET** `/api/users/:id`

**Access:** Private (requires valid JWT)

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the user |

**Success Response — `200 OK`:**

```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `401` | Not authorized, no token |
| `404` | User not found |

---

### Update User

**PUT** `/api/users/:id`

**Access:** Private (requires valid JWT)

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the user |

**Request Body (all fields optional):**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123",
  "role": "user"
}
```

**Success Response — `200 OK`:**

```json
{
  "_id": "64abc123...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user"
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `401` | Not authorized, no token |
| `404` | User not found |

---

### Delete User

**DELETE** `/api/users/:id`

**Access:** Private (requires valid JWT)

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the user |

**Success Response — `200 OK`:**

```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `401` | Not authorized, no token |
| `404` | User not found |

---

## Admin Routes

> All admin routes require a valid JWT token belonging to a user with `role: "admin"`.

**Headers required for all admin routes:**

```
Authorization: Bearer <admin_jwt_token>
```

---

### Get All Users (Admin)

**GET** `/api/admin/users`

**Access:** Private/Admin

**Success Response — `200 OK`:**

```json
[
  {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `401` | Not authorized, no token |
| `401` | Not authorized, invalid token |
| `403` | Forbidden: Admin access required |

---

### Get User by ID (Admin)

**GET** `/api/admin/users/:id`

**Access:** Private/Admin

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the user |

**Success Response — `200 OK`:**

```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `401` | Not authorized, no token |
| `403` | Forbidden: Admin access required |
| `404` | User not found |

---

### Update User (Admin)

**PUT** `/api/admin/users/:id`

**Access:** Private/Admin

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the user |

**Request Body (all fields optional):**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123",
  "role": "admin"
}
```

**Success Response — `200 OK`:**

```json
{
  "_id": "64abc123...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin"
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `401` | Not authorized, no token |
| `403` | Forbidden: Admin access required |
| `404` | User not found |

---

### Delete User (Admin)

**DELETE** `/api/admin/users/:id`

**Access:** Private/Admin

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the user |

**Success Response — `200 OK`:**

```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `401` | Not authorized, no token |
| `403` | Forbidden: Admin access required |
| `404` | User not found |

---

### Create Admin Account

**POST** `/api/admin/create`

**Access:** Private/Admin

**Request Body:**

```json
{
  "name": "Super Admin",
  "email": "superadmin@example.com",
  "password": "adminpassword123"
}
```

**Success Response — `201 Created`:**

```json
{
  "_id": "64xyz789...",
  "name": "Super Admin",
  "email": "superadmin@example.com",
  "role": "admin",
  "token": "<jwt_token>"
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `400` | Please provide name, email, and password |
| `401` | Not authorized, no token |
| `403` | Forbidden: Admin access required |
| `409` | User with this email already exists |

---

### Get All Admins

**GET** `/api/admin/all`

**Access:** Private/Admin

**Success Response — `200 OK`:**

```json
[
  {
    "_id": "64xyz789...",
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
| Status | Message |
|--------|---------|
| `401` | Not authorized, no token |
| `403` | Forbidden: Admin access required |

---

## Data Models

### User

| Field       | Type                           | Required                  | Default  |
| ----------- | ------------------------------ | ------------------------- | -------- |
| `_id`       | ObjectId                       | Auto                      | —        |
| `name`      | String                         | Yes                       | —        |
| `email`     | String                         | Yes (unique)              | —        |
| `password`  | String                         | Yes (min 6 chars, hidden) | —        |
| `role`      | String (`"user"` \| `"admin"`) | No                        | `"user"` |
| `createdAt` | Date                           | Auto                      | —        |
| `updatedAt` | Date                           | Auto                      | —        |

---

## Error Response Format

All error responses follow this structure:

```json
{
  "message": "Error description here"
}
```

---

## Health Check

**GET** `/`

**Access:** Public

**Success Response — `200 OK`:**

```json
{
  "message": "User Management API is running"
}
```
