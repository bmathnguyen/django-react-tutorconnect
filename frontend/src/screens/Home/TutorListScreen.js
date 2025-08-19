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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TutorCard from '../../components/TutorCard';
import TinderView from '../../components/TinderView';
// import { mockTutors } from '../../data/mockData';

const TutorListScreen = ({ navigation, route }) => {
  const [viewMode, setViewMode] = useState('list');
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTutorIndex, setCurrentTutorIndex] = useState(0);
  
  const filters = route.params?.filters || {};
  const searchResults = route.params?.searchResults;
  const searchPerformed = route.params?.searchPerformed || false;

  useEffect(() => {
    if (searchPerformed && searchResults) {
      // Use search results from SearchScreen
      const tutorData = searchResults.results || searchResults;
      setTutors(Array.isArray(tutorData) ? tutorData : []);
      setLoading(false); // Ensure loading spinner stops
    } else {
      // Fetch tutors if no search results provided
      fetchTutors();
    }
  }, [filters, searchResults, searchPerformed]);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const data = await apiService.searchTutors(filters);
      const tutorData = data.results || data;
      setTutors(Array.isArray(tutorData) ? tutorData : []);
      console.log('Fetched tutors:', tutorData);
    } catch (error) {
      console.error('Failed to fetch tutors:', error);
      setTutors([]); // Set empty array on error
      Alert.alert('Lỗi', 'Không thể tải danh sách gia sư');
    } finally {
      setLoading(false);
    }
  };


  const handleLikeTutor = async (tutorId) => {
    try {
      await apiService.likeTutor(tutorId);
      Alert.alert('Thành công', 'Đã thêm vào danh sách yêu thích!');
    } catch (error) {
      console.error('Failed to like tutor:', error);
      Alert.alert('Lỗi', 'Không thể thêm vào yêu thích');
    }
  };

  const handleViewProfile = (tutorUuid) => {
    const tutor = tutors.find(t => t.uuid === tutorUuid);
    const tutorName = tutor?.name || 
                     (tutor?.user ? `${tutor.user.first_name} ${tutor.user.last_name}` : '') ||
                     `${tutor?.first_name || ''} ${tutor?.last_name || ''}`.trim();
    
    navigation.navigate('TutorProfile', { 
      tutorId: tutorUuid, 
      tutorName: tutorName
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
  
  const renderTutorItem = ({ item }) => {
    if (!item) return null;
    
    const tutorUuid = item.uuid;
    return (
      <TutorCard
        tutor={item}
        onViewProfile={() => handleViewProfile(tutorUuid)}
        onLike={() => handleLikeTutor(tutorUuid)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tutor List</Text>
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading tutors...</Text>
        </View>
      ) : viewMode === 'list' ? (
        <FlatList
          data={tutors}
          renderItem={renderTutorItem}
          keyExtractor={(item) => (item.uuid || Math.random()).toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tutors found</Text>
            </View>
          }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default TutorListScreen;