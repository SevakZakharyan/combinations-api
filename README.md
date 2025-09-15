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
