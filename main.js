import { Shape2D } from './modules/shapes/shape.js';
import { Color, getRandomColor, blend } from './modules/color.js';
import {
    Triangle,
    Rectangle,
    Circle,
    getRandomPoint,
} from './modules/math.js';
import { randomInRange, randomGetter } from './modules/utils.js';
import { Canvas, OriginalCanvas } from './modules/canvas.js';

// Load the image
const image = new Image();
image.src = './images/original.jpeg';

// These variables are for all canvasses, so let's just store them here.

/** @type {number} Width of the canvasses */
let canvasWidth;
let canvasHeight;

/** @type {Rectangle} Bounding box of the canvasses */
let canvasBoundingBox;

// Create the three canvasses

/** The left canvas, with the original painting */
const originalCanvas = new OriginalCanvas('original', image);

/** The middle canvas, with our current solution */
const productCanvas = new Canvas('current');

/** The right canvas, for testing purposes and displaying triangles */
const testingCanvas = new Canvas('triangle');

// Very unnecessary array of our three canvasses, but fun to do an Array.forEach
const canvasses = [originalCanvas, productCanvas, testingCanvas];

image.onload = () => {
    // Image is loaded, set width and height wherever it should be stored
    ({ width: canvasWidth, height: canvasHeight } = image);

    canvasBoundingBox = new Rectangle(0, 0, canvasWidth, canvasHeight);

    canvasses.forEach(canvas => canvas.setDimensions(canvasWidth, canvasHeight));

    // Draw the image on the canvas
    originalCanvas.drawImage();

    // Start the program
    iteration();
}

function getRandomShape() {
    return randomGetter([generateCircle, generateTriangle]);
}

/**
 * Generate a random triangle.
 * @return {Triangle}
 */
function generateTriangle() {
    // percentage of padding for spawn points of random points outside the canvas
    const padding = 0.2;

    // Random point spawner, where points can spawn outside the canvas
    const getPointAnywhere = () => getRandomPoint(
        -padding * canvasWidth, // xlb
        (1 + padding) * canvasWidth, // xub
        -padding * canvasHeight, // ylb
        (1 + padding) * canvasHeight, // yub
    );

    // Random point spawner, where the point is in the canvas
    const getPointInCanvas = () => getRandomPoint(0, canvasWidth, 0, canvasHeight);

    /* 
    We want to make random triangles, but we want them to be "nice" (for how far you could call
    a triangle nice). Let's start with getting point p1 from anywhere, inside or outside the canvas.
    */
    const p1 = getPointInCanvas();

    // The two random getters for randomGetter
    const callbacks = [getPointAnywhere, getPointInCanvas];

    const p2 = randomGetter(callbacks);
    const p3 = randomGetter(callbacks);

    return new Triangle(p1, p2, p3);
}

function generateCircle() {
    const radius = randomInRange(5, 100);
    const origin = getRandomPoint(0, canvasWidth, 0, canvasHeight);

    return new Circle(origin, radius);
}

/**
 * Get the score difference of drawing the triangle in the solution.
 * @param {Shape2D} shape 
 * @return {number}
 */
function getScoreDiff(shape) {
    const dataFrame = shape.canvasIntersection(canvasBoundingBox);

    // Get the image data of the bounding box
    productCanvas.loadData(dataFrame);
    testingCanvas.loadData(dataFrame);

    /* 
    Loop over all the pixels in the bounding box, calculate how the new
    shape and our current solution would blend, and see if we get closer
    to the actual painting.
    */

    let totalScoreDiff = 0;

    for (const { x, y } of dataFrame.loop()) {
        // The pixel color in the original painting
        const c = originalCanvas.getPixel(x, y);

        // The pixel color in the current solution
        const c1 = productCanvas.getPixel(x, y);

        // The pixel color of the new shape
        const c2 = testingCanvas.getPixel(x, y);

        const c0 = blend(c1, c2);

        if (c0.a === 0) continue;

        const score0 = score(c, c0);
        const score1 = score(c, c1);

        const scoreDiff = score0 - score1;

        totalScoreDiff += scoreDiff;
    }

    return totalScoreDiff;
}

/**
 * Get the score of a pixel color by calculating the square sum of the
 * difference between the original and the solution color channels.
 * @param {Color} c0 The pixel color of the original painting
 * @param {Color} c The pixel color of the solution
 * @return {number}
 */
function score(c0, c) {
    return (c0.r - c.r) ** 2 +
        (c0.g - c.g) ** 2 +
        (c0.b - c.b) ** 2;
}

/**
 * Display the triangle on the testing canvas.
 * @param {Shape} shape
 */
function displayShape(shape, color) {
    // Clear the canvas
    testingCanvas.clear();

    shape.draw(testingCanvas, color);
}

function iteration() {
    const color = getRandomColor(0.1);

    const shape = getRandomShape();

    displayShape(shape, color);

    const scoreDiff = getScoreDiff(shape);

    if (scoreDiff < 0) {
        shape.draw(productCanvas, color);
    }

    requestAnimationFrame(iteration);
}