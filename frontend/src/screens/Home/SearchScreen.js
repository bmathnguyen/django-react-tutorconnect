// SearchScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

const SearchScreen = ({ navigation }) => {
  const [filters, setFilters] = useState({
    goal: 'Thi THPTQG',
    location: 'Online',
    district: 'Tất cả',
    subject: 'Toán',
    priceRange: 400,
  });

  // Helper function to update filters
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    // TODO: API call - Implement tutor search with filters
    // POST /api/tutors/search/ with filters:
    // - goal (Thi THPTQG, Thi chuyên, Học bổ trợ)
    // - location (Online/Offline)
    // - district (Quận 1-12)
    // - subject (Toán, Lý, Hóa, etc.)
    // - priceRange (100k-1000k)
    // Return filtered list of tutors matching criteria
    // Here you would typically make an API call to fetch tutors based on the selected filters
    // For this example, we'll just navigate to the TutorList screen with the filters
    navigation.navigate('TutorList', { filters });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm gia sư</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Bộ lọc</Text>

          {/* First Row */}
          <View style={styles.filterRow}>
            <View style={styles.filterHalf}>
              <Text style={styles.filterLabel}>Mục tiêu:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.goal}
                  onValueChange={(value) => updateFilter('goal', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Thi THPTQG" value="Thi THPTQG" />
                  <Picker.Item label="Thi chuyên" value="Thi chuyên" />
                  <Picker.Item label="Học bổ trợ" value="Học bổ trợ" />
                </Picker>
              </View>
            </View>

            <View style={styles.filterHalf}>
              <Text style={styles.filterLabel}>Vị trí:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.location}
                  onValueChange={(value) => updateFilter('location', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Online" value="Online" />
                  <Picker.Item label="Offline" value="Offline" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.filterRow}>
            <View style={styles.filterHalf}>
              <Text style={styles.filterLabel}>Quận/Huyện:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.district}
                  onValueChange={(value) => updateFilter('district', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Tất cả" value="Tất cả" />
                  <Picker.Item label="Quận 1" value="Quận 1" />
                  <Picker.Item label="Quận 2" value="Quận 2" />
                  <Picker.Item label="Quận 3" value="Quận 3" />
                  <Picker.Item label="Quận 4" value="Quận 4" />
                  <Picker.Item label="Quận 5" value="Quận 5" />
                  <Picker.Item label="Quận 6" value="Quận 6" />
                  <Picker.Item label="Quận 7" value="Quận 7" />
                  <Picker.Item label="Quận 8" value="Quận 8" />
                  <Picker.Item label="Quận 9" value="Quận 9" />
                  <Picker.Item label="Quận 10" value="Quận 10" />
                  <Picker.Item label="Quận 11" value="Quận 11" />
                  <Picker.Item label="Quận 12" value="Quận 12" />
                </Picker>
              </View>
            </View>

            <View style={styles.filterHalf}>
              <Text style={styles.filterLabel}>Môn học:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.subject}
                  onValueChange={(value) => updateFilter('subject', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Toán" value="Toán" />
                  <Picker.Item label="Lý" value="Lý" />
                  <Picker.Item label="Hóa" value="Hóa" />
                  <Picker.Item label="Sinh" value="Sinh" />
                  <Picker.Item label="Văn" value="Văn" />
                  <Picker.Item label="Anh" value="Anh" />
                  <Picker.Item label="Sử" value="Sử" />
                  <Picker.Item label="Địa" value="Địa" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.priceContainer}>
            <Text style={styles.filterLabel}>
              Khoảng giá: {filters.priceRange}k VND/buổi
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={100}
              maximumValue={1000}
              step={50}
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              minimumTrackTintColor="#2563eb"
              maximumTrackTintColor="#d1d5db"
              thumbStyle={styles.sliderThumb}
            />
            <View style={styles.priceLabels}>
              <Text style={styles.priceLabel}>100k</Text>
              <Text style={styles.priceLabel}>1000k</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Tìm kiếm</Text>
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
});

export default SearchScreen;