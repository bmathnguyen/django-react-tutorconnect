# views/interaction.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from api.models import TutorProfile, TutorLike, TutorSave
from api.serializers import TutorListSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_tutor_view(request, tutor_id):
    if not hasattr(request.user, 'student_profile'):
        return Response({"error": "Only students can like tutors"}, status=status.HTTP_403_FORBIDDEN)
    
    tutor = get_object_or_404(TutorProfile, id=tutor_id)
    student = request.user.student_profile
    
    like, created = TutorLike.objects.get_or_create(student=student, tutor=tutor)
    
    if created:
        return Response({"message": "Tutor liked successfully"})
    else:
        return Response({"message": "Tutor already liked"})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unlike_tutor_view(request, tutor_id):
    if not hasattr(request.user, 'student_profile'):
        return Response({"error": "Only students can unlike tutors"}, status=status.HTTP_403_FORBIDDEN)
    
    tutor = get_object_or_404(TutorProfile, id=tutor_id)
    student = request.user.student_profile
    
    try:
        like = TutorLike.objects.get(student=student, tutor=tutor)
        like.delete()
        return Response({"message": "Tutor unliked successfully"})
    except TutorLike.DoesNotExist:
        return Response({"error": "Like not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_tutor_view(request, tutor_id):
    if not hasattr(request.user, 'student_profile'):
        return Response({"error": "Only students can save tutors"}, status=status.HTTP_403_FORBIDDEN)
    
    tutor = get_object_or_404(TutorProfile, id=tutor_id)
    student = request.user.student_profile
    
    save, created = TutorSave.objects.get_or_create(student=student, tutor=tutor)
    
    if created:
        return Response({"message": "Tutor saved successfully"})
    else:
        return Response({"message": "Tutor already saved"})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unsave_tutor_view(request, tutor_id):
    if not hasattr(request.user, 'student_profile'):
        return Response({"error": "Only students can unsave tutors"}, status=status.HTTP_403_FORBIDDEN)
    
    tutor = get_object_or_404(TutorProfile, id=tutor_id)
    student = request.user.student_profile
    
    try:
        save = TutorSave.objects.get(student=student, tutor=tutor)
        save.delete()
        return Response({"message": "Tutor unsaved successfully"})
    except TutorSave.DoesNotExist:
        return Response({"error": "Save not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def saved_tutors_view(request):
    if not hasattr(request.user, 'student_profile'):
        return Response({"error": "Only students have saved tutors"}, status=status.HTTP_403_FORBIDDEN)
    
    saved_tutors = TutorProfile.objects.filter(
        saves__student=request.user.student_profile
    ).select_related('user').prefetch_related('tutor_subjects__subject')
    
    serializer = TutorListSerializer(saved_tutors, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def liked_tutors_view(request):
    if not hasattr(request.user, 'student_profile'):
        return Response({"error": "Only students have liked tutors"}, status=status.HTTP_403_FORBIDDEN)
    
    liked_tutors = TutorProfile.objects.filter(
        likes__student=request.user.student_profile
    ).select_related('user').prefetch_related('tutor_subjects__subject')
    
    serializer = TutorListSerializer(liked_tutors, many=True, context={'request': request})
    return Response(serializer.data)