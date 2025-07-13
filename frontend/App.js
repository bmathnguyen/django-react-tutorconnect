import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import your screen components
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import SearchScreen from './src/screens/Home/SearchScreen';
import TutorListScreen from './src/screens/Home/TutorListScreen';
import TutorProfileScreen from './src/screens/Tutor/TutorProfileScreen';
import ChatScreen from './src/screens/Chat/ChatScreen';
import MessagesScreen from './src/screens/Chat/MessagesScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import SavedScreen from './src/screens/Saved/SavedScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator (Main App)
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        
        if (route.name === 'Search') {
          iconName = 'home';
        } else if (route.name === 'Saved') {
          iconName = 'bookmark';
        } else if (route.name === 'TutorList') {
          iconName = 'favorite';
        } else if (route.name === 'Messages') {
          iconName = 'message';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        }
        
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Search" 
      component={SearchScreen}
      options={{ tabBarLabel: 'Trang chủ' }}
    />
    <Tab.Screen
      name="Saved"
      component={SavedScreen}
      options={{ tabBarLabel: 'Đã lưu' }}
    />
    <Tab.Screen 
      name="TutorList" 
      component={TutorListScreen}
      options={{ tabBarLabel: 'Tinder' }}
    />
    <Tab.Screen 
      name="Messages" 
      component={MessagesScreen}
      options={{ tabBarLabel: 'Tin nhắn' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ tabBarLabel: 'Hồ sơ' }}
    />
  </Tab.Navigator>
);

// Main Stack Navigator
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" // name = "Login" part of the initial screen
        screenOptions={{ headerShown: false }}
      >
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Main App with Bottom Tabs */}
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
        
        {/* Modal/Overlay Screens */}
        <Stack.Screen 
          name="TutorProfile" 
          component={TutorProfileScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Chat',
            headerBackTitle: 'Quay lại'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;