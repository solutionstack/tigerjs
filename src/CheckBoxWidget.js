/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2016 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */

/**
 * @class
 * This class repreents a customizable check box widget
 
 * @param {Object} configurationOptions  An object contaning configuration parameters for this widget
 
 * @param {CSSColor} [configurationOptions.bgColor = #fff]  Background color for this widget, 
 * @param {CSSColor} [configurationOptions.checkMarkColor = #666] Color for the checked marker
 * @param {CSSColor} [configurationOptions.borderColor = #fff] Border color for this widget 
 * @param {CSSColor} [configurationOptions.shadowHColor = #fff] Color of light box shadow shown on over 
 * @param {CSSColor} [configurationOptions.borderHColor = #fff] Border color on hover-state for this widget 
 * @param {Boolean} [configurationOptions.required = false] Specifies if the input is required and cannot be sent empty
 * @param {Boolean} [configurationOptions.disabled = false] Should the control be disabled
 * @param {Boolean} [configurationOptions.readOnly = false] Should the control be rendered readOnly 
 * @param {String | HTMLFormElement} [configurationOptions.attachToForm] Associate this input with a form element, 
 *                                                   you could specify a DOM Node referencing the Form or the Form's id
 * 
 
 * @param {String} [configurationOptions.name] The name property sets value of the name attribute of a form field
 * Remember only form elements with a name attribute will have their values passed when submitting a form
 arWidget}
 *  @param {String} [configurationOptions.label] The label for this control
 *  
 * @param {String} [configurationOptions.errorColor = red] The color of the error icon
 * @param {Boolean} [configurationOptions.isChecked]  The default checked state
 * @param {Function} [configurationOptions.actionCallback]  A function to be called whenever an
 * an action is performed on the checkbox by clicking, the function is called with 1 as an argument
 * if the action puts the widget in the check state, and zero if the action puts the widget in the unchecked state 
 * 
 * @extends TigerJS.UI.Widget
 * 
 * <pre>
 * ** Note
 * 
 *  To Style the label use .TSILabel class
 *  
 *  </pre>
 */


TigerJS.UI.Widget.CheckBoxWidget = function (configurationOptions) {

    function __inputWidget(configurationOptions) {
//cretae a new T.UI.Widget instance
        var baseWidget = T.UI.Widget(),
                bgColor = configurationOptions && configurationOptions.bgColor ?
                configurationOptions.bgColor : "#fff",
                bdColor = configurationOptions && configurationOptions.borderColor ?
                configurationOptions.borderColor : "#fff",
                shadowHColor = configurationOptions && configurationOptions.shadowHColor ?
                configurationOptions.shadowHColor : false,
                borderHColor = configurationOptions && configurationOptions.borderHColor ?
                configurationOptions.borderHColor : false,
                cmColor = configurationOptions && configurationOptions.checkMarkColor ?
                configurationOptions.checkMarkColor : "#666",
                val_req = configurationOptions && configurationOptions.required ?
                configurationOptions.required : false,
                disable = configurationOptions && configurationOptions.disabled ?
                configurationOptions.disabled : false,
                readOnly = configurationOptions && configurationOptions.readOnly ?
                configurationOptions.readOnly : false,
                name = configurationOptions && configurationOptions.name ?
                configurationOptions.name.toString().trim() : false,
                isChk = configurationOptions && configurationOptions.isChecked ?
                configurationOptions.isChecked : false,
                err_col = configurationOptions && configurationOptions.errorColor ?
                configurationOptions.errorColor.toString().trim() : "red",
                label = configurationOptions && configurationOptions.label ?
                configurationOptions.label.toString().trim() : false,
                attachToForm = configurationOptions && configurationOptions.attachToForm ?
                T.$(configurationOptions.attachToForm) : false;


        ///////////////////////////////////////////////////////////////////////////
        //reset The familyId and instance Id for this Widget
        ///All Widgets in this library should have a family and instance ID

        baseWidget.FamilyID = "CheckBoxWidget";
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
        baseWidget._widgetElement.setStyle({minWidth: "1em", minHeight: "1em", width: "1em", height: "1em", position: "relative",
            borderRadius: "0px", backgroundColor: bgColor, border: "solid 1px " + bdColor, display: "inline-block"});
/////////////////////////////////////////////////////////////////////////////////

        /////////////////// //set some HTML5 data, just for fun.. ////////////////////////////
        //the _widgetElement is the actual DOM Element so..
        baseWidget._widgetElement.setData(baseWidget.FamilyID, baseWidget.InstanceID);

        baseWidget._widgetElement.addClass("TigerSmartCheckBox");
        baseWidget._widgetElement.selectable(false);
        ///////////// //////////////////END SOME ATTR FOR THEWIDGET//////////////////////  

        //current state
        baseWidget.checkedState = false;

        /** The widget is going to contain an actual invisible checkbox so we can intercepts its focus , blur and other states **/
        var __internalCheckBox = T.$(document.createElement("input"));
        __internalCheckBox.type = "checkbox";

        __internalCheckBox.setStyle({appearance: "none", MozAppearance: "none",
            WebkitAppearance: "none", opacity: 0});

        //create an element to represent the check state
        var checkEl = T.$(document.createElement("span"));
        checkEl.setStyle({display: "inline-block", width: "100%", height: "100%", position: "absolute",
            top: "0px", left: "0px", fontSize: "1em", fontWeight:"bolder", color: cmColor, opacity: 0});
        checkEl.innerHTML = "&#x2714;"

            //a little entry animation
            T.UI.FX.Animation({el: checkEl, name: "fadeIn", time: .2});


        //send events from this widget to the hidden checkbox
        baseWidget._widgetElement.onmouseover = function (e) {

            if (shadowHColor) {
                this.style.boxShadow = " 1px 1px 10px " + shadowHColor + ", -1px -1px 10px " + shadowHColor + " ";
            }
            if (borderHColor) {
                this.style.borderColor = borderHColor;
            }
            e.stopPropagation();
        };

        baseWidget._widgetElement.onmouseout = function (e) {

            if (shadowHColor) {
                this.style.boxShadow = "none";
            }
            if (borderHColor) {
                this.style.borderColor = "transparent";
            }
            e.stopPropagation();
        };


        //intercept the checkbox events

        __internalCheckBox.onfocus = function (e) {
            e.stopPropagation();
        };
        __internalCheckBox.onblur = function (e) {

            e.stopPropagation();
        };


        //append the checkbox to the widget
        baseWidget._widgetElement.appendChild(__internalCheckBox);


        /**
         * Sets or returns whether the widget is disabled or not
         * @param {Boolean} _disable Boolean to denote if we should disable the conrol or not
         * @function
         * @return {TigerJS.UI.Widget.CheckBoxWidge | Boolean}
         * @name TigerJS.UI.Widget.CheckBoxWidget#isDisabled
         */
        baseWidget.isDisabled = function (_disable) {

            if (Boolean(_disable) === true) {

                __internalCheckBox.disabled = Boolean(_disable);

                this._widgetElement.style.setProperty("background-color", "#555", "important");
                checkEl.style.setProperty("color", "#ccc", "important");
                this._widgetElement.style.setProperty("border-color", "transparent", "important");

            } else
            if (Boolean(_disable) === false) {

                __internalCheckBox.disabled = Boolean(_disable);
                checkEl.style.setProperty("color", cmColor, "important");
                this._widgetElement.style.setProperty("background-color", bgColor, "important");
                this._widgetElement.style.setProperty("border-color", bdColor, "important");


            }
            this._widgetElement.on("click", function () {

                this.stopPropagation();

                var __err;

                //clear error icons in the DOM
                if ((__err = document.querySelector("#" + baseWidget._widgetElement.id + " > .TigerFormErrorIcon")))
                {
                    try {//we fall into this block atimes even if the error element isn't present #TODO - WHY?
                        __err.parentNode.removeChild(__err);
                    } catch (e) {
                    }
                }

                if (__internalCheckBox.disabled === false) {//we're enabled

                    if (!baseWidget.checkedState) {//cuurently off, switch on
        
                        baseWidget._widgetElement.appendChild(checkEl);
                        baseWidget.checkedState = true;
                        __internalCheckBox.checked = true;
                        if (configurationOptions.actionCallback && configurationOptions.actionCallback(baseWidget, 1))
                        {
                        }
                    } else {//cuurently on
                        checkEl.parentNode.removeChild(checkEl);
                        baseWidget.checkedState = false;
                        __internalCheckBox.checked = false;
                        if (configurationOptions.actionCallback && configurationOptions.actionCallback(baseWidget, 0))
                        {
                            ;
                        }

                    }
                }
            });

            return  __internalCheckBox.disabled;

        }
        ;

        baseWidget.isDisabled(disable);//set this unconditionally, wheteher its true or false


        /**
         * Sets or returns the name of the check-box Widget
         * @param {String} name Specifies the name of the  Widget
         * @function
         * @name TigerJS.UI.Widget.CheckBoxWidget#name
         * @return {TigerJS.UI.Widget.CheckBoxWidget | String}
         */
        baseWidget.name = function (name) {
            if (name) {
                __internalCheckBox.name = name;
                return this;
            }
            return  __internalCheckBox.name;
        };
        if (name) {
            baseWidget.name(name);
        }


        /**
         * Sets or returns whether a checkbox input Widget is in the checked state
         * @param {Boolean} _check
         * @function
         * @return {Boolean}
         * @name TigerJS.UI.Widget.CheckBoxWidget#isChecked
         */

        baseWidget.isChecked = function (_check) {

            if (_check && _check === true) {//is this right
                this._widgetElement.appendChild(checkEl);
                baseWidget.checkedState = true;
                __internalCheckBox.checked = true;

            } else if (_check === false)
            {

                if (baseWidget.checkedState)
                    this._widgetElement.removeChild(checkEl);
                baseWidget.checkedState = false;
                __internalCheckBox.checked = false;


            }
            return __internalCheckBox.checked;
        };
        if (isChk)
            baseWidget.isChecked(true);
        /**
         * Sets or returns whether a input Widget is read-only
         * @param {Boolean} readonly Boolean to specify whether the input widget is read only 
         * @function
         * @return {TigerJS.UI.Widget.CheckBoxWidget | Boolean}
         * @name TigerJS.UI.Widget.CheckBoxWidget#readOnly
         */
        baseWidget.readOnly = function (readonly) {
            if (readonly && T.isBoolean(readonly)) {
                __internalCheckBox.readOnly = readonly;
                return this;
            }
            return  __internalCheckBox.readOnly || false;
        };
        if (readOnly) {//they sent a readonly attribute value
            baseWidget.readOnly(readOnly);
        }



        baseWidget.validated = false;
        //>
        baseWidget.validateOnFormSubmit = function () {

            this.validated = false; //always reset the global var, so we dont get the previous validated value

            if (!val_req)
                return true; //no validation needed for this instance

            if (__internalCheckBox.checked)
                this.validated = true;


            if (this.validated)
                return true;

            else {
                //show color the forom feild red to indicate an error state
                this._widgetElement.parentNode.setStyle({
                    borderColor: "red",
                    borderWidth: "2px"
                });

                this._widgetElement.on("input", function () {//when the resumes typing clear the error state

                    this.target.parentNode.setStyle({
                        borderColor: " rgb(204, 204, 204)",
                        borderWidth: "1px"
                    });
                });


                return false; //stop the submission

            }

        };

        /**
         * Force validation
         * @function
         * @type Boolean
         * @name TigerJS.UI.Widget.TextCheckBoxWidgett#validate
         * @return {Boolean} returns true if the validation is successful else returns false
         */
        baseWidget.validate = function () {

            return this.validateOnFormSubmit();
        };
        //


        baseWidget._widgetElement.__toString = function () {
            return "[object TigerJS.CheckBoxWidget]";
        };
        //
        //
        //->   //overide appendTo Element
        baseWidget.appendToElement = function (parEl) {
            var p, __formNode = false;

            if (parEl.nodeType && parEl.nodeType === 1) {

                parEl.appendChild(baseWidget._widgetElement);
                p = T.$(parEl);
            } else
            if (T.isString(parEl)) {
                p = T.$(parEl);
                p.appendChild(baseWidget._widgetElement);

            }

            T.$(); /** Workaround for firefox Heirachy request Error BUG!! **/
            ;
            //see if we are been attached to a form so we can validate before submission

            //see if we are been attached to a form so we can validate before submission

            if ((T.type(p) === "HTMLFormElement") || (p = attachToForm))
                __formNode = true;
            __internalCheckBox.form = p;
            //attach a validation handler to the form

            if (__formNode && !p.onsubmit) {
                p.onsubmit = function () {
                    var el = this.elements, i;
                    for (i = el.length - 1; i >= 0; i--) { //we loop in reverse so the validation starts from the last filled element

                        //see if the Widget Object of this input has a validation interface
                        if (el[i].WidgetObj && el[i].WidgetObj.validateOnFormSubmit) {

                            //if validation fails, stop the form submision, (errors would be displayed from the validation method)
                            if (!el[i].WidgetObj.validate())
                                return false; //attempt to validate
                        }
                    }


                };
            }

            //>handle labels
            if (label) {
                var _widgetLabel = T.$(document.createElement("label"));
                _widgetLabel.className += " TSILabel";
                _widgetLabel.innerHTML = label;
                this._widgetElement.insertBefore(_widgetLabel, baseWidget._widgetElement._firstElementChild());


                //how its supposed to happen with real labels
                _widgetLabel.on("click", function () {
                    __internalCheckBox.focus();
                });
            }

            return this;
        };

        __internalCheckBox.WidgetObj = baseWidget; //attach the baseWidget to the internal checkbox
        //so we have access to the validate function, 
        //which would be called on all form elements

        return baseWidget;
    }

    return new __inputWidget(configurationOptions);
};
              