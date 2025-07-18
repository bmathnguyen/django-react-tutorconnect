# Marks a Django view function as an API endpoint.

# Wraps your function so that:

# request is a DRF Request (not the plain Django HttpRequest).

# You can return a DRF Response (not HttpResponse/JsonResponse).

# DRF’s authentication, permission checks, throttling, and content negotiation run automatically.

# Unsupported HTTP methods automatically get a 405 Method Not Allowed response.
from rest_framework import status, generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg
from django.shortcuts import get_object_or_404
from django.core.cache import cache

from .models import *
from .serializers import *

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        # Update last activity
        user.update_last_activity()
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Successfully logged out"})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response(UserSerializer(request.user).data)

# Tutor Views
class TutorListView(generics.ListAPIView):
    serializer_class = TutorListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__first_name', 'user__last_name', 'university', 'bio']
    ordering_fields = ['hourly_rate', 'rating_average']
    ordering = ['-rating_average']
    
    def get_queryset(self):
        queryset = TutorProfile.objects.select_related('user').prefetch_related(
            'tutor_subjects__subject'
        ).filter(user__is_active=True)
        
        # Cache key for this query
        cache_key = f"tutors_{self.request.GET.urlencode()}"
        cached_result = cache.get(cache_key)
        
        if cached_result:
            return cached_result
        
        # Apply filters
        subjects = self.request.query_params.getlist('subjects[]')
        if subjects:
            queryset = queryset.filter(tutor_subjects__subject__id__in=subjects).distinct()
        
        min_price = self.request.query_params.get('min_price')
        if min_price:
            queryset = queryset.filter(hourly_rate__gte=min_price)
        
        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(hourly_rate__lte=max_price)
        
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.filter(rating_average__gte=min_rating)
        
        is_verified = self.request.query_params.get('is_verified')
        if is_verified == 'true':
            queryset = queryset.filter(is_verified=True)
        
        # Cache the result
        cache.set(cache_key, queryset, 300)  # 5 minutes
        return queryset

class TutorDetailView(generics.RetrieveAPIView):
    serializer_class = TutorDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    
    def get_queryset(self):
        return TutorProfile.objects.select_related('user').prefetch_related(
            'achievements', 'tutor_subjects__subject', 'reviews_received__student__user'
        )
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Record view if user is a student
        if hasattr(request.user, 'student_profile'):
            TutorView.objects.get_or_create(
                student=request.user.student_profile,
                tutor=instance
            )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# Tutor Interaction Views
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

# User Data Views
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

# Chat Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_rooms_view(request):
    user = request.user
    
    if hasattr(user, 'student_profile'):
        chat_rooms = ChatRoom.objects.filter(
            student=user.student_profile
        ).select_related('student__user', 'tutor__user').order_by('-last_message_at')
    elif hasattr(user, 'tutor_profile'):
        chat_rooms = ChatRoom.objects.filter(
            tutor=user.tutor_profile
        ).select_related('student__user', 'tutor__user').order_by('-last_message_at')
    else:
        chat_rooms = ChatRoom.objects.none()
    
    serializer = ChatRoomSerializer(chat_rooms, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_chat_room_view(request):
    if not hasattr(request.user, 'student_profile'):
        return Response({"error": "Only students can create chat rooms"}, status=status.HTTP_403_FORBIDDEN)
    
    tutor_id = request.data.get('tutor_id')
    if not tutor_id:
        return Response({"error": "tutor_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    tutor = get_object_or_404(TutorProfile, id=tutor_id)
    student = request.user.student_profile
    
    chat_room, created = ChatRoom.objects.get_or_create(
        student=student,
        tutor=tutor
    )
    
    serializer = ChatRoomSerializer(chat_room, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_messages_view(request, room_id):
    chat_room = get_object_or_404(ChatRoom, id=room_id)
    
    # Check access
    user = request.user
    if hasattr(user, 'student_profile') and chat_room.student.user != user:
        return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)
    elif hasattr(user, 'tutor_profile') and chat_room.tutor.user != user:
        return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)
    
    messages = chat_room.messages.select_related('sender').order_by('created_at')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message_view(request, room_id):
    chat_room = get_object_or_404(ChatRoom, id=room_id)
    
    # Check access
    user = request.user
    if hasattr(user, 'student_profile') and chat_room.student.user != user:
        return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)
    elif hasattr(user, 'tutor_profile') and chat_room.tutor.user != user:
        return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)
    
    content = request.data.get('content')
    if not content:
        return Response({"error": "Content is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    message = Message.objects.create(
        chat_room=chat_room,
        sender=user,
        content=content
    )
    
    # Update chat room's last_message_at
    chat_room.last_message_at = message.created_at
    chat_room.save(update_fields=['last_message_at'])
    
    serializer = MessageSerializer(message)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# Review Views
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

# File Upload View
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

# Metadata Views
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