# views/chat.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from api.models import TutorProfile, ChatRoom, Message
from api.serializers import ChatRoomSerializer, MessageSerializer


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