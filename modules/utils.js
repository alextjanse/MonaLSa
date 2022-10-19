import { createPointCloudBoundingBox, Point, Rectangle } from './math.js';

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

export const randomSign = () => randomChance(0.5) ? 1 : -1;

/**
 * Execute a random callback function from an array
 * @param {(() => any)[]} callbacks Array of callback functions
 * @return {any} Return whatever the getter got
 */
export const randomGetter = (callbacks) => {
    const n = callbacks.length;

    const i = Math.floor(Math.random() * n);
    
    // Execute callback function at index i in the array
    return callbacks[i]();
}