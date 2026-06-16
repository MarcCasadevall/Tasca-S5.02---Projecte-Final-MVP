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

## 🚀 Installation & Setup

### Prerequisites
- Java 21
- Node.js 18+
- PostgreSQL running locally

### 1. Clone the repository
```bash
git clone https://github.com/MarcCasadevall/Tasca-S5.02---Projecte-Final-MVP.git
cd Tasca-S5.02---Projecte-Final-MVP
```

### 2. Backend — environment variables
Create a `.env` file in the project root based on `.env.example`:

DB_URL=jdbc:postgresql://localhost:5432/bakery

DB_USERNAME=your_db_user

DB_PASSWORD=your_db_password

JWT_SECRET=your_secret_key

### 3. Run the backend
```bash
./mvnw spring-boot:run
```
Flyway will automatically create and seed the database schema on startup.

The API will be available at `http://localhost:8080`.  
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### 4. Run the frontend
```bash
cd bakery-frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

### Default admin credentials
Email: admin@bakery.com
Password: admin123

## 📸 Demo

### Customer view
![Catalog](screenshots/catalog.png)
![Cart](screenshots/cart.png)
![Checkout](screenshots/checkout.png)
![Order History](screenshots/order-history.png)

### Admin view
![Admin Products](screenshots/admin-products.png)
![Admin Orders](screenshots/admin-orders.png)

## 🧩 Architecture & Technical Decisions

### Backend structure
Organized by feature packages (`auth`, `user`, `product`, `cart`, `order`, `config`, `exception`), each containing its entity, repository, service, controller and DTOs.

### Role-based access
Two roles — `CUSTOMER` and `ADMIN` — enforced via Spring Security. Public endpoints: product catalog and auth. Admin endpoints are grouped under `/api/admin/**`. All other endpoints require a valid JWT.

### Cart design
Cart items are stored persistently in the database per user. When an order is placed, cart items are converted to order items (freezing the unit price at that moment) and the cart is cleared atomically within a single `@Transactional` operation.

### Price integrity
`OrderItem` stores `unitPrice` at the time of purchase, ensuring that future product price changes do not affect existing orders.

### Database migrations
Flyway manages all schema changes. Each migration is versioned (`V1`, `V2`...) and applied automatically on startup.