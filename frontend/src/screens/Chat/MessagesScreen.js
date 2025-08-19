import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { mockChatRooms } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';

const MessagesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    try {
      // TODO: API call - Fetch user's chat rooms
      // GET /api/chats/
      // Return list of chat rooms with:
      // - tutorId, tutorName, tutorAvatar
      // - lastMessage, lastMessageTime
      // - unreadCount
      // Replace mockChatRooms with actual API response
      setChatRooms(mockChatRooms);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    }
  };

  const openChat = (chatRoom) => {
    navigation.navigate('Chat', {
      tutorId: chatRoom.tutorId,
      tutorName: chatRoom.tutorName,
    });
  };

  const renderChatRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.chatRoomItem}
      onPress={() => openChat(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.tutorAvatar}</Text>
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.tutorName}>{item.tutorName}</Text>
          <Text style={styles.messageTime}>{item.lastMessageTime}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('chat.title', 'Messages')}</Text>
      </View>

      {/* Chat Rooms List */}
      <FlatList
        data={chatRooms}
        renderItem={renderChatRoom}
        keyExtractor={(item) => item.id.toString()}
        style={styles.chatList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  chatList: {
    flex: 1,
  },
  chatRoomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tutorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
  unreadBadge: {
    backgroundColor: '#2563eb',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginLeft: 76,
  },
});

export default MessagesScreen;