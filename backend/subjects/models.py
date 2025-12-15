# subjects/models.py
from django.db import models
import uuid


class Subject(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    is_admin_subject = models.BooleanField(default=False)
    # description = models.TextField(blank=True)
    # created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
