/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

/**
 * @class
 * This class repreents a generic Custom Range slider.
 * @param {Object} configurationOptions  An object contaning configuration parameters for this widget
 
 * @param {CSSColor} [configurationOptions.trackColor = #fff] The track color for the range widget
 * @param {CSSColor} [configurationOptions.handleColor = #fff]  Colour for the slider handle
 * @param {CSSColor} [configurationOptions.textColor = #000] text color for this widget 
 * @param {CSSlength} [configurationOptions.width = 100%] Width for this widget
 * @param {CSSlength} [configurationOptions.height = .5em] 
 * @param {CSSColor} [configurationOptions.min = 0] The minimum range value
 * @param {CSSColor} [configurationOptions.max = 100] The maximum range value
 * @param {Number}  configurationOptions.defaultValue Sets or returns the default value of a slider control, this must be within the minimum and mnaximum values
 * @param {String | HTMLFormElement } [configurationOptions.attachToForm] Associate this input with a form element, 
 *                                                   you could specify a DOM Node referencing the Form or the Form's id
 * @param {String} [configurationOptions.label] The label for this control
 * @param {Boolean} [configurationOptions.showValue = false] Show the current value of the range
 * @param {Boolean} [configurationOptions.showRange = false] Show the start and end range offset's
 * @param {String} [configurationOptions.name] The name property sets value of the name attribute of a form field.
 * @param {Number} [configurationOptions.accuracy] How many decimal places should the final range value be accurate to
 * @param {String} [configurationOptions.orientation=horizontal] The Widgets orientation i.e vertical/horizontal 
 *  
 
 * 
 * @extends TigerJS.UI.Widget
 * 
 */

TigerJS.UI.Widget.RangeWidget = function(configurationOptions) {

    function __rangeWidget(configurationOptions) {

        var trackColor = configurationOptions && configurationOptions.trackColor ?
            configurationOptions.trackColor : "#fff",
            handleColor = configurationOptions && configurationOptions.handleColor ?
            configurationOptions.handleColor : "#fff",
            name = configurationOptions && configurationOptions.name ?
            configurationOptions.name.toString().trim() : false,
            width = configurationOptions && configurationOptions.width ?
            configurationOptions.width : "100%",
            height = configurationOptions && configurationOptions.height ?
            configurationOptions.height : ".3em",
            r_min = configurationOptions && configurationOptions.min ?
            configurationOptions.min : 0,
            r_max = configurationOptions && configurationOptions.max ?
            configurationOptions.max : 100,
            step = configurationOptions && configurationOptions.step ?
            configurationOptions.step : 1,
            label = configurationOptions && configurationOptions.label ?
            configurationOptions.label.toString().trim() : false,
            defVal = configurationOptions && configurationOptions.defaultValue ?
            configurationOptions.defaultValue : false,
            showValue = configurationOptions && configurationOptions.showValue ?
            configurationOptions.showValue : false,
            showRange = configurationOptions && configurationOptions.showRange ?
            configurationOptions.showRange : false,
            tColor = configurationOptions && configurationOptions.textColor ?
            configurationOptions.textColor : "#000",
            attachToForm = configurationOptions && configurationOptions.attachToForm ?
            T.$(configurationOptions.attachToForm) : false,
            acc = configurationOptions && configurationOptions.accuracy ?
            configurationOptions.accuracy : null,
            ort = configurationOptions && configurationOptions.orientation ?
            configurationOptions.orientation.toString().trim() : "horizontal";


        //create the main element  container for the slider(s)
        var baseWidget = T.UI.Widget();

        ///////////////////////////////////////////////////////////////////////////
        //reset The familyId and instance Id for this Widget
        ///All Widgets in this library should have a family and instance ID

        baseWidget.FamilyID = "RangeWidget";
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

        if (ort === "vertical") {

            baseWidget._widgetElement.set_style({
                minHeight: "3em",
                height: width,
                minWidth: ".2em",
                position: "relative",
                backgroundColor: trackColor,
                display: "inline-block",
                borderRadius: "0px",
                width: height,
                textAlign: "center"
            });

        } else {

            baseWidget._widgetElement.set_style({
                minWidth: "3em",
                width: width,
                minHeight: ".2em",
                position: "relative",
                backgroundColor: trackColor,
                display: "inline-block",
                borderRadius: "0px",
                height: height
            });
        }

        if (trackColor === "#fff")
            baseWidget._widgetElement.style.border = "solid 1px #999";
        /////////////////////////////////////////////////////////////////////////////////

        /////////////////// //set some HTML5 data, just for fun.. ////////////////////////////
        //the _widgetElement is the actual DOM Element so..
        baseWidget._widgetElement.set_data(baseWidget.FamilyID, baseWidget.InstanceID);

        baseWidget._widgetElement.add_class("TigerSmartRange");
        baseWidget._widgetElement.selectable(false);
        ///////////// //////////////////END SOME ATTR FOR THEWIDGET//////////////////////  

        //internal input element
        var __input = document.createElement("INPUT");
        __input.type = 'hidden';
        __input.name = name ? name : "";
        baseWidget._widgetElement.appendChild(__input);
        if (attachToForm)
            __input.form = attachToForm;

        //create the sliders
        var slider = T.UI.Widget();

        slider.append_to_element(baseWidget._widgetElement);

        //configure for vertical or horizontal placement
        if (ort === "vertical") { //ort = orientation

            slider._widgetElement.set_style({
                height: "1.3em",
                minHeight: ".5em",
                minWidth: ".1em",
                width: "1.2em",
                borderRadius: "0%",
                display: "inline-block",
                position: "absolute",
                top: "0",
                left: "-0.5em",
                cursor: "pointer",
                zIndex: 20,
                backgroundColor: handleColor

            });

            if (handleColor === trackColor) //set the outline colour for each handle
                slider._widgetElement.style.border = "solid 1px #999";

            slider.set_draggable(false, false, true); //set the handle as 
            //draggable and constrain to vertical movement


        } else {
            slider._widgetElement.set_style({
                width: "1.2em",
                minWidth: ".5em",
                minHeight: ".1em",
                height: "1.3em",
                borderRadius: "0%",
                display: "inline-block",
                position: "absolute",
                top: "-.5em",
                left: "0px",
                cursor: "pointer",
                zIndex: 20,
                backgroundColor: handleColor
            });

            if (handleColor === trackColor) //set the outline colour for each handle
                slider._widgetElement.style.border = "solid 1px #999";

            slider.set_draggable(false, true); //set the handle as 
            //draggable and constrain to horizontal movement
        }

        var percentVal, realVal, valueLabel = document.createElement("SPAN");

        valueLabel.className += (ort === "vertical" ? "TRIValueSpan_V" : "TRIValueSpan"); //style and insert the label
        valueLabel.innerHTML += "";
        baseWidget._widgetElement.appendChild(valueLabel);
        baseWidget._widgetElement.style.color = tColor;


        //since the code above doesnt restrict it to its container we 
        //need to manually make sure it doesnt move out of the container
        //we also make sure the mouse is in the Widget and not just in any arbi* pos
        slider._widgetElement.on("mousemove touchmove", function() {


            if (this.target.id === slider._widgetElement.id || this.target.id === baseWidget._widgetElement.id) { //make sure we do not drag outside the range widget



                setValue(); //update the final-value on each call
                if (ort === "vertical") {

                    if (this.target.offsetTop < 0) { //make sure we do not go outside the left edge
                        this.target.style.top = "0px"; 
                        this.target.fire("mouseup");
                        this.target.fire("touchend");

                    }
                    if (this.target.offsetTop >= baseWidget._widgetElement.clientHeight) { //make sure we do not go outside the right edge
                        this.target.style.top = baseWidget._widgetElement.clientHeight - 10 + "px";
                        this.target.fire("mouseup");
                        this.target.fire("touchend");

                    }

                } else {

                    if (this.target.offsetLeft < 0) { //make sure we do not go outside the left edge
                        this.target.style.left = "0px";
                        this.target.fire("mouseup");
                        this.target.fire("touchend");

                    }
                    if (this.target.offsetLeft >= baseWidget._widgetElement.clientWidth) { //make sure we do not go outside the right edge
                        this.target.style.left = baseWidget._widgetElement.clientWidth - 10 + "px";
                        this.target.fire("mouseup");
                        this.target.fire("touchend");

                    }
                }
            } else {
                this.target.fire("mouseup");
                this.target.fire("touchend");
                return;
            }

        });


        if (showRange) {
            var startRange = document.createElement("SPAN");
            startRange.innerHTML = r_min;
            startRange.className += (ort === "vertical" ? " TRIRangeLeftScale_V" : " TRIRangeLeftScale");
            baseWidget._widgetElement.appendChild(startRange);

            var endRange = document.createElement("SPAN");
            endRange.innerHTML = r_max;
            endRange.className += (ort === "vertical" ? " TRIRangeRightScale_V" : " TRIRangeRightScale");
            baseWidget._widgetElement.appendChild(endRange);



        }



        function setValue() {
            if (ort === "vertical") {
                percentVal = (parseInt(slider._widgetElement.get_style().top) / baseWidget._widgetElement.clientHeight) * 100;

                if (percentVal <= 0) //since we are at the start of the range
                    realVal = r_min;
                else
                if (percentVal >= 100)
                    realVal = r_max; //end of range
                else
                // the final calculated range value,...not sure the need of the added 1, but without it final value isnt accurate (by 1)
                    realVal = ((percentVal / 100) * (r_max - r_min) + 1) + r_min;

                /////////////////////////////////////////////////////////////////////////////////
                if (acc === null) { //dont display fractional digits
                    realVal = "%d".sprintf(realVal);

                } else { //display fractional digits to the requested accuracy
                    realVal = new String("%." + acc + "f").sprintf(realVal);

                    //depending on the slider movement it might jump just above the maximum val, so clip it
                    realVal = parseFloat(realVal) > parseFloat(r_max) ? new String("%." + acc + "f").sprintf(parseInt(r_max)) : realVal;


                }
                if (showValue) {
                    valueLabel.innerHTML = realVal;

                }
                __input.value = realVal;

            } else {

                percentVal = (parseInt(slider._widgetElement.get_style().left) / baseWidget._widgetElement.clientWidth) * 100;

                if (percentVal <= 0)
                    realVal = r_min; //since we are at the start of the range
                else
                if (percentVal >= 100)
                    realVal = r_max; //end of range
                else
                // the final range value
                    realVal = ((percentVal / 100) * (r_max - r_min) + 1) + r_min;

                ////////////////////////////////////////////////////////////////
                if (acc === null) { //dont display fractional digits
                    realVal = "%d".sprintf(realVal);

                } else { //display fractional digits to the requested accuracy
                    realVal = new String("%." + acc + "f").sprintf(realVal);

                    //depending on the slider movement it might jump just above the maximum val, so clip it
                    realVal = parseFloat(realVal) > parseFloat(r_max) ? new String("%." + acc + "f").sprintf(parseInt(r_max)) : realVal;

                }
                if (showValue) {
                    valueLabel.innerHTML = realVal;

                }
                __input.value = realVal;
            }
        }

        //->   //overide appendTo Element
        baseWidget.append_to_element = function(parEl) {
            var p;

            if (parEl.nodeType && parEl.nodeType === 1) {

                parEl.appendChild(baseWidget._widgetElement);
                p = T.$(parEl);
            } else
            if (T.is_string(parEl)) {
                p = T.$(parEl);
                p.appendChild(baseWidget._widgetElement);

            }
            if (defVal) { //default value
                var total_val = r_max - r_min;
                percentVal = ((defVal - r_min) / total_val) * 100;

                if (ort === "vertical") {

                    slider._widgetElement.style.top = ((percentVal / 100) * baseWidget._widgetElement.clientHeight) + "px";
                } else {
                    slider._widgetElement.style.left = ((percentVal / 100) * baseWidget._widgetElement.clientWidth) + "px";
                }

            }
            setValue(); //set the internal input value and the slider's label value



            T.$(); /** Workaround for firefox Heirachy request Error BUG!! -- Just call that accesses the dom after your insertion**/ ;

            //>handle labels
            if (label) {
                var l = T.$(document.createElement("div"));
                l.className += (ort === "vertical" ? " TRILabel_V" : " TRILabel");
                l.innerHTML = label;
                this._widgetElement.appendChild(l);

            }
            return this;
        };
        //
        //
        //->       //ovveride toString
        baseWidget._widgetElement.__to_string = function() {
            return "[object TigerJS.RangeWidget]";
        };
        //
        //
        /**
         * Set's or get the current value of the slider
         * @function
         * @param {Number} val Set the slider to the argument value, it must be between the min and max value
         * @type TigerJS.UI.Widget.RangeWidget
         * @name TigerJS.UI.Widget.Range#value
         */
        baseWidget.value = function(val) {
            if (val && isNaN(val)) {
                var err_str = " WrongArgumentTypeError<> Constructor TigerJS.UI.Widget.RangeWidget#value Expects a Number type " + T.type(val) + " given";
                throw new Error(err_str);

            } else {
                defVal = val;
                var total_val = r_max - r_min;
                percentVal = ((defVal - r_min) / total_val) * 100;

                if (ort === "vertical") {

                    slider._widgetElement.style.top = ((percentVal / 100) * baseWidget._widgetElement.clientHeight) + "px";
                } else {
                    slider._widgetElement.style.left = ((percentVal / 100) * baseWidget._widgetElement.clientWidth) + "px";
                }
                setValue(); //set the internal input value and the slider's label value
            }

            //no argument, return the current value
            return __input.value;
        };

        return baseWidget;
    }
    return new __rangeWidget(configurationOptions);
};