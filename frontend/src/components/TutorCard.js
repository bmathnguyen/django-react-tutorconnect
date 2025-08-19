import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../hooks/useTranslation';

const TutorCard = ({ tutor, onViewProfile, onLike }) => {
  const { t, formatPrice } = useTranslation();

  // Handle undefined tutor
  if (!tutor) {
    return null;
  }

  // Extract tutor data with fallbacks for different API response formats
  const tutorId = tutor.id || tutor.uuid;
  const tutorName = tutor.name || 
                   (tutor.user ? `${tutor.user.first_name} ${tutor.user.last_name}` : '') ||
                   `${tutor.first_name || ''} ${tutor.last_name || ''}`.trim() ||
                   'Tutor';
  
  const avatar = tutor.avatar || tutor.profile_image || '👨‍🏫';
  const rating = tutor.rating || tutor.rating_average || '5.0';
  const experience = tutor.experience || tutor.experience_years || 'Experience';
  const school = tutor.school || tutor.education || tutor.university || 'School';
  const achievements = tutor.achievements || [];
  const subjects = tutor.subjects || [];
  const price = tutor.price || tutor.hourly_rate || tutor.price_min || 'Contact';

  // Format price with fallback
  const formattedPrice = (() => {
    if (price && price > 0) {
      return formatPrice(price, 'session');
    }
    return t('currency.contact', 'Contact');
  })();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{avatar}</Text>
        </View>
        
        <View style={styles.info}>
          <View style={styles.nameRating}>
            <Text style={styles.name}>{tutorName}</Text>
            <View style={styles.rating}>
              <Icon name="star" size={16} color="#fbbf24" />
              <Text style={styles.ratingText}>({rating})</Text>
            </View>
          </View>
          
          <Text style={styles.experience}>{experience}</Text>
          
          <View style={styles.detail}>
            <Icon name="school" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{school}</Text>
          </View>
          
          {achievements.length > 0 && (
            <View style={styles.detail}>
              <Icon name="emoji-events" size={14} color="#f59e0b" />
              <Text style={styles.detailText}>{achievements[0].title || achievements[0]}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.subjects}>
          {subjects.slice(0, 3).map((subject, index) => {
            const subjectName = typeof subject === 'string' ? subject : subject.name || subject.title;
            return (
              <View key={index} style={styles.subjectTag}>
                <Text style={styles.subjectText}>{subjectName}</Text>
              </View>
            );
          })}
          {subjects.length > 3 && (
            <View style={styles.subjectTag}>
              <Text style={styles.subjectText}>+{subjects.length - 3}</Text>
            </View>
          )}
        </View>
        <Text style={styles.price}>{formattedPrice}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => onViewProfile && onViewProfile(tutorId)}
        >
          <Text style={styles.viewButtonText}>{t('tutor.viewProfile', 'View Profile')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => onLike && onLike(tutorId)}
        >
          <Icon name="favorite" size={16} color="white" />
          <Text style={styles.likeButtonText}>{t('tutor.like', 'Like')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  nameRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  experience: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  likeButton: {
    flex: 1,
    backgroundColor: '#ec4899',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  likeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TutorCard;