import { Color, getRandomColor, blend } from './modules/color.js';
import { Point, Triangle, Rectangle } from './modules/math.js';
import { Canvas, OriginalCanvas } from './modules/canvas.js';

// Load the image
const image = new Image();
image.src = './images/original.jpeg';
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
}

/**
 * Generate a random triangle.
 * @param {number} a Alpha channel
 * @return {Triangle}
 */
function generateTriangle(a) {
    const p1 = getRandomPoint();
    const p2 = getRandomPoint();
    const p3 = getRandomPointInCanvas();
    const c = getRandomColor(a);

    return Triangle(p1, p2, p3, c);
}

/**
 * Get random point, anywhere with x in [-width, 2 * width] and y in [-height, 2 * height].
 * @return {Point}
 */
function getRandomPoint() {
    const x = Math.floor(Math.random() * 3 * width) - width;
    const y = Math.floor(Math.random() * 3 * height) - height;

    return Point(x, y);
}

/**
 * Get random point, anywhere with x in [0, width] and y in [0, height].
 * @return {Point}
 */
function getRandomPointInCanvas() {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    return Point(x, y);
}

/**
 * Get the score difference of drawing the triangle in the solution.
 * @param {Triangle} triangle 
 * @return {number}
 */
function getScoreDiff(triangle) {
    const { x0, y0, w, h } = triangleBoundingBox(triangle);

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
            const c1 = Color(...currentData.slice(index, index + 4));

            // The pixel color of the new triangle
            const c2 = Color(...triangleData.slice(index, index + 4));

            const c0 = blend(c1, c2);

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

/**
 * Get the bounding box of the intersection between the canvas and the triangle.
 * @param {Triangle} triangle
 */
function triangleBoundingBox(triangle) {
    const { p1, p2, p3 } = triangle;

    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;
    const { x: x3, y: y3 } = p3;

    /*
    Calculate the bounding box of the intersection between the canvas
    and the triangle. Do this by keeping track of all x and y values
    of the points in the canvas and the intersection points of the triangle
    with the canvas borders. Then, get the maximum and minimum x and y values.
    */
    let xs = [x3];
    let ys = [y3];

    if (isInCanvas(p1)) {
        xs.push(x1);
        ys.push(y1);
    }

    if (isInCanvas(p2)) {
        xs.push(x2);
        ys.push(y2);
    }

    const canvasIntersections = [
        ...getIntersectionPointsWithCanvas(p1, p2),
        ...getIntersectionPointsWithCanvas(p1, p3),
        ...getIntersectionPointsWithCanvas(p2, p3)
    ];

    canvasIntersections.forEach(p => {
        xs.push(p.x);
        ys.push(p.y);
    });

    const xmin = Math.min(...xs);
    const xmax = Math.max(...xs);
    const ymin = Math.min(...ys);
    const ymax = Math.max(...ys);

    return Rectangle(xmin, ymin, xmax - xmin, ymax - ymin);
}

/**
 * Check if the given point is in the canvas.
 * @param {Point} p point
 */
function isInCanvas(p) {
    const { x, y } = p;

    return (0 <= x) && (x <= width) && (0 <= y) && (y <= height);
}

/**
 * Get the intersection points of a line segment with the canvas.
 * @param {Point} p1 line segment point 1
 * @param {Point} p2 line segment point 2
 * @return {Point[]} array with intersection points
 */
function getIntersectionPointsWithCanvas(p1, p2) {
    let output = [];

    const topLeft = { x: 0, y: 0 };
    const topRight = { x: width, y: 0 };
    const bottomLeft = { x: 0, y: height };
    const bottomRight = { x: width, y: height };

    output.push(getIntersectionPoint(p1, p2, topLeft, topRight));
    output.push(getIntersectionPoint(p1, p2, topRight, bottomRight));
    output.push(getIntersectionPoint(p1, p2, bottomRight, bottomLeft));
    output.push(getIntersectionPoint(p1, p2, bottomLeft, topLeft));

    return output.filter(x => x != null);
}

/**
 * Get the intersection point of two line segments (p1, p2) and (q1, q2)
 * @param {Point} p1 
 * @param {Point} p2 
 * @param {Point} q1 
 * @param {Point} q2 
 * @return {Point | null} if there is no intersection, return null.
 */
function getIntersectionPoint(p1, p2, q1, q2) {
    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;
    const { x: x3, y: y3 } = q1;
    const { x: x4, y: y4 } = q2;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    if ((0 <= t) && (t <= 1) && (0 <= u) && (u <= 1)) {
        const x = x1 + t * (x2 - x1);
        const y = y1 + t * (y2 - y1);

        return Point(x, y);
    }

    return null;
}

function displayTriangle(triangle) {
    // Clear the canvas
    testingCanvas.clear();

    drawTriangle(triangle, testingCanvas);
}

function iteration() {
    const triangle = generateTriangle(0.1);
    
    drawTriangle(triangle, productCanvas);

    displayTriangle(triangle);
}