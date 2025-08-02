from rest_framework import serializers
from api.models import CustomUser
from .profile import StudentProfileSerializer, TutorProfileSerializer

class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    tutor_profile = TutorProfileSerializer(read_only=True)
    achievements = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'phone', 'user_type',
            'first_name', 'last_name', 'is_online', 'last_activity',
            'student_profile', 'tutor_profile', 'achievements'
        ]
    
    def get_achievements(self, obj):
        if obj.user_type == 'tutor' and hasattr(obj, 'tutor_profile'):
            # Show only top 3
            return (obj.tutor_profile.achievements or [])[:3]
        return []
