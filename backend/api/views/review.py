# views/review.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from api.models import TutorProfile, Review
from api.serializers import ReviewSerializer, CreateReviewSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tutor_reviews_view(request, tutor_id):
    tutor = get_object_or_404(TutorProfile, id=tutor_id)
    reviews = tutor.reviews_received.select_related('student__user').order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review_view(request, tutor_id):
    if not hasattr(request.user, 'student_profile'):
        return Response({"error": "Only students can submit reviews"}, status=status.HTTP_403_FORBIDDEN)
    
    tutor = get_object_or_404(TutorProfile, id=tutor_id)
    
    # Check if student already reviewed this tutor
    if Review.objects.filter(student=request.user.student_profile, tutor=tutor).exists():
        return Response({"error": "You have already reviewed this tutor"}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = CreateReviewSerializer(data=request.data, context={
        'request': request,
        'tutor': tutor
    })
    
    if serializer.is_valid():
        review = serializer.save()
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)