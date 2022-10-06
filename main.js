import { Color, getRandomColor, blend } from './modules/color.js';
import { Triangle, getRandomPoint, triangleBoundingBox } from './modules/math.js';
import { Canvas, OriginalCanvas } from './modules/canvas.js';

// Load the image
const image = new Image();
image.src = './images/debugging.png';
let width, height;

// Create the three canvasses
/** The left canvas, with the original painting */
const originalCanvas = new OriginalCanvas('original', image);
/** The middle canvas, with our current solution */
const productCanvas = new Canvas('current');
/** The right canvas, for testing purposes and displaying triangles */
const testingCanvas = new Canvas('triangle');

// Very unnecessary array of the three canvasses
const canvasses = [originalCanvas, productCanvas, testingCanvas];

image.onload = () => {    
    ({ width, height } = image);

    canvasses.forEach(canvas => canvas.setDimensions(width, height));
    
    originalCanvas.draw();

    iteration();
}

/**
 * Generate a random triangle.
 * @param {number} a Alpha channel
 * @return {Triangle}
 */
function generateTriangle(a) {
    const getPointAnywhere = () => getRandomPoint(-width, 2 * width, -height, 2 * height);
    const getPointInCanvas = () => getRandomPoint(0, width, 0, height);

    const p1 = getPointAnywhere();
    const p2 = getPointAnywhere();
    const p3 = getPointInCanvas();
    const c = getRandomColor(a);

    return new Triangle(p1, p2, p3, c);
}

/**
 * Get the score difference of drawing the triangle in the solution.
 * @param {Triangle} triangle 
 * @return {number}
 */
function getScoreDiff(triangle) {
    const { x0, y0, w, h } = triangleBoundingBox(triangle, testingCanvas.boundingBox);

    // Get the image data of the bounding box
    const currentData = productCanvas.getData(x0, y0, w, h);
    const triangleData = testingCanvas.getData(x0, y0, w, h);

    /* 
    Loop over all the pixels in the bounding box, calculate how the new
    triangle and our current solution would blend, and see if we get closer
    to the actual pixel. For each pixel, we give a score of how far off it is.
    */

    let totalScoreDiff = 0;

    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            const index = 4 * (x * w + y);
            
            // The pixel color in the original painting
            const c = originalCanvas.getPixel(x0 + x, y0 + y);
            
            // The pixel color in the current solution
            const c1 = new Color(...currentData.slice(index, index + 4));
            
            // The pixel color of the new triangle
            const c2 = new Color(...triangleData.slice(index, index + 4));

            // if (c2.r + c2.g + c2.b + c2.a > 0) {
            //     debugger;
            // }
            
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
           (c0.b - c.b)**2 +
           (c0.a - c.a)**2;
}

function displayTriangle(triangle) {
    // Clear the canvas
    testingCanvas.clear();

    testingCanvas.drawTriangle(triangle);
}

function iteration() {
    const triangle = generateTriangle(0.1);
 
    displayTriangle(triangle);

    const scoreDiff = getScoreDiff(triangle);

    if (scoreDiff < 0) {
        productCanvas.drawTriangle(triangle);
    }

    requestAnimationFrame(iteration);
}