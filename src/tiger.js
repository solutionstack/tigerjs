"use strict";

/* window TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2017 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */

/**
 
 TigerJS Javascript Library 1.2
 -------------------------------------------
 
 INTRODUCTION
 ----------------
 
 The TigerJS JavaScript Library is an advanced, cross-browser, feature-rich and highly optimized
 JavaScript/DOM library, that is built to reduce the time and effort uou need to put in building
 todays web 2.0/3.0 Applications, it has built to deliver high runtime performance and has low memory
 overhead, it includes lot of reusable utilities and language enhancement's / functional programming modules, DOM management modules, Basic Animations,
 Events, Ajax communication, data structures and much more
 
 
 
 Copyleft
 ----------
 
 TigerJS Javascript Library  (C) Agbalaya Olubodun
 2013-2016, GNU LGPL v3.
 agbalaya@users.sourceforge.net,
 https://github.com/solutionstack/tigerjs
 s.stackng@gmail.com
 and CONTRIBUTORS
 License
 --------
 TigerJS Javascript Library is free software distributed under the following licences
 GNU LGPL, and the MIT Open Source License.
 See the LICENSE file more information about license.
 
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <a href="http://www.gnu.org/licenses/">GNU LICENSES</a>;.
 *
 *
 */


/**
 *  @class
 *  @summary Main TigerJS Object (Static).
 *  @description
 *  This is the main TigerJS Object, it provides low-level utilities for manipulating object's, function's and variables, It also handles
 *  boot straping for the library. The TigerJS object is instantiated at runtime, so while you could directly access its properies as
 *  {@link TigerJS}.propertyName,
 *  you should typically use the  shorthand symbol {@link T}.<br/>
 *  Virtually all Objects in this library can be instantiated without the <font color="red">new </font> keyword.
 *
 * @see {@link T}
 */


var TigerJS = function() {

    ////////////////PRIVATE PROPERTIES/////////////////////////////////
    /**
     * @ignore
     */

    var win = window, //main window object
        /**
         * @ignore
         */
        _doc = win.document,
        /**
         * @ignore
         */
        _body = function() {
            return _doc.body;
        },
        /**
         * @ignore
         */
        _docEl = _doc.documentElement, //document Element (a.k.a <html>)

        /**
         * @ignore
         */
        _loc = win.location, //location
        /**
         * @ignore
         */
        _pt = _loc.protocol, //protocol

        /**
         * @ignore
         */

        _ssl =
        _pt.toLowerCase() === 'https:'; //are we on SSL/TLS

    /**
     *
     *  This method writes script tags to the document, and can be used to include external Javascript to the document even after the page
     *  has loaded
     *
     * @param {String} sSrc The src value of the script element, this could be an absolute or relative path
     * @param {Function} [callBack] Callback function to call when the script is loaded
     * @example
     *
     *  T.include("/sever/folder/special_scripts.js", myCallBack);
     *
     */

    this.include = function(sSrc, callBack) {
        var scr = document.createElement("SCRIPT");
        if (callBack) {
            scr.addEventListener("load", callBack);
        }
        scr.src = sSrc;
        document.documentElement.appendChild(scr);

    };


    /**
     * Returns the Generic type of the object,
     * DOM Types are returned as their object definition
     *  so <code>T.type(document.body)</code> would return <b>HTMLBodyElement</b>
     * and for node lists and colections
     *  <b>NodeList</b> and <b>HTMLCollection</b> are returned respectively.<br/>
     *  and and array would return "Array"; types are always returned with the
     *  first letter Uppercased <br/>
     *  To make it return a custom type of your object you need to override or
     *  provide a toString method
     * @function
     * @param {Object} Obj The object to test
     * @type String
     */
    this.type = function(Obj) {
        var o = Obj,
            i;
        //UNDEFINED, OR NOT SUPPORTED ON OBJECT

        if (typeof Obj === 'undefined' || (!Obj && typeof o !== 'string' && o !== false && o !== null && o !== 0 && typeof o !== "object")) { //undefined, watch for emtpy strings and zero
            return 'undefined';
        }

        if (o === null)
            return "[object Null]";

        //html 5 collection types
        if (
            Object.prototype.toString.call(o) === "[object NamedNodeMap]" ||
            Object.prototype.toString.call(o) === "[object NodeList]" ||
            Object.prototype.toString.call(o) === "[object HTMLCollection]" ||
            Object.prototype.toString.call(o) === "[object HTMLAllCollection]" ||
            Object.prototype.toString.call(o) === "[object HTMLPropertiesCollection]" ||
            Object.prototype.toString.call(o) === "[object HTMLOptionsCollection]" ||
            Object.prototype.toString.call(o) === "[object HTMLFormControlsCollection]"
        ) {

            //remove spaces , brackets and the object keyword so we return
            //just the Generic Type

            return Object.prototype.toString.call(o)
                .replace(/[\[\] ]*/g, "")
                .
            replace("object", "");
        }

        /////////////DOM TYPES////////////////////////////
        if (o.nodeType) {

            //HTML5 Interface Object Definitions
            var dom_element_names = ["HTMLHtmlElement", "HTMLHeadElement", "HTMLLinkElement", "HTMLTitleElement", "HTMLMetaElement",
                "HTMLBaseElement", "HTMLIsIndexElement", "HTMLStyleElement", "HTMLBodyElement", "HTMLFormElement", "HTMLSelectElement", "HTMLOptGroupElement",
                "HTMLOptionElement", "HTMLInputElement", "HTMLTextAreaElement", "HTMLButtonElement", "HTMLLabelElement", "HTMLFieldSetElement",
                "HTMLLegendElement", "HTMLUListElement", "HTMLOListElement", "HTMLDListElement", "HTMLDirectoryElement", "HTMLMenuElement", "HTMLLIElement",
                "HTMLDivElement", "HTMLParagraphElement", "HTMLHeadingElement", "HTMLQuoteElement", "HTMLPreElement", "HTMLBRElement", "HTMLBaseFontElement",
                "HTMLFontElement", "HTMLHRElement", "HTMLModElement", "HTMLAnchorElement", "HTMLImageElement", "HTMLObjectElement", "HTMLParamElement",
                "HTMLAppletElement", "HTMLMapElement", "HTMLAreaElement", "HTMLScriptElement", "HTMLTableElement", "HTMLTableCaptionElement",
                "HTMLTableColElement", "HTMLTableSectionElement", "HTMLTableRowElement", "HTMLTableCellElement", "HTMLFrameSetElement", "HTMLFrameElement",
                "HTMLIFrameElement", "HTMLAudioElement", "HTMLCommandElement", "HTMLDetailsElement", "HTMLInputElement", "HTMLMeterElement", "HTMLLegendElement", "HTMLLIElement", "HTMLOutputElement", "HTMLSpanElement", "XMLDocument", "HTMLDocument"
            ];

            var reg_exp = Object.prototype.toString.call(o)
                .
            replace(/[\[\] ]*/g, "")
                .replace("object", "")
                .
            replace(" ", "");
            for (i = 0; i < dom_element_names.length; i++) {

                if (dom_element_names[i].indexOf(reg_exp) > -1) {

                    return dom_element_names[i];
                }
                if (o.nodeName === "IMG")
                    return "HTMLImageElement";
            }
            //check for Elements
            //node Name would be returned all Upper, so to match an index in the array, we have to make only its
            //first character uppercase, so e.g. BODY would be Body
            //and would match the index HTMLBodyElement

        }

        //Our internal types
        if ((o.__to_string && o.__to_string()
                .indexOf("[o") !== -1)) {
            return o.__to_string()
                .replace(/[\[\] ]*/g, "")
                .
            replace("object", "");
        }
        if (o["Node"] && o["Node"].__to_string) { //our widget elements

            if (o["Node"].__to_string) {
                return o.Node.__to_string()
                    .replace(/[\[\] ]*/g, "")
                    .
                replace("object", "");
            }
        }

        /////////////////Native Types//////////////////////////
        if (/(Array|ArrayBuffer|DataView|Float32Array|Float64Array|Int8Array|Int16Array|Int32Array|Uint8Array|Uint8ClampedArray|Uint16Array|Uint32ArrayString|Date|Number|Object|Function|RegExp|Math|Boolean|Promise|Anonymous)/gi.test(Object.prototype.toString.call(o)) && !o.nodeType) {

            return Object.prototype.toString.call(o)
                .replace(/[\[\] ]*/g, "")
                .
            replace("object", "");
        }

    };


    /**
     * Returns true if a given object or array has a particular key
     * or index
     * @function
     
     * @param {Mixed} key Key to search for
     * @param {Object} object Object to search in
     * @type Boolean
     *
     * @example
     *
     * var _ob = {a: 1, b: 2}
     * T.has_key(_ob, "b"); //returns true
     * T.has_key(_ob, "j"); //returns false
     */

    this.has_key = function(object, key) {

        for (var i in object) {
            if (object.hasOwnProperty(i)) { //only evaluate public properties
                if (i === key) {

                    return true;
                }
            }
        }
        return false;
    };

    /**
     * Returns true if a given object or array has a particular value
     * @param {Mixed} value Value to search for
     * @param {Object} object Object to search in
     *@function
     * @type Boolean
     * @example
     *
     *           var _ob = {a: 1, b: 2}
     console.log(T.has_value(_ob, "1")); //returns false
     console.log(T.has_value(_ob, 2)); //returns true
     */

    this.has_value = function(object, value) {
        for (var i in object) {
            if (object.hasOwnProperty(i)) {
                if (object[i] === value) {

                    return true;
                }
            }
        }
        return false;
    };

    /**
     * Mixes in properties from an existing Object into another Object or  class constructor, and initialize
     * (if its a constructor).
     *@function
     *  @param {Function|Object} toObject  The existing class constructor in
     *                                       which new properties should be mixed
     * @param {Object} fromObject  An object to provide the properties, to be mixed in
     *
     * @param {Mixed} args  Extra argument to be passed (as-is) to the recieving
     *                       contructor on initialization
     *
     * @example
     var SomeClass = function () {
     this.foo = 'foo';
     this.bar = 'bar';
     };
     SomeClass = T.mix(SomeClass,
     {
     //inline-mixin, mix this new methods into the SomeClass constructor
     // and return an initialized object
     baz: 'baz',
     func: function () {}
     
     }
     );
     
     console.log(T.dump(SomeClass)); //inspect the properties now in the SomeClass Object
     *
     * //A SomeClass object is automatically initialized (if its a constructor) and returned containing
     * //the baz and func properties.
     * //This means you can directly use the SomeClass object without a new Class call
     * @return {Object} Returns the augmented object
     */
    this.mix = function(toObject, fromObject, args) {

        //#todo check args
        var i;
        if (T.is_function(toObject)) {

            for (i in fromObject) {

                toObject.prototype[i] = fromObject[i]; //add properties to the base class prototype
            }

            // return a new Object of the base class, pasing arguments if available
            return (args === undefined ? new toObject() : new toObject(args));
        } { //else b is an object

            for (i in fromObject) {

                toObject[i] = fromObject[i]; //add properties to the base class prototype
            }
            return toObject;
        }

    };


    /**
     * Applies object properties from <br/>
     * The first argument -- the supplier to
     * the second argument -- the receiver
     * and initializes the object the class, if a constructor was passed
     *@function
     * @param {Function | Object} reciever The constructor/object to recieve properties
     * @param {Function | Object} supplier The constructor/object supplying properties
     *
     * @param {Boolean} overwrite If set to true, properties already on the receiver will be overwritten if found
     *                 on the supplier.
     * @param {Mixed | null} args Extra arguments to be passed to the augmented cconstructor/object during initialization,
     *                   argument is passed as-is, pass null if no argumentss
     *                 i.e. if u pass an Array it is passed directly to the object constructor
     * @example
     *
     *   //create a reciever using a function constructor
     *   var reciever = function(){ 
     *   this.message = 'hello TigerJS world'; 
     *   this.id = 60; 
     *   }
     *   reciever.prototype.aPrototypeProperty = "GNU's not Unix";
     *
     *   //create a supplier as a plain object
     *   var supplier = { id : 70 , aPrototypeProperty = "Its not Windows either", foo : [baz] }
     *
     *   //aggregate properties on the reciever and create new reciever object
     *  reciever = T.aggregate(reciever, supplier, true, someArgs);
     *
     * //reciever is now an object with the ff properties
     *
     *  reciever.message = 'hello TigerJS world';
     *  reciever.id = 70; // due to the overwrite flag set to true
     *  reciever.aPrototypeProperty = "Its not Windows either"; //also due to overwrite
     *  reciever.foo = [baz] // due to aggregation of suppliers property
     * @return {Object} returns an object of the extended reciever class
     */
    this.aggregate = function(reciever, supplier, overwrite, args) {
        var r = reciever,
            s = supplier,
            o = overwrite,
            //#todo check args
            _r = (typeof reciever) === 'function' ? new reciever(args) : reciever, //internal reciever object
            _s = (typeof supplier) === 'function' ? new supplier : supplier, //internal supplier object

            /**
             *@ignore
             */
            _o = function() {}; //This constructor shall be our return object
        //inherit all object from the reciever

        _o.prototype = _r;
        for (var i in _s) {

            if (_r[i] && o) { //if a property existing on the reciever is found --
                //on  the supplier, overwrite this property  if flag is set to true
                _o.prototype[i] = _s[i];
            }

            if (!_r[i]) { //if an item on the supplier is not on the reciever, augment

                _o.prototype[i] = _s[i];
            }
        }

        return (args === undefined ? new _o : new _o(args)); // return a new Object of our internal result constructor, pasing arguments if available

    };

    /**
     * Extend a class with n parent classes
     *
     *         This method extends a base or calling class with properties of argument superclasses.
     * However static properties are not inherited.
     * The inherit method should be called before any Object initialization with new
     *        Unlike aggreagate this method sets up, proper inheritance chains so changes
     * to any of the parent classes is effected in the extended class. Ultimately duplicate properties
     * are overwritten when found on the next superclass in line, so be careful of how you pass args
     *
     *
     * @example
     // 1st Object constructor [base class]
     function foo() {
     this.a = 1;
     this.b = 2
     }
     //2nd Object constructor [class to be extended]
     function bar() {
     this.c = 5;
     this.d = 3;
     }
     //3rd Object constructor [ another class to be extended]
     function baz() {
     this.e = "L";
     this.PI = 3.142;
     this.a = 10
     }
     
     
     //Then the inheritance is done this way.
     
     var foo = T.extend(foo, [bar, baz]), // argument 2 is Initializer Array
     //An Object initializer can be used in place of the array,but
     //this does'nt work on IE
     
     
     x = new foo(); //has properties of all three clases, also x.a = 10, as the value
     //originally on foo is overwritten during the inheritance
     //
     //lets view the properties now in foo
     console.log(T.dump(x));
     
     *
     *  Also after the inheritance. foo has all properties of bar and baz, along with its own.
     *  This method theriotically has no limit on the number of subclasses to inherit.
     *  Objects created from clases extended with 'extend' are also considered instances
     *  of the inherited classes
     * i.e above object x would yeild the following results
     *          x instanceof Object //true
     *          x instanceof foo //true
     *          x instanceof bar //true
     *          x instanceof baz //true
     *@type Object
     *@param {Object} baseClass The calling constructor class
     *@param {Array} funcArray An array referncing each Funtion object to include in the prototype chain
     *@return {Object} returns a reference to the augmented constructor class
     */

    this.extend = function(baseClass, funcArray) {
        //#todo check args

        var oa = [];
        //add the base class to the array

        funcArray.unshift(baseClass);

        for (var i = 0; i < funcArray.length; i++) {

            //iteratively inherit properties of the Objects in the argument array
            if (oa.length > 0) {
                //the last element in the "oa" array is the previous index processed
                //so the current constructor inherits it
                funcArray[i].prototype = new oa[oa.length - 1];
            }
            oa[oa.length] = funcArray[i]; //add the current index to the array
        }

        return oa[oa.length - 1];; //return the last constructed object
    };

    /**
     * Return the keys of an object
     *@function
     *@param {Object} _Object
     * @return {Array} The keys of the passed object as an array
     */

    this.keys = function(_Object) {
        var r = [];
        for (var i in _Object) {

            r[r.length] = i;
        }

        return r;
    };


    /**
     * Return the values of an object
     *@param {Object} _Object
     * @return {Array} The values of the passed object as an array
     */

    this.values = function(_Object) {
        var r = [];
        for (var i in _Object) {

            r[r.length] = _Object[i];
        }

        return r;
    };

    /** Returns out human readable information about a variable, array or object similar to php [print_r, dump],
     * it also provides entire varialble or Object structure for DOM ELements. This method proves quite useful
     * for debugging purposes as u see exactly whats going on in your variables and object, so u might want to
     * redirect the output, somehow!!
     * @experimental
     * @example
     * //Developed from the similar 'dump' function at
     *  //http://www.openjs.com/scripts/others/dump_function_php_print_r.php
     * example
     *    var arra = new Array("So long",'s',42,42.13,"Hello World" , {'a':1, 'b':2},99);
     *    var assoc = {
     *      "val"  : "New",
     *      "number" : 8,
     *      "theting" : arra,
     *              "foo"   : 'bar'
     *  };
     *           ///then do
     *     document.write( T.dump(assoc));
     * // should output---------->
     *
     *              (OBJECT)--> '....
     *                 'val' => "New"
     *                 'number' => "8"
     *                 'theting' -->  (ARRAY)
     *                        '0' => "So long"
     *                        '1' => "s"
     *                        '2' => "42"
     *                        '3' => "42.13"
     *                        '4' => "Hello World"
     *                        '5' -->  (OBJECT)
     *                               'a' => "1"
     *                               'b' => "2"
     *                        '6' => "99"
     *
     *                 'foo' => "bar"
     *     // note :- In IE < 7 enumeration is not necceserily performed in source code order</pre>
     *@param {Mixed} arr_ The Javascript or DOM type to dump out variable information for
     *@function
     *@type {String}
     */
    this.dump = function(arr_) {

        var f = function(arr, level, item) { //default dump function for objects and constructors
            var dumped_text = "";
            if (!level) {
                level = 0;
            }
            //The padding given at the beginning of the line.
            var level_padding = "",
                sp_ = "     ";
            for (var j = 0; j < level + 1; j++)
                level_padding += "    ";
            ////////////////////// NO EDIT BELOW THIS LINE /////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////////////////////////
            try {
                if (arr.constructor.toString()
                    .indexOf('Array') > -1 && !item) {

                    dumped_text += "(ARRAY) ==> \"' ...\n";
                }
                if (arr.constructor.toString()
                    .indexOf('Array') > -1 && item) {

                    dumped_text += level_padding + "  '" + item + "'  -->  (ARRAY)  ...\n";
                }
                if (arr.constructor.toString()
                    .indexOf('Object') > 1 && !item) {

                    dumped_text += "(OBJECT) ==> \"' ...\n";
                }
                if (arr.constructor.toString()
                    .indexOf('Object') > 1 && item) {

                    dumped_text += level_padding + "  '" + item + "'  -->  (OBJECT)  ...\n";
                }

                if (arr.constructor.toString()
                    .indexOf('function') === 0 && !item && arr.constructor.toString()
                    .indexOf('(') === 9) {


                    dumped_text += "(OBJECT) ==> \"' ...\n";
                }
                if (arr.constructor.toString()
                    .indexOf('function') === 0 && item && arr.constructor.toString()
                    .indexOf('(') === 9) {


                    dumped_text += level_padding + "  \'" + item + "'  -->  (OBJECT)  ...\n";
                }
            } catch (e) {}
            ///////////////////// END NO EDIT ///////////////////////////////////////////////////////////////////////////

            if (typeof(arr) === 'object') { //Array/Hashes/Objects


                for (var item_ in arr) {

                    var value = arr[item_];
                    if (value && value.nodeType) {
                        //prabably an array or object with HTML element references in its element
                        dumped_text += d(value);
                    } else if (value && typeof(value) === 'object' && value !== window) { //If it's enumerable|recurese|but dont recurse if the object is a widow reference

                        dumped_text += "  \'" + item_ + "\' => " + T.dump(value, level + 50, item_);

                    } else if (typeof(value) === 'function') {

                        dumped_text += "                            " + sp_ + level_padding + sp_ + "'" + item_ + "' => \"" + 'function(){}' + "\"\n";
                    } else {

                        dumped_text += "                            " + sp_ + level_padding + sp_ + "'" + item_ + "' => \"" + value + "\"\n";
                    }
                }

            } else { //Stings/Chars/Numbers etc.
                dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";

            }
            return dumped_text; //return the internal information(dump) about this object

        };
        var d = function(arr) { //Handler for DOM/HTML types, no recursion

            var dumped_text = "",
                level = 2;
            dumped_text += T.type(arr) + " ==> \"' ...\n";

            //The padding given at the beginning of the line.
            var level_padding = "",
                sp_ = "     ";
            for (var j = 0; j < level + 1; j++)
                level_padding += "    ";
            if (arr && typeof(arr) === 'object') { //valid Node
                // arr = new Object(arr);
                for (var item in arr) {

                    try { //google chrome and some others throw error here (strange) if arr[item] is null

                        dumped_text += sp_ +
                            level_padding + sp_ + "'" +
                            item + "' => \"" +
                            (T.type(arr[item]) === "Function" ? T.type(arr[item]) : new String(arr[item])
                                .replace(/[\n]/g, "")) + "\"\n";
                    } catch (e) {
                        //any case or arr[item] that can be converted to object

                        dumped_text += sp_ + level_padding + sp_ + "'" + item + "' => \"" + "undefined\"\n";
                    }

                }
            }

            return dumped_text; //return the internal information(dump) about this DOM object

        };
        if (arr_.nodeType) { // collections and nodeList will pass thru|cuz they dont have nodeType

            arr_ = T.$(arr_.cloneNode(true));
            return d(arr_); //send to DOM Dump handler
        }
        //IE constructors for DOM ELements attributes and Nodelist have an Undefined  constructors
        if (arr_.constructor === undefined)
            return d(arr_);

        var _ty = T.type(arr_)
            .
        replace(/^\s*((?:[\S\s]*\S)?)\s*$/, '$1'); //trimmmm


        //Handle regular types, trim to avoided any extra spaces (some browsers are SPACE CRAAAAZZYY!!
        if (_ty === "Array" || _ty === "Arguments" || "Promise" ||
            _ty === "String" || _ty === "Math" || _ty === "Error" ||
            _ty === "Object" || _ty === "ArrayBuffer" || _ty === "DataView" ||
            _ty === "Float32Array" || _ty === "Float64Array" || _ty === "JSON" ||
            _ty === "Uint16Array" || _ty === "Uint32Array" || _ty === "Uint8Array" ||
            _ty === "Uint8ClampedArray" || _ty === "Regexp" || _ty === "RegExp" || _ty === "Date") {

            return f(arr_);
        }

        if (_ty === "Function") { //this would be returned for objects cretaed by anonymous functions,
            // like var foo = function(){} or just like our TigerJS object, created by TigerJS = function()...
            //or unitialized function constructors

            return f(new arr_.constructor);
        }

        //next check if its  an HTMLCollection or NodeList
        //if its a collection just pass it to the Dom handler, it did not get passed above, cuz it doesnt have a NodeType
        if (Object.prototype.toString.call(arr_) === "[object NamedNodeMap]" ||
            Object.prototype.toString.call(arr_) === "[object NodeList]" ||
            Object.prototype.toString.call(arr_) === "[object HTMLCollection]" ||
            Object.prototype.toString.call(arr_) === "[object HTMLAllCollection]" ||
            Object.prototype.toString.call(arr_) === "[object HTMLPropertiesCollection]" ||
            Object.prototype.toString.call(arr_) === "[object HTMLOptionsCollection]" ||
            Object.prototype.toString.call(arr_) === "[object HTMLFormControlsCollection]" || T.type(arr_) === "TigerJS.NodeList" //for our T.nodes type
        ) {

            return d(arr_); //send to Dom dump handler
        } else {

            //If we got here then, we have a  a valid object of a custom function constructors ( like function foo(){})
            // which would return foo as its type
            return (function(f_) {

                try {

                    return f(new f_.constructor);
                } catch (e) {

                    return f(f_);
                }
            }(arr_));
        }

    };

    /**
     * //Executes the supplied function for each item in
     * //a collection, optionally within the context of an object.  Supports arrays and objects
     *
     * @param {Object | Array} Obj the object to iterate
     * @param {Function} Callback the function to execute.  This function
     * receives the value, and key of the Obj parameter as arguments
     *
     * @param {Object} [Context] the execution context
     * @example
     *
     var ar = new Array('1', '2', 'love emacs') //define an array or object to iterate through
     
     function eC() { //define an execution context {Object}
     this.P = 3;
     }
     function stuff(v, k) {  //define a function that 'each' will call
     
     //this recieves the value(v)and key(k) 
     
     console.log("%d".sprintf(this.P * v))  //also it recievs eC as its execution context ie -- this --
     //inside the function, points to an instance of 'eC'
     }
     T.each(ar, stuff, eC);
     
     *  //would print the ff
     *   //3, 6 and NaN by multiplying the value in our object by the array values
     *
     */
    this.each = function(Obj, FuncRef, Exec) {
        var i, len;
        if (T.type(Obj) === 'Array' || T.type(Obj) === 'Arguments' || T.type(Obj) === 'TigerJS.Iterator') { //IE doesnt iterate the argument object by index

            for (i = 0, len = Obj.length; i < len; i++) {

                (Exec) ? FuncRef.call(new Exec, Obj[i], i): FuncRef(Obj[i], i);
            }

        } else { //for objects

            for (i in Obj) {

                (Exec) ? FuncRef.call(new Exec, Obj[i], i): FuncRef(Obj[i], i);
            }

        }
    };

    /**
     * Poll a function preiodicaly until a true value is returned, the final value returned is sent to a callback function
     * @param {Function} Func Funtion to poll
     * @param {Function} callback Callback to be called with the last recieved truth value when polling ends
     * @see TigerJS#periodic
     * @type Mixed
     */
    this.poll = function(Func, callback) {

        var f = Func,
            cb = callback,
            val = f();

        function recall() {

            T.poll(f, cb);
        } //call us back

        if (val === true) {
            cb(val);
            return;
        } else {
            setTimeout(recall, 50);
        }

        return;
    };
    /**
     * Call a function preiodicaly until a specified value is returned, or we reach a specified number of retry's
     * This function differs from {@link #poll} in that it gives the user more controll over the polled function such as
     * the poll interval, specifying an exact return value e.t.c.
     * @param {Function} func Funtion to poll
     * @param {Function} [callback] Callback function to be called with the last recieved truth value when polling ends
     * @param {Function} return_val Return value we're expecting
     * @param {Number} [ poll_interval = 100ms] The polling interval, in ms Defaults to 100ms
     * @param {Number} timeout How many times to poll this function for the return value before we TIMEOUT, defaults to poll forerver
     
     *  @function
     */
    this.periodic = function(func, callback, return_val, poll_interval, timeout) {

        var cb = callback || null, //callback

            ival = poll_interval || 100, //interval le poll

            t_o = timeout || null, //how many polls b4 we timeout

            r_val = return_val || null, //an optional return value, which when we get signalls the end of polling

            count = 0, // keep count for timeout value

            /**
             
             *@ignore
             
             */
            g = function() {

                if (count && count === t_o) {

                    clearInterval(iv);
                    return;
                } //time-out if needed

                var val = (func());
                if (val && val === r_val) {

                    clearInterval(iv);
                    if (cb)
                        cb(val); //if we've a valid return value, check for a callback and send it the return value

                    return;
                }

                ++count;
            },
            iv;
        iv = setInterval(g, ival);
    };

    /**
     * Creates a function that always returns the same value.
     * @param {mixed} retValue The value to return.
     * @return {function} The new function.
     *
     * @example
     * var v = T.constant("hello"); //returns a function that always outputs hello
     *
     * v() ;// => hello
     *
     */
    this.constant = function(retValue) {
        return function() {
            return retValue;
        };
    };
    /**
     * Creates a function that returns true if each of its components evaluates
     * to true. The components are evaluated in order, and the evaluation will be
     * short-circuited as soon as a function returns false.
     * For example, (T.and(f, g))(x) is equivalent to f(x) && g(x).
     * @param {...Function} var_args A list of functions.
     * @return {boolean} A function that AND's its component functions.
     *
     * @example
     *  function a(){
     *   return true;
     *  }
     *  function a(){
     *   return false;
     *  }
     *
     *  console.log(T.and(a, b)()); //this should return false as
     *  //both functions do not return True values
     *
     *  //as you see in the example T.and() returns a function so in the example where we wrote
     *  //T.and(a, b)(), it meant calling the function returned by  T.and()
     *
     *   //which means we can pass a variable number of arguments to the argument functions a and b
     *   //by doing T.and(a, b)(argumentsForEachFunctions)
     *
     *  //where argumentsForEachFunctions are argument(s) to be sent to function a and function b
     */
    this.and = function(var_args) {
        var functions = arguments,
            length = functions.length;
        return function() {
            for (var i = 0; i < length; i++) {
                if (!functions[i].apply(this | arguments)) {
                    return false;
                }
            }
            return true;
        };
    };
    /**
     * Creates the composition of the functions passed in.
     * The composition is performed in reverse order, so the last function
     * calls by the previous and so on..<br/>
     * For example, (T.compose(f, g))(a) is equivalent to f(g(a)).
     *
     * If the functions return a value the returned value of the last called function is passed to the previous
     *
     * @param {...Function} var_args A list of functions.
     * @return {function(...[?]):T} The composition of all inputs.
     *
     * @example
     *    function a(val){
     
     console.log(val);
     console.log("called next");
     }
     function b(){
     
     console.log("called first")
     return 11;
     }
     
     T.compose(a,b)();
     
     //the function b is called firat in the composition
     // so the text  (called first) is first logged
     // then function a is called, recieveing the return value from function b (i.e. 11)
     // so 11 is logged next from function a then the text: (called next) is logged
     *
     */
    this.compose = function(var_args) {
        var functions = arguments,
            length = functions.length;
        return function() {
            var result;
            if (length) {
                result = functions[length - 1].apply(this, arguments);
            }

            for (var i = length - 2; i >= 0; i--) {
                result = functions[i].call(this, result);
            }
            return result;
        };
    };
    /**
     * Creates a function that calls the functions passed in, sequentially, and
     * returns the value of the last function. For example,
     * (T.sequence(f, g))(x) is equivalent to f(x),g(x).
     * @param {...Function} var_args A list of functions.
     * @return {Function} A function that calls all inputs in sequence.
     */
    this.sequence = function(var_args) {
        var functions = arguments,
            length = functions.length;
        return function() {
            var result;
            for (var i = 0; i < length; i++) {
                result = functions[i].apply(this, arguments);
            }
            return result;
        };
    };
    /**
     * @ignore
     *
     */
    this._isDOCUMENTReady = false;
    /**
     * Returns true when the dom is ready, if u need to act when the dom is ready, you could use {@link TigerJS#register_startup_functions}
     *@function
     * @type Boolean
     */

    this.dom_ready = function() {

        return document.readyState.match(/interactive/gi) !== null || document.readyState.match(/complete/gi) !== null;
    };
    /** Sets a cooke given certain specifications.  It overrides any existing
     * cookie with the same name.
     *
     * @param {String} name the cookie name.
     * @param {String} value the cookie value.
     * @param {String} domain the cookie domain.
     * @param {String} path the cookie path.
     * @param {Number} exp_days {number of days of cookie validity.
     */
    this.write_cookie = function(name, value, domain, path, exp_days) {
        value = encodeURIComponent(value);
        var ck = name + "=" + value,
            exp;
        if (domain)
            ck += ";domain=" + domain;
        if (path)
            ck += ";path=" + path;
        if (exp_days) {
            exp = new Date();
            exp.setTime(exp_days * 86400000 + exp.getTime());
            ck += ";expires=" + exp.toGMTString();
        }
        document.cookie = ck;
    };
    /**
     * Retrieves the value of a cookie.
     * @type String | NULL
     * @param name {string} the cookie name
     * @return {String | null} a string with the cookie value, or null if it can't be found.
     */


    this.get_cookie = function(name) {
        var pattern = name + "=",
            tokenPos = 0 | endValuePos;
        while (tokenPos < document.cookie.length) {
            var valuePos = tokenPos + pattern.length;
            if (document.cookie.substring(tokenPos, valuePos) === pattern) {
                endValuePos = document.cookie.indexOf(";", valuePos);
                if (endValuePos === -1) { // Last cookie
                    endValuePos = document.cookie.length;
                }
                return decodeURIComponent(document.cookie.substring(valuePos, endValuePos));
            }
            tokenPos = document.cookie.indexOf(" ", tokenPos) + 1;
            if (tokenPos === 0) { // No more tokens
                break;
            }
        }
        return null;
    };
    /**
     * Deletes a document cookie with a value matching the name parameter,
     * this method cannot work on http-only cookies
     *
     * @param name {string} the cookie name
     */
    this.delete_cookie = function(name) {
        this.write_cookie(name, "", "", "", -1);
    };

    /**
     * Build a valid http-query String from a Javascript Array/Object or Directly from a form element
     * @param {Array | Object | HTMLFormElement} formdata An array, object or form element, the array or object should only contain scalar-values, like
     *                                                    text or numbers else the function might fail
     * @param {string} numeric_prefix Prefix to be used for integer based Object indexes or Array Indexes
     * @param {string} [arg_separator= &] Custom seperator in the resulting string seperating each key value pair,[Does not work with HTMLForm inputs} defaults to &
     * @return {String} An http-query string suitable for use with Ajax request
     * Improved from the function  at: http://phpjs.org/functions/http_build_query
     *
     <pre>
     /// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     /// +   improved by: Legaev Andrey
     /// +   improved by: Michael White (http://getsprink.com)
     /// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     /// +   improved by: Brett Zamir (http://brett-zamir.me)
     /// +    revised by: stag019
     /// +   improved By  Agbalaya Olubodun, () Modified method to accept form arguments, and other optimizations
     /// *     example 1: \php.http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&');
     /// *     returns 1: 'foo=bar&php=hypertext+processor&baz=boom&cow=milk'
     /// *     example 2: \php.http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_');
     /// *     returns 2: 'php=hypertext+processor&myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&cow=milk'
     </pre>
     *
     */

    this.http_build_query = function(formdata, numeric_prefix, arg_separator) {

        var value, key, tmp = [];
        //if we're been sent a form

        if (formdata.nodeType && formdata.nodeType === 1 && formdata.tagName.toLowerCase() === "form") {

            tmp = "";
            //General input elements

            for (var i = 0, len = formdata.elements.length; i < len; i++) {

                if (formdata.elements[i].tagName.toLowerCase() !== "select") { //handle select belows

                    tmp += formdata.elements[i].name + "=" + formdata.elements[i].value;
                    tmp += "&";
                }

                //select elements need to be processed seperately from other elements

                if (formdata.elements[i].tagName.toLowerCase() === "select") {

                    for (var j = 0, len_ = formdata.elements[i].options.length; j < len_; j++) {

                        if (formdata.elements[i].options[j].selected) {

                            tmp += formdata.elements[i].name + "=" + formdata.elements[i].options[j].value;
                            tmp += "&";
                        }

                    }

                }

            }

            return tmp;
        }

        /*
         
         * @ignore
         
         * Handle Objects containing the post data here
         
         */

        var f = function(key, val, arg_separator) {

            var k, tmp = [];
            if (val === true) {
                val = "1";
            } else if (val === false) {
                val = "0";
            }
            if (val !== null && typeof(val) === "object") {
                for (k in val) {

                    if (val[k] !== null) {
                        tmp.push(f(key + "[" + k + "]", Object.prototype.toString.call(val[k]), arg_separator));
                    }
                }
                return tmp.join(arg_separator);
            } else if (typeof(val) !== "function") {
                return encodeURIComponent(key) + "=" + encodeURIComponent(val);
            } else {
                //            throw new Error('There was an error processing for http_build_query().');
                return "";
            }
        };
        if (!arg_separator) {
            arg_separator = "&";
        }

        for (key in formdata) {
            value = formdata[key];
            if (numeric_prefix && !isNaN(key)) {
                key = String(numeric_prefix) + key;
            }

            tmp.push(f(key, value, arg_separator));
        }
        return tmp.join(arg_separator);
    };
    /**
     * Check if an Object is empty, that is has no properties
     * @param obj {Object} The Object To test
     *@function
     * @type Boolean
     */
    this.is_empty = function(obj) {
        for (var i in obj) {

            if (i) {

                return false;
            }
        }
        return true;
    };

    /**
     * Is the variable/Object an Array.
     * @function
     * @type Boolean
     
     * @param {Object} arg The item to test
     *
     */

    this.is_array = function(arg) {

        return this.type(arg) === 'Array';
    };

    /**
     * Is the variable/Object a Number Object
     *@function
     *@param {Object} arg The item to test
     * @type Boolean
     *
     */
    this.is_number = function(arg) {

        return this.type(arg) === 'Number';
    };

    /**
     * Is the variable/Object a String
     *@function
     *@param {Object} arg The item to test
     * @type Boolean
     *
     */
    this.is_string = function(arg) {

        return this.type(arg) === 'String';
    };

    /**
     * Is the variable/Object a Function
     *@function
     @param {Object} arg The item to test
     * @type Boolean
     *
     */
    this.is_function = function(arg) {

        return this.type(arg) === 'Function';
    };

    /**
     * Is the variable/Object a Date Object
     *@function
     *@param {Object} arg The item to test
     * @type Boolean
     *
     */
    this.is_date = function(arg) {
        var s = new Date(arg);
        return (s === null || s.toString() === "NaN" || s.toString() === "Invalid Date") ? false : true;
    };
    /**
     * Is the variable/Object a valid RegExp Object
     *@function
     *@param {Object} arg The item to test
     * @type Boolean
     *
     */
    this.is_regexp = function(arg) {

        return this.type(arg) === 'Regexp';
    };

    /**
     * Is the variable/Object a Boolean Object
     *@function
     *@param {Object} arg The item to test
     * @type Boolean
     *
     */
    this.is_boolean = function(arg) {

        return this.type(arg) === 'Boolean';
    };
    /**
     * Is the variable/Object an Object
     *@function
     *@param {Object} arg The item to test
     * @type Boolean
     *
     */
    this.is_object = function(arg) {

        return this.type(arg) === 'Object';
    };
    /**
     * Is the variable/Object an Enumerable type
     *@function
     *@param {Object} arg The item to test
     * @type Boolean
     *
     */
    this.is_enumerable = function(arg) {


        return (T.type(arg) === 'Array' || T.type(arg) === 'Nodelist' || T.type(arg) === 'Object' || T.type(arg)
            .indexOf('Collection') !== -1);

    };

    /**
     * Is the variable/Object a valid URL
     *@function
     *@param {Object} arg The item to test
     * @type Boolean
     *
     */
    this.isurl = function(arg) {

        if (arg.indexOf('.') === -1)
            return false;
        var path,
            query, host,
            // Regexp for allowed characters in URL paths
            pathRE = /^([-a-z0-9._~:@!$&'()*+,;=\/]|%[0-9a-f]{2})*$/i,
            // Regexp for allowed characters in querystrings and URL fragments
            qfRE = /^([-a-z0-9._~:@!$&'()*+,;=?\/]|%[0-9a-f]{2})*$/i,
            //alloweg chars in host name
            hRE = /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/i,
            uri = T.Parser.parse_uri(arg); //parser returns an object with props[path query host anchor file relative [i.e relativepath] user password userInfo
        //authourity source port]

        path = uri.path;
        query = uri.query;
        host = uri.host;
        if (path && !path.match(pathRE)) {
            return false;
        }
        if (query && !query.match(qfRE)) {
            return false;
        }
        if (host && !host.match(hRE)) {
            return false;
        }
        return true;
    };
    /**
     *
     * Validate an IP address
     * In multiple formats <pre>
     * Regular dotted decimal  in the form  192.168.0.225, or a valid IPv6 address
     * @param {String} arg An IP address to validate
     * Returns true if the Ip Validates else returns false
     *@function
     
     * @type Boolean
     */

    this.is_ip = function(arg) {


        if (/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(arg)) { //detect general dotted IP4 format

            var myArray = arg.split(/\./);
            //each range cant go beyong 255
            if (myArray[0] > 255 || myArray[1] > 255 || myArray[2] > 255 || myArray[3] > 255)
                return false;
            //funny IP
            if (myArray[0] === 0 && myArray[1] === 0 && myArray[2] === 0 && myArray[3] === 0)
                return false;
            return true;
        }


        return this.ipv6(arg) ? true : false; //if we got here then it should be ipv6, or a bad input

    };

    /**
     * @ignore
     * Handle IPv6 validation
     *@param {Number} ip
     */
    this.ipv6 = function(ip) {
        var lastcolon, match;
        // Test for empty address
        if (ip.length < 3) {

            return ip === "::";
        }

        // Check if part is in IPv4 format
        if (ip.indexOf('.') > 0) {

            lastcolon = ip.last_index_of(':');
            if (!(lastcolon && /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(ip.substr(lastcolon + 1))))
                return false;
            // replace IPv4 part with dummy
            ip = ip.substr(0, lastcolon) + ':0:0';
        }

        // Check uncompressed
        if (ip.indexOf('::') < 0) {
            match = ip.match(/^(?:[a-f0-9]{1,4}:){7}[a-f0-9]{1,4}$/i);
            return match !== null;
        }

        // Check colon-count for compressed format
        if (substr_count(ip, ':')) {
            match = ip.match(/^(?::|(?:[a-f0-9]{1,4}:)+):(?:(?:[a-f0-9]{1,4}:)*[a-f0-9]{1,4})?$/i);
            return match !== null;
        }

        // Not a valid IPv6 address
        return false;
    };
    /*
     * @ignore
     * this just to help ipv6 validation, we have a slicker version in {@link TigerJS.String}, this is a direct (almost) port frm PHP
     */
    function substr_count(haystack, needle, offset, length) {
        var cnt = 0;
        haystack += '';
        needle += '';
        if (isNaN(offset)) {
            offset = 0;
        }
        if (isNaN(length)) {
            length = 0;
        }
        offset--;
        while (!!(offset = haystack.indexOf(needle, offset + 1)) !== -1) {
            if (length > 0 && (offset + needle.length) > length) {
                return false;
            } else {
                cnt++;
            }
        }

        return cnt;
    }

    /**
     * Check for a valid email address
     *@function
     *@param {string} arg String to validate as email
     * @type Boolean
     */
    this.is_email = function(arg) {

        return (T.Parser.parse_address("mail" | arg))
            .length > 0;
    };


    /**
     * Clone an Exixting Object/Hash and Return the cloned Copy
     *@function
     *@param {Object} obj Object to Clone
     * @type Object
     *
     * @example
     *   var obj = {a: 1, b: 2, c: 3};
     var c = T.clone(obj);
     
     //add new properties to the clone only
     c.lol = ":)";
     
     console.log(c.lol);// outputs :)
     console.log(obj.lol); // returns undefined, property was only set in cloned object
     *
     */
    this.clone = function(obj) {

        return (this.aggregate({}, obj, true));
    };

    /**
     * @ignore
     */
    var f_arr = [];
    /**
     * Register startup functions to be executed as soon as the page loads
     * @param {...Function} func A variable list of function pointers
     * @function
     * @type void
     */

    this.register_startup_functions = function() {

        T.each(arguments, function(x) {

            f_arr[f_arr.length] = x;
        }); //iteratively add argument functions to the list

    };
    /**
     * @ignore
     */

    this.execute_startup_routines = function() {

        try { //avoid -useless settimeout error- in  FF, those guys are wacko!!, love the nightly's
            T.each(f_arr, function(x) {
                setTimeout(x, 10);
            }); //execute registered startup functions
        } catch (e) {}
    };
    /**
     * Returns an object containing the visible dimensions of the view-port
     
     * in the form <b>{height:val, width:val}</b>
     *@function
     * @type Object
     * @example
     *
     * var viewPortDimensions = T.dim();
     *
     * //show the width and height
     * console.log("Viewport width :"+ viewPortDimensions.width);
     * console.log("Viewport height :"+ viewPortDimensions.height);
     */

    this.dim = function() {

        //so much differences between browsers
        var iWidth = document.documentElement.clientWidth || win.innerWidth || document.documentElement.scrollWidth || 0,
            iHeight = document.documentElement.clientHeight || win.innerHeight || document.documentElement.scrollHeight || 0;
        //scroll offsets
        //             iScrollX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
        //            iScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        return {
            width: iWidth,
            height: iHeight

        };
    };
    /**
     * Parses the argument as a query string and retuns an Object conaining individual query values/name properties
     * 
     * @param {String} [query = location.search}  string with GET parameters in the form name=val&name=val%&....
     * 
     * @return {Object} 
     */

    this.parse_query = function(qstr) {
        var qstr = qstr || location.search;
        var query = {};
        var a = (qstr[0] === '?' ? qstr.substr(1) : qstr)
            .split('&');
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split('=');
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }
        return query;
    };


    /**
     Returns an object using the first array as keys and the second as values. If
     the second array is not provided, or if it doesn't contain the same number of
     values as the first array, then `true` will be used in place of the missing
     values.
     
     @example
     
     T.hash(['a', 'b', 'c'], ['foo', 'bar']);
     // => {a: 'foo', b: 'bar', c: true}
     
     *@function
     @param {Array|TigerJS.Iterator} keys keys Array of strings to use as keys.
     @param {Object|Array|String|HTMLCollection|nodeList|TigerJS.Iterator} val Object who's indexes are
     to be used as values.
     @return {Object} Object Hash using the first object as keys and the second as values.
     
     */
    this.hash = function(keys, val) {
        var i = T.Iterator(keys),
            j = T.Iterator(val),
            o = {};
        i.forward_iterator(function(v) {

            o[v] = j.size() && j[i.key] ? j[i.key] : true; //put in the keys and values

        });

        return o;
    };
    /**
     * Chain allows you create a chain of function callbacks that are guaranteed to run in order.
     * This will enable process-intensive operations that will lock up the UI while the JavaScript is being executed to
     * be broken up into chunks, helping to keep your application responsive.
     * Yadah Yadah.<br/>
     * If You can start the execution chain with run(),  pause() to temporarily delay execution and resume() to continue
     * from the paused state
     * , or
     * stop() to stop and reset the queue ;
     *@function
     * @param {...Object | ...Function} var_args A variable  list of functons
     *                 or a variable list of object arguments with the following properties<p/>
     *               <font color='red'>ctx</font>  => A reference to an execution context, defaults to window<br/>
     *               <font color='red'>args</font> => An array containing argument to pass to the function<br/>
     *               <font color='red'>autoContinue</font> => set to false to pause the queue after executiong this function <br/>
     *               <font color='red'>fn</font> => a function to execute<br/>
     *
     *  @type Object
     *
     *  @example
     *
     *  //create two functions
     *   function a(){
     alert(1)
     return true;
     }
     function b(){
     alert(3)
     return true;
     }
     
     var chain = T.chain(a, b);// this create the chain object allowing us to control how our functions are run
     chain.run(); //start the execution of both functions in order
     *
     *
     * //example showing how to pause and resume the chain
     *
     *
     *        //so first lets say we have three functions a, b, and c
     *
     *          function a() {
     console.log("in first chained function");
     console.log(arguments); //just log the arguments
     
     }
     function b() {
     console.log("in 2nd chained function");
     console.log(arguments); //just log the arguments
     }
     function c() {
     console.log("in 3rd chained function");
     console.log(arguments); //just log the arguments
     
     }
     
     //now we want this functions to be chained and executed in other
     //so wrap them in the required objects to be sent to TigerJS.chain()
     
     argumentObject_a = {
     cn: null, //just an example no need for execution context
     args: [1, 2, 3], //extra arguments for function to be chained
     autoContinue: true, //do we continue the chain after the function is executed
     fn: a // the actual function to be executed
     };
     argumentObject_b = {
     cn: null, 
     args: [4, 5, 8], //extra arguments for function to be chained
     autoContinue: false, //This statement would pause the execution chain
     fn: b // the actual function to be executed
     };
     argumentObject_c = {
     cn: null, 
     args: [9, 10, 11], //extra arguments for function to be chained
     // we did not include the autoContinue property here because its actually optional
     fn: c // the actual function to be executed
     };
     
     
     function _pausedCallback(index, chainObject){ //this would be called when we pause the execution chain
     console.log("In paused handler");
     console.log("Now lets resume the execution queue");
     chainObject.resume();
     }
     
     //create the execution chain
     var v =  T.chain( argumentObject_a, argumentObject_b, argumentObject_c );
     v.setPauseEventCallBack(_pausedCallback); //set the Pause event Handler
     v.run(); //start running the queue
     
     // now after the second function has been executed the chain would be paused to the to the
     // autoContinue property on the second argument object, this would also call the onPause Handler
     // which in this example is the _pausedCallback function
     
     *
     * @return {object}
     *  The return object is the actual execution control object for the chained functions
     *  and it has the following methods
     *  <pre>
     *   <code>
     *     run() // to start the execution chain
     *     pause() // to pause the execution chain
     *     resume() // to resume a paused execution chain
     *     stop()// stop the execution of the function chain and reset all variables
     *
     *     setPauseEventCallBack() //used to set a function handler to be called when the queue is paused
     *     //it is called with the index of the next function to be executed as its first argument and
     *     // a refrence to the chain object as the second, so chain control operations (resume,stop,.. ect)
     *     // can be performed in the callback
     *   </code>
     *   </pre>
     */

    this.chain = function(var_args) {
        var _arg = arguments;
        return new(function() {

            this.fnIterator = T.Iterator();
            this.halt = false;
            this.pauseEventFunction = null;
            this.i = this.key = 0;


            /**
             *@ignore
             * Register the event handler for pause events
             */



            this.setPauseEventCallBack = function(Func) { //stop and reset the queue
                this.pauseEventFunction = Func;

            };
            /**
             *@ignore
             * Stop the execution of the queued function and resets the queue internal pointer to the top
             */
            this.stop = function() { //stop and reset the queue

                this.halt = false;
                this.i = 0;
            };
            /**
             *@ignore
             * Resume a paused queue
             */

            this.resume = function() { //resume a paused queue

                if (this.i > 0) {
                    this.halt = false;
                    this.run();
                }

            };
            /** Temporarily pause the queue
             *@ignore
             */
            this.pause = function() { //pause the queue
                this.halt = true;
            };

            for (var i = 0; i < _arg.length; i++) {
                this.fnIterator.add(_arg[i]); //add functions or object arguments
                // to our internal iterator
            }

            /**
             * Set the queue in motion calling each function in order
             *@ignore
             */

            this.run = function() { //run the queue

                if (this.halt) {

                    return; //pause the function chain execution
                }
                if (this.i < this.fnIterator.size()) {
                    if (T.is_object(this.fnIterator[this.i])) {


                        //call each function reference in the object argument, passing arguments and bindng context as required
                        this.fnIterator[this.i].fn.apply(this.fnIterator[this.i].cn ?
                            //set the execution context if provided or default to window
                            this.fnIterator[this.i].cn :
                            window,
                            //pass extra arguments
                            this.fnIterator[this.i].args);

                        if (T.has_key(this.fnIterator[this.i], "autoContinue") && this.fnIterator[this.i].autoContinue === false) {
                            // //if an object has an autoContinue  feild to false
                            this.pause(); //pause the queue

                            this.i++; // if the function queue is later resumed we should be pointing to the next index


                            //call the pause-event callback if one is provided
                            if (this.pauseEventFunction)
                                this.pausedCallbackCall();
                            return;
                        }

                    } else {
                        // a bunch of functions not objects were sent, just run them serially
                        this.fnIterator[this.i]();
                    }

                    this.i++; //increase so we point to the next function|on the next iteration

                    this.run(); // iteratively run till we reach the end of the queue

                }
            };

            /**
             * @ignore
             * call back function called when the queue is paused
             * call with the next function index and the Chain Object
             *
             */
            this.pausedCallbackCall = function() {
                this.pauseEventFunction(this.i, this);

            };

        });
    };
    /**
     * This method delays the execution the supplied function for a certain amount of
     * time in milliseconds, specified by the 'when' parameter,  it executes the function a
     * single time unless periodic is set to true, then the function is executed periodically.
     *@function
     * @param {Number} when the number of milliseconds to wait until the function
     * is executed.
     * @param {Object} [o = Window] An execution context object, pass null if no object.
     * @param {Function | String} fn the function to execute or the name of
     * the method in the execution context object i.e the <font color='red'> o</font> to execute.
     * @param {Array} data Extra data (arguments) that is provided to the function.
     *
     * @param {boolean} periodic if true, executes continuously at supplied
     * interval (when)  until canceled.
     * @return {object} a timer object. Call the cancel() method on this
     * object to stop the timer.
     *
     * @example
     * //execute a function after a delay of 2 seconds
     *
     *
     function executeMe(arg){
     alert("I have been executed");
     alert("I was sent ("+arg+") as an argument");
     
     }
     
     T.delay(2000, null, executeMe, ["200"]);
     
     //now lets show an example that calls a function periodically after a certain delay
     //and uses an execution context
     
     var i = 0,             //we'll increment and show this value in our function
     timer_object,        //T.delay would return a timer object
     
     execution_context = { //this is the execution context object, it has one method sayHello
     sayHello: function () {
     alert("hello from the execution context");
     }
     };
     
     function executeMe(arg) { //The func to execute
     alert("Argument sent is : "+ arg); //show the argument we recieved
     
     alert("Number of calls = "+ ++i); //increment the current value of i on each call
     
     this.sayHello(); //call the method from the execution context on each call
     
     if(i=== 4) timer_object.cancel(); //when we have executed four times call the cancel method on the timer object
     
     
     }
     
     timer_object = T.delay(2000, execution_context, executeMe, [200], true);
     
     //in the last example when the call to T.delay is made it returns a timer object,
     //which is used in the executed method 'executeMe' to cancel the function call if it has been called upto four times
     
     */
    this.delay = function(when, o, fn, data, periodic) {

        //ok a little idea from YUI here
        var cancelled = false,
            method = fn,
            o = o || window,
            /**
             *@ignore
             */

            wrapper = function() {
                if (!cancelled) {

                    if (T.type(method) === "String") { //string method name sent, check if it's an object property

                        if (!o[method])
                            throw "" +
                                "InvalidMethodError <>  TigerJS.delay" +
                                "the execution context object doesn\'t contain a method named [\'" + method + "\']";

                        o[method].apply(o, data);
                    } else { // method wasn't string, asuume function
                        method.apply(o, data);
                    }
                }
            },
            time_id = (periodic) ? setInterval(wrapper, when) : setTimeout(wrapper, when);

        return { // return object
            id: time_id, //timeout/interval id
            interval: periodic || false,

            cancel: function() {
                cancelled = true;
                if (this.interval) {
                    clearInterval(this.time_id);
                } else {
                    clearTimeout(this.time_id);
                }
            }
        };
    };
    /**
     * Create HTML content from valid XHTML string.
     * @param {String} content A string containing, valid XHTML markup .
     *            When passing markup content
     *            html markup it should be written as valid xhtml code, specifically empty tags like <img> should be closed -> <img />
     *            else the function might fail.
     *  *@function
     *  @return {DocumentFragnment} returns the created nodes in a DocumentFragment Object
     */

    this.create = function(content) {
        return document.createRange()
            .createContextualFragment ? //return the created nodes
            document.createRange()
            .createContextualFragment(content) : (new DOMParser())
            .parseFromString(content, 'text/html')
            .body.firstChild; //return the created nodes


    };

    /**
     * This method returns an Instance of {@link TigerJS.nodes}
     * containing a nodelist of elements
     * that matched a list of CSS classes.
     * This method should be used in-place of {@link T.nodes} in cases where we only want to match by class
     * as it offers perfomance benefits over the latter.
     *
     *
     * @param {String} classes A space delimited list of classes to match against elements
     * @param {HTMLElement | String} [ pivotNode = document.body ] An element reference or string id of an element, which
     * if given only child elements of this nodes would be searched
     * @type TigerJS.nodes
     * @function
     * @see TigerJS.nodes
     *
     * @example
     *
     * //this statement returns a node-list of elements that have one or more of the given classes
     * // and are child-nodes of the given pivotNode i.e. anElementReference
     * //The returned nodelist is an instance of TigerJS.nodes
     * var nodes = T.$c("class_a class_b class_c", anElementReference;)
     */
    this.$c = function(classes, pivotNode) {

        if (pivotNode && pivotNode.nodeType) { //we should have a valid reference

            return T.nodes({
                childNodes: pivotNode,
                _class: classes
            });

        } else {
            return T.nodes({

                _class: classes
            });
        }


    };

    /* hasOwnPropertyEmulation */
    this.addHasOwnProperty = (function() {
        var hop = function(prop) {
            if (typeof this === 'undefined' || typeof prop === 'undefined' ||
                typeof this[prop] === 'undefined') {
                return false;
            }
            return this[prop] !== this.constructor.prototype[prop];
        };
        return function(obj) {
            try {
                obj.prototype.hasOwnProperty = hop;
                if (typeof obj.hasOwnProperty !== 'function') {
                    throw 0;
                }
            } catch (e) {
                obj.hasOwnProperty = hop;
            }
        };
    }());


    this.__to_string = function() {
        return "[object TigerJS]";

    };

};

/**
 * @class
 * Shortcut to the TigerJS Object, you should use this symbol to save typing
 * @type Object
 * @example
 *          // for example instead of
 *               TigerJS.dump(...);
 *          //use
 *
 *           T.dump(...);
 */

var T = TigerJS = new TigerJS();
//////*************static internal errror Handler
/////************** Using php style to print errors
/////First we need to intercept, but only on local computer
T.ERROR_REPORTING = window.location.href.indexOf("localhost") > -1 || window.location.href.indexOf("127.0.0.1") > -1 ? 1 : 0;
/**
 *@ignore
 */
window.onerror = function(err, file, line) {
    //error messages, format should be something like this
    //Error_type <> Error_Description
    if (T.ERROR_REPORTING) {
        if (err.indexOf("<>") > -1) {
            document.write(err.substring(err.indexOf(":") + 1, err.indexOf("<>")) + ":");
            document.write("<br/>");
            document.write(err.substring(err.indexOf("<>") + 2));
            document.write("<br/>");
            document.write("In file :" + file);
            document.write("<br/>");
            document.write("On Line" + line);
        } else {
            document.write(err);
            document.write("<br/>");
            document.write("In file :" + file);
            document.write("<br/>");
            document.write("On Line" + line);
        }
        document.close();
    }
    return true;
};


//////////////////////////XML HELPERS////////////////////////////////////////
/**
 * Create an XML Document Object
 * @function
 * @return XML DOCUMENT
 *
 * @example
 *     var XMLDoc = T.create_xml(); //create an XML Documenr
 *
 *
 console.log(T.type(XMLDoc)); //the types is returned as XMLDocument
 
 //create and append a new element using the standard DOM methods
 *      var newEle = XMLDoc.createElement("edition");
 newText = XMLDoc.createTextNode("first");
 newEle.appendChild(newText);
 XMLDoc.appendChild(newEle)
 */

TigerJS.create_xml = function() {
    return document.implementation.createDocument("", "", null);
};

/**
 *
 * Saves an XML Document or Node structure into a String
 * @param {XMLNode| XMLDocument} node The node or XML document to save
 * @function
 * @return String
 * @example
 
 var XMLDoc = T.create_xml(); //create an XML Documenr
 
 
 //create and append a new element using the standard DOM methods
 var newEle = XMLDoc.createElement("edition");
 newText = XMLDoc.createTextNode("first");
 newEle.appendChild(newText);
 XMLDoc.appendChild(newEle)
 
 //save the XML document back to a string
 
 console.log(T.save_xml(XMLDoc));
 //the above would return the following
 <?xml version="1.0" encoding="UTF-8"?><edition>first</edition>
 
 */

TigerJS.save_xml = function(node) {
    var nodedata = ((new XMLSerializer())
        .serializeToString(node));

    //if its an XML document and not just a node
    //append the XML prolog
    if (nodedata.indexOf("<?xml") === -1 && T.type(node) === "XMLDocument") {
        nodedata = ('<?xml version="1.0" encoding="UTF-8"?>' + nodedata);

    }
    return nodedata;
};


/**
 * Parses XML Data from a String
 * @param {String} data The string to parse
 * @function
 * @return XML Document
 */
TigerJS.parse_xml = function(data) {
    try {

        var parser = new DOMParser();
        var xmlDocument = parser.parseFromString(data, "application/xml");
        return xmlDocument;
    } catch (e) {

    }

};


/**
 * Add abitrary CSS Rules for a single element to the document at runtime
 * @param {String} selector A string representing a CSS Selector
 * @param {String} rules A string representing CSS style rule(s)
 * @type TigerJS
 * @example
 *
 * var CssSelector = "#ElementId >.classForAChildNode",
 *     rules = "float:letf; animation : goUp 2s ease-out";
 *
 *    T.add_css_rules(CssSelector, rules);
 */
TigerJS.add_css_rules = function(selector, rules) {

    //get our tiger stylesheet
    var sheet = document.styleSheets,
        i;
    for (i = 0; i < sheet.length; i++) {

        if (sheet[i].href && sheet[i].href.indexOf("tiger.min") > 1) {
            sheet = sheet[i];
        }

        if ("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", 0);

        } else if ("addRule" in sheet) {
            sheet.addRule(selector, rules, 0);
        }


    }
    return this;
};
/**
 * This method allows you add abitrary CSS Rules targeting multiple elements to the document,
 * and is especially useful for building up dynamic style rules for elements that are
 * inserted into the DOM at runtime
 * @param {String} CSSBlob A group of multiple CSS selectors and style declarations
 * to be added to the document
 *
 * @type TigerJS
 * @example
 *
 *
 *     T.add_css_blob("#SomeElementId{color:#ffa;  opacity:.5 !important}"+
 *                   ".SomeElementClass" + "{font-weight:bold;  text-align:.left}"+
 *                    );
 
 
 *
 */
TigerJS.add_css_blob = function(CSSBlob) {

    //>Dump a blob of style declarations to the document
    var style = document.createElement('style');
    try {
        style.innerHTML = CSSBlob;
    } catch (e) {
        style.text = CSSBlob;
    }
    document.documentElement.firstElementChild.appendChild(style);
    return this;

};