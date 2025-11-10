from rest_framework import serializers
from api.models import CustomUser
from .profile import StudentProfileSerializer, TutorProfileSerializer

class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    tutor_profile = TutorProfileSerializer(read_only=True)
    achievements = serializers.SerializerMethodField()
    userId = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    walletBalance = serializers.DecimalField(source='wallet_balance', max_digits=10, decimal_places=2, read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'userId', 'name', 'role', 'email', 'walletBalance', 'createdAt',
            'is_online', 'last_activity',
            'student_profile', 'tutor_profile', 'achievements'
        ]

    def get_userId(self, obj):
        return str(obj.id)

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_role(self, obj):
        return obj.user_type

    def get_achievements(self, obj):
        if obj.user_type == 'tutor' and hasattr(obj, 'tutor_profile'):
            # Show only top 3
            return (obj.tutor_profile.achievements or [])[:3]
        return []
