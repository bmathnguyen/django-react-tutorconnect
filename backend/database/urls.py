"""
URL configuration for database project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include # URL routing functions
# from api import views # API views python file
from rest_framework.urlpatterns import format_suffix_patterns # Format suffixes for URLs
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # path("", views.default_view), # must import views.default_view in api.views.py
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Route all /api/ requests to api app
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Uncomment the following line if you want to enable format suffixes in your URLs, must add format = None to the view functions
# urlpatterns = format_suffix_patterns(urlpatterns)