import random
from django.core.management.base import BaseCommand
from django.db import transaction
from faker import Faker

from api.models import (
    CustomUser, TutorProfile, Subject, ClassLevel, TutorSubject
)

# Initialize Faker for Vietnamese data
fake = Faker('vi_VN')

class Command(BaseCommand):
    help = 'Seeds the database with a diverse set of tutor profiles for testing.'

    @transaction.atomic
    def handle(self, *args, **options):
        # self.stdout.write('Deleting old tutor data...')
        # # Clear only tutor-related data to avoid deleting other users
        # CustomUser.objects.filter(user_type='tutor').delete()
        # TutorProfile.objects.all().delete()
        # Optionally clear and recreate subjects/classes if you want a fresh start
        # Subject.objects.all().delete()
        # ClassLevel.objects.all().delete()

        self.stdout.write('Seeding new tutor data...')

        # --- Define Subjects and Class Levels ---
        subjects_data = ['Toán', 'Vật lý', 'Hóa học', 'Tiếng Anh', 'Ngữ văn', 'Sinh học']
        class_levels_data = ['Grade 1-5', 'Grade 6-9', 'Grade 10-12']

        subjects = {name: Subject.objects.get_or_create(name=name)[0] for name in subjects_data}
        class_levels = {name: ClassLevel.objects.get_or_create(name=name)[0] for name in class_levels_data}

        # --- Define Diverse Tutor Profiles ---
        tutors_to_create = [
            {
                'first_name': 'An', 'last_name': 'Nguyễn',
                'email_suffix': 'an.nguyen',
                'education': 'Đại học Bách khoa Hà Nội',
                'location': 'hanoi',
                'is_verified': True,
                'subjects': [
                    {'name': 'Toán', 'level': 'advanced', 'price': 500000},
                    {'name': 'Vật lý', 'level': 'advanced', 'price': 550000},
                ],
                'class_levels': ['Grade 10-12']
            },
            {
                'first_name': 'Bình', 'last_name': 'Trần',
                'email_suffix': 'binh.tran',
                'education': 'Đại học Khoa học Tự nhiên, ĐHQG-HCM',
                'location': 'hochiminh',
                'is_verified': False,
                'subjects': [
                    {'name': 'Hóa học', 'level': 'basic', 'price': 300000},
                    {'name': 'Sinh học', 'level': 'basic', 'price': 320000},
                ],
                'class_levels': ['Grade 6-9']
            },
            {
                'first_name': 'Chi', 'last_name': 'Lê',
                'email_suffix': 'chi.le',
                'education': 'Đại học Sư phạm Hà Nội',
                'location': 'hanoi',
                'is_verified': True,
                'subjects': [
                    {'name': 'Ngữ văn', 'level': 'advanced', 'price': 400000},
                    {'name': 'Tiếng Anh', 'level': 'basic', 'price': 450000},
                ],
                'class_levels': ['Grade 6-9', 'Grade 10-12']
            },
            {
                'first_name': 'Dũng', 'last_name': 'Phạm',
                'email_suffix': 'dung.pham',
                'education': 'RMIT University Vietnam',
                'location': 'danang',
                'is_verified': True,
                'subjects': [
                    {'name': 'Tiếng Anh', 'level': 'advanced', 'price': 600000},
                ],
                'class_levels': ['Grade 1-5', 'Grade 6-9', 'Grade 10-12'] # Teaches all levels
            },
            {
                'first_name': 'Giang', 'last_name': 'Võ',
                'email_suffix': 'giang.vo',
                'education': 'Đại học Kinh tế Quốc dân',
                'location': 'hochiminh',
                'is_verified': False,
                'subjects': [
                    {'name': 'Toán', 'level': 'basic', 'price': 250000},
                ],
                'class_levels': ['Grade 1-5']
            },
            {
                'first_name': 'Hùng', 'last_name': 'Vương',
                'email_suffix': 'hung.vuong',
                'education': 'Đại học Đà Nẵng',
                'location': 'danang',
                'is_verified': False,
                'subjects': [
                    {'name': 'Vật lý', 'level': 'basic', 'price': 350000},
                    {'name': 'Hóa học', 'level': 'basic', 'price': 350000},
                ],
                'class_levels': ['Grade 10-12']
            },
            {
                'first_name': 'Yến', 'last_name': 'Lê',
                'email_suffix': 'yen.le',
                'education': 'Đại học Ngoại thương',
                'location': 'hochiminh',
                'is_verified': True,
                'subjects': [
                    {'name': 'Tiếng Anh', 'level': 'advanced', 'price': 550000},
                    {'name': 'Ngữ văn', 'level': 'basic', 'price': 450000},
                ],
                'class_levels': ['Grade 10-12']
            },
            {
                'first_name': 'Khánh', 'last_name': 'Ly',
                'email_suffix': 'khanh.ly',
                'education': 'Cao đẳng Sư phạm Trung ương',
                'location': 'hanoi',
                'is_verified': False,
                'subjects': [
                    {'name': 'Sinh học', 'level': 'basic', 'price': 280000},
                ],
                'class_levels': ['Grade 1-5', 'Grade 6-9']
            },
            {
                'first_name': 'Long', 'last_name': 'Hồ',
                'email_suffix': 'long.ho',
                'education': 'Đại học Bách khoa, ĐHQG-HCM',
                'location': 'hochiminh',
                'is_verified': True,
                'subjects': [
                    {'name': 'Toán', 'level': 'advanced', 'price': 700000},
                ],
                'class_levels': ['Grade 10-12']
            },
            {
                'first_name': 'Mai', 'last_name': 'Anh',
                'email_suffix': 'mai.anh',
                'education': 'Đại học Giáo dục, ĐHQGHN',
                'location': 'online',
                'is_verified': True,
                'subjects': [
                    {'name': 'Toán', 'level': 'basic', 'price': 300000},
                    {'name': 'Tiếng Anh', 'level': 'basic', 'price': 350000},
                ],
                'class_levels': ['Grade 1-5']
            },
            {
                'first_name': 'Nam', 'last_name': 'Trịnh',
                'email_suffix': 'nam.trinh',
                'education': 'FPT University',
                'location': 'online',
                'is_verified': False,
                'subjects': [
                    {'name': 'Vật lý', 'level': 'advanced', 'price': 480000},
                ],
                'class_levels': ['Grade 6-9', 'Grade 10-12']
            },
            {
                'first_name': 'Oanh', 'last_name': 'Đỗ',
                'email_suffix': 'oanh.do',
                'education': 'Học viện Công nghệ Bưu chính Viễn thông',
                'location': 'hanoi',
                'is_verified': True,
                'subjects': [
                    {'name': 'Hóa học', 'level': 'advanced', 'price': 520000},
                ],
                'class_levels': ['Grade 10-12']
            },
            {
                'first_name': 'Phúc', 'last_name': 'Hoàng',
                'email_suffix': 'phuc.hoang',
                'education': 'Đại học Cần Thơ',
                'location': 'cantho', # New location
                'is_verified': False,
                'subjects': [
                    {'name': 'Sinh học', 'level': 'advanced', 'price': 400000},
                    {'name': 'Ngữ văn', 'level': 'basic', 'price': 350000},
                ],
                'class_levels': ['Grade 6-9']
            },
            {
                'first_name': 'Quỳnh', 'last_name': 'Mai',
                'email_suffix': 'quynh.mai',
                'education': 'Swinburne University of Technology',
                'location': 'online',
                'is_verified': True,
                'subjects': [
                    {'name': 'Tiếng Anh', 'level': 'advanced', 'price': 800000},
                ],
                'class_levels': ['Grade 10-12']
            },
            {
                'first_name': 'Sơn', 'last_name': 'Đặng',
                'email_suffix': 'son.dang',
                'education': 'Đại học Khoa học Xã hội và Nhân văn, ĐHQG-HCM',
                'location': 'hochiminh',
                'is_verified': False,
                'subjects': [
                    {'name': 'Ngữ văn', 'level': 'advanced', 'price': 450000},
                ],
                'class_levels': ['Grade 6-9', 'Grade 10-12']
            },
        ]

        for tutor_data in tutors_to_create:
            username = tutor_data['email_suffix']
            email = f"{username}@tutor.com"

            # 1. Use update_or_create for CustomUser to avoid duplicates and preserve data
            user, user_created = CustomUser.objects.update_or_create(
                email=email,
                defaults={
                    'username': username,
                    'first_name': tutor_data['first_name'],
                    'last_name': tutor_data['last_name'],
                    'phone': fake.phone_number(),
                    'user_type': 'tutor'
                }
            )

            if user_created:
                user.set_password('password123') # Set password only for new users
                user.save()
                self.stdout.write(f'Created new user: {email}')
            else:
                self.stdout.write(f'Updated existing user: {email}')

            # 2. Use update_or_create for TutorProfile
            profile, profile_created = TutorProfile.objects.update_or_create(
                user=user,
                defaults={
                    'education': tutor_data['education'],
                    'bio': f"Gia sư uy tín với kinh nghiệm giảng dạy tại {tutor_data['education']}.",
                    'location': tutor_data['location'],
                    'is_verified': tutor_data['is_verified'],
                    'rating_average': round(random.uniform(3.5, 5.0), 1)
                }
            )

            # 3. Clear and re-link ClassLevels to ensure consistency
            profile.class_levels.clear()
            for level_name in tutor_data['class_levels']:
                profile.class_levels.add(class_levels[level_name])

            # 4. Clear and re-create TutorSubject entries
            TutorSubject.objects.filter(tutor_profile=profile).delete()
            for subject_info in tutor_data['subjects']:
                TutorSubject.objects.create(
                    tutor_profile=profile,
                    subject=subjects[subject_info['name']],
                    level=subject_info['level'],
                    price=subject_info['price']
                )
            
            # 5. Update the calculated price range on the profile
            profile.update_price_range()

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(tutors_to_create)} tutors.'))
