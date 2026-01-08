🛋️ Cloud Furniture

Full-Stack E-Commerce Platform | Spring Boot · React · Secure RBAC

Cloud Furniture is a production-ready full-stack e-commerce platform for furniture trading that demonstrates secure authentication, role-based access control, scalable backend design, and a modern React frontend.

This project reflects real-world enterprise engineering practices rather than a tutorial-style demo.

🔗 GitHub Repository: https://github.com/hemanthbobba24/cloud-furniture

🚀 Live Demo: Coming soon

📌 Why This Project Matters (Recruiter Overview)

This project highlights my ability to:

Design and implement secure REST APIs using Spring Boot

Build JWT-based authentication & authorization

Model real approval workflows (User → Seller → Admin)

Use polyglot persistence (MySQL + MongoDB)

Develop role-protected React SPAs

Prepare applications for cloud deployment & containerization

It closely mirrors the architecture of commercial e-commerce and SaaS platforms.

🌟 Key Features
👤 User Features

Browse furniture catalog with detailed product information

Shopping cart with quantity management

Secure signup & login using JWT

Request seller access through an approval workflow

🧑‍💼 Seller Features

Add, edit, and delete furniture listings

Manage personal inventory

Upload product details (title, price, description, images)

Architecture ready for sales tracking and analytics

🛡️ Admin Features

User management dashboard

Approve or reject seller requests

Manage all listings across the platform

Create additional admin accounts

Delete users and listings

🏗️ System Architecture
Frontend

React 18

React Router

Context API for global authentication state

Protected routes based on user roles

Vite for fast builds

Backend

Java 21

Spring Boot 3

Spring Security with JWT

RESTful API architecture

Layered design (Controller → Service → Repository)

Databases

MySQL – User accounts, authentication, roles

MongoDB – Product listings and inventory

Demonstrates polyglot persistence strategy

DevOps & Deployment Ready

Dockerized backend

Docker Compose for local infrastructure

Cloud-ready deployment:

Backend: Render

Frontend: Vercel

MySQL: Railway

MongoDB: MongoDB Atlas

🔐 Security & Best Practices

JWT-based stateless authentication

BCrypt password hashing

Role-based access control (RBAC)

Secure CORS configuration

Server-side input validation

Frontend route guards

Clean separation of concerns

👥 Role Hierarchy & Access Model
Role	Capabilities
USER	Browse products, manage cart, request seller access
SELLER	Manage own listings and inventory
ADMIN	Full system control (users, sellers, listings)

This design mirrors enterprise authorization models.

🎯 API Endpoints (High-Level)

Authentication

POST /api/v1/auth/signup

POST /api/v1/auth/login

Public Listings

GET /api/v1/listings

GET /api/v1/listings/{id}

Seller (SELLER role required)

POST /api/v1/seller/listings

PUT /api/v1/seller/listings/{id}

DELETE /api/v1/seller/listings/{id}

Admin (ADMIN role required)

GET /admin/users

POST /admin/approve-seller/{requestId}

DELETE /admin/listings/{id}

🧪 Running the Project Locally
✅ Prerequisites

Java 21+

Node.js 18+

Docker & Docker Compose (recommended)

MySQL 8+ (manual setup only)

MongoDB 7+ (manual setup only)

🐳 Option 1: Docker Setup (Recommended)
git clone https://github.com/hemanthbobba24/cloud-furniture.git
cd cloud-furniture/infra
docker-compose up -d


This starts:

MySQL → localhost:3306

MongoDB → localhost:27017

⚙️ Backend Setup
cd backend
./mvnw clean install
./mvnw spring-boot:run


Backend runs at:
👉 http://localhost:8080

Configuration file:
backend/src/main/resources/application.yml

🎨 Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:
👉 http://localhost:5173

🔑 Default Local Credentials

MySQL

Host: localhost
Port: 3306
Database: furniture
Username: root
Password: password


MongoDB

Host: localhost
Port: 27017
Database: furniture
Username: root
Password: password

👮 Creating an Admin User

Register a normal user through the UI

Promote the user via MySQL:

UPDATE users
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';


Or use the Admin Panel (requires existing admin).

📁 Project Structure
cloud-furniture/
├── backend/                     # Spring Boot backend
│   ├── src/main/java/com/app/
│   │   ├── auth/                # Authentication & JWT
│   │   ├── user/                # User management (MySQL)
│   │   ├── sellerrequest/       # Seller approval workflow
│   │   ├── listing/             # Product listings (MongoDB)
│   │   ├── admin/               # Admin operations
│   │   └── config/              # Security & CORS configuration
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── pages/               # Feature pages
│   │   ├── App.jsx              # Routing
│   │   ├── AuthContext.jsx      # Auth state
│   │   └── main.jsx             # Entry point
│   └── package.json
│
├── infra/
│   └── docker-compose.yml       # MySQL & MongoDB
│
└── README.md

🚧 Known Limitations & Roadmap
Planned Enhancements

Order & checkout system

Payment integration (Stripe / PayPal)

Email notifications

Product reviews & ratings

Advanced search and filters

Seller analytics dashboard

Wishlist functionality

Password reset flow

Current Limitations

No payment processing

Cart only (no checkout)

No email notifications

Free-tier deployments may have cold starts

👨‍💻 Author

Hemanth Sri Ram Bobba
Software Engineer | Java Full-Stack Developer

GitHub: https://github.com/hemanthbobba24
