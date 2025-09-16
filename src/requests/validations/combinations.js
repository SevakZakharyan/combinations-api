/**
 * Validate combination generation request input
 * @param {number[]} inputArray - Array of item counts
 * @param {number} length - Combination length
 * @returns {Object|null} Error object if validation fails, null if valid
 */
const validateCombinationInput = (inputArray, length) => {
	if (!Array.isArray(inputArray) || inputArray.length === 0) {
		return { message: 'Items must be a non-empty array' };
	}
	
	if (!inputArray.every(num => Number.isInteger(num) && num > 0)) {
		return { message: 'All items must be positive integers' };
	}
	
	if (!Number.isInteger(length) || length <= 0) {
		return { message: 'Length must be a positive integer' };
	}
	
	if (inputArray.length > 26) {
		return { message: 'Maximum 26 item types allowed' };
	}
	
	if (length > 20) {
		return { message: 'Maximum combination length is 20' };
	}
	
	if (length > inputArray.length) {
		return { message: `Cannot create combinations of length ${length} with only ${inputArray.length} item types` };
	}
	
	const totalItems = inputArray.reduce((sum, count) => sum + count, 0);
	if (totalItems > 50) {
		return { message: 'Too many total items. Maximum 50 items allowed.' };
	}
	
	return null;
};

module.exports = {
	validateCombinationInput
};
