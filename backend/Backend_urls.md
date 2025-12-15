# Backend API Documentation

This document outlines the API endpoints for the TutorConnect backend.

## Base URL
`/api/v1/`

---

## 1. Authentication & Users

### Register
**Endpoint**: `POST /auth/register/`
**Description**: Register a new user (student or tutor).
**Authorization**: Public
**Request Body**:
```json
{
  "email": "jane.doe@example.com",
  "password": "StrongPassword123!",
  "password_confirm": "StrongPassword123!",
  "user_type": "student", // "student" or "tutor"
  "first_name": "Jane", 
  "last_name": "Doe",
  "profile_data": {} // Optional profile-specific data (e.g., {"grade": "10"} for student)
}
```
**Success Response (201 Created)**:
```json
{
  "userId": "f0012dfc-f58b-461a-8667-6e6bcde9433d",
  "name": "Jane Doe",
  "role": "student",
  "email": "jane.doe@example.com",
  "walletBalance": "0.00",
  "createdAt": "2025-12-14T10:56:33.732375+07:00",
  "is_online": false,
  "last_activity": "2025-12-14T10:56:33.587985+07:00",
  "student_profile": {
      "uuid": "2e94c745-840e-4162-a39e-ef75c28f133a",
      "school": "",
      "grade": "",
      "learning_goals": [],
      "preferred_subjects": [],
      "location": "",
      "budget_min": null,
      "budget_max": null,
      "profile_image": null,
      "preferences": []
  },
  "tutor_profile": null,
  "achievements": []
}
```
**Error Response (400 Bad Request)**:
```json
{
    "email": ["User with this email already exists."]
}
```

### Login
**Endpoint**: `POST /auth/login/`
**Description**: Authenticates a user and returns JWT tokens.
**Authorization**: Public
**Request Body**:
```json
{
  "email": "jane.doe@example.com",
  "password": "StrongPassword123!"
}
```
**Success Response (200 OK)**:
```json
{
  "user": {
       "userId": "f0012dfc-f58b-461a-8667-6e6bcde9433d",
       "name": "Jane Doe",
       "role": "student",
       "email": "jane.doe@example.com",
       "walletBalance": "0.00",
       "createdAt": "2025-12-14T10:56:33.732375+07:00",
       "is_online": true,
       "last_activity": "2025-12-14T10:58:12.800254+07:00",
       "student_profile": { ... }, 
       "tutor_profile": null,
       "achievements": []
   },
   "tokens": {
       "access": "eyJhbGciOiJIUzI1NiIsIn...",
       "refresh": "eyJhbGciOiJIUzI1NiIsIn..."
   }
}
```

### Get Current User
**Endpoint**: `GET /auth/me/`
**Description**: Get the profile of the currently logged-in user.
**Authorization**: Bearer Token
**Success Response (200 OK)**:
```json
{
   "userId": "f0012dfc-f58b-461a-8667-6e6bcde9433d",
   "name": "Jane Doe",
   "role": "student",
   "email": "jane.doe@example.com",
   "walletBalance": "0.00",
   "createdAt": "2025-12-14T10:56:33.732375+07:00",
   "is_online": true,
   "last_activity": "2025-12-14T11:00:11.117184+07:00",
   "student_profile": { ... },
   "tutor_profile": null,
   "achievements": []
}
```

### Refresh Token
**Endpoint**: `POST /auth/refresh/`
**Description**: Refresh access token using a refresh token.
**Authorization**: Public
**Request Body**:
```json
{
   "refresh": "eyJhbGciOiJIUzI1NiIsIn..."
}
```
**Success Response (200 OK)**:
```json
{
   "access": "eyJhbGciOiJIUzI1NiIsIn...",
   "refresh": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### Logout
**Endpoint**: `POST /auth/logout/`
**Description**: Blacklist the refresh token.
**Authorization**: Bearer Token
**Request Body**:
```json
{
   "refresh": "eyJhbGciOiJIUzI1NiIsIn..."
}
```
**Success Response (205 Reset Content)**: `null`

---

## 2. Profiles

### Update Profile
**Endpoint**: `PATCH /users/profile/`
**Description**: Update user and profile details. Fields depend on user type.
**Authorization**: Bearer Token
**Request Body (Student Example)**:
```json
{
    "first_name": "Jane", 
    "phone": "0912345678",
    "student_profile": { // or tutor_profile
        "school": "High School A",
        "grade": "10",
        "location": "hanoi",
        "learning_goals": ["Math", "Physics"]
    }
}
```
**Success Response (200 OK)**: Returns updated User object (same structure as `/auth/me/`).

### Upload Profile Image
**Endpoint**: `POST /upload/profile-image/`
**Description**: Upload a new profile avatar.
**Authorization**: Bearer Token
**Request Body**: `multipart/form-data`
- `image`: [File] (Max 5MB, JPG/PNG)
**Success Response (200 OK)**:
```json
{
    "image_url": "http://localhost:8000/media/profiles/uuid/avatar.jpg"
    
}

---
Finished Checking Here!
---
### Tutors Service

#### Search Tutors (Public)
`GET /api/v1/tutors/`

**Query Parameters:**
- `subjectId`: (Integer) Filter by Subject ID (e.g. `?subjectId=1`)
- `tags`: (String) Filter by tags, comma-separated (e.g. `?tags=HSGTP,Beginner`)
- `maxPrice`: (Decimal) Filter by maximum price (e.g. `?maxPrice=150000`)

**Response:**
```json
{
  "count": 10,
  "next": "http://api/v1/tutors/?page=2",
  "previous": null,
  "results": [
    {
      "uuid": "b1c2d3e4-...",
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Smith"
      },
      "education": "PhD Math",
      "rating_average": 4.8,
      "subjects": [
        {
          "subjectId": 1,
          "subjectName": "Mathematics",
          "tags": [
             {"tag": "HSGTP", "price": 150.00}
          ]
        }
      ]
    }
  ]
}
```

#### Get Tutor Profile (Public)
`GET /api/v1/tutors/:id/`

**URL Parameters:**
- `id`: Tutor's UUID

**Response:**
```json
{
  "uuid": "...",
  "bio": "Experienced math tutor...",
  "achievements": ["Math Olympiad Winner"],
  "subjects": [...],
  "recent_reviews": [...]
}
```

### Profile Service

#### Update Tutor Profile (Tutor Only)
`PUT /api/v1/tutor-profile/`

**Request Body:**
```json
{
  "bio": "New bio...",
  "achievements": ["New achievement"],
  "subjects": [
    {
      "subjectId": 1,
      "tags": [
        {"tag": "HSGTP", "price": 150.00},
        {"tag": "Advanced", "price": 120.00}
      ]
    }
  ]
}
```

**Response:**
- Returns the updated profile object.
---


## 4. Subjects & Platform

### List Subjects
**Endpoint**: `GET /subjects/`
**Description**: Get a list of all available subjects.
**Authorization**: Bearer Token
**Success Response (200 OK)**:
```json
[
    { "id": "uuid-1", "name": "Mathematics" },
    { "id": "uuid-2", "name": "Physics" }
]
```

### Platform Stats
**Endpoint**: `GET /platform/stats/`
**Description**: Get platform-wide statistics.
**Authorization**: Bearer Token
**Success Response (200 OK)**:
```json
{
    "total_tutors": 50,
    "total_students": 200,
    "total_subjects": 15,
    "total_reviews": 120,
    "average_rating": 4.5,
    "active_chat_rooms": 10
}
```

---

## 5. Reviews

### Get Tutor Reviews
**Endpoint**: `GET /tutors/<tutor_uuid>/reviews/`
**Description**: Get all reviews for a specific tutor.
**Authorization**: Bearer Token
**Success Response (200 OK)**:
```json
[
    {
        "id": "review-uuid",
        "student": {
            "id": "user-id",
            "name": "Student Name",
            "school": "School Name"
        },
        "rating": 5,
        "comment": "Excellent!",
        "created_at": "2025-..."
    }
]
```

### Create Review
**Endpoint**: `POST /tutors/<tutor_uuid>/reviews/create/`
**Description**: Submit a review for a tutor.
**Authorization**: Bearer Token (Student only)
**Request Body**:
```json
{
    "rating": 5,
    "comment": "Very helpful session."
}
```
**Success Response (201 Created)**: Returns the created Review object.

---

## 6. Interactions

### Like/Save Tutor
**Endpoints**:
- `POST /tutors/<uuid>/like/`
- `DELETE /tutors/<uuid>/unlike/`
- `POST /tutors/<uuid>/save/`
- `DELETE /tutors/<uuid>/unsave/`
**Description**: Like or save a tutor profile.
**Authorization**: Bearer Token (Student only)
**Success Response (200 OK)**:
```json
{ "message": "Tutor liked successfully" }
```

### Get Liked/Saved Tutors
**Endpoints**:
- `GET /users/liked-tutors/`
- `GET /users/saved-tutors/`
**Description**: Get list of tutors interactions.
**Authorization**: Bearer Token (Student only)
**Success Response (200 OK)**: List of `TutorListSerializer` objects.

---

## 7. Chats

### List Chat Rooms
**Endpoint**: `GET /chats/`
**Description**: Get all chat rooms for the current user.
**Authorization**: Bearer Token
**Success Response (200 OK)**:
```json
[
    {
        "id": "room-uuid",
        "other_user": {
            "id": "other-user-id",
            "name": "Other User",
            "user_type": "tutor",
            "profile_image": "/media/..."
        },
        "last_message": {
            "content": "Hello",
            "created_at": "2025-...",
            "sender_id": "sender-id"
        },
        "unread_count": 0
    }
]
```

### Create Chat Room
**Endpoint**: `POST /chats/create/`
**Description**: Start a chat with a tutor.
**Authorization**: Bearer Token (Student only)
**Request Body**:
```json
{
    "tutor_id": "tutor-uuid"
}
```
**Success Response (201/200 OK)**: Returns the ChatRoom object.

### Get Messages
**Endpoint**: `GET /chats/<room_id>/messages/`
**Description**: Get message history for a room.
**Authorization**: Bearer Token
**Success Response (200 OK)**:
```json
[
    {
        "id": "msg-uuid",
        "content": "Hi there!",
        "message_type": "text",
        "is_read": true,
        "created_at": "2025-...",
        "sender": {
            "id": "user-uuid",
            "name": "Sender Name",
            "user_type": "student"
        }
    }
]
```

### Send Message
**Endpoint**: `POST /chats/<room_id>/send/`
**Description**: Send a message in a room.
**Authorization**: Bearer Token
**Request Body**:
```json
{
    "content": "When are you available?"
}
```
**Success Response (201 Created)**: Returns the Message object.
