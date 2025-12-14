# subjects/serializers.py
from rest_framework import serializers
from subjects.models import Subject
from profiles.models import TutorSubject

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class TutorSubjectSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    
    class Meta:
        model = TutorSubject
        fields = ['subject', 'level', 'price']

