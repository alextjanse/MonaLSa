import { image } from './modules/imageLoader.js';
import Schedule from './modules/schedule/schedule.js';
import ScheduleItem from './modules/schedule/scheduleItem.js';
import ParameterSet from './modules/parameters/parameterSet.js';
import FocusField from './modules/parameters/focusField.js'
import { Shape2D } from './modules/shapes/shape.js';
import { generateShape } from './modules/shapeGenerator.js';
import { Color, generateColor, blend } from './modules/color.js';
import { Canvas, OriginalCanvas } from './modules/canvas.js';
import BoundingBox from './modules/boundingBox.js';
import { randomChance } from './modules/utils.js';
import { Rectangle } from './modules/math.js';

// These variables are for all canvasses, so let's just store them here.
/** @type {number} Width of the canvas */
let canvasWidth;
/** @type {number} Height of the canvas */
let canvasHeight;
/** @type {BoundingBox} Bounding box of the canvas */
let canvasBoundingBox;

/** @type {Schedule} */
let schedule;
/** @type {Generator} */
let scheduleIterator;

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
    initialize();
}

function initialize() {
    // Image is loaded, set width and height wherever it should be stored
    ({ width: canvasWidth, height: canvasHeight } = image);

    // Set
    canvasBoundingBox = new Rectangle(0, 0, canvasWidth, canvasHeight);

    canvasses.forEach(canvas => canvas.setDimensions(canvasWidth, canvasHeight));

    // Draw the image on the canvas
    originalCanvas.drawImage();

    const canvasFocusField = new FocusField(0, 0, canvasWidth, canvasHeight);

    // Set schedule
    const parameters0 = new ParameterSet(
        canvasFocusField,
        {
            areaLb: 1000,
            areaUb: 10000,
        },
        {
            alpha: 0.1,
        },
    );
    const scheduleItem0 = new ScheduleItem(parameters0, 1000);

    const parameters1 = new ParameterSet(
        canvasFocusField,
        {
            areaLb: 100,
            areaUb: 1000,
        },
        {
            alpha: 0.3,
        },
    );
    const scheduleItem1 = new ScheduleItem(parameters1, 1000);

    const parameters2 = new ParameterSet(
        canvasFocusField,
        {
            areaLb: 10,
            areaUb: 100,
        },
        {
            alpha: 0.5,
        },
    );
    const scheduleItem2 = new ScheduleItem(parameters2, 1000);

    schedule = new Schedule([scheduleItem0, scheduleItem1, scheduleItem2], true);
    scheduleIterator = schedule.iteration();
    
    loop();
}

function loop() {
    const { done, value: parameters } = scheduleIterator.next();
    
    if (done) return;

    simulatedAnnealing(parameters);
    
    requestAnimationFrame(loop);
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

let temperature = 100;
let alpha = 0.95;
let i = 0;
let k = 100;

function simulatedAnnealing(parameters) {
    const shape = generateShape(parameters);
    const color = generateColor(parameters);

    // Display shape
    testingCanvas.clear();
    shape.draw(testingCanvas, color);

    const scoreDiff = getScoreDiff(shape);

    if (scoreDiff < 0 || randomChance(Math.E**(-scoreDiff / temperature))) {
        shape.draw(productCanvas, color);
    } else {
        // Neighbor not accepted.
    }

    if (i++ < k) return;
    
    i = 0;
    temperature *= alpha;
}