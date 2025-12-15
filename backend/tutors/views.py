# tutors/views.py

# Import necessary modules from Django REST Framework and Django
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

# Import relevant models and serializers
from profiles.models import TutorProfile
from interactions.models import TutorView
from tutors.serializers import TutorDetailSerializer, TutorListSerializer
from tutors.filters import TutorSearchFilter

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
            'tutor_subjects__subject', 'reviews_received__student__user'
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


class TutorSearchView(generics.ListAPIView):
    """
    Provides an advanced search endpoint for tutors, with filters for classes,
    subjects, price, and location.
    """
    serializer_class = TutorListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TutorSearchFilter

    def get_queryset(self):
        """
        Builds the base queryset and applies location-specific filtering.
        """
        return TutorProfile.objects.select_related('user').prefetch_related(
            'tutor_subjects__subject', 'class_levels'
        ).filter(user__is_active=True).order_by('-rating_average')
