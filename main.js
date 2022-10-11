import { Color, getRandomColor, blend } from './modules/color.js';
import { Triangle, getRandomPoint, triangleBoundingBox, isPointInRectangle, Rectangle } from './modules/math.js';
import { randomChance } from './modules/utils.js';
import { Canvas, OriginalCanvas } from './modules/canvas.js';

// Load the image
const image = new Image();
image.src = './images/original.jpeg';

// These variables are for all canvasses, so let's just store them here.

/** @type {number} Width of the canvasses */
let canvasWidth;
let canvasHeight;

/** @type {Rectangle} Bounding box of the canvasses */
let bbox;

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

    bbox = new Rectangle(0, 0, canvasWidth, canvasHeight);

    canvasses.forEach(canvas => canvas.setDimensions(canvasWidth, canvasHeight));
    
    // Draw the image on the canvas
    originalCanvas.drawImage();

    // Start the program
    iteration();
}

/**
 * Generate a random triangle.
 * @return {Triangle}
 */
function generateTriangle() {
    // percentage of padding for spawn points of random points outside the canvas
    const padding = 0.2;

    // Random point spawner, where points can spawn outside the canvas
    const getPointAnywhere = () => getRandomPoint(-padding * canvasWidth, (1 + padding) * canvasWidth, -padding * canvasHeight, (1 + padding) * canvasHeight);

    // Random point spawner, where the point is in the canvas
    const getPointInCanvas = () => getRandomPoint(0, canvasWidth, 0, canvasHeight);

    const randomGetter = () => randomChance(1 / 2) ? getPointInCanvas() : getPointAnywhere();

    /* 
    We want to make random triangles, but we want them to be "nice" (for how far you could call a triangle nice).
    Let's start with getting point p1 from anywhere, inside or outside the canvas.
    */
    const p1 = getPointInCanvas();
    const p2 = randomGetter();
    const p3 = randomGetter();

    return new Triangle(p1, p2, p3);
}

/**
 * Get the score difference of drawing the triangle in the solution.
 * @param {Triangle} triangle 
 * @return {number}
 */
function getScoreDiff(triangle) {
    const dataFrame = triangleBoundingBox(triangle, bbox);
    const { x0, y0, width, height } = dataFrame;

    // Get the image data of the bounding box
    productCanvas.loadData(dataFrame);
    testingCanvas.loadData(dataFrame);

    /* 
    Loop over all the pixels in the bounding box, calculate how the new
    triangle and our current solution would blend, and see if we get closer
    to the actual pixel. For each pixel, we give a score of how far off it is.
    */

    let totalScoreDiff = 0;

    for (let x = x0; x < x0 + width; x++) {
        for (let y = y0; y < y0 + height; y++) {
            // The pixel color in the original painting
            const c = originalCanvas.getPixel(x, y);
            
            // The pixel color in the current solution
            const c1 = productCanvas.getPixel(x, y);

            // The pixel color of the new triangle
            const c2 = testingCanvas.getPixel(x, y);
            
            const c0 = blend(c1, c2);

            if (c0.a === 0) continue;

            const score0 = score(c, c0);
            const score1 = score(c, c1);
            
            const scoreDiff = score0 - score1;

            totalScoreDiff += scoreDiff;
        }
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
    return (c0.r - c.r)**2 + 
           (c0.g - c.g)**2 +
           (c0.b - c.b)**2;
}

/**
 * Display the triangle on the testing canvas.
 * @param {Triangle} triangle
 */
function displayTriangle(triangle, color) {
    // Clear the canvas
    testingCanvas.clear();

    triangle.draw(testingCanvas, color);
}

function iteration() {
    const triangle = generateTriangle();
    const color = getRandomColor(0.1);

    displayTriangle(triangle, color);

    const scoreDiff = getScoreDiff(triangle);

    if (scoreDiff < 0) {
        triangle.draw(productCanvas, color);
    }
    
    requestAnimationFrame(iteration);
}