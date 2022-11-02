# MonaLSa: A Local Search painter
I wanted to make a local search solver that would try to paint the Mona Lisa. The main idea is:

1.  Generate a random shape in a color (for now, picked from a color palette)
2.  Draw the shape on the testing canvas
3.  Calculate the effect of drawing the shape on the canvas
4.  Decide if this is an improvement or not
5.  Paint the shape accordingly
6.  Repeat

## Releases
### v1.0
The first working version! All color blending maths is in place, score function seems to work, and
basic color picker is added. The shapes are being generated quite nicely, and we got some nice
controls over how big we want our shapes. However, we are missing a big controller of the parameters.
Also, the local search is just a greedy algorithm, but it seems to work fine for now. I want to add
simmulated annealing at some point, I think it would go nicely with the paramater controller and
we could add some nice cycles. I'm also thinking about adding a concept I like to call focus fields,
where we focus our attention to only a small portion of the canvas and try to get some more detailing
done. We'll see about that in the future.

## Installation
Just run `npm install` and `npm start`. You need Node of course to do so.