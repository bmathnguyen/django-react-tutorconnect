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

import DropDownPicker from 'react-native-dropdown-picker';

// Define choices outside the component
const CLASS_LEVELS = ["Lớp 1-5", "Lớp 6-9", "Lớp 10-12"];
const SUBJECTS = [
  "Toán", "Anh", "Lý", "Hóa", "Văn", "Sinh", "Sử", "Địa", "Tin", "GDCD", "Khác"
];
const LEVELS = ["Cơ Bản", "Nâng Cao"];

const RegisterScreen = ({ navigation, route }) => {
  const [userType, setUserType] = useState(route.params?.userType || 'student');
  const [subjectList, setSubjectList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState([]);
  const [formData, setFormData] = useState({
    // Basic user fields
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    firstName: '',
    lastName: '',

    // Profile-specific
    school: '',
    grade: '10',
    learningGoals: [],
    // Tutor fields
    education: '', // Combined school/major
    achievements: [''], // Start with 1 achievement box
    classLevels: [],
    subjects: [{ name: '', level: LEVELS[0] }],
    prices: {},
    useSamePrice: true,
    singlePrice: '',
    bio: '',
    location: 'hanoi',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

  useEffect(() => {
    if (userType === 'tutor') {
      fetch('YOUR_BACKEND_API_URL/api/subjects/')
        .then(res => res.json())
        .then(data => setSubjectList(data))
        .catch(err => console.log('Failed to load subjects', err));
    }
  }, [userType]);

  // Navigate to main app if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigation.replace('MainApp');
  }, [isAuthenticated, navigation]);

  useEffect(() => { clearError(); }, [formData, userType]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper: toggle learning goal for students
  const toggleLearningGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal]
    }));
  };

  // ---- FORM VALIDATION ----
  const validateForm = () => {
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
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      Alert.alert('Lỗi', 'Số điện thoại phải có đúng 10 chữ số');
      return false;
    }
    if (!formData.school.trim()) {
      Alert.alert('Lỗi', userType === 'student' ? 'Vui lòng nhập trường học' : 'Vui lòng nhập học vấn');
      return false;
    }
    // Tutor-specific
    if (userType === 'tutor') {
      if (
        !formData.classLevels.length ||
        !formData.subjects.length ||
        formData.subjects.some(s => !s.name.trim())
      ) {
        Alert.alert('Lỗi', 'Vui lòng chọn lớp và môn dạy.');
        return false;
      }
      if (!formData.useSamePrice && Object.values(formData.prices).some(v => !v || isNaN(v) || v <= 0)) {
        Alert.alert('Lỗi', 'Vui lòng nhập giá hợp lệ cho tất cả môn và cấp độ.');
        return false;
      }
      if (formData.useSamePrice && (!formData.singlePrice || isNaN(formData.singlePrice) || formData.singlePrice <= 0)) {
        Alert.alert('Lỗi', 'Vui lòng nhập mức giá hợp lệ.');
        return false;
      }
    }
    return true;
  };

  // ---- REGISTER HANDLER ----
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirm: formData.passwordConfirm,
        phone: formData.phone.trim(),
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        user_type: userType,
        profile_data: {},
      };

      if (userType === 'student') {
        registrationData.profile_data = {
          school: formData.school.trim(),
          grade: formData.grade,
          learning_goals: formData.learningGoals,
          location: formData.location,
          budget_min: null,
          budget_max: null,
        };
      } else if (userType === 'tutor') {
        // Prices: fill out all {subject_level: price} pairs
        let prices = {};
        if (formData.useSamePrice) {
          formData.subjects.forEach(item => {
            if (item.name) prices[`${item.name}_${item.level}`] = Number(formData.singlePrice) || 0;
          });
        } else {
          prices = formData.prices;
        }
        registrationData.profile_data = {
          education: formData.education.trim(), // Use the new combined field
          achievements: formData.achievements.filter(a => !!a.trim()).slice(0, 3), // Send top 3
          class_levels: formData.classLevels,
          subjects: formData.subjects.filter(s => !!s.name.trim()),
          prices,
          bio: formData.bio.trim(),
          location: formData.location,
          is_verified: false, // Default value
          availability: {}, // Default value
        };
      }

      await register(registrationData);
      Alert.alert('Thành công', 'Đăng ký thành công! Chào mừng bạn đến với TutorConnect.', [{ text: 'OK' }]);
    } catch (error) {
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

  // ---- UI ----
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isLoading}>
              <Icon name="arrow-back" size={24} color="#2563eb" />
            </TouchableOpacity>
            <Text style={styles.title}>Tạo tài khoản</Text>
          </View>

          {/* User Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loại tài khoản</Text>
            <View style={styles.userTypeButtons}>
              <TouchableOpacity
                style={[styles.userTypeButton, userType === 'student' && styles.userTypeButtonActive]}
                onPress={() => setUserType('student')}
                disabled={isLoading}
              >
                <Text style={[styles.userTypeButtonText, userType === 'student' && styles.userTypeButtonTextActive]}>
                  Học sinh
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.userTypeButton, userType === 'tutor' && styles.userTypeButtonActive]}
                onPress={() => setUserType('tutor')}
                disabled={isLoading}
              >
                <Text style={[styles.userTypeButtonText, userType === 'tutor' && styles.userTypeButtonTextActive]}>
                  Gia sư
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Họ *</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Nguyễn"
                  value={formData.lastName}
                  onChangeText={value => updateFormData('lastName', value)}
                  editable={!isLoading}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Tên *</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Văn A"
                  value={formData.firstName}
                  onChangeText={value => updateFormData('firstName', value)}
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
                onChangeText={value => updateFormData('username', value)}
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
                onChangeText={value => updateFormData('email', value)}
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
                  onChangeText={value => updateFormData('password', value)}
                  secureTextEntry={!showPassword}
                  textContentType="none"
                  autoComplete="off"
                  editable={!isLoading}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                  <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="#6b7280" />
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
                  onChangeText={value => updateFormData('passwordConfirm', value)}
                  secureTextEntry={!showPasswordConfirm}
                  textContentType="none"
                  autoComplete="off"
                  editable={!isLoading}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} disabled={isLoading}>
                  <Icon name={showPasswordConfirm ? 'visibility-off' : 'visibility'} size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Số điện thoại *</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="0123456789"
                value={formData.phone}
                onChangeText={value => updateFormData('phone', value)}
                keyboardType="phone-pad"
                maxLength={10}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{userType === 'student' ? 'Trường học hiện tại *' : 'Học vấn (Trường - Chuyên ngành) *'}</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder={userType === 'student' ? 'THPT Nguyễn Huệ' : 'ĐHBK Hà Nội - Công nghệ Thông tin'}
                value={userType === 'student' ? formData.school : formData.education}
                onChangeText={value => updateFormData(userType === 'student' ? 'school' : 'education', value)}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Student fields */}
          {userType === 'student' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin học tập</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Lớp</Text>
                <View style={styles.gradeContainer}>
                  {['10', '11', '12'].map(grade => (
                    <TouchableOpacity
                      key={grade}
                      style={[styles.gradeOption, formData.grade === grade && styles.gradeOptionActive]}
                      onPress={() => updateFormData('grade', grade)}
                      disabled={isLoading}
                    >
                      <Text style={[styles.gradeOptionText, formData.grade === grade && styles.gradeOptionTextActive]}>Lớp {grade}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mục tiêu học tập</Text>
                <View style={styles.checkboxContainer}>
                  {['Thi THPTQG', 'Thi chuyên', 'Học bổ trợ', 'Thi đại học'].map(goal => (
                    <TouchableOpacity
                      key={goal}
                      style={styles.checkboxItem}
                      onPress={() => toggleLearningGoal(goal)}
                      disabled={isLoading}
                    >
                      <Icon name={formData.learningGoals.includes(goal) ? 'check-box' : 'check-box-outline-blank'} size={20} color="#2563eb" />
                      <Text style={styles.checkboxText}>{goal}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* --- TUTOR FIELDS --- */}
          {userType === 'tutor' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin chuyên môn</Text>

              {/* Achievements */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Thành tích nổi bật (Top 3)</Text>
                {formData.achievements.map((a, idx) => (
                  <View key={idx} style={styles.rowCentered}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder={`Thành tích #${idx + 1}`}
                      value={a}
                      onChangeText={value => {
                        const updated = [...formData.achievements];
                        updated[idx] = value;
                        updateFormData('achievements', updated);
                      }}
                      editable={!isLoading}
                    />
                    {formData.achievements.length > 1 && (
                      <TouchableOpacity
                        onPress={() => {
                          const updated = formData.achievements.filter((_, i) => i !== idx);
                          updateFormData('achievements', updated);
                        }}
                        style={styles.removeButton}
                        disabled={isLoading}
                      >
                        <Icon name="remove-circle" color="#dc2626" size={22} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {formData.achievements.length < 10 && (
                  <TouchableOpacity
                    onPress={() => updateFormData('achievements', [...formData.achievements, ''])}
                    disabled={isLoading}
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>+ Thêm thành tích</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.fieldDescription}>Thêm các thành tích quan trọng nhất của bạn. Top 3 sẽ được hiển thị nổi bật trên hồ sơ.</Text>
              </View>

              {/* Class Levels */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Các lớp nhận dạy:</Text>
                <View style={styles.checkboxContainer}>
                  {CLASS_LEVELS.map(level => (
                    <TouchableOpacity
                      key={level}
                      style={styles.checkboxItem}
                      onPress={() => {
                        const selected = formData.classLevels.includes(level)
                          ? formData.classLevels.filter(l => l !== level)
                          : [...formData.classLevels, level];
                        updateFormData('classLevels', selected);
                      }}
                      disabled={isLoading}
                    >
                      <Icon name={formData.classLevels.includes(level) ? 'check-box' : 'check-box-outline-blank'} size={20} color="#2563eb" />
                      <Text style={styles.checkboxText}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Subjects and Level */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Các môn dạy:</Text>
                {formData.subjects.map((item, idx) => (
                  <View key={idx} style={[styles.rowCentered, { marginBottom: 12 }]}>
                    {/* Subject Dropdown */}
                    <View style={{ flex: 2, marginRight: 8 }}>
                      <DropDownPicker
                        open={dropdownOpen[idx]}
                        value={item.name} // Use name as value
                        items={SUBJECTS.map(s => ({ label: s, value: s }))}
                        setOpen={open => {
                          const updated = Array(formData.subjects.length).fill(false);
                          updated[idx] = open;
                          setDropdownOpen(updated);
                        }}
                        setValue={cb => {
                          const updated = [...formData.subjects];
                          const newName = cb(updated[idx]?.name);
                          if (updated[idx]) updated[idx].name = newName;
                          updateFormData('subjects', updated);
                        }}
                        placeholder="Chọn môn"
                        style={styles.dropdown}
                        containerStyle={{ height: dropdownOpen[idx] ? 150 : 50 }}
                        zIndex={1000 - idx}
                        listMode="SCROLLVIEW"
                      />
                    </View>

                    {/* Level Picker (basic/advanced) */}
                    <View style={styles.levelPickerContainer}>
                      {LEVELS.map(lv => (
                        <TouchableOpacity
                          key={lv}
                          onPress={() => {
                            const updated = [...formData.subjects];
                            if (updated[idx]) updated[idx].level = lv;
                            updateFormData('subjects', updated);
                          }}
                          style={[styles.levelButton, item.level === lv && styles.levelButtonActive]}
                          disabled={isLoading}
                        >
                          <Text style={[styles.levelButtonText, item.level === lv && styles.levelButtonTextActive]}>{lv}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Remove subject */}
                    {formData.subjects.length > 1 && (
                      <TouchableOpacity
                        onPress={() => {
                          const updated = formData.subjects.filter((_, i) => i !== idx);
                          updateFormData('subjects', updated);
                        }}
                        style={styles.removeButton}
                        disabled={isLoading}
                      >
                        <Icon name="remove-circle" color="#dc2626" size={22} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => {
                    updateFormData('subjects', [...formData.subjects, { name: '', level: LEVELS[0] }]);
                  }}
                  disabled={isLoading || formData.subjects.length >= 10}
                  style={styles.addButton}
                >
                  <Text style={styles.addButtonText}>+ Thêm môn</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

              {userType === 'tutor' && (
                <>
                  {/* Pricing UI */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Cài đặt giá dạy (VND/giờ)</Text>
                    <View style={styles.radioContainer}>
                      <TouchableOpacity style={styles.radioOption} onPress={() => updateFormData('useSamePrice', true)} disabled={isLoading}>
                        <Icon name={formData.useSamePrice ? 'radio-button-checked' : 'radio-button-unchecked'} size={20} color="#2563eb" />
                        <Text style={styles.radioText}>Dùng 1 giá cho tất cả</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.radioOption} onPress={() => updateFormData('useSamePrice', false)} disabled={isLoading}>
                        <Icon name={!formData.useSamePrice ? 'radio-button-checked' : 'radio-button-unchecked'} size={20} color="#2563eb" />
                        <Text style={styles.radioText}>Giá riêng cho từng môn</Text>
                      </TouchableOpacity>
                    </View>

                    {formData.useSamePrice ? (
                      <TextInput
                        style={styles.input}
                        placeholder="Nhập giá chung (VND/giờ)"
                        value={formData.singlePrice}
                        keyboardType="numeric"
                        onChangeText={value => {
                          updateFormData('singlePrice', value);
                          let newPrices = {};
                          formData.subjects.forEach(item => {
                            if (item.name) newPrices[`${item.name}_${item.level}`] = Number(value) || 0;
                          });
                          updateFormData('prices', newPrices);
                        }}
                        editable={!isLoading}
                      />
                    ) : (
                      <View style={styles.priceTable}>
                        {formData.subjects.filter(s => s.name).map((item, idx) => (
                          <View key={idx} style={styles.priceRow}>
                            <Text style={styles.priceLabel}>{item.name} - {item.level}</Text>
                            <TextInput
                              style={styles.priceInput}
                              placeholder="Giá (VND)"
                              keyboardType="numeric"
                              value={formData.prices[`${item.name}_${item.level}`] ? String(formData.prices[`${item.name}_${item.level}`]) : ''}
                              onChangeText={value => {
                                const newPrices = { ...formData.prices };
                                newPrices[`${item.name}_${item.level}`] = Number(value) || 0;
                                updateFormData('prices', newPrices);
                              }}
                              editable={!isLoading}
                            />
                          </View>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Bio */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Giới thiệu bản thân</Text>
                    <TextInput
                      style={[styles.input, styles.textArea, error && styles.inputError]}
                      placeholder="Chia sẻ về kinh nghiệm và phương pháp dạy của bạn..."
                      value={formData.bio}
                      onChangeText={value => updateFormData('bio', value)}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      editable={!isLoading}
                    />
                  </View>
                </>
              )}

          {/* Error message */}
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


// // src/screens/Auth/RegisterScreen.js
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useAuth } from '../../context/AuthContext.js';

// const RegisterScreen = ({ navigation, route }) => {
//   // Get userType from route params or default to 'student'
//   const [userType, setUserType] = useState(route.params?.userType || 'student');
  
//   const [formData, setFormData] = useState({
//     // Basic user fields
//     username: '',
//     email: '',
//     password: '',
//     passwordConfirm: '',
//     phone: '',
//     firstName: '',
//     lastName: '',
    
//     // Profile-specific fields
//     school: '',
//     grade: '10', // Default to '10' to match backend choices
//     learningGoals: [],
//     major: '',
//     experienceYears: '0-1', // Default to match backend choices
//     bio: '',
//     hourlyRate: '',
//     location: 'hanoi', // Default location
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

//   const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

//   // Navigate to main app if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigation.replace('MainApp');
//     }
//   }, [isAuthenticated, navigation]);

//   // Clear error when form data changes
//   useEffect(() => {
//     clearError();
//   }, [formData, userType]);

//   // Helper function to update form data
//   const updateFormData = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   // Helper function to toggle learning goals for students
//   const toggleLearningGoal = (goal) => {
//     setFormData(prev => ({
//       ...prev,
//       learningGoals: prev.learningGoals.includes(goal)
//         ? prev.learningGoals.filter(g => g !== goal)
//         : [...prev.learningGoals, goal]
//     }));
//   };

//   // Validation function
//   const validateForm = () => {
//     // Basic validation
//     if (!formData.firstName.trim()) {
//       Alert.alert('Lỗi', 'Vui lòng nhập tên');
//       return false;
//     }

//     if (!formData.lastName.trim()) {
//       Alert.alert('Lỗi', 'Vui lòng nhập họ');
//       return false;
//     }

//     if (!formData.email.trim()) {
//       Alert.alert('Lỗi', 'Vui lòng nhập email');
//       return false;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email.trim())) {
//       Alert.alert('Lỗi', 'Email không hợp lệ');
//       return false;
//     }

//     if (!formData.username.trim()) {
//       Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập');
//       return false;
//     }

//     if (formData.password.length < 6) {
//       Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
//       return false;
//     }

//     if (formData.password !== formData.passwordConfirm) {
//       Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
//       return false;
//     }

//     if (!formData.phone.trim()) {
//       Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
//       return false;
//     }

//     // Phone validation (10 digits)
//     const phoneRegex = /^\d{10}$/;
//     if (!phoneRegex.test(formData.phone.trim())) {
//       Alert.alert('Lỗi', 'Số điện thoại phải có đúng 10 chữ số');
//       return false;
//     }

//     if (!formData.school.trim()) {
//       Alert.alert('Lỗi', userType === 'student' ? 'Vui lòng nhập trường học' : 'Vui lòng nhập trường đại học');
//       return false;
//     }

//     // Tutor-specific validation
//     if (userType === 'tutor') {
//       if (!formData.major.trim()) {
//         Alert.alert('Lỗi', 'Vui lòng nhập chuyên ngành');
//         return false;
//       }

//       if (!formData.hourlyRate.trim()) {
//         Alert.alert('Lỗi', 'Vui lòng nhập mức phí theo giờ');
//         return false;
//       }

//       const hourlyRate = parseFloat(formData.hourlyRate);
//       if (isNaN(hourlyRate) || hourlyRate <= 0) {
//         Alert.alert('Lỗi', 'Mức phí phải là số dương');
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleRegister = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       // Prepare the registration data according to Django backend structure
//       const registrationData = {
//         username: formData.username.trim(),
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password,
//         password_confirm: formData.passwordConfirm,
//         phone: formData.phone.trim(),
//         first_name: formData.firstName.trim(),
//         last_name: formData.lastName.trim(),
//         user_type: userType,
//         profile_data: {}
//       };

//       // Add profile-specific data based on user type
//       if (userType === 'student') {
//         registrationData.profile_data = {
//           school: formData.school.trim(),
//           grade: formData.grade,
//           learning_goals: formData.learningGoals,
//           location: formData.location,
//           // Add default budget values if needed
//           budget_min: null,
//           budget_max: null,
//         };
//       } else if (userType === 'tutor') {
//         registrationData.profile_data = {
//           education: formData.education.trim(),
//           // Add default values
//           // NEW:
//           is_verified: false,
//           availability: {},
//           achievements: formData.achievements.filter(a => !!a.trim()),
//           class_levels: formData.classLevels,
//           subjects: formData.subjects,
//           prices: formData.prices,
//           bio: formData.bio.trim(),
//           hourly_rate: Number(formData.hourlyRate) || null,
//           location: formData.location,
//         };
//       }

//       await register(registrationData);
      
//       // Registration successful, navigation will be handled by useEffect
//       Alert.alert(
//         'Thành công', 
//         'Đăng ký thành công! Chào mừng bạn đến với TutorConnect.',
//         [{ text: 'OK' }]
//       );

//     } catch (error) {
//       // Handle registration errors
//       let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
//       console.log('Registration error:', error);
//       if (error.message.includes('email') && error.message.includes('already exists')) {
//         errorMessage = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
//       } else if (error.message.includes('username') && error.message.includes('already exists')) {
//         errorMessage = 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.';
//       } else if (error.message.includes('phone') && error.message.includes('already exists')) {
//         errorMessage = 'Số điện thoại này đã được sử dụng.';
//       } else if (error.message.includes('password')) {
//         errorMessage = 'Mật khẩu không đủ mạnh. Vui lòng chọn mật khẩu khác.';
//       } else if (error.message.includes('Network')) {
//         errorMessage = 'Lỗi kết nối mạng. Vui lòng thử lại.';
//       }
      
//       Alert.alert('Lỗi đăng ký', errorMessage);
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         <View style={styles.content}>
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//               disabled={isLoading}
//             >
//               <Icon name="arrow-back" size={24} color="#2563eb" />
//             </TouchableOpacity>
//             <Text style={styles.title}>Tạo tài khoản</Text>
//           </View>

//           {/* User Type Selector */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Loại tài khoản</Text>
//             <View style={styles.userTypeButtons}>
//               <TouchableOpacity
//                 style={[
//                   styles.userTypeButton,
//                   userType === 'student' && styles.userTypeButtonActive
//                 ]}
//                 onPress={() => setUserType('student')}
//                 disabled={isLoading}
//               >
//                 <Text style={[
//                   styles.userTypeButtonText,
//                   userType === 'student' && styles.userTypeButtonTextActive
//                 ]}>
//                   Học sinh
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.userTypeButton,
//                   userType === 'tutor' && styles.userTypeButtonActive
//                 ]}
//                 onPress={() => setUserType('tutor')}
//                 disabled={isLoading}
//               >
//                 <Text style={[
//                   styles.userTypeButtonText,
//                   userType === 'tutor' && styles.userTypeButtonTextActive
//                 ]}>
//                   Gia sư
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Basic Information */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
            
//             <View style={styles.row}>
//               <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
//                 <Text style={styles.label}>Họ *</Text>
//                 <TextInput
//                   style={[styles.input, error && styles.inputError]}
//                   placeholder="Nguyễn"
//                   value={formData.lastName}
//                   onChangeText={(value) => updateFormData('lastName', value)}
//                   editable={!isLoading}
//                 />
//               </View>
//               <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
//                 <Text style={styles.label}>Tên *</Text>
//                 <TextInput
//                   style={[styles.input, error && styles.inputError]}
//                   placeholder="Văn A"
//                   value={formData.firstName}
//                   onChangeText={(value) => updateFormData('firstName', value)}
//                   editable={!isLoading}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Tên đăng nhập *</Text>
//               <TextInput
//                 style={[styles.input, error && styles.inputError]}
//                 placeholder="nguyenvana"
//                 value={formData.username}
//                 onChangeText={(value) => updateFormData('username', value)}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 editable={!isLoading}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Email *</Text>
//               <TextInput
//                 style={[styles.input, error && styles.inputError]}
//                 placeholder="email@example.com"
//                 value={formData.email}
//                 onChangeText={(value) => updateFormData('email', value)}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 editable={!isLoading}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Mật khẩu *</Text>
//               <View style={[styles.passwordContainer, error && styles.inputError]}>
//                 <TextInput
//                   style={styles.passwordInput}
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChangeText={(value) => updateFormData('password', value)}
//                   secureTextEntry={!showPassword}
//                   textContentType="none"
//                   autoComplete="off"
//                   editable={!isLoading}
//                 />
//                 <TouchableOpacity
//                   style={styles.eyeButton}
//                   onPress={() => setShowPassword(!showPassword)}
//                   disabled={isLoading}
//                 >
//                   <Icon 
//                     name={showPassword ? 'visibility-off' : 'visibility'} 
//                     size={20} 
//                     color="#6b7280" 
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Xác nhận mật khẩu *</Text>
//               <View style={[styles.passwordContainer, error && styles.inputError]}>
//                 <TextInput
//                   style={styles.passwordInput}
//                   placeholder="••••••••"
//                   value={formData.passwordConfirm}
//                   onChangeText={(value) => updateFormData('passwordConfirm', value)}
//                   secureTextEntry={!showPasswordConfirm}
//                   textContentType="none"
//                   autoComplete="off"
//                   editable={!isLoading}
//                 />
//                 <TouchableOpacity
//                   style={styles.eyeButton}
//                   onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
//                   disabled={isLoading}
//                 >
//                   <Icon 
//                     name={showPasswordConfirm ? 'visibility-off' : 'visibility'} 
//                     size={20} 
//                     color="#6b7280" 
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Số điện thoại *</Text>
//               <TextInput
//                 style={[styles.input, error && styles.inputError]}
//                 placeholder="0123456789"
//                 value={formData.phone}
//                 onChangeText={(value) => updateFormData('phone', value)}
//                 keyboardType="phone-pad"
//                 maxLength={10}
//                 editable={!isLoading}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>
//                 {userType === 'student' ? 'Trường học hiện tại *' : 'Trường đại học *'}
//               </Text>
//               <TextInput
//                 style={[styles.input, error && styles.inputError]}
//                 placeholder={userType === 'student' ? 'THPT Nguyễn Huệ' : 'Đại học Bách Khoa Hà Nội'}
//                 value={formData.school}
//                 onChangeText={(value) => updateFormData('school', value)}
//                 editable={!isLoading}
//               />
//             </View>
//           </View>

//           {/* Student-specific fields */}
//           {userType === 'student' && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Thông tin học tập</Text>
              
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Lớp</Text>
//                 <View style={styles.gradeContainer}>
//                   {['10', '11', '12'].map((grade) => (
//                     <TouchableOpacity
//                       key={grade}
//                       style={[
//                         styles.gradeOption,
//                         formData.grade === grade && styles.gradeOptionActive
//                       ]}
//                       onPress={() => updateFormData('grade', grade)}
//                       disabled={isLoading}
//                     >
//                       <Text style={[
//                         styles.gradeOptionText,
//                         formData.grade === grade && styles.gradeOptionTextActive
//                       ]}>
//                         Lớp {grade}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Mục tiêu học tập</Text>
//                 <View style={styles.checkboxContainer}>
//                   {['Thi THPTQG', 'Thi chuyên', 'Học bổ trợ', 'Thi đại học'].map((goal) => (
//                     <TouchableOpacity
//                       key={goal}
//                       style={styles.checkboxItem}
//                       onPress={() => toggleLearningGoal(goal)}
//                       disabled={isLoading}
//                     >
//                       <Icon
//                         name={formData.learningGoals.includes(goal) ? 'check-box' : 'check-box-outline-blank'}
//                         size={20}
//                         color="#2563eb"
//                       />
//                       <Text style={styles.checkboxText}>{goal}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             </View>
//           )}

//           {/* Tutor-specific fields */}
//           {userType === 'tutor' && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Thông tin chuyên môn</Text>
              
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Học vấn *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="ĐHBK Hà Nội - CNTT"
//                     value={formData.education}
//                     onChangeText={value => updateFormData('education', value)}
//                     editable={!isLoading}
//                   />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Mức phí theo giờ (VNĐ) *</Text>
//                 <TextInput
//                   style={[styles.input, error && styles.inputError]}
//                   placeholder="150000"
//                   value={formData.hourlyRate}
//                   onChangeText={(value) => updateFormData('hourlyRate', value)}
//                   keyboardType="numeric"
//                   editable={!isLoading}
//                 />
//               </View>
              

//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Giới thiệu bản thân</Text>
//                 <TextInput
//                   style={[styles.input, styles.textArea, error && styles.inputError]}
//                   placeholder="Chia sẻ về kinh nghiệm và phương pháp dạy của bạn..."
//                   value={formData.bio}
//                   onChangeText={(value) => updateFormData('bio', value)}
//                   multiline
//                   numberOfLines={4}
//                   textAlignVertical="top"
//                   editable={!isLoading}
//                 />
//               </View>
//             </View>
//           )}

//           {/* Error Message */}
//           {error && (
//             <View style={styles.errorContainer}>
//               <Icon name="error" size={16} color="#dc2626" />
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           )}

//           <TouchableOpacity
//             style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
//             onPress={handleRegister}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator color="white" size="small" />
//                 <Text style={styles.submitButtonText}>Đang tạo tài khoản...</Text>
//               </View>
//             ) : (
//               <Text style={styles.submitButtonText}>Tạo tài khoản</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
//             onPress={() => navigation.navigate('Login')}
//             disabled={isLoading}
//           >
//             <Text style={[styles.loginButtonText, isLoading && styles.loginButtonTextDisabled]}>
//               Đã có tài khoản? Đăng nhập
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

const styles = StyleSheet.create({
  // --- NEW STYLES for Tutor Fields ---
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
  addButton: {
    marginTop: 8,
  },
  addButtonText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  fieldDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  dropdown: {
    borderColor: '#d1d5db',
  },
  levelPickerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  levelButtonActive: {
    backgroundColor: '#2563eb',
  },
  levelButtonText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500',
  },
  levelButtonTextActive: {
    color: 'white',
  },
  radioContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioText: {
    fontSize: 14,
    color: '#374151',
  },
  priceTable: {
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    paddingTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  priceLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    textAlign: 'right',
  },

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