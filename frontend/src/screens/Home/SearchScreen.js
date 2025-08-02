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

// // SearchScreen.js - Enhanced with new search features
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Slider from '@react-native-community/slider';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import apiService from '../../config/api';

// const SearchScreen = ({ navigation }) => {
//   const [filters, setFilters] = useState({
//     search: '',
//     grade: '',
//     subject: '',
//     proficiency_level: '',
//     location_type: 'online', // 'online' or 'offline'
//     city: 'hanoi',
//     max_price: 500000,
//   });

//   const [metadata, setMetadata] = useState({
//     subjects: [],
//     cities: [],
//     grades: [],
//     proficiency_levels: []
//   });

//   const [loading, setLoading] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);

//   // Load metadata on component mount
//   useEffect(() => {
//     const loadMetadata = async () => {
//       try {
//         // Load subjects from API
//         const subjects = await apiService.getSubjects();
        
//         // Set metadata with subjects and default values for other fields
//         setMetadata({
//           subjects: subjects || [],
//           cities: [
//             { id: 'hanoi', name: 'Hà Nội' },
//             { id: 'hochiminh', name: 'TP. Hồ Chí Minh' },
//             { id: 'danang', name: 'Đà Nẵng' },
//             { id: 'haiphong', name: 'Hải Phòng' },
//             { id: 'cantho', name: 'Cần Thơ' }
//           ],
//           grades: [
//             { id: '1', name: 'Lớp 1' }, { id: '2', name: 'Lớp 2' }, { id: '3', name: 'Lớp 3' },
//             { id: '4', name: 'Lớp 4' }, { id: '5', name: 'Lớp 5' }, { id: '6', name: 'Lớp 6' },
//             { id: '7', name: 'Lớp 7' }, { id: '8', name: 'Lớp 8' }, { id: '9', name: 'Lớp 9' },
//             { id: '10', name: 'Lớp 10' }, { id: '11', name: 'Lớp 11' }, { id: '12', name: 'Lớp 12' },
//             { id: 'university', name: 'Đại học' }
//           ],
//           proficiency_levels: [
//             { id: 'beginner', name: 'Cơ bản' },
//             { id: 'intermediate', name: 'Trung bình' },
//             { id: 'advanced', name: 'Nâng cao' },
//             { id: 'expert', name: 'Chuyên gia' }
//           ]
//         });
//       } catch (error) {
//         console.error('Failed to load search metadata:', error);
//         // Set default metadata if API call fails
//         setMetadata({
//           subjects: [],
//           cities: [
//             { id: 'hanoi', name: 'Hà Nội' },
//             { id: 'hochiminh', name: 'TP. Hồ Chí Minh' }
//           ],
//           grades: [
//             { id: '10', name: 'Lớp 10' }, { id: '11', name: 'Lớp 11' }, { id: '12', name: 'Lớp 12' }
//           ],
//           proficiency_levels: [
//             { id: 'beginner', name: 'Cơ bản' },
//             { id: 'intermediate', name: 'Trung bình' },
//             { id: 'advanced', name: 'Nâng cao' }
//           ]
//         });
//       }
//     };
//     loadMetadata();
//   }, []);

//   // Helper function to update filters
//   const updateFilter = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       // Prepare search filters
//       const searchFilters = {
//         ...filters,
//         // Only include city if location is offline
//         city: filters.location_type === 'offline' ? filters.city : undefined
//       };

//       // Remove empty values
//       Object.keys(searchFilters).forEach(key => {
//         if (searchFilters[key] === '' || searchFilters[key] === undefined) {
//           delete searchFilters[key];
//         }
//       });

//       console.log('Search filters:', searchFilters);
      
//       const results = await apiService.searchTutors(searchFilters);
//       setSearchResults(results);
      
//       // Navigate to results with the search data
//       navigation.navigate('TutorList', { 
//         filters: searchFilters,
//         searchResults: results,
//         searchPerformed: true
//       });
      
//     } catch (error) {
//       Alert.alert('Lỗi', 'Không thể tìm kiếm gia sư. Vui lòng thử lại.');
//       console.error('Search error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetFilters = () => {
//     setFilters({
//       search: '',
//       grade: '',
//       subject: '',
//       proficiency_level: '',
//       location_type: 'online',
//       city: 'hanoi',
//       max_price: 500000,
//     });
//     setSearchResults([]);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Tìm gia sư</Text>
//         <TouchableOpacity
//           style={styles.resetButton}
//           onPress={resetFilters}
//         >
//           <Icon name="refresh" size={24} color="white" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Search Bar */}
//         <View style={styles.searchContainer}>
//           <View style={styles.searchInputContainer}>
//             <Icon name="search" size={20} color="#6b7280" style={styles.searchIcon} />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Tìm theo tên gia sư, trường học..."
//               value={filters.search}
//               onChangeText={(value) => updateFilter('search', value)}
//             />
//           </View>
//         </View>

//         <View style={styles.filterContainer}>
//           <Text style={styles.filterTitle}>Bộ lọc tìm kiếm</Text>

//           {/* Grade Selection */}
//           <View style={styles.filterSection}>
//             <Text style={styles.filterLabel}>Lớp học:</Text>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                 selectedValue={filters.grade}
//                 onValueChange={(value) => updateFilter('grade', value)}
//                   style={styles.picker}
//                 >
//                 <Picker.Item label="Tất cả các lớp" value="" />
//                 {metadata.grades.map((grade) => (
//                   <Picker.Item key={grade.value} label={grade.label} value={grade.value} />
//                 ))}
//                 </Picker>
//               </View>
//             </View>

//           {/* Subject Selection */}
//           <View style={styles.filterSection}>
//             <Text style={styles.filterLabel}>Môn học:</Text>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                 selectedValue={filters.subject}
//                 onValueChange={(value) => updateFilter('subject', value)}
//                   style={styles.picker}
//                 >
//                 <Picker.Item label="Tất cả môn học" value="" />
//                 {metadata.subjects.map((subject) => (
//                   <Picker.Item key={subject.code} label={subject.name} value={subject.code} />
//                 ))}
//                 </Picker>
//             </View>
//           </View>

//           {/* Proficiency Level Selection */}
//           {filters.subject && (
//             <View style={styles.filterSection}>
//               <Text style={styles.filterLabel}>Trình độ:</Text>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={filters.proficiency_level}
//                   onValueChange={(value) => updateFilter('proficiency_level', value)}
//                   style={styles.picker}
//                 >
//                   <Picker.Item label="Tất cả trình độ" value="" />
//                   {metadata.proficiency_levels.map((level) => (
//                     <Picker.Item key={level.code} label={level.name} value={level.code} />
//                   ))}
//                 </Picker>
//               </View>
//             </View>
//           )}

//           {/* Location Type Selection */}
//           <View style={styles.filterSection}>
//             <Text style={styles.filterLabel}>Hình thức dạy:</Text>
//             <View style={styles.locationTypeContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.locationTypeButton,
//                   filters.location_type === 'online' && styles.locationTypeButtonActive
//                 ]}
//                 onPress={() => updateFilter('location_type', 'online')}
//               >
//                 <Icon name="computer" size={20} color={filters.location_type === 'online' ? 'white' : '#6b7280'} />
//                 <Text style={[
//                   styles.locationTypeText,
//                   filters.location_type === 'online' && styles.locationTypeTextActive
//                 ]}>
//                   Online
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.locationTypeButton,
//                   filters.location_type === 'offline' && styles.locationTypeButtonActive
//                 ]}
//                 onPress={() => updateFilter('location_type', 'offline')}
//               >
//                 <Icon name="location-on" size={20} color={filters.location_type === 'offline' ? 'white' : '#6b7280'} />
//                 <Text style={[
//                   styles.locationTypeText,
//                   filters.location_type === 'offline' && styles.locationTypeTextActive
//                 ]}>
//                   Offline
//                 </Text>
//               </TouchableOpacity>
//               </View>
//             </View>

//           {/* City Selection (only for offline) */}
//           {filters.location_type === 'offline' && (
//             <View style={styles.filterSection}>
//               <Text style={styles.filterLabel}>Thành phố:</Text>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={filters.city}
//                   onValueChange={(value) => updateFilter('city', value)}
//                   style={styles.picker}
//                 >
//                   {metadata.cities.map((city) => (
//                     <Picker.Item key={city.code} label={city.name} value={city.code} />
//                   ))}
//                 </Picker>
//               </View>
//             </View>
//           )}

//           {/* Price Range */}
//           <View style={styles.filterSection}>
//             <Text style={styles.filterLabel}>
//               Giá tối đa: {(filters.max_price / 1000).toLocaleString()}k VNĐ/giờ
//             </Text>
//             <Slider
//               style={styles.slider}
//               minimumValue={50000}
//               maximumValue={1000000}
//               step={25000}
//               value={filters.max_price}
//               onValueChange={(value) => updateFilter('max_price', value)}
//               minimumTrackTintColor="#2563eb"
//               maximumTrackTintColor="#d1d5db"
//               thumbStyle={styles.sliderThumb}
//             />
//             <View style={styles.priceLabels}>
//               <Text style={styles.priceLabel}>50k</Text>
//               <Text style={styles.priceLabel}>1000k</Text>
//             </View>
//           </View>

//           {/* Search Results Preview */}
//           {searchResults.length > 0 && (
//             <View style={styles.resultsPreview}>
//               <Text style={styles.resultsText}>
//                 Tìm thấy {searchResults.length} gia sư phù hợp
//               </Text>
//               <TouchableOpacity
//                 style={styles.viewResultsButton}
//                 onPress={() => navigation.navigate('TutorList', { 
//                   filters,
//                   searchResults,
//                   searchPerformed: true
//                 })}
//               >
//                 <Text style={styles.viewResultsText}>Xem kết quả</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Search Button */}
//           <TouchableOpacity 
//             style={[styles.searchButton, loading && styles.searchButtonDisabled]} 
//             onPress={handleSearch}
//             disabled={loading}
//           >
//             {loading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="small" color="white" />
//                 <Text style={styles.searchButtonText}>Đang tìm kiếm...</Text>
//               </View>
//             ) : (
//               <>
//                 <Icon name="search" size={20} color="white" />
//             <Text style={styles.searchButtonText}>Tìm kiếm</Text>
//               </>
//             )}
//           </TouchableOpacity>

//           {/* Quick Filter Chips */}
//           <View style={styles.quickFiltersContainer}>
//             <Text style={styles.quickFiltersTitle}>Tìm kiếm nhanh:</Text>
//             <View style={styles.quickFiltersRow}>
//               <TouchableOpacity
//                 style={styles.quickFilterChip}
//                 onPress={() => {
//                   updateFilter('subject', 'math');
//                   updateFilter('proficiency_level', 'advanced');
//                 }}
//               >
//                 <Text style={styles.quickFilterText}>Toán Nâng Cao</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.quickFilterChip}
//                 onPress={() => {
//                   updateFilter('subject', 'english');
//                   updateFilter('location_type', 'online');
//                 }}
//               >
//                 <Text style={styles.quickFilterText}>Tiếng Anh Online</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.quickFilterChip}
//                 onPress={() => {
//                   updateFilter('grade', '12');
//                   updateFilter('max_price', 200000);
//                 }}
//               >
//                 <Text style={styles.quickFilterText}>Lớp 12 Giá Rẻ</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   header: {
//     backgroundColor: '#2563eb',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     paddingTop: 48,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     flex: 1,
//     textAlign: 'center',
//   },
//   resetButton: {
//     padding: 4,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//   },
//   searchContainer: {
//     marginBottom: 20,
//   },
//   searchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9fafb',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   searchIcon: {
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#374151',
//   },
//   filterContainer: {
//     backgroundColor: '#f9fafb',
//     padding: 16,
//     borderRadius: 12,
//   },
//   filterTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 16,
//   },
//   filterSection: {
//     marginBottom: 20,
//   },
//   filterLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     backgroundColor: 'white',
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   locationTypeContainer: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   locationTypeButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     gap: 8,
//   },
//   locationTypeButtonActive: {
//     backgroundColor: '#2563eb',
//     borderColor: '#2563eb',
//   },
//   locationTypeText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#6b7280',
//   },
//   locationTypeTextActive: {
//     color: 'white',
//   },
//   slider: {
//     width: '100%',
//     height: 40,
//     marginVertical: 8,
//   },
//   sliderThumb: {
//     backgroundColor: '#2563eb',
//     width: 20,
//     height: 20,
//   },
//   priceLabels: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 4,
//   },
//   priceLabel: {
//     fontSize: 12,
//     color: '#6b7280',
//   },
//   resultsPreview: {
//     backgroundColor: '#eff6ff',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2563eb',
//   },
//   resultsText: {
//     fontSize: 14,
//     color: '#1d4ed8',
//     fontWeight: '500',
//     marginBottom: 8,
//   },
//   viewResultsButton: {
//     backgroundColor: '#2563eb',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//     alignSelf: 'flex-start',
//   },
//   viewResultsText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   searchButton: {
//     backgroundColor: '#2563eb',
//     borderRadius: 8,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginBottom: 20,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   searchButtonDisabled: {
//     backgroundColor: '#9ca3af',
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   searchButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   quickFiltersContainer: {
//     marginTop: 8,
//   },
//   quickFiltersTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#6b7280',
//     marginBottom: 8,
//   },
//   quickFiltersRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   quickFilterChip: {
//     backgroundColor: '#e5e7eb',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   quickFilterText: {
//     fontSize: 12,
//     color: '#4b5563',
//     fontWeight: '500',
//   },
// });

// export default SearchScreen;