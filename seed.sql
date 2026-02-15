INSERT INTO customers (first_name, last_name, email, phone_number) VALUES
('Alex', 'Nguyen', 'alex.nguyen@email.com', '7135550101'),
('Maria', 'Lopez', 'maria.lopez@email.com', '7135550102'),
('James', 'Carter', 'james.carter@email.com', '7135550103'),
('Sophie', 'Kim', 'sophie.kim@email.com', '7135550104'),
('Daniel', 'Reed', 'daniel.reed@email.com', '7135550105');

INSERT INTO bikes (make, model) VALUES
('Trek', 'Domane'),
('Specialized', 'Allez'),
('Giant', 'Defy'),
('Cannondale', 'Synapse'),
('Santa Cruz', 'Hightower');

INSERT INTO repair_transactions (bike_id, customer_id, total_cost, transaction_date) VALUES
(1, 1, 89.99, '2026-01-05'),
(2, 2, 120.00, '2026-01-08'),
(3, 3, 45.50, '2026-01-10'),
(4, 4, 200.00, '2026-01-12'),
(5, 5, 75.25, '2026-01-15'),
(1, 1, 150.00, '2026-01-18'),
(2, 3, 60.00, '2026-01-20'),
(3, 2, 95.75, '2026-01-22'),
(4, 5, 180.00, '2026-01-25'),
(5, 4, 55.00, '2026-01-28');
