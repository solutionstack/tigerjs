/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

/**
 *  @class An Enhanced Object for manipulating  DOMElements.
 *
 * @param {String | HTMLElement} el_ String id or a reference to an HTMLElement
 * @return An enhanced HTMLElement of type {@link TigerJS.$} or a an extended DOCUMENT FRAGMENT object if the element couldnt be found.
 *               The return object also supprot chaining of operations<br/>
 *
 *
 * @TODO
 * add : method - [update] to update the innerHTML using XHR ,
 *
 *
 */

TigerJS.$ = function (el_) {
    //see if we are already an instance of T.$

    if (el_ && el_["set_xy"])
        return el_;
    this.el = el_["toUpperCase"] ? document.getElementById(el_) : el_;

    if (!this.el) {

        this.el = document.createDocumentFragment();
    }


    // extended Element Traversal Specification
    /**
     * Returns a {@link TigerJS.nodes | null} object containing the Element siblings of this element, or null
     * @function
     *@type TigerJS.nodes
     * @name TigerJS.$#element_siblings
     */

    this.el.element_siblings = function () {

        return T.nodes({
            siblings: this
        }, true) || null;
    };
    /**
     * Append Child and return this Object
     * @function
     * @param {HTMLElement} x The child to append
     * @type TigerJS.$
     * @name TigerJS.$#appendChild
     */
    this.el.append_child = function (x) {
        if (x && x.nodeType)
            this.appendChild(x);
        return this;
    };
    /**
     * Returns a {@link TigerJS.nodes} object containing the Element siblings before this element
     * @function
     * @type TigerJS.nodes | null
     * @name TigerJS.$#prev_element_siblings
     * @return {TigerJS.nodes | null} The elements found or false
     */

    this.el.prev_element_siblings = function () {
        var n = T.nodes({
            prevSiblings: this
        }, true);
        if (n)
            return n;
        return null;
    };
    /**
     * Returns a {@link TigerJS.nodes} object containing the Element siblings after this element
     * @function
     *  @type TigerJS.nodes | null
     * @name TigerJS.$#next_element_siblings
     *  @return {TigerJS.nodes | null} The elements found or false
     */

    this.el.next_element_siblings = function () {
        var n = T.nodes({
            nextSiblings: this
        }, true);
        if (n)
            return n;
        return null;
    };
    /**
     * Returns a {@link TigerJS.$} object containing this Elements previous element-sibling in document order
     * @function
     *@type TigerJS.$ | null
     *
     * @name TigerJS.$#prev_element_sibling
     * @return {TigerJS.$ | null} The elements found or false
     */

    this.el.prev_element_sibling = function () {
        //if browser supports Element transversal use that..
        var n = this.previousElementSibling;
        if (n)
            return T.$(n);

        //else use our nodes class to filter the sibling out
        n = T.nodes({
            prevSiblings: this
        }, true);

        if (n)
            return n[0];
        return null;
    };
    /**
     * Returns a {@link TigerJS.$} object containing this Elements next-sibling in document order
     * @function
     *@type TigerJS.$ | null
     * @name TigerJS.$#next_element_sibling
     * @return {TigerJS.$ | null} The elements found or false
     */

    this.el.next_element_sibling = function () {
        //if browser supports Element transversal use that..
        var n = this.nextElementSibling;
        if (n)
            return T.$(n);
        //else use our nodes class to filter the sibling out
        n = T.nodes({
            nextSiblings: this
        }, true);
        if (n)
            return n[0];
        return null;
    };
    /**
     * Removes all cildren of thie Element
     * @function
     *@type TigerJS.$
     * @name TigerJS.$#remove_child_nodes
     */
    this.el.remove_child_nodes = function () {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        return this;
    };
    //Element.
    /**
     * Return on object of type {@link TigerJS.nodes} that contain all ELement children of this element
     * @function
     * @type TigerJS.nodes | null
     * @name TigerJS.$#element_children
     * @return {TigerJS.nodes | null} The elements found or false
     */
    this.el.element_children = function () {

        return  T.nodes({
            childNodes: this
        }, true) || null;

    };
    /**
     * Returns the parent node of this element
     * @function
     * @return {TigerJS.$} The elements parent
     */
    this.el.parent = function () {

        return T.$(this.parentNode);
    };
    /**
     * Returns Boolean 'true' if this element contains the argument element,
     * @function
     * else returns false
     * @param {String | HTMLELement} needle The element or element ID to find
     * @type Boolean
     * @name TigerJS.$#contains_node
     */
    this.el.contains_node = function (needle) {

        var n = T.nodes({
            childNodes: this
        }, true);
        if (n)
            return n.contains(needle);
        return false;
    };
    /**
     * Returns the first Element child of this element as an instance of TigerJS.$ or false if no elements are found
     * @function
     * @type TigerJS.$ | Boolean
     * @name TigerJS.$#first_element_child
     */

    this.el.first_element_child = function () {
        //if browser supports Element transversal use that..
        var n = this.firstElementChild;
        if (n) {
            return T.$(n);

        }
        return false;
    };
    //
    /**
     * Returns the last ELement child of this element as an instance of TigerJS.$ or false if no elements are found
     * @function
     * @type TigerJS.$ | Boolean
     * @name TigerJS.$#last_element_child
     *
     */
    this.el.last_element_child = function () {
        var n = this.lastElementChild;
        if (n)
            return T.$(n);
        return false; //false if no last elements
    };
    /**
     * Set the position of an html element in page coordinates.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * Element Must have a positioning of Absolute or Relative
     * @function
     * @name TigerJS.$#set_xy
     * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
     * @type TigerJS.$
     */

    this.el.set_xy = function (xy) {

        if (xy[0])
            this.style.left = parseInt(xy[0], 10) + "px";
        if (xy[1])
            this.style.top = parseInt(xy[1], 10) + "px";
        return this;
    };
    /**
     * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @function
     * @name TigerJS.$#set_x
     * @param {Number} x The X values for new position (coordinates are page-based)
     * @type TigerJS.$
     */
    this.el.set_x = function (x) {
        return this.set_xy([x, null]);
    };
    /**
     * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @function
     * @name TigerJS.$#set_y
     * @param {Number} y The Y value for new position (coordinates are page-based)
     * @type TigerJS.$
     */
    this.el.set_y = function (y) {
        return this.set_xy([null, y]);
    };
    /**
     * Gets the value(s) for the specified style rule(s).
     * It's useful to use this method with {@link TigerJS.dump} to inspect the values of the
     * requested rules
     * @function
     * @name TigerJS.$#get_style
     * @param {Array} ruleMap An array containing style rules to get, leave blank to return all style properties
     * @type Object
     *
     * @example
     *         //get an object with the CSS values for the following rules
     *          var ob = T.$('id').get_style(['top','border-right-color', 'margin-top'])
     *          if u were to generate dump information on the variable ob, it might contain
     *          something like this
     *
     *          (OBJECT) ==> "' ...
     *     ' bo*rderLeftColor' => "rgb(0, 0, 255)"
     *     'marginTop' => "auto"
     *     'top' => "300px"
     * @return return an object containing all requested style rules
     */
    this.el.get_style = function (ruleMap) {
        var map, r = {},
            i;
        ruleMap = T.Iterator(ruleMap || []);
        try {
            map = document.defaultView.getComputedStyle(this, null); //OTHERS
        } catch (e) {
            map = this.currentStyle; //IE

        }

        //            map = T.map;
        if (ruleMap.length === 0) { //no rule specified return all

            for (i in map) {
                //capture only proper CSS rules
                if (i.toString()
                        .search(/[0-9]/) === -1) {
                    r[i] = map[i];
                }
            }
            return r;
        }


        try { //if this T.$ instance is a DocumentFragment rather than an actual HTMLElement
            //errors could occur here with to_case and other routines

            //        document.write(T.dump(T.clone(map)));
            for (i in map) { //go through the computed style object

                ruleMap.forward_iterator( //loop through the ruleMap, checking if a requested rule is found

                    function (x) {

                        if (i === x.to_case("-cm")) { //usually elements in ruleMap come in standard CSS dasherized form,
                            //so we camelize to match that in the computedStyle object
                            r[i] = map[i];
                        }
                        //handle webkit cases where css declarations are stored in the cssText feild
                        if (i === "cssText") {
                            var cssText = T.Iterator(map[i].split(";")); //split out each individual rule and its value

                            cssText.forward_iterator(
                                function (y) { //now this func gets each style rule plus value in the format e.g. 'border-left-color : blue'

                                    if (y) { //i put these here cuz we could be sent undefined i think the last one

                                        if (y.split(":")[0].trim() === x) { //so we parse out the rule name and check if its been requested

                                            r[x.to_case("-cm")] = y.split(":")[1]; //if it is, add it to our return object along side its value

                                        }
                                    }

                                }
                            );
                        }

                    }
                );
            }
        } catch (e) {

        }
        return r;
    };
    /**
     * Returns object with special values specifically useful for node
     *     / /    *    fitting.<pre>
     *     // description:
     *     //        Returns an object with `w`, `h`, `l`, `t` properties:
     *     //    |        l/t/r/b = left/top/right/bottom padding (respectively)
     *     //    |        w = the total of the left and right padding
     *     //    |        h = the total of the top and bottom padding
     *</pre>
     *@function
     *@type Object
     *@name TigerJS.$#get_pad_extents
     */

    this.el.get_pad_extents = function () {
        var s = this.get_style();
        //dojo-lized
        return {
            l: s.paddingLeft,
            r: s.paddingRight,
            t: s.paddingTop,
            b: s.paddingBottom,
            w: parseInt(s.paddingLeft) + parseInt(s.paddingRight) + "px",
            h: parseInt(s.paddingTop) + parseInt(s.paddingBottom) + "px"

        };
    };
    /**
     * Returns object with special values specifically useful for node fitting.<pre>
     *     / / *description:
     *     //        Returns an object with `w`, `h`, `l`, `t`, `r`, `b` properties:
     *     //    |        l/t/r/b = left/top/right/bottom border width's (respectively)
     *     //    |        w = the total of the left and right border
     *     //    |        h = the total of the top and bottom border
     *</pre>
     *@function
     *@name TigerJS.$#get_border_extents
     *@return {Object} Returns object with special values specifically useful for node fitting
     */

    this.el.get_border_extents = function () {
        var s = this.get_style();
        //normalize object felds for cases where some styles are not defined, if a border doesnt have a style
        //then set its width to 0px, computedStyle sometimes set this to some defaults like auto, medium e.t.c.
        //
        //
        s.borderLeftWidth = this.style.borderLeftStyle === "none" || this.style.borderLeftStyle === "" ? "0px" : s.borderLeftWidth;
        s.borderRightWidth = this.style.borderRightStyle === "none" || this.style.borderRightStyle === "" ? "0px" : s.borderRightWidth;
        s.borderTopWidth = this.style.borderTopStyle === "none" || this.style.borderTopStyle === "" ? "0px" : s.borderTopWidth;
        s.borderBottomWidth = this.style.borderBottomStyle === "none" || this.style.borderBottomStyle === "" ? "0px" : s.borderBottomWidth;
        /**
         * @property {CSSLength} l The width of the left border
         */
        return {
            l: s.borderLeftWidth,
            r: s.borderRightWidth,
            t: s.borderTopWidth,
            b: s.borderBottomWidth,
            w: parseInt(s.borderLeftWidth) + parseInt(s.borderRightWidth) + "px",
            h: parseInt(s.borderTopWidth) + parseInt(s.borderBottomWidth) + "px"

        };
    };
    /**
     *        Returns object with properties useful for box fitting with
     *     r eg*ards to padding.<pre>
     *     // description:
     *     //        * l/t/r/b = the sum of left/top/right/bottom padding and left/top/right/bottom border (respectively)
     *     //        * w = the sum of the left and right padding and border
     *     //        * h = the sum of the top and bottom padding and border
     *     </pre>
     *@function
     *@type Object
     *@name TigerJS.$#get_pad_border_extents
     */
    this.el.get_pad_border_extents = function () {
        var pe = this.get_pad_extents(),
            be = this.get_border_extents();
        return {
            l: parseInt(pe.l) + parseInt(be.l) + "px",
            //left boder + left padding
            r: parseInt(pe.r) + parseInt(be.r) + "px",
            //right border + right padding
            t: parseInt(pe.t) + parseInt(be.t) + "px",
            //top border + top padding
            b: parseInt(pe.b) + parseInt(be.b) + "px",
            //bottom border + bottom padding,
            w: parseInt(pe.w) + parseInt(be.w) + "px",
            //sum of left and right paddings and borders
            h: parseInt(pe.h) + parseInt(be.h) + "px" //sum of top and bottom paddings and borders

        };
    };
    /**
     * Returns object with properties useful for box fitting with
     *     r eg*ards to box margins (i.e., the outer-box).<pre>
     *     //
     *     //        * l = marginLeft, t=marginTop,
     *     //        * w = total width,  + marginLeft
     *     //        * h = total height, marginTop </pre>
     *@function
     *@name TigerJS.$#get_margin_extents
     *@type Object
     */
    this.el.get_margin_extents = function () {

        var s = this.get_style();
        //dojo-lized
        return {
            l: s.marginLeft === "auto" ? "0px" : s.marginLeft,
            t: s.marginTop === "auto" ? "0px" : s.marginTop,
            w: !s.width ? (parseInt(s.width) + parseInt(s.marginLeft) + "px") : this.rect()
                .width + "px",
            h: !s.height ? (parseInt(s.height) + parseInt(s.marginTop) + "px") : this.rect()
                .height + "px"

        };
    };
    /**
     * Sets the value(s) for the specified style rule(s).
     * @function
     * @name TigerJS.$#set_style
     * @param {Object} styleMap An object containing style rules to set, style rule names should be
     * camel cased
     * @type TigerJS.$
     *  @example
     * Example
     *         //set different style declaration an element
     *          var ob = T.$('id').set_style({top:"20px",borderRightColor :"#eeffaa", marginTop :"10px"}
     *
     */
    this.el.set_style = function (styleMap) {
        try {
            for (var i in styleMap) {

                this.style[i.to_case("-cm")] = styleMap[i];
            }
        } catch (e) {
        }
        return this;
    };
    /**
     * Sets the opacity of an element
     * @param {Number} val A number betwwen 0 and 1 representing the opacity to set<br/>
     *                       0 means totally transparent and 1 means totally opaque
     * @function
     * @name TigerJS.$#set_opacity
     * @type TigerJS.$
     */
    this.el.set_opacity = function (val) {
        if (this["filters"]) {
            this.style['filter'] = "alpha(opacity=" + val * 100 + ")"; //MIGHTY IE,!!
            // well the DxImageTransform is quite useful
        } else {

            this.style.opacity = val; //ALL OTHER "SANE" BROWTHERS
        }

    };
    /**
     * Get the value of opacity on the Element, returned value is between 0 and 1
     * @function
     * @type Number
     * @name TigerJS.$#get_opacity
     */
    this.el.get_opacity = function () {
        if (this["filters"]) {
            return this["filters"]('alpha')["opacity"] / 100;
        } else {

            //watch for errorneous float values
            return ("%.1f".sprintf(this.get_style()
                .opacity));
        }

    };
    /**
     *
     * Swap the xy position of this node with another node.
     * @param {HTMLElement | String} node The node or (node id )to swap with
     * @function
     * @type TigerJS.$
     * @name TigerJS.$#swap_xy
     */
    this.el.swap_xy = function (node) {
        //get the left and top co-ordinates of each element and swap them
        var xy = this.get_style(),
            o = T.$(node),
            oxy = o.get_style(['left', 'top']);
        o.set_xy([xy.left, xy.top]); //swap
        this.set_xy([oxy.left, oxy.top]);
        return this;
    };
    /**
     * Returns an Object literal containing the following about this element: (top, right, bottom, left),
     * the values are not dependent on page dimensions like {@link #rect}.
     * @function
     * @param {HTMLElement} node
     * @name TigerJS.$#region
     * @return {Object} Object literal containing the following about this element: (top, right, bottom, left)
     */
    this.el.region = function (node) {
        var reg = this.get_style();
        return {
            //firefox calculates values that  are no explicitly set, so we compare with explicit values
            //and where we dont have values we pull in values from rect()
            top: this.style.top ? reg.top : this.rect()
                .top,
            right: this.style.right ? reg.right : this.rect()
                .right,
            bottom: this.style.bottom ? reg.bottom : this.rect()
                .bottom,
            left: this.style.left ? reg.left : this.rect()
                .left
        };
    };
    /**
     * Check if this node is in the passed region
     * @function
     * @type Boolean
     * @name TigerJS.$#in_region
     * @param {Object | HTMLElement | String} region the region object got by calling {@link #region}, or the HTMLElement
     *                                               which we would get its region to compare, or its id
     * @return True if in region, false if not.
     */
    this.el.in_region = function (region) {

        region = T.$(region)
            .region();
        var r = this.region();
        //now that we have the region(s) object we compare
        //this element must be fully enclosed in the passed region

        return (
            r.left >= region.left &&
            r.top >= region.top &&
            r.right <= region.right &&
            r.bottom <= region.bottom
        );

    };

    /**
     * Remove a certain [CSS] class, or a list of CSS classes from the given element.
     *  @function
     *  @name TigerJS.$#remove_class
     *  @type TigerJS.$
     *  @param classNames {string} The list of space seperated CSS classes to remove.
     */
    this.el.remove_class = function (classNames) {

        classNames = classNames.split(" ")
            .join(",");
        this.classList.remove(classNames);
        return this;
    };

    /**
     * Appends a certain [CSS] class, or a list of CSS classes to the given element.
     * @param classNames {string} The list of space seperated CSS classes to append
     * @function
     * @type TigerJS.$
     * @name TigerJS.$#add_class
     */

    this.el.add_class = function (classNames) {

        classNames = classNames.split(" ")
            .join(",");
        this.classList.add(classNames);
        return this;
    };
    /**
     * Checks if the elements has one or All classes specified in the argument
     * @param {string} classNames The list of space seperated CSS classes to match
     * @param {Boolean} single If this is set to true only one class is required to be matched froma list of classes
     *                          in the <b>classNames</b> parameter.
     *                          Pass false to match all classes instead, defaults to true
     * @return [Boolean] true if the element has the class(es) else false
     *  @function
     * @name TigerJS.$#has_class
     *
     */
    this.el.has_class = function (classNames, single) {
        var cls = T.Iterator(this.className.split(" ")), //get the classes currently on the element
            arg = T.Iterator(classNames.split(" ")),
            i; //get the argument

        while (arg.indexOf("")) { //strip out any matched empty string
            arg.unset(arg.indexOf(""));
        }
        if (single === undefined)
            single = true; //default value

        if (single)
            return !!cls.intersect(arg)
                .length; //return true if a single class matches
        return cls.is_subset(arg); //return true if every class matches, so arg should be a subset of cls

    };
    /**
     * Toggles the specified class on the element, removing it if it exists, and adding it if it doesnt
     * @param {string} className CSS class name to toggle
     * @function
     * @name TigerJS.$#toggle_class
     * @type TigerJS.$
     *
     */
    this.el.toggle_class = function (className) {

        this.classList.toggle(className);
        return this;
    };
    /**
     * Replaces a single or a group of CSS classes with another .
     * @param {string} classNames the class(es) to replace seperated by a space.
     * @param {string} withClassNames the class(es) to replace with, seperate each with a space.
     * @function
     * @name TigerJS.$#replace_class
     * @type TigerJS.$
     */
    this.el.replace_class = function (classNames, withClassNames) {

        //this one line incantation calls str_replace on the elements class name
        // since str_replace can work with arrays, we first convert each space seperated string of classes
        // in to arrays so each index in the search array is replaced by the corresponding index in the replace array
        //this method showcases some of the powerful uses of our sring prototype
        this.className = this.className.str_replace(classNames.split(" "), null, withClassNames.split(" "), true);
        return this;
    };
    /**
     * Disable all css classes on the element
     *
     * @function
     *  @name TigerJS.$#class_off
     *  @type TigerJS.$
     */
    this.el.class_off = function () {
        var temp = this.getAttribute('class'); //get the value of the class attribute
        this.setAttribute("l_closed_class", temp); //set a custom attribute with the class content
        this.setAttribute("class", ""); //set the class attribute itself to an empty string
        return this;
    };
    /**
     * Enables all css classes, disabled by {@link #class_off} on the element
     *
     * @function
     *  @name TigerJS.$#class_on
     *  @type TigerJS.$
     */
    this.el.class_on = function () {
        var temp = this.getAttribute('l_closed_class'); //get the value of the custom class attribute
        this.setAttribute("class", temp); //set the class attribute to its original content
        this.removeAttribute("l_closed_class"); //delete the custom class attribute
        return this;
    };
    /**
     * Returns the text content of the Element.
     * @return  The text content of the element .
     * @function
     * @name TigerJS.$#get_text
     * @type String
     */
    this.el.get_text = function () {
        return this.textContent || this.innerText || this.nodeValue || this.text || this.value || "";
    };
    /**
     * Sets the text content of the Element.
     * @param {string}  content The content to add.
     * @function
     * @name TigerJS.$#set_text
     *
     * @type TigerJS.$
     */
    this.el.set_text = function (content) {
        if ('textContent' in this) {
            this.textContent = content;
        } else if ('innerText' in this) {
            this.innerText = content;
        } else if ('nodeValue' in this) {
            this.nodeValue = content;
        }

        if ('value' in this && 'type' in this) { //a seperate condition for form elements
            this.value = content;
        }
        return this;
    };
    /**
     * Sets the HTML content of the HTMLElement. overwriting any previous content.
     * @param {String | DOMNode | HTMLElement | HTMLCollection} content A string containing, valid HTML markup or DOM nodes.
     *            When passing markup content as a string, if sending
     *            html markup it should be written as valid xhtml code, specifically empty tags like <img> should be closed -> <img />
     *            else the function might fail, also if a node or element currently in the document is passed it would be removed
     *            from its current location, then put back as the content of this element
     * @function
     *  @name TigerJS.$#set_html
     *  @type TigerJS.$
     */
    this.el.set_html = function (content) {
        var html = "",
            item, i = 0;
        ;
        //match non empty tags
        if (T.is_string(content)) { //hopefully WE'RE SENT valid (x)html markup
            html = T.create(content); //get the contents as HTMLFragment

        } else if (content.nodeType) { //a single node

            html = content;
        } else if (content.item(0) && content.item(0)
                .nodeType) { //html collection

            html = document.createDocumentFragment();
            while (!!(item = content[i++])) {
                html.appendChild(item); // append to fragment for insertion
            }


        }
        if ('innerHTML' in this) {


            //overwrite its content
            this.innerHTML = "";
            this.appendChild(html); //set content
        }
        return this;
    };
    /**
     * Gets the HTML content of the HTMLElement.
     * @function
     * @type String
     *  @name TigerJS.$#get_html
     *
     */
    this.el.get_html = function () {

        return this.innerHTML;
    };
    /**
     * Sets the width of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @param {Int} size The pixel height to size to
     * @function
     * @type TigerJS.$
     * @name TigerJS.$#set_width
     */
    this.el.set_width = function (size) {

        this.set_size('width', size);
        return this;
    };
    ///GOING YUI!!, expanding open source!!, for the records YUI is a greaaaaat library, as well as dojo and jquery/jquery-ui
    /// each just has stuff i cant cope with like fancy build processes, restricted coding style, and etc etc
    /**
     *
     *
     * Sets the height of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @param {Int} size The pixel height to size to
     * @function
     * @type TigerJS.$
     * @name TigerJS.$#set_height
     */

    this.el.set_height = function (size) {
        this.set_size('height', size);
        return this;
    };
    this.el.set_size = function (prop, val) {
        val = (val > 0) ? val : 0;
        var size = 0;
        this.style[prop] = val + 'px';
        size = (prop === 'height') ? this.offsetHeight : this.offsetWidth;
        if (size > val) {
            val = val - (size - val);
            if (val < 0) {
                val = 0;
            }

            this.style[prop] = val + 'px';
        }
    };
    /**
     * Amount page has been scroll horizontally
     * @return {Number} The current amount the screen is scrolled horizontally.
     * @name TigerJS.$#scrollX
     * @feild
     */
    this.el.scrollX = function(){
        return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    }
    /**
     * Amount page has been scroll vertically
     * @return {Number} The current amount the screen is scrolled vertically.
     * @name TigerJS.$#scrollY
     * @feild
     */
    this.el.scrollY = function(){
            return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }
    /**
     * Gets the current position and dimensions of the bounding box of an element based on page coordinates.
     * and takes scroll offsets into consideration so values are bound to change as you scroll , to
     * get dimensions independent of veiw port coordinates use {@link #region}
     * Margins paddings and scroll offsets are taken into consideration
     * Element must be part of the DOM tree to have page coordinates
     * (display:none or elements not appended return false).
     * @return {Objcet} An object containing the following information about the element <pre>
     * {
     *   top :  //element top position
     *   left : //element left position
     *   bottom : //element bottom position
     *   right :  //element right position
     *   width : //element width
     *   height : //element height
     *   }</pre>
     *   @function
     *   @name TigerJS.$#rect
     */

    this.el.rect = function () {

        //IE 8+ chrome 10+ safri 5+ opera 10+ mozilla 4+
        var rect = T.clone(this.getBoundingClientRect()); //am cloning this to be able to add properties later
        //as IE wont aloow adding properties on the returned object
        if (!rect.width) { //IE dosent return width or height

            rect.width = (rect.right - rect.left) + this.scrollX;
            rect.height = (rect.bottom - rect.top) + this.scrollY;
        }
        return rect;
    };
    /**
     * Adds 'content' to the the HTML content of the HTMLElement.
     * @param {String | DOMNode | HTMLElement | HTMLCollection} content A string containing, valid XHTML markup or DOM nodes.
     *            When passing markup content as a string,
     *            html markup it should be written as valid xhtml code, specifically empty tags like <img> should be closed -> <img />
     *            else the function might fail.
     *            <br/>Also when passing DOM nodes, DOM event handlers are not copied.
     * @param {String} where Where to insert the content, could be any of  <pre>
     * replace ->replaces the content
     * before  ->insert before this node among its siblings, not valid if this element is the Body node
     * after   ->insert after this node, among its siblings, not valid if this element is the Body node
     * first   ->insert as first child of this node or element
     * last    -> append as this elements last child, this is the normal default behaviour if you do not specify the 'where' argument
     * p_first -> insert as first child of this nodes parent
     * p_last  -> insert as Last child of this nodes parent </pre>
     * @function
     *  @name TigerJS.$#add_html
     * @type TigerJS.$
     */

    this.el.add_html = function (content, where) {
        where = T.is_string(where) ? where : "last";
        //get the appriopriate content, as HTMLFragment

        var html = T.is_string(content) ? T.create(content) : content.cloneNode(true);
        switch (where) {

            case 'replace':
                this.set_html(html); //if we're to replace call set_html
                break;
            case 'before': //place before this element
                if (this.tagName.toLowerCase() === "body")
                    return this;
                this.parentNode.insertBefore(html, this);
                break;
            case 'after': //place after this element
                if (this.tagName.toLowerCase() === "body")
                    return this;
                if (this.nextSibling) { // if it has a next sibling insert beore that sibling
                    this.parentNode.insertBefore(html, this.nextSibling);
                } else { //else just append to parent
                    this.parentNode.appendChild(html);
                }
                break;
            case 'first': //place as first child of this element
                if (this.firstChild) { // if node Has a firstChild insert before it
                    this.insertBefore(html, this.firstChild);
                } else { //else just append
                    this.appendChild(html);
                }
                break;
            case 'last': //as last child of this element
                this.appendChild(html);
                break;
            case 'p_first': //insert as first child of parent
                if (this.parentNode.firstChild) { // if node Has a firstChild insert before it
                    this.parentNode.insertBefore(html, this.parentNode.firstChild);
                }

                break;
            case 'p_last':
                this.parentNode.appendChild(html);
                break;
        }
        return this;
    };
    /**
     * Set attrubutes for the Element
     * @param {Object} attrMap An object literal containing name value pair of attributes to set,
     *     duplicate attribute value's are overwritten in order
     * @function
     * @name TigerJS.$#set_attr
     * @type TigerJS.$
     */

    this.el.set_attr = function (attrMap) {
        for (var i in attrMap) {

            if (i === 'style') // CSS style declarations found
            {

                var s = attrMap[i].trim('BOTH').split(/\s*(?::|;)\s*/);
                ////parse out each style rule, this would parse out the
                //rules in such a way that the first index of the array
                //would contain the first css rule name e.g. color
                //the next index would contain the rule value e.g. #ffffff
                //the next index would contain the next rule name, and so on

                for (var j = 0, len = s.length; j < len;) {
                    try {
                        this.style[s[j++].to_case('-cm')] = s[j++]; //iteratively set each individual style rule, camelizing CSS
                        //names where necesarry
                    } catch (e) {
                    }

                }
            } else if (i === 'class') {
                this.className = attrMap[i];
            } else if (i !== ('class' || 'style')) {

                this.setAttribute(i, attrMap[i]);
            }
        }

        return this;
    };
    /**
     * Gets an attributes on the Element
     * @param {string} name The attribute name
     * @return the attributes value or null if it doesnt exist
     * @function
     * @name TigerJS.$#get_attr
     * @type DOMString
     */
    this.el.get_attr = function (name) {

        return this.getAttribute(name);
    };
    /**
     * Set the element to be selectable or not
     * @param {Boolean} canSelect if true the element remnains selectable, pass false to disable selection on the element
     * @function
     * @name TigerJS.$#selectable
     * @type TigerJS.$
     */
    this.el.selectable = function (canSelect) {
        var n;
        ///Hopefully these works for all cases
        ////////////////////////////////////////////////////

        if (!canSelect) {
            this.on("select", disableSelection);
        } else {
            this.off("select", disableSelection);
        }
        ;

        function disableSelection(e) {

            if (this.returnValue) {
                this.returnValue = false;
            }
            if ("getSelection" in window)
                window.getSelection()
                    .removeAllRanges();
            if ("selectionEnd" in this.target)
                this.target.selectionEnd = 0;
            this.preventDefault();
            this.stopPropagation();
            this.stopImmediatePropagation();

        };

        // mozzila based
        if ('MozUserSelect' in this.style) {
            this.style.MozUserSelect = canSelect ? "selectable" : "none";

        }

        //web-kit (khtml) based
        if ('KhtmlUserSelect' in this.style) {
            this.style.KhtmlUserSelect = canSelect ? 'selectable' : "none";

        }
        //web-kit based
        if ('webkitUserSelect' in this.style) {
            this.style.webkitUserSelect = canSelect ? 'selectable' : "none";

        }
        //IE
        if ('msUserSelect' in this.style) {
            this.style.msUserSelect = canSelect ? 'selectable' : "none";

        }


        return this;
    };
    /**
     * Returns the descendants of this Element as an instance of (@link TigerJS.nodes}. In this context, a descendant
     * refers to any element child which is a child node of any direct Child node of this ELement, i.e
     * any grand-child of this element
     * @function
     * @name  TigerJS.$#descendants
     * @type TigerJS.nodes
     */
    this.el.descendants = function () {
        var c = this.childNodes,
            n = [];
        for (var i = 0; i < c.length; i++) {
            if (c[i].nodeType === 1) {

                n = n.concat(T.$(c[i])
                    .element_children()); //get all grand Children,(Elements only)
                //this could be resource intensive, <<<TODO : OPTIMIZE ME
            }
        }
        return T.nodes(n); // return them in an our custom nodeList collection object

    };
    /**
     * Return a clone of this Element of type {@link TigerJS.$}, The cloned Element has no associated
     * parentNode
     * @param {Boolean} [deep = true]  A boolean to indicate whether a deep clone should be performed or not,
     * deep cloning means cloning all child nodes as well.
     * @name TigerJS.$#_clone
     * @function
     * @type TigerJS.$
     */
    this.el._clone = function (deep) {
        deep = deep || true;
        return (T.$(this.cloneNode(deep)));
    };
    /**
     * Destroys a node, removing it from the DOM hierarchy
     * @name TigerJS.$#destroy
     * @function
     * @type TigerJS.$
     * @return The removed child node, which could be later re-inserted later, or $this object if the node could not be emoved
     */
    this.el.destroy = function () {
        this.remove_child_nodes();
        try {
            var r = T.$((this.parentNode.removeChild(this)));
        } catch (e) {

        }
        return r || this;
    };
    /**
     * Togggles the visibility of the Element,if its visible it renders it invisible
     * and vice-versa. Note invisible elements still occupy their positions and space in the
     * document structure
     * @name TigerJS.$#toggle_visibility
     * @function
     * @type TigerJS.$
     */
    this.el.toggle_visibility = function () {

        if (this.style.visibility === "hidden") {
            this.style.visibility = "";
        } else {
            this.style.visibility = "hidden";
        }

    };
    /**
     * Toggles the Elements Enabled/Disabled state
     * @function
     * @type TigerJS.$
     * @name TigerJS.$#toggle_disabled
     */
    this.el.toggle_disabled = function () {

        this.disabled = !this.disabled ;

        return this;
    };
    /**
     * Returns an Object Map of all HTML 5 'data-*' attributes on the Element
     * The data attribute must have been previously created by {@link TigerJS.$#set_data},
     * or manually create as an sttribute using the format.<pre>
     *     data-*=datavalue
     *     e.g A div element
     *     <div data-temperture="23deg"></pre><br/>
     *  The returned object has one method (<b>.namedItem</b>), which would be used to
     *  retrieve an arbitrary data value by name.<br/>
     *  Arbitrary data can also be retrieved using the {@link get_data} method
     *  @example
     *
     *  //some div element
     *   <div style=""  id="mydiv" data-temperture="23deg"></div>
     *   //or set the data by script
     *
     *     var el = T.$("mydiv").set_data("temperature","23deg"),
     *
     *     dataObject = el._dataset(), // fetch the data set object
     *
     *     //get the value for temperature, (this would return null if the
     *     //argument is not found
     *     val = dataObject.namedItem("temperature");
     *
     *
     *  @function
     *  @type Object
     *  @name TigerJS.$#_dataset
     */
    this.el._dataset = function () {
        //get All attributes with a data-* pattern
        var attr = this.attributes,
            set = [];
        for (var i = 0; i < attr.length; i++) {

            if (attr[i].nodeName.indexOf("data-tigerjs-") > -1) { //yep our custom data attribute, HTML 5 specs
                set[set.length] = [attr[i].nodeName, attr[i].nodeValue];
                //  set[set.length][0] = attr[i].nodeName                  // say libraries shoiuld name-space them, so...
            }
        }
        //now that we have all custom data in the multidimensionsl array
        //create the return object interface
        return {
            _set: set, //assign the array to our return object
            namedItem: function (name) { //function to get a named data attribute
                for (var i = 0; i < this._set.length; i++) {
                    if (this._set[i][0] === ("data-tigerjs-" + name)) {
                        return this._set[i][1]; //if the name exists return the value

                    }
                }
                return null; //nothing found
            }
        };
    };
    /**
     * Set arbitrary HTML 5, style data on the Element
     * @param {string} name The data name
     * @param {string} val The data value
     * Data can be later retrieved with {@link #get_data} or the {@link _dataset} object
     * @function
     * @type TigerJS.$
     * @name TigerJS.$#set_data
     * @see TigerJS.$#_dataset
     */

    this.el.set_data = function (name, val) {

        this.setAttribute(("data-" + name), val);
        return this;
    };
    /**
     * Gets arbitrary data on the Element or null
     * @param {string} name The name of the data attribute to get
     * @type String
     * @name TigerJS.$#get_data
     * @function
     */

    this.el.get_data = function (name) {

        if (this.attributes["data-" + name])
            return this.getAttribute(("data-" + name));
        else return this.getAttribute(name);
    };
    /**
     * Returns the outerHTML of the element
     * @function
     * @name TigerJS.$#outer_html
     * @type String
     */
    this.el.outer_html = function () {
        if (this.outerHTML) {
            return this.outerHTML;
        }

        var n = document.createElement("div"),
            r = "";
        //without cloning here succesive calls somehow fails on FF
        n.appendChild(this.cloneNode(true));
        r = n.innerHTML;
        n = null; //free up memory
        return r;
    };
    /**
     * Swap the sibling arrangement for an Element. moving all previousSiblings to a position
     * after the Element and all nextSiblings, before the Element, Its important to note
     * that this method has far-reaching implications on the DOM structure and heirachy
     * and should be used with caution
     * @name TigerJS.$#swap_sibling_positions
     * @function
     * @type TigerJS.$
     */
    this.el.swap_sibling_positions = function () {
        var pre_s = [],
            ne_s = [],
            sib = this,
            me, par; //we shall get All previous and next ELement sibling

        while (!!(sib = sib.previousSibling)) {

            pre_s.push(sib.cloneNode(true)); //previous siblings
        }

        sib = this; //reset
        while (!!(sib = sib.nextSibling)) {

            ne_s.push(sib.cloneNode(true)); //after siblings
        }

        pre_s.reverse(); //we reverse to preserve the (previous) nodes ordering
        //else they would be upside-down

        par = this.parentNode; //Mum
        me = this.parentNode.removeChild(this); //get and remove me from Mum!!

        par.innerHTML = ""; //parent has no child, The lord shall do it for her!!

        //put after nodes first back into parent
        for (var i = 0; i < ne_s.length; i++) {

            par.appendChild(ne_s[i]);
        }
        //then put me in the middle
        par.appendChild(me);
        ///then put nodes which were initially before me last
        for (i = 0; i < pre_s.length; i++) {

            par.appendChild(pre_s[i]);
        }
        par = null, me = null;
        return this;
    };
    /**
     *
     * Modify the arrangement of elementChildNodes. This method accepts three arguments
     * a 'start' point indicating the child node where to start extracting nodes to rearrange
     * and an 'end' point indicating the child node where extractin stops, the third argument
     * 'dest' indicates the destination of the extracted nodes  -currently accepting any of the following<br/>
     *    <font style='color:red'>*</font>This method works only on element Childnodes (nodes with nodeType==1)
     *  @param {Number} start An index in the list of child nodes to stat the moving from
     *  @param {Number} end Index to stop moving nodes
     *  @param {string} dest where to move the nodes (top || bottom), Top or bottom of the child-node list
     *  @function
     *  @type TigerJS.$
     *  @name TigerJS.$#move_element_child_nodes
     *
     */

    this.el.move_element_child_nodes = function (start, end, dest) {

        if (start === 0 && dest === "top")
            return this; // already at top
        if (end === this.childNodes.length - 1 && dest === "bottom")
            return this; //already at bottom

        var cn = T.Iterator(this.elementChildren()),
            n = [];
        for (var i = start; i <= end; i++) { //extract child node range

            n.push(this.removeChild(cn[i]));
        }

        for (i = 0; i < n.length; i++) { //

            if (dest === "top") { //put extracted elements at top
                this.insertBefore(n[i], cn[0]);
            } else { //just append to bottom
                this.appendChild(n[i]);
            }
        }
        cn = null;
        n = null;
        return this;
    };
    /**
     * Reverses  the ChildNodes arrangement of this node
     *@function
     *@name TigerJS.$#reverse_child_nodes
     *@type TigerJS.$
     */
    this.el.reverse_child_nodes = function () {
        var n = T.Iterator(this.childNodes)
            .reverse();
        //get the child nodes and reverse them
        this.remove_child_nodes(); //remove all children

        for (var i = 0; i < n.length; i++) { //put back the reversed nodes

            this.appendChild(n[i]);
        }

        return this;
    };
    /**
     *  Copies attributes from this Element to another. This method copies all name/value pairs of attributes
     *  from this element to the target element overwriting any existing attribute on the target, thie id attribute
     *  is however not copied
     *  @param {HTMLELement | String} target The element (or its id) to recieve the attributes
     *  @name TigerJS.$#copy_attributes
     *  @function
     *  @type TigerJS.$
     */

    this.el.copy_attributes = function (target) {
        target = T.is_string(target) ? T.$(target) : target;
        try { //errors accesing non-existent attributes
            var this_atr = this.attributes,
                target_atr = target.attributes,
                s;
            for (var i = 0; i < target_atr.length; i++) { //unset all attributes on the target except its id

                if (target_atr[i].nodeName !== "id") {

                    target.removeAttribute(target_atr[i].nodeName);
                }

            }
            //then set the imported attributes
            for (i = 0; i < this_atr.length; i++) { //unset all attributes on the target except its id

                if (this_atr[i].nodeName !== "id") {

                    target.setAttribute(this_atr[i].nodeName, this_atr[i].nodeValue);
                }
            }

        } catch (e) {

            //squash!!
        }
        return this;
    };
    /**
     *  Swap attributes from this Element with attributes on another Element .This method swaps all name/value pairs of attributes
     *  on both elements , thie id attribute is however not swapped
     *  @param {HTMLELement | String} target The element (or its id) to swap attributes with
     *  @name TigerJS.$#swap_attributes
     *  @function
     *  @type TigerJS.$
     */
    this.el.swap_attributes = function (target) {
        target = T.is_string(target) ? T.$(target) : target;
        try {
            //errors accesing non-existent attributes

            var this_atr = this.attributes,
                target_atr = target.attributes,
                s = window.attachEvent && !window.addEventListener ?
                    this.getAttribute("style")
                        .cssText : this.getAttribute("style"), //get a copy of the style text or cssText for IE
                s2 = window.attachEvent && !window.addEventListener ?
                    target.getAttribute("style")
                        .cssText : target.getAttribute("style"); //get a copy of the style text or cssText for IE

            //Browsers doesnt expose the inline Style attribute in its attribute collection, so we gat to do these manually
            if (window.attachEvent && !window.addEventListener && s && s2) {

                target.style['cssText'] = s; //the css text represent whatever is set in the in-line style attribute

                this.style['cssText'] = s2;
            }

            //then set the imported attributes on the this
            for (var i = 0; i < target_atr.length; i++) {

                if (target_atr[i].nodeName !== "id" && target_atr[i].nodeValue) {
                    this.setAttribute(target_atr[i].nodeName, target_atr[i].nodeValue);
                }
            }
            //then set the "this" attributes on the target
            for (i = 0; i < this_atr.length; i++) { //am not using var i here, as the previous one is still in scope
                // this is a major diff with c++

                if (this_atr[i].nodeName !== "id" && this_atr[i].nodeValue) {
                    target.setAttribute(this_atr[i].nodeName, this_atr[i].nodeValue);
                }
            }
            ///set the style seperately for other browsers other than IE
            //no need to detect browser here as it doesnt affect IE
            target.setAttribute("style", s);
            this.setAttribute("style", s2);
        } catch (e) {


        }

        return this;
    };
    /**
     * Removes a certain  attribute on the element
     *  @name TigerJS.$#remove_attr
     *  @function
     *  @type TigerJS.$
     *  @param {String} name Attribute name to remove
     */
    this.el.remove_attr = function (name) {
        if (name === "style") {
            if (window.attachEvent && !window.addEventListener) {

                this.style['cssText'] = ""; //for removing style in IE
            } else {
                this.removeAttribute("style");
            }
        } else { //other attrs, not style
            this.removeAttribute(name);
        }
        return this;
    };
    /**
     * Removes all attributes on the element
     *  @name TigerJS.$#_remove_attributes
     *  @function
     *  @type TigerJS.$
     */
    this.el._remove_attributes = function () {
        var this_atr = this.attributes;
        try { //errors happen here when we have no attribute to remove

            //Browsers doesnt expose the inline Style attribute in its
            //attribute collection, so we gat to do these manually
            if (window.attachEvent && !window.addEventListener) {

                this.style['cssText'] = "";
            }

            //unset all attributes on the this
            for (var i = 0; i < this_atr.length; i++) {

                this.removeAttribute(this_atr[i].nodeName);
            }
            ///set the style seperately for other browsers other than IE
            //no need to detect browser here as it doesnt affect IE
            this.removeAttribute("style");
        } catch (e) {


        }
        return this;
    };
    /**
     * Replaces this Element with the passed node or HTML data
     * @param {String | HTMLElement} content  Valid XHTML markup string  or an Element reference to use
     *                              as replacement data
     * @name TigerJS.$#replace_node
     * @function
     * @type TigerJS.$
     * @return returns the removed ELement
     */
    this.el.replace_node = function (content) {

        if (content && T.is_string(content)) {
            content = T.create(content);
        }
        this.parentNode.replaceChild(content, this);
        return this;
    };
    /**
     * Wraps an element inside another, then returns the wrapper. This method will wrap in place
     * that is the Elements position is not alteredâ its position will remain the same.
     * @example
     *   var el = T.$("id").wrap("div"); //wrap whatever element that has the ID value inside the DIV
     *  @name TigerJS.$#wrap_node
     *  @function
     *  @type TigerJS.$
     *  @param {HTMLElement | String} wrapper HTMLElement or an HTML tag-name to be used as the wrapper element
     *  @returns Returns the wrapper Element as an instance of {@link TigerJS.$}
     */
    this.el.wrap_node = function (wrapper) {
        if (wrapper && T.is_string(wrapper)) {

            wrapper = document.createElement(wrapper);
        }
        //get the node to be wrapped, wrap and insert
        var node = this.cloneNode(true);
        wrapper.appendChild(node);
        this.parentNode.replaceChild(wrapper, this);
        return T.$(wrapper);
    };
    /**
     * Sends each Element ChildNode of this Element, to the callback function
     * @param {Function} cb  Callback function to accept each eLementChildNode
     * @function
     * @name TigerJS.$#each_child
     * @type TigerJS.$
     */
    this.el.each_child = function (cb) {
        T.nodes({
            childNodes: this
        })
            ._each(cb);
        return this;
    };
    /**
     * Sends each Element sibling of this Element, to the callback function
     * @param {Function} cb  Callback function to accept each eLement-sibling
     * @function
     * @name TigerJS.$#each_sibling
     * @type TigerJS.$
     */
    this.el.each_sibling = function (cb) {
        T.nodes({
            siblings: this
        })
            ._each(cb);
        return this;
    };
    /**
     * This method is the hub of Event handling for the TigerJS Library
     * it aloows you seamlessly attach multiple event listeners
     * for standard and custom event types, to an element.
     * <pre>
     * ::BASIC USAGE
     *                    T.$("#id").on("keypress keydown", myfunc); //i.e attaching two events for the same handler
     *    when a keypress event if fired, myfunc recieves an event object with the following properties
     *  note some properties are set depending on the type of event
     *
     *     t ar*get : the Event target
     *
     *     timeStamp : the event timestamp
     *
     *     type : the event type, without any 'on' i.e onclick would be represented as click
     *
     *     clientX :The horizontal coordinate at which the event occurred relative to the viewport associated with the event
     *
     *     clientY : The vertical coordinate at which the event occurred relative to the viewport associated with the event
     *
     *     screenX : The horizontal coordinate at which the event occurred relative to the origin of the screen coordinate system
     *
     *     screenY : The vertical coordinate at which the event occurred relative to the origin of the screen coordinate system
     *
     *     cancelBubble : Boolean indicating if bubbling was cancelled
     *
     *     defaultPrevented : a boolean indicating if the default action was prevented
     *
     *         metaKey : if the meta-key modifier was pressed
     *
     *         shiftKey : if the shift modifier was pressed
     *
     *         altKey : if the Alt-key modifier was pressed
     *
     *         ctrlKey : if the Control Key modifier was pressed
     *
     *         key: This represent key or character value of the key that fired the event
     *
     *         char : This represents the character value of the Key that fired the event
     *
     *         relatedTarget: A related target for mouseenter/mpuseleave events
     *
     *         For Key Events the key and char property might contain similar of different values
     *         fot upper/lower case characters [a-zA-Z] and numeric digits [0-9]
     *         the 'key' and "char" properties are the same
     *         this is also true for the following punctiations and symbols
     *         "`","'", ~, !, @, #, $, %, ^, &, *, (, ), _, ;, :, ",  [, ], {, },
     *         ?, |, \, the period and the comma
     *
     *         However the following control and modifier keys have no "char" value,
     *         The key values are as follows
     *         Tab, Shift, Alt, Control, BackSpace, Enter, Insert,  PageUp, PageDown, Home,CapsLock,
     *         End    and for the arrow keys - Left, Top, Right, Down, F1 - F15
     *
     *         The following control and modifier keys have the following key and char values
     *         __________________________________________________________
     *         KEY             |       KEYVALUE       |       CHAR VALUE
     *         Delete/Del        Delete            \u007F
     *         Tab Key        Tab            \u0009
     *         Escape key        Escape            \u001B
     *         Space-Bar        SpaceBar        \u0020
     *
     *
     *         key-press event should be used strictly when listening for alphanumericals,
     *         punctuations and number characters
     *         all othe key detection should be done using the key-down event,
     *         e.g
     *         if(event.char === "A"){
     }
     or
     if(event.char === "/"){ The unicode code-points map directly to their characters
     ///...
     
     }


     Control and  modifier keys should however be compared using the 'key' property
     e.g
     if(event.key === "F12"){
     //do stuff
     }
     if(event.key === 'SpaceBar"){
     //do stuff
     }



     For safe cross-browser compatibility, the following list are the recommended events
     to listen for , while many more exists and are constantly been added, their support
     cant be guaranteed

     SAFE CROSS BROWSER EVENTS
     -mouseover
     -mouseout
     -mouseenter
     -mouseleave
     -mouseup
     -mousedown
     -click (this also listents for touchend)
     -dblclick
     -keydown
     -keypress
     -keyup
     -submit
     -reset
     -focus
     -blur
     -change
     -scroll
     -select
     -resize
     -load
     -unload
     -abort
     -touchstart
     -touchmove
     -touchend
     -touchcancel

     animationstart, webkitAnimationStart, mozAnimationStart, MSAnimationStart

     animationend, webkitAnimationEnd, mozAnimationEnd, MSAnimationEnd

     animationiteration, webkitAnimationIteration, mozAnimationIteration, MSAnimationIteration

     transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd
     </pre>

     * @param {String} eventName The event name to register. <br/>
     This would take any standard or custom name, miltiple events can be regsitered by seperating with a space
     * @param {Function} listener The user function to call when the event occurs

     * @param {Boolean} [bubble_action = TRUE ] Boolean indicating if bubbling is allowed,

     * @param {Boolean} [once = FALSE] Boolean indicating if the listener should be triggered only once
     Defaults to false
     * @param {Array} extra_arg An array containing extra arguments to be passed to the listener
     * @function
     * @name TigerJS.$#on
     * @type TigerJS.$
     */
    this.el.on = function (eventName, listener, bubble_action, once, extra_arg) {

        var man = new T.EventManager();
        man.init(this, eventName, listener, bubble_action, once, extra_arg);
        return this;
    };
    /**
     * Fires any arbitrary event at this element ( as target),
     * If firing a custom (i.e. Not standard or supported event)
     * The event-target recieves a simple event object with the folowing feilds
     * type - indicating the event type <br/> target - the event - target element <br/>
     * and timeStamp - contaning the timestamp of the event
     * @param {String} eventName The name of the event to be fired
     * @function
     * @name TigerJS.$#fire
     * @type TigerJS.$
     */
    this.el.fire = function (eventName, /** internal use only **/ alterNateTarget) {
        var o = this,
            type = eventName,
            evt;
        if (type in this || "on" + type in this) { //if its a valid event name
            // dispatch for standard events first
            if (document.createEvent) {
                evt = document.createEvent("HTMLEvents");
                evt.initEvent(type, true, true);
                o.dispatchEvent(evt);
                return this;
            }

            // dispatch for IE
            else {
                evt = document.createEventObject();
                o.fireEvent("on" + type, evt);
                return this;
            }

        } else { //if its a custom event name


            //loop through the cache of handlers saved for this event and call them
            if (this[("event_cache_" + eventName)]) {

                this[("event_cache_" + eventName)].forward_iterator(
                    function (x) {
                        var ev_Obj = { //create simple event object
                            type: eventName,
                            target: alterNateTarget || o,
                            //if an alternate target was sent else this object
                            timeStamp: new Date()
                                .getTime()

                        };
                        x.apply(ev_Obj); //call each registered handler in turn
                    }
                );
            }
        }
        return this;
    };
    /**
     * Unregisters a listener registered with {@link #on}
     * This works like the standard removeEventListener or IE's detachEvent
     * @param {String} _event Space delimited list of events that is associated with the function you want to unregister
     * @param {Function} _listener Function that was registered as a handler for the event(s)
     * @function
     * @name TigerJS.$#off
     * @type TigerJS.$
     */



    this.el.off = function (_event, _listener) {
        var e = _event.replace("on", "");
        e = e.explode(" ");

        this.EvHandlers.unset(this.EvHandlers.indexOf(_listener)); //just remove the listener 
        //irrespective of the number of events registered for this listener

        try {
            for (var i = 0; i < e.length; i++) {
                if (this[("event_cache_" + e[i])]) { //for non-standard event, bcuz they are stored in a seperate cache

                    this[("event_cache_" + e[i])].unset(this[("event_cache_" + e[i])].indexOf(_listener));
                }
            }
        } catch (e) {
            //wrong or no listener
        }
        return this;
    };
    /**
     * This method exceptionally simplifies key detection, it can be used in cases when you want
     * to detect single or multiple key presses with modifiers etc
     *  @example e.g
     *  Supposing you have an input element with id -inp-
     *
     *   //set up the dom
     *   var el  = T.$("id_of_element");
     *   //set up some events
     *
     *   el.on_key("Ctrl Alt f7", handler);
     *   //the above would listen for f7 key in combination with the control and alternate key
     *   // note f7 could be given as F7 while control could be written as Control or ctrlKey,.. all three works
     *
     *   //some more examples
     *   el.on_key("%", handler);
     *   //this would listen for the percentage key
     *   //however note , that you could also have done
     *
     *   el.on_key("Shift %", handler);
     *    // this is beacuse you'll usually use the shift to
     *   get your percentage key anyway, but for all shifted characters
     *   <br/>
     *        However when detecting uppercase keys like A, the shift is not implied
     *        so if a user presses "Shift A", no event gets fired except the shift
     *        key is explicitly listed, this is to avoid instances when  the Caps-Lock
     *        could be on, which would naturally "upperCase" all characters, so to detect
     *        upper-case characters without the shift key, caps-lock must be on
     * @param {String} key_map This is a string containg a valid combination of
     *                  keys to detect, and could contain one or more of the following
     *
     *                  <pre>
     *                       A-Z
     *                       a-z
     *                       0-9
     *                       punctuation characters
     *                       f1-fn or F1-Fn ( n isnt defined for now)
     *                       Ctrl or Meta or Control or ctrlKey
     *                       Shift
     *                       Alt
     *                       SpaceBar
     *                       Delete
     *                       Up
     *                       Down
     *                       Left
     *                       Right
     *                       ArrowDown   //Firefox Specific
     *                       ArrowUp     //Firefox Specific
     *                       ArrowLeft    //Firefox Specific
     *                       ArrowRight   //Firefox Specific
     *                       PageUp
     *                       PageDown
     *                       Home
     *                       End
     *                       BackSpace
     *                       Tab
     *                       Enter
     *                       Insert
     *                       Delete
     *                       CapsLock
     *                       Escape
     *
     * [*Note That the Arrow-x keys are what newer versions of firefox use instead of just up/down/left/..., or so u think)
     *                       </pre>
     * @param {Function} handler Yor call back to handle the event, its called with a standard
     *                     keydown, or keypress event object
     *  @function
     *  @type TigerJS.$
     *  @name TigerJS.$#on_key
     */
    this.el.on_key = function (key_map, handler) {

        var w, et; //some helper variables
        var mod_arr = T.Iterator();
        var onPress = function () { //internal callback

            var eventObject = this;
            var internal_a = T.Iterator(mod_arr)
                    .unique(), //we'll need this in here
                internal_b = T.Iterator(),
                eventType = et,
                assert = true;
            //get all the modifiers depressed in this event
            if (eventObject.shiftKey)
                internal_b.add("Shift");
            if (eventObject.ctrlKey)
                internal_b.add("Control");
            if (eventObject.altKey)
                internal_b.add("Alt");
            internal_b.add(eventObject.key); //then the key depressee

            if (eventObject.type === eventType) { //make sure its the event we're registered for


                //the detected set of keys should contain all the keys that have been stored
                //both internal and external event-property list should be equal
                if (internal_b.length === internal_a.length) {

                    for (var i = 0; i < internal_b.length; i++) {

                        if (!internal_b.contains(internal_a[i])) {
                            assert = false; //if we detect stray/bad keys then no event
                        }

                    }
                    //call user event handler
                    if (assert)
                        handler(eventObject);
                }
            }

        };
        //fist see if wer're to deect modifier keys
        if (/\bControl|Ctrl|Meta|ctrlKey\b/.test(key_map)) {
            mod_arr.add("Control");
        }
        if (/\bAlt\b/.test(key_map)) {
            mod_arr.add("Alt");
        }
        if (/\bShift\b/.test(key_map)) {
            mod_arr.add("Shift");
        }


        //check pageUp/Down Direction Keys Function keys
        //and also Home End Caps tab Insert Delete e.tc
        if (!!(w = /\b(PageUp|PageDown)\b/.exec(key_map)) || !!(w = /\b(Left|Up|Down|Right|Home|End|Insert|Delete|Enter|BackSpace|CapsLock|Tab|Escape|SpaceBar)\b/.exec(key_map)) ||
            //ok, only seen this in Firefox for now,...
            !!(w = /\b(ArrowLeft|ArrowUp|ArrowDown|ArrowRight)\b/.exec(key_map))
        ) {

            mod_arr.add(w[0]);
            this.on("keydown", onPress);
            et = "keydown";
            //we must return after setting the event to avoid
            //serious bugs!!
            return this;
        }

        //....Function keys
        if (!!(w = /\b(f|F)\d{1,2}\b/.exec(key_map))) {

            mod_arr.add(w[0].toUpperCase()); //save as upper ie Fx e.g. F22, not f22
            this.on("keydown", onPress);
            et = "keydown";
            return this;
        }

        //now check for shifted punctuation chars [,!@#$...
        if (!!(w = /[\~\!\@\#\$\%\^\&\*\(\)\_\+\{\}\;\"\<\>\?\\\"\|]/.exec(key_map))) {
            mod_arr.add(w[0]);
            this.on("keypress", onPress);
            et = "keypress";
            if (!mod_arr.contains("Shift")) {
                //yeah we implicitly add shift to what is to be detected, cuz all these characters
                // need to be shifted, anyway!!
                mod_arr.add("Shift");
            }
        }
        //now check for Unshifted punctuation chars [,!@#$...
        if (!!(w = /[\`\[\]\`\,\.\/\;\']/.exec(key_map))) {
            mod_arr.add(w[0]);
            this.on("keypress", onPress);
            et = "keypress";
            return this;
        }


        //single nums/letters
        if (!!(w = /\b\w{1}\b/i.exec(key_map))) {

            mod_arr.add(w[0]);
            this.on("keypress", onPress);
            et = "keypress";
            return this;
        }
        return this;
    };
    /**
     * Checks if this element is the first-child of its parent
     *  @name TigerJS.$#in_first
     *  @function
     *  @type Boolean
     */

    this.el.in_first = function () {

        return T.$(this.parentNode)
            .first_element_child() === this;
    };
    /**
     * Checks if this element is the last-child of its parent
     *  @name TigerJS.$#in_last
     *  @function
     *  @type Boolean
     */

    this.el.in_last = function () {
        return T.$(this.parentNode)
            .last_element_child() === this;
    };

    /**
     * Checks if the argument is a child node of this Element
     *  @name TigerJS.$#in_child
     *  @param {String | HTMLElement} node An element reference or ID
     *  @function
     *  @type Boolean
     */

    this.el.in_child = function (node) {
        return T.Iterator(this.children)
            .contains(T.$(node));
    };

    /**
     * Checks if this element is a child-of the argument node
     *  @name TigerJS.$#in_child_of
     *  @param {String | HTMLElement} node An element reference or ID
     *  @function
     *  @type Boolean
     */

    this.el.in_child_of = function (node) {
        return T.Iterator(node.children)
            .contains(this);
    };

    /**
     * On mouse-wheel handler
     * @param {function} callback callback to be called when the mouse is wheeled, it is called with 1 when
     * the mouse is wheeled down and -1 when wheeled up, it also recieves the event object as a second argument
     * @function
     * @type TigerJS.$
     *  @name TigerJS.$#on_wheel
     *
     */
    this.el.on_wheel = function (callback) {
        this.on("wheel", function () {
            if (this.deltaY && this.deltaY < 0) {
                if (callback)
                    callback(-1, this);
            } else if (callback)
                callback(1, this);

        });
        return this;
    };

    /*
     * @ignore
     */
    this.el.__to_string = function () {
        try {
            return "[object TigerJS.$]/" + "HTML" + (this.tagName)
                .to_case('-ufl') + "Element";
        } catch (e) {
            return "[object TigerJS.$]/DocumentFragment]";
        }
    };
    return this.el;
};