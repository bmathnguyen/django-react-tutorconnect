import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const TinderView = ({ tutors, currentIndex, onSwipe, onViewProfile }) => {
  if (!tutors || tutors.length === 0 || currentIndex >= tutors.length) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Không có gia sư nào</Text>
      </View>
    );
  }

  const currentTutor = tutors[currentIndex];

  const handleSwipe = (direction) => {
    onSwipe(direction, currentTutor.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {/* Profile Card */}
        <View style={styles.card}>
          {/* Header with gradient background */}
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{currentTutor.avatar}</Text>
            </View>
          </View>
          
          {/* Info Section */}
          <View style={styles.cardInfo}>
            <View style={styles.nameSection}>
              <Text style={styles.tutorName}>{currentTutor.name}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#fbbf24" />
                <Text style={styles.ratingText}>
                  ({currentTutor.rating}) • {currentTutor.experience}
                </Text>
              </View>
            </View>
            
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Icon name="school" size={16} color="#6b7280" />
                <Text style={styles.detailText}>{currentTutor.school}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Icon name="emoji-events" size={16} color="#f59e0b" />
                <Text style={styles.detailText}>{currentTutor.achievements[0]}</Text>
              </View>
              
              <View style={styles.subjectPrice}>
                <View style={styles.subjects}>
                  {currentTutor.subjects.map((subject, index) => (
                    <View key={index} style={styles.subjectTag}>
                      <Text style={styles.subjectText}>{subject}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.price}>{currentTutor.price}</Text>
              </View>
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.passButton}
                onPress={() => handleSwipe('left')}
              >
                <Icon name="close" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => onViewProfile(currentTutor.id)}
              >
                <Icon name="person" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => handleSwipe('right')}
              >
                <Icon name="favorite" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: width - 32,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    height: '33%',
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
  },
  cardInfo: {
    flex: 1,
    padding: 16,
  },
  nameSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tutorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  details: {
    flex: 1,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  subjectPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  subjects: {
    flexDirection: 'row',
    gap: 6,
  },
  subjectTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 10,
    color: '#1d4ed8',
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  passButton: {
    width: 48,
    height: 48,
    backgroundColor: '#ef4444',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 48,
    height: 48,
    backgroundColor: '#2563eb',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    width: 48,
    height: 48,
    backgroundColor: '#10b981',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TinderView;