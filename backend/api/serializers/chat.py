from rest_framework import serializers
from api.models import ChatRoom, Message

class ChatRoomSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = ['id', 'other_user', 'created_at', 'last_message_at', 'last_message', 'unread_count']
    
    def get_other_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if hasattr(request.user, 'student_profile'):
                return {
                    'id': str(obj.tutor.user.id),
                    'name': f"{obj.tutor.user.first_name} {obj.tutor.user.last_name}",
                    'user_type': 'tutor',
                    'profile_image': obj.tutor.profile_image.url if obj.tutor.profile_image else None,
                }
            elif hasattr(request.user, 'tutor_profile'):
                return {
                    'id': str(obj.student.user.id),
                    'name': f"{obj.student.user.first_name} {obj.student.user.last_name}",
                    'user_type': 'student',
                    'profile_image': obj.student.profile_image.url if obj.student.profile_image else None,
                }
        return None
    
    def get_last_message(self, obj):
        last_message = obj.messages.first()
        if last_message:
            return {
                'content': last_message.content,
                'created_at': last_message.created_at,
                'sender_id': str(last_message.sender.id),
            }
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'content', 'message_type', 'is_read', 'created_at', 'sender']
    
    def get_sender(self, obj):
        return {
            'id': str(obj.sender.id),
            'name': f"{obj.sender.first_name} {obj.sender.last_name}",
            'user_type': obj.sender.user_type,
        }
