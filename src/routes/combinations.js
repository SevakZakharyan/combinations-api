const express = require('express');
const combinationsService = require('../services/combinationsService');
const { validateCombinationInput } = require('../requests/validations/combinations');

const router = express.Router();

/**
 * POST /generate
 * Generate combinations and store in database
 *
 * @body {number[]} items - Array of item counts per prefix type
 * @body {number} length - Required combination length
 *
 * @returns {Object|null} Response with id and generated combinations
 */
router.post('/generate', async (req, res) => {
	try {
		const { items: inputArray, length } = req.body;
		
		const validationError = validateCombinationInput(inputArray, length);
		if (validationError) {
			return res.status(400).json(validationError);
		}
		
		const result = await combinationsService.generateAndStore(inputArray, length);
		
		res.status(201).json(result);
		
	} catch (error) {
		console.error('Error in /generate:', error.message);
		
		if (error.message.includes('Cannot create combinations') ||
			error.message.includes('Too many combinations')) {
			return res.status(422).json({ message: error.message });
		}
		
		res.status(500).json({ message: 'Internal server error' });
	}
});

module.exports = router;
