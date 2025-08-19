

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import TutorCard from '../../components/TutorCard';
import apiService from '../../config/api';
import { useTranslation } from '../../hooks/useTranslation';

const SavedScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [savedTutors, setSavedTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedTutors();
  }, []);

  const loadSavedTutors = async () => {
    try {
      // GET /api/users/saved-tutors/
      const data = await apiService.getSavedTutors();
      setSavedTutors(data); // Expecting array of tutor objects
    } catch (error) {
      console.error('Error loading saved tutors:', error);
      setSavedTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (tutorId) => {
    navigation.navigate('TutorProfile', { tutorId });
  };

  const handleStartChat = (tutorId) => {
    navigation.navigate('Chat', { tutorId });
  };

  const renderTutorItem = ({ item }) => (
    <TutorCard
      tutor={item}
      onViewProfile={() => handleViewProfile(item.id || item.uuid)}
      onLike={() => handleStartChat(item.id || item.uuid)}
      likeButtonText={t('saved.messageButton', 'Message')}
      likeButtonColor="#10b981"
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('saved.header', 'Saved Tutors')}</Text>
      </View>
      {/* List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : savedTutors.length > 0 ? (
        <FlatList
          data={savedTutors}
          renderItem={renderTutorItem}
          keyExtractor={(item) => (item.id || item.uuid).toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('saved.empty', 'No tutors have been saved yet')}</Text>
          <Text style={styles.emptySubtext}>
            {t('saved.emptySubtext', 'Add tutors to your favorites list to see them here')}
          </Text>
        </View>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SavedScreen;
