from rest_framework import serializers
from api.models import StudentProfile, TutorProfile
from .subject import SubjectSerializer, TutorSubjectSerializer

class StudentProfileSerializer(serializers.ModelSerializer):
    preferred_subjects = SubjectSerializer(many=True)
    
    class Meta:
        model = StudentProfile
        fields = [
            'school', 'grade', 'learning_goals', 'preferred_subjects',
            'location', 'budget_min', 'budget_max', 'profile_image'
        ]

class TutorProfileSerializer(serializers.ModelSerializer):
    tutor_subjects = TutorSubjectSerializer(many=True)
    
    class Meta:
        model = TutorProfile
        fields = [
            'user', 'education', 'bio', 'location', 'is_verified',
            'rating_average', 'total_reviews', 'profile_image',
            'achievements', 'class_levels', 'subjects', 'price_min', 'price_max'
        ]
        read_only_fields = ['user']

    # ADDITIONAL FUNCTIONS: WHAT ARE THESE FOR?
    # probably used for creating a tutor profile with subjects: without changing the Subject model
    def create(self, validated_data):
        subjects_data = validated_data.pop('tutor_subjects', [])
        tutor_profile = TutorProfile.objects.create(**validated_data)
        self._update_tutor_subjects(tutor_profile, subjects_data)
        return tutor_profile

    def update(self, instance, validated_data):
        subjects_data = validated_data.pop('tutor_subjects', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if subjects_data is not None:
            instance.tutor_subjects.all().delete()
            self._update_tutor_subjects(instance, subjects_data)

        return instance

    def _update_tutor_subjects(self, tutor_profile, subjects_data):
        for subject_data in subjects_data:
            TutorSubject.objects.create(
                tutor_profile=tutor_profile,
                subject=subject_data['subject'],
                level=subject_data['level'],
                price=subject_data['price']
            )
        self._update_price_bounds(tutor_profile)

    def _update_price_bounds(self, tutor_profile):
        prices = tutor_profile.tutor_subjects.values_list('price', flat=True)
        if prices:
            tutor_profile.price_min = min(prices)
            tutor_profile.price_max = max(prices)
            tutor_profile.save()
    