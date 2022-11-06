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

    // Set schedule
    const scheduleItems = [];

    const canvasFocusField = new FocusField(0, 0, canvasWidth, canvasHeight);

    for (let splits = 1; (canvasWidth * canvasHeight) / (splits * splits) > 1000; splits *= 2)
    {
        const width = canvasWidth / splits;
        const height = canvasHeight / splits;
        const area = width * height;

        for (let x = 0; x < splits; x++) {
            for (let y = 0; y < splits; y++) {
                const focusField = new FocusField(x * width, y * height, width, height);
                const parameters = new ParameterSet(
                    focusField,
                    {
                        areaLb: area * 0.1,
                        areaUb: area * 0.25,
                    },
                    {
                        alpha: 0.1,
                    },
                    {
                        penalty: splits,
                    },
                );

                scheduleItems.push(new ScheduleItem(parameters, 100));
            }
        }
    }

    const parametersDetails = new ParameterSet(
        canvasFocusField,
        {
            areaLb: 10,
            areaUb: 100,
        },
        {
            alpha: 0.1,
        },
        {
            penalty: 3,
        },
    );
    scheduleItems.push(new ScheduleItem(parametersDetails, 100));

    schedule = new Schedule(scheduleItems, true);
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
 * @param {Shape2D} shape The new shape
 * @param {ParameterSet} parameters The parameters, for the penalty parameters
 * @return {number}
 */
function getScoreDiff(shape, parameters) {
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
        // The pixel color of the new shape
        const cShape = testingCanvas.getPixel(x, y);

        // This pixel isn't being drawn on by the shape, go to the next pixel
        if (cShape.a === 0) continue;

        // The pixel color in the original painting
        const cOriginal = originalCanvas.getPixel(x, y);

        // The pixel color in the current solution
        const cCanvas = productCanvas.getPixel(x, y);

        const cNew = blend(cCanvas, cShape);

        totalScoreDiff += getPixelScoreDiff(cOriginal, cCanvas, cNew, parameters);
    }

    return totalScoreDiff;
}

/**
 * Get the score of a pixel color by calculating the square sum of the
 * difference between the original and the solution color channels.
 * @param {Color} cOriginal The pixel color of the original
 * @param {Color} cCanvas The pixel color of the current solution
 * @param {Color} cNew The pixel color the new shape
 * @param {ParameterSet} parameters The parameters for penalty parameters
 * @return {number}
 */
function getPixelScoreDiff(cOriginal, cCanvas, cNew, parameters) {
    const { r: rOriginal, g: gOriginal, b: bOriginal } = cOriginal;
    const { r: rCanvas, g: gCanvas, b: bCanvas } = cCanvas;
    const { r: rNew, g: gNew, b: bNew } = cNew;
    const { penaltyParameters: { penalty } } = parameters;

    // Calculate how much closer to the target we got. Negative = better.
    const factor = (cO, cC, cN) => Math.abs(cO - cN) - Math.abs(cO - cC);

    const rFactor = factor(rOriginal, rCanvas, rNew);
    const gFactor = factor(gOriginal, gCanvas, gNew);
    const bFactor = factor(bOriginal, bCanvas, bNew);

    let scoreDiff = 0;

    scoreDiff += rFactor * (rFactor < 0 ? 1 : penalty);
    scoreDiff += gFactor * (gFactor < 0 ? 1 : penalty);
    scoreDiff += bFactor * (bFactor < 0 ? 1 : penalty);

    return scoreDiff;
}

let temperature = 100;
let alpha = 0.95;
let i = 0;
let k = 100;

/** 
 * Do an iteration of the Simulated Annealing.
 * @param {ParameterSet} parameters The parameters for the generators and such
 */
function simulatedAnnealing(parameters) {
    const shape = generateShape(parameters);
    const color = generateColor(parameters);

    // Display shape
    testingCanvas.clear();
    shape.draw(testingCanvas, color);

    const scoreDiff = getScoreDiff(shape, parameters);

    if (scoreDiff < 0) {
        shape.draw(productCanvas, color);
    } else if (randomChance(Math.E**(-scoreDiff / temperature))) {
        shape.draw(productCanvas, color);
    } else {
        // Neighbor not accepted.
    }

    if (i++ < k) return;
    
    i = 0;
    temperature *= alpha;
}