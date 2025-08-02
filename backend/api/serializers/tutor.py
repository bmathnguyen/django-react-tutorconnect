from rest_framework import serializers
from api.models import TutorProfile, TutorLike, TutorSave

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
            'id', 'user', 'education', 'location', 'rating_average', 'total_reviews',
            'profile_image', 'subjects', 'class_levels', 'price_min', 'price_max',
            'is_liked', 'is_saved'
        ]
    
    def get_user(self, obj):
        """
        Returns a dictionary with basic user info.
        """
        return {
            'id': str(obj.user.id),
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
        }
    
    def get_subjects(self, obj):
        """
        Returns a list of up to 3 subjects, each as a dict.
        Assumes TutorSubject model has 'subject' and 'level' or 'proficiency_level'.
        """
        # If TutorSubject has 'level' (common), use 'level' instead of 'proficiency_level'
        return [
            {
                'name': ts.subject.name,
                'level': ts.level
            }
            for ts in obj.tutor_subjects.all()[:3]
        ]
    
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
        Returns up to 5 achievement titles (as strings).
        Assumes obj.achievements is a queryset of achievement objects with a 'title' attribute.
        """
        # If obj.achievements is a queryset, fetch titles
        return [ach.title for ach in getattr(obj, 'achievements', []).all()[:5]] if hasattr(getattr(obj, 'achievements', None), 'all') else (getattr(obj, 'achievements', [])[:5] if obj.achievements else [])

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