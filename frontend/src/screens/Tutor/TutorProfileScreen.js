import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { mockTutors } from '../../data/mockData';

const TutorProfileScreen = ({ navigation, route }) => {
  const { tutorId } = route.params;
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorProfile();
  }, [tutorId]);

  const fetchTutorProfile = async () => {
    try {
      // TODO: API call - Fetch detailed tutor profile
      // GET /api/tutors/{tutorId}/
      // Return complete tutor information:
      // - name, avatar, rating, experience
      // - school, major, graduation
      // - achievements, bio, subjects, price
      // Replace mockTutors.find with actual API call
      const tutorData = mockTutors.find(t => t.id === tutorId);
      setTutor(tutorData);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin gia sư');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    navigation.navigate('Chat', {
      tutorId: tutor.id,
      tutorName: tutor.name,
    });
  };

  const handleLikeTutor = async () => {
    try {
      // TODO: API call - Like/favorite tutor from profile
      // POST /api/tutors/{tutorId}/like/
      // Add tutor to user's saved list
      // Handle success/error responses
      Alert.alert('Thành công', 'Đã thêm vào danh sách yêu thích!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm vào yêu thích');
    }
  };

  if (loading || !tutor) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

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
            <Text style={styles.avatarText}>{tutor.avatar}</Text>
          </View>
          <Text style={styles.tutorName}>{tutor.name}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#fbbf24" />
            <Text style={styles.ratingText}>
              ({tutor.rating}) • {tutor.experience}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Education Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="school" size={20} color="#2563eb" />
            <Text style={styles.sectionTitle}>Giáo dục</Text>
          </View>
          <Text style={styles.schoolText}>{tutor.school}</Text>
          <Text style={styles.detailText}>Chuyên ngành: {tutor.major}</Text>
          <Text style={styles.detailText}>Tốt nghiệp: {tutor.graduation}</Text>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="emoji-events" size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Thành tích</Text>
          </View>
          {tutor.achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giới thiệu</Text>
          <Text style={styles.bioText}>{tutor.bio}</Text>
        </View>

        {/* Subjects and Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Môn học & Giá</Text>
          <View style={styles.subjectsContainer}>
            {tutor.subjects.map((subject, index) => (
              <View key={index} style={styles.subjectTag}>
                <Text style={styles.subjectText}>{subject}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.priceText}>{tutor.price}</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleStartChat}
        >
          <Text style={styles.chatButtonText}>Nhắn tin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={handleLikeTutor}
        >
          <Icon name="favorite" size={16} color="white" />
          <Text style={styles.likeButtonText}>Yêu thích</Text>
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