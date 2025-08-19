# views/tutor.py

# Import necessary modules from Django REST Framework and Django
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Import relevant models and serializers
from api.models import TutorProfile, TutorView
from api.serializers import TutorDetailSerializer

# View individual tutor profile


# Detail view for an individual tutor, tracks student views
class TutorDetailView(generics.RetrieveAPIView):
    """
    API endpoint to retrieve details for a specific tutor.
    Also records a view by the student (if applicable) for analytics.
    """
    serializer_class = TutorDetailSerializer  # Serializes tutor detail data (see serializers/tutor.py)
    permission_classes = [IsAuthenticated]  # Only authenticated users can access
    lookup_field = 'uuid'  # Lookup tutor by UUID 'uuid' field

    def get_queryset(self):
        """
        Returns a queryset with related fields prefetched for efficiency:
        - user (basic user info)
        - achievements (tutor's achievements)
        - tutor_subjects__subject (subjects and subject details)
        - reviews_received__student__user (recent reviews with student info)
        """
        return TutorProfile.objects.select_related('user').prefetch_related(
            'achievements', 'tutor_subjects__subject', 'reviews_received__student__user'
        )

    def retrieve(self, request, *args, **kwargs):
        """
        Handles GET request to fetch tutor details.
        If the requester is a student, records a TutorView for analytics.
        """
        # Get the TutorProfile instance by 'id'
        instance = self.get_object()
        
        # If current user is a student, record a view (for analytics/history)
        if hasattr(request.user, 'student_profile'):
            TutorView.objects.get_or_create(
                student=request.user.student_profile,
                tutor=instance
            )

        # Serialize the tutor profile and return as response
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# ----
# Filtering/Search/Ordering Data & Models:
# 
# Search fields:
#   - user__first_name   (from TutorProfile.user, CustomUser.first_name)
#   - user__last_name    (from TutorProfile.user, CustomUser.last_name)
#   - education          (from TutorProfile.education)
#   - bio                (from TutorProfile.bio)
#
# Filter fields (from TutorProfileFilter):
#   - price_min          (TutorProfile.price_min)
#   - price_max          (TutorProfile.price_max)
#   - rating_average     (TutorProfile.rating_average)
#   - subjects           (TutorProfile.subjects via tutor_subjects__subject)
#   - location           (TutorProfile.location)
#   - is_verified        (TutorProfile.is_verified)
#
# Ordering fields:
#   - price_min          (TutorProfile.price_min)
#   - rating_average     (TutorProfile.rating_average)
#
# Main models: TutorProfile, CustomUser, Subject, TutorSubject
# Field names in queries: see above