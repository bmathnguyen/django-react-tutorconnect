## User Model

### Fields
- `userId` (UUID): Unique user identifier
- `name` (string): First + last name
- `email` (string): Email address
- `role` (string): User type ("student" or "tutor")
- `walletBalance` (decimal): User's wallet balance
- `createdAt` (datetime): Account creation timestamp
- `is_online` (bool): Online status
- `last_activity` (datetime): Last activity timestamp
- `student_profile` (object): Student profile data (if applicable)
- `tutor_profile` (object): Tutor profile data (if applicable)
- `achievements` (array): Top 3 achievements (tutors only)

### Example API Response
```json
{
  "userId": "e8c4b1b2-6d9f-4e6a-9b2e-2b1c4e6a9b2e",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "student",
  "walletBalance": "0.00",
  "createdAt": "2025-10-29T16:00:00Z",
  "is_online": false,
  "last_activity": "2025-10-29T16:00:00Z",
  "student_profile": { ... },
  "tutor_profile": null,
  "achievements": []
}
```

### API Endpoints
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET api/auth/me/` — Get current user profile
- `PATCH /users/profile/` — Update current user profile

### Example Requests & Responses (Postman)

### TutorSubject & TutorSubjectTag Models

**TutorSubject**
- id (UUID, PK)
- tutor_profile (FK to TutorProfile)
- subject (FK to Subject)
- level (basic/advanced)
- price (decimal)

**TutorSubjectTag**
- id (UUID, PK)
- tutor_subject (FK to TutorSubject)
- tag (CharField, e.g., "Olympiad", "MOE")
- price (decimal)
- is_admin_tag (bool)

**Uniqueness constraint:** The pair (`tutor_subject`, `tag`) must be unique for each TutorSubjectTag.

**Relationships:**
- Each TutorProfile has many TutorSubjects (with subject, level, price)
- Each TutorSubject can have multiple TutorSubjectTags

### TutorProfile API (Updated)

**Fields:**
- uuid (PK)
- user (User UUID)
- education
- bio
- location
- is_verified
- rating_average
- total_reviews
- profile_image
- achievements: list of `{id, title, is_featured}`
- class_levels
- tutor_subjects: array of TutorSubject objects
    - Each TutorSubject: `{id, subject, level, price, tags: [TutorSubjectTag]}`

**Example tutor_subjects JSON:**
```json
[
  {
    "id": "uuid-1",
    "subject": 1,  // subject PK
    "level": "advanced",
    "price": 350000,
    "tags": [
      {"id": "uuid-tag1", "price": 350000}
    ]
  },
  {
    "id": "uuid-2",
    "subject": 2,
    "level": "basic",
    "price": 250000,
    "tags": []
  }
]
```

### StudentProfile API

**Fields:**
- uuid (PK)
- school
- grade
- learning_goals
- preferred_subjects
- location
- budget_min, budget_max
- profile_image
- preferences (JSON)

**Example Response:**
```json
{
  "uuid": "a1b2c3...",
  "school": "Hanoi Amsterdam High School",
  "grade": "12",
  "learning_goals": ["IELTS 7.0"],
  "preferred_subjects": [ ... ],
  "location": "hanoi",
  "budget_min": 300000,
  "budget_max": 500000,
  "profile_image": null,
  "preferences": {"study_time": "evenings"}
}
```

### User Registration Errors

Possible errors returned by the registration endpoint:

| Field             | Example Error Message                       |
|-------------------|--------------------------------------------|
| password_confirm  | Passwords do not match.                    |
| password          | This password is too short.                 |
| password          | This password is too common.                |
| password          | This password is entirely numeric.          |
| email             | Email is required.                          |
| user_type         | User type is required.                      |

Errors are returned as a JSON object, e.g.:
```json
{
  "password": ["This password is too short. It must contain at least 8 characters."],
  "password_confirm": ["Passwords do not match."],
  "email": ["Email is required."]
}
```

#### Register
**Request:**
```
POST /api/auth/register
Content-Type: application/json
{
  "email": "jane.doe@example.com",
  "password": "StrongPassword123!",
  "password_confirm": "StrongPassword123!",
  "user_type": "student",
  "first_name": "Jane",
  "last_name": "Doe"
}
```
- `username` is not required in the request and will be auto-generated as a UUID string.
- `password_confirm` is required and must match `password`.
**Response:**
```
201 Created
{
  "user": {
    "userId": "e8c4b1b2-6d9f-4e6a-9b2e-2b1c4e6a9b2e",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "student",
    "walletBalance": "0.00",
    "createdAt": "2025-10-29T16:00:00Z",
    "is_online": false,
    "last_activity": "2025-10-29T16:00:00Z",
    "student_profile": null,
    "tutor_profile": null,
    "achievements": []
  },
  "tokens": {
    "access": "<jwt_access_token>",
    "refresh": "<jwt_refresh_token>"
  }
}
```

#### Login
**Request:**
```
POST /api/auth/login
Content-Type: application/json
{
  "email": "jane.doe@example.com",
  "password": "StrongPassword123!"
}
```
**Response:**
```
200 OK
{
  "user": {
    "userId": "e8c4b1b2-6d9f-4e6a-9b2e-2b1c4e6a9b2e",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "student",
    "walletBalance": "0.00",
    "createdAt": "2025-10-29T16:00:00Z",
    "is_online": false,
    "last_activity": "2025-10-29T16:00:00Z",
    "student_profile": null,
    "tutor_profile": null,
    "achievements": []
  },
  "tokens": {
    "access": "<jwt_access_token>",
    "refresh": "<jwt_refresh_token>"
  }
}
```

#### Get Profile
**Request:**
```
GET /api/auth/me
Authorization: Bearer <jwt_access_token>
```
**Response:**
```
200 OK
{
  "userId": "e8c4b1b2-6d9f-4e6a-9b2e-2b1c4e6a9b2e",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "student",
  "walletBalance": "0.00",
  "createdAt": "2025-10-29T16:00:00Z",
  "is_online": false,
  "last_activity": "2025-10-29T16:00:00Z",
  "student_profile": {
    "school": "Hanoi Amsterdam High School",
    "grade": "12",
    "learning_goals": ["IELTS 7.0"],
    "preferred_subjects": [],
    "location": "hanoi",
    "budget_min": "300000.00",
    "budget_max": "500000.00",
    "profile_image": null
  },
  "tutor_profile": null,
  "achievements": []
}
```

#### Update Profile
**Request:**
```
PATCH api/users/profile/
Authorization: Bearer <jwt_access_token>
Content-Type: application/json
{
    "userId": "4cc0dc23-9c32-486c-88de-5a1d450ad5f2",
    "name": "Jane Doe",
    "role": "student",
    "email": "jane.doe@example.com",
    "walletBalance": "0.00",
    "createdAt": "2025-10-29T15:37:29.324268+07:00",
    "is_online": false,
    "last_activity": "2025-10-29T15:40:15.600504+07:00",
    "student_profile": {
        "school": "Hanoi Amsterdam High School",
        "grade": "12",
        "learning_goals": [
            "IELTS 7.0",
            "FTU"
        ],
        "preferred_subjects": [],
        "location": "hanoi",
        "budget_min": "400000.00",
        "budget_max": "500000.00",
        "profile_image": null
    },
    "tutor_profile": null,
    "achievements": []
}
```
**Response:**
```
200 OK
{
    "userId": "4cc0dc23-9c32-486c-88de-5a1d450ad5f2",
    "name": "Jane Doe",
    "role": "student",
    "email": "jane.doe@example.com",
    "walletBalance": "0.00",
    "createdAt": "2025-10-29T15:37:29.324268+07:00",
    "is_online": false,
    "last_activity": "2025-10-29T15:40:15.600504+07:00",
    "student_profile": {
        "school": "Hanoi Amsterdam High School",
        "grade": "12",
        "learning_goals": [
            "IELTS 7.0"
        ],
        "preferred_subjects": [],
        "location": "hanoi",
        "budget_min": "400000.00",
        "budget_max": "500000.00",
        "profile_image": null
    },
    "tutor_profile": null,
    "achievements": []
}
```

### Automated Testing (Django)
- All user-related tests are located in `backend/api/tests/test_auth.py`.
- Run with: `python manage.py test api.tests.test_auth`
- Add new tests to this file to cover additional fields or logic.
- Tests use Django's built-in `TestCase` and the DRF APIClient for endpoint testing.

### CI/CD
- Recommended: Add GitHub Actions workflow to run all tests on push/PR
- See `.github/workflows/ci.yml` (example) for setup
