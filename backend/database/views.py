from django.http import JsonResponse
from .models import User
from .serializer import UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Marks a Django view function as an API endpoint.

# Wraps your function so that:

# request is a DRF Request (not the plain Django HttpRequest).

# You can return a DRF Response (not HttpResponse/JsonResponse).

# DRF’s authentication, permission checks, throttling, and content negotiation run automatically.

# Unsupported HTTP methods automatically get a 405 Method Not Allowed response.
@api_view(['GET', 'POST'])
def user_list(request):
    """
    View to list all users.
    SQL ORM
    """
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE']) 
def user_detail(request, id):
    """
    View to retrieve, update or delete a user by ID.
    SQL ORM
    """
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def default_view(request):
    """
    Default view to return a simple JSON response.
    """
    return JsonResponse({"message": "Welcome to the database API!"})