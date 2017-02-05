/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2016 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */


/**
 * @class
 * This sub-object of {@link TigerJS.xui} is a generic XUI type container element that can be used
 * to hold other XUI style elements including the various xuiText.. variants, images and other DOM content
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
 * @param {Boolean} [configurationOptions.noFill = false] Should we disable the background fill on the element
 * @param {String} configurationOptions.textAlign How to align the text, Left/Middle/Center
 * @param {CSSUnit} [configurationOptions.textFontSize = .8em] The font-size of the text
 *
 *  @returns Object 
 *  Returns an Object with the following methods, each of the methods
 *  returns an Instance of the Objecupport chaining
 *  <pre>
 *  ::hide() //hides the SVG Element
 *  ::show() //shows the SVG Element
 *  
 *  //add an image to this container at the uri, and with the x/y/width/height attributes
 *  //the border is a boolean specifying if the image should have a border or not
 *  ::addImage(uri, border, x, y, width, height, id); 
 *  
 *  //Add a container for HTML content, returns a reference to the container element
 *  :: addHTMLContainer( x, y, width, height, id) :: HTMLDivElement; 
 *  
 *   //similar to above but adds a text element
 *  //the textWidgetType parameter takes the values 1-4, representing the four different predefined XUI text widgets  
 *  :: addText ( theme, x, y, width, height, textContent, textWidgetType, noFill,noBorder, id);
 *   
 *  //clear all elements within this container
 *   :: clear();
 *   
 *       //adds asn xuiCircle element to this container
 *   :: addCircle (theme, x, y, radius, ImgUrl, id);
 *   
 *   //all child elements added into the container are positioned absolutely
 *                                                                                                                     
 *  </pre>
 *   @extends TigerJS.xui
 
 */

TigerJS.xui.xuiContainerb = function (configurationOptions) {

    return T.aggregate(T.xui, {//return an object that applies the base object (mixes-in) 
//into this object

        pre_build: function () {
            this.xuiWidth = this.xui_dom_container_dimensions.width;
            this.xuiHeight = this.xui_dom_container_dimensions.height;
            this.SVGDOM.setAttribute("width", this.xuiWidth + "px"); //set some attrs on the main SVG element
            this.SVGDOM.setAttribute("height", this.xuiHeight + "px");
            this.SVGDOM.style.position = "absolute";

            //create the path element for this container UI element
            this.stdPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            this.stdPath.id = T.Hash.CRC32(this.xui_dom_container.id);

            //setup theming
            this.SVGDOM.setAttribute("class", "xui_default " + this.xui_theme.replace("_active", "") + "_theme " + " "); //add the selected user theme, plus the default

            this.SVGDOM.style.setProperty("fill-opacity", !!this.configObj.noFill ? 0 : .6);
            this.stdPath.style.setProperty("stroke-width", 2);
            this.SVGDOM.appendChild(this.stdPath);
            this.renderComplete = 0;
            this.attachedElements = T.Iterator();//we'll add elements that have been attached to this conatainer here
            return this;
        },
        render: function () {

            if (this.animateRender)
                return this.__animateDrawingSequence();
            else {

                return this.__staticDrawingSequence();

            }
        },
        post_build: function () {
            this.renderComplete = 1;


            return this;
        },
        __animateDrawingSequence: function () {


            //here we animate the rendereng of the T.xui.stdText
            var pathEl = this.stdPath;
            this.a = b = 0; //MoveTo 
            this.w = this.xuiWidth;
            this.h = this.xuiHeight;


            //temporary disable fill, till the path is drawn
            this.SVGDOM.style.setProperty("fill-opacity", 0);
            this.i = this.j = this.k = this.l = this.m = this.n = this.p = 0;
            this.o = -2;

            pathEl.setAttribute("d", "M " + this.i + " " + this.j); //initial MoveTo


            return this.draw(); //helper for __animateDrawingSequence, we do the actual drawing here


        },

        draw: function () {

            var pathEl = this.stdPath;

            if (this.k < this.w) { //LineTo to complete top width of rect 
                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l);

                this.k += 12;

                //we accidently wen over the bounds
                if (this.k > this.w) {

                    this.k = this.w;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l);
                    setTimeout(this.draw.bind(this), 5);
                    return this;
                }

                setTimeout(this.draw.bind(this), 5); //the bind is needed, else the function would be called without no context
                return this;

            }
            if (this.n < this.h) {//Vertical line to complete right side of rect
                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n);

                this.n += 20;

                //need some boundary clipping here
                if (this.n > this.h) {
                    this.n = this.h;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n);
                    setTimeout(this.draw.bind(this), 5);
                    return this;
                }
                setTimeout(this.draw.bind(this), 5);
                return this;

            }

            if (this.o > -this.w) {// Horizontal line leftwards (i.e back to starting point) for bottom line of rect


                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o);
                this.o -= 20;

                //need some boundary clipping here
                if (this.o <= -this.w) {
                    this.o = -this.w;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o);
                    setTimeout(this.draw.bind(this), 5);

                    this.p = this.h - 10;
                    return this;
                }
                setTimeout(this.draw.bind(this), 5);
                return this;

            }
            if (this.p > 0) {//Line to close path back to xy(0,0) or initial points

                pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o + " L 0 " + this.p);

                this.p -= 20;

                //need some boundary clipping here
                if (this.p <= 0) {

                    this.p = 0;
                    pathEl.setAttribute("d", "M " + this.i + " " + this.j + " l " + this.k + " " + this.l + " v " + this.n + " h " + this.o + " v " + this.p + " z");

                    //this is the last draw so no setimeout is needed
                    //setTimeout(draw, 10);


                    //reset the fill colors 
                    this.SVGDOM.style.setProperty("fill-opacity", !!this.configObj.noFill ? 0 : 1);


                    return this.post_build();

                }

                setTimeout(this.draw.bind(this), 5);
                return this;
            }
        },
        __staticDrawingSequence: function () {

            //just draw the T.xui.stdText Statically
            //define the dimensions for this text-box path
            this.stdPath.dim = "M 0 0" + " l " + this.xuiWidth + " 0 " +
                    " v " + this.xuiHeight + " " +
                    "h " + -this.xuiWidth + " Z";
            this.stdPath.setAttribute("d", this.stdPath.dim);
            return this.post_build();

        },

        //---------------------------------------------------------------------------
        //PUBLIC INTERFACE, Well they are pretty all public, but we'll only tell them about this
        hide: function () {
            this.SVGDOM.style.visibility = "hidden";
            return this;
        },
        clear: function () {

            this.attachedElements.foward_iterator(function (x) {

                x.destroy();
            });
            return this;
        },
        show: function () {
            this.SVGDOM.style.visibility = "visible";
            return this;
        },
        addImage: function (uri, border, x, y, width, height, id) {

            if (this.renderComplete !== 1) {
                setTimeout(this.addImage.bind(this, uri, border, x, y, width, height, id), 200);
                return this;
            }

            //create a container for the image
            var imageContainer = T.$(document.createElement("DIV"));
            imageContainer.setStyle({
                position: "absolute",
                top: y,
                left: x,
                width: width,
                height: height,
                zIndex: 3,
                opacity: 0,
                backgroundImage: "url(" + uri + ")",
                backgroundRepeat: "no-repeat",
                backgroundSize: width + " " + height,
                border: !!border ? "solid 1px #fff" : "none"
            });
            imageContainer.id = id || "";


            this.attachedElements.add(imageContainer);

            this.xui_dom_container.appendChild(imageContainer);
            T.UI.FX.Animation({
                el: imageContainer, time: .5, name: "slidein-top"
            });
            return this;
        },
        addHTMLContainer: function (x, y, width, height, id) {

            if (this.renderComplete !== 1) {
                setTimeout(this.addHTMLContainer.bind(this, x, y, width, height, id), 200);
                return this;
            }

            //create a container for the image
            var htmlContainer = T.$(document.createElement("DIV"));
            htmlContainer.setStyle({
                position: "absolute",
                top: y,
                left: x,
                width: width,
                height: height,
                zIndex: 3,
                backgroundColor: "#fff"
            });
            htmlContainer.id = id || "";

            this.attachedElements.add(htmlContainer);

            this.xui_dom_container.appendChild(htmlContainer);
            return htmlContainer;
        },

        //see the {@link TigerJS.xui.xuiCircle} documentation 
        addCircle: function (theme, x, y, radius, ImgUrl, id) {

            if (this.renderComplete !== 1) {
                setTimeout(this.addCircle.bind(this, theme, x, y, radius, ImgUrl, id), 200);
                return this;
            }

            //create a container for the image
            var circleContainer = T.$(document.createElement("DIV"));
            circleContainer.setStyle({
                top: y,
                left: x,
                width: radius,
                height: radius
            });

            this.xui_dom_container.appendChild(circleContainer);

            this.circleSVG = T.xui.xuiCircle({
                xui_theme: theme || "xui_white",
                container: circleContainer,
                animateRender: this.animateRender,
                clipImgUrl: ImgUrl || null
            });
            circleContainer.id = id || "";

            this.attachedElements.add(circleContainer);


            circleContainer.style.setProperty("position", "absolute", "important")
            return this;
        },
        addText: function (theme, x, y, width, height, textContent, textWidgetType, textAlign, noFill, noBorder, id) {

            if (this.renderComplete !== 1) {
                setTimeout(this.addText.bind(this, theme, x, y, width, height, textContent, textWidgetType, textAlign, noFill, noBorder, id), 200);
                return this;
            }
            //create a container for the text
            var customTextContainer = T.$(document.createElement("DIV"));
            customTextContainer.setStyle({
                top: y,
                left: x,
                width: width,
                height: height
            });
            customTextContainer.id = id || "";

            this.attachedElements.add(customTextContainer);


            this.xui_dom_container.appendChild(customTextContainer);

            var textBox;
            switch (textWidgetType) {
                case 1:

                    textBox = T.xui.xuiText({
                        xui_theme: theme,
                        container: customTextContainer,
                        content: textContent,
                        animateRender: this.animateRender,
                        noFill: !!noFill ? true : false,
                        noBorder: !!noBorder ? true : false,
                        textAlign: textAlign || "left"
                    });
                    break;
                case 2:

                    textBox = T.xui.xuiTextb({
                        xui_theme: theme,
                        container: customTextContainer,
                        content: textContent,
                        animateRender: this.animateRender,
                        noFill: !!noFill ? true : false,
                        noBorder: !!noBorder ? true : false,
                        textAlign: textAlign || "left"
                    });
                    break;
                case 3:

                    textBox = T.xui.xuiTextc({
                        xui_theme: theme,
                        container: customTextContainer,
                        content: textContent,
                        animateRender: this.animateRender,
                        noFill: !!noFill ? true : false,
                        noBorder: !!noBorder ? true : false,
                        textAlign: textAlign || "left"
                    });
                    break;
                case 4:

                    textBox = T.xui.xuiTextd({
                        xui_theme: theme,
                        container: customTextContainer,
                        content: textContent,
                        animateRender: this.animateRender,
                        noFill: !!noFill ? true : false,
                        noBorder: !!noBorder ? true : false,
                        textAlign: textAlign || "left"
                    });
                    break;
            }
            customTextContainer.style.setProperty("position", "absolute", "important")
            return this;
        }
    }, true,
            configurationOptions//this would be used to initialize the main T.xui object
            ).pre_build().render(); //from the returned object, call the methods to show and build up the svg element

};