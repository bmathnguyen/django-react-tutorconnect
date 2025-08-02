# models/user.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
import uuid


class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.

    Inherits:
        - username
        - first_name
        - last_name
        - email
        - password
        - is_staff
        - is_active
        - is_superuser
        - last_login
        - date_joined
        - groups
        - user_permissions

    Adds:
        - id (UUID primary key)
        - phone (with validation)
        - user_type (student/tutor)
        - is_online
        - last_activity (for online status tracking)
    Supports both students and tutors with additional fields for the tutoring platform.
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
    # Another mode for Singapore phone number: 8 digits: TO BE IMPLEMENTED
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
    
    # Allow username to be blank and set it to null in the database
    username = models.CharField(
        max_length=150,
        unique=False,
        blank=True,
        null=True,
        help_text='Optional. 150 characters or fewer. Letters, digits and @/./+/-/_ only.',
        error_messages={
            'unique': "A user with that username already exists.",
        },
    )

    # Use email as the primary identifier instead of username
    USERNAME_FIELD = 'email'
    
    # user_type is required during user creation
    REQUIRED_FIELDS = ['user_type']
    
    class Meta:
        # It's generally better to let Django manage the table name (e.g., 'api_customuser').
        # If 'auth_user' is required for compatibility, you can uncomment the line below.
        # db_table = 'auth_user'
        
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