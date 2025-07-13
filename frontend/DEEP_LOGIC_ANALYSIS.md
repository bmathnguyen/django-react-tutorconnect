# Deep Logic Analysis: Navigation & Data Flow

## App Architecture Overview

### Navigation Structure
```
App.js (Stack Navigator)
├── Auth Flow
│   ├── LoginScreen
│   └── RegisterScreen
├── MainApp (Tab Navigator)
│   ├── SearchScreen (Home)
│   ├── SavedScreen
│   ├── TutorListScreen (Tinder)
│   ├── MessagesScreen
│   └── ProfileScreen
└── Modal Screens
    ├── TutorProfileScreen
    └── ChatScreen
```

## Deep Logic Flow Analysis

### 1. Authentication Flow

#### LoginScreen → MainApp
```javascript
// LoginScreen.js - handleLogin function
const handleLogin = async () => {
  // TODO: API call - Supabase authentication
  // 1. Authenticate with Supabase
  // 2. Store user session/token
  // 3. Navigate to MainApp
  navigation.replace('MainApp'); // Replaces Login screen in stack
}
```

**Deep Logic:**
- Uses `navigation.replace()` instead of `navigate()` to prevent going back to login
- Should store authentication state globally (Context/Redux)
- Session management needed for API calls

#### RegisterScreen → MainApp
```javascript
// RegisterScreen.js - handleRegister function
const handleRegister = async () => {
  // TODO: API call - Create user profile
  // 1. Create Supabase auth user
  // 2. Store additional profile data
  // 3. Navigate to MainApp
  navigation.replace('MainApp');
}
```

**Deep Logic:**
- Collects extensive user data (name, phone, school, goals, etc.)
- Different flows for student vs tutor registration
- Should validate data before API call

### 2. Search & Filter Flow

#### SearchScreen → TutorListScreen
```javascript
// SearchScreen.js - handleSearch function
const handleSearch = () => {
  // TODO: API call - Search tutors with filters
  // POST /api/tutors/search/ with filters object
  navigation.navigate('TutorList', { filters });
}
```

**Deep Logic:**
- **Filters Object Structure:**
  ```javascript
  {
    goal: 'Thi THPTQG',        // Student's learning goal
    location: 'Online',        // Online/Offline preference
    district: 'Quận 1',        // Geographic filter
    subject: 'Toán',           // Subject filter
    priceRange: 400            // Price range (100k-1000k)
  }
  ```

- **Data Flow:**
  1. User sets filters in SearchScreen
  2. Filters passed as route params to TutorListScreen
  3. TutorListScreen receives filters and calls API
  4. API returns filtered tutor list

#### TutorListScreen Processing
```javascript
// TutorListScreen.js - useEffect for filters
useEffect(() => {
  // TODO: API call - Fetch tutors based on search filters
  // GET /api/tutors/?filters={filters}
  // Apply filters from SearchScreen and return matching tutors
  console.log('Applied filters:', filters);
}, [filters]);
```

**Deep Logic:**
- Filters trigger API call when component mounts or filters change
- Should implement debouncing for better UX
- Loading states needed during API call

### 3. Tutor Profile Flow

#### TutorListScreen → TutorProfileScreen
```javascript
// TutorListScreen.js - handleViewProfile function
const handleViewProfile = (tutorId) => {
  const tutor = tutors.find(t => t.id === tutorId);
  navigation.navigate('TutorProfile', { 
    tutorId, 
    tutorName: tutor?.name 
  });
};
```

**Deep Logic:**
- Passes `tutorId` as primary identifier
- Passes `tutorName` for immediate display
- TutorProfileScreen will fetch full data using `tutorId`

#### TutorProfileScreen Data Fetching
```javascript
// TutorProfileScreen.js - fetchTutorProfile function
const fetchTutorProfile = async () => {
  // TODO: API call - Fetch detailed tutor profile
  // GET /api/tutors/{tutorId}/
  const tutorData = mockTutors.find(t => t.id === tutorId);
  setTutor(tutorData);
};
```

**Deep Logic:**
- Uses `tutorId` from route params to fetch complete tutor data
- Should implement loading states and error handling
- Could cache tutor data to avoid refetching

### 4. Chat Flow

#### TutorProfileScreen → ChatScreen
```javascript
// TutorProfileScreen.js - handleStartChat function
const handleStartChat = () => {
  navigation.navigate('Chat', {
    tutorId: tutor.id,
    tutorName: tutor.name,
  });
};
```

#### MessagesScreen → ChatScreen
```javascript
// MessagesScreen.js - openChat function
const openChat = (chatRoom) => {
  navigation.navigate('Chat', {
    tutorId: chatRoom.tutorId,
    tutorName: chatRoom.tutorName,
  });
};
```

**Deep Logic:**
- Chat can be accessed from two entry points
- Both pass `tutorId` and `tutorName` for consistency
- ChatScreen will load messages for specific tutor

#### ChatScreen Message Handling
```javascript
// ChatScreen.js - loadMessages function
const loadMessages = async () => {
  // TODO: API call - Fetch chat messages for specific tutor
  // GET /api/chats/{tutorId}/messages/
  const chatMessages = mockMessages.filter(msg => msg.tutorId === tutorId);
  setMessages(chatMessages);
};

// ChatScreen.js - sendMessage function
const sendMessage = async () => {
  // TODO: API call - Send new message
  // POST /api/chats/{tutorId}/messages/
  // Handle real-time updates (WebSocket/Supabase Realtime)
};
```

**Deep Logic:**
- Messages filtered by `tutorId` from route params
- Real-time updates needed for live chat
- Should implement typing indicators and read receipts

### 5. Like/Favorite Flow

#### TutorListScreen Like Action
```javascript
// TutorListScreen.js - handleLikeTutor function
const handleLikeTutor = async (tutorId) => {
  // TODO: API call - Like/favorite a tutor
  // POST /api/tutors/{tutorId}/like/
  // Add tutor to user's saved/favorites list
};
```

#### TutorProfileScreen Like Action
```javascript
// TutorProfileScreen.js - handleLikeTutor function
const handleLikeTutor = async () => {
  // TODO: API call - Like/favorite tutor from profile
  // POST /api/tutors/{tutorId}/like/
  // Add tutor to user's saved list
};
```

**Deep Logic:**
- Same API endpoint called from different screens
- Should update UI immediately (optimistic updates)
- Sync with SavedScreen to show updated favorites

### 6. Saved Tutors Flow

#### SavedScreen Data Loading
```javascript
// SavedScreen.js - loadSavedTutors function
const loadSavedTutors = async () => {
  // TODO: API call - Fetch user's saved tutors
  // GET /api/users/saved-tutors/
  // Return list of tutors that user has liked/favorited
};
```

**Deep Logic:**
- Loads only tutors that user has liked
- Should refresh when returning from other screens
- Could implement pull-to-refresh

### 7. Profile Management Flow

#### ProfileScreen Data Loading
```javascript
// ProfileScreen.js - User profile state
// TODO: API call - Fetch user profile data
// GET /api/users/profile/
// Load user information: name, email, phone, school, grade, userType, goals
```

#### ProfileScreen Actions
```javascript
// ProfileScreen.js - handleEditProfile function
const handleEditProfile = () => {
  // TODO: API call - Navigate to edit profile screen
  // Create EditProfileScreen with API integration
  // PUT /api/users/profile/ for updating user data
};

// ProfileScreen.js - handleLogout function
const handleLogout = () => {
  // TODO: API call - Implement proper logout
  // 1. Clear Supabase session
  // 2. Clear local storage/cache
  // 3. Reset navigation to Login screen
};
```

## API Call Chains & Dependencies

### 1. Search → List → Profile Chain
```
SearchScreen (set filters)
    ↓
TutorListScreen (API call with filters)
    ↓
TutorProfileScreen (API call with tutorId)
```

### 2. Profile → Chat Chain
```
TutorProfileScreen (tutorId)
    ↓
ChatScreen (API call with tutorId for messages)
```

### 3. Like → Saved Chain
```
TutorListScreen/TutorProfileScreen (like tutorId)
    ↓
SavedScreen (refresh to show new favorite)
```

## State Management Patterns

### 1. Route Parameters
- Used for passing data between screens
- Examples: `filters`, `tutorId`, `tutorName`
- Should be validated and sanitized

### 2. Component State
- Local state for UI interactions
- Examples: `loading`, `viewMode`, `currentTutorIndex`
- Should be reset when component unmounts

### 3. Global State (Needed)
- User authentication state
- User profile data
- Chat notifications
- Favorites list

## Error Handling Patterns

### 1. API Error Handling
```javascript
try {
  // API call
} catch (error) {
  // Show user-friendly error message
  Alert.alert('Lỗi', 'Không thể tải dữ liệu');
}
```

### 2. Navigation Error Handling
- Check if required params exist
- Handle missing data gracefully
- Provide fallback UI

## Performance Considerations

### 1. API Call Optimization
- Debounce search filters
- Cache tutor profiles
- Implement pagination for large lists

### 2. Navigation Optimization
- Use `replace()` instead of `navigate()` when appropriate
- Clear navigation stack for auth flow
- Implement deep linking

### 3. Memory Management
- Clear component state on unmount
- Cancel API calls when component unmounts
- Implement proper cleanup

## Real-time Features

### 1. Chat Real-time Updates
- WebSocket connection for live messages
- Typing indicators
- Online status indicators

### 2. Notification System
- Push notifications for new messages
- Badge counts for unread messages
- Real-time updates for favorites

## Security Considerations

### 1. Authentication
- Secure token storage
- Automatic token refresh
- Session timeout handling

### 2. Data Validation
- Validate all user inputs
- Sanitize API parameters
- Implement rate limiting

### 3. Privacy
- Secure chat messages
- User data protection
- GDPR compliance

## Testing Strategy

### 1. Unit Tests
- Test individual API functions
- Test navigation logic
- Test state management

### 2. Integration Tests
- Test complete user flows
- Test API integration
- Test real-time features

### 3. E2E Tests
- Test complete app workflows
- Test cross-platform compatibility
- Test performance under load 