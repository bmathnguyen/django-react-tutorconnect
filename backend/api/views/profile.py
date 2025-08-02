# views/profile.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.serializers import UserSerializer


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    user = request.user
    
    # Update user fields
    user_fields = ['first_name', 'last_name', 'phone']
    for field in user_fields:
        if field in request.data:
            setattr(user, field, request.data[field])
    user.save()
    
    # Update profile fields
    profile_data = request.data.get('profile_data', {})
    if hasattr(user, 'student_profile') and profile_data:
        profile = user.student_profile
        profile_fields = ['school', 'grade', 'learning_goals', 'location', 'budget_min', 'budget_max']
        for field in profile_fields:
            if field in profile_data:
                setattr(profile, field, profile_data[field])
        profile.save()
    
    elif hasattr(user, 'tutor_profile') and profile_data:
        profile = user.tutor_profile
        profile_fields = ['university', 'major', 'experience_years', 'bio', 'hourly_rate', 'location', 'availability']
        for field in profile_fields:
            if field in profile_data:
                setattr(profile, field, profile_data[field])
        profile.save()
    
    return Response(UserSerializer(user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_image_view(request):
    if 'image' not in request.FILES:
        return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    image = request.FILES['image']
    
    # Validate file size (5MB limit)
    if image.size > 5 * 1024 * 1024:
        return Response({"error": "File too large. Max 5MB allowed."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
    if image.content_type not in allowed_types:
        return Response({"error": "Invalid file type. Only JPEG and PNG allowed."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Update user profile
    user = request.user
    if hasattr(user, 'student_profile'):
        user.student_profile.profile_image = image
        user.student_profile.save()
        image_url = request.build_absolute_uri(user.student_profile.profile_image.url)
    elif hasattr(user, 'tutor_profile'):
        user.tutor_profile.profile_image = image
        user.tutor_profile.save()
        image_url = request.build_absolute_uri(user.tutor_profile.profile_image.url)
    else:
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({"image_url": image_url})