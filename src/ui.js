/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

/**
 * @ignore
 * @private
 * Widget Cache
 */
T.globalWidgetCache = {
    //returns an identifier of all standard widgets registered in the document
    getWidgetInstanceID: function () {}
};
/**
 * @class
 *
 * TigerJS UI Framework, This Object and sub-objects, implement various UI widgets,
 * Layouts, effects, and many other Operations that would be normally expected
 * from an HTML5 based library.
 * This interface acts as the top level namespace for all advancded UI based
 * operations.
 *
 */




TigerJS.UI = {};
// first we sort out some needed preambles
//Color et all

/**
 *
 * @class {@link TigerJS.UI.Color} Object provides, utility methods for
 *  manipulating colors in the RGB and HSL color spaces
 * @static
 *
 */
TigerJS.UI.Color = {
    /**
     * Blend two colors together, using the specified factor to indicate the weight
     * given to the first color
     * @param {Rgb} rgb1 First color represented in rgb.
     * @param {Rgb} rgb2 Second color represented in rgb.
     * @param {number} factor The weight to be given to rgb1 over rgb2. Values
     *     should be in the range [0, 1]. If less than 0, factor will be set to 0.
     *     If greater than 1, factor will be set to 1.
     * @return {Array} Combined color represented in rgb.
     */
    blend: function (rgb1, rgb2, factor) {
        if (factor < 0)
            factor = 0;
        if (factor > 1)
            factor = 1;

        return [
            Math.round(factor * rgb1[0] + (1.0 - factor) * rgb2[0]),
            Math.round(factor * rgb1[1] + (1.0 - factor) * rgb2[1]),
            Math.round(factor * rgb1[2] + (1.0 - factor) * rgb2[2])];
    },
    /**
     * @description
     * This method calulates the lighter value of the input
     * color, the amount of lighness is controlled by the
     * ratio parameter.
     * @param {Color} color see {@link TigerJS.UI.Color#parse}
     * @param {Integer} [ratio  = 0.1] A decimal value betwee 0.1 and 1.0
     * @return {Array} The color value in (r,g,b) space
     * @function
     *  @memberOf    TigerJS.UI.Color#
     */
    lighten: function (color, ratio) {
        var white = [255, 255, 255];
        return this.blend(white, color, ratio);

    },
    /**
     * @description
     * This method calulates the darker value of the input
     * color, the amount of darkness is controlled by the
     * ratio parameter.
     * @param {Color} color see {@link TigerJS.UI.Color#parse}
     * @param {Integer} [ratio  = 0.1]  ratio A decimal value betwee 0.1 and 1.0
     * @return {Array} The color value in (r,g,b) space
     * @function
     *  @memberOf    TigerJS.UI.Color#
     */

    darken: function (color, ratio) {
        var black = [0, 0, 0];
        return this.blend(black, color, ratio);

    },
    /**
     * @description
     * Convert the inputs color to HEX format
     * @param {Color} input see {@link TigerJS.UI.Color#parse}
     * @return {String} A string containing the color
     * values in CSS-Hexadecimal format
     *  @function
     *  @memberOf    TigerJS.UI.Color#
     */
    colorToHex: function (input) {

        var color = T.isArray(input) ? input : this.parse(input);
        //convert all to hex, pad single hex digits with zero

        return "#" +
                (parseInt(color[0]).toString(16).length === 1 ? "0" + parseInt(color[0]).toString(16) : parseInt(color[0]).toString(16)) +
                (parseInt(color[1]).toString(16).length === 1 ? "0" + parseInt(color[1]).toString(16) : parseInt(color[1]).toString(16)) +
                (parseInt(color[2]).toString(16).length === 1 ? "0" + parseInt(color[2]).toString(16) : parseInt(color[2]).toString(16)) +
                "";
    },
    /**
     * @description
     * Convert the inputs color to HSL(a) format
     * @param {Color} input see {@link TigerJS.UI.Color#parse}
     * @return {Object} An Object containing the color
     * values in HSL(a) space.
     * @function
     *  @memberOf    TigerJS.UI.Color#
     */
    colorToHsl: function (input) {



        var color = T.isArray(input) ? input : this.parse(input),
                // First must normalize r, g, b to be between 0 and 1.
                normR = color[0] / 255,
                normG = color[1] / 255,
                normB = color[2] / 255,
                max = Math.max(normR, normG, normB),
                min = Math.min(normR, normG, normB),
                h = 0,
                s = 0;

        // Luminosity is the average of the max and min rgb color intensities.
        var l = 0.5 * (max + min);

        // The hue and saturation are dependent on which color intensity is the max.
        // If max and min are equal, the color is gray and h and s should be 0.
        if (max != min) {
            if (max == normR) {
                h = 60 * (normG - normB) / (max - min);
            } else if (max == normG) {
                h = 60 * (normB - normR) / (max - min) + 120;
            } else if (max == normB) {
                h = 60 * (normR - normG) / (max - min) + 240;
            }

            if (0 < l && l <= 0.5) {
                s = (max - min) / (2 * l);
            } else {
                s = (max - min) / (2 - 2 * l);
            }
        }
        // Make sure the hue falls between 0 and 360.
        return {
            h: Math.round(h + 360) % 360,
            s: s,
            l: l,
            a: (color[3] || 1)
        };
    },
    /**
     * @description
     * Method to retrieve the color of an element
     * @param {String | HTMLElement} el A reference to the element
     * or its id.
     *  @return  A numeric quatuplet Array representing the
     *  (r,g,b,a) color value of the element.
     *  @function
     *  @memberOf    TigerJS.UI.Color#
     *   @type Array
     
     */
    getColor: function (el) {
        el = T.$(el);
        return this.parse(el.getStyle().color);
    },
    /**
     * @description
     * Method to Set the color (background) of an element
     * @param {String | HTMLElement} el A reference to the element
     * or its id.
     * @param {String | Array} color The color value to set, for allowed
     * formats see, {@link TigerJS.UI.Color#parse}
     
     *  @return  A numeric quatuplet Array representing the
     *  (r,g,b,a) color value of the Color set on the element.
     *  @function
     *  @memberOf    TigerJS.UI.Color#
     *   @type Array
     
     */
    setColor: function (el, color) {
        el = T.$(el);
        var color = T.isArray(color) ? color : this.parse(color),
                rgbaString = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + (color[3] || color[3] === 0 ? color[3] : 1) + ")";
        el.setStyle({
            'background-color': rgbaString
        });
    },
    /**
     *@description
     * Mehod to interpolate two colors, producing a color at their
     * mid-point.<br/>
     * For accepted colour formats used by this method see
     * {@link TigerJS.UI.Color#parse}
     * @param {Color} startColor The start-colur to be used
     *  for the interpolation
     * @param {Color} endColor The end-colur to be used
     *  for the interpolation
     *
     *  @return  A numeric quatuplet Array representing the
     *  (r,g,b,a) interpolated color value.
     *  @function
     *  @name    TigerJS.UI.Color#interpolate
     *   @type Array
     *
     
     */
    interpolate: function (startColor, endColor) {
        startColor = this.parse(startColor);
        endColor = this.parse(endColor);
        var r = startColor[0] + (endColor[0] - startColor[0]) * .5,
                g = startColor[0] + (endColor[1] - startColor[1]) * .5,
                b = startColor[0] + (endColor[2] - startColor[2]) * .5;
        return [r, g, b, 1];
    },
    /**
     * @description
     *  Method to parse out colors from RGB(a) and HSL(a) color spaces
     *  This functions returns an Array containing the rgba values
     *  of the input color
     *  @param {String} color The color to be parsed, could be in any of the
     *  following formats
     *   <br/>
     *  <pre>
     *
     *     T.UI.Color.parse('#fff') //returns [ 255, 255, 255, 1 ]
     *     T.UI.Color.parse('#ff0011') //returns [ 255, 0, 17, 1 ]
     *     T.UI.Color.parse('slateblue') //returns [ 106, 90, 205, 1 ]
     *     T.UI.Color.parse(' rgba (255, 128, 12, 0.5)') //returns  [ 255, 128, 12, 0.5 ]
     *     T.UI.Color.parse('hsla(900, 15%, 90%, 0.5)') //returns  [ 226, 233, 233, 0.5 ]
     *     T.UI.Color.parse('hsl(900, 15%, 90%)') //returns  [ 226, 233, 233, 1]
     *     T.UI.Color.parse('hsb(358, 79, 93)') //returns  [ 226, 233, 233, 1]
     *     T.UI.Color.parse( {r:255, g:128, b:12, a:0.5} ) //Object literal
     *     T.UI.Color.parse({h:900, s:15, l:90}) //Object literal, NO PERCENTAGE SIGN FOR HSL OBJECT LITERAL
     *
     *  </pre>
     *
     *  @return  A numeric quatuplet Array representing the RGB(a) value of the Color.
     *  @memberOf    TigerJS.UI.Color#
     *  @function
     *  @type Array
     */

    parse: function (color) {

        //see if we have an object
        if (color.r && color.r >= 0) {
            return [color.r, color.g, color.b, (color.a === undefined ? 1 : color.a)];
        }

        if (color.h && color.h >= 0) {

            color = 'hsla(' + color.h + ',' + color.s + ',' + color.l + ',' + (color.a === undefined ? 1 : color.a) + ')';
        }

        var CSSColorTable = {
            "transparent": [0, 0, 0, 0],
            "aliceblue": [240, 248, 255, 1],
            "antiquewhite": [250, 235, 215, 1],
            "aqua": [0, 255, 255, 1],
            "aquamarine": [127, 255, 212, 1],
            "azure": [240, 255, 255, 1],
            "beige": [245, 245, 220, 1],
            "bisque": [255, 228, 196, 1],
            "black": [0, 0, 0, 1],
            "blanchedalmond": [255, 235, 205, 1],
            "blue": [0, 0, 255, 1],
            "blueviolet": [138, 43, 226, 1],
            "brown": [165, 42, 42, 1],
            "burlywood": [222, 184, 135, 1],
            "cadetblue": [95, 158, 160, 1],
            "chartreuse": [127, 255, 0, 1],
            "chocolate": [210, 105, 30, 1],
            "coral": [255, 127, 80, 1],
            "cornflowerblue": [100, 149, 237, 1],
            "cornsilk": [255, 248, 220, 1],
            "crimson": [220, 20, 60, 1],
            "cyan": [0, 255, 255, 1],
            "darkblue": [0, 0, 139, 1],
            "darkcyan": [0, 139, 139, 1],
            "darkgoldenrod": [184, 134, 11, 1],
            "darkgray": [169, 169, 169, 1],
            "darkgreen": [0, 100, 0, 1],
            "darkgrey": [169, 169, 169, 1],
            "darkkhaki": [189, 183, 107, 1],
            "darkmagenta": [139, 0, 139, 1],
            "darkolivegreen": [85, 107, 47, 1],
            "darkorange": [255, 140, 0, 1],
            "darkorchid": [153, 50, 204, 1],
            "darkred": [139, 0, 0, 1],
            "darksalmon": [233, 150, 122, 1],
            "darkseagreen": [143, 188, 143, 1],
            "darkslateblue": [72, 61, 139, 1],
            "darkslategray": [47, 79, 79, 1],
            "darkslategrey": [47, 79, 79, 1],
            "darkturquoise": [0, 206, 209, 1],
            "darkviolet": [148, 0, 211, 1],
            "deeppink": [255, 20, 147, 1],
            "deepskyblue": [0, 191, 255, 1],
            "dimgray": [105, 105, 105, 1],
            "dimgrey": [105, 105, 105, 1],
            "dodgerblue": [30, 144, 255, 1],
            "firebrick": [178, 34, 34, 1],
            "floralwhite": [255, 250, 240, 1],
            "forestgreen": [34, 139, 34, 1],
            "fuchsia": [255, 0, 255, 1],
            "gainsboro": [220, 220, 220, 1],
            "ghostwhite": [248, 248, 255, 1],
            "gold": [255, 215, 0, 1],
            "goldenrod": [218, 165, 32, 1],
            "gray": [128, 128, 128, 1],
            "green": [0, 128, 0, 1],
            "greenyellow": [173, 255, 47, 1],
            "grey": [128, 128, 128, 1],
            "honeydew": [240, 255, 240, 1],
            "hotpink": [255, 105, 180, 1],
            "indianred": [205, 92, 92, 1],
            "indigo": [75, 0, 130, 1],
            "ivory": [255, 255, 240, 1],
            "khaki": [240, 230, 140, 1],
            "lavender": [230, 230, 250, 1],
            "lavenderblush": [255, 240, 245, 1],
            "lawngreen": [124, 252, 0, 1],
            "lemonchiffon": [255, 250, 205, 1],
            "lightblue": [173, 216, 230, 1],
            "lightcoral": [240, 128, 128, 1],
            "lightcyan": [224, 255, 255, 1],
            "lightgoldenrodyellow": [250, 250, 210, 1],
            "lightgray": [211, 211, 211, 1],
            "lightgreen": [144, 238, 144, 1],
            "lightgrey": [211, 211, 211, 1],
            "lightpink": [255, 182, 193, 1],
            "lightsalmon": [255, 160, 122, 1],
            "lightseagreen": [32, 178, 170, 1],
            "lightskyblue": [135, 206, 250, 1],
            "lightslategray": [119, 136, 153, 1],
            "lightslategrey": [119, 136, 153, 1],
            "lightsteelblue": [176, 196, 222, 1],
            "lightyellow": [255, 255, 224, 1],
            "lime": [0, 255, 0, 1],
            "limegreen": [50, 205, 50, 1],
            "linen": [250, 240, 230, 1],
            "magenta": [255, 0, 255, 1],
            "maroon": [128, 0, 0, 1],
            "mediumaquamarine": [102, 205, 170, 1],
            "mediumblue": [0, 0, 205, 1],
            "mediumorchid": [186, 85, 211, 1],
            "mediumpurple": [147, 112, 219, 1],
            "mediumseagreen": [60, 179, 113, 1],
            "mediumslateblue": [123, 104, 238, 1],
            "mediumspringgreen": [0, 250, 154, 1],
            "mediumturquoise": [72, 209, 204, 1],
            "mediumvioletred": [199, 21, 133, 1],
            "midnightblue": [25, 25, 112, 1],
            "mintcream": [245, 255, 250, 1],
            "mistyrose": [255, 228, 225, 1],
            "moccasin": [255, 228, 181, 1],
            "navajowhite": [255, 222, 173, 1],
            "navy": [0, 0, 128, 1],
            "oldlace": [253, 245, 230, 1],
            "olive": [128, 128, 0, 1],
            "olivedrab": [107, 142, 35, 1],
            "orange": [255, 165, 0, 1],
            "orangered": [255, 69, 0, 1],
            "orchid": [218, 112, 214, 1],
            "palegoldenrod": [238, 232, 170, 1],
            "palegreen": [152, 251, 152, 1],
            "paleturquoise": [175, 238, 238, 1],
            "palevioletred": [219, 112, 147, 1],
            "papayawhip": [255, 239, 213, 1],
            "peachpuff": [255, 218, 185, 1],
            "peru": [205, 133, 63, 1],
            "pink": [255, 192, 203, 1],
            "plum": [221, 160, 221, 1],
            "powderblue": [176, 224, 230, 1],
            "purple": [128, 0, 128, 1],
            "red": [255, 0, 0, 1],
            "rosybrown": [188, 143, 143, 1],
            "royalblue": [65, 105, 225, 1],
            "saddlebrown": [139, 69, 19, 1],
            "salmon": [250, 128, 114, 1],
            "sandybrown": [244, 164, 96, 1],
            "seagreen": [46, 139, 87, 1],
            "seashell": [255, 245, 238, 1],
            "sienna": [160, 82, 45, 1],
            "silver": [192, 192, 192, 1],
            "skyblue": [135, 206, 235, 1],
            "slateblue": [106, 90, 205, 1],
            "slategray": [112, 128, 144, 1],
            "slategrey": [112, 128, 144, 1],
            "snow": [255, 250, 250, 1],
            "springgreen": [0, 255, 127, 1],
            "steelblue": [70, 130, 180, 1],
            "tan": [210, 180, 140, 1],
            "teal": [0, 128, 128, 1],
            "thistle": [216, 191, 216, 1],
            "tomato": [255, 99, 71, 1],
            "turquoise": [64, 224, 208, 1],
            "violet": [238, 130, 238, 1],
            "wheat": [245, 222, 179, 1],
            "white": [255, 255, 255, 1],
            "whitesmoke": [245, 245, 245, 1],
            "yellow": [255, 255, 0, 1],
            "yellowgreen": [154, 205, 50, 1]
        };
        color = color.trim().toLowerCase();
        //See if we've got a named color
        // Errors here if color is numeric
        try {
            if ((CSSColorTable[color])) {
                //if we got a direct match for a color name
                //no need for further processing
                return CSSColorTable[color];
            }
        } catch (Ignore) {
        }


        var hex3 = color.match(/^#([0-9a-f]{3})$/i);
        if (hex3) {
            hex3 = hex3[1];
            return [
                parseInt(hex3.charAt(0), 16) * 0x11,
                parseInt(hex3.charAt(1), 16) * 0x11,
                parseInt(hex3.charAt(2), 16) * 0x11, 1];
        }
        var hex6 = color.match(/^#([0-9a-f]{6})$/i);
        if (hex6) {
            hex6 = hex6[1];
            return [
                parseInt(hex6.substr(0, 2), 16),
                parseInt(hex6.substr(2, 2), 16),
                parseInt(hex6.substr(4, 2), 16), 1];
        }

        var rgba = color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+.*\d*)\s*\)$/i) || color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i) || color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\.*\d*)\s*\)$/i); //tranperency with no leading zero

        if (rgba) {
            return [rgba[1], rgba[2], rgba[3], rgba[4] === undefined ? 1 : rgba[4]];
        }
        var rgb = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);

        if (rgb) {

            return [rgb[1], rgb[2], rgb[3], 1];
        }

        //HSL(a) Color space
        if (color.indexOf('hsl') > -1) {


            var hsl = color.match(/(\d+(\.\d+)?)/g),
                    //
                    h = hsl[0],
                    s = hsl[1] / 100,
                    l = hsl[2] / 100,
                    a = (hsl[3] === undefined ? 1 : hsl[3]),
                    t1, t2, t3, rgb, val;
            //

            if (s == 0) { //no saturation, abort to end
                val = Math.round(l * 255);
                rgb = [val, val, val, a];
            } else {
                if (l < 0.5)
                    t2 = l * (1 + s);
                else
                    t2 = l + s - l * s;
                t1 = 2 * l - t2;
                rgb = [0, 0, 0];
                for (var i = 0; i < 3; i++) {
                    t3 = h + 1 / 3 * -(i - 1);
                    t3 < 0 && t3++;
                    t3 > 1 && t3--;
                    if (6 * t3 < 1)
                        val = t1 + (t2 - t1) * 6 * t3;
                    else if (2 * t3 < 1)
                        val = t2;
                    else if (3 * t3 < 2)
                        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                    else
                        val = t1;
                    rgb[i] = Math.round(val * 255);
                }
            }

            rgb.push(a);
            return rgb;

        }
        ;



        //HSB(a) Color space
        if (color.indexOf('hsb') > -1) {
            //Adapted from dojo.color
            var hsv = color.match(/(\d+(\.\d+)?)/g),
                    h = hsv[0] === 360 ? 0 : hsv[0],
                    s = hsv[1] / 100,
                    v = hsv[2] / 100,
                    a = 1,
                    hue = h,
                    saturation = s,
                    value = v;
            var r, g, b;
            if (saturation === 0) {
                rgb = [value, value, value, a];
            } else {
                var hTemp = hue / 60,
                        i = Math.floor(hTemp),
                        f = hTemp - i;
                var p = value * (1 - saturation);
                var q = value * (1 - (saturation * f));
                var t = value * (1 - (saturation * (1 - f)));
                switch (i) {
                    case 0:
                    {
                        r = value, g = t, b = p;
                        break;
                    }
                    case 1:
                    {
                        r = q, g = value, b = p;
                        break;
                    }
                    case 2:
                    {
                        r = p, g = value, b = t;
                        break;
                    }
                    case 3:
                    {
                        r = p, g = q, b = value;
                        break;
                    }
                    case 4:
                    {
                        r = t, g = p, b = value;
                        break;
                    }
                    case 5:
                    {
                        r = value, g = p, b = q;
                        break;
                    }
                }
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
        }


    }

};
/**
 * @class
 * FX
 * @name TigerJS.UI.FX
 */
TigerJS.UI.FX = {
    /**
     * @class
     * 
     * The {@link TigerJS.UI.FX.Animation}  class sets up various animation
     * keyframes ready to be used either by referncing the animation
     * using the standard CSS syntax of from javascript.
     * The javascript syntax takes one argument, a configuration object
     * containing properties for the animation<br/>
     * The return object contains interfaces for subscribing to varuious animation events,
     * the interfaces are chaniable.
     * @param {Object} animConfig The animation configuration object
     * @param {String} animConfig.name The specific animation to setup
     *
     * <pre>
     * The following animations are available to use directly from css or javascript;
     * bounce|bounceIn|bounceInDown|bounceInUp|bounceInLeft|bounceInRight
     * bounceOut|bounceOutLeft|bounceOutRight|bounceOutUp|bounceOutDown
     * fadeIn|fadeInDown|fadeInDownBig|fadeInLeft|fadeInLeftBig|fadeInRight|fadeInRightBig
     * fadeInUp|fadeInUpBig| rotateX |
     * fadeOut|fadeOutDown|fadeOutDownBig|fadeOutLeft|fadeOutLeftBig|fadeOutRight|fadeOutRightBig
     * fadeOutUp|fadeOutUpBig|flash|flipInX|flipOutX|flipInY|flipOutY|hinge|
     * lightSpeedIn|lightSpeedOut|pulse|rollIn|rollOut|rotateIn|rotateInDownLeft|
     * rotateInDownRight|rotateInUpLeft|rotateInUpRight|rotateOut|rotateOutDownLeft|
     * rotateOutDownRight|rotateOutUpLeft|rotateOutUpRight|rubberBand|shake|slideInDown|
     * slideInLeft|slideInRight|slideOutLeft|slideOutright|slideOutUp|swing|tada|wobble
     *
     * The following animations can only be used from javascript by using this object
     * wipe-left|wipe-right|wipe-bottom|wipe-top|
     * slidein-left|slidein-right|slidein-bottom|slidein-top
     *   </pre>
     * @example T.UI.FX.Animation({
     *                 el : id, //just pass the string id of the element or a DOM reference
     *                 name: "wipe-left", //the animation to set;
     *                 time: 3, //this means the animation would take three seconds
     *                 ....
     *                   })
     *
     * @param {Number} [animConfig.time = 1s] The duration the animation would take in seconds
     * @param {Boolean} [animConfig.curve = ease-in] The easing curve function to use, could be one of;
     *
     * <pre>
     *     linear|ease|ease-in|ease-out|cubic-bezier(n,n,n,n)|initial|inherit;
     *     </pre>
     * @param {Number} [animConfig.delay = 0s] Specifies a delay before starting the animation (in seconds)
     * @param {Number} [animConfig.iteration = 1] Specifies how many times the animation should cycle
     * @param {Number} [animConfig.direction = normal] Specifies whether or not the animation should play in reverse on alternate cycles
     * @param {Number} [animConfig.fillMode = both]The animation will follow the
     * rules for both forwards and backwards. That is, it will extend the animation
     *  properties in both directions
     *
     * @param {String | T.$ | HTMLElement} animConfig.el The element to apply the animation on
     *   @name TigerJS.UI.FX.Animation 
     *
     */

    Animation: function (animConfig) {
        var el = animConfig.el._outerHTML ? animConfig.el : T.$(animConfig.el); // element to animate



        if (animConfig.name.strpos("wipe") !== -1) {
            //create custom css-clip animation function
            var elWidth = el.offsetWidth,
                    elHeight = el.offsetHeight;
            if (animConfig.name === "wipe-left") {


                //set a default clip property on the element before animating
                el.style.clip = "rect(0px," + elWidth + "px," + elHeight + "px,0px)";
                if (!document.getElementById(el.id + "_wipeleft")) { //dont duplicate style

                    //create the keyframes and declarations, we declare with the standard syntax and webkit prefix
                    var clipAnimation =
                            //old webkit browsers
                            "@-webkit-keyframes " + el.id + "_" + "wipeLeft{ " +
                            "from{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}" +
                            " to{ clip:rect(0px," + elWidth + "px," + elHeight + "px," + elWidth + "px);}} " +
                            //standard css
                            "@keyframes " + el.id + "_" + "wipeLeft{ " +
                            "from{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}" +
                            " to{ clip:rect(0px," + elWidth + "px," + elHeight + "px," + elWidth + "px);}} ";
                    //create a style object and apend the animation and keyframes
                    var styleEl = document.createElement("style");
                    styleEl.id = el.id + "_wipeLeft";
                    styleEl.textContent = clipAnimation;
                    document.documentElement.firstChild.appendChild(styleEl);
                }
                //set the animation on the element
                el.setStyle(// set the animation properties for this node
                        {
                            animation: new String(el.id + "_wipeLeft" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both")),
                            WebkitAnimation: new String(el.id + "_wipeLeft" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both"))
                        });
            } else if (animConfig.name === "wipe-top") {

                //set a default clip property on the element before animating
                el.style.clip = "rect(0px," + elWidth + "px," + elHeight + "px,0px)";
                if (!document.getElementById(el.id + "_wipeTop")) { //dont duplicate style

                    //create the keyframes and declarations, we declare with the standard syntax and webkit prefix
                    var clipAnimation =
                            //old webkit browsers
                            "@-webkit-keyframes " + el.id + "_" + "wipeTop{ " +
                            "from{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}" +
                            " to{ clip:rect(" + elHeight + "px," + elWidth + "px," + elHeight + "px," + "0px);}} " +
                            //standard css
                            "@keyframes " + el.id + "_" + "wipeTop{ " +
                            "from{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}" +
                            " to{ clip:rect(" + elHeight + "px," + elWidth + "px," + elHeight + "px," + "0px);}} ";
                    //create a style object and apend the animation and keyframes
                    var styleEl = document.createElement("style");
                    styleEl.id = el.id + "_wipeTop";
                    styleEl.textContent = clipAnimation;
                    document.documentElement.firstChild.appendChild(styleEl);
                }
                //set the animation on the element
                el.setStyle(// set the animation properties for this node
                        {
                            animation: new String(el.id + "_wipeTop" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both")),
                            WebkitAnimation: new String(el.id + "_wipeTop" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both"))
                        });
            } else if (animConfig.name === "wipe-bottom") {

                //set a default clip property on the element before animating
                el.style.clip = "rect(0px," + elWidth + "px," + elHeight + "px,0px)";
                if (!document.getElementById(el.id + "_wipeBottom")) { //dont duplicate style

                    //create the keyframes and declarations, we declare with the standard syntax and webkit prefix
                    var clipAnimation =
                            //old webkit browsers
                            "@-webkit-keyframes " + el.id + "_" + "wipeBottom{ " +
                            "from{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}" +
                            " to{ clip:rect(0px," + elWidth + "px," + "0px," + "0px);}} " +
                            //standard css
                            "@keyframes " + el.id + "_" + "wipeBottom{ " +
                            "from{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}" +
                            " to{ clip:rect(0px," + elWidth + "px," + "0px," + "0px);}} ";
                    //create a style object and apend the animation and keyframes
                    var styleEl = document.createElement("style");
                    styleEl.id = el.id + "_wipeBottom";
                    styleEl.textContent = clipAnimation;
                    document.documentElement.firstChild.appendChild(styleEl);
                }
                //set the animation on the element
                el.setStyle(// set the animation properties for this node
                        {
                            animation: new String(el.id + "_wipeBottom" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both")),
                            WebkitAnimation: new String(el.id + "_wipeBottom" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both"))
                        });
            } else if (animConfig.name === "wipe-right") {

                //set a default clip property on the element before animating
                el.style.clip = "rect(0px," + elWidth + "px," + elHeight + "px,0px)";
                if (!document.getElementById(el.id + "_wipeRight")) { //dont duplicate style

                    //create the keyframes and declarations, we declare with the standard syntax and webkit prefix
                    var clipAnimation =
                            //old webkit browsers
                            "@-webkit-keyframes " + el.id + "_" + "wipeRight{ " +
                            "from{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}" +
                            " to{ clip:rect(0px," + "0px," + elHeight + "px," + "0px);}} " +
                            //standard css
                            "@keyframes " + el.id + "_" + "wipeRight{ " +
                            "from{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}" +
                            " to{ clip:rect(0px," + "0px," + elHeight + "px," + "0px);}} ";
                    //create a style object and apend the animation and keyframes
                    var styleEl = document.createElement("style");
                    styleEl.id = el.id + "_wipeRight";
                    styleEl.textContent = clipAnimation;
                    document.documentElement.firstChild.appendChild(styleEl);
                }
                //set the animation on the element
                el.setStyle(// set the animation properties for this node
                        {
                            animation: new String(el.id + "_wipeRight" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both")),
                            WebkitAnimation: new String(el.id + "_wipeRight" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both"))
                        });
            }





        } else if (animConfig.name.search(/slidei/g) !== -1) {

            //create custom css-clip animation function
            var elWidth = el.offsetWidth,
                    elHeight = el.offsetHeight;
            if (animConfig.name === "slidein-left") { //we're to do a wipe left animation

                //set a default clip property on the element before animating
                el.style.clip = "rect(0px,0px," + elHeight + "px,0px)";
                el.style.opacity = "1";
                if (!document.getElementById(el.id + "_slideInLeft")) { //dont duplicate style
                    //create the keyframes and declarations, we declare with the standard syntax and webkit prefix
                    var clipAnimation =
                            //old webkit browsers
                            "@-webkit-keyframes " + el.id + "_" + "slideInLeft{ " +
                            "from{ clip:rect(0px,0px" + elHeight + "px,0px);}" +
                            " to{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}} " +
                            //standard css
                            "@keyframes " + el.id + "_" + "slideInLeft{ " +
                            "from{ clip:rect(0px,0px" + elHeight + "px,0px);}" +
                            " to{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}} ";
                    //create a style object and apend the animation and keyframes
                    var styleEl = document.createElement("style");
                    styleEl.id = el.id + "_slideInLeft";
                    styleEl.textContent = clipAnimation;
                    document.documentElement.firstChild.appendChild(styleEl);
                }
                //set the animation on the element
                el.setStyle(// set the animation properties for this node
                        {
                            animation: new String(el.id + "_slideInLeft" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both")),
                            WebkitAnimation: new String(el.id + "_slideInLeft" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both"))
                        });
            } else if (animConfig.name === "slidein-right") {

                //set a default clip property on the element before animating
                el.style.clip = "rect(0px," + elWidth + "px," + elHeight + "px," + elWidth + "px)";
                el.style.opacity = "1";
                if (!document.getElementById(el.id + "_slideInRight")) { //dont duplicate style
                    //create the keyframes and declarations, we declare with the standard syntax and webkit prefix
                    var clipAnimation =
                            //old webkit browsers
                            "@-webkit-keyframes " + el.id + "_" + "slideInRight{ " +
                            "from{ clip:rect(0px," + elWidth + "px," + elHeight + "px," + elWidth + "px)}" +
                            " to{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}} " +
                            //standard css
                            "@keyframes " + el.id + "_" + "slideInRight{ " +
                            "from{ clip:rect(0px," + elWidth + "px," + elHeight + "px," + elWidth + "px)}" +
                            " to{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}} ";
                    //create a style object and apend the animation and keyframes
                    var styleEl = document.createElement("style");
                    styleEl.id = el.id + "_slideInRight";
                    styleEl.textContent = clipAnimation;
                    document.documentElement.firstChild.appendChild(styleEl);
                }
                //set the animation on the element
                el.setStyle(// set the animation properties for this node
                        {
                            animation: new String(el.id + "_slideInRight" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both")),
                            WebkitAnimation: new String(el.id + "_slideInRight" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both"))
                        });
            } else if (animConfig.name === "slidein-bottom") {


                //set a default clip property on the element before animating
                el.style.clip = "rect(" + elHeight + "px," + elWidth + "px," + elHeight + "px," + "0px)";
                el.style.opacity = "1";
                if (!document.getElementById(el.id + "_slideInBottom")) { //dont duplicate style

                    //create the keyframes and declarations, we declare with the standard syntax and webkit prefix
                    var clipAnimation =
                            //old webkit browsers
                            "@-webkit-keyframes " + el.id + "_" + "slideInBottom{ " +
                            "from{ clip:rect(" + elHeight + "px," + elWidth + "px," + elHeight + "px," + "0px);}" +
                            " to{ clip:rect(0px," + elWidth + "px," + elHeight + "px," + "0px);}}" +
                            //standard css
                            " @keyframes " + el.id + "_" + "slideInBottom{ " +
                            "from{ clip:rect(" + elHeight + "px," + elWidth + "px," + elHeight + "px," + "0px);}" +
                            " to{ clip:rect(0px," + elWidth + "px," + elHeight + "px," + "0px);}}";
                    //create a style object and apend the animation and keyframes
                    var styleEl = document.createElement("style");
                    styleEl.id = el.id + "_slideInBottom";
                    styleEl.textContent = clipAnimation;
                    document.documentElement.firstChild.appendChild(styleEl);
                }
                //set the animation on the element
                el.setStyle(// set the animation properties for this node
                        {
                            animation: new String(el.id + "_slideInBottom" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both")),
                            WebkitAnimation: new String(el.id + "_slideInBottom" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both"))
                        });
            } else if (animConfig.name === "slidein-top") {

                //set a default clip property on the element before animating
                el.style.clip = "rect(0px," + elWidth + "px,0px," + "0px)";
                el.style.opacity = "1";
                if (!document.getElementById(el.id + "_slideInTop")) { //dont duplicate style
                    //create the keyframes and declarations, we declare with the standard syntax and webkit prefix
                    var clipAnimation =
                            //old webkit browsers
                            "@-webkit-keyframes " + el.id + "_" + "slideInTop{ " +
                            "from{ clip:rect(0px," + elWidth + "px,0px," + "0px);}" +
                            " to{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}}" +
                            //standard css
                            " @keyframes " + el.id + "_" + "slideInTop{ " +
                            "from{ clip:rect(0px," + elWidth + "px,0px," + "0px);}" +
                            " to{ clip:rect(0px," + elWidth + "px," + elHeight + "px,0px);}}";
                    //create a style object and apend the animation and keyframes
                    var styleEl = document.createElement("style");
                    styleEl.id = el.id + "_slideInTop";
                    styleEl.textContent = clipAnimation;
                    document.documentElement.firstChild.appendChild(styleEl);
                }
                //set the animation on the element
                el.setStyle(// set the animation properties for this node
                        {
                            animation: new String(el.id + "_slideInTop" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both")),
                            WebkitAnimation: new String(el.id + "_slideInTop" + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                    (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                    (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                    (animConfig.fillMode || "both"))
                        });
            }

        } else { //standard animations in our css file

            el.setStyle(// set the animation properties for this node
                    {
                        animation: new String(animConfig.name + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                (animConfig.fillMode || "both")),
                        WebkitAnimation: new String(animConfig.name + " " + (animConfig.time ? animConfig.time + "s" : "1s") + " " +
                                (animConfig.curve || "ease-in") + " " + (animConfig.delay ? animConfig.delay + "s" : "0s") + " " +
                                (animConfig.iteration || "1") + " " + (animConfig.direction || "normal") + " " +
                                (animConfig.fillMode || "both"))
                    });
        }

        return {//public interface

            /**
             * Accepts a variable list of functions to be called with
             * the animationstart event
             * @param {...Function} var_args A variable list of functions to set as callback
             * @function
             * @memberOf TigerJS.UI.FX.Animation#
             * @type TigerJS.UI.FX.Animation
             */
            _onanimationstart: function (var_args) {

                T.each(arguments, function (v, k) {
                    el.on("webkitAnimationStart animationstart MSAnimationStart mozAnimationStart", v);

                });
                return this;
            },
            /**
             * Accepts a variable list of functions to be called with
             * the animationend event
             * @param {...Function} var_args A variable list of functions to set as callback
             * @function
             * @type TigerJS.UI.FX.Animation
             * @memberOf TigerJS.UI.FX.Animation#
             */
            _onanimationend: function (var_args) {

                T.each(arguments, function (v, k) {

                    el.on("animationend webkitAnimationEnd MSAnimationEnd mozAnimationEnd", v);

                });
                return this;
            },
            /**
             * Accepts a variable list of functions to be called with
             * the animationtiteration event
             * @param {...Function} var_args A variable list of functions to set as callback
             * @function
             * @type TigerJS.UI.FX.Animation
             * @memberOf TigerJS.UI.FX.Animation#
             */
            _onanimationiterate: function (var_args) {
                T.each(arguments, function (v, k) {
                    el.on("animationiteration webkitAnimationIteration MSAnimationIteration mozAnimationIteration", v);

                });
                return this;
            }
        };
    },
    /**
     * @class
     * 
     * The {@link TigerJS.UI.FX.Draggable} class is used to set Widget elements
     * or any other element for that that matter as a draggable.
     * <pre>
     * Note*:
     *   If an element is draggable but you want to disable dragging on certain child elements
     *   Give the child element a 't-no-drag- class
     *   
     *   </pre>
     * @param {TigerJS.$ | DOMELement} el The element to set as Draggable
     * @param {Object} config_ Configuration object for this class
     * @param {Boolean} config_.constrain Configuration specifying
     * if widget movement should be restricted to their parent element
     *
     * @param {Boolean} config_.H Configuration specifying
     * the widget should be restricted only to horizontal movement
     * @param {Boolean} config_.V Configuration specifying
     * the widget should be restricted only to vertical movement
     * @param {HTMLElement} config_.dragTarget In cases where just the drag handle specify actual target here
     * 
     *
     * @see TigerJS.UI.Widget#setDraggable
     * @fires
     * event: _dragmove Fires continiously when the Element is in motion.
     * @fires _dragend Fires when the Element stops moving, and
     * we have a mouse up or touch-end action.
     * @name TigerJS.UI.FX.Draggable
     */

    Draggable: function (el, config_) {
        //get the proper DOMElement, and if its one of our widget,
        // refrence the proper HTML element within
        if (T.isString(el)) {
            el = T.$(el);
        }

        if (T.type(el) !== "undefined") {

            el = el.nodeType && el.nodeType === 1 ? T.$(el) : el._widgetElement;
        } else {



            var el = null; // no element, may be they are cancelling a drag

        }

        if (el) {
            var ev_x, ev_y, el_x, el_y, oldZIndex, dragging = false,
                    old_coord = {}, parent_coords = {}, drag_clientX,
                    drag_clientY,
                    old_positioning, oldCursor,
                    config = config_ || {},
                    current_x = null,
                    current_y = null, // just some trackers, for edge detection

                    //elements-parent size, to be set on-mousedown, this is also
                    // used to calculate the edges of parent nodes in (constrain) mode
                    op_width, op_height, realDrag = false,
                    _handle = false;
            /**constrain to container **/ /// default to true

            config.constrain =
                    config.constrain === true || config.constrain === false ? config.constrain :
                    config.constrain = true;
        }

        //set the element to drag, if the current element is just a handle
        if (el && config.dragTarget) {
            el.className += " t-dragHandle"; // note it as a drag handle
            if (el.Node)
                realDrag = T.$(config.dragTarget); //a widget
            if (!el.Node)
                realDrag = T.$(config.dragTarget); //a regular element
        }

        //in such a case where we are  just a handle keep a reference 

        if (el) {
            if (realDrag)
                _handle = el;
            //mouse move cursor stuff
            if (_handle) { // if we are a drag handle
                _handle.on("_dragmove", function () {
                    this.target.style.cursor = "move";
                });
            } else { //if we are the real drag target
                el.on("_dragmove", function () {
                    this.target.style.cursor = "move";
                });
            }

            //we register this events on the document
            //as when dragging really fast the mouese-pointer actually
            //leaves the element, so if we do not monitor the movent
            // on a document wide scope we would have 'moves' stopping
            //abdruptly
            T.$(document.body).on("mousemove", doDrag, false, false, false);
            T.$(document.body).on("touchmove", doDrag, false, false, false);
        }
        function initDrag() {
            // first make sure an Invalid Element wasnt clicked
            // Invalid elements would be buttons, editable feilds and links, or other
            // elements with a no drag data-attribute
            //
            if (/button|a|input|textarea/gi.test(this.target.tagName)) {
                this.target.style.cursor = "auto";
                return;
            }
            if (/t-no-drag/gi.test(this.target.className)) { //they have been given the t-no-drag class

                return;
            }

            //event coords
            ev_x = this.touches ? this.changedTouches[0].pageX :
                    this.clientX;
            ev_y = this.touches ? this.changedTouches[0].pageY :
                    this.clientY;

            //target initial coords
            el_x = realDrag ? parseInt(realDrag.offsetLeft) : parseInt(el.offsetLeft);
            el_y = realDrag ? parseInt(realDrag.offsetTop) : parseInt(el.offsetTop);

            //offsetParent fixins
            op_width = realDrag ? realDrag.offsetParent.scrollWidth : el.offsetParent.scrollWidth;
            op_height = realDrag ? realDrag.offsetParent.scrollHeight : el.offsetParent.scrollHeight;

            old_positioning = realDrag ? realDrag.style.position : el.style.position;
            oldCursor = realDrag ? realDrag.style.cursor : el.style.cursor;

            if (!realDrag) {
                el.style.position = "absolute";
            } else {

                realDrag.style.position = "absolute";
            }

            dragging = !dragging;
            this.preventDefault();
            this.stopPropagation();
            // prevent text selection in IE ... Is this really needed
            el.onselectstart = function () {
                return false;
            };
            // prevent IE from trying to drag an image
            el.ondragstart = function () {
                return false;
            };
            // prevent text selection (except IE)
            return false;
        }

        function doDrag() {

            //are we just a drag handle. then set the real element to drag
            el = realDrag ? realDrag : el;
            // this is the actual "drag code"
            if (dragging === false)
                return;
            //support touch;
            drag_clientX = this.touches ? this.changedTouches[0].pageX :
                    this.clientX;
            drag_clientY = this.touches ? this.changedTouches[0].pageY :
                    this.clientY;
            //Amount moved
            var e_dx = drag_clientX - ev_x,
                    e_dy = drag_clientY - ev_y,
                    i;
            if (config.constrain || el.offsetParent === document.body ||
                    el.offsetParent.tagName === "HTML") {
                { //restric movement if we are at the top-edge of parent

                    if (el.offsetTop <= 0 && !config.H) {//we make sure we are not set to move only horizontally

                        el.style.top = 0 + "px";
                        if (!current_y)
                            current_y = drag_clientY;
                    }
                    if ((parseInt(el.style.top) === 0) && !config.H) {

                        if (drag_clientY - current_y <= 1) {
                            e_dy = 0;
                        } else {
                            el.style.top = parseInt(el.style.top) + e_dy + "px";
                            current_y = null; //reset edge tracker
                        }

                    }
                }

                { //restric movement if we are at the bottom-edge of parent
                    if (op_height - (el.offsetTop + el.offsetHeight) <= 0 && !config.H) {

                        el.style.top = op_height - (el.offsetHeight) + "px";
                        if (!current_y)
                            current_y = drag_clientY;
                    }
                    if (parseInt(el.style.top) === op_height - (el.offsetHeight) && !config.H) {

                        if (drag_clientY - current_y >= (1 * -1)) {
                            e_dy = 0;
                        } else {
                            el.style.top = parseInt(el.style.top) - e_dy + "px";
                            current_y = null; //reset edge tracker
                        }
                        ;
                    }
                }

                { //restrict at left edge of parent, (why exaclty am i scoping here ??)///
                    if (el.offsetLeft <= 0 && !config.V) {
                        el.style.left = 0 + "px";
                        if (!current_x)
                            current_x = drag_clientX;
                    }
                    if (parseInt(el.style.left) === 0 && !config.V) {
                        //allow right-ward movement only after 2px threshold
                        if (drag_clientX - current_x < 1) {
                            e_dx = 0;
                        } else {
                            el.style.left = parseInt(el.style.left) + e_dx + "px";
                            current_x = null; //reset edge tracker
                        }
                    }

                }


                { //restrict at right edge of parent
                    if (op_width - (el.offsetLeft + el.offsetWidth) <= 0 && !config.V) {
                        el.style.left = op_width - (el.offsetWidth) + "px";
                        if (!current_x)
                            current_x = drag_clientX;
                    }
                    if (parseInt(el.style.left) === op_width - (el.offsetWidth) && !config.V) {
                        if (drag_clientX - current_x > (1 * -1)) {
                            e_dx = 0;
                        } else {
                            el.style.left = parseInt(el.style.left) - e_dx + "px";
                            current_x = null; //reset edge tracker
                        }
                    }


                }
            }
            //moving function
            var __move = function (dx, dy) {

                //counting down each pixel moved provides a more smoother
                //experience


                if (!config.V) { //allow horizontal movement
                    if (dx > 0) {
                        //rightward movement

                        for (i = 0; i < dx; i++) {
                            el.style.left = el_x + i + "px";
                        }
                    } else {
                        //leftwards
                        for (i = 0; i > e_dx; i--) {
                            el.style.left = el_x + i + "px";
                        }
                    }

                }


                if (!config.H) { //allow vertical movement
                    if (dy > 0) {
                        //downward movement
                        for (i = 0; i < dy; i++) {
                            el.style.top = el_y + i + "px";
                        }
                    } else {
                        //upward movement 
                        for (i = 0; i > dy; i--) {
                            el.style.top = el_y + i + "px";
                        }
                    }

                }
                ;
                // fire drag  moveevent
                //only fire on the drag handle, if its one
                if (realDrag) {
                    _handle.fire("_dragmove");
                } else {
                    el.fire("_dragmove");
                }
            };
            __move(e_dx, e_dy);
        }

        function stopDrag() {

            el.style.position = old_positioning;
            //    el.style.zIndex = oldZIndex;
            el.style.cursor = oldCursor;
            dragging = false;
            //only fire on the drag handle, if its one
            if (realDrag) {
                _handle.fire("_dragend");
            } else {
                el.fire("_dragend");
            }
        }

        //setup events for dragging
        if (el) {
            el.on("mousedown", initDrag);
            el.on("touchstart", initDrag);
            //its common for the mouse to be detected on the html element
            //while moving around so the need for the handler, else the drag event would'nt cancel
            //if we mouse up on the html element
            T.$(document.body).on("mouseup", stopDrag);
            T.$(document.documentElement).on("mouseup", stopDrag);
            T.$(document.body).on("touchend", stopDrag);
            T.$(document.documentElement).on("touchend", stopDrag);
        }

        //PUBLIC INTERFACE FOR CLASS DRAGGABLE
        return {
            /**
             * Disables the dragging of an Element, to renable simple
             * call {@link TigerJS.UI.FX.Draggable} with the required arguments
             * @param {HTMLElement | String} el An Element's reference or it's ID
             * @function
             * @memberOf TigerJS.UI.FX.Draggable#
             */
            cancelDrag: function (el) {
                el = el.nodType && el.nodType === 1 ? el : T.$(el);
                el.off("mousedown", initDrag);
                el.off("touchstart", initDrag);
                T.$(document.body).off("mousemove", doDrag);
                T.$(document.body).off("touchmove", doDrag);
                T.$(document.documentElement).off("mousemove", doDrag);
                T.$(document.documentElement).off("touchmove", doDrag);
            }
        };
    }

};
/**
 * @class
 * The {@link TigerJS.UI.Swiper} class can be used to detect swipe actions on touch based devices. It provides
 * a simple interface for subscribing to swipe events and also adds mouse simulation for
 * non touch based devices. This object also provides information when a finger is simply moving
 * over an element even if the speed of movement cant be describe as a swipe
 * @param {String | HTMLElement} el An element or its string id to observe for swipe actions.
 * @param {Function} callBack A call back to recieve swipe and move events,
 * <pre>
 * This function recieves the folllowing  arguments
 *  - (EventObject, direction,phase, swipetype, distance)
 *
 *  The swipetype argument could be one of
 *  -  none|left|right|top|bottom,
 *
 *  While the phase argument represents the current touch event phase and coulde be one of
 *  -  start|move|end,
 * which means we are at the tocuh-start,
 *  touch-move or touch-end phase of the event
 *
 * The direction argument could also be one of the following
 * none|right|left|top|bottom
 
 // USAGE:
 
 T.UI.Swiper(el, function(evt, direction, phase, swipetype, distance){
 // evt: contains original Event object
 // dir: contains "none", "left", "right", "top", or "down"
 // phase: contains "start", "move", or "end"
 // swipetype: contains "none", "left", "right", "top", or "down"
 // distance: distance traveled either horizontally or vertically, depending on dir value
 
 if ( phase == 'move' && (direction =='left' || direction == 'right') )
 console.log('You are moving the finger horizontally by ' + distance)
 })
 
 * </pre>
 *
 */
TigerJS.UI.Swiper = function (el, callBack) {
    var touchsurface = T.$(el),
            dir,
            swipeType,
            startX,
            startY,
            distX,
            distY,
            threshold = 40, //required min distance traveled to be considered swipe in px
            restraint = 150, // maximum distance allowed at the same time in perpendicular direction
            allowedTime = 400, // maximum time allowed to travel that distance
            elapsedTime,
            startTime,
            handletouch = callBack;
    touchsurface.on('touchstart mousedown', touchstarthandler);

    function touchstarthandler(e) {
        var touchobj = this.touches ? this.changedTouches[0] : this;
        dir = 'none';
        swipeType = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface

        //only register move events after a touchstart or mousedown event
        touchsurface.on('touchmove mousemove', touchmovehandler);
        handletouch(this, 'none', 'start', swipeType, 0); // fire callback function with params dir="none", phase="start", swipetype="none" etc


    }
    ;

    function touchmovehandler(e) {
        var touchobj = this.touches ? this.changedTouches[0] : this; //event object

        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface

        if (Math.abs(distX) > Math.abs(distY)) { // if distance traveled horizontally is greater than vertically, consider this a horizontal movement
            dir = (distX < 0) ? 'left' : 'right';
            handletouch(this, dir, 'move', swipeType, distX); // fire callback function with params dir="left|right", phase="move", swipetype="none" etc
        } else { // else consider this a vertical movement
            dir = (distY < 0) ? 'up' : 'down';
            handletouch(this, dir, 'move', swipeType, distY); // fire callback function with params dir="up|down", phase="move", swipetype="none" etc
        }

    }
    ;
    touchsurface.on('touchend mouseup', touchendhandler);

    function touchendhandler(e) {

        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for Swipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipeType = dir; // set swipeType to either "left" or "right"
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipeType = dir; // set swipeType to either "top" or "down"
            }
        }
        touchsurface.off('touchmove mousemove', touchmovehandler);

        // Fire callback function with params dir="left|right|up|down", phase="end", swipetype=dir etc:
        handletouch(this, dir, 'end', swipeType, (dir === 'left' || dir === 'right') ? distX : distY);

    }
    ;
};
/**
 * @class
 * The {@link TigerJS.UI.Widget} class is primarily an abstract class,
 * intended for the creation of widget subclasses.
 * Though you wouldnt usually use it directly, but instead
 * use one of its subclasses
 * @param {Object} configOpt Configurations options
 * @param {String | Number} configOpt.width The widgets width <i>in em</i>
 * @param {String | Number} configOpt.height The widgets height <i>in em</i>
 * @param {String | Number} configOpt.pos_x The widgets horizontal position <i>in em</i>
 * @param {String | Number} configOpt.pos_y The widgets vertical position <i>in em</i>
 * @param {String} configOpt.elementType A tag Name representing the base element type
 * @param {HTMLElement} config_.dragTarget In cases where just the drag handle specify actual target here
 * @param {String} configOpt.html   An HTML fragment to be appended as child elements
 * @param {Function} configOpt.onInit   A callBack function to be called after the widget has been initialized 
 *
 */
TigerJS.UI.Widget = function (configOpt) {
    var _widget = configOpt && configOpt.elementType ? T.$(document.createElement(configOpt.elementType)) :
            T.$(document.createElement("div"));

    ///default styles, only in default widget mode
    if (!configOpt || (configOpt && !configOpt.elementType)) {
        _widget.setStyle({
            minWidth: "5em",
            minHeight: "5em",
            width: (configOpt && configOpt.width ? configOpt.width + "em" : "5em"),
            height: (configOpt && configOpt.height ? configOpt.height + "em" : "5em"),
            backgroundColor: "lightgray",
            position: "absolute",
            borderRadius: "6px",
            left: (configOpt && configOpt.pos_x ? configOpt.pos_y + "em" : "1em"),
            top: (configOpt && configOpt.pos_x ? configOpt.pos_x + "em" : "1em")
        });

    }
    //////end default styles declaration//////////////////////////////////////////////////////////
    if (configOpt && configOpt.html) {
        _widget.innerHTML = configOpt.html;
    }

    /////object type identifier ////////////////////////////////////////
    _widget.__toString = function () {
        return "[object TigerJS.DefaultWidget]";
    };
    _widget.draggable = false;
    //All Widgets in this library sghould have a family and instance ID
    //Set the Widget's ID
    _widget.FamilyID = "DefaultWidget";
    if (T.globalWidgetCache[_widget.FamilyID]) {
        T.globalWidgetCache[_widget.FamilyID] =
                T.globalWidgetCache[_widget.FamilyID] += 1;
    } else {
        T.globalWidgetCache[_widget.FamilyID] = 1;
    }
    //Set the Instance Id for this  Widget Instance
    _widget.InstanceID = _widget.FamilyID +
            ("%02X".sprintf(T.globalWidgetCache[_widget.FamilyID]));

    //set some HTML5 data, just for fun..
    if (!configOpt || (configOpt && !configOpt.elementType))
        _widget.setData(_widget.FamilyID, _widget.InstanceID);

    //
    //
    //set the widget's id to the instance id
    _widget.id = _widget.InstanceID;

    /////////////////Public Interface for the widget Class
    _widget.addClass("widgetContainer");

    _widget.focusedConfigured = false; // flag for focus manager
    var rval = {
        _widgetElement: _widget,
        /**
         * @type String
         * Get the id of this widget
         * @memberOf TigerJS.UI.Widget#
         * @function
         */
        getId: function () {
            return _widget.id;
        },
        /**
         * 
         * Destroy this widget
         * @memberOf TigerJS.UI.Widget#
         * @function
         * @type TigerJS.UI.Widget
         * 
         * 
         */
        destroy: function () {
            _widget.destroy();
            return this;
        },
        /**
         * Are we currently in a draggable state
         * @type Boolean
         * @memberOf TigerJS.UI.Widget#
         * @function
         * @type Boolean
         */
        isDraggable: function () {
            return _widget.draggable;
        },
        /**
         * Enable automaitic z-index management for this widget.
         * This function ensures that whwnever this widget is clicked it's at once brought
         * to the top of the DOM zindex stack
         * @memberOf TigerJS.UI.Widget#
         * @function
         * @type TigerJS.UI.Widget
         *
         */
        autoStack: function () { //just put in the page
            this.configureFocus();
            return this;
        },
        /**
         * Shows the Widget using the CSS display property.
         * If the Widget has no parent node automatically
         * becomes a child of the Body element
         * @memberOf TigerJS.UI.Widget#
         * @function
         * @type TigerJS.UI.Widget
         */
        show: function () { //just put in the page
            _widget.style.display = _widget.lastDisplayMode || "block";
            return this;
        },
        /**
         * Hides the Widget, from the dislpay
         * @memberOf TigerJS.UI.Widget#
         * @function
         * @type TigerJS.UI.Widget
         */
        hide: function () {
            _widget.lastDisplayMode = _widget.style.display;
            _widget.style.display = "none";
            return this;
        },
        /**
         * Returns a reference to the DOM Node representing
         * the widget, so you can pass it to other functions
         * or expand its properties as you wish.
         * <p/>Use this method when you needd
         * @memberOf TigerJS.UI.Widget#
         * @feild
         * @readonly
         * @type TigerJS.$
         */

        Node: (function () {
            return _widget;
        })(),
        /**
         * Sets this widget as draggable
         * @param {Boolean} constrain Whether to constrain this
         * widgets movement to its parent
         * @param {Boolean} H Indicates the movement should
         *  be restricted horizontally
         * @param {Boolean} V Indicates the movement should
         *  be restricted vertically
         * @memberOf TigerJS.UI.Widget#
         * @function
         * @type TigerJS.UI.Widget
         */
        setDraggable: function (constrain, H, V) {
            T.UI.FX.Draggable(_widget, {
                constrain: constrain === (null || true) || T.type(constrain) === "undefined" ? true : false,
                H: H === (null || true) ? true : false, //if its true or not set
                V: V === (null || true) ? true : false,
                dragTarget: configOpt && configOpt.dragTarget ? T.$(configOpt.dragTarget) : false
            });
            _widget.addClass("draggable");
            _widget.draggable = true; //show we are now draggable
            return this;

        },
        /**
         * Stops this widget from being dragged
         * @memberOf TigerJS.UI.Widget#
         * @function
         * @type TigerJS.UI.Widget
         */
        unsetDraggable: function () {
            T.UI.FX.Draggable().cancelDrag(_widget);
            _widget.removeClass("draggable");
            _widget.draggable = false;
            return this;
        },
        /**
         * Appends this widget as a child of an existing element in the Document
         * @param {HTMLElement | String} parEl A pre-existing Element
         * reference or the Element's id
         * @memberOf TigerJS.UI.Widget#
         * @function
         * @type TigerJS.UI.Widget
         */
        appendToElement: function (parEl) {
            if (parEl.nodeType && parEl.nodeType === 1) {

                parEl.appendChild(_widget);
            } else if (T.isString(parEl)) {
                T.$(parEl).appendChild(_widget);
            }



            if (configOpt && configOpt.onInit)
                configOpt.onInit();
            return this;
        },
        /*
         * @ignore
         * @private
         */
        configureFocus: function () { //simple focus manager

            if (_widget.focusedConfigured) {
                return; // dont do this twice
            }
            //set a mousedown event on all childnodes
            var widgetChildren = _widget._elementChildren(),
                    zIndexValue;

            widgetChildren._on("mousedown", focusEl);
            widgetChildren._on("mouseup", retainFocus);
            _widget.on("mousedown", focusEl);
            _widget.on("mouseup", retainFocus);

            function focusEl() {
                //we sequentiall increase the zIndex of any widget clicked
                if (!T.zIndexCache) {
                    T.zIndexCache = 50;
                    zIndexValue = T.zIndexCache;
                    _widget.style.setProperty("z-index", zIndexValue, "important");
                } else {

                    //so on mousedon a widget is brought to the top

                    zIndexValue = T.zIndexCache = T.zIndexCache + 1;
                    _widget.style.setProperty("z-index", zIndexValue, "important");

                }

            }

            function retainFocus() {
                //in-case shit happens and the zIndex got altered again b4 mouseup set again
                _widget.style.setProperty("z-index", zIndexValue, "important");

            }
            _widget.focusedConfigured = true;
        },
        //set widget ID
        FamilyID: _widget.FamilyID,
        InstanceID: _widget.InstanceID

    };

    // for internal usage we keep a ref of this return object on the element
    _widget.WidgetObj = rval;

    //return the return object,
    return rval;


};