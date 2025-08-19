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
    tutorName: 'Tan Jia Hui',
    tutorAvatar: '👩🏻‍🏫',
    lastMessage: 'You ready for A-Math revision this Friday?',
    lastMessageTime: '21:05',
    unreadCount: 1
  },
  {
    id: 2,
    tutorId: 2,
    tutorName: 'Lim Wei Kiat',
    tutorAvatar: '👨🏻‍🏫',
    lastMessage: 'Remember to practise the compo draft.',
    lastMessageTime: '20:12',
    unreadCount: 0
  },
  {
    id: 3,
    tutorId: 3,
    tutorName: 'Ng Mei Ting',
    tutorAvatar: '👩🏻‍🏫',
    lastMessage: 'See you at Jurong Library tmr!',
    lastMessageTime: '18:30',
    unreadCount: 3
  }
];

export const mockMessages = [
  {
    id: 1,
    tutorId: 1,
    text: 'Hi! This week we cover Indices and Surds. Can?',
    sender: 'tutor',
    time: '20:45'
  },
  {
    id: 2,
    tutorId: 1,
    text: 'Sure, Ms Tan. I need help with those topics!',
    sender: 'student',
    time: '20:48'
  },
  {
    id: 3,
    tutorId: 1,
    text: 'You ready for A-Math revision this Friday?',
    sender: 'tutor',
    time: '21:05'
  },
  {
    id: 4,
    tutorId: 2,
    text: 'Wei Kiat, can you send me the compo sample?',
    sender: 'student',
    time: '19:55'
  },
  {
    id: 5,
    tutorId: 2,
    text: 'Yup, I sent already. Remember to practise the compo draft.',
    sender: 'tutor',
    time: '20:12'
  },
  {
    id: 6,
    tutorId: 3,
    text: 'Hi Mei Ting, do we meet at Jurong Library again?',
    sender: 'student',
    time: '18:10'
  },
  {
    id: 7,
    tutorId: 3,
    text: 'Yes! Same spot, 3rd floor. See you at Jurong Library tmr!',
    sender: 'tutor',
    time: '18:30'
  },
  {
    id: 8,
    tutorId: 3,
    text: 'Thank you, teacher!',
    sender: 'student',
    time: '18:32'
  }
];