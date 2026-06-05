-- V2__seed_admin.sql
-- Default admin user (password: Admin1234!)
-- BCrypt hash generated for 'Admin1234!'

INSERT INTO users (name, email, password, role, created_at)
VALUES (
    'Admin',
    'admin@bakery.com',
    '$2a$10$5LjPlVRLtln7OlIMPhgVb.5XdrrqUWE6SjwdyWNAYV5AcOqfdGaX2',
    'ADMIN',
    NOW()
);