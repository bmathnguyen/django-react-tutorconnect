from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from users.models import CustomUser
from profiles.models import TutorProfile, StudentProfile, TutorSubject, TutorSubjectTag
from subjects.models import Subject
from decimal import Decimal

class TutorSearchTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create Student User (Viewer)
        self.student_user = CustomUser.objects.create_user(
            email='student@test.com',
            username='student@test.com',
            password='password123',
            first_name='Student',
            last_name='User',
            user_type='student'
        )
        StudentProfile.objects.create(user=self.student_user)
        self.client.force_authenticate(user=self.student_user)

        # Create Subjects
        self.math = Subject.objects.create(name='Mathematics')
        self.english = Subject.objects.create(name='English')

        # Create Tutor 1 (Math, Exam Prep, 500k)
        self.tutor1_user = CustomUser.objects.create_user(
            email='tutor1@test.com',
            username='tutor1@test.com',
            password='password123',
            user_type='tutor',
            first_name='Tutor',
            last_name='One'
        )
        self.tutor1 = TutorProfile.objects.create(
            user=self.tutor1_user,
            rating_average=4.5,
            price_min=500000
        )
        ts1 = TutorSubject.objects.create(tutor_profile=self.tutor1, subject=self.math)
        TutorSubjectTag.objects.create(tutor_subject=ts1, tag='Exam Prep', price=500000)

        # Create Tutor 2 (English, Conversational, 300k)
        self.tutor2_user = CustomUser.objects.create_user(
            email='tutor2@test.com',
            username='tutor2@test.com',
            password='password123',
            user_type='tutor',
            first_name='Tutor',
            last_name='Two'
        )
        self.tutor2 = TutorProfile.objects.create(
            user=self.tutor2_user,
            rating_average=4.0,
            price_min=300000
        )
        ts2 = TutorSubject.objects.create(tutor_profile=self.tutor2, subject=self.english)
        TutorSubjectTag.objects.create(tutor_subject=ts2, tag='Conversational', price=300000)

        self.url = reverse('tutor-search')

    def test_search_by_subject_id(self):
        """Test filtering by subjectId"""
        response = self.client.get(self.url, {'subjectId': self.math.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['uuid'], str(self.tutor1.pk))

    def test_search_by_tag(self):
        """Test filtering by tags"""
        response = self.client.get(self.url, {'tags': 'Conversational'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['uuid'], str(self.tutor2.pk))

    def test_search_by_max_price(self):
        """Test filtering by max_price"""
        # Should return only Tutor 2 (300k <= 400k)
        response = self.client.get(self.url, {'max_price': 400000})
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['uuid'], str(self.tutor2.pk))

        # Should return both (300k & 500k <= 600k)
        response = self.client.get(self.url, {'max_price': 600000})
        self.assertEqual(len(response.data['results']), 2)

    def test_combined_filters(self):
        """Test combining filters"""
        # Math AND < 400k -> Should be 0 results (Tutor 1 is 500k)
        response = self.client.get(self.url, {'subjectId': self.math.id, 'max_price': 400000})
        self.assertEqual(len(response.data['results']), 0)

        # Math AND Exam Prep -> Should be Tutor 1
        response = self.client.get(self.url, {'subjectId': self.math.id, 'tags': 'Exam Prep'})
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['uuid'], str(self.tutor1.pk))
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot search"""
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
