from rest_framework import serializers
from .models import User  # Import your User model here

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Assuming you have a User model in your Django app
        fields = ['id', 'username', 'email']
