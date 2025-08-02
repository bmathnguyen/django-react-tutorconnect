import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../config/api';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // /api/users/profile/ returns the profile for current user
        const data = await apiService.getCurrentUser();
        setProfile(data);
      } catch (err) {
        Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    Alert.alert('Thông báo', 'Tính năng đang phát triển');
  };

  const handleSettings = () => {
    Alert.alert('Thông báo', 'Tính năng đang phát triển');
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'Login' }],
            // });
            // navigation.navigate('Login'); // <-- just use navigate if reset isn't working
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 12 }}>Đang tải...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 32 }}>Không tìm thấy thông tin người dùng.</Text>
      </View>
    );
  }

  // Support for both student and tutor
  const isStudent = profile.user_type === 'student' && profile.student_profile;
  const isTutor = profile.user_type === 'tutor' && profile.tutor_profile;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{isStudent ? '👨‍🎓' : '👨‍🏫'}</Text>
        </View>
        <Text style={styles.userName}>
          {profile.first_name} {profile.last_name}
        </Text>
        <Text style={styles.userType}>
          {profile.user_type === 'student' ? 'Học sinh' : 'Gia sư'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color="#6b7280" />
              <Text style={styles.infoText}>Email: {profile.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#6b7280" />
              <Text style={styles.infoText}>Điện thoại: {profile.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="school" size={20} color="#6b7280" />
              <Text style={styles.infoText}>
                Trường: {isStudent ? profile.student_profile?.school : isTutor ? profile.tutor_profile?.university : ''}
              </Text>
            </View>
            {isStudent && (
              <View style={styles.infoRow}>
                <Icon name="class" size={20} color="#6b7280" />
                <Text style={styles.infoText}>Lớp: {profile.student_profile?.grade}</Text>
              </View>
            )}
            {isTutor && (
              <View style={styles.infoRow}>
                <Icon name="star" size={20} color="#f59e0b" />
                <Text style={styles.infoText}>
                  Chuyên ngành: {profile.tutor_profile?.major}
                </Text>
              </View>
            )}
          </View>
        </View>

        {isStudent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mục tiêu học tập</Text>
            <View style={styles.goalsContainer}>
              {profile.student_profile?.learning_goals?.map((goal, idx) => (
                <View key={idx} style={styles.goalTag}>
                  <Text style={styles.goalText}>{goal}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Icon name="edit" size={20} color="#374151" />
            <Text style={styles.actionText}>Chỉnh sửa hồ sơ</Text>
            <Icon name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
            <Icon name="settings" size={20} color="#374151" />
            <Text style={styles.actionText}>Cài đặt</Text>
            <Icon name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="white" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
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
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: 'white',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: '#bfdbfe',
  },
  content: {
    flex: 1,
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
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  goalText: {
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default ProfileScreen;