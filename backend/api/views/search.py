# api/views/search.py

from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from api.models import TutorProfile
from api.serializers import TutorListSerializer
from api.filters import TutorSearchFilter

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
        queryset = TutorProfile.objects.select_related('user').prefetch_related(
            'tutor_subjects__subject', 'class_levels'
        ).filter(user__is_active=True).order_by('-rating_average')

        location_type = self.request.query_params.get('location_type')

        # If the search is for 'offline' tutoring, we must filter by the provided city.
        if location_type == 'offline':
            city = self.request.query_params.get('city', None)
            if city:
                # Filter for tutors in the exact same city (case-insensitive).
                queryset = queryset.filter(location__iexact=city)
            else:
                # If searching for offline tutors but no city is provided, return no results.
                return queryset.none()
        # If location_type is 'online' or not specified, no location filter is applied,
        # meaning all tutors are considered regardless of their city.

        return queryset
