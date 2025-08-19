import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import apiService from '../../config/api';

const TutorProfileScreen = ({ navigation, route }) => {
  const { tutorId } = route.params; // This should always be uuid
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorProfile();
  }, [tutorId]);

  const fetchTutorProfile = async () => {
    setLoading(true);
    try {
      // GET /api/tutors/{tutorId}/
      const data = await apiService.getTutorDetail(tutorId);
      setTutor(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to load tutor profile');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    try {
      // Create or get existing chat room
      const chatRoom = await apiService.createChatRoom(tutor.uuid);
      
      navigation.navigate('Chat', {
        roomId: chatRoom.id,
        tutorId: tutor.uuid,
        tutorName: tutor.name || `${tutor.first_name} ${tutor.last_name}`,
      });
    } catch (error) {
      console.error('Failed to create chat room:', error);
      // Navigate anyway - let Chat screen handle the error
      navigation.navigate('Chat', {
        tutorId: tutor.id || tutor.uuid,
        tutorName: tutor.name || `${tutor.first_name} ${tutor.last_name}`,
      });
    }
  };

  const handleLikeTutor = async () => {
    try {
      await apiService.likeTutor(tutor.uuid);
      Alert.alert('Success', 'Added to favorites!');
    } catch (error) {
      Alert.alert('Error', 'Unable to add to favorites');
    }
  };

  if (loading || !tutor) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  // Map UI variables directly from API response
  const avatarEmoji = tutor.avatar || '👨‍🏫';
  const tutorName = tutor.user ? `${tutor.user.first_name} ${tutor.user.last_name}` : '';
  const education = tutor.education || 'Not updated';
  const bio = tutor.bio || 'Not updated';
  const achievements = tutor.achievements && tutor.achievements.length > 0 ? tutor.achievements : ['Not updated'];
  const subjects = tutor.subjects && tutor.subjects.length > 0
    ? tutor.subjects.map(s => `${s.name} (${s.level})`)
    : ['Not updated'];
  const price = tutor.price_min && tutor.price_max
    ? `${Number(tutor.price_min).toLocaleString()} - ${Number(tutor.price_max).toLocaleString()} SGD/hour`
    : 'Contact';
  const rating = tutor.rating_average || 'Not updated';

  // DEBUG: Log tutor object to verify data
  console.log('Tutor object:', tutor);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.phoneButton}>
            <Icon name="phone" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarEmoji}</Text>
          </View>
          <Text style={styles.tutorName}>{tutorName}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#fbbf24" />
            <Text style={styles.ratingText}>
              {rating !== 'Not updated' ? `(${rating})` : 'Not updated'}
            </Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Education Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="school" size={20} color="#2563eb" />
            <Text style={styles.sectionTitle}>Education</Text>
          </View>
          <Text style={styles.schoolText}>{education}</Text>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="emoji-events" size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          {(achievements.length > 0 ? achievements : ['Not updated']).map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bioText}>{bio}</Text>
        </View>

        {/* Subjects and Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subjects & Price</Text>
          <View style={styles.subjectsContainer}>
            {subjects.map((subject, index) => (
              <View key={index} style={styles.subjectTag}>
                <Text style={styles.subjectText}>{subject}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.priceText}>{price}</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleStartChat}
        >
          <Text style={styles.chatButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={handleLikeTutor}
        >
          <Icon name="favorite" size={16} color="white" />
          <Text style={styles.likeButtonText}>Save Tutor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  phoneButton: {
    padding: 4,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: 'white',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  tutorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  schoolText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  achievementCard: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
    marginBottom: 8,
  },
  achievementText: {
    color: '#374151',
    fontSize: 14,
  },
  bioText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  subjectTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  likeButton: {
    flex: 1,
    backgroundColor: '#ec4899',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  likeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TutorProfileScreen;