# models/review.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from .profile import StudentProfile, TutorProfile
import uuid


# Review model: Stores student reviews for tutors, including rating, comment, and timestamps.
class Review(models.Model):
    # Unique ID for each review (UUID for safety and scalability)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # The student who wrote the review (linked to StudentProfile; if deleted, reviews are deleted)
    student = models.ForeignKey(
        StudentProfile, 
        on_delete=models.CASCADE, 
        related_name='reviews_given'
    )
    # The tutor being reviewed (linked to TutorProfile; if deleted, reviews are deleted)
    tutor = models.ForeignKey(
        TutorProfile, 
        on_delete=models.CASCADE, 
        related_name='reviews_received'
    )
    # Rating score, must be an integer between 1 and 5
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    # Optional written comment from the student
    comment = models.TextField(blank=True)
    # Timestamp when the review was created (auto-set)
    created_at = models.DateTimeField(auto_now_add=True)
    # Timestamp when the review was last updated (auto-updates)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        # Each student can only leave one review per tutor
        unique_together = ['student', 'tutor']