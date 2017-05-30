/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

/**
 * @class
 * Custom Notificatiom widget, This class produces a blank notification widget with a close button,
 * so its your job to fill in child nodes, and postion its top left using css.
 * it has a CSS class of TNotifyWidget, or you can access the 'Node' Object to modify it in the DOM
 * @param {Object} configurationOptions  An object contaning configuration parameters for this widget
 
 * @param {CSSColor} [configurationOptions.backgroundColor = #fff176] The background Color for the Widget
 * @param {String} [configurationOptions.closeButtonColor=transparent] The color for the close button
 
 * @param {CSSlength} configurationOptions.width Width for this widget
 * @param {CSSlength} configurationOptions.height Width for this widget
 
 * @param {String} configurationOptions.style The Notification style, one of
 * <pre>
 * 
 * slide-top | slide-bottom, enter-lt, ebter-lb, enter-rt, enter-rb
 * thumb-slider, scale-lt, scale-lb, scale-rt, scale-rb
 * 
 * </pre>
 *  
 *  @param {Number} [configurationOptions.timer]  Specifies the time in seconds which the NotificationWidget would be visible
 
 * 
 * @extends TigerJS.UI.Widget
 * 
 */

TigerJS.UI.Widget.NotifyWidget = function (configurationOptions) {

    function __notifyWidget(configurationOptions) {

        var bgColor = configurationOptions && configurationOptions.backgroundColor ?
                configurationOptions.backgroundColor : "#fff176",
                cbColor = configurationOptions && configurationOptions.closeButtonColor ?
                configurationOptions.closeButtonColor : "transparent",
                width = configurationOptions && configurationOptions.width ?
                configurationOptions.width : false,
                height = configurationOptions && configurationOptions.height ?
                configurationOptions.height : false,
                style = configurationOptions && configurationOptions.style ?
                configurationOptions.style.toString().trim() : false,
                timer = configurationOptions && configurationOptions.timer ?
                configurationOptions.timer : false;

        //create the main element  container for the slider(s)
        var baseWidget = T.UI.Widget();

        ///////////////////////////////////////////////////////////////////////////
        //reset The familyId and instance Id for this Widget
        ///All Widgets in this library should have a family and instance ID

        baseWidget.FamilyID = "NotifyWidget";
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
        baseWidget._widgetElement.set_data(baseWidget.FamilyID, baseWidget.InstanceID);

        baseWidget._widgetElement.add_class("TNotifyWidget w3-padding-4 w3-card-4");

        //validate arguments
        if (!width)
            throw " ConfigurationPropertyError<> Constructor TigerJS.UI.Widget.NotifyWidget#constructor - A width property is expected";
        if (!height)
            throw " ConfigurationPropertyError<> Constructor TigerJS.UI.Widget.NotifyWidget#constructor - A height property is expected";
        if (!style)
            throw " ConfigurationPropertyError<> Constructor TigerJS.UI.Widget.NotifyWidget#constructor - A style property is expected";


        baseWidget._widgetElement.set_style({
            width: width,
            height: height,
            backgroundColor: bgColor ? bgColor : baseWidget._widgetElement.style.backgroundColor,
            position: "absolute", msTransition: "-ms-transform .3s", borderRadius: "0px",
            MozTransition: "-moz-transform .3s", WebkitTransition: "-webkit-transform .3s",
            transition: "transform .3s", minWidth: "0px", minHeight: "0px",
            textAlign: "center",
            whiteSpace: "nowrap",
            padding: "3px"

        });


        function setDefaultStytle() {
            //prepare the element
            switch (style) {
                case "slide-top":
                    baseWidget._widgetElement.style.transform = "translateY(-200%)";

                    break;
                case "slide-bottom":
                    baseWidget._widgetElement.style.transform = "translateY(" + document.body.clientHeight * 1.5 + "px)";
                    break;
                case "enter-lt":
                    baseWidget._widgetElement.style.transform = "translateX(-151%)";
                    baseWidget._widgetElement.style.top = "3%";
                    break;
                case "enter-lb":
                    baseWidget._widgetElement.style.transform = "translateX(-151%)";

                    break;
                case "enter-rt":

                    baseWidget._widgetElement.style.top = "3%";

                case "enter-rb":
                    baseWidget._widgetElement.style.transform = "translateX(" + document.body.clientWidth + "px)";
                    break;
                case "scale-lt":
                    baseWidget._widgetElement.style.left = baseWidget._widgetElement.get_style().left || "3%";
                    baseWidget._widgetElement.style.top = baseWidget._widgetElement.get_style().top || "3%";

                    break;
                case "scale-lb":
                    baseWidget._widgetElement.style.left = baseWidget._widgetElement.get_style().left || "3%";

                    break;
                case "scale-rt":

                    baseWidget._widgetElement.style.top = baseWidget._widgetElement.get_style().top || "3%";
                    break;
                case "scale-rb":

                    break;
                case "dialog":
                    break;
                default:
                    baseWidget._widgetElement.style.display = "none";

            }

            if (style.strpos("scale") > -1) {

                if (baseWidget._widgetElement.parentNode) {//it means the widget has previously been added to the DOM and is probably just hidden
                    // so use an animation to unshow
                    function displayNone() {
                        if (this.target.style.animationName === "fadeOut") {
                            this.target.style.display = "none";
                            baseWidget._widgetElement.style.opacity = 0;
                        }
                        this.target.off("animationend webkitAnimationEnd MSAnimationEnd mozAnimationEnd", displayNone);
                    }

                    baseWidget._widgetElement.on("animationend webkitAnimationEnd MSAnimationEnd mozAnimationEnd", displayNone);//tht last true means this callback should be called only once

                    baseWidget._widgetElement.style.opacity = 1;//need to be explicit as the opacity is controlled by animations
                    baseWidget._widgetElement.style.animation = "fadeOut .3s 0s ease-in forwards";


                } else {//we havent previously been shown, hide till we are asked to show

                    baseWidget._widgetElement.style.opacity = 0;
                    baseWidget._widgetElement.style.display = "none";
                }
            }
        }

        //call the above func to set default styling
        setDefaultStytle();

        //>override public API
        /**
         *
         */
        baseWidget.show = function () {
            if (!baseWidget._widgetElement.parentNode) {//it hasnt been appended to an element, do not proceed
                throw " ConfigurationPropertyError<> Constructor TigerJS.UI.Widget.NotifyWidget#show - The widget is not inserted in the DOM";

            }
///create caancel button, only once
            if (!document.querySelector("#" + baseWidget._widgetElement.id + " > .icon-cross")) {
                var _closeBut = T.$(document.createElement("span"));
                _closeBut.add_class("icon-cross");
                _closeBut.set_style({
                    position: "absolute", fontSize: "75%", right: "2%", cursor: "pointer", color: cbColor,
                    display: "inline-block",
                    paddingTop: ".1em"
                });
                _closeBut.on("click", function () {

                    setDefaultStytle();
                });

                baseWidget._widgetElement.appendChild(_closeBut);
                _closeBut.style.top = (baseWidget._widgetElement.clientHeight / 2) - _closeBut.offsetHeight + "px";
            }



            switch (style) {
                case "slide-top":

                    baseWidget._widgetElement.style.borderRadius = "1px";
                    baseWidget._widgetElement.style.top = "0px";
                    baseWidget._widgetElement.style.left = (baseWidget._widgetElement.parentNode.clientWidth - baseWidget._widgetElement.clientWidth) / 2 + "px";
                    baseWidget._widgetElement.style.transform = "translateY(0%)";


                    break;
                case "slide-bottom":


                    baseWidget._widgetElement.style.borderRadius = "1px";
                    baseWidget._widgetElement.style.top = "0px";
                    baseWidget._widgetElement.style.left = (baseWidget._widgetElement.parentNode.clientWidth - baseWidget._widgetElement.clientWidth) / 2 + "px";
                    baseWidget._widgetElement.style.transform = "translateY(" + (
                            baseWidget._widgetElement.parentNode.clientHeight - baseWidget._widgetElement.clientHeight) + "px)";




                    break;
                case "enter-lt":
                    baseWidget._widgetElement.style.transform = "translateX(5%)";
                    baseWidget._widgetElement.style.top = "3%";
                    break;
                case "enter-lb":
                    baseWidget._widgetElement.style.transform = "translateX(5%)";
                    baseWidget._widgetElement.style.top = (baseWidget._widgetElement.parentNode.clientHeight -
                            baseWidget._widgetElement.offsetHeight - 30) + "px";
                    break;
                case "enter-rt":
                    baseWidget._widgetElement.style.transform = "translateX(" + (
                            baseWidget._widgetElement.parentNode.clientWidth - baseWidget._widgetElement.clientWidth - 50) + "px)";
                    baseWidget._widgetElement.style.top = "3%";

                    break;
                case "enter-rb":
                    baseWidget._widgetElement.style.transform = "translateX(" + (
                            baseWidget._widgetElement.parentNode.clientWidth - baseWidget._widgetElement.clientWidth - 50) + "px)";

                    baseWidget._widgetElement.style.top = (baseWidget._widgetElement.parentNode.clientHeight -
                            baseWidget._widgetElement.offsetHeight - 30) + "px";
                    break;
                case "scale-lt":
                case "scale-lb":
                case "scale-rt":
                case "scale-rb":
                    baseWidget._widgetElement.style.display = "block";

                    if (style.strpos("scale-lb") > -1 || style.strpos("scale-rb") > -1) {
                        baseWidget._widgetElement.style.top =
                                (baseWidget._widgetElement.parentNode.clientHeight - baseWidget._widgetElement.clientHeight - 30) + "px";

                    }

                    if (style.strpos("scale-rt") > -1 || style.strpos("scale-rb") > -1) {
                        baseWidget._widgetElement.style.left =
                                (baseWidget._widgetElement.parentNode.clientWidth - baseWidget._widgetElement.clientWidth - 30) + "px";

                    }
                    baseWidget._widgetElement.style.animation = "fadeIn .3s 0s ease-in forwards";
                    break

            }
            if (timer) {
                window.setTimeout(setDefaultStytle, timer * 1000);
            }
        };


        //
        //
        //->       //ovveride toString
        baseWidget._widgetElement.__to_string = function () {
            return "[object TigerJS.NotifyWidget]";
        };



        return baseWidget;
    }
    return new __notifyWidget(configurationOptions);
};