# models/subject.py
from django.db import models
import uuid


class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    # description = models.TextField(blank=True)
    # created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name