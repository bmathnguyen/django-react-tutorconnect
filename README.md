# TutorConnect

**TutorConnect** is a modern, full-stack tutoring platform designed to connect students with qualified tutors in Vietnam and Singapore. Built with Django REST API and a React Native mobile frontend, TutorConnect provides a seamless, mobile-first experience for both students and tutors.

---

## 🚀 Overview
TutorConnect aims to make finding and booking tutors as easy as possible, with features inspired by popular marketplaces and real-time messaging apps. The platform supports subject and location-based search, interactive matching, and user-friendly management for both sides of the tutoring relationship.

---

## ✨ Features
- **Student & Tutor Profiles**: Separate registration and onboarding flows for students and tutors
- **Tutor Discovery**: Search and filter tutors by subject, grade, price, and location (online/offline)
- **Tinder-like Matching**: Students can like/unlike tutors for personalized recommendations
- **Saved Tutors**: Bookmark tutors for quick access
- **Reviews & Ratings**: Leave feedback and view tutor ratings
- **Achievements**: Verified tutor credentials and certifications
- **Real-time Chat**: Secure, WebSocket-based messaging between students and tutors
- **Profile Management**: Update profiles, upload avatars, and manage personal info
- **Internationalization**: Full Vietnamese & English support, with currency conversion (VND/SGD)
- **Mobile-first UX**: Built with React Native + Expo for a native app experience

---

## 🛠️ Tech Stack & Architecture
- **Backend**: Django 4.2.7, Django REST Framework, JWT Auth, Django Channels (WebSocket), Redis, SQLite/PostgreSQL
- **Frontend**: React Native, Expo, AsyncStorage, Context API
- **Deployment**: Docker, Gunicorn, Whitenoise
- **Other**: Skeleton loading, offline support, debounced search, 5-minute API cache

```
project-root/
├── backend/           # Django API & Channels
├── frontend/          # React Native (Expo) app
├── API_DOCUMENTATION.md
├── README.md
└── ...
```

---

## 📱 Mobile App Structure
- **Navigation**: Bottom tab navigation (Home, Saved, Tinder, Messages, Profile)
- **Screens**: Organized by feature (Auth, Home, Chat, etc.)
- **AuthContext & LanguageContext**: Global state for authentication and internationalization

---

## 🔗 API Highlights
- **Base URL**: `/api/`
- **Auth**: JWT-based (register, login, refresh, logout)
- **Tutor Search**: `/api/search/tutors/` with advanced filters
- **Tutor Detail**: `/api/tutors/{uuid}/`
- **Interactions**: Like, save, review, and view tutors
- **Chat**: Real-time messaging via WebSocket and REST endpoints
- **Profile**: Update user info, upload avatars

For full API details, see [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md).

---

## ⚡ Quickstart (Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- Yarn or npm
- Docker (optional, for deployment)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# (Optional) Seed mock data:
python manage.py seed_sg_mockdata
```

### Frontend Setup
```bash
cd frontend
yarn install  # or npm install
npx expo start
```

---

## 🌏 Internationalization & Currency
- Switch between Vietnamese and English in-app
- Currency toggle: VND ↔ SGD (auto conversion)
- All prices formatted for locale and currency

---

## 🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss major changes. See [CONTRIBUTING.md](./CONTRIBUTING.md) if available.

---

## 📄 License
[MIT](./LICENSE)

---

## 🙏 Credits
- Singapore MOE subject data for mock seeding
- Open source libraries: Django, DRF, React Native, Expo, Redis, Docker, and more

---

## 📬 Contact
For questions or feedback, please open a GitHub issue or contact the maintainer.
