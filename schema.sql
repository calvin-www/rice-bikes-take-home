-- ============================================
-- Rice Bikes Repair Database Setup & Seed
-- PostgreSQL Version
-- ============================================

-- Drop tables if they exist (safe to re-run)
DROP TABLE IF EXISTS repair_transactions;
DROP TABLE IF EXISTS bikes;
DROP TABLE IF EXISTS customers;

-- ============================================
-- Create Tables
-- ============================================

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT
);

CREATE TABLE bikes (
    bike_id SERIAL PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL
);

CREATE TABLE repair_transactions (
    transaction_id SERIAL PRIMARY KEY,
    bike_id INT NOT NULL,
    customer_id INT NOT NULL,
    total_cost NUMERIC(10,2) NOT NULL,
    transaction_date DATE NOT NULL,
    CONSTRAINT fk_bike
        FOREIGN KEY (bike_id)
        REFERENCES bikes(bike_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
);
