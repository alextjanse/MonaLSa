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

export const randomFactors = (targetProduct, number) => {
    /* 
    a * b * c * ... * n = p
    a_ * b_ * c_ * ... * n_ = p_target

    p * (p_target / p) = p_target

    f = (p_target / p) ^ (1 / n)

    f * a = a_

    f * a * f * b * f * c * ... * f * n =
    a * b * c * ... * n * f^n =
    p * ((p_target / p) ^ (1 / n)) ^ n =
    p * (p_target / p) = p_target
    */

    const factors = new Array(number);

    let product = 1;

    for (let i = 0; i < number; i++) {
        const value = Math.random();
        factors[i] = value;
        product *= value;
    }

    let factor = (targetProduct / product) ** (1 / number);

    return factors.map(x => x * factor);
}

export const pickRandomly = (array) => {
    const i = Math.floor(Math.random() * array.length);

    return array[i];
}