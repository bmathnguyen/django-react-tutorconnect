# models/interaction.py
from django.db import models
from .profile import StudentProfile, TutorProfile


class TutorLike(models.Model):
    student = models.ForeignKey(StudentProfile, to_field='uuid', db_column='student_profile_uuid', on_delete=models.CASCADE, related_name='liked_tutors')
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'tutor']


class TutorSave(models.Model):
    student = models.ForeignKey(StudentProfile, to_field='uuid', db_column='student_profile_uuid', on_delete=models.CASCADE, related_name='saved_tutors')
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='saves')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'tutor']


class TutorView(models.Model):
    # This model records each time a student views a tutor's profile.
    # It helps track view counts, analytics, or recent activity for tutors.
    student = models.ForeignKey(
        StudentProfile, 
        on_delete=models.CASCADE, 
        related_name='viewed_tutors'  # Allows reverse lookup: student.viewed_tutors.all()
    )
    tutor = models.ForeignKey(
        TutorProfile, 
        on_delete=models.CASCADE, 
        related_name='views'  # Allows reverse lookup: tutor.views.all()
    )
    viewed_at = models.DateTimeField(
        auto_now_add=True  # Timestamp for when the view was created
    )