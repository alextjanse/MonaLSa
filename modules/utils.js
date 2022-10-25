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

/**
 * Split an amount in a number of pieces randomly.
 * @param {number} amount 
 * @param {number} number 
 * @return {number[]}
 */
export const splitRandomly = (amount, number) => {
    let splits = new Array(number);

    /* 
    I'm not sure if this is properly randomly split, but I didn't bother
    to do the maths on it. Let's just see the results.

    Let all splits make a random "grab" between 0 and 1. That's where the
    randomness comes from. Add these grabs up to a total, and then normalize
    each grab by multiplying with 1 / total. Then the sum of splits will be
    equal to 1, so we can then devide the amount we needed to split over the
    given number.
    */

    let total = 0;

    for (let i = 0; i < number; i++) {
        const grab = Math.random();
        splits[i] = grab;
        total += grab;
    }

    const normalizer = 1 / total;

    for (let i = 0; i < number; i++) {
        splits[i] *= normalizer * amount;
    }

    return splits;
}

export const randomMultiplicants = (number) => {
    const multiplicant = new Array(number);

    let product = 1;

    for (let i = 0; i < number; i++) {
        const value = Math.random();
        multiplicant[i] = value;
        product *= value;
    }

    /*
    Factor is 1 / n-root of the product. If we multiply all multiplicants
    with this, we get:
    a_1 * (1 / p^(1/n)) * ... * a_n * (1 / p^(1/n)) ... =
    a_1 * ... * a_n * (1 / p^(1/n))^n =
    a_1 * ... * a_n * (1 / p) = 1
    */
    let factor = product**(-1 / number);

    return multiplicant.map(x => x * factor);
}