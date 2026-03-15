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

## Attendance & Fines (Admin)

> All attendance routes require a valid JWT token belonging to a user with `role: "admin"`.

### Mark / Update Weekly Attendance

**POST** `/api/admin/attendance`

**Access:** Private/Admin

**Request Body:**

```json
{
  "attendanceDate": "2026-03-16T10:00:00.000Z",
  "weekStartDay": 0,
  "records": [
    {
      "userId": "64abc123...",
      "status": "present",
      "note": ""
    },
    {
      "userId": "64def456...",
      "status": "absent",
      "note": "Unreachable"
    }
  ]
}
```

**Success Response — `200 OK`:**

```json
{
  "message": "Attendance marked successfully",
  "weekStart": "2026-03-15T00:00:00.000Z"
}
```

---

### Get Attendance by Date (Weekly)

**GET** `/api/admin/attendance?date=2026-03-16&weekStartDay=0`

**Access:** Private/Admin

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | Date string | Yes | Any date within the week you want to fetch |
| `weekStartDay` | Integer | No | `0` = Sunday, `1` = Monday. Default `0` |

**Success Response — `200 OK`:**

```json
{
  "weekStart": "2026-03-15T00:00:00.000Z",
  "records": [
    {
      "_id": "64xyz...",
      "user": {
        "_id": "64abc123...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "weekStartDate": "2026-03-15T00:00:00.000Z",
      "attendanceDate": "2026-03-16T10:00:00.000Z",
      "status": "present",
      "note": ""
    }
  ]
}
```

---

### Get Monthly Attendance & Fine Summary

**GET** `/api/admin/attendance/monthly?month=3&year=2026`

**Access:** Private/Admin

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `month` | Integer | Yes | Month number (1-12) |
| `year` | Integer | Yes | Full year (e.g., 2026) |

**Success Response — `200 OK`:**

```json
{
  "month": 3,
  "year": 2026,
  "summary": [
    {
      "userId": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "totalWeeks": 4,
      "present": 3,
      "absent": 1,
      "late": 0,
      "leave": 0,
      "fineOwed": 20,
      "totalPaid": 0,
      "balance": 20
    }
  ]
}
```

---

### Download Monthly Attendance CSV

**GET** `/api/admin/attendance/download?month=3&year=2026`

**Access:** Private/Admin

**Returns:** A `.csv` file attachment containing the month's summary and fine calculations for all users.

---

### Record Fine Payment

**POST** `/api/admin/attendance/fine/payment`

**Access:** Private/Admin

**Request Body:**

```json
{
  "userId": "64abc123...",
  "amount": 20,
  "month": 3,
  "year": 2026,
  "paidOn": "2026-03-20T14:30:00.000Z",
  "note": "Paid in cash"
}
```

**Success Response — `201 Created`:**

```json
{
  "message": "Fine payment recorded",
  "payment": {
    "_id": "64ghi...",
    "user": "64abc123...",
    "amount": 20,
    "month": 3,
    ...
  }
}
```

---

### Get User Fine Report

**GET** `/api/admin/attendance/fine/:userId?month=3&year=2026`

**Access:** Private/Admin

**Success Response — `200 OK`:**

```json
{
  "userId": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "month": 3,
  "year": 2026,
  "totalWeeks": 4,
  "present": 3,
  "absent": 1,
  "late": 0,
  "leave": 0,
  "fineOwed": 20,
  "totalPaid": 20,
  "balance": 0,
  "payments": [
    {
      "_id": "64ghi...",
      "amount": 20,
      "paidOn": "2026-03-20T14:30:00.000Z"
    }
  ]
}
```

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

### Attendance

| Field       | Type                           | Required                  | Notes  |
| ----------- | ------------------------------ | ------------------------- | -------- |
| `_id`       | ObjectId                       | Auto                      | —        |
| `user`      | ObjectId (ref: User)           | Yes                       | Member marked |
| `weekStartDate`| Date                        | Yes                       | Standardized to start of week |
| `attendanceDate`| Date                       | Yes                       | Actual day admin took attendance |
| `status`    | String                         | Yes                       | `"present"`, `"absent"`, `"late"`, `"leave"` |
| `markedBy`  | ObjectId (ref: User)           | No                        | Admin who marked |
| `note`      | String                         | No                        | —        |

_Includes a compound unique index on `{ user, weekStartDate }`._

### FinePayment

| Field       | Type                           | Required                  | Notes  |
| ----------- | ------------------------------ | ------------------------- | -------- |
| `_id`       | ObjectId                       | Auto                      | —        |
| `user`      | ObjectId (ref: User)           | Yes                       | Member paying |
| `amount`    | Number                         | Yes (min: 1)              | Amount in ₹ |
| `month`     | Number                         | Yes                       | 1-12 |
| `year`      | Number                         | Yes                       | — |
| `paidOn`    | Date                           | Auto                      | Date of payment |
| `recordedBy`| ObjectId (ref: User)           | No                        | Admin who recorded |
| `note`      | String                         | No                        | —        |

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
