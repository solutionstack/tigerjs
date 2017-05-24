/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2016 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */

/** LOG: started work here Monday, Dec 26, 2016, Current-Location: Ring-Road, IB **/
/**
 * @class
 * This class serves as a base object for all XUI widgets. So you do not use it directly.
 * Use one of the TigerJS.xui.xxx... sub-objects instead
 * @description After been fasicated for years by various futuristic UX/HUD concepts especially from Sci-fi flicks,
 * combined with the fact that regular HTML/CSS based UI's just gets more boring to me, I decided to see if
 * I could create basic HUD stye elements using web technology. The web seems to be ripe for such
 * and technologies like WebGL holds a lot of promise in that direction but for now i'll be starting attempting this majorly
 * with SVG and see how things flow from there, while this is defineitely an experimental module,
 * i'll try and keep all features stable so it doesnt break from version to version. :)
 * Current goals is just to be able to display such HUD UI elements to create decent displays, so
 *  don't expect Iron-Man level Tactile feedback just yet,.. but hopefully in time
 * @param {Object} configObj An object contaning configuration parameters for the base object
 * @param {Function} configObj.onRender A userCallBack to be called when rendering is complete
 */

TigerJS.xui = function (configObj) {
    this.configObj = T.clone(configObj);

    this.xui_dom_container = configObj.container ? T.$(configObj.container) : null;
    this.xui_dom_container.style.setProperty("position", "absolute", "important")
            ;
    if (!this.xui_dom_container) {
        err_str = " BadArgumentError<> Configuration for an xui instance doesn't have a valid DOM container referenced";
        throw new Error(err_str);
    }
    this.xui_dom_container.className += " xui_default";//give a little styling to the container

    this.xui_theme = configObj.xui_theme || "";

    this.xui_dom_container_dimensions = this.xui_dom_container.rect();//the dimensions of the container element
    this.animateRender = T.type(configObj.animateRender) === "Boolean" ? configObj.animateRender : true;//default to render the xui element wth nice animations



    //create the base SVG DOM Object for this xui instance
    this.SVGDOM = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.SVGDOM.id = "a"+T.Hash.sha1(this.xui_dom_container.id); //i put an a, incase the hash starts with a nuumber
                                        //as id's starting with numbers often cause errors
    
    
    this.xui_dom_container.appendChild(this.SVGDOM);

    return this;

};

