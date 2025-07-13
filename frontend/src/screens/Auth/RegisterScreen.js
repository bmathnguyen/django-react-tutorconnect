import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegisterScreen = ({ navigation, route }) => {
  const userType = route.params?.userType || 'student';
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    school: '',
    grade: 'Lớp 10',
    major: '',
    experience: '',
    goals: [],
  });

  // helper function to update form data `formData`
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // helper function to add goals
  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.phone || !formData.school) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      // TODO: API call - Implement user registration with Supabase
      // 1. Create user account with Supabase Auth
      // 2. Store additional user profile data (name, phone, school, etc.)
      // 3. Handle different user types (student/tutor)
      // 4. Create user profile in database with user type specific fields
      // await registerAPI(formData, userType);
      // Simulate API call, to be replaced with actual API logic
      
      Alert.alert('Thành công', 'Đăng ký thành công!', [
        { text: 'OK', onPress: () => navigation.replace('MainApp') }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng ký thất bại');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Họ và tên *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số điện thoại *</Text>
            <TextInput
              style={styles.input}
              placeholder="0123456789"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {userType === 'student' ? 'Trường học hiện tại *' : 'Trường đại học *'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={userType === 'student' ? 'THPT Nguyễn Huệ' : 'Đại học Bách Khoa Hà Nội'}
              value={formData.school}
              onChangeText={(value) => updateFormData('school', value)}
            />
          </View>
        </View>

        {/* Student-specific fields */}
        {userType === 'student' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin học tập</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Lớp</Text>
                <View style={styles.pickerContainer}>
                  {['Lớp 10', 'Lớp 11', 'Lớp 12'].map((grade) => (
                    <TouchableOpacity
                      key={grade}
                      style={[
                        styles.pickerOption,
                        formData.grade === grade && styles.pickerOptionActive
                      ]}
                      onPress={() => updateFormData('grade', grade)}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.grade === grade && styles.pickerOptionTextActive
                      ]}>
                        {grade}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mục tiêu học tập</Text>
                <View style={styles.checkboxContainer}>
                  {['Thi THPTQG', 'Thi chuyên', 'Học bổ trợ'].map((goal) => (
                    <TouchableOpacity
                      key={goal}
                      style={styles.checkboxItem}
                      onPress={() => toggleGoal(goal)}
                    >
                      <Icon
                        name={formData.goals.includes(goal) ? 'check-box' : 'check-box-outline-blank'}
                        size={20}
                        color="#2563eb"
                      />
                      <Text style={styles.checkboxText}>{goal}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}

        {/* Tutor-specific fields */}
        {userType === 'tutor' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chuyên môn</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Chuyên ngành *</Text>
              <TextInput
                style={styles.input}
                placeholder="Toán ứng dụng"
                value={formData.major}
                onChangeText={(value) => updateFormData('major', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kinh nghiệm (năm) *</Text>
              <TextInput
                style={styles.input}
                placeholder="5"
                value={formData.experience}
                onChangeText={(value) => updateFormData('experience', value)}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
          <Text style={styles.submitButtonText}>Hoàn thành</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
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
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerOption: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pickerOptionActive: {
    backgroundColor: '#2563eb',
  },
  pickerOptionText: {
    color: '#374151',
    fontSize: 14,
  },
  pickerOptionTextActive: {
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
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;