/* global T, TigerJS */

/**
 * @class
 * This class represents a basic tooltip
 * @param {Object} configurationOptions  An object contaning configuration parameters for this widget
 * @param {String} [configurationOptions.pos = right]  The position of the tooltip, 
 * @param {CSSColor} [configurationOptions.backgroundColor = #fff]  background color for this widget, 
 * @param {CSSColor} [configurationOptions.textColor = #000] text color for this widget 
 * @param {CSSColor} [configurationOptions.borderColor = "#ccc"] border color for this widget 
 * @param {String} configurationOptions.text The tooltip text
 * @param {String} [configurationOptions.icon] A an icon for this tooltip widget, 
 * pass the name one of the SVG images budled with the library, and dont forget to call T.insertSVGIcons after adding the wiget to the DOM`.
 * 
 * @param {CSSColor} [configurationOptions.iconColor] The color for the icon, defaults to the widgets text color    
 * @extends TigerJS.UI.Widget
 */


TigerJS.UI.Widget.TooltipWidget = function (configurationOptions) {

    var baseWidget = T.UI.Widget({elementType: "span"}),
            bgColor = configurationOptions && configurationOptions.backgroundColor ?
            configurationOptions.backgroundColor : "#fff",
            bdColor = configurationOptions && configurationOptions.borderColor ?
            configurationOptions.borderColor : "#000",
            tColor = configurationOptions && configurationOptions.textColor ?
            configurationOptions.textColor : "#000",
            text = configurationOptions && configurationOptions.text ?
            configurationOptions.text : "foobar,...lorem..",
            iconClass = configurationOptions && configurationOptions.icon ?
            configurationOptions.icon : "false",
            icon_c = configurationOptions && configurationOptions.iconColor ?
            configurationOptions.iconColor : tColor,
            pos = configurationOptions && configurationOptions.pos ?
            configurationOptions.pos : "right";
    ///////////////////////////////////////////////////////////////////////////
    //reset The familyId and instance Id for this Widget
    ///All Widgets in this library should have a family and instance ID

    baseWidget.FamilyID = "TooltipWidget";
    if (T.globalWidgetCache[baseWidget.FamilyID]) {
        T.globalWidgetCache[baseWidget.FamilyID] =
                T.globalWidgetCache[baseWidget.FamilyID] += 1;
    } else {
        T.globalWidgetCache[baseWidget.FamilyID] = 1;
    }
//Set the Instance Id for this  Widget Instance
    baseWidget.InstanceID = baseWidget.FamilyID +
            ("%02X".sprintf(T.globalWidgetCache[baseWidget.FamilyID]));
    //set the widget's id to the instance id
    baseWidget._widgetElement.id = baseWidget.InstanceID;
    /////////////////// //set some HTML5 data, just for fun.. ////////////////////////////
    //the _widgetElement is the actual DOM Element so..
    baseWidget._widgetElement.setData(baseWidget.FamilyID, baseWidget.InstanceID);
    baseWidget._widgetElement.className += " TigerSmartTooltip t-card-4";
    //
    //
    //these event handlers are necessary so we do not interfere with the attached elements events 
    baseWidget._widgetElement.on("click", function (e) {

        this.stopImmediatePropagation();
    });
    baseWidget._widgetElement.on("mouseover", function (e) {

        this.stopImmediatePropagation();
    });
    baseWidget._widgetElement.on("mouseover", function (e) {

        this.stopImmediatePropagation();
    });
    ///////////// //////////////////END SOME ATTR FOR THE WIDGET//////////////////////   

    if (tColor) {
        baseWidget._widgetElement.style.color = tColor;
    }
    if (bgColor) {//background color
        //the input is in a container div so set styles on the container also

        baseWidget._widgetElement.style.setProperty("background-color", bgColor, "important");
    }
    if (bdColor) {//border colors
        baseWidget._widgetElement.style.borderColor = bdColor;
        baseWidget._widgetElement.style.borderWidth = "1px";
        baseWidget._widgetElement.style.borderStyle = "solid";
        baseWidget._widgetElement.style.fontWeight = "bold";
        baseWidget._widgetElement.style.width = "auto";
        baseWidget._widgetElement.style.whiteSpace = "nowrap"; //only wrap on explicit break

    }
    if (text) {//border colors
        baseWidget._widgetElement.innerHTML = text;
    }


    //->       //ovveride toString
    baseWidget._widgetElement.__toString = function () {
        return "[object TigerJS.TooltipWidget]";
    };
    baseWidget.styleInsertedinDoc = false;
    //> show the tooltip depending on available space
    /**
     * 
     * Shows the tooltip 
     * @name TigerJS.UI.Widget.TooltipWidget#showTooltip
     * @function
     * @return {TigerJS.UI.Widget.TooltipWidget}
     * 
     */
    baseWidget.showTooltip = function () {

        var t = baseWidget._widgetElement, parent = T.$(baseWidget._widgetElement.parentNode),
                t_style = t.getStyle(), /* All style declarations for the tooltip*/
                t_coords = t.rect(), /* tooltip element coordinates*/
                parent_coords = parent.rect(); /* tooltip parent coordinates*/

        // we need any element that would have a tooltip to be positioned
        parent.style.position = parent.style.position === ("relative" || "absolute") ? parent.style.position : "relative";
        switch (pos) {
            case "left":

                t.style.left = (parseInt(t.offsetWidth) * -1) - 10 + "px";
                t.style.top = "0px";
                if (!this.styleInsertedinDoc) {

                    T.addCSSBlob("#" + t.id + "::before," +
                            "#" + t.id + "::after{" +
                            " content: ''; position: absolute; z-index: 1000 ;bottom: 59%; left:98%" +
                            ";border-top: 6px solid " + bgColor +
                            ";border-left: 6px solid transparent; border-right: 8px solid transparent;" +
                            "border-bottom: 0;  transform: rotate(270deg)} " +
                            "#" + t.id + "::before{ border-top:7px solid " + bdColor + " !important; left:98.5%; bottom: 59%}");
                }
                break;
            case "top":

                t.style.left = "5px";
                t.style.top = (parseInt(t.offsetHeight) * -1) - 10 + "px";
                if (!this.styleInsertedinDoc) {
                    T.addCSSBlob("#" + t.id + "::before," +
                            "#" + t.id + "::after{" +
                            " content: ''; position: absolute; z-index: 998 ;bottom: -25%; left:20" +
                            "px;border-top: 8px solid " + bgColor +
                            ";border-left: 8px solid transparent; border-right: 8px solid transparent;" +
                            "border-bottom: 0;  transform: rotate(0deg)} " +
                            "#" + t.id + "::before{ border-top:9px solid " + bdColor + " !important; left:20px; bottom: -28.5%}");
                }
                break;
            case "bottom":

                t.style.top = parseInt(parent.offsetHeight) + 10 + "px";
                t.style.left = "5px";
                if (!this.styleInsertedinDoc) {
                    T.addCSSBlob("#" + t.id + "::before," +
                            "#" + t.id + "::after{" +
                            " content: ''; position: absolute; z-index: 1000 ;bottom: 100%; left:20" +
                            "px;border-top: 8px solid " + bgColor +
                            ";border-left: 8px solid transparent; border-right: 8px solid transparent;" +
                            "border-bottom: 0;  transform: rotate(180deg)} " +
                            "#" + t.id + "::before{ border-top:9px solid " + bdColor + " !important; left:20px; bottom: 101.5%}");
                }
                break;
            default :
                t.style.left = parseInt(parent.offsetWidth) + 8 + "px";
                t.style.top = "0px";
                if (!this.styleInsertedinDoc) {
                    T.addCSSBlob("#" + t.id + "::before," +
                            "#" + t.id + "::after{" +
                            " content: ''; position: absolute; z-index: 1000 ;bottom: 58%; left:-9" +
                            "px;border-top: 6px solid " + bgColor +
                            ";border-left: 6px solid transparent; border-right: 6px solid transparent;" +
                            "border-bottom: 0;  transform: rotate(-270deg)} " +
                            "#" + t.id + "::before{ border-top:7px solid " + bdColor + " !important; left:-10px; bottom: 57.9%}");
                }
                break;
        }

        this.styleInsertedinDoc = true;
        ;
        t.style.opacity = "1";
        t.style.visibility = "visible";
        return this;
    };
    /**
     * 
     * Hides the tooltip 
     * @name TigerJS.UI.Widget.TooltipWidget#hideTooltip
     * @function
     * @return {TigerJS.UI.Widget.TooltipWidget}
     */
    baseWidget.hideTooltip = function () {
        var t = baseWidget._widgetElement;
        t.style.opacity = "0";
        t.style.visibility = "hidden";
        return this;
    };
    /**
     * Appends the tool tip to an Element,
     * so it is shown on Hover
     * @param {HTMLElement | String} parEl A pre-existing Element
     * reference or the Element's id
     * @param {Boolean} noHoverAction The tooltip would be shown by default on hover, set this to disable this effect; 
     * @name TigerJS.UI.Widget.TooltipWidget#appendToElement
     * @function
     * @type TigerJS.UI.Widget.TooltipWidget
     */


    baseWidget.appendToElement = function (parEl, noHoverAction) {
        parEl = (T.$(parEl));
        parEl.appendChild(this._widgetElement);
        T.$(); //call a function or property on something after using appendChild in Firefox to squash some weird bugs

        if (!noHoverAction) {
            parEl.onmouseover = function () {
                baseWidget.showTooltip();
            };
            parEl.onmouseout = function () {
                baseWidget.hideTooltip();
            };
        }




        //>do some late styling for the tooltip icon
        if (iconClass) {//border colors
            var icon_wt_txt = "<span class='" + iconClass + "'></span>&nbsp;" + baseWidget._widgetElement.innerHTML;
            baseWidget._widgetElement.innerHTML = icon_wt_txt;
            if (icon_c) {
                var icon = document.querySelector("#" + baseWidget._widgetElement.id + " > ." + iconClass);
                icon.style.setProperty("color", icon_c, "important");
                icon.style.setProperty("font-size", "16px", "important");
            }
        }

        //->       //ovveride toString
        baseWidget._widgetElement.__toString = function () {
            return "[object TigerJS.TooltipWidget]";
        };
        //>Override show and hide from the Default Widget
        baseWidget.show = function () {
            return baseWidget.showTooltip();
        };
        baseWidget.hide = function () {
            return baseWidget.hideTooltip();
        };
        return this;
    };

    //return the calendar widget Object
    return baseWidget;
};