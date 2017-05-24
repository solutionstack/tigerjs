/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2017 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */


/**
 * @class
 * This module is a sub-object of {@link TigerJS.xui}. It creates a text box without any SVG border
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
 *  @returns Object 
 *  Returns an Object with the following methods
 *  <pre>
 *  ::hide() //hides the SVG Element
 *  ::show() //shows the SVG Element
 *  ::updateText() //update the text of been displayed, takes the new string as argument
 *  </pre>
 *   @extends TigerJS.xui
 */

TigerJS.xui.xuiTextd = function (configurationOptions) {


    return T.aggregate(T.xui, {//return an object that applies the base object (mixes-in) 
//into this object

        pre_build: function () {

//here we just calculate the final width/height and x/y locations for this elements
//for any given container size
            this.xuiWidth = this.xui_dom_container_dimensions.width;
            this.xuiHeight = this.xui_dom_container_dimensions.height;

            //setup theming, the CSS for this widget type needs some more
            //involved setup
            this.themed = "";
            var theme_options = ["blue", "red", "green", "orange", "white"];
            for (var i = 0; i < theme_options.length; i++) {
                if (this.xui_theme.indexOf(theme_options[i]) > -1)
                    this.themed = "xui_" + theme_options[i] + "__textc_theme"; //put the right prefix used in the CSS class
            }

            this.xui_dom_container.className = this.themed + "_default";
            this.xui_dom_container.removeChild(this.SVGDOM);

            return this;
        },
        render: function () {

            return this.post_build();
        },
        post_build: function () {

            //the only post build step we'll perform for the xuiText Element
            //is inserting the text content if any
            //create the text node, we'll be using HTML text not SVG for maximum flexibility
            this.txtDataNode = T.$(document.createElement("SPAN"));
            this.txtDataNode.id = "a" + T.Hash.CRC32(this.xui_dom_container.id);
            this.xui_dom_container.appendChild(this.txtDataNode);
            this.txtDataNode.setStyle({
                display: "inline-block",
                width: "98%",
                height: "98%",
                position: "absolute",
                left: "0px",
                top:"0px",
                textOverflow: "clip",
                overflow: "hidden",
                wordWrap: "break-word",
                textAlign: "left",
                 fontFamily: this.configObj.textFontFace || "Lucida Console, Monaco, monospace",
                fontSize: this.configObj.textFontSize || ".85em",
                fontWeight: "bold",
                lineHeight: "1.4em",
                padding:".5em"

            });
            this.xui_dom_container.style.setProperty("opacity", 1.0, "important");

            this.stringData = this.configObj.content || "lorem ipsum";
            this.txtDataNode.innerHTML = this.stringData;


            if (this.animateRender) {

                T.UI.FX.Animation({
                    el: this.txtDataNode, name: "slidein-top", time: 2, curve: "ease-out"
                })._onanimationend(this.callRenderComplete.bind(this));// set the renderComplete variable when the animation ends

            }
            return this;
        },
        callRenderComplete: function () {
            if (this.configObj.onRender && T.isFunction(this.configObj.onRender))
                this.configObj.onRender();

        },
        __animateDrawingSequence: function () {


        },
        draw: function () {

        },

        __staticDrawingSequence: function () {

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
                this.txtDataNode.innerHTML = this.stringData;

                T.UI.FX.Animation({
                    el: this.txtDataNode, name: "slidein-top", time: 2, curve: "ease-out"
                })._onanimationend(this.callRenderComplete.bind(this));// set the renderComplete variable when the animation ends



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