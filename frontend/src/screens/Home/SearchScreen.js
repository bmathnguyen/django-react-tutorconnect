// SearchScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import apiService from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';

const SearchScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { t, formatPrice } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({
    goal: 'JC Exam',
    location: 'Online',
    district: 'All',
    subject: null,
    priceRange: 50, // SGD value
  });

  // Load subjects from backend on component mount
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const subjectsData = await apiService.getSubjects();
      setSubjects(subjectsData || []);
    } catch (error) {
      console.error('Failed to load subjects:', error);
      // Set default subjects if API call fails
      setSubjects([
        { name: t('subjects.math', 'Mathematics'), code: 'toan' },
        { name: t('subjects.physics', 'Physics'), code: 'ly' },
        { name: t('subjects.chemistry', 'Chemistry'), code: 'hoa' },
        { name: t('subjects.biology', 'Biology'), code: 'sinh' },
        { name: t('subjects.literature', 'Literature'), code: 'van' },
        { name: t('subjects.english', 'English'), code: 'anh' },
        { name: t('subjects.history', 'History'), code: 'su' },
        { name: t('subjects.geography', 'Geography'), code: 'dia' },
      ]);
    }
  };

  // Helper function to update filters
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Map frontend filters to backend API parameters
  const mapFiltersToBackend = (frontendFilters) => {
    const backendParams = {};

    // Map subject
    if (frontendFilters.subject && frontendFilters.subject !== 'All') {
      backendParams.subjects = frontendFilters.subject;
    }

    // Map location
    if (frontendFilters.location === 'Online') {
      backendParams.location_type = 'online';
    } else {
      backendParams.location_type = 'offline';
      // Map district to city
      if (frontendFilters.district !== 'All') {
        const districtToCityMap = {
          'Quận 1': 'hochiminh',
          'Quận 2': 'hochiminh',
          'Quận 3': 'hochiminh',
          'Quận 4': 'hochiminh',
          'Quận 5': 'hochiminh',
          'Quận 6': 'hochiminh',
          'Quận 7': 'hochiminh',
          'Quận 8': 'hochiminh',
          'Quận 9': 'hochiminh',
          'Quận 10': 'hochiminh',
          'Quận 11': 'hochiminh',
          'Quận 12': 'hochiminh',
        };
        backendParams.city = districtToCityMap[frontendFilters.district] || 'hanoi';
      } else {
        backendParams.city = 'hanoi'; // Default city
      }
    }

    // Map price range (SGD to backend - assuming backend expects SGD)
    if (frontendFilters.priceRange) {
      backendParams.max_price = frontendFilters.priceRange;
    }

    return backendParams;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Map frontend filters to backend parameters
      const searchParams = mapFiltersToBackend(filters);
      
      console.log('Frontend filters:', filters);
      console.log('Mapped search parameters:', searchParams);
      
      // Call the search API
      const results = await apiService.searchTutors(searchParams);
      
      console.log('Search API response:', results);
      console.log('Results type:', typeof results);
      console.log('Results.results:', results?.results);
      
      // Navigate to results with the search data
      navigation.navigate('TutorList', { 
        filters: searchParams,
        searchResults: results,
        searchPerformed: true
      });
      
    } catch (error) {
      console.error('Search error details:', error);
      console.error('Error message:', error.message);
      Alert.alert(t('common.error', 'Error'), `${t('search.searchFailed', 'Unable to search for tutors. Please try again.')}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('search.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>{t('search.filters')}</Text>

          {/* First Row */}
          <View style={styles.filterRow}>
            <View style={styles.filterHalf}>
              <Text style={styles.filterLabel}>{t('search.goal')}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.goal}
                  onValueChange={(value) => updateFilter('goal', value)}
                  style={styles.picker}
                >
                  <Picker.Item label={t('goals.highSchoolExam')} value="JC Exam" />
                  <Picker.Item label={t('goals.specializedExam')} value="O Level Exam" />
                  <Picker.Item label={t('goals.supplementaryLearning')} value="Supplementary Learning" />
                </Picker>
              </View>
            </View>

            <View style={styles.filterHalf}>
              <Text style={styles.filterLabel}>{t('search.location')}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.location}
                  onValueChange={(value) => updateFilter('location', value)}
                  style={styles.picker}
                >
                  <Picker.Item label={t('search.online')} value="Online" />
                  <Picker.Item label={t('search.offline')} value="Offline" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.filterRow}>
            <View style={styles.filterHalf}>
              <Text style={styles.filterLabel}>{t('search.district')}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.district}
                  onValueChange={(value) => updateFilter('district', value)}
                  style={styles.picker}
                >
                  <Picker.Item label={t('search.allDistricts')} value="All" />
                  {[
                  { label: 'One North', value: 'One North' },
                  { label: 'Kent Ridge', value: 'Kent Ridge' },
                  { label: 'Buona Vista', value: 'Buona Vista' },
                  { label: 'Dover', value: 'Dover' },
                  { label: 'Clementi', value: 'Clementi' },
                  { label: 'Jurong East', value: 'Jurong East' },
                  { label: 'Redhill', value: 'Redhill' },
                  { label: 'Tiong Bahru', value: 'Tiong Bahru' },
                  { label: 'Queenstown', value: 'Queenstown' },
                  { label: 'HarbourFront', value: 'HarbourFront' },
                  { label: 'Dhoby Ghaut', value: 'Dhoby Ghaut' },
                  { label: 'Paya Lebar', value: 'Paya Lebar' },
                  { label: 'Serangoon', value: 'Serangoon' },
                  { label: 'Woodlands', value: 'Woodlands' },
                ].map((district) => (
                  <Picker.Item key={district.value} label={district.label} value={district.value} />
                ))}
                </Picker>
              </View>
            </View>

            <View style={styles.filterFull}>
              <Text style={styles.filterLabel}>{t('search.subject')}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.subject}
                  onValueChange={(value) => updateFilter('subject', value)}
                  style={styles.picker}
                >
                  <Picker.Item label={t('search.allSubjects')} value="All" />
                  {subjects.map((subject) => (
                    <Picker.Item 
                      key={subject.code || subject.name} 
                      label={subject.name} 
                      value={subject.name} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.priceContainer}>
            <Text style={styles.filterLabel}>
              {t('search.priceRange')} {formatPrice(filters.priceRange, 'session')}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={30}
              maximumValue={200}
              step={10}
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              minimumTrackTintColor="#2563eb"
              maximumTrackTintColor="#d1d5db"
              thumbStyle={styles.sliderThumb}
            />
            <View style={styles.priceLabels}>
              <Text style={styles.priceLabel}>S$30</Text>
              <Text style={styles.priceLabel}>S$200</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.searchButton, loading && styles.searchButtonDisabled]} 
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.searchButtonText}>  {t('search.searching')}</Text>
              </View>
            ) : (
              <Text style={styles.searchButtonText}>{t('common.search')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingVertical: 24,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  filterContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  filterHalf: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  priceContainer: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 8,
  },
  sliderThumb: {
    backgroundColor: '#2563eb',
    width: 20,
    height: 20,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  searchButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  searchButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchScreen;