/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2016 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */


/**
 * @class
 * This Object which is a sub class of {@link TigerJS.UI.Widget}
 * Provides functionality for creating dynamic calendars/date pickers and their logic
 * @param {Object} configurationOptions An object contaning configuration parameters for this widget
 * @param {String} [configurationOptions.theme = w-white-theme] theme for the calendar, defaults to white theme
 * @param {Number} [configurationOptions.top = 5em]  The widget's top position in CSS units
 * @param {Number} [configurationOptions.left = 5em] The widget's left position in CSS units
 * @param {CSSColor} [configurationOptions.backgroundColor = none] Default background color of this widget, set this if you are
 * not using a prdefined theme
 * @param {CSSColor} [configurationOptions.textColor] Default text color of this widget set this if you are
 * not using a prdefined theme
 * @param {CSSColor} [configurationOptions.hoverColor = none]  text color on hover state
 * @param {CSSColor} [configurationOptions.dateHoverColor = #ccc]   background-color for dates on hover state
 * @param {CSSColor} [configurationOptions.selectedDateColor = #ccc]   color for the selected date
 * @param {CSSColor} [configurationOptions.localeColor]   The color for the locale link
 * @param {String} [configurationOptions.locale = en] The locale setting for the calender. See the documentation for (@link TigerJS.Date} for details
 * @param {Function} configurationOptions.dateClickCB This function would be called with a {@link TigerJS.Date} Object, refelecting the current date
 * , and the widget instance as the second argument
 *
 * @param {Array} configurationOptions.disbledDates This is An array of arrays specifying days that should be disabled, the array indexes should contain
 * arrays specifying start and end ranges for the dates you want to disable or an index could contain a an array with a single element
 * to disable just that date
 *
 * <pre>
 * The disable date property could be set as thus
 *
 * disabledDates : [ [2,6], [16], [24,30] ]
 *
 * Which means date 2 to 6, 16 and 24 to 30 would be disabled
 *
 * </pre>
 *
 * @name TigerJS.UI.Widget.CalendarWidget
 * @extends TigerJS.UI.Widget
 *
 * @example
 var cal = T.UI.Widget.CalendarWidget({
 locale: "en",
 hoverColor: "#fff",
 left: "25em",
 top:"10em",
 theme:"w3-orange-theme",
 localeColor:"#fff"
 });
 
 
 cal.appendToElement("bd");
 cal.setDraggable(); incase you want to move it around
 *
 */

TigerJS.UI.Widget.CalendarWidget = function (configurationOptions) {

    function __tcal(configurationOptions) {
        /*create a new T.UI.Widget instance*/
        var baseWidget = T.UI.Widget(), calendarDate = T.Date(),
                theme = configurationOptions && configurationOptions.theme ?
                configurationOptions.theme : "w3-white-theme", //default to white theme

                bgColor = configurationOptions && configurationOptions.backgroundColor ?
                configurationOptions.backgroundColor : null,
                tColor = configurationOptions && configurationOptions.textColor ?
                configurationOptions.textColor : null,
                hColor = configurationOptions && configurationOptions.hoverColor ?
                configurationOptions.hoverColor : null,
                dateHColor = configurationOptions && configurationOptions.dateHoverColor ?
                configurationOptions.dateHoverColor : "#ccc",
                wTop = configurationOptions && configurationOptions.top ?
                configurationOptions.top : "5em",
                wLeft = configurationOptions && configurationOptions.left ?
                configurationOptions.left : "5em",
                localeColor = configurationOptions && configurationOptions.localeColor ?
                configurationOptions.localeColor : null,
                dateClickCB = configurationOptions && configurationOptions.dateClickCB ?
                configurationOptions.dateClickCB : null,
                selectedDateColor = configurationOptions && configurationOptions.selectedDateColor ?
                configurationOptions.selectedDateColor : null,
                _disabledDates = configurationOptions && configurationOptions.disabledDates ?
                [].concat(configurationOptions.disabledDates) : null,
                dateCellIterator = T.Iterator(), currentTime = new Date(),
                localeButton = T.$(document.createElement("a")); //

        //create the disbled dates array
        if (_disabledDates) {
            //
            var disabledDatesIterator = T.Iterator(), i;

            for (i = 0; i < _disabledDates.length; i++) {

                if (_disabledDates[i].length === 1) { //single element range, just add
                    disabledDatesIterator.add(_disabledDates[i][0]);

                } else {/*fill the iterator with the range of numbers*/
                    var start = _disabledDates[i][0], end = _disabledDates[i][1];

                    disabledDatesIterator.fill((_disabledDates[i][1] - _disabledDates[i][0]) + 1,
                            function () {

                                return function () {// we use a closre to return the values till we reach the end of the range


                                    if (start <= end)
                                        return start++; //this line returns the value of start, then increments it immediately after
                                    //hopefully this would work in all runtimes
                                }();

                            }); // end fill
                }
            }
        }


        if (configurationOptions && configurationOptions.locale)//set locale if given
            calendarDate.setLocale(configurationOptions.locale);
///////////////////////////////////////////////////////////////////////////
        //reset The familyId and instance Id for this Widget
        ///All Widgets in this library should have a family and instance ID

        baseWidget.FamilyID = "CalenderWidget";
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
/////////////////////////////////////////////////////////////////////////////////

        /////////////////// //set some HTML5 data, just for fun.. ////////////////////////////
        //the _widgetElement is the actual DOM Element so..
        baseWidget._widgetElement.setData(baseWidget.FamilyID, baseWidget.InstanceID);
///////////// //////////////////SET SOME STYLES FOR THE CALENDER WIDGET//////////////////////
        baseWidget._widgetElement.setStyle({
            width: "100%", height: "100%", minWidth: "16em", minHeight: "14em", borderRadius: "0",
            top: wTop, left: wLeft, maxWidth: "18em", maxHeight: "14em"

        });
        baseWidget._widgetElement.className += " w3-card-4 widgetContainer TigerSmartCalendar"; // ";
        if (bgColor) {//expilict background
            baseWidget._widgetElement.style.setProperty("background-color", bgColor, "important");
        } else if (theme) {
            baseWidget._widgetElement.addClass(theme);
        }

        baseWidget._widgetElement.on("click", function () {

            this.stopPropagation();
            this.stopImmediatePropagation();

        });
        baseWidget._widgetElement.selectable(false);
//////////////////////////////////END BASIC STYLING... FOR NOW ////////////////////////////

//->
///////////////CREATE THE CALENDAR'S HEARDER////////////////////////////////////
        var calendarHeader = T.$(document.createElement("div")); //the header element
        calendarHeader.id = baseWidget.InstanceID + "_headerElement";
        calendarHeader.setStyle({
            width: "100%", height: "12%", textAlign: "center"
        });
//->
//        /***************CREATE PREVIOUS BUTTON****************************/
        ////element for moving the calendar to the previous view

        var prevButton = T.$(document.createElement("span")); //
        prevButton.setStyle({
            display: "inline-block", width: "8%", height: "60%", textAlign: "center", cssFloat: "left",
            borderRadius: "4em", margin: "6px 0px 0px 2px", fontSize: ".8em ", cursor: "pointer"
        });
        prevButton.innerHTML = "&#9668;";
        prevButton.addClass("t-no-drag");
        //if we have a theme set, or an explicit color
        if (tColor) {

            prevButton.style.setProperty("color", tColor, "important");
        } else if (theme)
            prevButton.addClass(theme);
        //control hover state
        if (hColor) {
            prevButton.oldColor = prevButton.style.color; //save a reference to the old color
            prevButton.onmouseover = function () {

                this.style.setProperty("color", hColor, "important");
            };
            prevButton.onmouseout = function () {
                this.style.setProperty("color", this.oldColor);
            };
        }
        prevButton.on("click", function () {
            baseWidget.setView(null, null, "p"); //move to the next view
        });
        prevButton.on("click", function () {
            baseWidget.setView(null, null, "p"); //move to the next view
        });
//->
//       /******** Create YEAR place holder *********/
        var calYearPlaceholder = T.$(document.createElement("span"));
        calYearPlaceholder.setStyle({
            display: "inline-block", width: "auto", height: "86%", paddingTop: "5px",
            fontSize: "1em", textAlign: "center", fontFamily: "Verdana, Geneva, sans-seri",
            fontVariant: "small-caps"
        });
        calYearPlaceholder.innerHTML = "<span class='t-no-drag'>YEAR</span>"; //this would be overridden later with an actual year
        calYearPlaceholder._firstElementChild().style.cursor = "pointer"; //make sure that year element is shown as clickable
        //
        //make sure its clickable, i needed to do it explicitly like this cause the css cursor rule was getting reset
        calYearPlaceholder._firstElementChild().on("mouseover", function () {
            this.target.style.cursor = "pointer";
        });
        //if we have an explicit color set  or theme set
        if (tColor) {
            calYearPlaceholder._firstElementChild().style.setProperty("color", tColor, "important");
        } else if (theme)
            calYearPlaceholder._firstElementChild().addClass(theme);
        //hover effect
        if (hColor) {

            calYearPlaceholder._firstElementChild().oldColor = calYearPlaceholder._firstElementChild().style.color; //save a reference to the old color
            calYearPlaceholder._firstElementChild().onmouseover = function () {

                this.style.setProperty("color", hColor, "important");
            };
            calYearPlaceholder._firstElementChild().onmouseout = function () {
                this.style.setProperty("color", this.oldColor);
            };
        }


//->
        /*************** create next button ****************************/
////element for moving the calendar to the next view

        var nextButton = T.$(document.createElement("span")); //
        nextButton.setStyle({
            display: "inline-block", width: "8%", height: "60%", textAlign: "center", cssFloat: "right",
            borderRadius: "4em", margin: "6px 2px 0px 0px", fontSize: ".8em ", cursor: "pointer"
        });
        nextButton.innerHTML = "&#9658;";
        nextButton.addClass("t-no-drag");
        //if we have a theme set, or an explicit color
        if (tColor) {

            nextButton.style.setProperty("color", tColor, "important");
        } else if (theme)
            nextButton.addClass(theme);
        //control hover state
        if (hColor) {
            nextButton.oldColor = prevButton.style.color; //save a reference to the old color
            nextButton.onmouseover = function () {

                this.style.setProperty("color", hColor, "important");
            };
            nextButton.onmouseout = function () {
                this.style.setProperty("color", this.oldColor);
            };
        }
        nextButton.on("click", function () {

            baseWidget.setView(null, null, "n"); //move to the next view
        });
        /**add the prev button to the header ***/
        calendarHeader.appendChild(prevButton);
        /**  add the year place holder to the header ***/
        calendarHeader.appendChild(calYearPlaceholder);
        /**  add the next button to the header ***/
        calendarHeader.appendChild(nextButton);
//add the header to the main widget
        baseWidget._widgetElement.appendChild(calendarHeader);
        ////////////////////////////// HEADER END //////////////////////////////////////


//->


//->
/////////////////////CREATE MONTH ROW////////////////////////////////////////////////

        var monthRow = T.$(document.createElement("div")); //
        monthRow.setStyle({
            cssFloat: "left", width: "100%", height: "6%", textAlign: "center",
            margin: "6px 5px 0px 0px", fontSize: ".8em "
        });
        monthRow.innerHTML = "<table><tr></tr></table>";
        monthRow._firstElementChild().setStyle({//set a few style on the table
            width: "100%", border: "none", borderStyle: "none", borderColor: "transparent"
        });
        //get the day names based on set locale
        var dayNames = calendarDate.getDayNames(true);
        for (var i = 0; i < 7; i++) {
            monthRow._firstElementChild().rows[0].insertCell(-1).innerHTML = dayNames[i];
        }

        baseWidget._widgetElement.appendChild(monthRow);
//->
///////////////////////////CREATE DAYS PLACEHOLDER//////////////////////////////////

//WE CREATE A TABLE WITH 7 COLUMNS BY 6 ROWS
        var dateCellsBox = T.$(document.createElement("div")); //
        dateCellsBox.selectable(false);
        dateCellsBox.setStyle({
            cssFloat: "left", width: "96%", height: "62%", textAlign: "center",
            marginTop: "3px", marginLeft: "1.5%", fontSize: ".8em "
        });
        dateCellsBox.addClass("t-calendar-dateCell");
        dateCellsBox.innerHTML = "<table><tr></tr></table>";
        var dateCellsBoxTableElement = dateCellsBox._firstElementChild(); //a ref to the table


        baseWidget._widgetElement.appendChild(dateCellsBox); //append the table to the main widget

        dateCellsBoxTableElement.setStyle({//set a few style on the table
            width: "100%", height: "100%", border: "none", borderStyle: "none", borderColor: "transparent"
        });
        //
        for (var i = 0; i < 6; i++) { //these loopes create a 6 by 7 table

            for (var j = 0; j < 7; j++) {


                dateCellsBoxTableElement.rows[i].insertCell(-1); //insert seven cells in this row

            }

            dateCellsBoxTableElement.insertRow(-1); //create a new row, till we get to 6 rows
        }

        //return the clicked date to a callback
        baseWidget.returnDateValue = function () {

            //a strange behaviour allowed the textContent of a cell to persist even
            //after changing views, so we use innerHTML to make sure it holds a real date
            //and not our default space placeholder
            if (this.target.innerHTML !== "&nbsp;") {

                var selectedDayObject = T.Date(calendarDate.getTime());
                selectedDayObject.setLocale(calendarDate.getLocale());
                selectedDayObject.setDate(this.target.textContent.trim());
                //give a little styling to the clicked cell
                if (selectedDateColor) {

                    //unset the styling from any previous cliked cell, 
                    dateCellIterator.foward_iterator(function (x) {
                        x.style.backgroundColor = "transparent";
                    });
                    this.target.style.backgroundColor = selectedDateColor;
                }

                if (dateClickCB)
                    dateClickCB(selectedDayObject, baseWidget); // send the date object, for the date clicked to the callback

            }
            this.stopImmediatePropagation(); //kill the event
            this.stopPropagation();
        };


//implement function to setup dates
        baseWidget.setupDates = function () {

//grab a reference to all induvidual cells we have in the dates table


            dateCellIterator.addAll(dateCellsBoxTableElement.rows[0].cells).
                    addAll(dateCellsBoxTableElement.rows[1].cells).
                    addAll(dateCellsBoxTableElement.rows[2].cells).
                    addAll(dateCellsBoxTableElement.rows[3].cells).
                    addAll(dateCellsBoxTableElement.rows[4].cells).
                    addAll(dateCellsBoxTableElement.rows[5].cells).
                    addAll(dateCellsBoxTableElement.rows[6].cells);

            //initally fill the cells with blanks
            dateCellIterator.foward_iterator(function (x) {
                if (T.type(x) !== "HTMLTableCellElement")//some boogey slipped in.. :)
                    return;


                x.innerHTML = "&nbsp;";
                x.className += "t-no-drag"; //dont drag on the dates
                x.style.border = "none";
                x.style.textDecoration = "none";
                x.style.backgroundColor = "transparent";
                x.onmouseover = function () {

                    var bgC = this.style.backgroundColor ? T.UI.Color.colorToHex(this.style.backgroundColor) : "transparent";
                    var datePckd = selectedDateColor ? T.UI.Color.colorToHex(selectedDateColor) : "none";
                    //before setting the background color make sure the date wasnt clicked
                    //and as such doesnt have our date-clicked color
                    if (bgC !== datePckd)
                        this.style.setProperty("background-color", dateHColor, "important");
                };
                x.onmouseout = function () {

                    var bgC = this.style.backgroundColor ? T.UI.Color.colorToHex(this.style.backgroundColor) : "transparent";
                    var datePckd = selectedDateColor ? T.UI.Color.colorToHex(selectedDateColor) : "none";
                    //before unsetting the background color make sure the date wasnt clicked
                    //and as such the cell doesn't have our date-clicked color
                    if (bgC !== datePckd)
                        this.style.setProperty("background-color", "transparent", "important");
                };
            });

            //get the day of the week this months starts
            var firstDayOfWeek = calendarDate.setDate(1).getDay(),
                    //
                    //get the total days
                    totalDaysInMonth = calendarDate.daysInMonth(),
                    //we'll use these to track the dates we have inserted
                    dateCounter = 1;
            //insert dates into the table
            for (var i = 0; i < 42; i++) {


//this check ensure that we are within the first and last day of the month before inserting dates
                if (i >= firstDayOfWeek && dateCounter <= totalDaysInMonth) {

                    dateCellIterator[i].innerHTML = dateCounter;
                    //style the cell for today
                    if (dateCounter === currentTime.getDate() && calendarDate.getMonth() === currentTime.getMonth() &&
                            calendarDate.getFullYear() === currentTime.getFullYear()) {

                        dateCellIterator[i].style.border = "#666 1px dotted";
                    }

                    //check for dissalowed dates
                    if (disabledDatesIterator && false !== disabledDatesIterator.indexOf(dateCounter)) {

                        dateCellIterator[i].style.textDecoration = "line-through"; //strike through disbabled dates
                        T.$(dateCellIterator[i]).on("click", function () {
                            this.returnValue = false; //dont send events for diabled dates
                            this.stopPropagation();
                            this.stopImmediatePropagation();
                            ;
                        });
                    } else {
                        T.$(dateCellIterator[i]).on("click", baseWidget.returnDateValue);
                    }
                    ++dateCounter;
                }
            }


//update the month header, reflecting any locale changes as well
            calYearPlaceholder._firstElementChild().innerHTML = "&#9699; " + calendarDate.getMonth(true) + "  " + calendarDate.getFullYear();
            //update the daysOfWeek as well
            var dayNames = calendarDate.getDayNames(true);
            for (var i = 0; i < 7; i++) {
                monthRow._firstElementChild().rows[0].cells[i].innerHTML = dayNames[i];
            }
            localeButton.text = calendarDate.getLocale(); //and also update the locale button
        };
        ;
        ///call the function to insert default dates
        baseWidget.setupDates();
////////////////////////////Create locale change link////////////////////////////////


        localeButton.setStyle({
            fontSize: ".8em", margin: "1% 0% 0% 90%"
        });
        localeButton.style.setProperty("cursor", "pointer", "important"); //FF sometimes resets the cursor, on a link??/??. strange
        if (localeColor)
            localeButton.style.color = localeColor;
        localeButton.href = "javascript://";
        localeButton.text = calendarDate.getLocale();
        baseWidget._widgetElement.appendChild(localeButton);
        localeButton.on("click", function () {

            this.target.style.setProperty("cursor", "pointer", "important");
            //this if block toggles the display if clicked twice on the same element
            //i.e close the list and return
            if (document.getElementById("TCalWidgetLocaleList") &&
                    (this.target.parentNode === document.getElementById("TCalWidgetLocaleList").parentNode)) {

                document.getElementById("TCalWidgetLocaleList").parentNode.
                        removeChild(document.getElementById("TCalWidgetLocaleList"));
                return;
            }

            //this if block toggles the display when another calender widget's locale button is cliked
            //i.e close the list and proceed to create the list for the other widget
            if (document.getElementById("TCalWidgetLocaleList")) {
                document.getElementById("TCalWidgetLocaleList").parentNode.
                        removeChild(document.getElementById("TCalWidgetLocaleList"));
            }


            var localeList = T.$(document.createElement("ul"));
            localeList.id = "TCalWidgetLocaleList";
            localeList.setStyle({
                border: "solid 1px #999", padding: "2px", position: "relative", width: "2em",
                listStyleType: "none", textAlign: "center", fontSize: ".8em",
                left: "88%", top: "-2%", backgroundColor: "#fff", zIndex: "200"

            });
            //create elements for the different locales
            (localeList.appendChild(document.createElement("li"))).innerHTML = "<a href='javascript://'>en</a>";
            (localeList.appendChild(document.createElement("li"))).innerHTML = "<a href='javascript://'>fr</a>";
            (localeList.appendChild(document.createElement("li"))).innerHTML = "<a href='javascript://'>es</a>";
            (localeList.appendChild(document.createElement("li"))).innerHTML = "<a href='javascript://'>de</a>";
            (localeList.appendChild(document.createElement("li"))).innerHTML = "<a href='javascript://'>zn</a>";
            (localeList.appendChild(document.createElement("li"))).innerHTML = "<a href='javascript://'>jp</a>";
            //add some styles and properties to each locale Li
            for (var i = 0; i < localeList.childNodes.length; i++) {
                var currentLi = T.$(localeList.childNodes[i]);
                currentLi.style.textDecoration = "underline";
                currentLi.style.padding = "3px";
                currentLi.style.setProperty("cursor", "pointer", "important");
                currentLi.on("click", baseWidget.changeLocale); //change locale on select menu item
            }

            baseWidget._widgetElement.appendChild(localeList);
            T.UI.FX.Animation({
                el: localeList, name: "flipInX", time: ".2"
            });
        });
/////////////////////////////////////////////////////////////////////////////////

//->
//////////////////////////////IMPLEMENT METHOD FOR CHANGING THE CALENDAR LOCALE////////////////////////////////////////
//

        baseWidget.changeLocale = function () {

            //get the right target, i.e. the LI element
            var _t = this.target.nodeName === "A" ? this.target.parentNode : this.target;


            //reset the day names based on selected locale
            //get the day names based on set locale
            calendarDate.setLocale(this.target.textContent.trim());
            var dayNames = calendarDate.getDayNames(true);
            for (var i = 0; i < 7; i++) {
                monthRow._firstElementChild().rows[0].cells[i].innerHTML = dayNames[i];
            }

            calYearPlaceholder._firstElementChild().innerHTML = "";
            calYearPlaceholder._firstElementChild().innerHTML = "&#9699; " + calendarDate.getMonth(true) + "  " + calendarDate.getFullYear();

            _t.parentNode.parentNode.removeChild(_t.parentNode); //remove the locale list
            localeButton.text = calendarDate.getLocale();
        };


        ;
//->
//////////////////////////// METHOD FOR SHOWING THE YEAR/MONTH SELECTOR VIEW///////////////////////
        baseWidget.yearSelector = function () {
            this.stopPropagation(); //we put this here so that when the year header is 
            //clicked the event doesnt buuble 
            //back up to the date picker that caused  the calendar to show 
            //else a new date picker might be put in view, causing a nevr ending loop of
            //date pickers being displayed

            //cretae the year selector element
            var yrSlct = T.$(document.createElement("div")); //
            yrSlct.setStyle({
                width: baseWidget._widgetElement.style.width,
                height: baseWidget._widgetElement.style.height,
                backgroundColor: bgColor ? bgColor : baseWidget._widgetElement.style.backgroundColor,
                position: "absolute", top: "0", left: "0",
                fontSize: ".8em", fontVariant: "small-caps"

            });
            if (theme)
                yrSlct.addClass(theme);
            baseWidget._widgetElement.appendChild(yrSlct);
            //
            //we are going to create a table where the user can select any year
            //they want
            //first get the current year in view
            var curentYearInView = calendarDate.getFullYear(), selectedYearFromList = null,
                    //
                    //create an array to hold the years we want to show
                    yearsToDisplay = T.Iterator();
            //fill up the array, with 20 items (years) starting with the curentYearInView
            for (var i = curentYearInView, j = 0; j < 20; j++, i++) {
                yearsToDisplay.add(i);
            }

            yrSlct.innerHTML = "<table></table>";
            var yearCellsBoxTableElement = yrSlct._firstElementChild(); //a ref to the table

            yearCellsBoxTableElement.setStyle({//set a few style on the table
                width: "85%", height: "80%", border: "none", borderStyle: "none", borderColor: "transparent",
                margin: "2% 0% 0% 7.5%", textAlign: 'center'
            });
            //
            for (var i = 0; i < 5; i++) { //these loopes create a 5 by 4 table, for the year view
                yearCellsBoxTableElement.insertRow(-1); //create a new row, till we get to 5 rows

                for (var j = 0; j < 4; j++) {
                    yearCellsBoxTableElement.rows[i].insertCell(-1); //insert 4 cells in this row

                }


            }

            //now that we have created the rows and colums for the year table
            //we create an interator containing all the cells
            var yearCellsIterator = T.Iterator().addAll(yearCellsBoxTableElement.rows[0].cells)
                    .addAll(yearCellsBoxTableElement.rows[1].cells)
                    .addAll(yearCellsBoxTableElement.rows[2].cells)
                    .addAll(yearCellsBoxTableElement.rows[3].cells)
                    .addAll(yearCellsBoxTableElement.rows[4].cells);
            //now insert the dates into the table cells
            yearsToDisplay.foward_iterator(function (x) {
                yearCellsIterator[this.key].innerHTML = x;
                yearCellsIterator[this.key].style.cursor = "pointer";
                yearCellsIterator[this.key].className += " t-no-drag"; // dont drag on the year numbers


                //hover states
                if (hColor) {
                    yearCellsIterator[this.key].oldColor = yearCellsIterator[this.key].style.color; //save a reference to the old color
                    yearCellsIterator[this.key].onmouseover = function () {

                        this.style.setProperty("color", hColor, "important");
                    };
                    yearCellsIterator[this.key].onmouseout = function () {
                        this.style.setProperty("color", this.oldColor);
                    };
                } else //if no hover state color lets use the dateHoverColor
                if (dateHColor) {//hover states
                    yearCellsIterator[this.key].oldColor = yearCellsIterator[this.key].style.color; //save a reference to the old color
                    yearCellsIterator[this.key].onmouseover = function () {

                        this.style.setProperty("color", dateHColor, "important");
                    };
                    yearCellsIterator[this.key].onmouseout = function () {
                        this.style.setProperty("color", this.oldColor);
                    };
                }

                T.$(yearCellsIterator[this.key]).on("click", function () {

                    monthSelector(this.target.innerHTML); //go to the month selection view sending the selected year along
                });
            });
            //implement next and previous buttons
            var yearNextPrevContainer = T.$(document.createElement("div")); //
            yearNextPrevContainer.setStyle({
                width: "100%", height: "auto", textAlign: "left",
                fontSize: "1.5em", fontVariant: "small-caps", marginTop: "-6%"
            });
            var nextButton2 = T.$(document.createElement("p")); //the next button
            nextButton2.innerHTML = "&#9654";
            nextButton2.setStyle({
                marginLeft: "40%", cssFloat: "left", cursor: "pointer"
            });
            nextButton2.addClass("t-no-drag");
            if (hColor) {
                nextButton2.oldColor = nextButton2.style.color; //save a reference to the old color
                nextButton2.onmouseover = function () {

                    this.style.setProperty("color", hColor, "important");
                };
                nextButton2.onmouseout = function () {
                    this.style.setProperty("color", this.oldColor);
                };
            }
            nextButton2.on("click", function () {

                showNextYearSet();
            });
            var prevButton2 = T.$(document.createElement("p")); //the prev buttons
            prevButton2.innerHTML = "&#9664";
            prevButton2.setStyle({
                marginLeft: "25%", cssFloat: "left", cursor: "pointer"
            });
            prevButton2.addClass("t-no-drag");
            if (hColor) {
                prevButton2.oldColor = prevButton2.style.color; //save a reference to the old color
                prevButton2.onmouseover = function () {

                    this.style.setProperty("color", hColor, "important");
                };
                prevButton2.onmouseout = function () {
                    this.style.setProperty("color", this.oldColor);
                };
            }
            prevButton2.on("click", function () {

                showPrevYearSet();
            });
            //function to show the next set of years
            function showNextYearSet() {
                //what was the last year displayed
                var lastVal = parseInt(yearCellsIterator.last().innerHTML);
                //generate the next set
                //fill up the array, with 20 items (years) 

                for (var i = lastVal + 1, j = 0; j < 20; j++, i++) {

                    //now sice each iterator index holds a reference to a corresponding table cell
                    //by changing the text or innerHTML value of the index, we automatically update the table
                    yearCellsIterator[j].innerHTML = i;
                }

            }

            //function to show the prev set of years
            function showPrevYearSet() {
                //what was the last year displayed
                var firstVal = parseInt(yearCellsIterator.peek().innerHTML);
                //generate the prev set
                //fill up the array, with 20 items (years) 

                for (var i = firstVal - 1, j = 19; j >= 0; j--, i--) { //generate in reverse

                    //now since each iterator index holds a reference to a corresponding table cell
                    //by changing the text or innerHTML value of the index, we automatically update the table
                    yearCellsIterator[j].innerHTML = i;
                }

            }

            //function to show month selection  view
            function monthSelector(year) {
                var yr = year.trim();
                //remove the year selection view
                yrSlct.parentNode.removeChild(yrSlct);
                //create the month selection view
                var mntSlct = T.$(document.createElement("div")); //
                mntSlct = T.$(document.createElement("div")); //
                mntSlct.setStyle({
                    width: baseWidget._widgetElement.style.width,
                    height: baseWidget._widgetElement.style.height,
                    backgroundColor: bgColor ? bgColor : baseWidget._widgetElement.style.backgroundColor,
                    position: "absolute", top: "0", left: "0",
                    fontSize: ".8em", fontVariant: "small-caps", textAlign: "center"

                });
                if (theme)
                    mntSlct.addClass(theme);
                baseWidget._widgetElement.appendChild(mntSlct);
                //create the month table
                var mntTable = T.$(document.createElement("table"));
                mntTable.setStyle({//set a few style on the table
                    width: "80%", height: "80%", border: "none", borderStyle: "none", borderColor: "transparent",
                    margin: "2% 0% 0% 7.5%", textAlign: 'center', borderSpacing: "10px"
                });
                //  //add four rows to contain the months
                for (var i = 0; i < 4; i++) {
                    mntTable.insertRow(-1); //create a new row, till we get to 4 rows

                    for (var j = 0; j < 3; j++) { //three cells pre row
                        mntTable.rows[i].insertCell(-1); //insert 4 cells in this row
                    }
                }
                //iterator for the month cells
                var mntCellsIterator = T.Iterator().addAll(mntTable.rows[0].cells)
                        .addAll(mntTable.rows[1].cells)
                        .addAll(mntTable.rows[2].cells)
                        .addAll(mntTable.rows[3].cells),
                        //
                        temp_date_object = T.Date(1900, 0); //create a quick date
                //set it to the current locale, so we get month name in the right language
                temp_date_object.setLocale(calendarDate.getLocale());
                //get and insert the month names
                mntCellsIterator.foward_iterator(function (x) {

                    x.innerHTML = temp_date_object.getMonth(true, true); //get short names, and insert in cells

                    x.setAttribute("mntIndex", temp_date_object.getMonth()); //set month number attribute on td Element

                    temp_date_object.setMonth(temp_date_object.getMonth() + 1); //move to the next month
                    x.style.cursor = "pointer";
                    x.className += " t-no-drag"; // dont drag on the month names


                    if (hColor) {//hover states
                        x.oldColor = x.style.color; //save a reference to the old color
                        x.onmouseover = function () {

                            this.style.setProperty("color", hColor, "important");
                        };
                        x.onmouseout = function () {
                            this.style.setProperty("color", this.oldColor);
                        };
                    } else //if no hover state color lets use the dateHoverColor
                    if (dateHColor) {//hover states
                        x.oldColor = x.style.color; //save a reference to the old color
                        x.onmouseover = function () {

                            this.style.setProperty("color", dateHColor, "important");
                        };
                        x.onmouseout = function () {
                            this.style.setProperty("color", this.oldColor);
                        };
                    }

                    T.$(x).on("click", function () {//when a month is clicked

                        //get the year and the month then update the calendar view
                        baseWidget.setView(yr, this.target.getAttribute("mntIndex"));
                        //remove the month selection screen
                        mntSlct.parentNode.removeChild(mntSlct);
                    });
                });
                mntSlct.appendChild(mntTable);
            }

            yrSlct.appendChild(yearNextPrevContainer); //append the nav buttons
            yearNextPrevContainer.appendChild(prevButton2); //append the nav buttons
            yearNextPrevContainer.appendChild(nextButton2); //append the nav buttons
        };
        //click handler for year place holder
        calYearPlaceholder._firstElementChild().on("click", baseWidget.yearSelector);

        /**
         * Set the calendar to a particular year and month, called with no arguments,
         *  it resets the calendar to today
         *
         * @param {Number} [year = current year] javascript year value
         * @param {Number} [month = current mont] javascript month value
         * @returns {TigerJS.UI.Widget.CalendarWidget}
         * @function
         * @name TigerJS.UI.Widget.CalendarWidget#setView
         * @memberOf TigerJS.UI.Widget.CalendarWidget
         */
        baseWidget.setView = function (year, month, orient) {
            if (!orient) {


                if (year) {
                    calendarDate.setFullYear(year);
                }
                if (month || month === 0) {//0 is january,..
                    calendarDate.setMonth(month);
                }
            } else if (orient === "p") {
                calendarDate.setMonth(calendarDate.getMonth() - 1);
            } else if (orient === "n") {
                calendarDate.setMonth(calendarDate.getMonth() + 1);
            }


            this.setupDates(); //update the view

            return this;
        };

        /**
         * Set the locale identifier for the calendar view, changes would be made when the calendar view is navigated
         * @param {String} id The locale identifier
         * @function
         * @name TigerJS.UI.Widget.CalendarWidget#setLocaleID
         * @memberOf TigerJS.UI.Widget.CalendarWidget
         * @returns {TigerJS.UI.Widget.CalendarWidget}
         */
        baseWidget.setLocaleID = function (id) {
            calendarDate.setLocale(id);
            return this;
        };
////////////////////////////////////END PUBLIC API///////////////////////////////////////////////
//


        //->       //ovveride toString
        baseWidget._widgetElement.__toString = function () {
            return "[object TigerJS.CalendarWidget]";
        };
        ;
        //return the calendar widget Object
        return baseWidget;
    }

    return new __tcal(configurationOptions);
}
;