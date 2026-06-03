-- V1__create_schema.sql
-- Initial schema for the Bakery MVP

CREATE TABLE users (
    id         BIGSERIAL    PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id          BIGSERIAL      PRIMARY KEY,
    name        VARCHAR(150)   NOT NULL,
    description TEXT,
    price       NUMERIC(10, 2) NOT NULL,
    category    VARCHAR(50)    NOT NULL,
    image_url   VARCHAR(500),
    active      BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
    id             BIGSERIAL      PRIMARY KEY,
    user_id        BIGINT         NOT NULL REFERENCES users(id),
    status         VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(10)    NOT NULL,
    total_price    NUMERIC(10, 2) NOT NULL,
    created_at     TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id         BIGSERIAL      PRIMARY KEY,
    order_id   BIGINT         NOT NULL REFERENCES orders(id),
    product_id BIGINT         NOT NULL REFERENCES products(id),
    quantity   INT            NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL
);

-- unit_price is copied from the product at order time
-- so future price changes do not affect existing orders

CREATE TABLE cart_items (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT    NOT NULL REFERENCES users(id),
    product_id BIGINT    NOT NULL REFERENCES products(id),
    quantity   INT       NOT NULL CHECK (quantity > 0),
    UNIQUE (user_id, product_id)
);
