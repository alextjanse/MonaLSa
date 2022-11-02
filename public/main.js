import { image } from './modules/imageLoader.js';

import { Shape2D } from './modules/shapes/shape.js';
import { Color, getRandomColor, blend } from './modules/color.js';
import {
    Triangle,
    Rectangle,
    Circle,
    getRandomPoint,
    Point,
} from './modules/math.js';
import { pickRandomly, randomInRange, randomFactors, randomSign } from './modules/utils.js';
import { Canvas, OriginalCanvas } from './modules/canvas.js';
import BoundingBox from './modules/boundingBox.js';

// These variables are for all canvasses, so let's just store them here.
/** @type {number} Width of the canvasses */
let canvasWidth;
let canvasHeight;

/** @type {BoundingBox} Bounding box of the canvasses */
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

    // Set
    canvasBoundingBox = new Rectangle(0, 0, canvasWidth, canvasHeight);

    canvasses.forEach(canvas => canvas.setDimensions(canvasWidth, canvasHeight));

    // Draw the image on the canvas
    originalCanvas.drawImage();

    // Start the program
    iteration();
}

function getRandomShape() {
    return pickRandomly([
        generateCircle,
        generateTriangle,
        generateRectangle,
    ])();
}

/**
 * Generate a random triangle.
 * @return {Triangle}
 */
function generateTriangle() {
    /* 
    A triangle is defined by three points: p1, p2, and p3. We want nice triangles,
    that aren't too large. So let's first decide on the area. The area of a triangle
    is: A = 1/2 * a * b * sin(gamma), where a = (p1, p2), (p1, p3) and gamma = angle(p1).
    */

    // Start by deciding on an area of the triangle. We don't want too large ones.
    const area = randomInRange(10, 100);

    // Set p1 as a random point on the canvas.
    const p1 = getRandomPoint(0, canvasWidth, 0, canvasHeight);

    const { x: x1, y: y1 } = p1;

    // Calculate a random angle for gamma.
    const gamma = Math.PI * Math.random();

    /* 
    area = 1/2 a b sin(gamma)
    rest = a b = 2 * area / sin(gamma)
    */
    let rest = 2 * area / Math.sin(gamma);

    const [a, b] = randomFactors(rest, 2);

    // Random angle to cast towards p2 for
    const angle1 = 2 * Math.PI * Math.random();

    const x2 = x1 + Math.cos(angle1) * a;
    const y2 = y1 + Math.sin(angle1) * a;

    const p2 = new Point(x2, y2);

    // Angle to cast to p3 from p1
    const angle2 = angle1 + randomSign() * gamma;

    const x3 = x1 + Math.cos(angle2) * b;
    const y3 = y1 + Math.cos(angle2) * b;

    const p3 = new Point(x3, y3);

    const triangle = new Triangle(p1, p2, p3);

    return triangle;
}

function generateCircle() {
    const area = randomInRange(10, 100);
    
    const origin = getRandomPoint(0, canvasWidth, 0, canvasHeight);
    const radius = Math.sqrt(area / Math.PI);

    return new Circle(origin, radius);
}

function generateRectangle() {
    const area = randomInRange(10, 100);
    const [width, height] = randomFactors(area, 2);

    const { x: x0, y: y0 } = getRandomPoint(0, canvasWidth - width, 0, canvasHeight - height);
    return new Rectangle(x0, y0, width, height);
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
        const cOriginal = originalCanvas.getPixel(x, y);

        // The pixel color in the current solution
        const cCanvas = productCanvas.getPixel(x, y);

        // The pixel color of the new shape
        const cShape = testingCanvas.getPixel(x, y);

        if (cShape.a === 0) continue;

        const cNew = blend(cCanvas, cShape);

        totalScoreDiff += getPixelScoreDiff(cOriginal, cCanvas, cNew);
    }

    return totalScoreDiff;
}

/**
 * Get the score of a pixel color by calculating the square sum of the
 * difference between the original and the solution color channels.
 * @param {Color} cNew The pixel color of the original painting
 * @param {Color} cOriginal The pixel color of the solution
 * @return {number}
 */
function getPixelScoreDiff(cOriginal, cCanvas, cNew) {
    const { r: rOriginal, g: gOriginal, b: bOriginal } = cOriginal;
    const { r: rCanvas, g: gCanvas, b: bCanvas } = cCanvas;
    const { r: rNew, g: gNew, b: bNew } = cNew;

    // Calculate how much closer to the target we got. Negative = better.
    const factor = (cO, cC, cN) => Math.abs(cO - cN) - Math.abs(cO - cC);

    const rFactor = factor(rOriginal, rCanvas, rNew);
    const gFactor = factor(gOriginal, gCanvas, gNew);
    const bFactor = factor(bOriginal, bCanvas, bNew);

    let scoreDiff = 0;

    // Spice. Just a random multiplier for if a color channel is worsening.
    const penalty = 3;

    scoreDiff += rFactor * (rFactor < 0 ? 1 : penalty);
    scoreDiff += gFactor * (gFactor < 0 ? 1 : penalty);
    scoreDiff += bFactor * (bFactor < 0 ? 1 : penalty);

    return scoreDiff;
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