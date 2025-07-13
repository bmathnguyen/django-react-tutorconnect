# API Calls Needed in Frontend

This document highlights all the places in the frontend code where API calls need to be implemented to connect with the backend/Django API or Supabase.

## Authentication Screens

### LoginScreen.js
**File:** `frontend/src/screens/Auth/LoginScreen.js`

**Lines 24-40:** `handleLogin` function
```javascript
// TODO: API call - Implement Supabase authentication
// Replace the setTimeout mock with actual Supabase auth call:
// const { data, error } = await supabase.auth.signInWithPassword({
//   email,
//   password,
// });
// Also need to handle user type (student/tutor) and store user session
```

**Lines 8-10:** Supabase import (commented out)
```javascript
// TODO: API call - Uncomment and configure Supabase client
// import { supabase } from '../supabaseClient';
// Need to create supabaseClient.js with proper configuration
```

### RegisterScreen.js
**File:** `frontend/src/screens/Auth/RegisterScreen.js`

**Lines 41-50:** `handleRegister` function
```javascript
// TODO: API call - Implement user registration with Supabase
// 1. Create user account with Supabase Auth
// 2. Store additional user profile data (name, phone, school, etc.)
// 3. Handle different user types (student/tutor)
// 4. Create user profile in database with user type specific fields
```

## Home Screens

### SearchScreen.js
**File:** `frontend/src/screens/Home/SearchScreen.js`

**Lines 25-30:** `handleSearch` function
```javascript
// TODO: API call - Implement tutor search with filters
// POST /api/tutors/search/ with filters:
// - goal (Thi THPTQG, Thi chuyên, Học bổ trợ)
// - location (Online/Offline)
// - district (Quận 1-12)
// - subject (Toán, Lý, Hóa, etc.)
// - priceRange (100k-1000k)
// Return filtered list of tutors matching criteria
```

### TutorListScreen.js
**File:** `frontend/src/screens/Home/TutorListScreen.js`

**Lines 18-22:** `useEffect` for filters
```javascript
// TODO: API call - Fetch tutors based on search filters
// GET /api/tutors/?filters={filters}
// Apply filters from SearchScreen and return matching tutors
// Replace mockTutors with actual API response
```

**Lines 25-32:** `handleLikeTutor` function
```javascript
// TODO: API call - Like/favorite a tutor
// POST /api/tutors/{tutorId}/like/
// Add tutor to user's saved/favorites list
// Handle success/error responses
```

## Chat Screens

### MessagesScreen.js
**File:** `frontend/src/screens/Chat/MessagesScreen.js`

**Lines 15-21:** `loadChatRooms` function
```javascript
// TODO: API call - Fetch user's chat rooms
// GET /api/chats/
// Return list of chat rooms with:
// - tutorId, tutorName, tutorAvatar
// - lastMessage, lastMessageTime
// - unreadCount
// Replace mockChatRooms with actual API response
```

### ChatScreen.js
**File:** `frontend/src/screens/Chat/ChatScreen.js`

**Lines 35-42:** `loadMessages` function
```javascript
// TODO: API call - Fetch chat messages for specific tutor
// GET /api/chats/{tutorId}/messages/
// Return messages with:
// - id, text, sender (student/tutor)
// - time, tutorId
// Replace mockMessages filter with actual API call
```

**Lines 50-62:** `sendMessage` function
```javascript
// TODO: API call - Send new message
// POST /api/chats/{tutorId}/messages/
// Send message data:
// - text, sender, tutorId
// Handle real-time updates (WebSocket/Supabase Realtime)
// Update message list after successful send
```

## Profile Screens

### ProfileScreen.js
**File:** `frontend/src/screens/Profile/ProfileScreen.js`

**Lines 12-20:** User profile state
```javascript
// TODO: API call - Fetch user profile data
// GET /api/users/profile/
// Load user information:
// - name, email, phone, school, grade
// - userType (student/tutor)
// - goals (for students)
// Replace hardcoded userProfile with API response
```

**Lines 24-26:** `handleEditProfile` function
```javascript
// TODO: API call - Navigate to edit profile screen
// Create EditProfileScreen with API integration
// PUT /api/users/profile/ for updating user data
```

**Lines 28-30:** `handleSettings` function
```javascript
// TODO: API call - Implement settings functionality
// Create SettingsScreen with various app settings
// May include notification preferences, privacy settings, etc.
```

**Lines 32-45:** `handleLogout` function
```javascript
// TODO: API call - Implement proper logout
// 1. Clear Supabase session
// 2. Clear local storage/cache
// 3. Reset navigation to Login screen
// await supabase.auth.signOut()
```

## Saved Screens

### SavedScreen.js
**File:** `frontend/src/screens/Saved/SavedScreen.js`

**Lines 15-21:** `loadSavedTutors` function
```javascript
// TODO: API call - Fetch user's saved tutors
// GET /api/users/saved-tutors/
// Return list of tutors that user has liked/favorited
// Replace mockTutors filter with actual API response
```

## Tutor Screens

### TutorProfileScreen.js
**File:** `frontend/src/screens/Tutor/TutorProfileScreen.js`

**Lines 22-30:** `fetchTutorProfile` function
```javascript
// TODO: API call - Fetch detailed tutor profile
// GET /api/tutors/{tutorId}/
// Return complete tutor information:
// - name, avatar, rating, experience
// - school, major, graduation
// - achievements, bio, subjects, price
// Replace mockTutors.find with actual API call
```

**Lines 41-48:** `handleLikeTutor` function
```javascript
// TODO: API call - Like/favorite tutor from profile
// POST /api/tutors/{tutorId}/like/
// Add tutor to user's saved list
// Handle success/error responses
```

## Missing Components

### TutorCard.js
**File:** `frontend/src/components/TutorCard.js` (Missing)
```javascript
// TODO: Create TutorCard component
// This component is imported but doesn't exist
// Should display tutor information in card format
// Include like/favorite functionality
```

### Mock Data
**File:** `frontend/src/data/mockData.js` (Missing)
```javascript
// TODO: Create mock data file
// Currently imported but doesn't exist
// Contains mockTutors, mockChatRooms, mockMessages
// Should be replaced with actual API calls
```

## Supabase Configuration

### supabaseClient.js
**File:** `frontend/src/supabaseClient.js` (Missing)
```javascript
// TODO: Create Supabase client configuration
// import { createClient } from '@supabase/supabase-js'
// Configure with your Supabase URL and anon key
// Export supabase client for use throughout app
```

## Additional API Endpoints Needed

### Backend/Django API Endpoints:
1. **Authentication:**
   - `POST /api/auth/login/`
   - `POST /api/auth/register/`
   - `POST /api/auth/logout/`

2. **User Management:**
   - `GET /api/users/profile/`
   - `PUT /api/users/profile/`
   - `GET /api/users/saved-tutors/`

3. **Tutor Management:**
   - `GET /api/tutors/` (with filters)
   - `GET /api/tutors/{id}/`
   - `POST /api/tutors/{id}/like/`
   - `POST /api/tutors/search/`

4. **Chat System:**
   - `GET /api/chats/`
   - `GET /api/chats/{tutorId}/messages/`
   - `POST /api/chats/{tutorId}/messages/`

### Supabase Tables Needed:
1. **users** - User profiles and authentication
2. **tutors** - Tutor profiles and information
3. **chats** - Chat rooms between users and tutors
4. **messages** - Individual chat messages
5. **user_likes** - User's saved/favorited tutors

## Real-time Features

### WebSocket/Supabase Realtime:
1. **Chat Messages** - Real-time message delivery
2. **Online Status** - Show when tutors are online
3. **Typing Indicators** - Show when someone is typing
4. **Notification Badges** - Real-time unread message counts

## Error Handling

All API calls should include proper error handling:
- Network errors
- Authentication errors
- Validation errors
- Server errors
- User-friendly error messages

## Loading States

Implement loading states for all API calls:
- Show loading spinners during API calls
- Disable buttons during requests
- Handle timeout scenarios 