# api/filters.py
import django_filters
from .models import TutorProfile

class TutorSearchFilter(django_filters.FilterSet):
    """
    A dedicated FilterSet for the advanced tutor search feature.
    Handles complex filtering for class levels, subjects, price, and location.
    """
    classes = django_filters.CharFilter(method='filter_by_classes', label='Filter by class grades (e.g., "1,5,10")')
    subjects = django_filters.CharFilter(field_name='tutor_subjects__subject__name', lookup_expr='icontains', label='Filter by subject name (contains)')
    max_price = django_filters.NumberFilter(field_name='price_min', lookup_expr='lte', label='Maximum price (tutor\'s min price <= value)')

    class Meta:
        model = TutorProfile
        fields = ['subjects', 'max_price', 'classes']

    def filter_by_classes(self, queryset, name, value):
        """
        Custom filter to map individual grade numbers to ClassLevel groups.
        Input `value` is a comma-separated string of grades (e.g., "1,2,10").
        """
        try:
            grades = [int(g.strip()) for g in value.split(',') if g.strip().isdigit()]
        except (ValueError, TypeError):
            return queryset.none()

        if not grades:
            return queryset

        class_level_names = set()
        for grade in grades:
            if 1 <= grade <= 5:
                class_level_names.add('Grade 1-5')
            elif 6 <= grade <= 9:
                class_level_names.add('Grade 6-9')
            elif 10 <= grade <= 12:
                class_level_names.add('Grade 10-12')

        if not class_level_names:
            return queryset

        return queryset.filter(class_levels__name__in=list(class_level_names)).distinct()


# class TutorProfileFilter(django_filters.FilterSet):
#     """
#     A consolidated FilterSet for TutorProfile to handle all searching and filtering.
#     Supports filtering by price, rating, verification status, subjects (by name),
#     and class levels (by grade number).
#     """
#     min_price = django_filters.NumberFilter(field_name="price_max", lookup_expr='gte')
#     max_price = django_filters.NumberFilter(field_name="price_min", lookup_expr='lte')
#     min_rating = django_filters.NumberFilter(field_name="rating_average", lookup_expr='gte')
#     is_verified = django_filters.BooleanFilter(field_name='is_verified')

#     # Advanced search filters merged from TutorSearchFilter
#     subjects = django_filters.CharFilter(field_name='tutor_subjects__subject__name', lookup_expr='icontains', label='Filter by subject name (contains)')
#     classes = django_filters.CharFilter(method='filter_by_classes', label='Filter by class grades (e.g., "1,5,10")')

#     class Meta:
#         model = TutorProfile
#         fields = [
#             'min_price', 'max_price', 'min_rating', 'is_verified',
#             'subjects', 'classes'
#         ]

#     def filter_by_classes(self, queryset, name, value):
#         """
#         Custom filter to map individual grade numbers to ClassLevel groups.
#         Input `value` is a comma-separated string of grades (e.g., "1,2,10").
#         """
#         try:
#             grades = [int(g.strip()) for g in value.split(',') if g.strip().isdigit()]
#         except (ValueError, TypeError):
#             return queryset.none()  # Return no results if input is invalid

#         if not grades:
#             return queryset

#         class_level_names = set()
#         for grade in grades:
#             if 1 <= grade <= 5:
#                 class_level_names.add('Grade 1-5')
#             elif 6 <= grade <= 9:
#                 class_level_names.add('Grade 6-9')
#             elif 10 <= grade <= 12:
#                 class_level_names.add('Grade 10-12')

#         if not class_level_names:
#             return queryset

#         # Use distinct() to avoid duplicate results when a tutor fits multiple criteria
#         return queryset.filter(class_levels__name__in=list(class_level_names)).distinct()
