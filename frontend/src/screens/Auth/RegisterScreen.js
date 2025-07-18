// // RegisterScreen.js

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const RegisterScreen = ({ navigation, route }) => {
//   const userType = route.params?.userType || 'student';
  
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     school: '',
//     grade: 'Lớp 10',
//     major: '',
//     experience: '',
//     goals: [],
//   });

//   // helper function to update form data `formData`
//   const updateFormData = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   // helper function to add goals
//   const toggleGoal = (goal) => {
//     setFormData(prev => ({
//       ...prev,
//       goals: prev.goals.includes(goal)
//         ? prev.goals.filter(g => g !== goal)
//         : [...prev.goals, goal]
//     }));
//   };

//   const handleRegister = async () => {
//     if (!formData.name || !formData.phone || !formData.school) {
//       Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
//       return;
//     }

//     try {
//       // TODO: API call - Implement user registration with Supabase
//       // 1. Create user account with Supabase Auth
//       // 2. Store additional user profile data (name, phone, school, etc.)
//       // 3. Handle different user types (student/tutor)
//       // 4. Create user profile in database with user type specific fields
//       // await registerAPI(formData, userType);
//       // Simulate API call, to be replaced with actual API logic
      
//       Alert.alert('Thành công', 'Đăng ký thành công!', [
//         { text: 'OK', onPress: () => navigation.replace('MainApp') }
//       ]);
//     } catch (error) {
//       Alert.alert('Lỗi', 'Đăng ký thất bại');
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         {/* Basic Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Họ và tên *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Nguyễn Văn A"
//               value={formData.name}
//               onChangeText={(value) => updateFormData('name', value)}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Số điện thoại *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="0123456789"
//               value={formData.phone}
//               onChangeText={(value) => updateFormData('phone', value)}
//               keyboardType="phone-pad"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               {userType === 'student' ? 'Trường học hiện tại *' : 'Trường đại học *'}
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder={userType === 'student' ? 'THPT Nguyễn Huệ' : 'Đại học Bách Khoa Hà Nội'}
//               value={formData.school}
//               onChangeText={(value) => updateFormData('school', value)}
//             />
//           </View>
//         </View>

//         {/* Student-specific fields */}
//         {userType === 'student' && (
//           <>
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Thông tin học tập</Text>
              
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Lớp</Text>
//                 <View style={styles.pickerContainer}>
//                   {['Lớp 10', 'Lớp 11', 'Lớp 12'].map((grade) => (
//                     <TouchableOpacity
//                       key={grade}
//                       style={[
//                         styles.pickerOption,
//                         formData.grade === grade && styles.pickerOptionActive
//                       ]}
//                       onPress={() => updateFormData('grade', grade)}
//                     >
//                       <Text style={[
//                         styles.pickerOptionText,
//                         formData.grade === grade && styles.pickerOptionTextActive
//                       ]}>
//                         {grade}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Mục tiêu học tập</Text>
//                 <View style={styles.checkboxContainer}>
//                   {['Thi THPTQG', 'Thi chuyên', 'Học bổ trợ'].map((goal) => (
//                     <TouchableOpacity
//                       key={goal}
//                       style={styles.checkboxItem}
//                       onPress={() => toggleGoal(goal)}
//                     >
//                       <Icon
//                         name={formData.goals.includes(goal) ? 'check-box' : 'check-box-outline-blank'}
//                         size={20}
//                         color="#2563eb"
//                       />
//                       <Text style={styles.checkboxText}>{goal}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             </View>
//           </>
//         )}

//         {/* Tutor-specific fields */}
//         {userType === 'tutor' && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Thông tin chuyên môn</Text>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Chuyên ngành *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Toán ứng dụng"
//                 value={formData.major}
//                 onChangeText={(value) => updateFormData('major', value)}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Kinh nghiệm (năm) *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="5"
//                 value={formData.experience}
//                 onChangeText={(value) => updateFormData('experience', value)}
//                 keyboardType="numeric"
//               />
//             </View>
//           </View>
//         )}

//         <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
//           <Text style={styles.submitButtonText}>Hoàn thành</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   content: {
//     paddingHorizontal: 16,
//     paddingVertical: 24,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 16,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//   },
//   pickerContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   pickerOption: {
//     backgroundColor: '#f3f4f6',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   pickerOptionActive: {
//     backgroundColor: '#2563eb',
//   },
//   pickerOptionText: {
//     color: '#374151',
//     fontSize: 14,
//   },
//   pickerOptionTextActive: {
//     color: 'white',
//   },
//   checkboxContainer: {
//     gap: 12,
//   },
//   checkboxItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   checkboxText: {
//     fontSize: 14,
//     color: '#374151',
//   },
//   submitButton: {
//     backgroundColor: '#2563eb',
//     borderRadius: 8,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default RegisterScreen;

// src/screens/Auth/RegisterScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext.js';

const RegisterScreen = ({ navigation, route }) => {
  // Get userType from route params or default to 'student'
  const [userType, setUserType] = useState(route.params?.userType || 'student');
  
  const [formData, setFormData] = useState({
    // Basic user fields
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    firstName: '',
    lastName: '',
    
    // Profile-specific fields
    school: '',
    grade: '10', // Default to '10' to match backend choices
    learningGoals: [],
    major: '',
    experienceYears: '0-1', // Default to match backend choices
    bio: '',
    hourlyRate: '',
    location: 'hanoi', // Default location
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Navigate to main app if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('MainApp');
    }
  }, [isAuthenticated, navigation]);

  // Clear error when form data changes
  useEffect(() => {
    clearError();
  }, [formData, userType]);

  // Helper function to update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper function to toggle learning goals for students
  const toggleLearningGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal]
    }));
  };

  // Validation function
  const validateForm = () => {
    // Basic validation
    if (!formData.firstName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên');
      return false;
    }

    if (!formData.lastName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }

    if (!formData.username.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return false;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return false;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      Alert.alert('Lỗi', 'Số điện thoại phải có đúng 10 chữ số');
      return false;
    }

    if (!formData.school.trim()) {
      Alert.alert('Lỗi', userType === 'student' ? 'Vui lòng nhập trường học' : 'Vui lòng nhập trường đại học');
      return false;
    }

    // Tutor-specific validation
    if (userType === 'tutor') {
      if (!formData.major.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập chuyên ngành');
        return false;
      }

      if (!formData.hourlyRate.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập mức phí theo giờ');
        return false;
      }

      const hourlyRate = parseFloat(formData.hourlyRate);
      if (isNaN(hourlyRate) || hourlyRate <= 0) {
        Alert.alert('Lỗi', 'Mức phí phải là số dương');
        return false;
      }
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare the registration data according to Django backend structure
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirm: formData.passwordConfirm,
        phone: formData.phone.trim(),
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        user_type: userType,
        profile_data: {}
      };

      // Add profile-specific data based on user type
      if (userType === 'student') {
        registrationData.profile_data = {
          school: formData.school.trim(),
          grade: formData.grade,
          learning_goals: formData.learningGoals,
          location: formData.location,
          // Add default budget values if needed
          budget_min: null,
          budget_max: null,
        };
      } else if (userType === 'tutor') {
        registrationData.profile_data = {
          university: formData.school.trim(),
          major: formData.major.trim(),
          experience_years: formData.experienceYears,
          bio: formData.bio.trim(),
          hourly_rate: parseFloat(formData.hourlyRate),
          location: formData.location,
          // Add default values
          is_verified: false,
          availability: {},
          top_achievements: [],
        };
      }

      await register(registrationData);
      
      // Registration successful, navigation will be handled by useEffect
      Alert.alert(
        'Thành công', 
        'Đăng ký thành công! Chào mừng bạn đến với TutorConnect.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      // Handle registration errors
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      
      if (error.message.includes('email') && error.message.includes('already exists')) {
        errorMessage = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
      } else if (error.message.includes('username') && error.message.includes('already exists')) {
        errorMessage = 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.';
      } else if (error.message.includes('phone') && error.message.includes('already exists')) {
        errorMessage = 'Số điện thoại này đã được sử dụng.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Mật khẩu không đủ mạnh. Vui lòng chọn mật khẩu khác.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng thử lại.';
      }
      
      Alert.alert('Lỗi đăng ký', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Icon name="arrow-back" size={24} color="#2563eb" />
            </TouchableOpacity>
            <Text style={styles.title}>Tạo tài khoản</Text>
          </View>

          {/* User Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loại tài khoản</Text>
            <View style={styles.userTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'student' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('student')}
                disabled={isLoading}
              >
                <Text style={[
                  styles.userTypeButtonText,
                  userType === 'student' && styles.userTypeButtonTextActive
                ]}>
                  Học sinh
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'tutor' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('tutor')}
                disabled={isLoading}
              >
                <Text style={[
                  styles.userTypeButtonText,
                  userType === 'tutor' && styles.userTypeButtonTextActive
                ]}>
                  Gia sư
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Họ *</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Nguyễn"
                  value={formData.lastName}
                  onChangeText={(value) => updateFormData('lastName', value)}
                  editable={!isLoading}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Tên *</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Văn A"
                  value={formData.firstName}
                  onChangeText={(value) => updateFormData('firstName', value)}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tên đăng nhập *</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="nguyenvana"
                value={formData.username}
                onChangeText={(value) => updateFormData('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="email@example.com"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mật khẩu *</Text>
              <View style={[styles.passwordContainer, error && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  secureTextEntry={!showPassword}
                  textContentType="none"
                  autoComplete="off"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Icon 
                    name={showPassword ? 'visibility-off' : 'visibility'} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Xác nhận mật khẩu *</Text>
              <View style={[styles.passwordContainer, error && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  value={formData.passwordConfirm}
                  onChangeText={(value) => updateFormData('passwordConfirm', value)}
                  secureTextEntry={!showPasswordConfirm}
                  textContentType="none"
                  autoComplete="off"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  disabled={isLoading}
                >
                  <Icon 
                    name={showPasswordConfirm ? 'visibility-off' : 'visibility'} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Số điện thoại *</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="0123456789"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
                maxLength={10}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {userType === 'student' ? 'Trường học hiện tại *' : 'Trường đại học *'}
              </Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder={userType === 'student' ? 'THPT Nguyễn Huệ' : 'Đại học Bách Khoa Hà Nội'}
                value={formData.school}
                onChangeText={(value) => updateFormData('school', value)}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Student-specific fields */}
          {userType === 'student' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin học tập</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Lớp</Text>
                <View style={styles.gradeContainer}>
                  {['10', '11', '12'].map((grade) => (
                    <TouchableOpacity
                      key={grade}
                      style={[
                        styles.gradeOption,
                        formData.grade === grade && styles.gradeOptionActive
                      ]}
                      onPress={() => updateFormData('grade', grade)}
                      disabled={isLoading}
                    >
                      <Text style={[
                        styles.gradeOptionText,
                        formData.grade === grade && styles.gradeOptionTextActive
                      ]}>
                        Lớp {grade}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mục tiêu học tập</Text>
                <View style={styles.checkboxContainer}>
                  {['Thi THPTQG', 'Thi chuyên', 'Học bổ trợ', 'Thi đại học'].map((goal) => (
                    <TouchableOpacity
                      key={goal}
                      style={styles.checkboxItem}
                      onPress={() => toggleLearningGoal(goal)}
                      disabled={isLoading}
                    >
                      <Icon
                        name={formData.learningGoals.includes(goal) ? 'check-box' : 'check-box-outline-blank'}
                        size={20}
                        color="#2563eb"
                      />
                      <Text style={styles.checkboxText}>{goal}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Tutor-specific fields */}
          {userType === 'tutor' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin chuyên môn</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Chuyên ngành *</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Toán ứng dụng"
                  value={formData.major}
                  onChangeText={(value) => updateFormData('major', value)}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Kinh nghiệm</Text>
                <View style={styles.experienceContainer}>
                  {[
                    { value: '0-1', label: '0-1 năm' },
                    { value: '1-3', label: '1-3 năm' },
                    { value: '3-5', label: '3-5 năm' },
                    { value: '5+', label: 'Trên 5 năm' }
                  ].map((exp) => (
                    <TouchableOpacity
                      key={exp.value}
                      style={[
                        styles.experienceOption,
                        formData.experienceYears === exp.value && styles.experienceOptionActive
                      ]}
                      onPress={() => updateFormData('experienceYears', exp.value)}
                      disabled={isLoading}
                    >
                      <Text style={[
                        styles.experienceOptionText,
                        formData.experienceYears === exp.value && styles.experienceOptionTextActive
                      ]}>
                        {exp.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mức phí theo giờ (VNĐ) *</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="150000"
                  value={formData.hourlyRate}
                  onChangeText={(value) => updateFormData('hourlyRate', value)}
                  keyboardType="numeric"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Giới thiệu bản thân</Text>
                <TextInput
                  style={[styles.input, styles.textArea, error && styles.inputError]}
                  placeholder="Chia sẻ về kinh nghiệm và phương pháp dạy của bạn..."
                  value={formData.bio}
                  onChangeText={(value) => updateFormData('bio', value)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!isLoading}
                />
              </View>
            </View>
          )}

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Icon name="error" size={16} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.submitButtonText}>Đang tạo tài khoản...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Tạo tài khoản</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          >
            <Text style={[styles.loginButtonText, isLoading && styles.loginButtonTextDisabled]}>
              Đã có tài khoản? Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  userTypeButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: '#2563eb',
  },
  userTypeButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  userTypeButtonTextActive: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  textArea: {
    minHeight: 100,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 12,
  },
  gradeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  gradeOption: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  gradeOptionActive: {
    backgroundColor: '#2563eb',
  },
  gradeOptionText: {
    color: '#374151',
    fontSize: 14,
  },
  gradeOptionTextActive: {
    color: 'white',
  },
  experienceContainer: {
    gap: 8,
  },
  experienceOption: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  experienceOptionActive: {
    backgroundColor: '#2563eb',
  },
  experienceOptionText: {
    color: '#374151',
    fontSize: 14,
  },
  experienceOptionTextActive: {
    color: 'white',
  },
  checkboxContainer: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxText: {
    fontSize: 14,
    color: '#374151',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButtonTextDisabled: {
    color: '#9ca3af',
  },
});

export default RegisterScreen;