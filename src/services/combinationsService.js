const database = require('../config/database');

/**
 * Convert input array to item objects with prefix and name
 * @param {number[]} inputArray - Array of counts per prefix (e.g., [1, 2, 1])
 * @returns {Object[]} Array of item objects with name and prefix
 */
const convertInputToItems = (inputArray) => {
	const items = [];
	let prefixIndex = 0;
	
	inputArray.forEach(count => {
		const prefixLetter = String.fromCharCode(65 + prefixIndex);
		
		for (let i = 1; i <= count; i++) {
			items.push({
				name: `${prefixLetter}${i}`,
				prefix: prefixLetter
			});
		}
		prefixIndex++;
	});
	
	return items;
};

/**
 * Generate all valid combinations using backtracking algorithm
 * @param {Object[]} items - Array of item objects with name and prefix
 * @param {number} length - Required combination length
 * @returns {string[][]} Array of combinations, each combination is an array of item names
 */
const generateCombinations = (items, length) => {
	if (length <= 0 || length > items.length) {
		return [];
	}
	
	const combinations = [];
	
	const generateRecursive = (currentCombination, startIndex, usedPrefixes) => {
		if (currentCombination.length === length) {
			combinations.push([...currentCombination]);
			return;
		}
		
		for (let i = startIndex; i < items.length; i++) {
			const item = items[i];
			
			if (usedPrefixes.has(item.prefix)) {
				continue;
			}
			
			currentCombination.push(item.name);
			usedPrefixes.add(item.prefix);
			
			generateRecursive(currentCombination, i + 1, usedPrefixes);
			
			currentCombination.pop();
			usedPrefixes.delete(item.prefix);
		}
	};
	
	generateRecursive([], 0, new Set());

	return combinations;
};

/*
 * ALTERNATIVE APPROACH FOR LARGE INPUTS:
 *
 * For larger datasets that exceed our current limits, we could use a
 * generator-based approach that yields combinations one at a time:
 *
 * function* generateCombinationsLazy(items, length) {
 *     function* generate(current, start, usedPrefixes) {
 *         if (current.length === length) {
 *             yield [...current];
 *             return;
 *         }
 *
 *         for (let i = start; i < items.length; i++) {
 *             const item = items[i];
 *             if (usedPrefixes.has(item.prefix)) continue;
 *
 *             current.push(item.name);
 *             usedPrefixes.add(item.prefix);
 *
 *             yield* generate(current, i + 1, usedPrefixes);
 *
 *             current.pop();
 *             usedPrefixes.delete(item.prefix);
 *         }
 *     }
 *
 *     yield* generate([], 0, new Set());
 * }
 *
 * This approach would handle much larger inputs by processing combinations
 * one at a time instead of storing them all in memory.
 */

/**
 * Store items in the database
 * @param {Object} connection - MySQL connection object
 * @param {Object[]} items - Array of item objects to store
 */
const storeItems = async (connection, items) => {
	for (const item of items) {
		await connection.execute(
			'INSERT IGNORE INTO items (item_name, prefix_letter, sequence_number) VALUES (?, ?, ?)',
			[item.name, item.prefix, parseInt(item.name.substring(1))]
		);
	}
};

/**
 * Store combination data and return the combination ID
 * @param {Object} connection - MySQL connection object
 * @param {string[][]} combinations - Array of combinations to store
 * @returns {Promise<number>} The inserted combination ID
 */
const storeCombination = async (connection, combinations) => {
	const [result] = await connection.execute(
		'INSERT INTO combinations (combination_data) VALUES (?)',
		[JSON.stringify(combinations)]
	);
	return result.insertId;
};

/**
 * Store API response data for audit trail
 * @param {Object} connection - MySQL connection object
 * @param {number} combinationId - The combination ID
 * @param {Object} requestData - Original request data
 * @param {Object} responseData - Response data to store
 */
const storeResponse = async (connection, combinationId, requestData, responseData) => {
	await connection.execute(
		'INSERT INTO responses (combination_id, request_data, response_data) VALUES (?, ?, ?)',
		[combinationId, JSON.stringify(requestData), JSON.stringify(responseData)]
	);
};

/**
 * Execute database operations within a transaction
 * @param {Object} connection - MySQL connection object
 * @param {Object[]} items - Items to store
 * @param {string[][]} combinations - Combinations to store
 * @param {number[]} inputArray - Original input array
 * @param {number} length - Combination length
 * @returns {Promise<Object>} Response data with ID and combinations
 */
const executeTransaction = async (connection, items, combinations, inputArray, length) => {
	await connection.beginTransaction();
	
	try {
		await storeItems(connection, items);
		
		const combinationId = await storeCombination(connection, combinations);
		
		const responseData = {
			id: combinationId,
			combination: combinations
		};
		
		const requestData = { items: inputArray, length };
		await storeResponse(connection, combinationId, requestData, responseData);
		await connection.commit();
		
		return responseData;
	} catch (error) {

		await connection.rollback();
		throw error;
	}
};

/**
 * Main service function to generate combinations and store them in database
 * @param {number[]} inputArray - Array of item counts per prefix type (e.g., [1, 2, 1])
 * @param {number} length - Required length of each combination
 * @returns {Promise<Object>} Response object containing:
 *   - id: number - Unique combination set ID
 *   - combination: string[][] - Array of generated combinations
 * @throws {Error} When database operations fail or invalid input provided
 *
 * @example
 * // Input: [1, 2, 1] with length 2
 * // Creates items: A1, B1, B2, C1
 * // Returns: { id: 1, combination: [["A1","B1"], ["A1","B2"], ["A1","C1"], ["B1","C1"], ["B2","C1"]] }
 */
const generateAndStore = async (inputArray, length) => {
	const connection = await database.createConnection();
	
	try {
		const items = convertInputToItems(inputArray);
		
		const uniquePrefixes = new Set(items.map(item => item.prefix)).size;
		if (length > uniquePrefixes) {
			throw new Error(`Cannot create combinations of length ${length} with only ${uniquePrefixes} unique prefixes`);
		}
		
		const combinations = generateCombinations(items, length);
		const result = await executeTransaction(connection, items, combinations, inputArray, length);
		
		console.log(`Successfully generated and stored ${combinations.length} combinations`);
		
		return result;
	} catch (error) {

		console.error('Error in generateAndStore:', error.message);
		throw error;
	} finally {
		
		await connection.end();
	}
};

module.exports = {
	generateAndStore,
	convertInputToItems,
	generateCombinations
};
