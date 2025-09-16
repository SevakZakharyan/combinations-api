-- Create database
CREATE DATABASE IF NOT EXISTS combinations_db;
USE combinations_db;

-- Table to store items (A1, B1, B2, C1, etc.)
CREATE TABLE items (
   id INT AUTO_INCREMENT PRIMARY KEY,
   item_name VARCHAR(10) NOT NULL UNIQUE,
   prefix_letter CHAR(1) NOT NULL,
   sequence_number INT NOT NULL
);

-- Table to store combinations with their unique IDs
CREATE TABLE combinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  combination_data JSON NOT NULL
);

-- Table to store responses sent to the client
CREATE TABLE responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    combination_id INT NOT NULL,
    request_data JSON NOT NULL,
    response_data JSON NOT NULL,
    FOREIGN KEY (combination_id) REFERENCES combinations(id)
);
