from django.db import models
from .user import CustomUser
from .subject import Subject
import uuid
# Common location choices for both students and tutors
LOCATION_CHOICES = [
    ('hanoi', 'Hà Nội'), ('hochiminh', 'TP. Hồ Chí Minh'), ('danang', 'Đà Nẵng'),
    ('haiphong', 'Hải Phòng'), ('cantho', 'Cần Thơ'), ('binhduong', 'Bình Dương'),
    ('dongnai', 'Đồng Nai'), ('baivungtau', 'Bà Rịa - Vũng Tàu'), ('quangninh', 'Quảng Ninh'),
    ('thainguyen', 'Thái Nguyên'), ('vinhphuc', 'Vĩnh Phúc'), ('bacninh', 'Bắc Ninh'),
    ('haiduong', 'Hải Dương'), ('hungyen', 'Hưng Yên'), ('namdinh', 'Nam Định'),
    ('thaibinh', 'Thái Bình'), ('ninhbinh', 'Ninh Bình'), ('thanhhoa', 'Thanh Hóa'),
    ('nghean', 'Nghệ An'), ('hatinh', 'Hà Tĩnh'), ('quangbinh', 'Quảng Bình'),
    ('quangtri', 'Quảng Trị'), ('thuathienhue', 'Thừa Thiên Huế'), ('quangnam', 'Quảng Nam'),
    ('quangngai', 'Quảng Ngãi'), ('binhdinh', 'Bình Định'), ('phuyen', 'Phú Yên'),
    ('khanhhoa', 'Khánh Hòa'), ('ninhthuan', 'Ninh Thuận'), ('binhthuan', 'Bình Thuận'),
    ('lamdong', 'Lâm Đồng'), ('tayninh', 'Tây Ninh'), ('binhphuoc', 'Bình Phước'),
    ('longan', 'Long An'), ('tiengiang', 'Tiền Giang'), ('bentre', 'Bến Tre'),
    ('travinh', 'Trà Vinh'), ('vinhlong', 'Vĩnh Long'), ('dongthap', 'Đồng Tháp'),
    ('angiang', 'An Giang'), ('kiengiang', 'Kiên Giang'), ('camau', 'Cà Mau'),
    ('baclieu', 'Bạc Liêu'), ('soctrang', 'Sóc Trăng'), ('other', 'Tỉnh/Thành phố khác'),
]

def user_profile_path(instance, filename):
    """Returns upload path for profile image based on user ID."""
    # e.g., profiles/{user_id}/avatar.png
    return f'profiles/{instance.user.id}/{filename}'

# ===========================
# Student Profile
# ===========================
class StudentProfile(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)

    # Access student's school from a user object:
    # user = CustomUser.objects.get(username="john123")
    # school = user.student_profile.school
    GRADE_CHOICES = [
        ('1', 'Lớp 1'), ('2', 'Lớp 2'), ('3', 'Lớp 3'), ('4', 'Lớp 4'), ('5', 'Lớp 5'),
        ('6', 'Lớp 6'), ('7', 'Lớp 7'), ('8', 'Lớp 8'), ('9', 'Lớp 9'),
        ('10', 'Lớp 10'), ('11', 'Lớp 11'), ('12', 'Lớp 12'),
        ('university', 'Đại học'),
    ]

    # OneToOneField: Each user has one and only one student profile
    user = models.OneToOneField(
        CustomUser,                  # Link to your custom user model
        on_delete=models.CASCADE,   # Delete the profile if the user is deleted
        related_name='student_profile'  # Reverse lookup: user.student_profile
    )

    school = models.CharField(max_length=200, blank=True)  # e.g., "THPT Chuyên Hà Nội - Amsterdam"
    grade = models.CharField(max_length=20, choices=GRADE_CHOICES)  # e.g., "12"
    learning_goals = models.JSONField(default=list, blank=True)  # e.g., ["Thi THPTQG", "Thi chuyên"]
    preferred_subjects = models.ManyToManyField(Subject, blank=True)  # e.g., Toán, Lý, Hóa
    location = models.CharField(max_length=50, choices=LOCATION_CHOICES, blank=True)  # e.g., "hanoi"
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # e.g., 300000.00
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # e.g., 500000.00
    profile_image = models.ImageField(upload_to=user_profile_path, blank=True)  # e.g., "profiles/{user_id}/avatar.png"

    def update_budget(self, min_value, max_value):
        """Update student's budget preferences."""
        self.budget_min = min_value
        self.budget_max = max_value
        self.save(update_fields=['budget_min', 'budget_max'])

    class Meta:
        db_table = 'student_profiles'

# ===========================
# Tutor Profile
# ===========================
class TutorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='tutor_profile')
    education = models.CharField(max_length=200, blank=True)  # e.g., "ĐHBK Hà Nội - CNTT"
    location = models.CharField(max_length=50, choices=LOCATION_CHOICES, blank=True,)  # e.g., "hochiminh"
    bio = models.TextField(blank=True)  # e.g., "Tôi là giáo viên Toán với 5 năm kinh nghiệm..."
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    achievements = models.ManyToManyField('TutorAchievement', blank=True, related_name='tutors')  # e.g., "Giải nhất Olympic Toán"
    class_levels = models.ManyToManyField('ClassLevel', blank=True, related_name='tutors')  # e.g., "Lớp 10", "Lớp 12"
    subjects = models.ManyToManyField('Subject', through='TutorSubject')  # e.g., Toán, Lý

    is_verified = models.BooleanField(default=False)  # e.g., True nếu đã xác minh bằng cấp
    rating_average = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)  # e.g., 4.85
    total_reviews = models.IntegerField(default=0)  # e.g., 15

    profile_image = models.ImageField(upload_to=user_profile_path, blank=True)  # e.g., "profiles/{user_id}/avatar.png"
    availability = models.JSONField(default=dict, blank=True)  # e.g., {"monday": ["18:00-20:00"], "tuesday": []}

    # Price range is calculated from TutorSubject entries

    price_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # e.g., 200000.00
    price_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # e.g., 400000.00

    class Meta:
        # It's generally better to let Django manage the table name (e.g., 'api_tutorprofile').
        # db_table = 'tutor_profiles'
        indexes = [
            models.Index(fields=['price_min']),
            models.Index(fields=['price_max']),
            models.Index(fields=['location']),
            models.Index(fields=['rating_average']),
        ]

    def update_rating(self):
        """Recalculate rating average and review count from related reviews."""
        reviews = self.reviews_received.all()  # e.g., all Review objects for this tutor
        if reviews.exists():
            self.rating_average = reviews.aggregate(models.Avg('rating'))['rating__avg']
            self.total_reviews = reviews.count()
            self.save(update_fields=['rating_average', 'total_reviews'])

    def get_featured_achievements(self):
        """Return top 3 featured achievements."""
        return self.tutor_achievements.filter(is_featured=True)[:3]  # e.g., only achievements with is_featured=True

    # def get_top_achievements(self):
    #     """Return first 3 achievements (non-filtered)."""
    #     return self.achievements.all()[:3]  # e.g., first 3 achievements

    def update_price_range(self):
        """Compute tutor's min/max price based on TutorSubject using database aggregation."""
        # Use aggregation for efficiency instead of fetching all prices into memory
        price_agg = self.tutor_subjects.filter(price__gt=0).aggregate(
            min_price=models.Min('price'),
            max_price=models.Max('price')
        )
        self.price_min = price_agg.get('min_price')
        self.price_max = price_agg.get('max_price')
        self.save(update_fields=['price_min', 'price_max'])

# ===========================
# Join Models & Metadata
# ===========================

class TutorAchievement(models.Model):
    tutor_profile = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='tutor_achievements', null=True)
    title = models.CharField(max_length=200)  # e.g., "Giải nhất Olympic Toán học sinh viên"
    is_featured = models.BooleanField(default=False)  # e.g., True nếu là thành tích nổi bật

    def __str__(self):
        return f"{self.title}{' (Featured)' if self.is_featured else ''}"

class TutorSubject(models.Model):
    LEVEL_CHOICES = [
        ('basic', 'Cơ Bản'),
        ('advanced', 'Nâng Cao'),
    ]

    tutor_profile = models.ForeignKey('TutorProfile', on_delete=models.CASCADE, related_name='tutor_subjects')  # e.g., tutor_profile=TutorProfile object
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)  # e.g., subject=Subject("Toán")
    level = models.CharField(max_length=50, choices=LEVEL_CHOICES)  # e.g., "advanced"
    price = models.DecimalField(max_digits=10, decimal_places=2)  # e.g., 350000.00

    class Meta:
        unique_together = ('tutor_profile', 'subject', 'level')

    def __str__(self):
        return f"{self.tutor_profile.user.email} - {self.subject.name} ({self.level})"

class ClassLevel(models.Model):
    name = models.CharField(max_length=50, unique=True)  # e.g., "Lớp 6-9"

    def __str__(self):
        return self.name