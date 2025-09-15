# Combinations API

Generate valid combinations from input arrays while respecting prefix constraints.

## Problem

Input `[1, 2, 1]` creates items `A1, B1, B2, C1`. Generate combinations where items with same prefix cannot be combined.

Example: `[A1,B1], [A1,B2], [A1,C1], [B1,C1], [B2,C1]` (5 combinations for length=2)

## Quick Start

### Setup Environment
```bash
# Copy environment configuration
cp .env.example .env
```

### Option 1: Docker
```bash
docker-compose up --build
```

### Option 2: Custom Bootstrap

**Steps:**
```bash
# 1. Install dependencies
npm install

# 2. Setup MySQL database
mysql -u root -p
CREATE DATABASE combinations_db;

# 3. Run SQL schema
mysql -u root -p combinations_db < init.sql

# 4. Edit .env file with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password

# 5. Start application
npm start
```
# combinations-api 

# Some eaxmples
<img width="1291" height="1175" alt="Screenshot 2025-09-15 at 17 59 34" src="https://github.com/user-attachments/assets/5e8124ad-ff78-4781-98f1-1d24e971e029" />
<img width="1310" height="1203" alt="Screenshot 2025-09-15 at 17 59 10" src="https://github.com/user-attachments/assets/0132abae-1c19-4da6-8bc6-4a9b1893d83f" />
