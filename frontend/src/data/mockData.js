// Mock data for prototype development

export const mockTutors = [
  {
    id: 1,
    name: 'Nguyễn Thị Anh',
    avatar: '👩‍🏫',
    rating: 4.8,
    experience: '5 năm kinh nghiệm',
    school: 'Đại học Bách Khoa Hà Nội',
    major: 'Toán ứng dụng',
    graduation: '2020',
    achievements: [
      'Giải nhất Olympic Toán học sinh viên',
      'Thủ khoa ngành Toán ứng dụng',
      '3 năm kinh nghiệm dạy THPT'
    ],
    bio: 'Tôi là giáo viên Toán với 5 năm kinh nghiệm giảng dạy. Chuyên luyện thi THPTQG và thi chuyên với tỷ lệ đỗ cao.',
    subjects: ['Toán', 'Lý'],
    price: '500k/buổi',
    isSaved: false
  },
  {
    id: 2,
    name: 'Trần Văn Bình',
    avatar: '👨‍🏫',
    rating: 4.6,
    experience: '3 năm kinh nghiệm',
    school: 'Đại học Sư phạm Hà Nội',
    major: 'Sư phạm Văn',
    graduation: '2021',
    achievements: [
      'Thủ khoa ngành Sư phạm Văn',
      'Giải nhì cuộc thi Văn học trẻ',
      'Chuyên luyện thi chuyên Văn'
    ],
    bio: 'Giáo viên Văn học với phương pháp giảng dạy hiện đại, giúp học sinh hiểu sâu và yêu thích môn Văn.',
    subjects: ['Văn', 'Sử'],
    price: '400k/buổi',
    isSaved: true
  },
  {
    id: 3,
    name: 'Lê Thị Cẩm',
    avatar: '👩‍🏫',
    rating: 4.9,
    experience: '7 năm kinh nghiệm',
    school: 'Đại học Ngoại thương',
    major: 'Kinh tế quốc tế',
    graduation: '2018',
    achievements: [
      'IELTS 8.5',
      'Giải nhất cuộc thi tiếng Anh sinh viên',
      '5 năm kinh nghiệm dạy IELTS'
    ],
    bio: 'Chuyên gia tiếng Anh với chứng chỉ IELTS 8.5. Chuyên luyện thi IELTS, TOEIC và tiếng Anh THPT.',
    subjects: ['Anh'],
    price: '600k/buổi',
    isSaved: false
  },
  {
    id: 4,
    name: 'Phạm Văn Dũng',
    avatar: '👨‍🏫',
    rating: 4.7,
    experience: '4 năm kinh nghiệm',
    school: 'Đại học Y Hà Nội',
    major: 'Y khoa',
    graduation: '2020',
    achievements: [
      'Thủ khoa ngành Y',
      'Giải nhất Olympic Sinh học',
      'Chuyên luyện thi chuyên Sinh'
    ],
    bio: 'Sinh viên Y khoa với kiến thức chuyên sâu về Sinh học. Chuyên luyện thi chuyên và THPTQG môn Sinh.',
    subjects: ['Sinh'],
    price: '450k/buổi',
    isSaved: true
  },
  {
    id: 5,
    name: 'Hoàng Thị Em',
    avatar: '👩‍🏫',
    rating: 4.5,
    experience: '2 năm kinh nghiệm',
    school: 'Đại học Khoa học Tự nhiên',
    major: 'Hóa học',
    graduation: '2022',
    achievements: [
      'Giải ba Olympic Hóa học',
      'Chuyên luyện thi THPTQG',
      'Phương pháp dạy hiện đại'
    ],
    bio: 'Giáo viên Hóa học trẻ với phương pháp giảng dạy hiện đại, giúp học sinh hiểu bản chất và yêu thích môn Hóa.',
    subjects: ['Hóa'],
    price: '350k/buổi',
    isSaved: false
  }
];

export const mockChatRooms = [
  {
    id: 1,
    tutorId: 1,
    tutorName: 'Nguyễn Thị Anh',
    tutorAvatar: '👩‍🏫',
    lastMessage: 'Em có thể học vào tối thứ 3 không?',
    lastMessageTime: '14:30',
    unreadCount: 2
  },
  {
    id: 2,
    tutorId: 2,
    tutorName: 'Trần Văn Bình',
    tutorAvatar: '👨‍🏫',
    lastMessage: 'Tôi sẽ gửi bài tập cho em',
    lastMessageTime: '12:15',
    unreadCount: 0
  },
  {
    id: 3,
    tutorId: 3,
    tutorName: 'Lê Thị Cẩm',
    tutorAvatar: '👩‍🏫',
    lastMessage: 'Buổi học hôm nay rất tốt!',
    lastMessageTime: '09:45',
    unreadCount: 1
  }
];

export const mockMessages = [
  {
    id: 1,
    tutorId: 1,
    text: 'Chào em! Em có muốn học Toán không?',
    sender: 'tutor',
    time: '14:00'
  },
  {
    id: 2,
    tutorId: 1,
    text: 'Dạ chào cô! Em muốn học Toán ạ',
    sender: 'student',
    time: '14:05'
  },
  {
    id: 3,
    tutorId: 1,
    text: 'Em có thể học vào tối thứ 3 không?',
    sender: 'student',
    time: '14:30'
  },
  {
    id: 4,
    tutorId: 2,
    text: 'Chào em! Em có muốn học Văn không?',
    sender: 'tutor',
    time: '12:00'
  },
  {
    id: 5,
    tutorId: 2,
    text: 'Dạ em muốn học Văn ạ',
    sender: 'student',
    time: '12:10'
  },
  {
    id: 6,
    tutorId: 2,
    text: 'Tôi sẽ gửi bài tập cho em',
    sender: 'tutor',
    time: '12:15'
  },
  {
    id: 7,
    tutorId: 3,
    text: 'Chào em! Em có muốn học tiếng Anh không?',
    sender: 'tutor',
    time: '09:30'
  },
  {
    id: 8,
    tutorId: 3,
    text: 'Dạ em muốn học IELTS ạ',
    sender: 'student',
    time: '09:40'
  },
  {
    id: 9,
    tutorId: 3,
    text: 'Buổi học hôm nay rất tốt!',
    sender: 'tutor',
    time: '09:45'
  }
]; 