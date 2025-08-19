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
import { useTranslation } from '../../hooks/useTranslation';

import DropDownPicker from 'react-native-dropdown-picker';

// Define choices outside the component
// const CLASS_LEVELS = ["Lớp 1-5", "Lớp 6-9", "Lớp 10-12"];
const CLASS_LEVELS = ["Sec 1", "Sec 2", "Sec 3", "Sec 4", "JC 1", "JC 2"];

// const SUBJECTS = [
//   "Toán", "Anh", "Lý", "Hóa", "Văn", "Sinh", "Sử", "Địa", "Tin", "GDCD", "Khác"
// ];
const SUBJECTS = [
  "Math", 
  "English", 
  "Physics", 
  "Chemistry", 
  "Biology", 
  "History", 
  "Geography", 
  "Economics", 
  "Literature", 
  "Design and Technology", 
  "Computer Studies", 
  "Art", 
  "Music", 
  "Physical Education", 
  "Social Studies", 
  "Mother Tongue (Chinese, Malay, Tamil)", 
  "Other"
];
// const LEVELS = ["Cơ Bản", "Nâng Cao"];
const LEVELS = ["Basic", "Advanced"];

const RegisterScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
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
    grade: 'Sec 1',
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
    location: 'kentridge',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

  // useEffect(() => {
  //   if (userType === 'tutor') {
  //     fetch('http://127.0.0.1:8000/api/subjects/')
  //       .then(res => res.json())
  //       .then(data => setSubjectList(data))
  //       .catch(err => console.log('Failed to load subjects', err));
  //   }
  // }, [userType]);

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
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      Alert.alert('Error', 'Invalid email');
      return false;
    }
    if (!formData.username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.passwordConfirm) {
      Alert.alert('Error', 'Passwords must match');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!/^(\d{8}|\d{10})$/.test(formData.phone.trim())) {
      Alert.alert('Error', 'Phone number must be 8 or 10 digits');
      return false;
    }
    if (!formData.school.trim()) {
      Alert.alert('Error', userType === 'student' ? 'Please enter your school' : 'Please enter your education');
      return false;
    }
    // Tutor-specific
    if (userType === 'tutor') {
      if (
        !formData.classLevels.length ||
        !formData.subjects.length ||
        formData.subjects.some(s => !s.name.trim())
      ) {
        Alert.alert('Error', 'Please select your subjects and class levels.');
        return false;
      }
      if (!formData.useSamePrice && Object.values(formData.prices).some(v => !v || isNaN(v) || v <= 0)) {
        Alert.alert('Error', 'Please enter valid prices for all subjects and levels.');
        return false;
      }
      if (formData.useSamePrice && (!formData.singlePrice || isNaN(formData.singlePrice) || formData.singlePrice <= 0)) {
        Alert.alert('Error', 'Please enter a valid price.');
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
      Alert.alert('Success', 'Registration successful! Welcome to TutorConnect.', [{ text: 'OK' }]);
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message.includes('email') && error.message.includes('already exists')) {
        errorMessage = 'Email already exists. Please choose a different email.';
      } else if (error.message.includes('username') && error.message.includes('already exists')) {
        errorMessage = 'Username already exists. Please choose a different username.';
      } else if (error.message.includes('phone') && error.message.includes('already exists')) {
        errorMessage = 'Phone number already exists.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Password is too weak. Please choose a different password.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please try again.';
      }
      Alert.alert('Error', errorMessage);
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
            <Text style={styles.title}>Create Account</Text>
          </View>

          {/* User Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Type</Text>
            <View style={styles.userTypeButtons}>
              <TouchableOpacity
                style={[styles.userTypeButton, userType === 'student' && styles.userTypeButtonActive]}
                onPress={() => setUserType('student')}
                disabled={isLoading}
              >
                <Text style={[styles.userTypeButtonText, userType === 'student' && styles.userTypeButtonTextActive]}>
                  Student
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.userTypeButton, userType === 'tutor' && styles.userTypeButtonActive]}
                onPress={() => setUserType('tutor')}
                disabled={isLoading}
              >
                <Text style={[styles.userTypeButtonText, userType === 'tutor' && styles.userTypeButtonTextActive]}>
                  Tutor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Bill"
                  value={formData.lastName}
                  onChangeText={value => updateFormData('lastName', value)}
                  editable={!isLoading}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Ng"
                  value={formData.firstName}
                  onChangeText={value => updateFormData('firstName', value)}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username *</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="billng123"
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
              <Text style={styles.label}>Password *</Text>
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
              <Text style={styles.label}>Confirm Password *</Text>
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
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="1234 5678"
                value={formData.phone}
                onChangeText={value => updateFormData('phone', value)}
                keyboardType="phone-pad"
                maxLength={10}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{userType === 'student' ? 'Current School *' : 'Education (School - Major) *'}</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder={userType === 'student' ? 'Raffles Institution' : 'NUS - Computer Science'}
                value={userType === 'student' ? formData.school : formData.education}
                onChangeText={value => updateFormData(userType === 'student' ? 'school' : 'education', value)}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Student fields */}
          {userType === 'student' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Student Information</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Grade</Text>
                <View style={styles.gradeContainer}>
                  
                  {['Sec 1', 'Sec 2', 'Sec 3', 'Sec 4', 'JC 1', 'JC 2'].map(grade => (
                    <TouchableOpacity
                      key={grade}
                      style={[styles.gradeOption, formData.grade === grade && styles.gradeOptionActive]}
                      onPress={() => updateFormData('grade', grade)}
                      disabled={isLoading}
                    >
                      <Text style={[styles.gradeOptionText, formData.grade === grade && styles.gradeOptionTextActive]}>{grade}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Learning Goals</Text>
                <View style={styles.checkboxContainer}>
                  {['O Levels', 'A Levels', 'IB'].map(goal => (
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
              <Text style={styles.sectionTitle}>Tutor Information</Text>

              {/* Achievements */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Top 3 Achievements</Text>
                {formData.achievements.map((a, idx) => (
                  <View key={idx} style={styles.rowCentered}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder={`Achievement #${idx + 1}`}
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
                    <Text style={styles.addButtonText}>+ Add Achievement</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.fieldDescription}>Add your top 3 achievements. These will be prominently displayed on your profile.</Text>
              </View>

              {/* Class Levels */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Classes Teaching:</Text>
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
                <Text style={styles.label}>Subjects Teaching:</Text>
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
                        placeholder="Select Subject"
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
                  <Text style={styles.addButtonText}>+ Add Subject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

              {userType === 'tutor' && (
                <>
                  {/* Pricing UI */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Set prices (SGD/hour)</Text>
                    <View style={styles.radioContainer}>
                      <TouchableOpacity style={styles.radioOption} onPress={() => updateFormData('useSamePrice', true)} disabled={isLoading}>
                        <Icon name={formData.useSamePrice ? 'radio-button-checked' : 'radio-button-unchecked'} size={20} color="#2563eb" />
                        <Text style={styles.radioText}>Use same price for all subjects</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.radioOption} onPress={() => updateFormData('useSamePrice', false)} disabled={isLoading}>
                        <Icon name={!formData.useSamePrice ? 'radio-button-checked' : 'radio-button-unchecked'} size={20} color="#2563eb" />
                        <Text style={styles.radioText}>Set different prices for each subject</Text>
                      </TouchableOpacity>
                    </View>

                    {formData.useSamePrice ? (
                      <TextInput
                        style={styles.input}
                        placeholder="Enter single price (SGD/hour)"
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
                              placeholder="Enter price (SGD)"
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
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                      style={[styles.input, styles.textArea, error && styles.inputError]}
                      placeholder="Share about your experience and teaching methods..."
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
                <Text style={styles.submitButtonText}>Creating account...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          >
            <Text style={[styles.loginButtonText, isLoading && styles.loginButtonTextDisabled]}>
              {t('auth.alreadyHaveAccount', 'Already have an account? Login')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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