const express = require('express');
const combinationsRoutes = require('./src/routes/combinations');

const app = express();
const PORT = process.env.PORT || 3000;

const bootstrap = () => {
	try {
		app.use(express.json());
		
		app.use('/', combinationsRoutes);
		
		process.on('SIGTERM', () => {
			console.info('SIGTERM received, shutting down gracefully');
			process.exit(0);
		});
		
		process.on('SIGINT', () => {
			console.info('SIGINT received, shutting down gracefully');
			process.exit(0);
		});
		
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

bootstrap();
