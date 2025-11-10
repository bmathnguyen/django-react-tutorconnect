# TutorConnect API Documentation

Welcome to the TutorConnect API documentation. This document provides a detailed overview of all available API endpoints, including request/response formats and usage examples for the React Native frontend.

---

## PostgreSQL Setup (USE_POSTGRES=1)

1. **Install PostgreSQL** if not already installed.
2. **Create the database:**
   ```sh
   createdb -U postgres tutoring_db
   # or
   psql -U postgres -c "CREATE DATABASE tutoring_db;"
   ```
3. **Set `USE_POSTGRES=1` in your `.env` file** and fill in DB credentials.
4. **Run migrations:**
   ```sh
   python manage.py migrate
   ```
5. **Troubleshooting:**
   - If you see `psycopg2.OperationalError: FATAL: database ... does not exist`, ensure the DB is created and credentials are correct.

---

## Singaporean Tutor Mock Data Seeder

For development and testing, TutorConnect includes a management command to seed the database with realistic Singaporean tutors and students.

**Seeder location:** `backend/api/management/commands/seed_sg_mockdata.py`

### Features:
- **Locations:** Uses major Singapore MRT station names (without "MRT") such as Bukit Timah, Bedok, Tampines, Jurong East, Woodlands, Yishun, Serangoon, Clementi, etc.
- **Subjects:** "Math", "English", "Physics", "Chemistry", "Biology", "Chinese", "Malay", "Tamil", "Social Studies", "Geography", "History", "Literature", "Principles of Accounts", "Economics", "Computer Applications" (with levels: "basic" or "advanced").
- **Price Range:** Tutor subject prices are randomly set from **30 to 200 SGD**.
- **Class Levels:** Class levels follow the existing system (e.g., Primary, Secondary, JC).
- **Profiles:** Generates 30 tutors and 3 students with realistic Singaporean names, bios, and education backgrounds.
- **Chats:** Seeds a few chat rooms and English messages for demo/testing purposes.

### How to Run:
```bash
python manage.py seed_sg_mockdata
```

This will:
- Add Singapore MOE subjects if not present
- Create sample tutors and students with Singaporean context
- Assign random subjects, levels, and price per subject
- Create a few chat rooms and demo messages

**Note:**
- This seeder is for development/testing only. Data is not intended for production.
- Locations are mapped to the backend's `location` field. If you add more MRT stations, update both the seeder and model choices.
- Price is in SGD (Singapore Dollar).

---

**Base URL**: `/api/`

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

## Frontend Integration Guide

### API URL Construction Examples

Based on your Postman screenshot and backend analysis, here are complete API URL examples for different search scenarios:

#### **Base Search Endpoint**
```
GET /api/v1/search/tutors/
```

#### **Example 1: Basic Search (All Tutors)**
```
GET http://localhost:8000/api/v1/search/tutors/
Headers: Authorization: Bearer <your_jwt_token>
```
**Explanation**: Returns all active tutors ordered by rating (highest first)

#### **Example 2: Search by Price (Your Postman Example)**
```
GET http://localhost:8000/api/v1/search/tutors/?max_price=300000&location_type=offline&city=hanoi
Headers: Authorization: Bearer <your_jwt_token>
```
**Explanation**: 
- `max_price=300000`: Find tutors whose minimum hourly rate ≤ 300,000 VND
- `location_type=offline`: Only offline/in-person tutoring
- `city=hanoi`: Only tutors in Hanoi

#### **Example 3: Search by Subject**
```
GET http://localhost:8000/api/v1/search/tutors/?subjects=Toán
Headers: Authorization: Bearer <your_jwt_token>
```
**Explanation**: Find tutors who teach Math (case-insensitive contains search)

#### **Example 4: Search by Grade Levels**
```
GET http://localhost:8000/api/v1/search/tutors/?classes=1,5,10
Headers: Authorization: Bearer <your_jwt_token>
```
**Explanation**: 
- `classes=1,5,10`: Find tutors who teach grades 1, 5, and 10
- Backend automatically maps: Grade 1 → "Grade 1-5", Grade 5 → "Grade 1-5", Grade 10 → "Grade 10-12"
- Returns tutors who teach "Grade 1-5" OR "Grade 10-12"

#### **Example 5: Online Tutoring Search**
```
GET http://localhost:8000/api/v1/search/tutors/?location_type=online&subjects=Tiếng Anh&max_price=250000
Headers: Authorization: Bearer <your_jwt_token>
```
**Explanation**: 
- `location_type=online`: Online tutoring (no city filter needed)
- `subjects=Tiếng Anh`: English teachers
- `max_price=250000`: Max 250,000 VND per hour

#### **Example 6: Complex Multi-Filter Search**
```
GET http://localhost:8000/api/v1/search/tutors/?subjects=Vật Lý&classes=10,11,12&max_price=400000&location_type=offline&city=hochiminh
Headers: Authorization: Bearer <your_jwt_token>
```
**Explanation**: 
- Physics tutors for high school (grades 10-12) in Ho Chi Minh City, max 400k VND/hour

#### **Example 7: Pagination**
```
GET http://localhost:8000/api/v1/search/tutors/?page=2&page_size=10&subjects=Hóa Học
Headers: Authorization: Bearer <your_jwt_token>
```
**Explanation**: 
- `page=2`: Get second page of results
- `page_size=10`: 10 tutors per page
- Chemistry tutors

### URL Parameter Reference

| Parameter | Type | Required | Description | Example Values |
|-----------|------|----------|-------------|----------------|
| `subjects` | string | No | Subject name (case-insensitive contains) | `Toán`, `Tiếng Anh`, `Vật Lý` |
| `classes` | string | No | Comma-separated grade numbers | `1,5,10` or `6,7,8,9` |
| `max_price` | number | No | Maximum price (tutor's min price ≤ value) | `300000`, `500000` |
| `location_type` | string | No | Tutoring type | `online`, `offline` |
| `city` | string | Conditional* | City for offline tutoring | `hanoi`, `hochiminh`, `danang` |
| `page` | number | No | Page number (default: 1) | `1`, `2`, `3` |
| `page_size` | number | No | Results per page (default: 20) | `10`, `20`, `50` |

*Required when `location_type=offline`

### JavaScript Implementation Examples

#### **URL Construction Helper Function**
```javascript
const buildSearchURL = (baseURL, filters) => {
  const url = new URL(`${baseURL}/api/v1/search/tutors/`);
  
  // Add filters as query parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

// Usage examples:
const baseURL = 'http://localhost:8000';

// Example 1: Basic search
const basicSearchURL = buildSearchURL(baseURL, {});
// Result: "http://localhost:8000/api/v1/search/tutors/"

// Example 2: Price and location filter
const priceLocationURL = buildSearchURL(baseURL, {
  max_price: 300000,
  location_type: 'offline',
  city: 'hanoi'
});
// Result: "http://localhost:8000/api/v1/search/tutors/?max_price=300000&location_type=offline&city=hanoi"

// Example 3: Subject and grade filter
const subjectGradeURL = buildSearchURL(baseURL, {
  subjects: 'Toán',
  classes: '1,5,10'
});
// Result: "http://localhost:8000/api/v1/search/tutors/?subjects=To%C3%A1n&classes=1%2C5%2C10"
```

#### **React Native Search Hook**
```javascript
import { useState, useCallback } from 'react';

const useTutorSearch = () => {
  const [loading, setLoading] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  
  const searchTutors = useCallback(async (filters = {}, token) => {
    setLoading(true);
    setError(null);
    
    try {
      // Construct URL with filters
      const searchURL = buildSearchURL('http://localhost:8000', filters);
      
      const response = await fetch(searchURL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setTutors(data.results || []);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        currentPage: filters.page || 1,
        totalPages: Math.ceil(data.count / (filters.page_size || 20))
      });
      
      return data;
      
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    searchTutors,
    tutors,
    loading,
    error,
    pagination
  };
};
```

#### **Filter State Management**
```javascript
const useSearchFilters = () => {
  const [filters, setFilters] = useState({
    subjects: '',
    classes: '',
    max_price: null,
    location_type: '',
    city: '',
    page: 1,
    page_size: 20
  });
  
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when other filters change
    }));
  };
  
  const updateMultipleFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to page 1
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      subjects: '',
      classes: '',
      max_price: null,
      location_type: '',
      city: '',
      page: 1,
      page_size: 20
    });
  };
  
  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'page' || key === 'page_size') return false;
      return value !== null && value !== undefined && value !== '';
    }).length;
  };
  
  return {
    filters,
    updateFilter,
    updateMultipleFilters,
    clearFilters,
    activeFiltersCount: getActiveFiltersCount()
  };
};
```

#### **Practical Search Examples**
```javascript
// Example 1: Search for Math tutors in Hanoi under 300k VND
const searchMathTutorsHanoi = async () => {
  const filters = {
    subjects: 'Toán',
    location_type: 'offline',
    city: 'hanoi',
    max_price: 300000
  };
  
  const results = await searchTutors(filters, token);
  console.log(`Found ${results.count} Math tutors in Hanoi`);
};

// Example 2: Search for online English tutors for high school
const searchOnlineEnglishTutors = async () => {
  const filters = {
    subjects: 'Tiếng Anh',
    location_type: 'online',
    classes: '10,11,12' // High school grades
  };
  
  const results = await searchTutors(filters, token);
  console.log(`Found ${results.count} online English tutors`);
};

// Example 3: Search with pagination
const searchWithPagination = async (pageNumber) => {
  const filters = {
    subjects: 'Vật Lý',
    page: pageNumber,
    page_size: 10
  };
  
  const results = await searchTutors(filters, token);
  console.log(`Page ${pageNumber}: ${results.results.length} tutors`);
};

// Example 4: Search for elementary tutors (grades 1-5)
const searchElementaryTutors = async () => {
  const filters = {
    classes: '1,2,3,4,5', // Will map to "Grade 1-5" group
    max_price: 200000
  };
  
  const results = await searchTutors(filters, token);
  console.log(`Found ${results.count} elementary tutors`);
};
```

### Filter Mapping Recommendations

Based on the backend API analysis, here's how frontend filters should map to backend parameters:

#### 1. **Goal/Subject Mapping**
- **Frontend**: `goal` (user-friendly subject names)
- **Backend**: `subjects` (case-insensitive contains search)
- **Implementation**: 
  ```javascript
  // Frontend goal selection
  const goals = ['Toán', 'Vật Lý', 'Hóa Học', 'Tiếng Anh'];
  
  // Map to backend parameter
  const searchParams = {
    subjects: selectedGoal, // e.g., "Toán"
  };
  ```

#### 2. **District/Location Mapping**
- **Frontend**: `district` (user-friendly location names)
- **Backend**: `city` + `location_type`
- **Available Cities**: 
  ```javascript
  const vietnamCities = [
    { key: 'hanoi', label: 'Hà Nội' },
    { key: 'hochiminh', label: 'TP. Hồ Chí Minh' },
    { key: 'danang', label: 'Đà Nẵng' },
    { key: 'haiphong', label: 'Hải Phòng' },
    { key: 'cantho', label: 'Cần Thơ' },
    // ... see backend/api/models/profile.py LOCATION_CHOICES for full list
  ];
  ```
- **Implementation**:
  ```javascript
  const searchParams = {
    location_type: 'offline', // or 'online'
    city: 'hanoi', // required when location_type is 'offline'
  };
  ```

#### 3. **Grade Level Mapping**
- **Frontend**: Individual grade selection (1-12, university)
- **Backend**: `classes` (comma-separated grade numbers)
- **Backend Logic**: Automatically maps to ClassLevel groups:
  - Grades 1-5 → "Grade 1-5"
  - Grades 6-9 → "Grade 6-9" 
  - Grades 10-12 → "Grade 10-12"
- **Implementation**:
  ```javascript
  const selectedGrades = [1, 5, 10]; // User selections
  const searchParams = {
    classes: selectedGrades.join(','), // "1,5,10"
  };
  ```

#### 4. **Price Range Mapping**
- **Frontend**: Price slider/input
- **Backend**: `max_price` (filters tutors whose minimum price ≤ specified value)
- **Implementation**:
  ```javascript
  const searchParams = {
    max_price: 300000, // VND per hour
  };
  ```

### Error Handling Strategy

#### 1. **Specific Error Messages**
Implement structured error handling with user-friendly messages:

```javascript
const handleSearchError = (error, response) => {
  if (!response.ok) {
    switch (response.status) {
      case 400:
        return 'Thông tin tìm kiếm không hợp lệ. Vui lòng kiểm tra lại.';
      case 401:
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      case 404:
        return 'Không tìm thấy gia sư phù hợp với tiêu chí của bạn.';
      case 500:
        return 'Lỗi hệ thống. Vui lòng thử lại sau.';
      default:
        return 'Có lỗi xảy ra. Vui lòng thử lại.';
    }
  }
  return 'Lỗi kết nối mạng. Kiểm tra kết nối internet.';
};
```

#### 2. **Validation Messages**
```javascript
const validateSearchParams = (params) => {
  const errors = [];
  
  if (params.location_type === 'offline' && !params.city) {
    errors.push('Vui lòng chọn thành phố khi tìm kiếm gia sư dạy trực tiếp.');
  }
  
  if (params.max_price && params.max_price < 50000) {
    errors.push('Mức giá tối thiểu là 50,000 VND/giờ.');
  }
  
  return errors;
};
```

### Loading States Implementation

#### 1. **Search Loading with Skeleton**
Recommend skeleton loading for better UX:

```javascript
const TutorSearchScreen = () => {
  const [loading, setLoading] = useState(false);
  const [tutors, setTutors] = useState([]);
  
  const searchTutors = async (params) => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/search/tutors/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        // Add query parameters
      });
      const data = await response.json();
      setTutors(data.results);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View>
      {loading ? (
        <TutorListSkeleton /> // Custom skeleton component
      ) : (
        <TutorList tutors={tutors} />
      )}
    </View>
  );
};
```

#### 2. **Progressive Loading**
- Show immediate feedback on filter changes
- Debounce search requests (300-500ms)
- Show "Đang tìm kiếm..." message
- Display result count when loaded

### Data Persistence Strategy

#### 1. **Hybrid Caching Approach** (Recommended)
```javascript
const useTutorSearch = () => {
  const [cache, setCache] = useState(new Map());
  const [lastSearchTime, setLastSearchTime] = useState(null);
  
  const searchTutors = async (params, forceRefresh = false) => {
    const cacheKey = JSON.stringify(params);
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    // Use cache if:
    // 1. Not forcing refresh
    // 2. Cache exists for these params
    // 3. Cache is less than 5 minutes old
    if (!forceRefresh && 
        cache.has(cacheKey) && 
        (now - lastSearchTime) < CACHE_DURATION) {
      return cache.get(cacheKey);
    }
    
    // Fetch fresh data
    const response = await fetchTutors(params);
    setCache(prev => new Map(prev).set(cacheKey, response));
    setLastSearchTime(now);
    
    return response;
  };
  
  return { searchTutors };
};
```

#### 2. **Cache Invalidation Rules**
- **Fresh data needed**: User profile updates, new reviews, tutor availability changes
- **Cache duration**: 5 minutes for search results
- **Force refresh**: Pull-to-refresh gesture, app foreground after 30+ minutes
- **Storage**: Use AsyncStorage for offline capability

#### 3. **Offline Support**
```javascript
const cacheSearchResults = async (params, results) => {
  try {
    await AsyncStorage.setItem(
      `search_${JSON.stringify(params)}`,
      JSON.stringify({
        data: results,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.warn('Failed to cache search results:', error);
  }
};
```

### Performance Recommendations

1. **Debounced Search**: Implement 300ms debounce for real-time filtering
2. **Pagination**: Use the API's built-in pagination (page, page_size parameters)
3. **Lazy Loading**: Load tutor details only when needed
4. **Image Optimization**: Cache profile images locally
5. **Background Refresh**: Update cache in background when app becomes active

---

## Creating Mock Tutor Profiles

This section provides a comprehensive guide for creating tutor profiles for testing and mock data purposes.

### Overview

Creating a tutor profile involves registering a new user with `user_type: "tutor"`. The tutor profile is automatically created during registration via the `RegisterSerializer`, which handles both user creation and profile setup including subjects and pricing.

### API Endpoint

**Endpoint**: `POST /api/auth/register/`
**Method**: `POST`
**Permission**: `AllowAny`
**Description**: Creates a new tutor user account and automatically sets up their tutor profile with subjects and pricing.

### Request Format

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "tutor1@example.com",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!",
  "user_type": "tutor",
  "first_name": "Nguyễn",
  "last_name": "Văn An",
  "phone": "0123456789",
  "profile_data": {
    "education": "Đại học Bách Khoa Hà Nội - Khoa Toán Tin",
    "bio": "Gia sư có 5 năm kinh nghiệm dạy Toán và Vật Lý cho học sinh THPT. Chuyên luyện thi THPTQG và các kỳ thi chuyên.",
    "location": "hanoi",
    "tutor_subjects": [
      {
        "subject": "d2165329-85af-4b3b-8642-66ab3db929ab",
        "level": "advanced",
        "price": 400000.00
      },
      {
        "subject": "5c0bddbd-50ce-40c8-a2a5-1967c4af6be4",
        "level": "basic",
        "price": 350000.00
      }
    ]
  }
}
```

### Field Descriptions

#### Required User Fields
- `email` (string): Unique email address for the tutor
- `password` (string): Must meet Django's password validation requirements
- `password_confirm` (string): Must match the password field
- `user_type` (string): Must be `"tutor"`

#### Optional User Fields
- `first_name` (string): Tutor's first name
- `last_name` (string): Tutor's last name
- `phone` (string): 10-digit Vietnamese phone number (e.g., "0123456789")

#### Profile Data Fields
- `education` (string): University or educational background
- `bio` (string): Description of teaching experience and specializations
- `location` (string): City code from available location choices
- `tutor_subjects` (array): List of subjects the tutor teaches with pricing

#### Tutor Subject Object
- `subject` (UUID string): Subject ID from the available subjects list
- `level` (string): Teaching level - either `"basic"` or `"advanced"`
- `price` (decimal): Price per hour in VND (e.g., 400000.00)

### Available Subject IDs

```
d2165329-85af-4b3b-8642-66ab3db929ab: Toán
f20534b0-5f93-440b-8fc6-4763f0d75172: Tiếng Anh
5c0bddbd-50ce-40c8-a2a5-1967c4af6be4: Vật Lý
88dda582-e3a8-4de7-90e6-c38d17300dff: Hóa Học
15c2cda9-8219-4a18-ae8d-c9de964ad2aa: Sinh Học
43e3cc1a-6324-449c-b2d3-d56ac351805f: Ngữ Văn
9dab8e0e-c2d1-4a7a-bba5-b3058a7283ee: Lịch Sử
75b6bd45-b2b9-4474-9c5d-328ef180fc35: Địa Lý
```

### Available Location Codes

```
hanoi: Hà Nội
hochiminh: TP. Hồ Chí Minh
danang: Đà Nẵng
haiphong: Hải Phòng
cantho: Cần Thơ
binhduong: Bình Dương
dongnai: Đồng Nai
baivungtau: Bà Rịa - Vũng Tàu
quangninh: Quảng Ninh
thainguyen: Thái Nguyên
```

### Response Format

**Success (201 Created)**:
```json
{
  "user": {
    "id": "uuid-string",
    "email": "tutor1@example.com",
    "user_type": "tutor",
    "is_online": false,
    "first_name": "Nguyễn",
    "last_name": "Văn An"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

### Postman Configuration

**Method**: `POST`
**URL**: `http://localhost:8000/api/auth/register/`
**Headers**:
```
Content-Type: application/json
```
**Body**: Select "raw" and "JSON", then paste the request body example above.

### Additional Mock Tutor Examples

#### English Tutor
```json
{
  "email": "english.tutor@example.com",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!",
  "user_type": "tutor",
  "first_name": "Trần",
  "last_name": "Thị Lan",
  "phone": "0987654321",
  "profile_data": {
    "education": "Đại học Ngoại Ngữ Hà Nội - Khoa Tiếng Anh",
    "bio": "Gia sư tiếng Anh với chứng chỉ IELTS 8.0. Chuyên dạy giao tiếp và luyện thi IELTS, TOEIC.",
    "location": "hochiminh",
    "tutor_subjects": [
      {
        "subject": "f20534b0-5f93-440b-8fc6-4763f0d75172",
        "level": "advanced",
        "price": 500000.00
      }
    ]
  }
}
```

#### Chemistry Tutor
```json
{
  "email": "chemistry.tutor@example.com",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!",
  "user_type": "tutor",
  "first_name": "Lê",
  "last_name": "Minh Đức",
  "phone": "0369852147",
  "profile_data": {
    "education": "Đại học Khoa học Tự nhiên - Khoa Hóa học",
    "bio": "Thạc sĩ Hóa học với 3 năm kinh nghiệm dạy kèm. Chuyên Hóa vô cơ và Hóa hữu cơ.",
    "location": "danang",
    "tutor_subjects": [
      {
        "subject": "88dda582-e3a8-4de7-90e6-c38d17300dff",
        "level": "advanced",
        "price": 380000.00
      },
      {
        "subject": "15c2cda9-8219-4a18-ae8d-c9de964ad2aa",
        "level": "basic",
        "price": 320000.00
      }
    ]
  }
}
```

### Verification Steps

After creating a tutor profile, you can verify it was created successfully:

1. **Search for the tutor**:
   ```
   GET /api/search/tutors/
   Headers: Authorization: Bearer <access_token>
   ```

2. **Get tutor details**:
   ```
   GET /api/tutors/<tutor_uuid>/
   Headers: Authorization: Bearer <access_token>
   ```

### Common Issues & Solutions

- **400 Bad Request**: Check that password meets validation requirements and all required fields are provided
- **Email already exists**: Use a unique email address for each tutor
- **Invalid subject ID**: Ensure you're using the exact UUID strings from the subjects list
- **Invalid location**: Use only the location codes from the available location choices
- **Price validation**: Ensure prices are provided as numbers (not strings) with decimal precision

### React Native Integration Example

```javascript
const createMockTutor = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'mock.tutor@example.com',
        password: 'SecurePassword123!',
        password_confirm: 'SecurePassword123!',
        user_type: 'tutor',
        first_name: 'Mock',
        last_name: 'Tutor',
        phone: '0123456789',
        profile_data: {
          education: 'Mock University',
          bio: 'Experienced mock tutor for testing purposes.',
          location: 'hanoi',
          tutor_subjects: [
            {
              subject: 'd2165329-85af-4b3b-8642-66ab3db929ab',
              level: 'advanced',
              price: 400000.00
            }
          ]
        }
      }),
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('Mock tutor created successfully:', data);
      // Store tokens for further API calls
      await AsyncStorage.setItem('access_token', data.tokens.access);
      await AsyncStorage.setItem('refresh_token', data.tokens.refresh);
    } else {
      console.error('Failed to create mock tutor:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

