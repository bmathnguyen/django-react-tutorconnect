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
