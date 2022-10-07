/**
 * Sum of an array
 * @param {number[]} array array of numbers
 * @return {number} sum of elements in array
 */
export const sum = (array) => array.reduce((a, b) => a + b);

/**
 * Counts the elements in an array that meet a predicate
 * @param {any[]} array array
 * @param {(value: any, index: number, array: any[]) => unknown} predicate 
 * @returns 
 */
export const count = (array, predicate) => array.filter(predicate).length;

export const randomChance = (p) => Math.random() < p;

export const randomInRange = (lb = 0, ub = 255) => Math.random() * (ub - lb) + lb;