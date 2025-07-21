from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import CustomUser

class AuthTests(APITestCase):
    def test_register_student(self):
        url = reverse('register')
        data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "Testpass123!",
            "password_confirm": "Testpass123!",
            "phone": "0123456789",
            "user_type": "student",
            "first_name": "Test",
            "last_name": "User",
            "profile_data": {
                "school": "THPT Example",
                "grade": "10",
                "learning_goals": ["Thi THPTQG"],
                "location": "hanoi"
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('user', response.data)

    def test_login(self):
        # First, register a user
        CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="Testpass123!",
            user_type="student"
        )
        url = reverse('login')
        data = {
            "email": "testuser@example.com",
            "password": "Testpass123!"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertIn('user', response.data)