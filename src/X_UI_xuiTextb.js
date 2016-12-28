/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2016 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */


/**
 * @class
 * This sub-object of {@link TigerJS.xui} just creates rectangular boxes for text;
 * @param {Object} configurationOptions  An object contaning configuration parameters 
 * for xui_element
 * @param {HTMLElement | String} configurationOptions.container An html element or the 
 * string id of the element, to server as the container, normally this should have a transperent background
 * for the xui element
 * @param {String} configurationOptions.xui_theme The the style to use for the xui element<br/>
 * <pre>
 *       could be any of xui_blue, xui_red, xui_green, xui_orange, or just he empty string for defaults
 * </pre>      
 * @param {String} configurationOptions.content The text content for this xui element
 * @param {Boolean} configurationOptions.animateRender Are we to animate the rendering process, defaults to true
 * @param {String} configurationOptions.textAlign How to align the text, Left/Middle/Center
 * @param {CSSUnit} [configurationOptions.textFontSize = .8em] The font-size of the text
 *  * @extends TigerJS.xui
 *  @returns Object 
 *  Returns an Object with the following methods
 *  <pre>
 *  ::hide() //hides the SVG Element
 *  ::show() //shows the SVG Element
 *  ::updateText() //update the text of been displayed, takes the new string as argument
 *  </pre>
 */

TigerJS.xui.xuiTextb = function (configurationOptions) {

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
            this.stdTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            this.stdTextPath.id = T.Hash.CRC32(this.xui_dom_container.id);

            //setup theming
            this.SVGDOM.setAttribute("class", "xui_default " + this.xui_theme + "_theme"); //add the selected user theme, plus the default

            this.SVGDOM.appendChild(this.stdTextPath);
            return this;
        },
        render: function () {

            if (this.animateRender)
                this.__animateDrawingSequence();
            else
                this.__staticDrawingSequence();
            return this;
        },
        post_build: function () {

            //the only post build step we'll perform for the xuiText Element
            //is inserting the text content if any
            //create the text node, we'll be using HTML text not SVG for maximum flexibility
            this.txtDataNode = T.$(document.createElement("SPAN"));
            this.xui_dom_container.appendChild(this.txtDataNode);
            this.txtDataNode.setStyle({
                display: "inline-block",
                width: "90%",
                position: "absolute",
                left: "4px",
                top: "0px",
                textOverflow: "clip",
                overflow: "hidden",
                wordWrap: "break-word",
                textAlign: this.configObj.textAlign || "center",
                //this should simulate a vertical-align:middle
                marginTop : (this.xuiHeight-this.txtDataNode.rect().height)*.45 +"px",
                fontFamily:"Lucida Console, Monaco, monospace",
            });

            this.stringData = this.configObj.content || "lorem ipsum";

            if (this.animateRender) {

                this.stringData.drizzle(this.stringData, this.txtDataNode);
            } else {
                this.txtDataNode.innerHTML = this.stringData;
            }

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
                    setTimeout(this.draw.bind(this), 15);
                    return;
                }

                setTimeout(this.draw.bind(this), 15); //the bind is needed, else the function would be called without no context
                return;

            }
            if (this.n < this.h) {//Vertical line to complete right side of rect
                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n);

                this.n += 10;

                //need some boundary clipping here
                if (this.n > this.h) {
                    this.n = this.h;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n);
                    setTimeout(this.draw.bind(this), 15);
                    return;
                }
                setTimeout(this.draw.bind(this), 15);
                return;

            }

            if (this.o > -this.w) {// Horizontal line leftwards (i.e back to starting point) for bottom line of rect


                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o);
                this.o -= 10;

                //need some boundary clipping here
                if (this.o < -this.w) {
                    this.o = -this.w;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o);
                    setTimeout(this.draw.bind(this), 15);
                    return;
                }
                setTimeout(this.draw.bind(this), 15);
                return;

            }
            if (this.p > -this.h) {//Line to close path back to xy(0,0) or initial points

                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o + " v " + this.p);

                this.p -= 10;

                //need some boundary clipping here
                if (this.p <= -this.h) {
                    this.p = -this.h;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o + " v " + this.p + " z");

                    //this is the last draw so no setimeout is needed
                    //setTimeout(draw, 10);


                    //reset the classes on the path so fill colors can be applied
                    pathEl.setAttribute("class", "xui_default " + this.xui_theme + "_theme");

                    this.post_build();
                    return;
                }

                setTimeout(this.draw.bind(this), 15);
                return;

            }

        },

        __staticDrawingSequence: function () {

            //just draw the T.xui.stdText Statically
            //define the dimensions for this text-box polygon
            this.stdTextPath.dim = "0,0 " + this.xuiWidth * .90 + ",0 " +
                    this.xuiWidth + ","+this.xuiHeight*.20+" "+
                    this.xuiWidth + ","+this.xuiHeight+" "+
                    this.xuiWidth*.10 + ","+this.xuiHeight+ " "+
                    "0,"+this.xuiHeight *.80;
                    

            this.stdTextPath.setAttribute("points", this.stdTextPath.dim);

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
                this.stringData.drizzle(this.stringData, this.txtDataNode);

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