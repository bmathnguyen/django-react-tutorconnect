# TutorConnect API Documentation

Welcome to the TutorConnect API documentation. This document provides a detailed overview of all available API endpoints, including request/response formats and usage examples for the React Native frontend.

**Base URL**: `/api/v1/`

**Authentication**: Most endpoints require a JSON Web Token (JWT) for authentication. The token should be included in the `Authorization` header as a Bearer token:
`Authorization: Bearer <your_jwt_token>`

## 1. Authentication

Endpoints for user registration, login, and token management.

### 1.1 Register a New User

- **Endpoint**: `/auth/register/`
- **Method**: `POST`
- **Permission**: `AllowAny`
- **Description**: Creates a new user account (either 'student' or 'tutor') and returns user data along with access and refresh tokens.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "yoursecurepassword",
  "user_type": "student" // or "tutor"
}
```

**Response (201 Created)**:
```json
{
  "user": {
    "id": "uuid-string-goes-here",
    "email": "user@example.com",
    "user_type": "student",
    "is_online": false
  },
  "tokens": {
    "access": "access-token-string",
    "refresh": "refresh-token-string"
  }
}
```

**React Native Example**:
```javascript
const registerUser = async (email, password, userType) => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, user_type: userType }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Registration successful:', data);
      // Store tokens securely
    } else {
      console.error('Registration failed:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### 1.2 Log In

- **Endpoint**: `/auth/login/`
- **Method**: `POST`
- **Permission**: `AllowAny`
- **Description**: Authenticates a user and returns their data along with new access and refresh tokens.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "yoursecurepassword"
}
```

**Response (200 OK)**:
```json
{
  "user": {
    "id": "uuid-string-goes-here",
    "email": "user@example.com",
    "user_type": "student",
    "is_online": true
  },
  "tokens": {
    "access": "access-token-string",
    "refresh": "refresh-token-string"
  }
}
```

### 1.3 Log Out

- **Endpoint**: `/auth/logout/`
- **Method**: `POST`
- **Permission**: `IsAuthenticated`
- **Description**: Blacklists the user's refresh token to invalidate their session.

**Request Body**:
```json
{
  "refresh": "refresh-token-string"
}
```

**Response (200 OK)**:
```json
{
  "message": "Successfully logged out"
}
```

### 1.4 Get Current User

- **Endpoint**: `/auth/me/`
- **Method**: `GET`
- **Permission**: `IsAuthenticated`
- **Description**: Retrieves the profile data for the currently authenticated user.

**Response (200 OK)**:
```json
{
  "id": "uuid-string-goes-here",
  "email": "user@example.com",
  "user_type": "student",
  "is_online": true
}
```

### 1.5 Refresh Access Token

- **Endpoint**: `/auth/refresh/`
- **Method**: `POST`
- **Permission**: `AllowAny`
- **Description**: Takes a valid refresh token and returns a new access token.

**Request Body**:
```json
{
  "refresh": "refresh-token-string"
}
```

**Response (200 OK)**:
```json
{
  "access": "new-access-token-string"
}
```

## 2. Tutors

Endpoints for searching and retrieving tutor profiles.

### 2.1 Search Tutors

- **Endpoint**: `/search/tutors/`
- **Method**: `GET`
- **Permission**: `IsAuthenticated`
- **Description**: Provides a paginated list of tutors with advanced filtering options. Tutors are ordered by their average rating in descending order.

**Query Parameters**:
- `location_type` (string): Type of tutoring. Can be `online` or `offline`. If `offline`, the `city` parameter is required.
- `city` (string): The city to filter by when `location_type` is `offline` (e.g., `hanoi`).
- `subjects` (string): Comma-separated list of subject IDs to filter by.
- `class_levels` (string): Comma-separated list of class level IDs.
- `price_min` (number): Minimum hourly rate.
- `price_max` (number): Maximum hourly rate.
- `rating_average_min` (number): Minimum average rating (1-5).

**Response (200 OK)**:
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "tutor-uuid-string",
      "user": {
        "first_name": "Jane",
        "last_name": "Doe"
      },
      "education": "PhD in Physics",
      "bio_summary": "Experienced physics tutor...",
      "rating_average": "4.95",
      "price_min": "250000.00",
      "price_max": "500000.00",
      "profile_image": "/media/profiles/tutor-uuid/avatar.jpg"
    }
  ]
}
```

**React Native Example**:
```javascript
const searchTutors = async (filters) => {
  const query = new URLSearchParams(filters).toString();
  try {
    const response = await fetch(`http://localhost:8000/api/v1/search/tutors/?${query}`, {
      headers: {
        'Authorization': `Bearer <your_jwt_token>`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Tutors found:', data.results);
    } else {
      console.error('Search failed:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage:
searchTutors({ subjects: '1,5', price_max: 300000 });
```

### 2.2 Get Tutor Details

- **Endpoint**: `/tutors/<uuid:id>/`
- **Method**: `GET`
- **Permission**: `IsAuthenticated`
- **Description**: Retrieves a comprehensive profile for a single tutor. If the request is made by a student, it logs a `TutorView` for analytics.

**Response (200 OK)**:
```json
{
  "id": "tutor-uuid-string",
  "user": {
    "first_name": "Jane",
    "last_name": "Doe",
    "is_online": true
  },
  "education": "PhD in Physics",
  "bio": "Full biography of the tutor...",
  "location": "hanoi",
  "is_verified": true,
  "rating_average": "4.95",
  "total_reviews": 25,
  "profile_image": "/media/profiles/tutor-uuid/avatar.jpg",
  "availability": {
    "monday": ["18:00-20:00"]
  },
  "subjects": [
    { "name": "Physics", "price": "300000.00" }
  ],
  "achievements": [
    { "title": "Top Tutor Award 2023", "is_featured": true }
  ],
  "reviews": [
    {
      "student_name": "John S.",
      "rating": 5,
      "comment": "Excellent tutor!"
    }
  ]
}
```

## 3. Tutor Interactions

Endpoints for students to like, save, and manage their tutor lists.

### 3.1 Like a Tutor

- **Endpoint**: `/tutors/<uuid:tutor_id>/like/`
- **Method**: `POST`
- **Permission**: `IsAuthenticated` (Students only)
- **Description**: Adds a tutor to the student's liked list. Returns a success message.

**Response (200 OK)**:
```json
{
  "message": "Tutor liked successfully"
}
```

### 3.2 Unlike a Tutor

- **Endpoint**: `/tutors/<uuid:tutor_id>/unlike/`
- **Method**: `DELETE`
- **Permission**: `IsAuthenticated` (Students only)
- **Description**: Removes a tutor from the student's liked list.

**Response (200 OK)**:
```json
{
  "message": "Tutor unliked successfully"
}
```

### 3.3 Save a Tutor

- **Endpoint**: `/tutors/<uuid:tutor_id>/save/`
- **Method**: `POST`
- **Permission**: `IsAuthenticated` (Students only)
- **Description**: Adds a tutor to the student's saved list for future reference.

**Response (200 OK)**:
```json
{
  "message": "Tutor saved successfully"
}
```

### 3.4 Unsave a Tutor

- **Endpoint**: `/tutors/<uuid:tutor_id>/unsave/`
- **Method**: `DELETE`
- **Permission**: `IsAuthenticated` (Students only)
- **Description**: Removes a tutor from the student's saved list.

**Response (200 OK)**:
```json
{
  "message": "Tutor unsaved successfully"
}
```

### 3.5 Get Saved Tutors

- **Endpoint**: `/users/saved-tutors/`
- **Method**: `GET`
- **Permission**: `IsAuthenticated` (Students only)
- **Description**: Retrieves a list of all tutors the student has saved.

**Response (200 OK)**:
*A list of tutor objects, similar to the search results.* 

### 3.6 Get Liked Tutors

- **Endpoint**: `/users/liked-tutors/`
- **Method**: `GET`
- **Permission**: `IsAuthenticated` (Students only)
- **Description**: Retrieves a list of all tutors the student has liked.

**Response (200 OK)**:
*A list of tutor objects, similar to the search results.*

## 4. User Profile Management

Endpoints for updating user and profile information.

### 4.1 Update User Profile

- **Endpoint**: `/users/profile/`
- **Method**: `PATCH`
- **Permission**: `IsAuthenticated`
- **Description**: Updates the profile for the currently authenticated user. Can update base user details and profile-specific details (student or tutor) in a single request.

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "profile_data": {
    "school": "Example University",
    "grade": "12",
    "bio": "Updated bio for tutor..."
  }
}
```

**Response (200 OK)**:
*The full updated user object, as serialized by `UserSerializer`.*

**React Native Example**:
```javascript
const updateProfile = async (profileUpdates) => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/users/profile/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer <your_jwt_token>`,
      },
      body: JSON.stringify(profileUpdates),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Profile updated successfully:', data);
    } else {
      console.error('Update failed:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage:
updateProfile({ first_name: 'Johnny', profile_data: { bio: 'A new bio.' } });
```

### 4.2 Upload Profile Image

- **Endpoint**: `/upload/profile-image/`
- **Method**: `POST`
- **Permission**: `IsAuthenticated`
- **Description**: Uploads a new profile image for the user. The request must be `multipart/form-data`.

**Request Body**:
- A `FormData` object containing the image file under the key `image`.

**Response (200 OK)**:
```json
{
  "image_url": "http://localhost:8000/media/profiles/user-uuid/new_avatar.png"
}
```

**React Native Example**:
```javascript
const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageFile.uri, // e.g., from an image picker
    type: imageFile.type, // e.g., 'image/jpeg'
    name: imageFile.fileName || 'profile.jpg',
  });

  try {
    const response = await fetch('http://localhost:8000/api/v1/upload/profile-image/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer <your_jwt_token>`,
      },
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Image uploaded successfully:', data.image_url);
    } else {
      console.error('Upload failed:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

## 5. Chat

Endpoints for real-time chat between students and tutors.

### 5.1 Get Chat Rooms

- **Endpoint**: `/chats/`
- **Method**: `GET`
- **Permission**: `IsAuthenticated`
- **Description**: Retrieves a list of all chat rooms for the authenticated user, ordered by the most recent message.

**Response (200 OK)**:
```json
[
  {
    "id": "chat-room-uuid",
    "other_user": {
      "id": "user-uuid",
      "name": "Jane Doe",
      "profile_image": "/media/profiles/user-uuid/avatar.jpg"
    },
    "last_message": "Sounds great! See you then.",
    "last_message_at": "2023-10-27T10:00:00Z",
    "unread_count": 2
  }
]
```

### 5.2 Create or Get Chat Room

- **Endpoint**: `/chats/create/`
- **Method**: `POST`
- **Permission**: `IsAuthenticated` (Students only)
- **Description**: Creates a new chat room with a tutor. If a room already exists between the student and tutor, it returns the existing room data.

**Request Body**:
```json
{
  "tutor_id": "tutor-uuid-string"
}
```

**Response (201 Created or 200 OK)**:
*A single chat room object, as shown in the "Get Chat Rooms" response.*

### 5.3 Get Chat Messages

- **Endpoint**: `/chats/<uuid:room_id>/messages/`
- **Method**: `GET`
- **Permission**: `IsAuthenticated` (Room participant only)
- **Description**: Retrieves all messages for a specific chat room, ordered by creation time.

**Response (200 OK)**:
```json
[
  {
    "id": "message-uuid",
    "sender": {
      "id": "user-uuid",
      "name": "John Doe"
    },
    "content": "Hi, are you available for a session tomorrow?",
    "created_at": "2023-10-27T09:55:00Z"
  }
]
```

### 5.4 Send Message

- **Endpoint**: `/chats/<uuid:room_id>/send/`
- **Method**: `POST`
- **Permission**: `IsAuthenticated` (Room participant only)
- **Description**: Sends a message to a chat room. The new message is also broadcast via WebSocket to connected clients.

**Request Body**:
```json
{
  "content": "Yes, I am available at 3 PM."
}
```

**Response (201 Created)**:
*A single message object, as shown in the "Get Chat Messages" response.*

## 6. Reviews

Endpoints for creating and viewing tutor reviews.

### 6.1 Get Tutor Reviews

- **Endpoint**: `/tutors/<uuid:tutor_id>/reviews/`
- **Method**: `GET`
- **Permission**: `IsAuthenticated`
- **Description**: Retrieves all reviews for a specific tutor, ordered by the most recent.

**Response (200 OK)**:
```json
[
  {
    "id": "review-uuid",
    "student_name": "John Doe",
    "rating": 5,
    "comment": "An amazing and very patient tutor! Highly recommended.",
    "created_at": "2023-10-26T14:30:00Z"
  }
]
```

### 6.2 Create a Review

- **Endpoint**: `/tutors/<uuid:tutor_id>/reviews/create/`
- **Method**: `POST`
- **Permission**: `IsAuthenticated` (Students only)
- **Description**: Allows a student to submit a review for a tutor. A student can only review a tutor once.

**Request Body**:
```json
{
  "rating": 5,
  "comment": "Great session! Learned a lot."
}
```

**Response (201 Created)**:
*A single review object, as shown in the "Get Tutor Reviews" response.*

**React Native Example**:
```javascript
const submitReview = async (tutorId, rating, comment) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/tutors/${tutorId}/reviews/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer <your_jwt_token>`,
      },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Review submitted successfully:', data);
    } else {
      console.error('Failed to submit review:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

## 7. Metadata

Endpoints for retrieving general platform data.

### 7.1 Get Subjects List

- **Endpoint**: `/subjects/`
- **Method**: `GET`
- **Permission**: `IsAuthenticated`
- **Description**: Retrieves a list of all available subjects, ordered alphabetically.

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "Biology"
  },
  {
    "id": 2,
    "name": "Chemistry"
  }
]
```

### 7.2 Get Platform Statistics

- **Endpoint**: `/platform/stats/`
- **Method**: `GET`
- **Permission**: `IsAuthenticated`
- **Description**: Retrieves key statistics about the TutorConnect platform.

**Response (200 OK)**:
```json
{
  "total_tutors": 150,
  "total_students": 500,
  "total_subjects": 12,
  "total_reviews": 850,
  "average_rating": 4.75,
  "active_chat_rooms": 75
}
```

---

