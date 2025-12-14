# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from users.models import CustomUser
from profiles.serializers import StudentProfileSerializer, TutorProfileSerializer

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
        errors = {}
        # Password match
        if attrs.get('password') != attrs.get('password_confirm'):
            errors['password_confirm'] = ['Passwords do not match.']
        # Password strength
        try:
            validate_password(attrs.get('password'))
        except serializers.ValidationError as e:
            errors['password'] = list(e.messages)
        # Email required/valid
        if not attrs.get('email'):
            errors['email'] = ['Email is required.']
        # User type required
        if not attrs.get('user_type'):
            errors['user_type'] = ['User type is required.']
        # # First/last name required
        # if not attrs.get('first_name'):
        #     errors['first_name'] = ['First name is required.']
        # if not attrs.get('last_name'):
        #     errors['last_name'] = ['Last name is required.']
        if errors:
            raise serializers.ValidationError(errors)
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        profile_data = validated_data.pop('profile_data', {})
        validated_data['username'] = validated_data['email']
        user = CustomUser.objects.create_user(**validated_data)
        
        # Create profile
        if user.user_type == 'student':
            from profiles.models import StudentProfile
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

