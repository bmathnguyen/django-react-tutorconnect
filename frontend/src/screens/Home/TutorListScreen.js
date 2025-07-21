// TutorListScreen.js

import apiService from '../../config/api'; // <-- Add this import!

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TutorCard from '../../components/TutorCard';
import TinderView from '../../components/TinderView';
// import { mockTutors } from '../../data/mockData';

const TutorListScreen = ({ navigation, route }) => {
  const [viewMode, setViewMode] = useState('list');
  // const [tutors, setTutors] = useState(mockTutors);
  const [tutors, setTutors] = useState([]);
  const [currentTutorIndex, setCurrentTutorIndex] = useState(0);
  const filters = route.params?.filters || {};

  // useEffect(() => {
  //   // TODO: API call - Fetch tutors based on search filters
  //   // GET /api/tutors/?filters={filters}
  //   // Apply filters from SearchScreen and return matching tutors
  //   // Replace mockTutors with actual API response
  //   // In real app: fetchTutors(filters)
  //   console.log('Applied filters:', filters);
  // }, [filters]);

  // NEW CODE:
  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        // Map your price filter to something your backend expects, e.g. min_price/max_price if needed
        const params = {
          ...filters,
          price: filters.priceRange, // or adapt as needed
        };
        const data = await apiService.getTutors(params);
        setTutors(data); // assuming the backend returns a list of tutor objects
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải danh sách gia sư');
      }
      setLoading(false);
    };
    fetchTutors();
  }, [filters]);


  const handleLikeTutor = async (tutorId) => {
    try {
      // TODO: API call - Like/favorite a tutor
      // POST /api/tutors/{tutorId}/like/
      // Add tutor to user's saved/favorites list
      // Handle success/error responses
      console.log('Liked tutor:', tutorId);
      Alert.alert('Thành công', 'Đã thêm vào danh sách yêu thích!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm vào yêu thích');
    }
  };

  const handleViewProfile = (tutorId) => {
    const tutor = tutors.find(t => t.id === tutorId);
    navigation.navigate('TutorProfile', { 
      tutorId, 
      tutorName: tutor?.name 
    });
  };

  const handleSwipe = (direction, tutorId) => {
    if (direction === 'right') {
      handleLikeTutor(tutorId);
    }
    
    // Move to next tutor
    if (currentTutorIndex < tutors.length - 1) {
      setCurrentTutorIndex(currentTutorIndex + 1);
    } else {
      setCurrentTutorIndex(0);
    }
  };
  
  const renderTutorItem = ({ item }) => (
    <TutorCard
      tutor={item}
      onViewProfile={() => handleViewProfile(item.id)}
      onLike={() => handleLikeTutor(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách gia sư</Text>
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'list' && styles.viewModeButtonActive
            ]}
            onPress={() => setViewMode('list')}
          >
            <Icon name="list" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              styles.tinderButton,
              viewMode === 'tinder' && styles.tinderButtonActive
            ]}
            onPress={() => setViewMode('tinder')}
          >
            <Icon name="favorite" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {viewMode === 'list' ? (
        <FlatList
          data={tutors}
          renderItem={renderTutorItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <TinderView
          tutors={tutors}
          currentIndex={currentTutorIndex}
          onSwipe={handleSwipe}
          onViewProfile={handleViewProfile}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  viewModeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  viewModeButton: {
    backgroundColor: '#1d4ed8',
    padding: 8,
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: '#1e40af',
  },
  tinderButton: {
    backgroundColor: '#ec4899',
  },
  tinderButtonActive: {
    backgroundColor: '#db2777',
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
});

export default TutorListScreen;