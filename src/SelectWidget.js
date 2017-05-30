/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

/**
 * @class
 * This class repreents a generic Custom Selection widget, that can be used for selecting single
 * or multiple items
 * @param {Object} configurationOptions  An object contaning configuration parameters for this widget
 
 * @param {Boolean} [configurationOptions.required = false] Specifies if the input is required and cannot be sent empty
 * @param {CSSColor} [configurationOptions.requiredTagColor = red] The value of the required indicator
 * @param {String} [configurationOptions.errorColor = red] The color of the error icon, when an error is present
 * @param {CSSColor} [configurationOptions.borderColor = transparent]  Border color
 * @param {CSSColor} [configurationOptions.backgroundColor = transparent] Background color for the widget
 * @param {CSSColor} [configurationOptions.onOpenBgColor] Background color for the widget in its expanded state
 * @param {CSSColor} configurationOptions.txtColor Widget's text Color, you should always specify this for consistency
 * @param {CSSColor} [configurationOptions.listTxtColor] Text color for the list items only, defaults to the Widget's text color
 * @param {CSSColor} [configurationOptions.hoverColor]  Background color, when the items\' on the list are hovered on
 * @param {CSSColor} [configurationOptions.headerElementColor]  color for the select header
 * @param {String} [configurationOptions.headerElementImg] A header image, pass the name
 * @param {CSSColor}  [configurationOptions.headerElementImgColor] Header image color, defaults to the headerElementColor
 * one of the SVG images budled with the library, and dont forget to call T.insert_svg_icons after adding the wiget to the DOM`.
 * 
 * @param {CSSColor} [configurationOptions.hoverTextColor]  Text color on hover, when the items\' on the list are hovered on
 * @param {Array} configurationOptions.optionText An Array containing text for the various selectable options, the first index should contain
 * the select's element header
 * @param {String} [configurationOptions.name] The name of the Select control to be used for submission
 * @param {String | HTMLFormElement } [configurationOptions.attachToForm] Associate this input with a form element, 
 *                                                   you could specify a DOM Node referencing the Form or the Form's id
 * 
 * 
 * 
 * @extends TigerJS.UI.Widget
 * 
 */

TigerJS.UI.Widget.SelectWidget = function (configurationOptions) {

    function __selectWidget(configurationOptions) {
//cretae a new T.UI.Widget instance
        var baseWidget = T.UI.Widget(),
                selectStyle = configurationOptions && configurationOptions.selectStyle ?
                configurationOptions.overlayStyle : "border",
                noColumns = configurationOptions && configurationOptions.columns ?
                configurationOptions.columns : 1,
                bdColor = configurationOptions && configurationOptions.borderColor ?
                configurationOptions.borderColor : "transparent",
                bgColor = configurationOptions && configurationOptions.backgroundColor ?
                configurationOptions.backgroundColor : "transparent",
                onOpenBgColor = configurationOptions && configurationOptions.onOpenBgColor ?
                configurationOptions.onOpenBgColor : false,
                listTxtColor = configurationOptions && configurationOptions.listTxtColor ?
                configurationOptions.listTxtColor : false,
                txtColor = configurationOptions && configurationOptions.txtColor ?
                configurationOptions.txtColor : "#000",
                oText = configurationOptions && configurationOptions.optionText ?
                configurationOptions.optionText : ['foo', 'bar', 'baz', 'plum'],
                hColor = configurationOptions && configurationOptions.hoverColor ?
                configurationOptions.hoverColor : false,
                hTextColor = configurationOptions && configurationOptions.hoverTextColor ?
                configurationOptions.hoverTextColor : false,
                _name = configurationOptions && configurationOptions.name ?
                configurationOptions.name : "",
                attachToForm = configurationOptions && configurationOptions.attachToForm ?
                T.$(configurationOptions.attachToForm) : false,
                val_req = configurationOptions && configurationOptions.required ?
                configurationOptions.required : false,
                val_req_color = configurationOptions && configurationOptions.requiredTagColor ?
                configurationOptions.requiredTagColor : "red",
                err_col = configurationOptions && configurationOptions.errorColor ?
                configurationOptions.errorColor.toString().trim() : "red",
                headerElementImg = configurationOptions && configurationOptions.headerElementImg ?
                configurationOptions.headerElementImg : "",
                headerElementImgColor = configurationOptions && configurationOptions.headerElementImgColor ?
                configurationOptions.headerElementImgColor : false,
                headerElementColor = configurationOptions && configurationOptions.headerElementColor ?
                configurationOptions.headerElementColor : "#000",
                val_req_color = configurationOptions && configurationOptions.requiredTagColor ?
                configurationOptions.requiredTagColor : "red";

///////////////////////////////////////////////////////////////////////////
        //reset The familyId and instance Id for this Widget
        ///All Widgets in this library should have a family and instance ID

        baseWidget.FamilyID = "SelectWidget";
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


        //the real select element
        var innerSelectElement = T.$(document.createElement("SELECT"));
        innerSelectElement.set_style({
            display: "none", width: "0px"
        });
        innerSelectElement.name = _name;


        //append options to select element
        for (var i = 0; i < oText.length; i++) {
            var o = document.createElement("OPTION");
            if (i === 0)
                o.value = "";
            else
                o.value = oText[i];

            innerSelectElement.add(o);

        }


        baseWidget._widgetElement.set_style({
            position: "relative", width: "70%",
            textAlign: "left", borderRadius: 0,
            height: "auto", minHeight: ".5em", minWidth: ".5em", cursor: "pointer",
            border: !bdColor && bgColor && bgColor !== "transparent" ? " solid 1px " + bgColor : "solid 1px " + bdColor,
            background: bgColor && bgColor !== "transparent" ? bgColor : "transparent",
            color: txtColor && txtColor !== "transparent" ? txtColor : "#000", fontSize: "1em",
            verticalAlign: 'middle',
            display: "block"

        });

        //the drop down initial state
        var listCollapsed = true, oList;

        baseWidget._widgetElement.add_class("TigerSmartDropDown");


//create the list header, including the header text
        var headerSpan = T.create("<span><span class=\"" + headerElementImg + "\"></span>" +
                "<span style=\'color:" + (headerElementColor || "#000") +
                ";opacity:.7; font-weight:bold\' class=\'headerText'\ >&#x0009;" + oText[0] + "</span></span>");//create the header element

        baseWidget._widgetElement.appendChild(headerSpan);//append it

        var headerElement = baseWidget._widgetElement.first_element_child();

        headerElement.set_style({
            fill: headerElementImgColor || headerElementColor || "#000",
            padding: "1.5em",
            paddingLeft: "5px",
            paddingRight: "5px",
            width: "100%"
        });

        for (var j = 0; j < headerElement.children.length; j++)
            headerElement.children[j].style.setProperty("fill", (headerElementImgColor || headerElementColor || "#000"));



        if (val_req) {//tif he input is required
//Create the required span
            var reqEl = T.$(document.createElement("span"));
            reqEl.className += " T-icons-svg";
            reqEl.set_style({fill: val_req_color,
                fontSize: ".6em",
                padding: "4px",
                width: "1em",
                textAlign: "center",
                cssFloat: "right",
                marginRight:"1em",
                opacity: 1});
            // reqEl.style.setProperty("opacity", 1.0, "important"); //dont blur out the required icon

            headerElement.appendChild(reqEl);

        }
        //append an arrow-icon to the header element
        headerElement.appendChild(T.create("<span style=\"display:inline-block; float:right; margin-right:1em; margin-top:.2em;" +
                "color:" + (headerElementColor || "#000") + ";opacity:.5;\" class=\" T-icons-chevron-up\"></span>"));

        var icon_arrow = headerElement.getElementsByClassName("T-icons-chevron-up")[0];
        //animate the arrow icon on Expand/Collapse
        icon_arrow.style.transition = "transform .5s";
        icon_arrow.style.msTransition = "-ms-transform .5s";
        icon_arrow.style.MozTransition = "-moz-transform .5s";
        icon_arrow.style.WebkitTransition = "-webkit-transform .5s";

        //show the list on click
        baseWidget._widgetElement.on("click", function () {
//append to the widget
            //we append to the parent div of the input element sice you cannot realistically append
            //to an input
            var error_indicated = document.querySelector("#" + baseWidget._widgetElement.id + " > .TigerFormErrorIcon");
            if (error_indicated) {
                error_indicated.parentNode.removeChild(error_indicated);
            }

            if (listCollapsed) {
                oList = T.$(document.createElement("UL"));
                oList.set_style({
                    width: "100%", listStyleType: "none", margin: "0px", padding: "0px",
                    fontSize: ".8em", display: "block"
                });

                //append the list items
                for (var i = 0; i < oText.length; i++) {//the first item is the header, so start from item 2
                    var _li = T.$(document.createElement("LI"));
                    _li.textContent = oText[i];
                    _li.style.padding = ".5em";
                    _li.style.paddingLeft = "1em";
                    _li.style.width = "100%";
                    _li.style.color = listTxtColor || txtColor;
                    _li.setAttribute("_indexVal", i);
                    oList.appendChild(_li);

                    _li.on("click", function () {
                        //when a a list item is clicked set the corresponding index on the select element

                        innerSelectElement.selectedIndex = this.target.getAttribute("_indexVal");

                        //set the content of the header to the clicked list item's content
                        //first see if the clicked element has the same text as the herader
                        //so we can keep the opacity low
                        var headerText = baseWidget._widgetElement.getElementsByClassName("headerText")[0];
                        headerText.innerHTML = "&#x0009;" + this.target.innerHTML;
                        if (headerText.innerHTML.strpos(oText[0]) >= 0) {
                            headerText.style.opacity = .4;
                        } else {

                            headerText.style.setProperty("opacity", 1.0, "important");
                        }

                        closeList();


                    }, 0);

                    _li.onmouseover = function () {
                        if (hColor)
                            this.style.backgroundColor = hColor;
                        if (hTextColor)
                            this.style.color = hTextColor;
                    };
                    _li.onmouseout = function () {
                        if (hColor)
                            this.style.backgroundColor = "transparent";
                        if (hTextColor)
                            this.style.color = listTxtColor || txtColor;
                    };
                }

                //append the list to the dropdown
                baseWidget._widgetElement.appendChild(oList);

                //turn the dropdown icon, since we're in expanded state
                icon_arrow.style.transform = "rotate(180deg)";

                //set the background color when the select-list is open
                baseWidget._widgetElement.style.backgroundColor = onOpenBgColor || bgColor;


                listCollapsed = false;//we are expanded so...
            } else {
                closeList();
            }


            function closeList() {//close the list

                if (!listCollapsed) {
                    listCollapsed = true;
                    //turn the dropdown icon back up
                    icon_arrow.style.transform = "rotate(0deg)";

                    //the remove the list items
                    oList = baseWidget._widgetElement.removeChild(oList);


                    if (bgColor && bgColor !== "transparent") { //set the background color when the select-list is closed
                        baseWidget._widgetElement.style.backgroundColor = bgColor;
                        //then color
                        baseWidget._widgetElement.style.color = txtColor;
                    }
                }
            }
            T.$(document.body).on("click", closeList);//close the list when we click out
        }, 0);

        /**
         * Returns the selected value
         * @function
         * @return {String}  The selected value
         *  @name TigerJS.UI.Widget.SelectWidget#get_selected_value
         */
        baseWidget.get_selected_value = function () {
            return innerSelectElement.options[innerSelectElement.selectedIndex].value;
        };

        //>
        baseWidget.validated = false;
        //>
        baseWidget.validate_on_form_submit = function () {
            this.validated = false; //always reset the global var, so we dont get the previous validated value

            if (!val_req)
                return true; //no validation needed

            var option_value_present = false, op_val;

            if (innerSelectElement.selectedIndex !== -1 && innerSelectElement.options[innerSelectElement.selectedIndex].value !== "") {
                this.validated = option_value_present = true;

            }

            if (this.validated)
                return true;

            else {
                //show an error icon and return false (so the form doesnt get submitted)
                var err_icon = document.createElement("span");
                err_icon.className += " TigerFormErrorIcon icon-error_outline";
                err_icon.style.left = "103%";
                err_icon.style.color = err_col;
                err_icon.style.position = "absolute";
                err_icon.style.fontSize = "1.2em";
                err_icon.style.marginLeft = ".1em";
                err_icon.style.width = "auto";
                err_icon.style.zIndex = "500";


                //
                //append to the widget
                //we append to the parent div of the input element sice you cannot realistically append
                //to an input
                var error_indicated = document.querySelector("#" + baseWidget._widgetElement.id + " > .TigerFormErrorIcon");
                if (!error_indicated) {
                    this._widgetElement.appendChild(err_icon);
                }


                return false; //stop the submission

            }
            ;
        };

        /**
         * Force validation
         * @function
         * @type Boolean
         * @name TigerJS.UI.Widget.TextCheckBoxWidgett#validate
         * @return {Boolean} returns true if the validation is successful else returns false
         */
        baseWidget.validate = function () {

            return this.validate_on_form_submit();
        };
        //


        //
        //->   //overide appendTo Element
        baseWidget.append_to_element = function (parEl) {
            var p, __formNode = false;

            if (parEl.nodeType && parEl.nodeType === 1) {

                parEl.appendChild(baseWidget._widgetElement);
                p = T.$(parEl);
            } else
            if (T.is_string(parEl)) {
                p = T.$(parEl);
                p.appendChild(baseWidget._widgetElement);

            }

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
                        if (el[i].WidgetObj && el[i].WidgetObj.validate_on_form_submit) {

                            //if validation fails, stop the form submision, (errors would be displayed from the validation method)
                            if (!el[i].WidgetObj.validate())
                                return false; //attempt to validate
                        }
                    }


                };
            }

            return this;
        };
        baseWidget._widgetElement.appendChild(innerSelectElement);

        //
        innerSelectElement.WidgetObj = baseWidget;

        baseWidget._widgetElement.__to_string = function () {
            return "[object TigerJS.SelectWidget]";
        };

        return baseWidget;
    }

    return new __selectWidget(configurationOptions);

};
