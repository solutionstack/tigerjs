/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2017 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */


/**
 * @class
 * This module is a sub-object of {@link TigerJS.xui} and create's rectangular SVG boxes for text;
 * @param {Object} configurationOptions  An object contaning configuration parameters 
 * for xui_element
 * @param {HTMLElement | String} configurationOptions.container An html element or the 
 * string id of the element, to server as the container, normally this should have a transperent background
 * for the xui element
 * @param {String} configurationOptions.xui_theme The the style to use for the xui element<br/>
 * <pre>
 *       could be any of xui_blue, xui_red, xui_green, xui_orange, 
 *       could be any of xui_blue_active, xui_red_active, xui_green_active, xui_orange_active,
 *        or just he empty string for defaults
 * </pre>      
 * @param {String} configurationOptions.content The text content for this xui element
 * @param {Boolean} configurationOptions.animateRender Are we to animate the rendering process, defaults to true
 * @param {String} configurationOptions.textAlign How to align the text, Left/Middle/Center
 * @param {Boolean} [configurationOptions.noFill = false] Do not apply a fill to the widget
 * @param {CSSUnit} [configurationOptions.textFontSize = .8em] The font-size of the text
 * @param {CSSUnit} [configurationOptions.textFontFace = Lucida Console, Monaco, monospace] The font-family
 * 
 * @param {CSSUnit} [configurationOptions.noBorder = false] If this widget shouldnt have borders
 * 
 *  @returns Object 
 *  Returns an Object with the following methods
 *  <pre>
 *  ::hide() //hides the SVG Element
 *  ::show() //shows the SVG Element
 *  ::updateText() //update the text of been displayed, takes the new string as argument
 *  </pre>
 *   @extends TigerJS.xui
 */

TigerJS.xui.xuiText = function (configurationOptions) {

    return T.aggregate(T.xui, {//return an object that applies the base object (mixes-in) 
//into this object

        pre_build: function () {
//here we just calculate the final width/height and x/y locations for this elements
//for any given container size
            this.xuiWidth = this.xui_dom_container_dimensions.width;
            this.xuiHeight = this.xui_dom_container_dimensions.height;

            this.SVGDOM.setAttribute("width", "100%"); //set some attrs on the main SVG element
            this.SVGDOM.setAttribute("height", "100%");


            //create the path element for this text box
            this.stdTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            this.stdTextPath.id = T.Hash.CRC32(this.xui_dom_container.id);

            //setup theming
            this.SVGDOM.setAttribute("class", "xui_default " + this.xui_theme + "_theme"); //add the selected user theme, plus the default

            this.SVGDOM.appendChild(this.stdTextPath);
            if (this.configObj.noFill) {
                this.stdTextPath.style.setProperty("fill-opacity", 0, "important");
            }
            return this;
        },
        render: function () {

            if (!this.configObj.noBorder) {
                if (this.animateRender)
                    this.__animateDrawingSequence();
                else
                    this.__staticDrawingSequence();
                return this;
            } else {

                return this.post_build();
            }
        },
        post_build: function () {

            //the only post build step we'll perform for the xuiText Element
            //is inserting the text content if any
            //create the text node, we'll be using HTML text not SVG for maximum flexibility
            this.txtDataNode = T.$(document.createElement("SPAN"));
            this.xui_dom_container.appendChild(this.txtDataNode);

            this.txtDataNode.setStyle({
                display: "inline-block",
                width: "92%",
                position: "absolute",
                left: "0px",
                opacity: 1.0,
                textOverflow: "clip",
                fontFamily: this.configObj.textFontFace || "Lucida Console, Monaco, monospace",
                overflow: "hidden",
                fontSize: this.configObj.textFontSize || ".85em",
                wordWrap: "break-word",
                textAlign: this.configObj.textAlign || "center",
                fontWeight: "bold",
                lineHeight: "1em"

            });

            this.stringData = this.configObj.content || "";

            if (this.animateRender) {

                this.stringData.drizzle(this.stringData, this.txtDataNode, true);

            } else {

                this.txtDataNode.innerHTML = this.stringData;

                this.txtDataNode.style.top = (this.xuiHeight - this.txtDataNode.offsetHeight) * .5 + "px";
                this.txtDataNode.style.left = (this.xuiWidth - this.txtDataNode.offsetWidth) * .5 + "px";
            }

            this.configObj.onRender();

            return this;
        },
        __animateDrawingSequence: function () {

            //here we animate the rendereng of the T.xui.stdText
            var pathEl = this.stdTextPath;
            this.a = b = 0; //MoveTo 
            this.w = this.xuiWidth;
            this.h = this.xuiHeight;


            //temporary disable fill, till the path is drawn
            pathEl.style.fill = "none";
            this.i = this.j = this.k = this.l = this.m = this.n = this.p = 0;
            this.o = -2;
            pathEl.setAttribute("d", "M " + this.i + " " + this.j); //initial MoveTo


            this.draw(); //helper for __animateDrawingSequence, we do the actual drawing here

        },
        draw: function () {
            var pathEl = this.stdTextPath;

            if (this.k < this.w) { //LineTo to complete top width of rect 
                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l);

                this.k += 10;

                //we accidently wen over the bounds
                if (this.k > this.w) {

                    this.k = this.w;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l);
                    setTimeout(this.draw.bind(this), 10);
                    return;
                }

                setTimeout(this.draw.bind(this), 10); //the bind is needed, else the function would be called without no context
                return;

            }
            if (this.n < this.h) {//Vertical line to complete right side of rect
                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n);

                this.n += 10;

                //need some boundary clipping here
                if (this.n > this.h) {
                    this.n = this.h;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n);
                    setTimeout(this.draw.bind(this), 10);
                    return;
                }
                setTimeout(this.draw.bind(this), 10);
                return;

            }

            if (this.o > -this.w) {// Horizontal line leftwards (i.e back to starting point) for bottom line of rect


                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o);
                this.o -= 10;

                //need some boundary clipping here
                if (this.o <= -this.w) {
                    this.o = -this.w;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o);
                    setTimeout(this.draw.bind(this), 10);

                    this.p = this.h - 10;
                    return;
                }
                setTimeout(this.draw.bind(this), 10);
                return;

            }
            if (this.p > 0) {//Line to close path back to xy(0,0) or initial points

                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o + " L 0 " + this.p);

                this.p -= 10;

                //need some boundary clipping here
                if (this.p <= 0) {

                    this.p = 0;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o + " v " + this.p + " z");

                    //this is the last draw so no setimeout is needed
                    //setTimeout(draw, 10);


                    //reset the classes on the path so fill colors can be applied
                    pathEl.setAttribute("class", "xui_default " + this.xui_theme + "_theme");

                    this.post_build();
                    return;
                }

                setTimeout(this.draw.bind(this), 10);
                return;

            }

        },

        __staticDrawingSequence: function () {

            //just draw the T.xui.stdText Statically
            //define the dimensions for this text-box path
            this.stdTextPath.dim = "M 0 0" + " l " + this.xuiWidth + " 0 " +
                    " v " + this.xuiHeight + " " +
                    "h " + -this.xuiWidth + " Z";
            this.stdTextPath.setAttribute("d", this.stdTextPath.dim);

            this.post_build(); //post build ops
        },

        //---------------------------------------------------------------------------
        //PUBLIC INTERFACE, Well they are pretty all public, but we'll only tell them about this
        hide: function () {
            this.SVGDOM.style.visibility = "hidden";
            return this;
        },
        show: function () {
            this.SVGDOM.style.visibility = "visible";
            return this;
        },
        updateText: function (data) {
            this.stringData = data;

            if (this.animateRender) {
                this.txtDataNode.innerHTML = "";
                this.stringData.drizzle(this.stringData, this.txtDataNode, true);

            } else {
                this.txtDataNode.innerHTML = "";
                this.txtDataNode.innerHTML = this.stringData;
            }

        }


    },
            true,
            configurationOptions//this would be used to initialize the main T.xui object
            ).pre_build().render(); //from the returned object, call the methods to show and build up the svg element

};