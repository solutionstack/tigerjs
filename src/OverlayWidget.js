/* global TigerJS, T */

/**
 * @class
 * This class repreents a generic Overlay Widget,
 * This widget requires that the first child of the body element be a container that holds all other elements displayed;
 * This is the element that should be sent to the {@link TigerJS.UI.Widget.OverlayWidget#appendToElement} Method. <p/>
 * The overlay would be shown when the {@link TigerJS.UI.Widget.OverlayWidget#show} method is called.
 
 * @param {Object} configurationOptions  An object contaning configuration parameters for this widget
 
 * @param {String} [configurationOptions.overlayStyle] The overlay animation style, one of
 * <pre>
 *    scale | push | pushright | slidedown
 * </pre>
 * @param {Number} [configurationOptions.oPercent = 100]   Applies only to some 
 * overlay styles like <u>push</u> and <u>slidedown</u> and it denotes
 *  the amount of percentage screen space the overlay should take
 * @param {String} [configurationOptions.backgroundColor] The overlay background color
 * @param {String} [configurationOptions.closeButtonColor] The color for the close button
 
 
 * 
 * 
 * @extends TigerJS.UI.Widget
 * 
 */


TigerJS.UI.Widget.OverlayWidget = function (configurationOptions) {

    function __overlayWidget(configurationOptions) {
//cretae a new T.UI.Widget instance
        var baseWidget = T.UI.Widget(),
                overlayStyle = configurationOptions && configurationOptions.overlayStyle ?
                configurationOptions.overlayStyle : false,
                bgColor = configurationOptions && configurationOptions.backgroundColor ?
                configurationOptions.backgroundColor : "rgba(153,204,51,0.9)",
                cBTc = configurationOptions && configurationOptions.closeButtonColor ?
                configurationOptions.closeButtonColor : "#fff",
                ovPcnt = configurationOptions && configurationOptions.oPercent ?
                parseInt(configurationOptions.oPercent) : false;

///////////////////////////////////////////////////////////////////////////
        //reset The familyId and instance Id for this Widget
        ///All Widgets in this library should have a family and instance ID

        baseWidget.FamilyID = "OverlayWidget";
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
        baseWidget._widgetElement.setStyle({
            position: "fixed",
            width: "100%",
            height: "100%",
            background: bgColor,
            borderRadius: "0",
            left: 0,
            top: 0,
            zIndex: 300

        });

        baseWidget._widgetElement.on("click", function (e) {
            this.stopPropagation();
        });

        /**
         * The current state of the widget
         * <pre>
         * 1 represents open
         * 0 represents closed
         * </pre>
         * @type Number
         * @function
         * @name TigerJS.Ui.Widget.OverlayWidget#state
         * 
         */

        baseWidget.state = function () {
            return this.widgetState;
        };

        baseWidget.widgetState = "0";

        var container, containerOverflow, bodyBg;

        baseWidget.appendToElement = function (parEl) {

            var p = T.$(parEl);
            container = p;
            containerOverflow = p.getStyle()['overflow'];

            bodyBg = T.$(document.body).getStyle()['background'];
            document.body.appendChild(baseWidget._widgetElement);
            if (ovPcnt) {
                baseWidget._widgetElement.style.width = ovPcnt + "%";
            }

            switch (overlayStyle) { //initiate the overlay
                //setup initial styling depending on the overlay style
                case 'scale':
                    baseWidget._widgetElement.addClass("overlay-contentscale");
                    baseWidget._widgetElement.style.width = 100 + "%";
                    container.style.transition = "transform .5s";
                    container.style.msTransition = "-ms-transform .5s";
                    container.style.MozTransition = "-moz-transform .5s";
                    container.style.WebkitTransition = "-webkit-transform .5s";
                    break;
                case 'push':

                    baseWidget._widgetElement.addClass("overlay-contentpush");
                    container.style.transition = "transform .5s";
                    container.style.msTransition = "-ms-transform .5s";
                    container.style.MozTransition = "-moz-transform .5s";
                    container.style.WebkitTransition = "-webkit-transform .5s";
                    break

                case 'pushright':
                    baseWidget._widgetElement.style.width = 100 + "%";
                    baseWidget._widgetElement.addClass("overlay-contentrpush");
                    container.style.transition = "transform .5s";
                    container.style.msTransition = "-ms-transform .5s";
                    container.style.MozTransition = "-moz-transform .5s";
                    container.style.WebkitTransition = "-webkit-transform .5s";
                    break;
                case 'slidedown':

                    baseWidget._widgetElement.style.height = ovPcnt + "%";
                    baseWidget._widgetElement.style.width = 100 + "%";
                    baseWidget._widgetElement.addClass("overlay-slidedown");
                    break;
            }
            return this;

        };

        //>override public API
        baseWidget.show = function () {

///create caancel button, only once
            if (!document.querySelector("#" + baseWidget._widgetElement.id + " .TigerSmartOverlayCloseButton"))
            {
                var _closeBut = T.$(document.createElement("p"));
                _closeBut.addClass("TigerSmartOverlayCloseButton icon-cross");
                _closeBut.style.color = cBTc;
                //next append the close button
                baseWidget._widgetElement.appendChild(_closeBut);
                _closeBut.on("click", this.close);
            } else {
                var _closeBut = document.querySelector("#" + baseWidget._widgetElement.id + " .TigerSmartOverlayCloseButton");
            }

            baseWidget.widgetState = "1";

            switch (overlayStyle) { //animate the main container for the body content
                case 'scale':

                    container.addClass("containerOnOpen1");
                    baseWidget._widgetElement.addClass("overlay-contentscale_open");
                    baseWidget._widgetElement.removeClass("overlay-contentscale");

                    //append close button
                    _closeBut.addClass("overlay-cancel-4");

                    break;

                case 'push':

                    if (!ovPcnt) {// if they didnt send a percentage, add the default class
                        container.addClass("containerOnOpen2");
                    } else
                    {
                        container.setStyle({overflowX: "hidden", transform: "translateX(" + ovPcnt + "%)",
                            WebkitTransform: "translateX(" + ovPcnt + "%)",
                            MozTransform: "translateX(" + ovPcnt + "%)",
                            msTransform: "translateX(" + ovPcnt + "%)",
                            overflowY: "scroll"
                        });
                    }

                    baseWidget._widgetElement.addClass("overlay-contentpush_open");
                    baseWidget._widgetElement.removeClass("overlay-contentpush");

                    _closeBut.addClass("overlay-cancel-1");

                    break

                case 'pushright':

                    if (!ovPcnt) {// if they didnt send a percentage, add the default class
                        container.addClass("containerOnOpen3");

                        baseWidget._widgetElement.addClass("overlay-contentrpush_open");
                        baseWidget._widgetElement.removeClass("overlay-contentrpush");
                    } else
                    {
                        //move the main container to the left
                        container.setStyle({overflowX: "hidden", transform: "translateX(" + ovPcnt * -1 + "%)",
                            WebkitTransform: "translateX(" + ovPcnt * -1 + "%)",
                            MozTransform: "translateX(" + ovPcnt * -1 + "%)",
                            msTransform: "translateX(" + ovPcnt * -1 + "%)",
                            overflowY: "scroll"
                        });

                        //the show the overlay

                        baseWidget._widgetElement.setStyle({visibility: "visible", transform: "translateX(" + (100 - (ovPcnt * -1)) + "%)",
                            WebkitTransform: "translateX(" + (100 - (ovPcnt * -1)) + "%)",
                            MozTransform: "translateX(" + (100 - (ovPcnt * -1)) + "%)",
                            msTransform: "translateX(" + (100 - (ovPcnt * -1)) + "%)",
                            WebkitTransition: "-webkit-transform 0.5s",
                            transition: "transform 0.5s",
                            msTransition: "-ms-transform 0.5s",
                            MozTransition: "-moz-transform 0.5s"
                        });
                        baseWidget._widgetElement.removeClass("overlay-contentrpush");
                    }


                    //add the close button
                    _closeBut.addClass("overlay-cancel-2");

                    break;

                case 'slidedown' :

                    baseWidget._widgetElement.addClass("overlay-slidedown_open");
                    baseWidget._widgetElement.removeClass("overlay-slidedown");

                    _closeBut.addClass("overlay-cancel-3");

                    baseWidget._widgetElement.style.opacity = .9;
                    break;
            }



            return this;
        };

        baseWidget.close = function (e) {


            switch (overlayStyle) {
                case 'scale':

                    container.removeClass("containerOnOpen1");
                    container.style.overflow = containerOverflow;

                    baseWidget._widgetElement.removeClass("overlay-contentscale_open");
                    baseWidget._widgetElement.addClass("overlay-contentscale");
                    //remove the close button
                    baseWidget._widgetElement.removeChild(document.querySelector(".overlay-contentscale .TigerSmartOverlayCloseButton"));

                    break;

                case 'push':
                    container.removeClass("containerOnOpen2");

                    container.setStyle({overflowX: "hidden", transform: "translateX(0%)",
                        WebkitTransform: "translateX(0%)",
                        MozTransform: "translateX(0%)",
                        msTransform: "translateX(0%)"
                    });
                    baseWidget._widgetElement.removeClass("overlay-contentpush_open");
                    baseWidget._widgetElement.addClass("overlay-contentpush");

                    break

                case 'pushright':


                    baseWidget._widgetElement.removeClass("overlay-contentrpush_open");
                    baseWidget._widgetElement.addClass("overlay-contentrpush");

                    container.setStyle({overflowX: "hidden", transform: "translateX(0%)",
                        WebkitTransform: "translateX(0%)",
                        MozTransform: "translateX(0%)",
                        msTransform: "translateX(0%)"
                    });
                    baseWidget._widgetElement.setStyle({transform: "translateX(" + (100) + "%)",
                        WebkitTransform: "translateX(" + (100) + "%)",
                        MozTransform: "translateX(" + (100) + "%)",
                        msTransform: "translateX(" + (100) + "%)",
                        WebkitTransition: "-webkit-transform 0.5s",
                        transition: "transform 0.5s",
                        msTransition: "-ms-transform 0.5s",
                        MozTransition: "-moz-transform 0.5s"
                    });

                    break;
                case 'slidedown':

                    baseWidget._widgetElement.removeClass("overlay-slidedown_open");
                    baseWidget._widgetElement.addClass("overlay-slidedown");

                    break;
            }
            baseWidget.widgetState = "0";

            return this;

        };
        baseWidget.hide = baseWidget.close;//just for convinience
        //


        baseWidget._widgetElement.__toString = function () {
            return "[object TigerJS.OverlayWidget]";
        };
        ;
        return baseWidget;
    }

    return new __overlayWidget(configurationOptions);
};