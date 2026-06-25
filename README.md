# Sweet Bakery 🥐
**Description**: Full-stack MVP for an artisan bakery web application. Customers can browse products, manage a cart and place orders. Admins can manage the product catalog and update order statuses.

## 📌 Exercise Statement
S5.02 — Final Project MVP. Build a full-stack REST API with a React frontend covering authentication, product management, cart, and order workflows with role-based access control.

## ✨ Features
- User registration and login with JWT authentication
- Product catalog browsing (public)
- Shopping cart with add, update quantity and remove items
- Checkout with delivery details and payment method selection (cash or card)
- Order history for customers
- Admin panel: create, edit and deactivate products
- Admin order management: view all orders and update their status

## 🛠 Technologies
- **Backend**: Java 21, Spring Boot 3.3.5, Spring Security, JWT (jjwt 0.12.3), Spring Data JPA, Hibernate, Flyway, springdoc-openapi 2.6.0
- **Database**: PostgreSQL
- **Frontend**: React 18, Vite, Tailwind CSS v4, Axios, React Router v6
- **Testing**: JUnit 5, Mockito, MockMvc, H2 (in-memory)
- **Deployment**: Docker, Render

## 🌐 Deployment
- **Backend (live)**: https://tasca-s5-02-projecte-final-mvp.onrender.com
- **Swagger UI (live)**: https://tasca-s5-02-projecte-final-mvp.onrender.com/swagger-ui/index.html

> Note: the backend is hosted on Render's free tier and may take up to 50 seconds to respond after a period of inactivity.

## 📋 User Stories & Kanban
- **GitHub Project board**: https://github.com/users/MarcCasadevall/projects/2

## 🚀 Installation & Setup

### Prerequisites
- Java 21
- Node.js 18+
- Docker (for running PostgreSQL locally)

### 1. Clone the repository
```bash
git clone https://github.com/MarcCasadevall/Tasca-S5.02---Projecte-Final-MVP.git
cd Tasca-S5.02---Projecte-Final-MVP
```

### 2. Environment variables
Create a `.env` file in the project root based on `.env.example`:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bakery_db
DB_USER=bakery_user
DB_PASSWORD=bakery_pass
JWT_SECRET=your-secret-key-minimum-32-characters-long
JWT_EXPIRATION=86400000
SERVER_PORT=8080
### 3. Start the database with Docker
```bash
docker-compose up -d
```
This starts a PostgreSQL 16 container. Flyway will automatically apply all migrations on backend startup.

### 4. Run the backend
```bash
./mvnw spring-boot:run
```
The API will be available at `http://localhost:8080`.

### 5. Run the frontend
```bash
cd bakery-frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

### Default admin credentials
Email: admin@bakery.com
Password: admin123
## 📖 API Documentation
Swagger UI is available at:
- **Local**: http://localhost:8080/swagger-ui/index.html
- **Production**: https://tasca-s5-02-projecte-final-mvp.onrender.com/swagger-ui/index.html

### Authenticating in Swagger UI
1. Call `POST /api/auth/login` with your credentials
2. Copy the `token` value from the response
3. Click the **Authorize** button (top right)
4. Enter `Bearer <your_token>` and click **Authorize**
5. All protected endpoints are now accessible

## 🧪 Running Tests
```bash
./mvnw test
```
The test suite includes:
- **Unit tests**: `CartServiceTest`, `OrderServiceTest` — test business logic in isolation using Mockito
- **Acceptance tests**: `AuthControllerTest`, `CartControllerTest` — test API endpoints end-to-end using MockMvc and an H2 in-memory database

Current coverage: **77% line coverage** (above the 60% minimum requirement).

## 🐳 Docker
The `docker-compose.yml` file sets up the PostgreSQL database for local development:
```bash
docker-compose up -d     # start the database
docker-compose down      # stop the database
```
The backend can also be built and run as a Docker image using the provided `Dockerfile`:
```bash
docker build -t sweet-bakery .
docker run -p 8080:8080 --env-file .env sweet-bakery
```

## 🔐 Authentication & Roles
JWT-based authentication implemented with Spring Security. Tokens must be included in the `Authorization` header as `Bearer <token>`.

Two roles are available:
- **CUSTOMER** — can browse products, manage their cart, place orders and view their order history
- **ADMIN** — can manage products and update order statuses. Admin endpoints are protected under `/api/admin/**`

## 🧩 Architecture & Technical Decisions

### Backend structure
Organized by feature packages (`auth`, `user`, `product`, `cart`, `order`, `config`, `exception`), each containing its entity, repository, service, controller and DTOs.

### Role-based access
Public endpoints: product catalog and auth. Admin endpoints grouped under `/api/admin/**`. All other endpoints require a valid JWT enforced by `SecurityFilterChain`.

### Cart design
Cart items are stored persistently in the database per user. When an order is placed, cart items are converted to order items (freezing the unit price at that moment) and the cart is cleared atomically within a single `@Transactional` operation.

### Price integrity
`OrderItem` stores `unitPrice` at the time of purchase, ensuring that future product price changes do not affect existing orders.

### Database migrations
Flyway manages all schema changes. Each migration is versioned (`V1`, `V2`...) and applied automatically on backend startup — no manual SQL required.

## 🔄 Git Workflow
Development followed a feature branch workflow:
- Each User Story was developed in a dedicated branch (e.g. `feature/us-03-cart`)
- Changes were integrated via Pull Requests to `main`
- Commits follow the Conventional Commits format (`feat`, `fix`, `test`, `docs`, `build`)

## 📸 Demo

### Customer view
![Catalog](screenshots/catalog.png)
![Cart](screenshots/cart.png)
![Checkout](screenshots/checkout.png)
![Order History](screenshots/order-history.png)

### Admin view
![Admin Products](screenshots/admin-products.png)
![Admin Orders](screenshots/admin-orders.png)