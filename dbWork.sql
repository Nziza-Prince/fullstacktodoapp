-- Create the database
CREATE DATABASE shopping_cart;

-- Switch to the newly created database
\c shopping_cart;

-- Customers Table
CREATE TABLE Customers (
    customerId SERIAL PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phoneNumber VARCHAR(15),
    address TEXT
);

-- Products Table
CREATE TABLE Products (
    productId SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    category VARCHAR(50)
);

-- Orders Table
CREATE TABLE Orders (
    orderId SERIAL PRIMARY KEY,
    customerId INT NOT NULL,
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    totalAmount DECIMAL(10, 2) NOT NULL CHECK (totalAmount >= 0),
    status VARCHAR(20) DEFAULT 'Pending',
    FOREIGN KEY (customerId) REFERENCES Customers(customerId)
);

-- OrderDetails Table
CREATE TABLE OrderDetails (
    orderDetailId SERIAL PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES Orders(orderId),
    FOREIGN KEY (productId) REFERENCES Products(productId)
);

-- Indexes for faster searches
CREATE INDEX idx_customers_email ON Customers(email);
CREATE INDEX idx_products_category ON Products(category);
CREATE INDEX idx_orders_status ON Orders(status);

-- Sample Data (optional)
INSERT INTO Customers (firstName, lastName, email, phoneNumber, address)
VALUES 
('Nziza', 'Prince', 'nzizaprince778@gmail.com', '1234567890', '123 Elm Street'),
('Ganza', 'Praise', 'ganza@hotmail.com', '0987654321', '456 Oak Street');

INSERT INTO Products (name, description, price, stock, category)
VALUES 
('Laptop', 'High-performance laptop', 1500.00, 10, 'Electronics'),
('Headphones', 'Noise-cancelling headphones', 200.00, 50, 'Accessories'),
('Coffee Mug', 'Ceramic coffee mug', 10.00, 100, 'Home');

INSERT INTO Orders (customerId, totalAmount, status)
VALUES 
(1, 1510.00, 'Pending');

INSERT INTO OrderDetails (orderId, productId, quantity, price)
VALUES 
(1, 1, 1, 1500.00),
(1, 2, 1, 10.00);
