    /* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2016 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */

/**
 * @class
 * This class repreents a basic text input, that can be customized with a plethora of options,
 * The Input can be created as a plain text input an email input,
 * a date input , a url input feild or a password feild by passing the appriopriate type
 * <pre>
 * Note**
 * 
 * If adjusting the style properties, using CSS, you may need to use the (!important keyword to ovveride some values)
 
 * </pre>
 * @param {Object} configurationOptions  An object contaning configuration parameters for this widget
 * @param {String} [configurationOptions.type = text]  The input type, currently supported types are:
 * <pre>
 * text | number | password | date | email | url;
 * </pre>
 * @param {CSSColor} [configurationOptions.backgroundColor = transparent]  background color for this widget, 
 * @param {CSSColor} [configurationOptions.textColor = #000] text color for this widget 
 * @param {CSSColor} [configurationOptions.borderColor = "#ccc"] border color for this widget 
 * @param {CSSColor} [configurationOptions.hoverBorderColor] border color on hover/focus/active state 
 * @param {String} [configurationOptions.textAlign = left] Text Alignment value, could be one of left | right | center
 * @param {String} [configurationOptions.placeHolder] PlaceHolderText
 * @param {CSSColor} [configurationOptions.placeHolderColor] PlaceHolderText color
 * @param {String} [configurationOptions.placeHolderImg] A place holder image, pass the name
 * one of the SVG images budled with the library, and dont forget to call T.insertS* @param {String} [configurationOptions.placeHolderImg] A place holder image, pass the name
 * one of the SVG images budled with the library, and dont forget to call T.insertSCGIcons after adding the wiget to the DOM`.
 * GIcons after adding the wiget to the DOM`.
 * 
 * @param {Boolean} [configurationOptions.required = false] Specifies if the input is required and cannot be sent empty
 * @param {CSSColor} [configurationOptions.requiredTagColor = red] The value of the required indicator
 * @param {Boolean} [configurationOptions.disabled = false] Should the control be disabled
 * @param {Boolean} [configurationOptions.readOnly = false] Should the control be rendered readOnly. 
 * @param {String} [configurationOptions.value] The default value of the input element
 * @param {String} [configurationOptions.name] The name property sets or returns the value of the name attribute of an input field.
 * Remember only form elements with a name attribute will have their values passed when submitting a form.
 * @param {String} [configurationOptions.validateAs] The type of String to validate the text feild as currently Supports either of 
 * <pre>
 * email | url | number
 * </pre>
 * @param {String | HTMLFormElement } [configurationOptions.attachToForm] Associate this input with a form element, 
 *                                                   you could specify a DOM Node referencing the Form or the Form's id
 * 
 
 *  @param {String} [configurationOptions.label] The label for this control
 * @param {String} [configurationOptions.errorColor = red] The color of the error icon
 * @param {Number} [configurationOptions.step = 0] specifies the legal intervals, valid only if this feild is designated as a number feild
 * @param {Number} [configurationOptions.min] minimum value of this feild, valid only if this feild is designated as a number feild
 * @param {Number} [configurationOptions.max] maximum value of this feild, valid only if this feild is designated as a number feild
 * 
 * @param {String} [configurationOptions.pattern] Custom RegExp pattern to use for validating the input
 * @param {Object} [configurationOptions.datePickConfig]  if creating an input of type date use this object to create configuration options
 * for the date picker, possible values and properties can be found in the documentation of {@link TigerJS.UI.Widget.CalendarWidget}
 * 
 * 
 * @extends TigerJS.UI.Widget
 * 
 */


TigerJS.UI.Widget.TextInputWidget = function (configurationOptions) {

    function __inputWidget(configurationOptions) {
//cretae a new T.UI.Widget instance
        var baseWidget = T.UI.Widget({elementType: "input"}),
                type = configurationOptions && configurationOptions.type ?
                configurationOptions.type : "text",
                bgColor = configurationOptions && configurationOptions.backgroundColor ?
                configurationOptions.backgroundColor : "transparent",
                bdColor = configurationOptions && configurationOptions.borderColor ?
                configurationOptions.borderColor : "#ccc",
                tColor = configurationOptions && configurationOptions.textColor ?
                configurationOptions.textColor : "#000",
                hColor = configurationOptions && configurationOptions.hoverBorderColor ?
                configurationOptions.hoverBorderColor : null,
                tAlign = configurationOptions && configurationOptions.textAlign ?
                configurationOptions.textAlign : null,
                pHolder = configurationOptions && configurationOptions.placeHolder ?
                configurationOptions.placeHolder : null,
                pHolderColor = configurationOptions && configurationOptions.placeHolderColor ?
                configurationOptions.placeHolderColor : "#ccc",
                pHolderImg = configurationOptions && configurationOptions.placeHolderImg ?
                configurationOptions.placeHolderImg : null,
                val_req = configurationOptions && configurationOptions.required ?
                configurationOptions.required : false,
                val_req_color = configurationOptions && configurationOptions.requiredTagColor ?
                configurationOptions.requiredTagColor : "red",
                disable = configurationOptions && configurationOptions.disabled ?
                configurationOptions.disabled : false,
                readOnly = configurationOptions && configurationOptions.readOnly ?
                configurationOptions.readOnly : false,
                name = configurationOptions && configurationOptions.name ?
                configurationOptions.name.toString().trim() : false,
                value = configurationOptions && configurationOptions.value ?
                configurationOptions.value.toString().trim() : false,
                validate_as = configurationOptions && configurationOptions.validateAs ?
                configurationOptions.validateAs.toString().trim() : false,
                pattern = configurationOptions && configurationOptions.pattern ?
                configurationOptions.pattern.toString().trim() : false,
                err_col = configurationOptions && configurationOptions.errorColor ?
                configurationOptions.errorColor.toString().trim() : "red",
                label = configurationOptions && configurationOptions.label ?
                configurationOptions.label.toString().trim() : false,
                step = configurationOptions && configurationOptions.step ?
                parseInt(configurationOptions.step) : 0,
                min = configurationOptions && configurationOptions.min ?
                parseInt(configurationOptions.min) : false,
                max = configurationOptions && configurationOptions.max ?
                parseInt(configurationOptions.max) : false,
                datePickConfig = configurationOptions && configurationOptions.datePickConfig ?
                configurationOptions.datePickConfig : false,
                attachToForm = configurationOptions && configurationOptions.attachToForm ?
                T.$(configurationOptions.attachToForm) : false;


        //reset the type && validation scheme based on the input type
//put the input element into a div container, so we can add placeholder images beside the input
        var textContainer = T.$(document.createElement("div"));

        switch (type) {
            case "password":
                pHolderImg = pHolderImg || "T-icons-lock";
                break;
            case "date":
                pHolderImg = "T-icons-calendar-check-o";
                validate_as = false;
                break;
            case "number": //you cant input any other value in the number type anyway..
                validate_as = "number";
                break;
            case "url":
                pHolderImg = "T-icons-globe-2";
                validate_as = "url";
                break;

            case "email":
                validate_as = "email";

                break;

        }//we do not have a case for the text type as that can be validated as anything
        textContainer.appendChild(baseWidget._widgetElement);

        textContainer.on("click", function () {
            baseWidget._widgetElement.focus(); //focus the actual input element
        }, false);
///////////////////////////////////////////////////////////////////////////
        //reset The familyId and instance Id for this Widget
        ///All Widgets in this library should have a family and instance ID

        baseWidget.FamilyID = "TextInputWidget";
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
        //give the parent div an id
        textContainer.id = baseWidget._widgetElement.id + "ContainerNode";
        //give the parent div a class
        textContainer.className += " TSIContainer";


/////////////////////////////////////////////////////////////////////////////////


/////////////////////////// //set some HTML5 data, just for fun.. ////////////////////////////
        //the _widgetElement is the actual DOM Element so..
        baseWidget._widgetElement.setData(baseWidget.FamilyID, baseWidget.InstanceID);
        baseWidget._widgetElement.setAttribute("type", "text");
        var inputType = baseWidget._widgetElement.getAttribute("type").trim();
        //
        //                  
        baseWidget._widgetElement.className += " TigerSmartInput";


//////////////////////////// //////////////////END SOME ATTR FOR THEWIDGET//////////////////////       


///////////// //////////////////SPARSE CONFIGURATION PARAMETERS//////////////////////
        if (attachToForm ) {
            baseWidget._widgetElement.form = attachToForm ;
        }
        if (tColor) {
            baseWidget._widgetElement.style.color = tColor;
            baseWidget._widgetElement.parentNode.style.color = tColor;
        }
        if (pHolder) {

            baseWidget._widgetElement.setAttribute("placeholder", pHolder);
        }
        if (pHolderColor) {

//This dynamically creates a new stylesheet element for the placeholder texts
            T.addCSSBlob("#" + baseWidget._widgetElement.id + "[type='" + inputType + "']:-ms-input-placeholder" +
                    "{color:" + pHolderColor + " !important;opacity:.5 !important}" +
                    "#" + baseWidget._widgetElement.id + "[type='" + inputType + "']::-webkit-input-placeholder" +
                    "{color:" + pHolderColor + " !important;opacity:.5 !important}" +
                    "#" + baseWidget._widgetElement.id + "[type='" + inputType + "']::-moz-placeholder" +
                    "{color:" + pHolderColor + " !important;opacity:.5 !important}" +
                    "#" + baseWidget._widgetElement.id + "[type='" + inputType + "']:-moz-placeholder" +
                    "{color:" + pHolderColor + " !important;opacity:.5 !important}");
        }
        if (pHolderImg) {
//create the placeholder-image element
            var pHolderImgElement = T.$(document.createElement("span"));
            pHolderImgElement.className += ' ' + pHolderImg;
            pHolderImgElement.setStyle({fill: (pHolderColor ? pHolderColor : "#ccc")});

            //insert into the input elements container
            baseWidget._widgetElement.parentNode.insertBefore(pHolderImgElement, baseWidget._widgetElement);

        }
        if (bgColor) {//background color
//the input is in a container div so set styles on the container also

            baseWidget._widgetElement.style.setProperty("background-color", bgColor, "important");
            baseWidget._widgetElement.parentNode.style.setProperty("background-color", bgColor, "important");
        }
        if (bdColor) {//border colors
            baseWidget._widgetElement.parentNode.style.borderColor = bdColor;
            baseWidget._widgetElement.parentNode.style.borderStyle = "solid";
            baseWidget._widgetElement.parentNode.style.borderWidth = "1px";
            baseWidget._widgetElement.style.borderColor = "none";
        }

        if (hColor) { //hover/active/focus border color
            var borderDefaultColor = baseWidget._widgetElement.parentNode.style.borderColor ?
                    baseWidget._widgetElement.parentNode.style.borderColor :
                    baseWidget._widgetElement.parentNode.getStyle()["borderColor"];

            //use CSS to control hover states (more effective than from JS)
            T.addCSSBlob(" #" + baseWidget._widgetElement.parentNode.id + ":hover" +
                    " { border-color:" + hColor + " !important}");
            baseWidget._widgetElement.oninput = function () {//remain in the hover state while recieving input
                this.parentNode.style.borderColor = hColor;
            };
            baseWidget._widgetElement.onfocus = function () {//remain in the hover state while recieving focus
                this.parentNode.style.borderColor = hColor;
            };
            baseWidget._widgetElement.onblur = function () {
                this.parentNode.style.borderColor = borderDefaultColor;
            };
        }
        if (tAlign) {
            baseWidget._widgetElement.style.textAlign = tAlign;
        }
        if (val_req) {//the input is required
//Create the required span
            var reqEl = T.$(document.createElement("span"));
            reqEl.className += " T-icons-svg";
            reqEl.setStyle({color: val_req_color, fill: val_req_color,fontSize: ".6em",
                width: "1em", textAlign: "center", cssFloat: "right"});

            baseWidget._widgetElement.parentNode.appendChild(reqEl);

        }

        /**
         * Sets or returns whether a input Widget is read-only
         * @param {Boolean} readonly Boolean to specify whether the input widget is read only 
         * @function
         * @return {TigerJS.UI.Widget.TextInputWidget | Boolean}
         * @name TigerJS.UI.Widget.TextInputWidget#readOnly
         */
        baseWidget.readOnly = function (readonly) {
            if (readonly && T.isBoolean(readonly)) {
                baseWidget._widgetElement.readOnly = readonly;
                return this;
            }
            return baseWidget._widgetElement.readOnly || false;
        };
        if (readOnly) {//they sent a readonly attribute value
            baseWidget.readOnly(readOnly);
        }

        /**
         * Sets or returns whether the widget is disabled or not
         * @param {Boolean} _disable Boolean to denote if we should disable the conrol or not
         * @function
         * @type TigerJS.UI.Widget.TextInputWidget | Boolean
         * @name TigerJS.UI.Widget.TextInputWidget#isDisabled
         */
        baseWidget.isDisabled = function (_disable) {

            if (Boolean(_disable) === true) {

                this._widgetElement.disabled = _disable;
                this._widgetElement.style.setProperty("color", "#ccc", "important");
                return this;

            } else if (Boolean(_disable) === false) {
                this._widgetElement.disabled = _disable;
                this._widgetElement.style.setProperty("color", tColor, "important");

                return this;
            }

            return baseWidget._widgetElement.disabled;
        }
        ;
        if (disable) {
            baseWidget.isDisabled(disable);
        }

        /**
         * Sets or returns the name of the Input Widget
         * @param {String} name Specifies the name of the Input Widget
         * @function
         * @name TigerJS.UI.Widget.TextInputWidget#name
         * @return {TigerJS.UI.Widget.TextInputWidget | String}
         */
        baseWidget.name = function (name) {
            if (name) {
                baseWidget._widgetElement.name = name;
                return this;
            }
            return baseWidget._widgetElement.name;
        };
        if (name) {
            baseWidget.name(name);
        }

        /**
         * Sets or returns the value attribute of the Input Widget
         * @param {String} value Specifies the value of the Input Widget
         * @function
         * @return {TigerJS.UI.Widget.TextInputWidget | String}
         * @name TigerJS.UI.Widget.TextInputWidget#value
         */
        baseWidget.value = function (value) {
            if (value) {
                baseWidget._widgetElement.value = value;
                return this;
            }
            return baseWidget._widgetElement.value;
        };
        if (value) {
            baseWidget.value(value);
        }

        baseWidget.validated = false;

        //>
        //set the visual error state if validation fails
        baseWidget.setVisualErrorState = function () {
            //show color the forom feild red to indicate an error state

            this._widgetElement.parentNode.setStyle({
                borderColor: "red",
                borderWidth: "2px"
            });

            this._widgetElement.on("input change", function () {//when the resumes typing clear the error state


                this.target.parentNode.setStyle({
                    borderColor: " rgb(204, 204, 204)",
                    borderWidth: "1px"
                });
            });


        };

        //>
        baseWidget.validateOnFormSubmit = function (_pattern, BAD_PATTERN_FLAG) {

            if (!val_req)
                return true; //no validation needed

            this.validated = false; //always reset the global var, so we dont get the previous validated value
            var vt = validate_as, val = baseWidget._widgetElement.value.trim();

            if (!validate_as && _pattern && val !== "") {//they sent their own regex

                if (_pattern.test(val)) {//user pattern to validate

                    //see if we are to coerce a truthy validation as false

                    if (BAD_PATTERN_FLAG) {
                        //this.validated = false; //no need, already false from above

                        this.setVisualErrorState();
                    } else
                        this.validated = true;

                    return this.validated;

                } else { //pattern did not validate

                    //so set validated flag to false, except we where validating on a BAD_PATTERN, in which case set to true
                    if (BAD_PATTERN_FLAG) {
                        this.validated = true;

                    } else {
                        //no BAD_PATTERN flag just return the real validation status
                        this.validated = false;
                        this.setVisualErrorState();
                    }

                    return this.validated;

                }

            }

            if (validate_as && !_pattern && val !== "") {

                //validate
                switch (vt) {
                    case "url":
                        val = val.indexOf("://") > -1 ? val : "http://" + val; //append a fake protocol to play nice with the parser's regex

                        var parser = TigerJS.Parser.parseAddress("web", val);
                        if (parser && parser.length === 1)
                            this.validated = true; //we need just a match


                        break;
                    case "email":


                        var parser = TigerJS.Parser.parseAddress("mail", val); //we need just a match
                        if (parser && parser.length === 1)
                            this.validated = true;
                        break;
                    case "number":

                        var parser = TigerJS.Parser.parseNumber(val);
                        if (parser && parser.length === 1)//we need just a match
                            this.validated = true;

                        //check the number range
                        if (min && val < min)
                            this.validated = false;
                        if (max && val > max)
                            this.validated = false;

                        break;
                    default:
                        break;
                }

            }


            //set validation to true for certain types, if we have valid values
            if (!validate_as && !_pattern && val !== "") {
                switch (type) {
                    case "password":
                    case "text":
                        this.validated = true;
                        break;
                    case "date":

                        if (val !== "mm dd yyyy" && val !== pHolder)//if the date widget's value isnt one of the defaults
                            this.validated = true;

                        break;
                }
            }

            //check state and report error if we didnt validate
            if (this.validated) {

                return true;
            } else {

                this.setVisualErrorState();

                return false; //

            }
        }
        ;
        /**
         * Force validation
         * @function
         * @type Boolean  
         * @name TigerJS.UI.Widget.TextInputWidget#validate
         * @argument {RegExp} [pattern] A regexp object to use for validation
         * @argument {Boolean} [reverse_validate] If a pattern argument is given and it validates,
         *                     set return value to false and set all error state, else if it doesnt
         *                     validate set return value to true
         * @return {Boolean} returns true if the validation is successful else returns false
         */
        baseWidget.validate = function (pattern, reverse_validate) {

            return this.validateOnFormSubmit(pattern ? pattern : null,
                    reverse_validate && Boolean(reverse_validate) === true ? true : false);
        };
        //
        //->       //ovveride toString
        baseWidget._widgetElement.__toString = function () {
            return "[object TigerJS.TextInputWidget]";
        };
        //
        //
        //->   //overide appendTo Element
        baseWidget.appendToElement = function (parEl) {
            var p, __formNode = false;

            if (parEl.nodeType && parEl.nodeType === 1) {

                parEl.appendChild(baseWidget._widgetElement.parentNode);
                p = T.$(parEl);
            } else
            if (T.isString(parEl)) {
                p = T.$(parEl);
                p.appendChild(baseWidget._widgetElement.parentNode);

            }

            document.createElement("SPAN"); /** Workaround for firefox Heirachy request Error BUG!! -- Just MAKE A  call that accesses the dom after your insertion**/
            ;
            //see if we are been attached to a form so we can validate before submission

            if ((T.type(p) === "HTMLFormElement") || (p = attachToForm))
                __formNode = true;


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
                var l = T.$(document.createElement("div"));
                l.className += " TSILabel";
                l.innerHTML = label;
                this._widgetElement.parentNode.insertBefore(l, baseWidget._widgetElement.parentNode._firstElementChild());
                //how its supposed to happen with real labels
                l.on("click", function () {
                    baseWidget._widgetElement.focus();
                });
            }

           

            return this;
        };
        //> More public API methods

        /*
         *  
         */

        //
        //
        //->       //ovveride toString
        baseWidget._widgetElement.__toString = function () {
            return "[object TigerJS.TextInputWidget]";
        };

        /*
         * After all said and done we now modify the widget depending on the type the user sent, we are basically
         * ovveriding all browser handling of the type attribute, or at least as much as we can
         * 
         */
        switch (type) {
            case "password":
                baseWidget._widgetElement.type = type;
                break;
            case "date":

                baseWidget._widgetElement.readOnly = true; //make the feild read only
                baseWidget._widgetElement.value = pHolder || "mm dd yyyy"; //our date format
                baseWidget._widgetElement.style.opacity = ".5";
                //show a date picker on click

                baseWidget._widgetElement.parentNode.on("click", function (e) {

                    //remove any error tooltip in view
                    var errTip = document.querySelector("#" + baseWidget._widgetElement.parentNode.id + " > .TigerFormErrorIcon");
                    if (errTip)
                        errTip.parentNode.removeChild(errTip);

                    var calenderConfig = datePickConfig || {};

                    //get the last date value
                    var val = baseWidget._widgetElement.getData("dateVal"),
                            currentDateVal = isNaN(new Date(val)) ? new Date() : (new Date(val || ""));

                    if (!calenderConfig.hoverColor)//minimum style to be set for the calendar
                        calenderConfig.hoverColor = "#DC143C";

                    //set the callback when a date is selected
                    calenderConfig.dateClickCB = function (date, calObj) {

                        var _date = "%02s".sprintf((date.getDate())); //get the date padded to 2 characters minimum

                        //get the short month name
                        var month = date.getMonth(true, true); //display as per set locale
                        var year = date.getFullYear();

                        //set the date value on the input
                        baseWidget._widgetElement.value = month + " " + _date + " " + year;
                        baseWidget._widgetElement.style.opacity = "1";

                        //IE 10 doesnt support new Date(mm dd yyyy) string, so we have to use slashes
                        //cuz this would be used to build up the dates on next call
                        baseWidget._widgetElement.setData("dateVal", (date.getMonth() + 1) + "/" + _date + "/" + year);
                        baseWidget._widgetElement.setData("lastLocaleUsed", date.getLocale()); //save the locale

                        //destroy....
                        calObj.destroy();

                        baseWidget._widgetElement.fire("change"); //atimes the change event just doen't fire
                    };

                    //make sure a date picker is not already in view
                    var prevDatePckr = document.querySelector("#" + baseWidget._widgetElement.parentNode.id + " > .TigerSmartCalendar");
                    if (prevDatePckr) {
                        return;
                    }
                    //create a new calendar
                    var cal = T.UI.Widget.CalendarWidget(calenderConfig);

                    cal.Node.style.top = parseInt(baseWidget._widgetElement.parentNode.offsetHeight) + "px";

                    cal.Node.style.zIndex = "1001";

                    var lastUsedLocale = baseWidget._widgetElement.getData("lastLocaleUsed");
                    //persist locales
                    if (lastUsedLocale)
                        cal.setLocaleID(lastUsedLocale);
                    cal.appendToElement(baseWidget._widgetElement.parentNode);

                    cal.Node.style.left = (baseWidget._widgetElement.parentNode.offsetWidth - cal.Node.offsetWidth) / 2 + "px";


                    //set the date
                    cal.setView(currentDateVal.getFullYear(), currentDateVal.getMonth());

                    T.$(document.body).on("click", function () {
                        var calInView = document.querySelector("#" + baseWidget._widgetElement.parentNode.id + " > .TigerSmartCalendar");
                        if (calInView) {
                            calInView.WidgetObj.destroy();
                        }
                    });


                });

                break;
            case "number":// number type we'll put elements to manually increase or decrease

                //>set the initial value of the widget
                baseWidget._widgetElement.value = value || 0;
                var numberControlsContainer = T.$(document.createElement("div"));
                numberControlsContainer.className += " numberControlsContainer";
                numberControlsContainer.setStyle({
                    display: "inline-block", width: "8%", height: "1.5em",
                    position: "relative", cssFloat: "right", marginRight: "3%", textAlign: "center", marginTop: "-.2em"
                });

                //insert the controls box, into the input widget container
                if (val_req) {
                    baseWidget._widgetElement.parentNode.appendChild(numberControlsContainer); //, baseWidget._widgetElement.parentNode._lastElementChild());

                    //reduce the input with to allow for space for the controls
                    baseWidget._widgetElement.style.setProperty("width", "70%", "important");
                } else {
                    baseWidget._widgetElement.parentNode.appendChild(numberControlsContainer);
                }

//create the increase element
                var incButton = T.$(document.createElement("span")); //
                incButton.setStyle({
                    cssFloat: "left", width: "97%", height: "45%", textAlign: "center",
                    fontSize: ".8em ", color: tColor
                });
                incButton.innerHTML = "&#9650;";
                incButton.className += " NumberfeildIncreaseElement";
                incButton.selectable(false);

                //create the decrease element
                var decButton = T.$(document.createElement("span")); //
                decButton.setStyle({
                    cssFloat: "left", width: "97%", height: "45%", textAlign: "center",
                    fontSize: ".8em ", color: tColor
                });
                decButton.innerHTML = "&#9660;";
                decButton.className += " NumberfeildDecreaseElement";
                decButton.selectable(false);

                //set styles for hover state of buttons
                T.addCSSBlob("#" + baseWidget._widgetElement.parentNode.id + " > .numberControlsContainer > .NumberfeildIncreaseElement:hover, " +
                        "#" + baseWidget._widgetElement.parentNode.id + " > .numberControlsContainer > .NumberfeildDecreaseElement:hover{ " +
                        "color:" + (hColor && (hColor !== tColor) ? hColor : "#ccc") + " !important; cursor: default}");

                //insert buttons into DOM 
                numberControlsContainer.appendChild(incButton);
                numberControlsContainer.appendChild(decButton);

                //onclick handler's for incrementing/decreamenting actions
                incButton.on("click", function () {


                    var errTip = document.querySelector("#" + baseWidget._widgetElement.parentNode.id + " > .TigerFormErrorIcon");
                    if (errTip)
                        errTip.parentNode.removeChild(errTip);

                    var val = parseInt(baseWidget._widgetElement.value);


                    if (step)
                        val += step;
                    else
                        val += 1;
                    if (!max || (max && val <= max))
                        baseWidget._widgetElement.value = val;
                });

                decButton.on("click", function () {

                    var errTip = document.querySelector("#" + baseWidget._widgetElement.parentNode.id + " > .TigerFormErrorIcon");
                    if (errTip)
                        errTip.parentNode.removeChild(errTip);

                    var val = parseInt(baseWidget._widgetElement.value);
                    if (isNaN(val))
                        val = 0;

                    if (step)
                        val -= step;
                    else
                        val -= 1;
                    if (!min || (min && val >= min))
                        baseWidget._widgetElement.value = val;
                });
                break;
        }
//return the input widget Object
        return baseWidget;
    }

    return new __inputWidget(configurationOptions);
}
;