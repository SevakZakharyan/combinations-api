const mysql = require('mysql2/promise');

const dbConfig = {
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 3306,
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || 'password',
	database: process.env.DB_NAME || 'combinations_db',
	acquireTimeout: 60000,
	timeout: 60000,
	reconnect: true
};

/**
 * Create a new database connection
 * @returns {Promise<Object>} MySQL connection object
 * @throws {Error} When connection fails
 */
const createConnection = async () => {
	try {
		return await mysql.createConnection(dbConfig);
	} catch (error) {
		console.error('Database connection failed:', error.message);
		throw new Error('Failed to connect to database');
	}
};

module.exports = {
	createConnection
};
