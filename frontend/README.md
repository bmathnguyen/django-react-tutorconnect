# TutorConnect Frontend (React Native + Expo)

## Overview
This is the mobile frontend for TutorConnect, built with React Native using Expo. It is organized for scalability and maintainability, with screens and components split by feature.

## Folder Structure
```
frontend/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── Home/
│   │   │   ├── SearchScreen.js
│   │   │   ├── TutorListScreen.js
│   │   │   └── TinderViewScreen.js
│   │   ├── Tutor/
│   │   │   └── TutorProfileScreen.js
│   │   ├── Chat/
│   │   │   ├── MessagesScreen.js
│   │   │   └── ChatRoomScreen.js
│   │   ├── Saved/
│   │   │   └── SavedTutorsScreen.js
│   │   └── Profile/
│   │       └── ProfileScreen.js
│   ├── components/
│   ├── services/
│   └── utils/
├── App.js
├── package.json
└── ...
```

## Navigation
- Uses React Navigation (Stack + Bottom Tabs)
- Main tabs: Home, Saved, Tinder, Messages, Profile
- Stack navigation for login/register and detail screens

## Getting Started
1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the Expo app:
   ```sh
   npm start
   ```
   or for web:
   ```sh
   npm run web
   ```
3. Open in Expo Go (mobile) or browser (web)

## Next Steps
- Implement each screen using the provided structure
- Split UI into components in `src/components/`
- Add API calls in `src/services/` 