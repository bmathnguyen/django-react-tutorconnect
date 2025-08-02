from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from api.models import CustomUser, StudentProfile, TutorProfile
from .profile import TutorProfileSerializer

# Register User
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    profile_data = serializers.JSONField(write_only=True, required=False)
    
    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'phone', 'user_type', 'first_name', 'last_name', 'profile_data'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        profile_data = validated_data.pop('profile_data', {})
        
        user = CustomUser.objects.create_user(**validated_data)
        
        # Create profile
        if user.user_type == 'student':
            StudentProfile.objects.create(user=user, **profile_data)
        elif user.user_type == 'tutor':
            # Use TutorProfileSerializer to handle creation, including subjects
            profile_data['user'] = user.id  # Add user to profile data
            tutor_serializer = TutorProfileSerializer(data=profile_data)
            if tutor_serializer.is_valid(raise_exception=True):
                tutor_serializer.save(user=user) # Pass user object to save
        
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs
