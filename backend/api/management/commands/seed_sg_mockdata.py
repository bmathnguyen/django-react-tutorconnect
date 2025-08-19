import random
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import (
    CustomUser, TutorProfile, StudentProfile, Subject, TutorSubject, ChatRoom, Message
)
from django.utils import timezone

def get_or_create_subject(name):
    return Subject.objects.get_or_create(name=name)[0]

SINGAPORE_SUBJECTS = [
    "Math", "Advanced Math", "English", "Physics", "Chemistry", "Biology",
    "Chinese", "Malay", "Tamil", "Social Studies", "Geography", "History",
    "Literature", "Principles of Accounts", "Economics", "Computer Applications"
]

SINGAPORE_LOCATIONS = [
    ("central", "Central"), ("east", "East"), ("west", "West"), ("north", "North"), ("northeast", "North-East"),
    ("bukit_timah", "Bukit Timah"), ("bedok", "Bedok"), ("tampines", "Tampines"), ("jurong_east", "Jurong East"),
    ("woodlands", "Woodlands"), ("yishun", "Yishun"), ("serangoon", "Serangoon"), ("clementi", "Clementi")
]

TUTOR_BIOS = [
    "Experienced Math tutor with 6 years teaching O-Level and A-Level students. Patient and results-driven.",
    "Passionate English tutor with 4 years of experience helping students excel in PSLE and O-Levels.",
    "Physics graduate from NTU, specializes in hands-on learning and exam strategies.",
    "Former MOE teacher, Chemistry specialist with a focus on conceptual understanding.",
    "Biology enthusiast, NUS graduate, helps students achieve distinctions.",
    "Award-winning Literature tutor, loves inspiring a love for reading.",
    "Economics tutor with 8 years of JC experience, clear and concise teaching style.",
    "Chinese language expert, helps students improve oral and written skills.",
    "Social Studies and History mentor, makes learning engaging and relevant.",
    "Geography and POA tutor, strong track record of grade improvement."
]

EDUCATIONS = [
    "NUS, Bachelor of Science (Mathematics)",
    "NTU, Bachelor of Arts (English)",
    "NUS, Bachelor of Science (Physics)",
    "NTU, Bachelor of Science (Chemistry)",
    "NUS, Bachelor of Science (Biology)",
    "NIE, Postgraduate Diploma in Education",
    "SMU, Bachelor of Business (Accountancy)",
    "NUS, Bachelor of Arts (Chinese Studies)",
    "NTU, Bachelor of Arts (History)",
    "NUS, Bachelor of Social Sciences (Economics)"
]

FIRST_NAMES = ["Samuel", "Amanda", "Ryan", "Sophie", "Daniel", "Grace", "Benjamin", "Chloe", "Lucas", "Emily", "Ethan", "Nicole", "Marcus", "Jasmine", "Sean", "Natalie", "Darren", "Rachel", "Aaron", "Sarah", "Leon", "Victoria", "Isaac", "Ashley", "Brandon", "Alyssa", "Gerald", "Fiona", "Dylan", "Joanne"]
LAST_NAMES = ["Tan", "Lim", "Lee", "Ng", "Wong", "Chua", "Goh", "Teo", "Chan", "Loh", "Yeo", "Sim", "Koh", "Pang", "Chew", "Toh", "Ong", "Heng", "Foo", "Chong"]

MOCK_MESSAGES = [
    "Hi, are you available for a Math session this Saturday?",
    "Hello! Yes, I am available after 2pm. Would that work for you?",
    "That’s perfect, thank you. How much do you charge per session?",
    "My rate is S$80 per session for O-Level Math.",
    "Great, let’s confirm for Saturday 3pm. Thank you!",
    "You’re welcome! Looking forward to our session.",
    "Do you provide materials or should I prepare my own?",
    "I will provide worksheets, but you can bring your own questions too.",
    "Thanks! See you soon.",
    "See you!"
]

@transaction.atomic
def seed_sg_subjects_and_locations():
    # Subjects
    for subj in SINGAPORE_SUBJECTS:
        Subject.objects.get_or_create(name=subj)
    # Note: Locations may need to be added to LOCATION_CHOICES in model code for full support

class Command(BaseCommand):
    help = 'Seeds the database with Singaporean tutors, students, and messages.'

    @transaction.atomic
    def handle(self, *args, **options):
        seed_sg_subjects_and_locations()
        self.stdout.write('Singapore MOE subjects seeded.')

        # Create 30 tutors
        tutors = []
        for i in range(30):
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            email = f"{first.lower()}.{last.lower()}{i}@sgtutor.com"
            phone = str(random.randint(80000000, 99999999))
            education = random.choice(EDUCATIONS)
            bio = random.choice(TUTOR_BIOS)
            location = random.choice(SINGAPORE_LOCATIONS)[0]
            subjects = random.sample(SINGAPORE_SUBJECTS, k=random.randint(1, 3))
            tutor_subjects = []
            for subj in subjects:
                tutor_subjects.append({
                    "subject": subj,
                    "level": random.choice(["basic", "advanced"]),
                    "price": round(random.uniform(30, 100), 2)
                })
            # Create user
            user, _ = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": first,
                    "last_name": last,
                    "phone": phone,
                    "user_type": "tutor",
                    "username": email.split("@")[0]
                }
            )
            user.set_password("SecurePassword123!")
            user.save()
            # Create TutorProfile
            profile, _ = TutorProfile.objects.get_or_create(
                user=user,
                defaults={
                    "education": education,
                    "bio": bio,
                    "location": location,
                    "is_verified": random.choice([True, False]),
                    "rating_average": round(random.uniform(3.5, 5.0), 2)
                }
            )
            # Add TutorSubjects
            TutorSubject.objects.filter(tutor_profile=profile).delete()
            for ts in tutor_subjects:
                subj_obj = Subject.objects.get(name=ts["subject"])
                TutorSubject.objects.create(
                    tutor_profile=profile,
                    subject=subj_obj,
                    level=ts["level"],
                    price=ts["price"]
                )
            profile.update_price_range()
            tutors.append(profile)
        self.stdout.write(f"Seeded {len(tutors)} Singapore tutors.")

        # Create 3 students
        students = []
        for i in range(3):
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            email = f"{first.lower()}.{last.lower()}{i}@sgstudent.com"
            phone = str(random.randint(80000000, 99999999))
            user, _ = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": first,
                    "last_name": last,
                    "phone": phone,
                    "user_type": "student",
                    "username": email.split("@")[0]
                }
            )
            user.set_password("SecurePassword123!")
            user.save()
            profile, _ = StudentProfile.objects.get_or_create(
                user=user,
                defaults={
                    "school": "Random Singapore School",
                    "grade": random.choice(["Primary 6", "Secondary 4", "JC2"]),
                    "location": random.choice(SINGAPORE_LOCATIONS)[0]
                }
            )
            students.append(profile)
        self.stdout.write(f"Seeded {len(students)} Singapore students.")

        # Create 2 chat rooms and 7-10 messages in English
        for i in range(2):
            student = students[i % len(students)]
            tutor = tutors[i % len(tutors)]
            chat_room, _ = ChatRoom.objects.get_or_create(student=student, tutor=tutor)
            num_messages = random.randint(7, 10)
            for j in range(num_messages):
                sender = random.choice([student.user, tutor.user])
                content = MOCK_MESSAGES[j % len(MOCK_MESSAGES)]
                Message.objects.create(
                    chat_room=chat_room,
                    sender=sender,
                    content=content,
                    message_type="text",
                    created_at=timezone.now()
                )
        self.stdout.write(self.style.SUCCESS("Singapore mock data seeded successfully."))
