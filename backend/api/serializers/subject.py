from rest_framework import serializers
from api.models import Subject, TutorSubject

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class TutorSubjectSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    
    class Meta:
        model = TutorSubject
        fields = ['subject', 'level', 'price']
