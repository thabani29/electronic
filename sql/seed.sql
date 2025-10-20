USE electronicstore;

INSERT INTO products (name, description, price, image, stock) VALUES
('Laptop Pro 14', '14-inch laptop with 8GB RAM, 256GB SSD', 799.99, 'https://via.placeholder.com/400x300?text=Laptop+Pro+14', 5),
('Budget Phone X', '5.8-inch smartphone, 64GB storage', 199.99, 'https://via.placeholder.com/400x300?text=Phone+X', 10),
('Mechanical Keyboard', 'RGB mechanical keyboard, blue switches', 69.99, 'https://via.placeholder.com/400x300?text=Keyboard', 15),
('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 'https://via.placeholder.com/400x300?text=Mouse', 25),
('27-inch Monitor', 'IPS 1080p monitor', 149.99, 'https://via.placeholder.com/400x300?text=Monitor', 7);

INSERT INTO users (name, email, password) VALUES ('Test User', 'test@example.com', 'password');
