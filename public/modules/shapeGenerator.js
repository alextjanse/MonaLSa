import { Shape2D } from './shapes/shape.js';
import { Rectangle, Triangle, Circle, Point } from './math.js';
import { pickRandomly, randomFactors, randomSign } from './utils.js';

function generateShape(parameters) {
    return pickRandomly([
        generateCircle,
        generateTriangle,
        generateRectangle,
    ])(parameters);
}

/**
 * Generate a random triangle.
 * @return {Triangle}
 */
function generateTriangle(parameters) {
    /* 
    A triangle is defined by three points: p1, p2, and p3. We want nice triangles,
    that aren't too large. So let's first decide on the area. The area of a triangle
    is: A = 1/2 * a * b * sin(gamma), where a = (p1, p2), (p1, p3) and gamma = angle(p1).
    */

    // Start by deciding on an area of the triangle. We don't want too large ones.
    const area = parameters.area();

    // Set p1 as a random point on the canvas.
    const p1 = parameters.getRandomPoint();

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

function generateCircle(parameters) {
    const area = parameters.area();
    
    const origin = parameters.getRandomPoint();
    const radius = Math.sqrt(area / Math.PI);

    return new Circle(origin, radius);
}

function generateRectangle(parameters) {
    const area = parameters.area();
    const [width, height] = randomFactors(area, 2);

    const { x: x0, y: y0 } = parameters.getRandomPoint();
    return new Rectangle(x0, y0, width, height);
}

export { generateShape };