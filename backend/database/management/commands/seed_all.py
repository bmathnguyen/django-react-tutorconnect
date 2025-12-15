"""
Comprehensive database seeder for TutorConnect.
Seeds all models with realistic test data.

Usage:
    python manage.py seed_all
    python manage.py seed_all --tutors 50 --students 20
    python manage.py seed_all --clear
"""
import random
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from faker import Faker

# Import models from new app structure
from users.models import CustomUser
from subjects.models import Subject
from profiles.models import (
    StudentProfile, TutorProfile, TutorSubject, TutorSubjectTag, ClassLevel
)
from interactions.models import TutorLike, TutorSave, TutorView
from chats.models import ChatRoom, Message
from reviews.models import Review

# Initialize Faker for Vietnamese data
fake = Faker('vi_VN')

# Vietnamese subjects
VIETNAMESE_SUBJECTS = [
    'Toán', 'Vật Lý', 'Hóa Học', 'Tiếng Anh', 'Ngữ Văn', 'Sinh Học',
    'Lịch Sử', 'Địa Lý', 'GDCD', 'Tin Học'
]

# Singapore subjects
SINGAPORE_SUBJECTS = [
    "Math", "Advanced Math", "English", "Physics", "Chemistry", "Biology",
    "Chinese", "Malay", "Tamil", "Social Studies", "Geography", "History",
    "Literature", "Principles of Accounts", "Economics", "Computer Applications"
]

# Vietnamese locations (from profiles.models)
VIETNAMESE_LOCATIONS = [
    'hanoi', 'hochiminh', 'danang', 'haiphong', 'cantho', 'binhduong',
    'dongnai', 'baivungtau', 'quangninh', 'thainguyen'
]

# Singapore locations
SINGAPORE_LOCATIONS = [
    "central", "east", "west", "north", "northeast",
    "bukit_timah", "bedok", "tampines", "jurong_east",
    "woodlands", "yishun", "serangoon", "clementi"
]

# Vietnamese education institutions
VIETNAMESE_EDUCATIONS = [
    "Đại học Bách khoa Hà Nội",
    "Đại học Khoa học Tự nhiên, ĐHQG-HCM",
    "Đại học Sư phạm Hà Nội",
    "Đại học Ngoại thương",
    "Đại học Kinh tế Quốc dân",
    "Đại học Đà Nẵng",
    "Đại học Cần Thơ",
    "RMIT University Vietnam",
    "FPT University",
    "Đại học Giáo dục, ĐHQGHN"
]

# Singapore education institutions
SINGAPORE_EDUCATIONS = [
    "NUS, Bachelor of Science (Mathematics)",
    "NTU, Bachelor of Arts (English)",
    "NUS, Bachelor of Science (Physics)",
    "NTU, Bachelor of Science (Chemistry)",
    "NUS, Bachelor of Science (Biology)",
    "NIE, Postgraduate Diploma in Education",
    "SMU, Bachelor of Business (Accountancy)"
]

# Tutor bios
TUTOR_BIOS = [
    "Gia sư có nhiều năm kinh nghiệm, chuyên luyện thi THPTQG và các kỳ thi chuyên.",
    "Giáo viên tận tâm, phương pháp dạy hiện đại, giúp học sinh đạt kết quả cao.",
    "Cựu giáo viên trường chuyên, chuyên gia luyện thi vào lớp 10 và đại học.",
    "Thạc sĩ chuyên ngành, có kinh nghiệm giảng dạy tại các trường đại học.",
    "Gia sư trẻ, năng động, phù hợp với học sinh cần phương pháp học mới.",
    "Chuyên gia luyện thi IELTS, TOEIC với tỷ lệ đỗ cao.",
    "Gia sư Toán-Lý-Hóa, giúp học sinh yếu lấy lại căn bản, học sinh giỏi nâng cao.",
]

# Class levels
CLASS_LEVELS = ['Grade 1-5', 'Grade 6-9', 'Grade 10-12']

# Mock chat messages
MOCK_MESSAGES = [
    "Xin chào, bạn có thể dạy Toán lớp 10 không?",
    "Chào bạn! Mình có thể dạy Toán lớp 10. Bạn muốn học vào thời gian nào?",
    "Mình muốn học vào cuối tuần, bạn có rảnh không?",
    "Cuối tuần mình rảnh. Mức phí là 400k/giờ, bạn có chấp nhận không?",
    "Được ạ, vậy hẹn bạn thứ 7 lúc 2h chiều nhé.",
    "Vâng, hẹn gặp bạn. Bạn có cần mình chuẩn bị tài liệu gì không?",
    "Bạn có thể chuẩn bị một số bài tập cơ bản được không?",
    "Được ạ, mình sẽ chuẩn bị. Hẹn gặp bạn!",
]


class Command(BaseCommand):
    help = 'Comprehensive seeder for TutorConnect - seeds all models with realistic data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tutors',
            type=int,
            default=30,
            help='Number of tutors to create (default: 30)'
        )
        parser.add_argument(
            '--students',
            type=int,
            default=10,
            help='Number of students to create (default: 10)'
        )
        parser.add_argument(
            '--reviews',
            type=int,
            default=3,
            help='Average number of reviews per tutor (default: 3)'
        )
        parser.add_argument(
            '--chats',
            type=int,
            default=5,
            help='Number of chat rooms to create (default: 5)'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing seed data before seeding'
        )
        parser.add_argument(
            '--locale',
            type=str,
            choices=['vn', 'sg', 'both'],
            default='vn',
            help='Locale for data: vn (Vietnamese), sg (Singapore), both (default: vn)'
        )

    @transaction.atomic
    def handle(self, *args, **options):
        tutors_count = options['tutors']
        students_count = options['students']
        reviews_per_tutor = options['reviews']
        chats_count = options['chats']
        locale = options['locale']
        clear = options['clear']

        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))

        # Clear existing data if requested
        if clear:
            self.stdout.write(self.style.WARNING('Clearing existing seed data...'))
            TutorView.objects.all().delete()
            TutorSave.objects.all().delete()
            TutorLike.objects.all().delete()
            Review.objects.all().delete()
            Message.objects.all().delete()
            ChatRoom.objects.all().delete()
            TutorSubjectTag.objects.all().delete()
            TutorSubject.objects.all().delete()
            TutorSubjectTag.objects.all().delete()
            TutorSubject.objects.all().delete()
            # TutorAchievement.objects.all().delete() - Model removed
            TutorProfile.objects.all().delete()
            StudentProfile.objects.all().delete()
            CustomUser.objects.filter(user_type__in=['tutor', 'student']).delete()
            self.stdout.write(self.style.SUCCESS('Cleared existing data.'))

        # 1. Seed Subjects
        self.stdout.write('Seeding subjects...')
        subjects_vn = {}
        subjects_sg = {}
        
        if locale in ['vn', 'both']:
            for subj_name in VIETNAMESE_SUBJECTS:
                subject, _ = Subject.objects.get_or_create(name=subj_name)
                subjects_vn[subj_name] = subject
        
        if locale in ['sg', 'both']:
            for subj_name in SINGAPORE_SUBJECTS:
                subject, _ = Subject.objects.get_or_create(name=subj_name)
                subjects_sg[subj_name] = subject
        
        all_subjects = {**subjects_vn, **subjects_sg}
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(all_subjects)} subjects'))

        # 2. Seed Class Levels
        self.stdout.write('Seeding class levels...')
        class_levels = {}
        for level_name in CLASS_LEVELS:
            level, _ = ClassLevel.objects.get_or_create(name=level_name)
            class_levels[level_name] = level
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(class_levels)} class levels'))

        # 3. Seed Tutors
        self.stdout.write(f'Seeding {tutors_count} tutors...')
        tutors = []
        locations = VIETNAMESE_LOCATIONS if locale == 'vn' else SINGAPORE_LOCATIONS if locale == 'sg' else VIETNAMESE_LOCATIONS + SINGAPORE_LOCATIONS
        educations = VIETNAMESE_EDUCATIONS if locale == 'vn' else SINGAPORE_EDUCATIONS if locale == 'sg' else VIETNAMESE_EDUCATIONS + SINGAPORE_EDUCATIONS
        subject_pool = list(subjects_vn.keys()) if locale == 'vn' else list(subjects_sg.keys()) if locale == 'sg' else list(all_subjects.keys())

        for i in range(tutors_count):
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = f"{first_name.lower()}.{last_name.lower()}{i}@tutor.com"
            phone = fake.phone_number()[:10]  # Vietnamese phone format
            
            # Create user
            user, _ = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'phone': phone,
                    'user_type': 'tutor',
                }
            )
            if not user.password:  # Only set password for new users
                user.set_password('SecurePassword123!')
                user.save()

            # Create tutor profile
            education = random.choice(educations)
            bio = random.choice(TUTOR_BIOS)
            location = random.choice(locations)
            is_verified = random.choice([True, False])
            rating_avg = round(random.uniform(3.5, 5.0), 2)

            profile, _ = TutorProfile.objects.get_or_create(
                user=user,
                defaults={
                    'education': education,
                    'bio': bio,
                    'location': location,
                    'is_verified': is_verified,
                    'rating_average': rating_avg,
                    'total_reviews': 0,
                }
            )

            # Add class levels
            selected_levels = random.sample(list(class_levels.values()), k=random.randint(1, 3))
            profile.class_levels.set(selected_levels)

            # Add achievements (0-3) - NOW stored in JSONField
            num_achievements = random.randint(0, 3)
            achievements_list = [f"Thành tích {j+1}" for j in range(num_achievements)]
            if num_achievements > 0:
                profile.achievements = achievements_list
                profile.save()

            # Add tutor subjects (1-3 subjects)
            selected_subjects = random.sample(subject_pool, k=random.randint(1, 3))
            TutorSubject.objects.filter(tutor_profile=profile).delete()
            for subj_name in selected_subjects:
                # Create TutorSubject (no price/level here anymore)
                ts = TutorSubject.objects.create(
                    tutor_profile=profile,
                    subject=all_subjects[subj_name]
                )
                
                # Create Tags with Prices
                level_tags = ['Basic', 'Advanced', 'Exam Prep']
                selected_tags = random.sample(level_tags, k=random.randint(1, 2))
                
                for tag in selected_tags:
                    price = round(random.uniform(200000, 800000), 0)
                    TutorSubjectTag.objects.create(
                        tutor_subject=ts,
                        tag=tag,
                        price=price
                    )

            tutors.append(profile)

        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(tutors)} tutors'))

        # 4. Seed Students
        self.stdout.write(f'Seeding {students_count} students...')
        students = []
        grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'university']

        for i in range(students_count):
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = f"{first_name.lower()}.{last_name.lower()}{i}@student.com"
            phone = fake.phone_number()[:10]

            # Create user
            user, _ = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'phone': phone,
                    'user_type': 'student',
                }
            )
            if not user.password:
                user.set_password('SecurePassword123!')
                user.save()

            # Create student profile
            grade = random.choice(grades)
            school = f"Trường THPT {fake.city()}" if locale == 'vn' else f"{fake.city()} Secondary School"
            location = random.choice(locations)
            budget_min = round(random.uniform(200000, 400000), 0)
            budget_max = round(random.uniform(400000, 800000), 0)

            profile, _ = StudentProfile.objects.get_or_create(
                user=user,
                defaults={
                    'school': school,
                    'grade': grade,
                    'location': location,
                    'budget_min': budget_min,
                    'budget_max': budget_max,
                    'learning_goals': ['Thi THPTQG', 'Nâng cao kiến thức'],
                }
            )

            # Add preferred subjects
            preferred = random.sample(subject_pool, k=random.randint(1, 3))
            profile.preferred_subjects.set([all_subjects[s] for s in preferred])

            students.append(profile)

        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(students)} students'))

        # 5. Seed Reviews
        self.stdout.write(f'Seeding reviews (avg {reviews_per_tutor} per tutor)...')
        total_reviews = 0
        for tutor in tutors:
            num_reviews = random.randint(1, reviews_per_tutor * 2)
            reviewers = random.sample(students, k=min(num_reviews, len(students)))
            
            for student in reviewers:
                # Check if student already reviewed this tutor
                if not Review.objects.filter(student=student, tutor=tutor).exists():
                    Review.objects.create(
                        student=student,
                        tutor=tutor,
                        rating=random.randint(3, 5),
                        comment=f"Gia sư rất tốt, giúp mình cải thiện đáng kể."
                    )
                    total_reviews += 1

            # Update tutor rating
            tutor.update_rating()

        self.stdout.write(self.style.SUCCESS(f'✓ Created {total_reviews} reviews'))

        # 6. Seed Interactions (Likes, Saves, Views)
        self.stdout.write('Seeding interactions...')
        likes_count = 0
        saves_count = 0
        views_count = 0

        for student in students:
            # Likes (5-10 per student)
            liked_tutors = random.sample(tutors, k=min(random.randint(5, 10), len(tutors)))
            for tutor in liked_tutors:
                if not TutorLike.objects.filter(student=student, tutor=tutor).exists():
                    TutorLike.objects.create(student=student, tutor=tutor)
                    likes_count += 1

            # Saves (3-7 per student)
            saved_tutors = random.sample(tutors, k=min(random.randint(3, 7), len(tutors)))
            for tutor in saved_tutors:
                if not TutorSave.objects.filter(student=student, tutor=tutor).exists():
                    TutorSave.objects.create(student=student, tutor=tutor)
                    saves_count += 1

        # Views (10-20 per tutor)
        for tutor in tutors:
            viewers = random.sample(students, k=min(random.randint(10, 20), len(students)))
            for student in viewers:
                TutorView.objects.get_or_create(student=student, tutor=tutor)
                views_count += 1

        self.stdout.write(self.style.SUCCESS(f'✓ Created {likes_count} likes, {saves_count} saves, {views_count} views'))

        # 7. Seed Chat Rooms and Messages
        self.stdout.write(f'Seeding {chats_count} chat rooms...')
        messages_count = 0
        for i in range(min(chats_count, len(students), len(tutors))):
            student = students[i % len(students)]
            tutor = tutors[i % len(tutors)]

            chat_room, _ = ChatRoom.objects.get_or_create(
                student=student,
                tutor=tutor
            )

            # Add messages (5-15 per room)
            num_messages = random.randint(5, 15)
            for j in range(num_messages):
                sender = student.user if j % 2 == 0 else tutor.user
                content = MOCK_MESSAGES[j % len(MOCK_MESSAGES)]
                Message.objects.create(
                    chat_room=chat_room,
                    sender=sender,
                    content=content,
                    message_type='text',
                    created_at=timezone.now()
                )
                messages_count += 1

            # Update last_message_at
            if chat_room.messages.exists():
                chat_room.last_message_at = chat_room.messages.first().created_at
                chat_room.save()

        self.stdout.write(self.style.SUCCESS(f'✓ Created {chats_count} chat rooms with {messages_count} messages'))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('Seeding Summary:'))
        self.stdout.write(self.style.SUCCESS(f'  Subjects: {len(all_subjects)}'))
        self.stdout.write(self.style.SUCCESS(f'  Class Levels: {len(class_levels)}'))
        self.stdout.write(self.style.SUCCESS(f'  Tutors: {len(tutors)}'))
        self.stdout.write(self.style.SUCCESS(f'  Students: {len(students)}'))
        self.stdout.write(self.style.SUCCESS(f'  Reviews: {total_reviews}'))
        self.stdout.write(self.style.SUCCESS(f'  Likes: {likes_count}'))
        self.stdout.write(self.style.SUCCESS(f'  Saves: {saves_count}'))
        self.stdout.write(self.style.SUCCESS(f'  Views: {views_count}'))
        self.stdout.write(self.style.SUCCESS(f'  Chat Rooms: {chats_count}'))
        self.stdout.write(self.style.SUCCESS(f'  Messages: {messages_count}'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(self.style.SUCCESS('\n✓ Database seeding completed successfully!'))

