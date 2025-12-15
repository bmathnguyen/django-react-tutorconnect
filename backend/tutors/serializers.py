# tutors/serializers.py
from rest_framework import serializers
from profiles.models import TutorProfile
from interactions.models import TutorLike, TutorSave

class TutorListSerializer(serializers.ModelSerializer):
    """
    Serializes tutor list data for API responses.

    Fields:
        - user: Basic user info (id, first_name, last_name).
        - subjects: Up to 3 subjects the tutor teaches, with proficiency/level.
        - is_liked: Boolean, if the current student user has liked this tutor.
        - is_saved: Boolean, if the current student user has saved this tutor.
    """
    user = serializers.SerializerMethodField()
    subjects = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    
    class Meta:
        model = TutorProfile
        fields = [
            'uuid', 'user', 'education', 'location', 'rating_average', 'total_reviews',
            'profile_image', 'subjects', 'class_levels', 'price_min', 'price_max',
            'is_liked', 'is_saved'
        ]
    
    def get_user(self, obj):
        """
        Returns a dictionary with basic user info.
        """
        return {
            'id': str(obj.user.id),  # Keep user.id for the user subfield (not tutor profile)
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
        }
    
    def get_subjects(self, obj):
        """
        Returns a list of subjects, each with tags and prices.
        Structure: [{'subjectId': 1, 'subjectName': 'Math', 'tags': [{'tag': 'HSGTP', 'price': 150.0}]}]
        """
        result = []
        for ts in obj.tutor_subjects.all():
            tags_data = []
            for tag in ts.tags.all():
                tags_data.append({
                    'tag': tag.tag,
                    'price': tag.price
                })
            
            result.append({
                'subjectId': ts.subject.id,
                'subjectName': ts.subject.name,
                'tags': tags_data
            })
        return result
    
    def get_is_liked(self, obj):
        """
        Returns True if the current authenticated student has liked this tutor.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'student_profile'):
            return TutorLike.objects.filter(student=request.user.student_profile, tutor=obj).exists()
        return False
    
    def get_is_saved(self, obj):
        """
        Returns True if the current authenticated student has saved this tutor.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'student_profile'):
            return TutorSave.objects.filter(student=request.user.student_profile, tutor=obj).exists()
        return False

class TutorDetailSerializer(TutorListSerializer):
    """
    Extends TutorListSerializer for detailed tutor info.

    Adds:
        - bio: Tutor's biography.
        - achievements: Up to 5 achievements as a list of strings/titles.
        - recent_reviews: Up to 5 recent reviews, each as dict with rating, comment, student_name, and created_at.
    """
    achievements = serializers.SerializerMethodField()
    recent_reviews = serializers.SerializerMethodField()
    
    class Meta(TutorListSerializer.Meta):
        fields = TutorListSerializer.Meta.fields + ['bio', 'achievements', 'recent_reviews']
    
    def get_achievements(self, obj):
        """
        Returns achievements list directly from JSONField.
        """
        return obj.achievements if isinstance(obj.achievements, list) else []

    def get_recent_reviews(self, obj):
        """
        Returns up to 5 recent reviews, each including rating, comment, student name, and created_at.
        Assumes reviews_received is related name for Review model with 'rating', 'comment', 'student', and 'created_at'.
        """
        return [
            {
                'rating': review.rating,
                'comment': review.comment,
                'student_name': f"{review.student.user.first_name} {review.student.user.last_name}",
                'created_at': review.created_at
            }
            for review in obj.reviews_received.select_related('student__user').order_by('-created_at')[:5]
        ]

