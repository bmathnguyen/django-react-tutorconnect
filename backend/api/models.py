from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.utils import timezone
import uuid
import os

def user_profile_path(instance, filename):
    return f'profiles/{instance.user.id}/{filename}'

def chat_file_path(instance, filename):
    return f'chat/{instance.chat_room.id}/{filename}'

class CustomUser(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser.
    Supports both students and tutors with additional fields for the tutor platform.
    """
    
    # Define choices for user types - used in forms and admin interface
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('tutor', 'Tutor'),
    ]
    
    # Primary key using UUID instead of auto-increment integer for better security
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Email field that must be unique across all users
    email = models.EmailField(unique=True)
    
    # Phone field with exact 10-digit validation
    phone = models.CharField(
        max_length=15, 
        blank=True,
        validators=[
            RegexValidator(
                regex=r'^\d{10}$',
                message='Phone number must be exactly 10 digits (e.g., 0123456789)',
                code='invalid_phone'
            )
        ]
    )
    
    # User type to distinguish between students and tutors
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    
    # Track online status for real-time features
    is_online = models.BooleanField(default=False)
    
    # Track when user was last active for analytics and cleanup
    last_activity = models.DateTimeField(default=timezone.now)
    
    # Timestamp when user account was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Timestamp that updates automatically when user data is modified
    updated_at = models.DateTimeField(auto_now=True)
    
    # Use email as the primary identifier instead of username
    USERNAME_FIELD = 'email'
    
    # Fields required when creating a superuser via manage.py createsuperuser
    REQUIRED_FIELDS = ['username', 'user_type']
    
    class Meta:
        # Use the same table name as Django's default User model for compatibility
        db_table = 'auth_user'
        
        # Database indexes for better query performance
        indexes = [
            # Index for filtering users by type and creation date
            models.Index(fields=['user_type', 'created_at']),
            # Index for finding online users quickly
            models.Index(fields=['is_online']),
        ]
    
    def update_last_activity(self):
        """
        Update the user's last activity timestamp.
        Called when user performs actions to track engagement.
        """
        self.last_activity = timezone.now()
        # Only update the last_activity field to avoid triggering other auto-updates, faster SQL query
        self.save(update_fields=['last_activity'])

class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class StudentProfile(models.Model):
    GRADE_CHOICES = [
        ('1', 'Lớp 1'), ('2', 'Lớp 2'), ('3', 'Lớp 3'), ('4', 'Lớp 4'), ('5', 'Lớp 5'),
        ('6', 'Lớp 6'), ('7', 'Lớp 7'), ('8', 'Lớp 8'), ('9', 'Lớp 9'),
        ('10', 'Lớp 10'), ('11', 'Lớp 11'), ('12', 'Lớp 12'),
        ('university', 'Đại học'),
    ]
    
    LOCATION_CHOICES = [
        ('hanoi', 'Hà Nội'),
        ('hochiminh', 'TP. Hồ Chí Minh'),
        ('danang', 'Đà Nẵng'),
        ('haiphong', 'Hải Phòng'),
        ('cantho', 'Cần Thơ'),
        ('binhduong', 'Bình Dương'),
        ('dongnai', 'Đồng Nai'),
        ('baivungtau', 'Bà Rịa - Vũng Tàu'),
        ('quangninh', 'Quảng Ninh'),
        ('thainguyen', 'Thái Nguyên'),
        ('vinhphuc', 'Vĩnh Phúc'),
        ('bacninh', 'Bắc Ninh'),
        ('haidương', 'Hải Dương'),
        ('hungyen', 'Hưng Yên'),
        ('namdinh', 'Nam Định'),
        ('thaibinh', 'Thái Bình'),
        ('ninhbinh', 'Ninh Bình'),
        ('thanhhoa', 'Thanh Hóa'),
        ('nghean', 'Nghệ An'),
        ('hatinh', 'Hà Tĩnh'),
        ('quangbinh', 'Quảng Bình'),
        ('quangtri', 'Quảng Trị'),
        ('thuathienhue', 'Thừa Thiên Huế'),
        ('quangnam', 'Quảng Nam'),
        ('quangngai', 'Quảng Ngãi'),
        ('binhdinh', 'Bình Định'),
        ('phuyen', 'Phú Yên'),
        ('khanhhoa', 'Khánh Hòa'),
        ('ninhthuan', 'Ninh Thuận'),
        ('binhthuan', 'Bình Thuận'),
        ('lamdong', 'Lâm Đồng'),
        ('dongnai', 'Đồng Nai'),
        ('tayninh', 'Tây Ninh'),
        ('binhphuoc', 'Bình Phước'),
        ('longan', 'Long An'),
        ('tiengiang', 'Tiền Giang'),
        ('bentre', 'Bến Tre'),
        ('travinh', 'Trà Vinh'),
        ('vinhlong', 'Vĩnh Long'),
        ('dongthap', 'Đồng Tháp'),
        ('angiang', 'An Giang'),
        ('kiengiang', 'Kiên Giang'),
        ('camau', 'Cà Mau'),
        ('baclieu', 'Bạc Liêu'),
        ('soc trang', 'Sóc Trăng'),
        ('other', 'Tỉnh/Thành phố khác'),
    ]
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    school = models.CharField(max_length=200, blank=True)
    grade = models.CharField(max_length=20, choices=GRADE_CHOICES)
    learning_goals = models.JSONField(default=list, blank=True)  # ["Thi THPTQG", "Thi chuyên"]
    preferred_subjects = models.ManyToManyField(Subject, blank=True)
    location = models.CharField(max_length=50, choices=LOCATION_CHOICES, blank=True)  # Changed from CharField to choices
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    profile_image = models.ImageField(upload_to=user_profile_path, blank=True)
    
    class Meta:
        db_table = 'student_profiles'

class TutorProfile(models.Model):
    EXPERIENCE_CHOICES = [
        ('0-1', '0-1 năm'), ('1-3', '1-3 năm'), 
        ('3-5', '3-5 năm'), ('5+', 'Trên 5 năm'),
    ]
    
    LOCATION_CHOICES = [
        ('hanoi', 'Hà Nội'),
        ('hochiminh', 'TP. Hồ Chí Minh'),
        ('danang', 'Đà Nẵng'),
        ('haiphong', 'Hải Phòng'),
        ('cantho', 'Cần Thơ'),
        ('binhduong', 'Bình Dương'),
        ('dongnai', 'Đồng Nai'),
        ('baivungtau', 'Bà Rịa - Vũng Tàu'),
        ('quangninh', 'Quảng Ninh'),
        ('thainguyen', 'Thái Nguyên'),
        ('vinhphuc', 'Vĩnh Phúc'),
        ('bacninh', 'Bắc Ninh'),
        ('haidương', 'Hải Dương'),
        ('hungyen', 'Hưng Yên'),
        ('namdinh', 'Nam Định'),
        ('thaibinh', 'Thái Bình'),
        ('ninhbinh', 'Ninh Bình'),
        ('thanhhoa', 'Thanh Hóa'),
        ('nghean', 'Nghệ An'),
        ('hatinh', 'Hà Tĩnh'),
        ('quangbinh', 'Quảng Bình'),
        ('quangtri', 'Quảng Trị'),
        ('thuathienhue', 'Thừa Thiên Huế'),
        ('quangnam', 'Quảng Nam'),
        ('quangngai', 'Quảng Ngãi'),
        ('binhdinh', 'Bình Định'),
        ('phuyen', 'Phú Yên'),
        ('khanhhoa', 'Khánh Hòa'),
        ('ninhthuan', 'Ninh Thuận'),
        ('binhthuan', 'Bình Thuận'),
        ('lamdong', 'Lâm Đồng'),
        ('dongnai', 'Đồng Nai'),
        ('tayninh', 'Tây Ninh'),
        ('binhphuoc', 'Bình Phước'),
        ('longan', 'Long An'),
        ('tiengiang', 'Tiền Giang'),
        ('bentre', 'Bến Tre'),
        ('travinh', 'Trà Vinh'),
        ('vinhlong', 'Vĩnh Long'),
        ('dongthap', 'Đồng Tháp'),
        ('angiang', 'An Giang'),
        ('kiengiang', 'Kiên Giang'),
        ('camau', 'Cà Mau'),
        ('baclieu', 'Bạc Liêu'),
        ('soc trang', 'Sóc Trăng'),
        ('other', 'Tỉnh/Thành phố khác'),
    ]
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='tutor_profile')
    university = models.CharField(max_length=200, blank=True)
    major = models.CharField(max_length=200, blank=True)
    # TO DELETE experience_years
    experience_years = models.CharField(max_length=10, choices=EXPERIENCE_CHOICES)
    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=50, choices=LOCATION_CHOICES, blank=True)  # Updated
    top_achievements = models.JSONField(default=list, blank=True, help_text="Top 2-3 achievements for quick display")
    is_verified = models.BooleanField(default=False)
    rating_average = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    total_reviews = models.IntegerField(default=0)
    profile_image = models.ImageField(upload_to=user_profile_path, blank=True)
    availability = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'tutor_profiles'
        indexes = [
            models.Index(fields=['hourly_rate']),
            models.Index(fields=['location']),
            models.Index(fields=['rating_average']),
        ]
    
    def update_rating(self):
        reviews = self.reviews_received.all()
        if reviews.exists():
            self.rating_average = reviews.aggregate(models.Avg('rating'))['rating__avg']
            self.total_reviews = reviews.count()
            self.save(update_fields=['rating_average', 'total_reviews'])

    def get_featured_achievements(self):
        """Get top 3 featured achievements"""
        return self.achievements.filter(is_featured=True)[:3]

    # TO DELETE: Not really needed
    def get_top_achievement_for_list(self):
        """Get one achievement for list display"""
        # First try featured achievements
        featured = self.achievements.filter(is_featured=True).first()
        if featured:
            return {
                'title': featured.title,
                'year': featured.year,
                'rank': featured.rank_position or '',
                'type': featured.get_achievement_type_display()
            }
        
        # Fallback to most recent achievement
        recent = self.achievements.first()
        if recent:
            return {
                'title': recent.title,
                'year': recent.year,
                'rank': recent.rank_position or '',
                'type': recent.get_achievement_type_display()
            }
        
        return None

class TutorSubject(models.Model):
    PROFICIENCY_CHOICES = [
        ('beginner', 'Cơ bản'), ('intermediate', 'Trung bình'),
        ('advanced', 'Nâng cao'), ('expert', 'Chuyên gia'),
    ]
    
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='tutor_subjects')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    proficiency_level = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES)
    
    class Meta:
        unique_together = ['tutor', 'subject']

class Achievement(models.Model):
    ACHIEVEMENT_TYPES = [
        ('education', 'Học vấn'),
        ('competition', 'Thi đấu'),
        ('certification', 'Chứng chỉ'),
        ('award', 'Giải thưởng'),
        ('experience', 'Kinh nghiệm'),
        ('research', 'Nghiên cứu'),
    ]
    
    ACHIEVEMENT_LEVELS = [
        ('international', 'Quốc tế'),
        ('national', 'Quốc gia'),
        ('regional', 'Khu vực'),
        ('provincial', 'Tỉnh/Thành phố'),
        ('school', 'Trường học'),
        ('other', 'Khác'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='achievements')
    title = models.CharField(max_length=200)
    description = models.TextField()
    year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    # NEW fields to add (these will be added via migration)
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES, default='other')
    level = models.CharField(max_length=20, choices=ACHIEVEMENT_LEVELS, default='other')
    institution = models.CharField(max_length=200, blank=True)  # Organizing institution
    month = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(12)])
    rank_position = models.CharField(max_length=50, blank=True)  # "Giải Nhất", "Top 10", etc.
    certificate_image = models.ImageField(upload_to='achievements/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)  # Show in top achievements

    # Added, not really needed though
    def __str__(self):
        return f"{self.tutor.user.get_full_name()} - {self.title}"
    
    @property
    def display_date(self):
        """Return formatted date for display"""
        if self.month:
            try:
                month_names = {
                    1: 'Tháng 1', 2: 'Tháng 2', 3: 'Tháng 3', 4: 'Tháng 4',
                    5: 'Tháng 5', 6: 'Tháng 6', 7: 'Tháng 7', 8: 'Tháng 8',
                    9: 'Tháng 9', 10: 'Tháng 10', 11: 'Tháng 11', 12: 'Tháng 12'
                }
                return f"{month_names[self.month]} {self.year}"
            except KeyError:
                pass
        return f"Năm {self.year}"
    
    @property
    def short_description(self):
        """Return truncated description for list view"""
        if len(self.description) > 100:
            return self.description[:97] + "..."
        return self.description

class TutorLike(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='liked_tutors')
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'tutor']

class TutorSave(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='saved_tutors')
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='saves')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'tutor']

class TutorView(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='viewed_tutors')
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='views')
    viewed_at = models.DateTimeField(auto_now_add=True)

class ChatRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='chat_rooms')
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['student', 'tutor']

class Message(models.Model):
    MESSAGE_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')
    file_attachment = models.FileField(upload_to=chat_file_path, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='reviews_given')
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='reviews_received')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['student', 'tutor']