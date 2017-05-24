/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2016 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */


/**
 * @class
 * This sub-object of {@link TigerJS.xui} creates lines, either vertically or horizontally;
 * @param {Object} configurationOptions  An object contaning configuration parameters 
 * for xui_element
 * @param {HTMLElement | String} configurationOptions.container An html element or the 
 * string id of the element, to server as the container, normally this should have a transperent background
 * for the xui element
 * @param {String} configurationOptions.xui_theme The the style to use for the xui element<br/>
 
 * <pre>
 *       could be any of xui_blue, xui_red, xui_green, xui_orange
 *       
 * </pre>  
 * @param {Number} configurationOptions.strokeWidth The thickness of the line in pixels
 * @param {CSSUnit} [configurationOptions.length = 100%]The length of the line
 * @param {Boolean} configurationOptions.animateRender Are we to animate the rendering process, defaults to true
 * @param {String} configurationOptions.orientation Horizontal or verticallly drawn line, use H or V to indicate
 *
 *  @returns Object 
 *  Returns an Object with the following methods
 *  <pre>
 *  ::hide() //hides the SVG Element
 *  ::show() //shows the SVG Element
 *  </pre>
 *   @extends TigerJS.xui
 
 */

TigerJS.xui.xuiLine = function (configurationOptions) {

    return T.aggregate(T.xui, {//return an object that applies the base object (mixes-in) 
//into this object

        pre_build: function () {
//here we just calculate the final width/height and x/y locations for this elements
//for any given container size

            //the length should be based on whether the line is horizontal or vertical
            this._length = this.configObj.orientation && this.configObj.orientation == "V" ?
                    this.xui_dom_container_dimensions.height : this.xui_dom_container_dimensions.width;

            if (this.configObj.length)
                this._length = this.configObj.length;//if they sent in a custom length

            //set the width and stroke
            if (this.configObj.orientation && this.configObj.orientation == "V") { //horizaltal orientation
                //vertical orientation
                this.stroke = this.configObj.strokeWidth || this.xui_dom_container_dimensions.width;
                this.SVGDOM.setAttribute("width", this.stroke)//set some attrs on the main SVG element
                this.SVGDOM.setAttribute("height", this._length);
            } else {
                this.stroke = this.configObj.strokeWidth || this.xui_dom_container_dimensions.height;
                this.SVGDOM.setAttribute("width", this._length); //set some attrs on the main SVG element
                this.SVGDOM.setAttribute("height", this.stroke);
            }


            //create the path element for this text box
            this.stdTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            this.stdTextPath.id = T.Hash.CRC32(this.xui_dom_container.id);



            //setup theming, the CSS for this widget type needs some more
            //involved setup
            this.themed = "";
            var theme_options = ["blue", "red", "green", "orange"];
            for (var i = 0; i < theme_options.length; i++) {
                if (this.xui_theme.indexOf(theme_options[i]) > -1)
                    this.themed = "xui_" + theme_options[i] + "__textc_theme"; //put the right prefix used in the CSS class
            }


            this.stdTextPath.setAttribute("class", this.themed);
            this.stdTextPath.style.strokeWidth = this.stroke;
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


             if (this.configObj.onRender && T.isFunction(this.configObj.onRender))
                this.configObj.onRender();
            return this;
        },
        __animateDrawingSequence: function () {

            this._line_start_point = 0;
            this.draw();

        },
        draw: function () {
           
            if (this.configObj.orientation && this.configObj.orientation === "V") { //vertical orientation

                if (this._line_start_point < this._length) {
                    this.stdTextPath.setAttribute("d", "M 0 0" + " V" + (this._line_start_point+=10));
                    setTimeout(this.draw.bind(this), 15);
                    return;

                }
                if (this._line_start_point >= this._length) {
                    this.stdTextPath.setAttribute("d","M 0 0" + " V" + this._length);
                    this.post_build(); //post build ops
                    return;
                }

            } else {//horizontal orientation

               if (this._line_start_point < this._length) {
                   this.stdTextPath.setAttribute("d","M 0 0" + " H" + (this._line_start_point+=10));
                    setTimeout(this.draw.bind(this), 15);
                    return;

                }
                if (this._line_start_point >= this._length) {
                    this.stdTextPath.setAttribute("d", "M 0 0" + " H" + this._length);
                    this.post_build(); //post build ops
                    return;
                }
            }


        },

        __staticDrawingSequence: function () {
            if (this.configObj.orientation && this.configObj.orientation === "V") { //vertical orientation

                this.stdTextPath.dim = "M 0 0" + " V" + this._length;

            } else {
                this.stdTextPath.dim = "M 0 0" + " H " + this._length;

            }

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
        }
    },
            true,
            configurationOptions).pre_build().render();


};