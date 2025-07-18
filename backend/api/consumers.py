import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import ChatRoom, Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        
        # Verify user has access to this chat room
        has_access = await self.verify_chat_access()
        if not has_access:
            await self.close()
            return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
        # Update user online status
        await self.update_user_status(True)
        
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # Update user online status
        await self.update_user_status(False)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'message')
            
            if message_type == 'message':
                content = data['content']
                
                # Save message to database
                message = await self.save_message(content)
                
                # Send message to room group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': {
                            'id': str(message.id),
                            'content': message.content,
                            'sender_id': str(message.sender.id),
                            'sender_name': message.sender.get_full_name(),
                            'created_at': message.created_at.isoformat(),
                            'message_type': message.message_type,
                        }
                    }
                )
            
            elif message_type == 'typing':
                # Handle typing indicators
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'typing_status',
                        'user_id': str(self.scope['user'].id),
                        'is_typing': data.get('is_typing', False)
                    }
                )
                
        except Exception as e:
            await self.send(text_data=json.dumps({
                'error': 'Invalid message format'
            }))

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message']
        }))

    async def typing_status(self, event):
        # Don't send typing status to the sender
        if event['user_id'] != str(self.scope['user'].id):
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'user_id': event['user_id'],
                'is_typing': event['is_typing']
            }))

    @database_sync_to_async
    def verify_chat_access(self):
        user = self.scope['user']
        if not user.is_authenticated:
            return False
        
        try:
            chat_room = ChatRoom.objects.get(id=self.room_id)
            if hasattr(user, 'student_profile'):
                return chat_room.student.user == user
            elif hasattr(user, 'tutor_profile'):
                return chat_room.tutor.user == user
            return False
        except ChatRoom.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, content):
        chat_room = ChatRoom.objects.get(id=self.room_id)
        message = Message.objects.create(
            chat_room=chat_room,
            sender=self.scope['user'],
            content=content
        )        
        # Update chat room's last_message_at
        chat_room.last_message_at = message.created_at
        chat_room.save(update_fields=['last_message_at'])
        
        return message

    @database_sync_to_async
    def update_user_status(self, is_online):
        user = self.scope['user']
        user.is_online = is_online
        user.save(update_fields=['is_online'])
