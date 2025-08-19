import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import apiService from '../../config/api';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { language, currency, setLanguage, setCurrency } = useLanguage();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // /api/users/profile/ returns the profile for current user
        const data = await apiService.getCurrentUser();
        setProfile(data);
      } catch (err) {
        Alert.alert(t('common.error'), t('errors.unknown'));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    Alert.alert('Under Development', 'Feature under development');
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setShowLanguageModal(false);
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setShowCurrencyModal(false);
  };

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      'Are you sure you want to logout?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.logout'),
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
        <Text style={{ marginTop: 12 }}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 32 }}>{t('errors.notFound')}</Text>
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
          {profile.user_type === 'student' ? t('profile.student') : t('profile.tutor')}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Language & Currency Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowLanguageModal(true)}>
            <Icon name="language" size={20} color="#374151" />
            <Text style={styles.actionText}>{t('profile.language')}</Text>
            <Text style={styles.currentValue}>
              {language === 'vi' ? t('profile.vietnamese') : t('profile.english')}
            </Text>
            <Icon name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowCurrencyModal(true)}>
            <Icon name="attach-money" size={20} color="#374151" />
            <Text style={styles.actionText}>{t('profile.currency')}</Text>
            <Text style={styles.currentValue}>{currency}</Text>
            <Icon name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.personalInfo')}</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color="#6b7280" />
              <Text style={styles.infoText}>Email: {profile.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#6b7280" />
              <Text style={styles.infoText}>Phone number: {profile.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="school" size={20} color="#6b7280" />
              <Text style={styles.infoText}>
                School: {isStudent ? profile.student_profile?.school : isTutor ? profile.tutor_profile?.university : ''}
              </Text>
            </View>
            {isStudent && (
              <View style={styles.infoRow}>
                <Icon name="class" size={20} color="#6b7280" />
                <Text style={styles.infoText}>Grade: {profile.student_profile?.grade}</Text>
              </View>
            )}
            {isTutor && (
              <View style={styles.infoRow}>
                <Icon name="star" size={20} color="#f59e0b" />
                <Text style={styles.infoText}>
                  Major: {profile.tutor_profile?.major}
                </Text>
              </View>
            )}
          </View>
        </View>

        {isStudent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning Goals</Text>
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
            <Text style={styles.actionText}>{t('profile.editProfile')}</Text>
            <Icon name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="white" />
            <Text style={styles.logoutText}>{t('auth.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.language')}</Text>
            
            <TouchableOpacity
              style={[styles.modalOption, language === 'vi' && styles.selectedOption]}
              onPress={() => handleLanguageChange('vi')}
            >
              <Text style={[styles.modalOptionText, language === 'vi' && styles.selectedText]}>
                {t('profile.vietnamese')}
              </Text>
              {language === 'vi' && <Icon name="check" size={20} color="#2563eb" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalOption, language === 'en' && styles.selectedOption]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[styles.modalOptionText, language === 'en' && styles.selectedText]}>
                {t('profile.english')}
              </Text>
              {language === 'en' && <Icon name="check" size={20} color="#2563eb" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Currency Selection Modal */}
      <Modal
        visible={showCurrencyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.currency')}</Text>
            
            <TouchableOpacity
              style={[styles.modalOption, currency === 'VND' && styles.selectedOption]}
              onPress={() => handleCurrencyChange('VND')}
            >
              <Text style={[styles.modalOptionText, currency === 'VND' && styles.selectedText]}>
                Vietnamese Dong (VND)
              </Text>
              {currency === 'VND' && <Icon name="check" size={20} color="#2563eb" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalOption, currency === 'SGD' && styles.selectedOption]}
              onPress={() => handleCurrencyChange('SGD')}
            >
              <Text style={[styles.modalOptionText, currency === 'SGD' && styles.selectedText]}>
                Singapore Dollar (SGD)
              </Text>
              {currency === 'SGD' && <Icon name="check" size={20} color="#2563eb" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowCurrencyModal(false)}
            >
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  currentValue: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#eff6ff',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  modalCancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default ProfileScreen;