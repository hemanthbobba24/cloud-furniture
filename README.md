# Cloud Furniture  
Full-Stack E-Commerce Platform | Spring Boot · React · Secure RBAC

Cloud Furniture is a production-ready full-stack e-commerce platform for furniture trading that demonstrates secure authentication, role-based access control, scalable backend design, and a modern React frontend.

This project reflects real-world enterprise engineering practices rather than a tutorial-style demo.

Repository: https://github.com/hemanthbobba24/cloud-furniture  
Live Demo: Coming soon

---

## Why This Project Matters

This project showcases the ability to:

- Design secure REST APIs using Spring Boot
- Implement JWT-based authentication and authorization
- Model real approval workflows (User → Seller → Admin)
- Use polyglot persistence with MySQL and MongoDB
- Build role-protected React single-page applications
- Prepare applications for cloud deployment and containerization

---

## Features

### User Features
- Browse furniture catalog with detailed product information
- Shopping cart with quantity management
- Secure signup and login using JWT
- Request seller access through an approval workflow

### Seller Features
- Add, edit, and delete furniture listings
- Manage personal inventory
- Upload product details such as title, price, description, and images

### Admin Features
- User management dashboard
- Approve or reject seller requests
- Manage all listings across the platform
- Create additional admin accounts
- Delete users and listings

---

## System Architecture

### Frontend
- React 18
- React Router
- Context API for global authentication state
- Role-based protected routes
- Vite build tool

### Backend
- Java 21
- Spring Boot 3
- Spring Security with JWT
- RESTful API design
- Layered architecture (Controller, Service, Repository)

### Databases
- MySQL for users, roles, and authentication
- MongoDB for product listings and inventory

### DevOps and Deployment
- Dockerized backend
- Docker Compose for local infrastructure
- Cloud-ready for deployment on Render, Vercel, Railway, and MongoDB Atlas

---

## Security

- JWT-based stateless authentication
- BCrypt password hashing
- Role-based access control
- Secure CORS configuration
- Server-side input validation
- Frontend route guards

---

## Role Hierarchy

| Role   | Permissions |
|--------|------------|
| USER   | Browse products, manage cart, request seller access |
| SELLER | Manage own listings and inventory |
| ADMIN  | Full system access and moderation |

---

## API Endpoints (High Level)

### Authentication
- POST /api/v1/auth/signup
- POST /api/v1/auth/login

### Public Listings
- GET /api/v1/listings
- GET /api/v1/listings/{id}

### Seller (SELLER role required)
- POST /api/v1/seller/listings
- PUT /api/v1/seller/listings/{id}
- DELETE /api/v1/seller/listings/{id}

### Admin (ADMIN role required)
- GET /admin/users
- POST /admin/approve-seller/{requestId}
- DELETE /admin/listings/{id}

---

## Running the Project Locally

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- Docker and Docker Compose (recommended)
- MySQL 8+ (manual setup)
- MongoDB 7+ (manual setup)

---

### Option 1: Docker Setup (Recommended)

```bash
git clone https://github.com/hemanthbobba24/cloud-furniture.git
cd cloud-furniture/infra
docker-compose up -d
This starts:

MySQL on localhost:3306

MongoDB on localhost:27017

Backend Setup
bash
Copy code
cd backend
./mvnw clean install
./mvnw spring-boot:run
Backend runs at:
http://localhost:8080

Configuration file:
backend/src/main/resources/application.yml

Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs at:
http://localhost:5173

Default Local Credentials
MySQL

yaml
Copy code
Host: localhost
Port: 3306
Database: furniture
Username: root
Password: password
MongoDB

makefile
Copy code
Host: localhost
Port: 27017
Database: furniture
Username: root
Password: password
Creating an Admin User
Register a user through the UI

Promote the user using MySQL

sql
Copy code
UPDATE users
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
Project Structure
text
Copy code
cloud-furniture/
├── backend/
│   ├── src/main/java/com/app/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── sellerrequest/
│   │   ├── listing/
│   │   ├── admin/
│   │   └── config/
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── AuthContext.jsx
│   │   └── main.jsx
│   └── package.json
│
├── infra/
│   └── docker-compose.yml
│
└── README.md
Roadmap
Order and checkout system

Payment integration (Stripe / PayPal)

Email notifications

Product reviews and ratings

Advanced search and filtering

Seller analytics dashboard

Wishlist functionality

Password reset flow

Author
Hemanth Sri Ram Bobba
Software Engineer | Java Full-Stack Developer

GitHub: https://github.com/hemanthbobba24
LinkedIn: Add your LinkedIn URL

If you found this project useful, please consider giving it a star.
