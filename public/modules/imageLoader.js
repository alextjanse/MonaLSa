import { setPalette, Color } from './color.js';

import data from '../images/mona_lisa.json' assert { type: 'json' };

const { url, palette } = data;

const image = new Image();
image.src = url;

// Source: https://stackoverflow.com/a/5624139/7716258
function hexToColor(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return new Color(
        parseInt(result[1], 16), // r
        parseInt(result[2], 16), // g
        parseInt(result[3], 16), // b
    );
}

const colorPalette = palette.map(hexToColor);

setPalette(colorPalette);

export { image, colorPalette };