from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import *

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'description']

class TutorSubjectSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    
    class Meta:
        model = TutorSubject
        fields = ['subject', 'proficiency_level']

class StudentProfileSerializer(serializers.ModelSerializer):
    preferred_subjects = SubjectSerializer(many=True, read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = [
            'school', 'grade', 'learning_goals', 'preferred_subjects',
            'location', 'budget_min', 'budget_max', 'profile_image'
        ]

class TutorProfileSerializer(serializers.ModelSerializer):
    tutor_subjects = TutorSubjectSerializer(many=True, read_only=True)
    
    class Meta:
        model = TutorProfile
        fields = [
            'university', 'major', 'experience_years', 'bio', 'hourly_rate',
            'location', 'is_verified', 'rating_average', 'total_reviews',
            'profile_image', 'tutor_subjects'
        ]

class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    tutor_profile = TutorProfileSerializer(read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'phone', 'user_type',
            'first_name', 'last_name', 'is_online', 'last_activity',
            'student_profile', 'tutor_profile'
        ]

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
            TutorProfile.objects.create(user=user, **profile_data)
        
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

class TutorListSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    subjects = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    
    class Meta:
        model = TutorProfile
        fields = [
            'id', 'user', 'university', 'experience_years', 'hourly_rate',
            'location', 'rating_average', 'total_reviews', 'profile_image',
            'subjects', 'is_liked', 'is_saved'
        ]
    
    def get_user(self, obj):
        return {
            'id': str(obj.user.id),
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
        }
    
    def get_subjects(self, obj):
        return [
            {'name': ts.subject.name, 'proficiency_level': ts.proficiency_level}
            for ts in obj.tutor_subjects.all()[:3]
        ]
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'student_profile'):
            return TutorLike.objects.filter(student=request.user.student_profile, tutor=obj).exists()
        return False
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'student_profile'):
            return TutorSave.objects.filter(student=request.user.student_profile, tutor=obj).exists()
        return False

class TutorDetailSerializer(TutorListSerializer):
    achievements = serializers.SerializerMethodField()
    recent_reviews = serializers.SerializerMethodField()
    
    class Meta(TutorListSerializer.Meta):
        fields = TutorListSerializer.Meta.fields + ['bio', 'achievements', 'recent_reviews']
    
    def get_achievements(self, obj):
        return [
            {
                'title': achievement.title,
                'description': achievement.description,
                'year': achievement.year
            }
            for achievement in obj.achievements.all()[:5]
        ]
    
    def get_recent_reviews(self, obj):
        return [
            {
                'rating': review.rating,
                'comment': review.comment,
                'student_name': f"{review.student.user.first_name} {review.student.user.last_name}",
                'created_at': review.created_at
            }
            for review in obj.reviews_received.order_by('-created_at')[:5]
        ]

class ChatRoomSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = ['id', 'other_user', 'created_at', 'last_message_at', 'last_message', 'unread_count']
    
    def get_other_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if hasattr(request.user, 'student_profile'):
                return {
                    'id': str(obj.tutor.user.id),
                    'name': f"{obj.tutor.user.first_name} {obj.tutor.user.last_name}",
                    'user_type': 'tutor',
                    'profile_image': obj.tutor.profile_image.url if obj.tutor.profile_image else None,
                }
            elif hasattr(request.user, 'tutor_profile'):
                return {
                    'id': str(obj.student.user.id),
                    'name': f"{obj.student.user.first_name} {obj.student.user.last_name}",
                    'user_type': 'student',
                    'profile_image': obj.student.profile_image.url if obj.student.profile_image else None,
                }
        return None
    
    def get_last_message(self, obj):
        last_message = obj.messages.first()
        if last_message:
            return {
                'content': last_message.content,
                'created_at': last_message.created_at,
                'sender_id': str(last_message.sender.id),
            }
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'content', 'message_type', 'is_read', 'created_at', 'sender']
    
    def get_sender(self, obj):
        return {
            'id': str(obj.sender.id),
            'name': f"{obj.sender.first_name} {obj.sender.last_name}",
            'user_type': obj.sender.user_type,
        }

class ReviewSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = ['id', 'student', 'rating', 'comment', 'created_at']
    
    def get_student(self, obj):
        return {
           'id': str(obj.student.user.id),
           'name': f"{obj.student.user.first_name} {obj.student.user.last_name}",
           'school': obj.student.school,
       }
    
class CreateReviewSerializer(serializers.ModelSerializer):
   class Meta:
       model = Review
       fields = ['rating', 'comment']
   
   def create(self, validated_data):
       tutor = self.context['tutor']
       student = self.context['request'].user.student_profile
       
       review = Review.objects.create(
           student=student,
           tutor=tutor,
           **validated_data
       )
       
       # Update tutor's rating
       tutor.update_rating()
       
       return review