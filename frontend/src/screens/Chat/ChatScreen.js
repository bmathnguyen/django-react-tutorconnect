import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { mockMessages } from '../../data/mockData';

const ChatScreen = ({ navigation, route }) => {
  const { tutorId, tutorName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    // Set header title
    navigation.setOptions({
      headerTitle: tutorName || 'Chat',
      headerRight: () => (
        <TouchableOpacity style={styles.phoneButton}>
          <Icon name="phone" size={24} color="white" />
        </TouchableOpacity>
      ),
    });

    // Load messages
    loadMessages();
  }, [tutorId, tutorName]);

  const loadMessages = async () => {
    try {
      // TODO: API call - Fetch chat messages for specific tutor
      // GET /api/chats/{tutorId}/messages/
      // Return messages with:
      // - id, text, sender (student/tutor)
      // - time, tutorId
      // Replace mockMessages filter with actual API call
      const chatMessages = mockMessages.filter(msg => msg.tutorId === tutorId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: 'student',
      time: new Date().toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      tutorId
    };

    try {
      // TODO: API call - Send new message
      // POST /api/chats/{tutorId}/messages/
      // Send message data:
      // - text, sender, tutorId
      // Handle real-time updates (WebSocket/Supabase Realtime)
      // Update message list after successful send
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'student' ? styles.studentMessage : styles.tutorMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'student' ? styles.studentBubble : styles.tutorBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'student' ? styles.studentText : styles.tutorText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.sender === 'student' ? styles.studentTime : styles.tutorTime
        ]}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Icon name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  phoneButton: {
    marginRight: 16,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  studentMessage: {
    alignItems: 'flex-end',
  },
  tutorMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  studentBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  tutorBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  studentText: {
    color: 'white',
  },
  tutorText: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  studentTime: {
    color: '#bfdbfe',
  },
  tutorTime: {
    color: '#6b7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
});

export default ChatScreen;