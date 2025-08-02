# views/metadata.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg

from api.models import Subject, TutorProfile, StudentProfile, Review, ChatRoom
from api.serializers import SubjectSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subjects_list_view(request):
    subjects = Subject.objects.all().order_by('name')
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def platform_stats_view(request):
    stats = {
        'total_tutors': TutorProfile.objects.filter(user__is_active=True).count(),
        'total_students': StudentProfile.objects.filter(user__is_active=True).count(),
        'total_subjects': Subject.objects.count(),
        'total_reviews': Review.objects.count(),
        'average_rating': Review.objects.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0,
        'active_chat_rooms': ChatRoom.objects.filter(is_active=True).count(),
    }
    
    return Response(stats)