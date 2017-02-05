/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2017 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */


/**
 * @class
 * This module is a sub-object of {@link TigerJS.xui}. This HUD-style text box, has borders only on one side
 * @param {Object} configurationOptions  An object contaning configuration parameters 
 * for xui_element
 * @param {HTMLElement | String} configurationOptions.container An html element or the 
 * string id of the element, to server as the container, normally this should have a transperent background
 * for the xui element
 * @param {String} configurationOptions.xui_theme The the style to use for the xui element<br/>
 * <pre>
 *       could be any of xui_blue, xui_red, xui_green, xui_orange, 
 *        or just he empty string for defaults
 * </pre>   
 * @param {String} configurationOptions.content The text content for this xui element
 * @param {Boolean} configurationOptions.animateRender Are we to animate the rendering process, defaults to true
 * @param {CSSUnit} [configurationOptions.textFontSize = .8em] The font-size of the text
 * @param {CSSUnit} [configurationOptions.textFontFace = Lucida Console, Monaco, monospace] The font-family
 * @param {CSSUnit} [configurationOptions.noBorder = false] If this widget shouldnt have borders
 * 
 *  @returns Object 
 *  Returns an Object with the following methods
 *  <pre>
 *  ::hide() //hides the SVG Element
 *  ::show() //shows the SVG Element
 *  ::updateText() //update the text of been displayed, takes the new string as argument
 *  </pre>
 * @extends TigerJS.xui
 
 */

TigerJS.xui.xuiTextc = function (configurationOptions) {


    return T.aggregate(T.xui, {//return an object that applies the base object (mixes-in) 
//into this object

        pre_build: function () {

//here we just calculate the final width/height and x/y locations for this elements
//for any given container size
            this.xuiWidth = this.xui_dom_container_dimensions.width;
            this.xuiHeight = this.xui_dom_container_dimensions.height;

            this.SVGDOM.setAttribute("width", "15%"); //set some attrs on the main SVG element
            this.SVGDOM.setAttribute("height", "100%");


            //create the path element for this text box
            this.stdTextPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            this.stdTextPath.id = T.Hash.CRC32(this.xui_dom_container.id);



            //setup theming, the CSS for this widget type needs some more
            //involved setup
            this.themed = "";
            var theme_options = ["blue", "red", "green", "orange", "white"];
            for (var i = 0; i < theme_options.length; i++) {
                if (this.xui_theme.indexOf(theme_options[i]) > -1)
                    this.themed = "xui_" + theme_options[i] + "__textc_theme"; //put the right prefix used in the CSS class
            }


            this.xui_dom_container.className = this.themed + "_default";
            this.SVGDOM.setAttribute("class", this.themed + "_default");


            this.stdTextPath.setAttribute("class", this.themed); //iner stroke
           
            this.SVGDOM.appendChild(this.stdTextPath);

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
                this.SVGDOM.setAttribute("width", "0%")
                return this.post_build();
                ; //no SVG border would be drawn so dont take up space with an invicible element
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
                width: this.configObj.noBorder ? "98%" :"83%",
                height: "100%",
                position: "absolute",
                left: this.configObj.noBorder ? "1%" : "12%",
                top: "0px",
                textOverflow: "clip",
                overflow: "hidden",
                wordWrap: "break-word",
                textAlign: "left",
                 fontFamily: this.configObj.textFontFace || "Lucida Console, Monaco, monospace",
                fontSize: this.configObj.textFontSize || ".85em",
                fontWeight: "bold",
                lineHeight: "1em"

            });
            this.txtDataNode.style.setProperty("opacity", 1.0, "important");

            this.stringData = this.configObj.content || "lorem ipsum";

            if (this.animateRender) {

                this.stringData.drizzle(this.stringData, this.txtDataNode);

            } else {

                this.txtDataNode.innerHTML = this.stringData;
                

            }

            if (this.configObj.onRender && T.isFunction(this.configObj.onRender))
                this.configObj.onRender();

            return this;
        },
        __animateDrawingSequence: function () {

            this.w = this.xuiWidth;
            this.h = this.xuiHeight;
            this.verticalLineLimit = 5;
            this.verticalLineStart = this.h;
            this.horizontalLineStart = 0;


            this.stdTextPath.dim = "M 0 " + this.h;//initial x,y
            this.stdTextPath.setAttribute("d", this.stdTextPath.dim);

            this.draw(); //helper for __animateDrawingSequence, we do the actual drawing here

        },
        draw: function () {
            var pathEl = this.stdTextPath;


            if (this.verticalLineStart > this.verticalLineLimit) {
                pathEl.setAttribute("d", "M 0 " + this.h + " V " + this.verticalLineStart);

                this.verticalLineStart -= 10;
                //need some boundary clipping here
                if (this.verticalLineStart <= this.verticalLineLimit) {
                    this.verticalLineStart = this.verticalLineLimit;
                    pathEl.setAttribute("d", "M 0 " + this.h + " V " + this.verticalLineStart);

                    setTimeout(this.draw.bind(this), 15);
                    return;
                }

                setTimeout(this.draw.bind(this), 15);
                return;

            }
            if (this.horizontalLineStart < this.xuiWidth * .10) {
                pathEl.setAttribute("d", "M 0 " + this.h + " V " + this.verticalLineStart + " L" + this.horizontalLineStart + " 5 ");

                this.horizontalLineStart += 2;
                //need some boundary clipping here
                if (this.horizontalLineStart >= this.xuiWidth * .10) {
                    this.horizontalLineStart = this.xuiWidth * .10;
                    pathEl.setAttribute("d", "M 0 " + this.h + " V " + this.verticalLineStart + " L" + this.horizontalLineStart + " 5 ");

                    this.post_build();
                    return;
                }

                setTimeout(this.draw.bind(this), 15);
                return;

            }
        },

        __staticDrawingSequence: function () {
            this.stdTextPath.dim = "M 0 " + this.xuiHeight + " V 5  L" + this.xuiWidth * .10 + " 5 ";

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