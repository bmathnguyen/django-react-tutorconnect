// EditProfileScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../config/api';

const CLASSES = ["Lớp 1-5", "Lớp 6-9", "Lớp 10-12"];
const SUBJECTS = ["Toán", "Lý", "Hóa", "Sinh", "Văn", "Anh", "Sử", "Địa"];
const LEVELS = ["Cơ bản", "Nâng cao"];

export default function EditProfileScreen({ navigation, route }) {
  const { user } = useAuth();
  const { profile } = route.params;
  const [schoolMajor, setSchoolMajor] = useState(profile.tutor_profile?.university || "");
  const [bio, setBio] = useState(profile.tutor_profile?.bio || "");
  const [hourlyRate, setHourlyRate] = useState(profile.tutor_profile?.hourly_rate?.toString() || "");
  const [location, setLocation] = useState(profile.tutor_profile?.location || "");
  const [classesCanTeach, setClassesCanTeach] = useState(profile.tutor_profile?.classes_can_teach || []);
  const [subjectPricings, setSubjectPricings] = useState(profile.tutor_profile?.subject_pricings || []);

  // UI for multi-select classes, and inputting subject-pricings, etc...
  // For brevity, this example just sends raw text and arrays.
  // In production, replace with pickers/multi-selects/tables for better UX.

  const handleSave = async () => {
    try {
      await apiService.updateProfile({
        profile_data: {
          university: schoolMajor,
          bio,
          hourly_rate: parseFloat(hourlyRate),
          location,
          classes_can_teach: classesCanTeach,
          subject_pricings: subjectPricings,
        }
      });
      Alert.alert("Cập nhật thành công");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Lỗi", "Cập nhật thất bại");
    }
  };

  return (
    <ScrollView style={{padding: 16}}>
      <Text>Trường + Chuyên ngành</Text>
      <TextInput value={schoolMajor} onChangeText={setSchoolMajor} style={{borderWidth:1, marginBottom: 8}} />
      <Text>Bio</Text>
      <TextInput value={bio} onChangeText={setBio} style={{borderWidth:1, marginBottom: 8}} />
      <Text>Giá tiền mỗi giờ</Text>
      <TextInput value={hourlyRate} onChangeText={setHourlyRate} style={{borderWidth:1, marginBottom: 8}} keyboardType="numeric"/>
      <Text>Vị trí</Text>
      <TextInput value={location} onChangeText={setLocation} style={{borderWidth:1, marginBottom: 8}} />
      <Text>Các lớp nhận dạy (phân cách dấu phẩy):</Text>
      <TextInput value={classesCanTeach.join(",")} onChangeText={t=>setClassesCanTeach(t.split(','))} style={{borderWidth:1, marginBottom: 8}} />
      <Text>Nhập bảng giá (JSON):</Text>
      <TextInput
        value={JSON.stringify(subjectPricings)}
        onChangeText={t => setSubjectPricings(JSON.parse(t))}
        style={{borderWidth:1, marginBottom: 8, minHeight: 60}}
        multiline
      />
      <Button title="Lưu" onPress={handleSave} />
    </ScrollView>
  );
}
