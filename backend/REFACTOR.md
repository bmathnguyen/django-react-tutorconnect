# TutorConnect Backend Refactoring Documentation

## Overview

This document details the comprehensive refactoring of the TutorConnect Django backend from a monolithic `api` app structure to a modular, multi-app architecture following Django best practices.

**Date:** January 2025  
**Status:** ✅ Completed

---

## Table of Contents

1. [Motivation](#motivation)
2. [Technologies Used](#technologies-used)
3. [Refactoring Strategy](#refactoring-strategy)
4. [New App Structure](#new-app-structure)
5. [Detailed Changes](#detailed-changes)
6. [Migration Process](#migration-process)
7. [Seeding Data](#seeding-data)
8. [Testing & Verification](#testing--verification)

---

## Motivation

### Problems with Previous Structure

The original codebase had all models, serializers, and views organized in a single `api` app:

```
backend/api/
├── models/
│   ├── user.py
│   ├── profile.py
│   ├── subject.py
│   ├── interaction.py
│   ├── chat.py
│   └── review.py
├── serializers/
│   ├── auth.py
│   ├── user.py
│   ├── profile.py
│   └── ...
└── views/
    ├── auth.py
    ├── tutor.py
    └── ...
```

**Issues:**
- ❌ Poor separation of concerns
- ❌ Difficult to maintain as codebase grows
- ❌ Hard to test individual components
- ❌ Not following Django best practices
- ❌ Tight coupling between different domains

### Goals

- ✅ Separate concerns into focused Django apps
- ✅ Improve code maintainability and scalability
- ✅ Follow Django best practices
- ✅ Make testing easier
- ✅ Enable independent development of features

---

## Technologies Used

### Core Framework
- **Django 5.2.4** - Web framework
- **Django REST Framework** - API framework
- **Django Channels** - WebSocket support for real-time chat
- **Daphne** - ASGI server

### Authentication & Security
- **djangorestframework-simplejwt** - JWT authentication
- **django-cors-headers** - CORS handling
- **rest_framework_simplejwt.token_blacklist** - Token blacklisting

### Database
- **PostgreSQL** - Primary database (production)
- **SQLite3** - Development fallback

### Additional Packages
- **django-filters** - Advanced filtering
- **Faker** - Data generation for seeding
- **channels-redis** - Redis channel layer for WebSockets

---

## Refactoring Strategy

### Phase-by-Phase Approach

1. **Phase 1: Create Django Apps** ✅
   - Created 7 new Django apps using `python manage.py startapp`

2. **Phase 2: Move Models** ✅
   - Migrated models from `api/models/` to respective apps
   - Updated foreign key references

3. **Phase 3: Move Serializers** ✅
   - Migrated serializers with updated imports

4. **Phase 4: Move Views** ✅
   - Migrated views to respective apps

5. **Phase 5: Move Supporting Files** ✅
   - Filters, consumers, routing files

6. **Phase 6: Update Configuration** ✅
   - Settings, URLs, ASGI configuration

7. **Phase 7: Admin & URLs** ✅
   - Created admin.py in each app
   - Created urls.py in each app

8. **Phase 8: Create Seeding Command** ✅
   - Comprehensive database seeder

---

## New App Structure

### App Breakdown

#### 1. **users** App
**Purpose:** User authentication and user model

**Models:**
- `CustomUser` - Extended Django user with UUID, user_type, wallet_balance

**Serializers:**
- `UserSerializer` - User data serialization
- `RegisterSerializer` - User registration
- `LoginSerializer` - User authentication

**Views:**
- `register_view` - POST `/api/v1/auth/register/`
- `login_view` - POST `/api/v1/auth/login/`
- `logout_view` - POST `/api/v1/auth/logout/`
- `me_view` - GET `/api/v1/auth/me/`

**Files:**
```
users/
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── admin.py
└── migrations/
```

---

#### 2. **profiles** App
**Purpose:** Student and tutor profiles

**Models:**
- `StudentProfile` - Student-specific data
- `TutorProfile` - Tutor-specific data
- `TutorSubject` - Tutor-subject relationship with pricing
- `TutorSubjectTag` - Additional tags for tutor subjects
- `TutorAchievement` - Tutor achievements
- `ClassLevel` - Grade level groupings

**Serializers:**
- `StudentProfileSerializer`
- `TutorProfileSerializer`
- `TutorSubjectSerializer`

**Views:**
- `update_profile_view` - PATCH `/api/v1/users/profile/`
- `upload_profile_image_view` - POST `/api/v1/upload/profile-image/`

**Files:**
```
profiles/
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── admin.py
└── migrations/
```

---

#### 3. **subjects** App
**Purpose:** Subject management and metadata

**Models:**
- `Subject` - Available subjects (Math, Physics, etc.)

**Serializers:**
- `SubjectSerializer`

**Views:**
- `subjects_list_view` - GET `/api/v1/subjects/`
- `platform_stats_view` - GET `/api/v1/platform/stats/`

**Files:**
```
subjects/
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── admin.py
└── migrations/
```

---

#### 4. **interactions** App
**Purpose:** Student-tutor interactions

**Models:**
- `TutorLike` - Students liking tutors
- `TutorSave` - Students saving tutors
- `TutorView` - Analytics for tutor profile views

**Views:**
- `like_tutor_view` - POST `/api/v1/tutors/<id>/like/`
- `unlike_tutor_view` - DELETE `/api/v1/tutors/<id>/unlike/`
- `save_tutor_view` - POST `/api/v1/tutors/<id>/save/`
- `unsave_tutor_view` - DELETE `/api/v1/tutors/<id>/unsave/`
- `saved_tutors_view` - GET `/api/v1/users/saved-tutors/`
- `liked_tutors_view` - GET `/api/v1/users/liked-tutors/`

**Files:**
```
interactions/
├── models.py
├── views.py
├── urls.py
├── admin.py
└── migrations/
```

---

#### 5. **chats** App
**Purpose:** Real-time messaging between students and tutors

**Models:**
- `ChatRoom` - Chat room between student and tutor
- `Message` - Individual messages

**Serializers:**
- `ChatRoomSerializer`
- `MessageSerializer`

**Views:**
- `chat_rooms_view` - GET `/api/v1/chats/`
- `create_chat_room_view` - POST `/api/v1/chats/create/`
- `chat_messages_view` - GET `/api/v1/chats/<id>/messages/`
- `send_message_view` - POST `/api/v1/chats/<id>/send/`

**WebSocket:**
- `consumers.py` - ChatConsumer for real-time messaging
- `routing.py` - WebSocket URL routing

**Files:**
```
chats/
├── models.py
├── serializers.py
├── views.py
├── consumers.py
├── routing.py
├── urls.py
├── admin.py
└── migrations/
```

---

#### 6. **reviews** App
**Purpose:** Student reviews for tutors

**Models:**
- `Review` - Student reviews with ratings and comments

**Serializers:**
- `ReviewSerializer` - Review display
- `CreateReviewSerializer` - Review creation

**Views:**
- `tutor_reviews_view` - GET `/api/v1/tutors/<id>/reviews/`
- `create_review_view` - POST `/api/v1/tutors/<id>/reviews/create/`

**Files:**
```
reviews/
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── admin.py
└── migrations/
```

---

#### 7. **tutors** App
**Purpose:** Tutor search and detail views (aggregation layer)

**Models:**
- None (uses models from other apps)

**Serializers:**
- `TutorListSerializer` - Tutor list/search results
- `TutorDetailSerializer` - Detailed tutor information

**Views:**
- `TutorSearchView` - GET `/api/v1/search/tutors/`
- `TutorDetailView` - GET `/api/v1/tutors/<uuid>/`

**Filters:**
- `TutorSearchFilter` - Advanced filtering (subjects, price, class levels, location)

**Files:**
```
tutors/
├── serializers.py
├── views.py
├── filters.py
├── urls.py
├── admin.py
└── migrations/
```

---

## Detailed Changes

### 1. Model Migrations

#### Before:
```python
# api/models/user.py
from django.contrib.auth.models import AbstractUser
class CustomUser(AbstractUser):
    # ...
```

#### After:
```python
# users/models.py
from django.contrib.auth.models import AbstractUser
class CustomUser(AbstractUser):
    # ...
```

**Key Changes:**
- Models moved to app-specific `models.py` files
- Foreign key references updated (e.g., `'subjects.Subject'` instead of `Subject`)
- `AUTH_USER_MODEL` changed from `'api.CustomUser'` to `'users.CustomUser'`

### 2. Import Updates

All imports were updated throughout the codebase:

**Before:**
```python
from api.models import CustomUser, TutorProfile
from api.serializers import UserSerializer
```

**After:**
```python
from users.models import CustomUser
from profiles.models import TutorProfile
from users.serializers import UserSerializer
```

### 3. Settings Configuration

**`database/settings.py` Changes:**

```python
INSTALLED_APPS = [
    # ... Django apps ...
    'database',
    # New modular apps
    'users',
    'profiles',
    'subjects',
    'interactions',
    'chats',
    'reviews',
    'tutors',
    # Legacy api app removed
    # 'api',  # REMOVED: Causes model conflicts
    # ...
]

# Updated AUTH_USER_MODEL
AUTH_USER_MODEL = 'users.CustomUser'  # Changed from 'api.CustomUser'
```

### 4. URL Configuration

**`database/urls.py` Changes:**

```python
urlpatterns = [
    path('admin/', admin.site.urls),
    # New modular app URLs
    path('api/v1/', include('users.urls')),
    path('api/v1/', include('profiles.urls')),
    path('api/v1/', include('tutors.urls')),
    path('api/v1/', include('interactions.urls')),
    path('api/v1/', include('chats.urls')),
    path('api/v1/', include('reviews.urls')),
    path('api/v1/', include('subjects.urls')),
]
```

**App-level URLs Example (`users/urls.py`):**

```python
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    # ...
]
```

### 5. ASGI Configuration

**`database/asgi.py` Changes:**

```python
# Before
from api.routing import websocket_urlpatterns

# After
from chats.routing import websocket_urlpatterns
```

### 6. Admin Configuration

Each app now has its own `admin.py`:

```python
# users/admin.py
from django.contrib import admin
from users.models import CustomUser

@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    # ...
```

---

## Migration Process

### Step 1: Create New Apps

```bash
cd backend
python manage.py startapp users
python manage.py startapp profiles
python manage.py startapp subjects
python manage.py startapp interactions
python manage.py startapp chats
python manage.py startapp reviews
python manage.py startapp tutors
```

### Step 2: Remove Old App from INSTALLED_APPS

**Critical:** Remove `'api'` from `INSTALLED_APPS` to avoid model conflicts.

### Step 3: Create Migrations

```bash
python manage.py makemigrations users
python manage.py makemigrations profiles
python manage.py makemigrations subjects
python manage.py makemigrations interactions
python manage.py makemigrations chats
python manage.py makemigrations reviews
```

### Step 4: Run Migrations

```bash
python manage.py migrate
```

**Note:** Old `api_*` tables remain in the database but are unused. They can be dropped later if desired.

### Step 5: Verify

```bash
python manage.py check
python manage.py runserver
```

---

## Seeding Data

### Comprehensive Seeder Command

**Location:** `backend/database/management/commands/seed_all.py`

**Usage:**

```bash
# Basic seeding (default: 30 tutors, 10 students)
python manage.py seed_all

# Custom amounts
python manage.py seed_all --tutors 50 --students 20

# Clear existing data first
python manage.py seed_all --clear

# Different locales
python manage.py seed_all --locale vn    # Vietnamese (default)
python manage.py seed_all --locale sg    # Singapore
python manage.py seed_all --locale both  # Both

# Full customization
python manage.py seed_all \
    --tutors 40 \
    --students 15 \
    --reviews 5 \
    --chats 10 \
    --clear
```

### What It Seeds

1. **Subjects** - Vietnamese and/or Singapore subjects
2. **Class Levels** - Grade 1-5, 6-9, 10-12
3. **Tutors** - With profiles, subjects, achievements, ratings
4. **Students** - With profiles, preferred subjects, budgets
5. **Reviews** - Student reviews for tutors
6. **Interactions** - Likes, saves, views
7. **Chat Rooms** - With realistic messages

### Features

- ✅ Uses new app structure (`users.models`, `profiles.models`, etc.)
- ✅ Realistic Vietnamese data using Faker (vi_VN locale)
- ✅ Configurable via command-line arguments
- ✅ Transaction-safe (atomic operations)
- ✅ Progress output with color-coded messages
- ✅ Comprehensive summary at completion

---

## Testing & Verification

### System Check

```bash
python manage.py check
# System check identified no issues (0 silenced).
```

### Verify Migrations

```bash
python manage.py showmigrations
```

### Test API Endpoints

All endpoints should work with the same URLs:

```bash
# Authentication
POST /api/v1/auth/register/
POST /api/v1/auth/login/
GET  /api/v1/auth/me/

# Tutor Search
GET /api/v1/search/tutors/

# Tutor Details
GET /api/v1/tutors/<uuid>/

# And all other endpoints...
```

### Verify Admin Interface

```bash
python manage.py runserver
# Visit http://localhost:8000/admin/
```

All models should be visible in their respective app sections.

---

## File Structure Comparison

### Before (Monolithic)

```
backend/
├── api/
│   ├── models/
│   │   ├── user.py
│   │   ├── profile.py
│   │   ├── subject.py
│   │   ├── interaction.py
│   │   ├── chat.py
│   │   └── review.py
│   ├── serializers/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── profile.py
│   │   └── ...
│   ├── views/
│   │   ├── auth.py
│   │   ├── tutor.py
│   │   └── ...
│   ├── filters.py
│   ├── consumers.py
│   ├── routing.py
│   └── urls.py
└── database/
    ├── settings.py
    └── urls.py
```

### After (Modular)

```
backend/
├── users/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── profiles/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── subjects/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── interactions/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── chats/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── consumers.py
│   ├── routing.py
│   ├── urls.py
│   └── admin.py
├── reviews/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── tutors/
│   ├── serializers.py
│   ├── views.py
│   ├── filters.py
│   ├── urls.py
│   └── admin.py
└── database/
    ├── settings.py
    ├── urls.py
    ├── asgi.py
    └── management/
        └── commands/
            └── seed_all.py
```

---

## Benefits Achieved

### 1. **Separation of Concerns**
- Each app has a single, well-defined responsibility
- Easier to understand and navigate

### 2. **Maintainability**
- Changes to one domain don't affect others
- Easier to locate and fix bugs

### 3. **Scalability**
- New features can be added as new apps
- Teams can work on different apps independently

### 4. **Testability**
- Each app can be tested independently
- Clearer test organization

### 5. **Django Best Practices**
- Follows Django's recommended project structure
- Better alignment with Django conventions

### 6. **Code Organization**
- Related code is grouped together
- Clearer import paths

---

## Important Notes

### ⚠️ Breaking Changes

1. **AUTH_USER_MODEL** changed from `'api.CustomUser'` to `'users.CustomUser'`
   - This requires new migrations
   - Old user data needs migration if preserving

2. **Import Paths** changed throughout codebase
   - All imports updated to new app structure
   - Old `api.*` imports no longer work

3. **Old `api` App**
   - Removed from `INSTALLED_APPS`
   - Old tables remain in database (can be dropped)
   - Old migrations preserved for reference

### ✅ Backward Compatibility

- **API URLs remain the same** - All endpoints work with `/api/v1/` prefix
- **API responses unchanged** - Serializers produce same output
- **Database schema compatible** - New tables created, old ones preserved

---

## Future Improvements

### Potential Enhancements

1. **Data Migration Script**
   - Migrate existing data from `api_*` tables to new tables
   - Preserve user accounts and relationships

2. **Cleanup Old Tables**
   - Drop unused `api_*` tables after data migration
   - Remove old `api/` directory

3. **Additional Apps**
   - `payments/` - Payment processing
   - `notifications/` - Notification system
   - `analytics/` - Analytics and reporting

4. **Testing Suite**
   - Unit tests for each app
   - Integration tests for API endpoints
   - Test fixtures using seed data

---

## Conclusion

The refactoring successfully transformed the TutorConnect backend from a monolithic structure to a modular, maintainable architecture following Django best practices. The new structure:

- ✅ Improves code organization
- ✅ Enhances maintainability
- ✅ Follows Django conventions
- ✅ Enables future scalability
- ✅ Maintains API compatibility

All functionality has been preserved while significantly improving the codebase structure.

---

## References

- [Django Apps Documentation](https://docs.djangoproject.com/en/stable/ref/applications/)
- [Django Best Practices](https://docs.djangoproject.com/en/stable/misc/design-philosophies/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Channels](https://channels.readthedocs.io/)

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Author:** Refactoring Team

