# 🛋️ Cloud Furniture - E-Commerce Platform

A full-stack e-commerce platform for furniture trading with role-based access control, built with Spring Boot and React.

## 🌟 Features

### User Features
- Browse furniture catalog with detailed product information
- Shopping cart with quantity management
- User authentication and authorization
- Request seller status through approval workflow

### Seller Features
- Add and manage furniture listings
- Upload product details (title, description, price, images)
- View and edit personal inventory
- Track sales (planned feature)

### Admin Features
- User management dashboard
- Approve/reject seller requests
- Manage all listings across the platform
- Create additional admin accounts
- Delete users and listings

## 🛠️ Tech Stack

### Backend
- **Java 21** - Modern Java features and performance
- **Spring Boot 3.5.6** - Enterprise-grade framework
- **Spring Security** - JWT-based authentication
- **Spring Data JPA** - MySQL integration for user management
- **Spring Data MongoDB** - NoSQL database for product listings
- **BCrypt** - Password hashing
- **Maven** - Dependency management

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Context API** - Global state management
- **Vite** - Fast build tool and dev server
- **CSS** - Custom styling

### Databases
- **MySQL** - User authentication and management
- **MongoDB** - Product listings and inventory

### DevOps & Deployment Ready
- **Docker** - Containerized backend application
- **Docker Compose** - Local development environment
- Ready for deployment on:
  - **Render.com** (Backend)
  - **Vercel** (Frontend)
  - **Railway** (MySQL)
  - **MongoDB Atlas** (MongoDB)

## 📋 Prerequisites

- Java 21 or higher
- Node.js 18+ and npm
- MySQL 8+
- MongoDB 7+
- Docker & Docker Compose (optional, for containerized setup)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/hemanthbobba24/cloud-furniture.git
cd cloud-furniture
```

### 2. Database Setup

#### Option A: Using Docker Compose (Recommended)
```bash
cd infra
docker-compose up -d
```

This will start:
- MySQL on `localhost:3306`
- MongoDB on `localhost:27017`

#### Option B: Manual Setup
1. Install MySQL and create database:
```sql
CREATE DATABASE furniture;
```

2. Install MongoDB and start the service

### 3. Backend Setup

```bash
cd backend

# Update application.yml with your database credentials
# Located at: src/main/resources/application.yml

# Build and run
./mvnw clean install
./mvnw spring-boot:run
```

Backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on `http://localhost:5173`

## 🔑 Default Configuration

### Database Credentials (Docker Compose)
```yaml
MySQL:
  Host: localhost
  Port: 3306
  Database: furniture
  Username: root
  Password: password

MongoDB:
  Host: localhost
  Port: 27017
  Username: root
  Password: password
  Database: furniture
```

### JWT Configuration
- Secret key is configured in `application.yml`
- Token expiry: 24 hours (86400 seconds)

## 👥 User Roles & Access

### Role Hierarchy
1. **USER** - Default role for new registrations
   - Browse products
   - Manage cart
   - Request seller status

2. **SELLER** - Approved through admin
   - All USER permissions
   - Add/edit/delete own listings
   - Manage inventory

3. **ADMIN** - Created via SQL or admin panel
   - Full system access
   - User management
   - Seller request approval
   - Manage all listings

### Creating an Admin User

1. Register a normal user account through the UI
2. Upgrade to admin via MySQL:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Or use the admin panel's "Create Admin" feature (requires existing admin access)

## 📁 Project Structure

```
cloud-furniture/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/app/
│   │   │   │   ├── admin/          # Admin controllers
│   │   │   │   ├── auth/           # Authentication & JWT
│   │   │   │   ├── config/         # Security & CORS config
│   │   │   │   ├── listing/        # Product listings (MongoDB)
│   │   │   │   ├── sellerrequest/  # Seller approval workflow
│   │   │   │   └── user/           # User management (MySQL)
│   │   │   └── resources/
│   │   │       └── application.yml # Configuration
│   ├── Dockerfile                  # Docker configuration
│   └── pom.xml                     # Maven dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/                  # React components
│   │   ├── App.jsx                 # Main app & routing
│   │   ├── AuthContext.jsx         # Authentication state
│   │   └── main.jsx                # Entry point
│   └── package.json                # npm dependencies
├── infra/
│   └── docker-compose.yml          # Local dev environment
└── README.md
```

## 🔐 Security Features

- **JWT Authentication** - Stateless token-based auth
- **BCrypt Password Hashing** - Secure password storage
- **Role-Based Access Control** - Granular permissions
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Server-side validation
- **Protected Routes** - Frontend route guards

## 🎯 API Endpoints

### Authentication
```
POST   /api/v1/auth/signup          # Register new user
POST   /api/v1/auth/login           # Login and get JWT token
```

### Listings (Public)
```
GET    /api/v1/listings             # Get all listings
GET    /api/v1/listings/{id}        # Get listing by ID
```

### Seller (Requires SELLER role)
```
GET    /api/v1/seller/my            # Get seller's listings
POST   /api/v1/seller/listings      # Create new listing
PUT    /api/v1/seller/listings/{id} # Update listing
DELETE /api/v1/seller/listings/{id} # Delete listing
```

### Seller Requests (Requires USER role)
```
POST   /api/v1/seller-request/submit    # Submit seller request
GET    /api/v1/seller-request/my-status # Check request status
```

### Admin (Requires ADMIN role)
```
GET    /admin/users                       # List all users
POST   /admin/users/{id}/upgrade-to-seller # Manual upgrade
DELETE /admin/users/{id}                  # Delete user
POST   /admin/users/create-admin          # Create new admin
GET    /admin/seller-requests             # Get pending requests
POST   /admin/approve-seller/{requestId}  # Approve seller request
POST   /admin/reject-seller/{requestId}   # Reject seller request
DELETE /admin/listings/{id}               # Delete any listing
```

## 🐛 Known Issues & Future Enhancements

### Planned Features
- [ ] Order management system
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Advanced search and filtering
- [ ] Seller analytics dashboard
- [ ] Wishlist functionality
- [ ] Password reset flow

### Current Limitations
- No order/checkout system (cart only)
- No payment processing
- No email notifications
- Free tier deployment may have cold start delays

## 📸 Screenshots


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Hemanth Sri Ram Bobba**
- GitHub: [@hemanthbobba24](https://github.com/hemanthbobba24)
- LinkedIn: [Your LinkedIn Profile]

## 🙏 Acknowledgments

- Spring Boot documentation
- React documentation
- MongoDB Atlas
- Railway.app
- Render.com
- All open-source contributors

---

⭐ If you found this project helpful, please give it a star!

**Live Demo:** _Coming soon!_

