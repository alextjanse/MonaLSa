import { Color, getRandomColor, blend } from './modules/color.js';
import { Triangle, getRandomPoint, triangleBoundingBox, isPointInRectangle, Rectangle } from './modules/math.js';
import { count, randomChance } from './modules/utils.js';
import { Canvas, OriginalCanvas } from './modules/canvas.js';

// Load the image
const image = new Image();
image.src = './images/original.jpeg';

// These variables are for all canvasses, so let's just store them here.

/** @type {number} Width of the canvasses */
let width;
let height;

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
    ({ width, height } = image);

    bbox = new Rectangle(0, 0, width, height);

    canvasses.forEach(canvas => canvas.setDimensions(width, height));
    
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
    const getPointAnywhere = () => getRandomPoint(-padding * width, (1 + padding) * width, -padding * height, (1 + padding) * height);

    // Random point spawner, where the point is in the canvas
    const getPointInCanvas = () => getRandomPoint(0, width, 0, height);

    /* 
    We want to make random triangles, but we want them to be "nice" (for how far you could call a triangle nice).
    Let's start with getting point p1 from anywhere, inside or outside the canvas.
    */
    let p1, p2, p3;

    p1 = getPointAnywhere();

    /* 
    Now we want p2 to be either inside or outside the canvas. Let's just say for now that we allow p2 to be outside
    the canvas if p1 is inside the canvas, or else with a 50% chance to spice things up.
    */

    if (isPointInRectangle(p1, bbox) || randomChance(0.5)) {
        p2 = getPointAnywhere();
    } else {
        p2 = getPointInCanvas();
    }
    
    /* 
    p2 is again either on the inside or outside of the canvas. What do we want to do with this information?
    We have that p1 is either inside or outside the canvas, and p2 as well. Let's say that they are both inside
    the canvas, then we allow p3 to get outside. If only either p1 or p2 is outside the canvas, we allow p3 to
    be outside the canvas with a 2/3 chance (again, nice spice.), and only 1/3 when both p1 and p2 are outside
    the canvas.
    */

    const numberOfPointsInCanvas = count([p1, p2], p => isPointInRectangle(p, bbox));

    if (numberOfPointsInCanvas === 2) {
        p3 = getPointAnywhere();
    } else if (numberOfPointsInCanvas === 1 && randomChance(2 / 3)) {
        p3 = getPointAnywhere();
    } else if (numberOfPointsInCanvas === 0 && randomChance(1 / 3)) {
        p3 = getPointAnywhere();
    } else {
        p3 = getPointInCanvas();
    }

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
 
    debugger;

    displayTriangle(triangle, color);

    const scoreDiff = getScoreDiff(triangle);

    if (scoreDiff < 0) {
        triangle.draw(productCanvas, color);
    }

    requestAnimationFrame(iteration);
}