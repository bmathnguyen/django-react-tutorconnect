# Navigation Flow Examples: Deep Logic Analysis

## 1. Search → List → Profile Flow

### Step 1: SearchScreen Sets Filters
```javascript
// SearchScreen.js
const [filters, setFilters] = useState({
  goal: 'Thi THPTQG',
  location: 'Online',
  district: 'Tất cả',
  subject: 'Toán',
  priceRange: 400,
});

const handleSearch = () => {
  // TODO: API call - Search tutors with filters
  // POST /api/tutors/search/ with filters object
  navigation.navigate('TutorList', { filters });
};
```

**Deep Logic:**
- Filters object contains all search criteria
- Navigation passes filters as route params
- TutorListScreen will receive `route.params.filters`

### Step 2: TutorListScreen Receives Filters
```javascript
// TutorListScreen.js
const TutorListScreen = ({ navigation, route }) => {
  const filters = route.params?.filters || {};
  
  useEffect(() => {
    // TODO: API call - Fetch tutors based on search filters
    // GET /api/tutors/?filters={filters}
    console.log('Applied filters:', filters);
  }, [filters]);
};
```

**Deep Logic:**
- Extracts filters from route params
- useEffect triggers when filters change
- Will call API with filter parameters

### Step 3: TutorListScreen → TutorProfileScreen
```javascript
// TutorListScreen.js
const handleViewProfile = (tutorId) => {
  const tutor = tutors.find(t => t.id === tutorId);
  navigation.navigate('TutorProfile', { 
    tutorId, 
    tutorName: tutor?.name 
  });
};
```

**Deep Logic:**
- Finds tutor data from local state
- Passes `tutorId` for API call
- Passes `tutorName` for immediate display

### Step 4: TutorProfileScreen Fetches Data
```javascript
// TutorProfileScreen.js
const TutorProfileScreen = ({ navigation, route }) => {
  const { tutorId } = route.params;
  
  const fetchTutorProfile = async () => {
    // TODO: API call - Fetch detailed tutor profile
    // GET /api/tutors/{tutorId}/
    const tutorData = mockTutors.find(t => t.id === tutorId);
    setTutor(tutorData);
  };
};
```

**Deep Logic:**
- Uses `tutorId` from route params
- Calls API to get complete tutor data
- Updates local state with fetched data

## 2. Profile → Chat Flow

### Step 1: TutorProfileScreen → ChatScreen
```javascript
// TutorProfileScreen.js
const handleStartChat = () => {
  navigation.navigate('Chat', {
    tutorId: tutor.id,
    tutorName: tutor.name,
  });
};
```

**Deep Logic:**
- Passes tutor data from current screen
- ChatScreen will use `tutorId` for API calls
- `tutorName` used for header display

### Step 2: ChatScreen Loads Messages
```javascript
// ChatScreen.js
const ChatScreen = ({ navigation, route }) => {
  const { tutorId, tutorName } = route.params;
  
  const loadMessages = async () => {
    // TODO: API call - Fetch chat messages for specific tutor
    // GET /api/chats/{tutorId}/messages/
    const chatMessages = mockMessages.filter(msg => msg.tutorId === tutorId);
    setMessages(chatMessages);
  };
};
```

**Deep Logic:**
- Extracts `tutorId` and `tutorName` from route params
- Filters messages by `tutorId`
- Sets up real-time message updates

## 3. Like/Favorite Flow

### Step 1: Like Action from TutorListScreen
```javascript
// TutorListScreen.js
const handleLikeTutor = async (tutorId) => {
  try {
    // TODO: API call - Like/favorite a tutor
    // POST /api/tutors/{tutorId}/like/
    console.log('Liked tutor:', tutorId);
    Alert.alert('Thành công', 'Đã thêm vào danh sách yêu thích!');
  } catch (error) {
    Alert.alert('Lỗi', 'Không thể thêm vào yêu thích');
  }
};
```

### Step 2: Like Action from TutorProfileScreen
```javascript
// TutorProfileScreen.js
const handleLikeTutor = async () => {
  try {
    // TODO: API call - Like/favorite tutor from profile
    // POST /api/tutors/{tutorId}/like/
    Alert.alert('Thành công', 'Đã thêm vào danh sách yêu thích!');
  } catch (error) {
    Alert.alert('Lỗi', 'Không thể thêm vào yêu thích');
  }
};
```

**Deep Logic:**
- Same API endpoint called from different screens
- Should update UI optimistically
- Should sync with SavedScreen

### Step 3: SavedScreen Shows Favorites
```javascript
// SavedScreen.js
const loadSavedTutors = async () => {
  try {
    // TODO: API call - Fetch user's saved tutors
    // GET /api/users/saved-tutors/
    const saved = mockTutors.filter(tutor => tutor.isSaved);
    setSavedTutors(saved);
  } catch (error) {
    console.error('Error loading saved tutors:', error);
  }
};
```

**Deep Logic:**
- Loads only tutors that user has liked
- Should refresh when returning from other screens
- Could implement pull-to-refresh

## 4. Chat Room → Chat Flow

### Step 1: MessagesScreen Shows Chat Rooms
```javascript
// MessagesScreen.js
const loadChatRooms = async () => {
  try {
    // TODO: API call - Fetch user's chat rooms
    // GET /api/chats/
    setChatRooms(mockChatRooms);
  } catch (error) {
    console.error('Error loading chat rooms:', error);
  }
};
```

### Step 2: Open Chat from Chat Room
```javascript
// MessagesScreen.js
const openChat = (chatRoom) => {
  navigation.navigate('Chat', {
    tutorId: chatRoom.tutorId,
    tutorName: chatRoom.tutorName,
  });
};
```

**Deep Logic:**
- Chat rooms list shows all conversations
- Each chat room contains tutor information
- Navigation passes tutor data to ChatScreen

## 5. Authentication Flow

### Step 1: LoginScreen Authentication
```javascript
// LoginScreen.js
const handleLogin = async () => {
  setLoading(true);
  try {
    // TODO: API call - Implement Supabase authentication
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainApp');
    }, 1000);
  } catch (error) {
    setLoading(false);
    Alert.alert('Lỗi', 'Đăng nhập thất bại');
  }
};
```

**Deep Logic:**
- Uses `navigation.replace()` to prevent going back
- Should store authentication token
- Should validate user credentials

### Step 2: RegisterScreen User Creation
```javascript
// RegisterScreen.js
const handleRegister = async () => {
  try {
    // TODO: API call - Implement user registration with Supabase
    // 1. Create user account with Supabase Auth
    // 2. Store additional user profile data
    // 3. Handle different user types (student/tutor)
    Alert.alert('Thành công', 'Đăng ký thành công!', [
      { text: 'OK', onPress: () => navigation.replace('MainApp') }
    ]);
  } catch (error) {
    Alert.alert('Lỗi', 'Đăng ký thất bại');
  }
};
```

**Deep Logic:**
- Collects extensive user data
- Different flows for student vs tutor
- Should validate all required fields

## 6. Profile Management Flow

### Step 1: ProfileScreen Data Loading
```javascript
// ProfileScreen.js
// TODO: API call - Fetch user profile data
// GET /api/users/profile/
const [userProfile] = useState({
  name: 'Nguyễn Văn B',
  email: 'student@example.com',
  phone: '0123456789',
  school: 'THPT Nguyễn Huệ',
  grade: '12A1',
  userType: 'student',
  goals: ['Thi THPTQG', 'Toán', 'Lý']
});
```

### Step 2: Profile Actions
```javascript
// ProfileScreen.js
const handleLogout = () => {
  // TODO: API call - Implement proper logout
  // 1. Clear Supabase session
  // 2. Clear local storage/cache
  // 3. Reset navigation to Login screen
  navigation.reset({
    index: 0,
    routes: [{ name: 'Login' }],
  });
};
```

**Deep Logic:**
- Uses `navigation.reset()` to clear entire stack
- Should clear all stored data
- Should invalidate authentication tokens

## Data Flow Patterns

### 1. Route Parameter Passing
```javascript
// Sending data
navigation.navigate('ScreenName', { 
  key1: value1, 
  key2: value2 
});

// Receiving data
const { key1, key2 } = route.params;
```

### 2. API Call Chains
```javascript
// Chain 1: Search → List → Profile
SearchScreen (filters) → TutorListScreen (API call) → TutorProfileScreen (API call)

// Chain 2: Profile → Chat
TutorProfileScreen (tutorId) → ChatScreen (API call with tutorId)

// Chain 3: Like → Saved
TutorListScreen (like API) → SavedScreen (refresh favorites)
```

### 3. State Management
```javascript
// Local state for UI
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);

// Route params for navigation
const { id, name } = route.params;

// Global state needed (Context/Redux)
const [user, setUser] = useState(null);
const [authToken, setAuthToken] = useState(null);
```

## Error Handling Patterns

### 1. API Error Handling
```javascript
try {
  const response = await apiCall();
  setData(response.data);
} catch (error) {
  Alert.alert('Lỗi', 'Không thể tải dữ liệu');
  console.error('API Error:', error);
}
```

### 2. Navigation Error Handling
```javascript
const handleNavigation = (screenName, params) => {
  if (!params.requiredField) {
    Alert.alert('Lỗi', 'Thiếu thông tin cần thiết');
    return;
  }
  navigation.navigate(screenName, params);
};
```

### 3. Loading State Management
```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await apiCall();
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

## Performance Optimizations

### 1. Debouncing Search
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);
```

### 2. Caching Tutor Data
```javascript
const [tutorCache, setTutorCache] = useState({});

const fetchTutor = async (tutorId) => {
  if (tutorCache[tutorId]) {
    return tutorCache[tutorId];
  }
  
  const tutorData = await apiCall(tutorId);
  setTutorCache(prev => ({ ...prev, [tutorId]: tutorData }));
  return tutorData;
};
```

### 3. Optimistic Updates
```javascript
const handleLike = async (tutorId) => {
  // Optimistic update
  setTutors(prev => prev.map(t => 
    t.id === tutorId ? { ...t, isLiked: true } : t
  ));
  
  try {
    await likeAPI(tutorId);
  } catch (error) {
    // Revert optimistic update
    setTutors(prev => prev.map(t => 
      t.id === tutorId ? { ...t, isLiked: false } : t
    ));
  }
};
``` 