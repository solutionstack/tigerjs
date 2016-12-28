/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */
/**
 * @class
 * This Object provides functionality for creating and performing calculation on dates
 * and time ranges.
 * @param {DateString | milliseconds} date Standard Javascript or ISO/IETF Dateformats or a date/time in milliseconds
 * @example
 *  T.Date("2015-03-25"); // YYYY-MM-DD
 *  T.Date("2014-12"); // YYYY-MM
 *  T.Date("2014"); // YYYY
 *  T.Date("2014-12-24T12:00:00"); // With TimeZone Specifier
 *  T.Date("Mar 25 2015"); //
 *  T.Date("25 Mar 2015"); //
 *  T.Date("2015, January, 20"); //Commas and FULL Month names too (JS Spec)
 *  T.Date("03/25/2015"); //MM/DD/YYYY - you can alse use / as the seperator
 *  T.Date("Wed Mar 25 2015 09:56:24 GMT+0100 (W. Europe Standard Time)"); //Full Javascript Format
 *
 *  e.t.c Consult your javascript Documentation for more info :)
 * @name TigerJS.Date
 *
 */

TigerJS.Date = function (date) {
    var _TDate = function (arg) {
        //not so sure what to start this module with, so wadahell, lets just do it!!
        var internalDate = this; //we'll need this for cases where we cant use the this object

        var //get the current date and time
                dateObj = T.isNumber(arg) || T.isString(arg) ? new Date(arg) : new Date(),
                //
                isLeapYear = function () {
                    var y = dateObj.getFullYear();
                    return y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
                },
                daysInMonth = function (month) {
                    return [31, (isLeapYear() ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
                },
                //
                locale = {
                    "en": 1,
                    "fr": 1,
                    "es": 1,
                    "de": 1,
                    "jp": 1,
                    "zn": 1
                }, //more to be added
                current_locale = "en", //default

                //function to add/subtract dates
                addMilliseconds = function (val) {
                    dateObj.setMilliseconds(dateObj.getMilliseconds() + val);
                    return dateObj;
                };
        ;
        /**
         * Return the number of days in the month for the current year and month
         * @returns {Number}
         * @type Number
         * @name TigerJS.Date.daysInMonth
         * @function
         */
        this.daysInMonth = function () {

            //we create a new temp date based on the cuurent one to correct some strange bugs

            return daysInMonth(this.getMonth());
        };
        /**
         * Get the current locale identifier
         * @returns {String}
         * @type String
         * @name TigerJS.Date.getLocale
         * @function
         */
        this.getLocale = function () {
            return current_locale;
        };
        /**
         * Set the current locale identifier, future releases of this library would support many more locales
         * @param {String} [locale_id] The locale to set one of: 
         * <pre>
         * en | fr | es | de | jp | zn
         * 
         * en : English
         * fr :  french
         * es : Spanish
         * de : Deutsh
         * jp : Japanese
         * zn : Chinese
         * </pre>
         * @returns {TigerJS.Date}
         * @type TigerJS.Date
         * @name TigerJS.Date.setLocale
         * @function
         */
        this.setLocale = function (locale_id) {

            if (!T.isString(locale_id) || !locale[locale_id])
                throw "Bad Locale Identifier <> " + locale_id + " given in - TigerJS.Date#setLocale ... See the documentation for valid locales ";
            current_locale = locale_id;
            return this;
        };
        /**
         * Returns the day of the month
         * @return {Number}
         * @type Number
         * @name TigerJS.Date.getDate
         * @function
         */
        this.getDate = function () {
            return dateObj.getDate();
        };
        /**
         * Returns the day of the week, which would be a number from 0-6, or the name of the day
         * if the NameString argument is given
         * @param {Boolean} NameString if true, returns the name of the day as a String
         * @param {Boolean} ShortString if true, returns the name of the day as an abbreviated string
         * @return {Number | String}
         * @type Number | String
         * @name TigerJS.Date.getDay
         * @function
         */
        this.getDay = function (NameString, ShortString) {
            if (!NameString)
                return dateObj.getDay();
            //return the day String based on Locale
            return ShortString ? nls_Info[current_locale + "_DaySH"][dateObj.getDay()] : nls_Info[current_locale + "_Day"][dateObj.getDay()];
        };
        /**
         * Returns an array containing the locale based names, of the days of the week
         * @param {Boolean} ShortString if true return the names as an abbreviated string
         * @return {Number | String}
         * @type Number | String
         * @name TigerJS.Date.getDayNames
         * @function
         */
        this.getDayNames = function (ShortString) {
            if (ShortString)
                return nls_Info[current_locale + "_DaySH"]; //return short string

            return nls_Info[current_locale + "_Day"];
        };
        /**
         * Returns the month of the year, which would be a number from 0-11, or the name of the month
         * if the NameString argument is given
         * @param {Boolean} NameString if true, returns the name of the month as a String
         * @param {Boolean} ShortString if true, returns the name of the month as an abbreviated string
         * @return Number | String
         * @type Number | String
         * @name TigerJS.Date.getMonth
         * @function
         */
        this.getMonth = function (NameString, ShortString) {
            if (!NameString)
                return dateObj.getMonth();
            //return the day String based on Locale
            return ShortString ? nls_Info[current_locale + "_MonthSH"][dateObj.getMonth()] : nls_Info[current_locale + "_Month"][dateObj.getMonth()];
        };
        /**
         * Returns the week of the year (ISO 8601), which would be a number from 0 - 53
         * @return {Number}
         * @type Number
         * @name TigerJS.Date.getWeek
         * @function
         */
        this.getWeek = function () {
            //create a copy of this date object
            var d2 = new Date(dateObj.valueOf()),
                    //set the day number to monday as per ISO8601
                    dyNr = (dateObj.getDay() + 6) % 7;
            //set the copy to thursday
            d2.setDate(d2.getDate() - (dyNr + 3));
            //ISO8601, states that week-1 is the week with january 4th in it
            var jan4 = new Date(d2.getFullYear(), 0, 4),
                    //days between d2 and january 4
                    dayDiff = (d2 - jan4) / 86400000;
            //calculate week no
            return 1 + Math.ceil(dayDiff / 7);
        };
        /**
         * Returns the year (four digits)
         * @type Number
         * @return {Number} The full year
         * @name TigerJS.Date.getFullYear
         * @function
         */
        this.getFullYear = function () {
            return dateObj.getFullYear();
        };
        /**
         * Returns the hour (from 0-23)
         * @type Number
         * @return {Number}
         * @name TigerJS.Date.getHours
         * @function
         */
        this.getHours = function () {
            return dateObj.getHours();
        };
        /**
         * Returns the minutes (from 0-59)
         * @type Number
         * @return {Number}
         * @name TigerJS.Date.getMinutes
         * @function
         */
        this.getMinutes = function () {
            return dateObj.getMinutes();
        };
        /**
         * Returns the seconds (from 0-59)
         * @type Number
         * @return {Number}
         * @name TigerJS.Date.getSeconds
         * @function
         */
        this.getSeconds = function () {
            return dateObj.getSeconds();
        };
        /**
         * Returns the number of milliseconds since epoch
         * @type Number
         * @return {Number}
         * @name TigerJS.Date.getTime
         * @function
         
         */
        this.getTime = function () {
            return dateObj.getTime();
        };
        /**
         *  Sets the year (four digits) of the date object.
         *  And optionally month and day
         *  @param {Number} year  A four-digit value representing the year, negative values are allowed
         *  @param {Number} [month = defaultMonth]  An integer representing the month values are 0-11, negative values are allowed
         *  @param {Number} [ day = defaultDay]  An integer representing the day of month, other values are 1-31, but other values are allowed:
         * @type T.Date
         * @returns {TigerJS.Date}
         * @name TigerJS.Date.setFullYear
         * @function
         */
        this.setFullYear = function (year, month, day) {

            dateObj.setFullYear(year);


            if (month || month >= 0) {

                var n = dateObj.getDate(); //current date

                dateObj.setDate(1);

                dateObj.setMonth(month); //set months

                //reset date in case we fall into a leaps year-febuary
                dateObj.setDate(Math.min(n, this.daysInMonth(dateObj.getFullYear(), dateObj.getMonth())));

            }
            if (day) {
                dateObj.setDate(day);
            }
            return this;
        };


        /**
         *  Sets the month of a date object, And optionally a day value
         
         *  @param {Number} month  An integer representing the month values are 0-11, negative values are allowed
         *  @param {Number} [day = defaultDay] day  An integer representing the day of month, other values are 1-31, but other values are allowed:
         * @type T.Date
         * @name TigerJS.Date.setMonth
         * @returns {TigerJS.Date}
         * @function
         */
        this.setMonth = function (month, day) {

            this.setFullYear(this.getFullYear(), month);

            if (day) {
                dateObj.setDate(day);

            }
            return this;
        };
        /**
         *  Set the day of the month.
         *  @param {Number}day  An integer representing the day of month, other values are 1-31, but other values are allowed:
         * @type T.Date
         * @name TigerJS.Date.setDate
         * @returns {TigerJS.Date}
         * @function
         */
        this.setDate = function (day) {
            dateObj.setDate(day);
            return this;
        };
        /**
         This method sets the hour of a date object, 
         This method can also be used optionally to set the minutes, seconds and milliseconds.
         *  @param {Number} hour   An integer representing the hour.Expected values are 0-23, but other values are allowed: but other values are allowed
         *  @param {Number} [minutes = defaultMinutes] minutes An integer representing the minutes. Expected values are 0-59, but other values are allowed
         *  @param {Number} [seconds = defaultSeconds]  An integer representing the seconds. Expected values are 0-59, but other values are allowed
         *  @param {Number} [milli = defaultMilliseconds]  An integer representing the milliseconds. Expected values are 0-999, but other values are allowed
         * @type T.Date
         * @name TigerJS.Date.setHour
         * @returns {TigerJS.Date}
         * @function
         */
        this.setHour = function (hour, minutes, seconds, milli) {
            dateObj.setHours(hour);
            if (minutes || minutes >= 0) {

                dateObj.setMinutes(minutes);

            }
            if (seconds || seconds >= 0) {
                dateObj.setSeconds(seconds);

            }
            if (milli) {
                dateObj.setMilliseconds(milli);

            }

            return this;
        };
        /**
         This method sets the minutes of a date object, 
         This method can also be used optionally to set the seconds and milliseconds.
         
         *  @param {Number} minutes An integer representing the minutes. Expected values are 0-59, but other values are allowed
         *  @param {Number} [seconds = defaultSeconds]  An integer representing the seconds. Expected values are 0-59, but other values are allowed
         *  @param {Number} [milli = defaultMilliseconds] milli An integer representing the milliseconds. Expected values are 0-999, but other values are allowed
         * @type T.Date
         * @name TigerJS.Date.setMinutes
         * @returns {TigerJS.Date}
         * @function
         */
        this.setMinutes = function (minutes, seconds, milli) {
            dateObj.setMinutes(minutes);

            if (seconds || seconds >= 0) {
                dateObj.setSeconds(seconds);

            }
            if (milli) {
                dateObj.setMilliseconds(milli);

            }

            return this;
        };
        /**
         This method sets the seconds of a date object,
         This method can also be used optionally to set the  milliseconds.
         
         
         *  @param {Number} seconds An integer representing the seconds. Expected values are 0-59, but other values are allowed
         *  @param {Number} [milli = defaultMilliseconds] An integer representing the milliseconds. Expected values are 0-999, but other values are allowed
         * @type T.Date
         * @name TigerJS.Date.setSeconds
         * @returns {TigerJS.Date}
         * @function
         */
        this.setSeconds = function (seconds, milli) {
            dateObj.setSeconds(seconds);
            if (milli) {
                dateObj.setSeconds(milli);

            }

            return this;
        };
        /**
         This method sets the milliseconds of a date object, 
         *  @param {Number} milli An integer representing the milliseconds. Expected values are 0-999, but other values are allowed
         * @type T.Date
         * @name TigerJS.Date.setMilliSeconds
         * @returns {TigerJS.Date}
         * @function
         */
        this.setMilliSeconds = function (milli) {
            this.setMilliseconds(milli);
            return this;
        };
        /**
         * The method sets a date and time by adding or subtracting a
         * specified number of milliseconds to/from midnight January 1, 1970.
         *  @param {Number} milli Required. The number of milliseconds to be
         *  added to, or subtracted from, midnight January 1, 1970
         * @type T.Date
         * @name TigerJS.Date.setTime
         * @returns {TigerJS.Date}
         * @function
         */
        this.setTime = function (milli) {
            this.setTime(!(T.type(milli) === "undefined") ? milli : dateObj.getMilliseconds());
            return this;
        };
        /*
         * General purpose Add function, use suffixes to specify seconds, minutes, hours, days, weeks, months or years
         * @example
         * Example of valid arguments
         * 5d //add 5 days
         * 5W5d6h // add five weeks,5 days and 6 hours
         * 2y 3m 5d 6w // 2 years 3 months five days and six weeks
         * 2y 3m2w 6d 7h 8s // 2 years 3 months 2weeks 6days 7 hours 8 seconds
         * @param {String} data The string to parse out arguments from
         * @type T.Date
         * @returns {TigerJS.Date}
         * @name TigerJS.Date.add
         * @function
         */
        this.add = function (data, sub) { //the sub flag is interbnal use only, for specifying subtraction
            if (data) {
                var addTokens = T.Iterator(data),
                        tokenSet = T.Iterator(),
                        section = [];
                addTokens.without([" "]); //remove spaces

                addTokens = addTokens.map(function (x) { //we are using lower space tokens
                    return x.toLowerCase();
                });
                var _sub = sub || false; //are we to subtract datetimes
                //
                do {
                    //seperate possible format specifiers, ie seperate instructions for year date week etc

                    if (!isNaN(parseInt(addTokens.current()))) { //number tokens

                        if (T.type(section[0]) === "undefined")
                            section[0] = ""; //initialize the arr index as a string
                        //
                        //if we havent reached a letter prefix, keep adding number constants
                        section[0] += addTokens.current(); //add numeric values to the extracted set

                        addTokens.next();
                    } else {

                        //;we have a letter prefix
                        //end this extracted set with the letter token;
                        section[0] += addTokens.current().toString();
                        //addres cases where the prefix token is of two characters
                        if (addTokens.isIndex(addTokens.key + 1) && //first make sure the index is valid
                                isNaN(parseInt(addTokens[addTokens.key + 1]))) { //make sure its not a number

                            addTokens.next(); //move to this index
                            //get the token
                            section[0] += addTokens.current().toString();
                        }
                        //delete tokens up to the point we have extracted
                        addTokens.splice(0, addTokens.key + 1);
                        addTokens.rewind(); //rewind the iterator back to the top

                        tokenSet.add(section[0]); // currrent extracted set

                        delete section[0]; //delete the temporary set that we are done with

                    }
                } while (addTokens.size())

                //now we have extracted all Individual tokens 
                // perform actual addition
                tokenSet.foward_iterator(function (index) {
                    var val_to_add;
                    switch (index.charAt(index.length - 1)) { //poke at the last character, which would contain our specifier
                        case "s": //seconds

                            //get the value to add
                            val_to_add = parseInt(index);
                            //so add it
                            _sub ? addMilliseconds((-1 * val_to_add) * 1000) :
                                    addMilliseconds(val_to_add * 1000); //convert to milliseconds

                            break;
                        case "m": //minutes

                            //get the value to add
                            val_to_add = parseInt(index);
                            //so add it
                            _sub ? addMilliseconds((-1 * val_to_add) * 60000) : addMilliseconds(val_to_add * 60000); //60 * 1000 convert min to milliseconds
                            break;
                        case "h": //hours

                            //get the value to add
                            val_to_add = parseInt(index);
                            //so add it
                            _sub ? addMilliseconds((-1 * val_to_add) * 3600000) : addMilliseconds(val_to_add * 3600000); //60* 60* 1000 convert hour to milliseconds
                            break;
                        case "d": //days

                            //get the value to add
                            val_to_add = parseInt(index);
                            //so add it
                            _sub ? addMilliseconds((-1 * val_to_add) * 86400000) //60* 60* 24* 1000 convert day to milliseconds
                                    : addMilliseconds(val_to_add * 86400000);
                            break;
                        case "w": //weeks


                            //get the value to add
                            val_to_add = parseInt(index);
                            //so add it
                            _sub ? addMilliseconds((-1 * val_to_add) * 604800000) //60* 60* 24 * 7 *1000 convert week to milliseconds
                                    : addMilliseconds(val_to_add * 604800000);
                            break;
                        case "o": //if the last character its o, it might be a month i.e mo

                            if (index.indexOf("mo") > -1) {

                                val_to_add = parseInt(index); //no of months to add
                                var n = internalDate.getDate(); //current date

                                internalDate.setDate(1);
                                _sub ? internalDate.setMonth(internalDate.getMonth() - val_to_add) : internalDate.setMonth(internalDate.getMonth() + val_to_add); //add months
                                //
                                //reset date in case we fall into a leaps year-febuary
                                internalDate.setDate(Math.min(n, internalDate.daysInMonth(internalDate.getFullYear(), internalDate.getMonth())));
                            }
                            break;
                        case "y": //years

                            val_to_add = parseInt(index); //no of months to add
                            _sub ? internalDate.add("" + val_to_add * 12 + "mo", true) : internalDate.add("" + val_to_add * 12 + "mo"); // add the value as months, just multiply by 12
                            break;
                    }

                });
            }
            return internalDate;
        };
        /*
         * General purpose Subtract function, use suffixes to specify seconds, minutes, hours, days, months or years
         * @example
         * Example of valid arguments, spaces within the argument are ignored
         * 5d //subtract 5 days
         * 5W5d6h // subtract six weeks and 5 days, 6 hours
         * 2y 3m 5d 6w // subtract 2 years 3 months five days six weeks
         * 2y 3m2w 6d 7h 8s // subtract 2 years 3 months 2weeks six days 7 hours 8 seconds
         * @param {String} data The string to parse out arguments from
         * @type T.Date
         * @returns {TigerJS.Date}
         * @name TigerJS.Date.subtract
         * @function
         */
        this.subtract = function (data) {
            return this.add(data, true); // set the second arg to true so this.add() function
            // knows we mean to subtract

        };
        /**
         * Determines if this instance is between a range of two dates or equal to either the start or end dates.
         * @param {Date} start Start of range . Required
         * @param {Date} end  End of range . Required
         * @return {Boolean} true if this is between or equal to the start and end dates, else false
         * @name TigerJS.Date.between
         * @function
         */
        this.between = function (start, end) {
            var t = this.getTime();
            return t >= start.getTime() && t <= end.getTime();
        };
        /**
         * Returns a new Date object that is an exact date and time copy of the original instance.
         * @return {T.Date}    A new {@link T.Date} instance
         * @type T.Date
         * @returns {TigerJS.Date}
         * @name TigerJS.Date.clone
         * @function
         */
        this.clone = function () {
            return new T.Date(this.getTime());
        };
        /**
         * Compares this instance to a Date object and returns an number indicative of their relative values.
         * @param {Date}  date Date object to compare with [Required]
         * @return {Number}  1 = this is greater than date. -1 = this is less than date. 0 = both date object values are equal
         * @name TigerJS.Date.compareTo
         * @function
         */
        this.compareTo = function (date) {

            if (!isNaN(date.getTime())) {
                return (this.getTime() > date.getTime()) ? 1 : (this.getTime() < date.getTime()) ? -1 : 0;
            } else {
                throw new TypeError(date);
            }
        };
        /**
         * Compares this instance to another Date object and returns true if they are equal.
         * @param {Date}  date   Date object to compare [Required]
         * @return {Boolean} true if dates are equal. false if they are not equal.
         * @name TigerJS.Date.equals
         * @function
         */
        this.equals = function (date) {
            return (this.compareTo(date) === 0);
        };
        /**
         * Returns a Object, set to the current date and time.
         * @return {Date}    The current date and time.
         * @name TigerJS.Date.now
         * @returns {TigerJS.Date}
         * @function
         */
        this.now = function () {
            return T.Date((new Date().getTime()));
        };
        /**
         *
         * Calculate the days between this {@link T.Date} instance and another date
         * @param {Date} date the other date instance
         * @return {Number} returns the absolute difference in days between the two date instances
         * and another date.
         * @type Number
         * @name TigerJS.Date.daysBetween
         * @function
         */
        this.daysBetween = function (date) {
            if ((this.getTime() - date.getTime()) < 0) { //we are lesser thatn the argument
                return Math.round(((this.getTime() - date.getTime()) * -1) / 86400000);
            }
            return Math.round((this.getTime() - date.getTime()) / 86400000);
        };
        /**
         *
         * Calculate the weeks between this {@link T.Date} instance and another date
         *  * @param {Date} date the other date instance
         * @return {Number} returns the absolute difference in weeks between the two date instances
         * and another date.
         * @type Number
         * @name TigerJS.Date.weeksBetween
         * @function
         */
        this.weeksBetween = function (date) {
            if ((this.getTime() - date.getTime()) < 0) { //we are lesser thatn the argument
                return Math.round(((this.getTime() - date.getTime()) * -1) / (86400000 * 7));
            }
            return Math.round((this.getTime() - date.getTime()) / (86400000 * 7));
        };
        /**
         *
         * Calculate the months between this {@link T.Date} instance and another date
         *  * @param {Date} date the other date instance
         * @return {Number} returns the absolute difference in months between the two date instances
         * and another date.
         * @type Number
         * @name TigerJS.Date.monthsBetween
         * @function
         */
        this.monthsBetween = function (date) {
            var y_diff = this.getFullYear() - date.getFullYear(),
                    month_diff = this.getMonth() - date.getMonth();
            if (y_diff < 0)
                y_diff *= -1; //we are calculating absolute values so no -ve

            if (month_diff < 0) { //we are lesser thatn the argument

                return (month_diff * -1) + (y_diff !== 0 ? y_diff * 12 : 0);
            }
            return (month_diff) + (y_diff !== 0 ? y_diff * 12 : 0);
        };
        /**
         *
         * Calculate the years between this {@link T.Date} instance and another date
         * @param {Date} date the other date instance
         * @return {Number} returns the absolute difference in years between the two date instances
         * and another date.
         * @type Number
         * @name TigerJS.Date.yearsBetween
         * @function
         */
        this.yearsBetween = function (date) {
            var y_diff = this.getFullYear() - date.getFullYear();
            return y_diff < 0 ? y_diff * -1 : y_diff; //return the absolute difference value
        };
        /**
         * Resets the time of this Date object to 12:00 AM (00:00), which is the start of the day.
         * @return {T.Date}
         * @type T.Date
         * @name TigerJS.Date.clearTime
         * @function
         */
        this.clearTime = function () {
            this.setHours(0);
            this.setMinutes(0);
            this.setSeconds(0);
            this.setMilliseconds(0);
            return this;
        };
        this.toString = function () {
            return dateObj.toString();
        };
        /**
         * Generate a date/time string according to given format specifiers
         *  @param {String} format one or more format directives
         *  @name TigerJS.Date.format
         * @function
         * @type String
         * @return {String}
         *   Format Specifiers
         <pre>
         Format  Description                                                                  Example
         ------  ---------------------------------------------------------------------------  -----------------------
         s      The seconds of the minute between 1-59.                                      "1" to "59"
         ss     The seconds of the minute with leading zero if required.                     "01" to "59"
         
         m      The minute of the hour between 0-59.                                         "1"  or "59"
         mm     The minute of the hour with leading zero if required.                        "01" or "59"
         
         h      The hour of the day between 1-12.                                            "1"  to "12"
         hh     The hour of the day with leading zero if required.                           "01" to "12"
         
         H      The hour of the day between 1-23.                                            "1"  to "23"
         HH     The hour of the day with leading zero if required.                           "01" to "23"
         
         d      The day of the month between 1 and 31.                                       "1"  to "31"
         dd     The day of the month with leading zero if required.                          "01" to "31"
         ddd    Abbreviated day name.                                                        "Mon" to "Sun"
         dddd   The full day name.                                                           "Monday" to "Sunday"
         
         M      The month of the year between 1-12.                                          "1" to "12"
         MM     The month of the year with leading zero if required.                         "01" to "12"
         MMM    Abbreviated month name.                                                      "Jan" to "Dec"
         MMMM   The full month name.                                                         "January" to "December"
         
         yy     Displays the year as a maximum two-digit number.                             "99" or "07"
         yyyy   Displays the full four digit year.                                           "1999" or "2007"
         
         suff   Ordinal suffix for the current date                                          "th" "nd"
         ap     meridian specifier                                                           "AM" "PM"
         </pre>
         *
         *
         */
        this.format = function (format) {

            function padded(arg) { //pad with leading zero if needed
                return arg.toString().length === 1 ? "%02s".sprintf(arg) : arg;
            }

            return format ? format.replace(/dd?d?d?|suff?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|ap?/g, function (format) {
                switch (format) {

                    case "dddd": //Full day string
                        return internalDate.getDay(true);
                    case "ddd": //abbreviated daystring
                        return internalDate.getDay(true, true);
                    case "dd": //date with trailing zero if neccesary
                        return padded(internalDate.getDate());
                    case "d": //date
                        return internalDate.getDate();
                    case "suff": //get suffix
                    switch (internalDate.getDate()) {
                        case 1:
                        case 21:
                        case 31:
                            return "st";
                        case 2:
                        case 22:
                            return "nd";
                        case 3:
                        case 23:
                            return "rd";
                        default:
                            return "th";
                    }
                    case "MMMM": //full month name
                        return internalDate.getMonth(true);
                    case "MMM": //abbreviated month name
                        return internalDate.getMonth(true, true);
                    case "MM": //month number padded
                        return padded((internalDate.getMonth() + 1)); //+1 so its not zero indexed
                    case "M": //month
                        return internalDate.getMonth() + 1;
                    case "hh": //hours - 12 hours scale, padded
                        return padded(internalDate.getHours() < 13 ? internalDate.getHours() : (internalDate.getHours() - 12));
                    case "h": //hours - 12 hours scale
                        return internalDate.getHours() < 13 ? internalDate.getHours() : internalDate.getHours() - 12;
                    case "HH": //hours  24 hours scale, padded
                        return padded(internalDate.getHours());
                    case "H": //hours  24 hours scale,
                        return internalDate.getHours();
                    case "mm": //minutes padded
                        return padded(internalDate.getMinutes());
                    case "m": //minutes
                        return internalDate.getMinutes();
                    case "ss": //seconds padded
                        return padded(internalDate.getSeconds());
                    case "s": //seconds
                        return internalDate.getSeconds();
                    case "yyyy":
                        return internalDate.getFullYear();
                    case "yy":
                        return internalDate.getFullYear().toString().substring(2, 4);
                    case "ap": //meridian am or pm
                        return internalDate.getHours() < 12 ? "AM" : "PM";
                }
            }) : this._toString();
        };
    };
    return new _TDate(date);
};