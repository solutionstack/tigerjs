/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2017 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */


/**
 * @class
 * This sub-object of {@link TigerJS.xui} Draws a Circle int an HTML container element, please ensure
 * the dimensions for the container element are equal to ensure a perfect circle
 * @param {Object} configurationOptions  An object contaning configuration parameters 
 * for xui_element
 * @param {HTMLElement | String} configurationOptions.container An html element or the 
 * string id of the element, to+ server as the container, normally this should have a transperent background
 * for the xui element
 * @param {String} configurationOptions.xui_theme The the style to use for the xui element<br/>
 * <pre>
 *       could be any of xui_blue, xui_red, xui_green, xui_orange, 
 *       or just he empty string for defaults
 * </pre>   
 * @param {Boolean} configurationOptions.animateRender Are we to animate the rendering process, defaults to true
 * @param {URL} configurationOptions.clipImgUrl A url that points to an Image to clip to this Circle
 *  @returns Object 
 *  Returns an Object with the following methods
 *  <pre>
 *  ::hide() //hides the SVG Element
 *  ::show() //shows the SVG Element
 *  </pre>
 * @extends TigerJS.xui
 
 */

TigerJS.xui.xuiCircle = function (configurationOptions) {

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
            //setup theming, the CSS for this widget type needs some more
            //involved setup
            this.themed = "";
            var theme_options = ["blue", "red", "green", "orange"];
            for (var i = 0; i < theme_options.length; i++) {
                if (this.xui_theme.indexOf(theme_options[i]) > -1)
                    this.themed = "xui_" + theme_options[i] + "_theme"; //put the right prefix used in the CSS class
            }

            this.xui_dom_container.className = this.themed + "_default";
            this.SVGDOM.setAttribute("class", this.themed + "_default");
            this.stdTextPath.setAttribute("class", this.themed); //iner stroke
            this.SVGDOM.appendChild(this.stdTextPath);

            //if they want to cli[ an external image into the SVG circular path
            //we create the clip path and load the image early
            if (this.configObj.clipImgUrl) { // they want to clip an image to this circular path

                // create the svg image
                this.imageToClip = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                this.imageToClip.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.configObj.clipImgUrl);
                this.SVGDOM.appendChild(this.imageToClip);
                this.imageToClip.setAttribute("width", this.xuiWidth);
                this.imageToClip.setAttribute("height", this.xuiHeight);
                this.imageToClip.setAttribute("style", "opacity:0");

                // create the svg clipPath element
                this.clipPathNode = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
                this.clipPathNode.id = T.Hash.sha224(this.xui_dom_container.id);
                this.SVGDOM.appendChild(this.clipPathNode);
                this.clipPathNodePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                this.clipPathNode.appendChild(this.clipPathNodePath);

                //add the curcular path data
                var center_x = Math.floor((this.xuiHeight) / 2);
                center_y = center_x,
                        radius = .85 * center_x; //we are reducing the radius of the clipping path by 5%
                // so the clipped image stays within the main path
                --center_x;
                --center_y;
                this.ctr = 0;
                point_x = Math.ceil(radius * Math.cos(this.ctr * 3.1415926 / 180.0) + center_x);
                point_y = Math.ceil(radius * Math.sin(this.ctr * 3.1415926 / 180.0) + center_y);
                for (; this.ctr <= 360; this.ctr++) {
                    point_x = Math.ceil(radius * Math.cos(this.ctr * 3.1415926 / 180.0) + center_x);
                    point_y = Math.ceil(radius * Math.sin(this.ctr * 3.1415926 / 180.0) + center_y);
                    if (this.ctr === 0) { //starting point, so move to starting point

                        this.clipPathNodePath.dim = " M" + point_x + " " + point_y;
                        this.clipPathNodePath.setAttribute("d", this.clipPathNodePath.dim);
                    } else {

                        this.clipPathNodePath.dim += " L" + point_x + " " + point_y;
                        this.clipPathNodePath.setAttribute("d", this.clipPathNodePath.dim);
                    }
                }

                this.imageToClip.setAttribute("clip-path", "url(#" + this.clipPathNode.id + ")");

                if (this.animateRender)
                    T.UI.FX.Animation({
                        el: this.imageToClip, //just pass the string id of the element or a DOM reference
                        name: "fadeIn", //the animation to set;
                        time: .8,
                        delay: .8

                    });
                else {
                    this.imageToClip.setAttribute("style", "opacity:1");
                }
            }





            return this;
        },
        render: function () {

            if (!this.configObj.noBorder) {
                if (this.animateRender)
                    return this.__animateDrawingSequence();
                else
                    return this.__staticDrawingSequence();

            }
        },
        post_build: function () {


            if (this.configObj.onRender && T.isFunction(this.configObj.onRender))
                this.configObj.onRender();
            return this;
        },
        __animateDrawingSequence: function () {

            this.ctr = 0;
            return this.draw();
        },
        draw: function () {

            //this assumes an equal width and height of the container
            var center_x = Math.floor(this.xuiHeight / 2),
                    center_y = center_x, radius = .95 * center_x;
            point_x = Math.floor(radius * Math.cos(this.ctr * 3.142857142857143 / 80.0) + center_x);
            point_y = Math.floor(radius * Math.sin(this.ctr * 3.142857142857143 / 80.0) + center_y);
            if (this.ctr === 0) { //starting point, so move to starting point

                this.stdTextPath.dim = " M" + point_x + " " + point_y;
                this.stdTextPath.setAttribute("d", this.stdTextPath.dim);
            } else {

                this.stdTextPath.dim += " L" + point_x + " " + point_y;
                this.stdTextPath.setAttribute("d", this.stdTextPath.dim);
            }
            if (this.ctr++ <= 360) {
                setTimeout(this.draw.bind(this), 2);
                return;
            }

            return this.post_build();
        },
        __staticDrawingSequence: function () {


            this.ctr = 0;
            var center_x = Math.floor(this.xuiHeight / 2),
                    center_y = center_x, radius =  .95 * center_x;
            for (; this.ctr <= 360; this.ctr++) {
                point_x = Math.floor(radius * Math.cos(this.ctr * 3.1415926 / 180.0) + center_x);
                point_y = Math.floor(radius * Math.sin(this.ctr * 3.1415926 / 180.0) + center_y);
                if (this.ctr === 0) { //starting point, so move to starting point

                    this.stdTextPath.dim = " M" + point_x + " " + point_y;
                    this.stdTextPath.setAttribute("d", this.stdTextPath.dim);
                } else {

                    this.stdTextPath.dim += " L" + point_x + " " + point_y;
                    this.stdTextPath.setAttribute("d", this.stdTextPath.dim);
                }
            }


            return this.post_build();
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
            configurationOptions//this would be used to initialize the main T.xui object
            ).pre_build().render(); //from the returned object, call the methods to show and build up the svg element

};