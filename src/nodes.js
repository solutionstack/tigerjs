/* global TigerJS, T */

/**
 * @class
 
 
 * @description Returns an Object for manipulating  a collection of HTMLElements.  This object resembles a DOMNodeList
 * but only contains HTMLElements are contained and not text-nodes etc
 * 
 * @param {Object | Array} config If <b>config</b> is an Array it shouuld contain valid references to HTMLElements, that you
 * wish to make up the elements of the node-list. And if you pass an object it should have a feild matching any ONE of the
 * following
 * <pre>
 *   childNodes
 *   siblings
 *   previousSiblings
 *   nextSiblings
 *   </pre> Any of the above feilds could be references to HTMLElement(s) or an Element id, The <b>config</b> parameter could also
 *   contain ONE or MORE of the foloiwing feilds.
 *   <pre>
 *
 *   tagName
 *   attributes
 *   class </pre>
 *
 *
 *   Therefore a typical config (configuration) object could be created as thus
 *   <pre>
 *     {
 *       childNodes : HTMLElement | id           //OR
 *       siblings : HTMLElement | id             //OR
 *       previousSiblings : HTMLElement | id     //OR
 *       nextSiblings : HTMLElement | id
 *       tagName : "tagName1 tagName2 tagNameX"
 *       attributes : " attrName1=attrVal attrName2=attrVal  attrNameX=attrValX"
 *       _class : "class1 class2 classX"
 *     }
 *
 *     And the evaluation would be done as follows
 *
 *   1- If the config Object parameter has either the childNodes feild, or the siblings feild or any of the Xsiblings feilds
 *     Get the corresponding child-nodes, or siblings of this Element and store them as the Elements of this collection.
 *
 *   2- If the config Object parameter has tagName as one of it feilds, filter out the stored Elements, leaving only those
 *      with tag-names matching any of the space delimited names, as specified in the tagName feild.
 *
 *   3- If the config Object parameter has attributes as one of its feilds, further filter the stored elements to those with
 *       attributes matching any of the name/value pair of attributes as specified in the attribute parameter
 *
 *   4- If the config Object parameter has _class as on of its feilds, further filter the srtored elements to those having
 *       one or more of the CSS classes as specified in the _class parameter.
 *
 *        *In all feilds were HTMLElements are required, the ID of the element can be passed instead of a reference
 *        <br/><br/>
 *   Each Node in a {@link TigerJS.nodes} object is actually an instance of {@link TigerJS.$}, so you can run the normal DOM
 *   methods on them, All methods of this class should be chainable except for those
 *   that return boolean or a new nodelist object or a single element</pre>
 *   @param {Boolean} [strictMatch = false] if this flag is set, and we have an Element set as the search axis
 *   then the element must have valid ChildNodes or silings/xSibling in the DOM if not we return false
 */

TigerJS.nodes = function(config, strictMatch) {
    return new(function(config_, strictMatch_) {
            if (!strictMatch_)
                strictMatch_ = false;

            var pred = config_; //ok it was initally pred, but now config
            /***** VERY IMPORTANT DONT EDIT BELOW THIS LINE ****/
            var _n = [],
                _temp = null,
                _temp1 = null,
                childNodes = [],
                childNodes2 = TigerJS.Iterator(),
                sib = null,
                i, j, k;
            //check if we're been sent an array of nodes, to make life easier
            if (T.is_array(pred)) {

                childNodes = TigerJS.Iterator()
                    .concat(pred);
                pred = null; //am nullifying these so the algorithms below can be skipped

            }
            if (pred && pred.childNodes) { //1st check for Child nodes of some element, if requested

                childNodes = []; // empty

                sib = T.$(pred['childNodes'])
                    .firstChild; //we are wrapping the index in T.$ in case it came in as a string ID

                while ((sib)) {
                    if (sib.tagName) {

                        childNodes.push(sib);
                    }
                    sib = sib.nextSibling;
                }
            }

            if (pred && pred.siblings) { //2nd check for sibblings nodes of some element
                childNodes = []; // empty'

                sib = T.$(pred['siblings']);
                while (!!(sib = sib.previousSibling)) {
                    if (sib.tagName) {
                        childNodes.unshift(sib);
                    }
                }
                sib = T.$(pred['siblings']);
                while (!!(sib = sib.nextSibling)) {
                    if (sib.tagName) {
                        childNodes.push(sib);
                    }
                }

            }


            if (pred && pred.prevSiblings && !pred.siblings) { //skip if siblings have already been processed
                //3rd check for previous  siblings nodes of some element
                childNodes = []; // empty
                sib = T.$(pred['prevSiblings']);
                while (!!(sib = sib.previousSibling)) {
                    if (sib.tagName) {
                        childNodes.push(sib);
                    }
                }
            }

            if (pred && pred.nextSiblings && !pred.siblings) { //4th check for next siblings nodes of some element
                childNodes = []; // empty
                sib = T.$(pred['nextSiblings']);
                while (!!(sib = sib.nextSibling)) {
                    if (sib.tagName) {
                        childNodes.push(sib);
                    }

                }
            }

            ///up to here if we have no nodes it means no valid element was sent so use the body as our axis
            //execpt we have strictMatch set, then we simply return


            if (!childNodes.length && strictMatch_) {
                //we are told to be strict so the above should have produced some nodes
                return false;

            } else if (!childNodes.length) { //we are empty but no strict match, get all Element nodes on the body


                childNodes = T.Iterator(document.querySelectorAll("*")); //TODO performance hit here
            }

            if (pred && pred.tagName) { //filter-out whatever nodes we have by tagname
                //this is very cool as we can match diffrerent multiple tags
                _temp1 = T.Iterator(pred['tagName'].split(" ")); //split the tagnames by space

                for (i = 0; i < childNodes.length; i++) {

                    if (childNodes[i].tagName) {
                        if (_temp1.contains(childNodes[i].tagName.toLowerCase())) {

                            childNodes2.push(childNodes[i]);
                        }
                    }
                }
                childNodes = [].concat(childNodes2); //swap to those that matched tagName
                childNodes2.empty();
                _temp1 = null;
            }


            //next match attributes
            if (pred && pred['attributes']) {
                _temp1 = pred['attributes'].split(" "); //split the attributes by space

                for (i = 0; i < childNodes.length; i++) {

                    if (childNodes[i].tagName) {
                        for (j = 0; j < _temp1.length; j++) {

                            //check if each element has an attribute and if the attribute values match
                            if (childNodes[i].attributes.length) { //we could have used hasAttribute here
                                //but for great IE

                                if (childNodes[i].getAttribute(_temp1[j].split("=")[0]) &&
                                    childNodes[i].getAttribute(_temp1[j].split("=")[0]) === _temp1[j].split("=")[1]) {

                                    childNodes2.push(childNodes[i]);
                                }
                            }
                        }
                    }
                }

                childNodes = [].concat(childNodes2); //swap to thos that matched attributes
                childNodes2.empty();
            }

            //lastly filter by class
            try {

                if (pred && pred['_class']) {

                    var cls = pred['_class'].trim()
                        .split(" "),
                        arg; //get the classes currently in the list

                    for (i = 0; i < childNodes.length; i++) {

                        if (childNodes[i].className && childNodes[i].attributes && childNodes[i].attributes.getNamedItem("class")) {

                            arg = T.Iterator(childNodes[i].attributes.getNamedItem("class")
                                .nodeValue.trim()
                                .split(" ")); //get the classes on each element
                            //culd also use element.className in the above, guess am just flexin ma DOM muscle

                            if (arg.intersect(cls)
                                .length) { //if the two class array intersects, that is if the have a matching CSS class-name

                                childNodes2.push(childNodes[i]);
                            }

                        }
                    }
                    childNodes = [].concat(childNodes2); //swap to those that matched class
                    childNodes2.empty();
                }
                sib = null;
                _temp = null;
                _temp1 = null;

            } catch (e) {


            }
            //make each element of this nodeList an instance of TigerJS.$
            //we need to find a way of optimizing this
            //
            this.n = childNodes; //from here, this holds our nodes



            for (i = 0; i < this.n.length; i++) {
                this.n[i] = T.$(this.n[i]); //tigerfy
            }
            this.n = T.Iterator(this.n); //convert to an iterator filled up with nodes



            /**
             * Add the specified classes, to the elements of this list
             * @param {String} classlist A space seperated list of CSS classes to add to every element
             * @param {String | Function } [filter] A function to filter out which elements get
             *                                       new classes added, or the string even | odd
             *                                       to select element at even or odd indexes.
             * @function
             *
             *  @type TigerJS.nodes
             *  @name TigerJS.nodes#add_class
             *
             *
             */

            this.n._add_class = function(classlist, filter) {
                if (!this.length) {
                    return this;
                }
                if (!filter) { // just add to all
                    this.foward_iterator(function(x) {

                        x.add_class(classlist);
                    });
                } else {
                    if (filter === "even") { //set even nodes
                        this.foward_iterator(function(x) {

                            x.add_class(classlist);
                        }, 2); // jump by 2

                    } else
                    if (filter === "odd") { // set odd nodes
                        var re = this.odd()
                            .foward_iterator(function(x) {

                                x.add_class(classlist);
                            });
                        this.empty()
                            .concat(re); // the odd function returns a new iterator so reset -this- 
                    } else {
                        for (i = 0; i < this.length; i++) {

                            this.foward_iterator(function(x) {
                                if (filter(x)) {
                                    x.add_class(classlist);
                                }
                            });

                        }

                    }

                }
                return this;
            };

            /**
             * Insert Elements, using elements in the list as an axle.
             * Mote - the new content is added to the DOM and not the list
             * @param {NodeList | T.nodes | HTMLElement | String} content
             * a valid array of nodes an html element or HTML string
             * @param {String} position Where to insert the new content
             *        either<br/>
             *        before - content is inserted before each element in the list
             *          <br/>
             *          after - content is inserted after each element in the list
             *        <br/>
             *        append - content is added to each element as a child
             *        <br/>
             *        prepend - content is added to each element as its first child
             * @function
             *   @type TigerJS.nodes
             
             *
             *  @name TigerJS.nodes#_insert
             */

            this.n._insert = function(content, position) {
                if (!this.length) {
                    return this;
                }
                if (!content)
                    return this;
                switch (position) {

                    case 'before':
                        this.foward_iterator(function(x) {

                            x.add_html(content, "before");
                        });
                        break;
                    case 'after':
                        this.foward_iterator(function(x) {

                            x.add_html(content, "after");
                        });
                        break;
                    case 'append':
                        this.foward_iterator(function(x) {

                            x.add_html(content, "last");
                        });
                        break;
                    case 'prepend':
                        this.foward_iterator(function(x) {

                            x.add_html(content, "first");
                        });
                        break;
                }
                return this;
            };

            /**
             * Destroys all nodes in the list, removing  them from the document tree
             * @function
             *
             *  @type TigerJS.nodes
             *  @name TigerJS.nodes#_destroy
             */

            this.n._destroy = function() {
                if (this.length) {
                    this.foward_iterator(function(x) {
                        try {
                            x.destroy(); //kill the returned node reference,
                            //yeeeaaah!!, memory management, right!!:)
                        } catch (e) {}
                    });
                }
                return this;
            };
            /**
             *Allows for setting or getting of atributes, if getting attribute value
             *is returned only from the first node,<br/>
             *<p/>
             *Note : Most browsers dont allow setting attributes with custom names
             *@param {String} name Name of attribute to set
             *@param {String} [value] value of attribute to set, if ommited we perform
             *a getAttribute operation, on the first element
             @function
             *
             
             *  @name TigerJS.nodes#_attr
             *@type String | null
             */
            this.n._attr = function(name, value) {
                var r = null;
                if (value) {
                    this.foward_iterator(function(x) {

                        x.set_attr({
                            name: value
                        });
                    });
                } else {
                    r = this[0].get_attr(name);
                }
                return r;
            };

            /**
             *  Calls a function for each node in the list, with an optional execution context
             *  @param {Function} func The function to call on each node
             *  @param {Object} context Optional execution context
             *  @function
             *
             *  @type TigerJS.nodes
             *  @name TigerJS.nodes#_each
             *
             */
            this.n._each = function(func, context) {
                if (this.length) {
                    this.foward_iterator(function(x) {
                        func.call(context ? context : window, x);
                    });
                    return this;
                }
            };

            /**
             * Returns an array containing the value of the requested style
             * property for each node.
             * Use CSS dasherized format
             * for multi-word properties.
             
             * @example
             *  nodes.('background-color');
             *  @param {String} attr The style attribute to retrieve
             *  @function
             *  @name TigerJS.nodes#_style
             * @type Array
             */
            this.n._style = function(attr) {
                var r = T.Iterator(),
                    i;
                for (i = 0; i < this.size(); i++) {
                    //this would add only the values from the returned object
                    r.add_all(this[i].get_style([attr]));
                }
                return r.to_array();
            };
            /**
             * Gets / sets HTML content Either gets content of the first element,
             * or sets the content for all elements in the list
             *
             * @param {String} htmlString Optional
             * String to set as the HTML of elements If omitted, the html for the
             first element in the list is returned.
             *  @function
             *  @name TigerJS.nodes#_html
             *  @type TigerJS.nodes | DOMText
             *
             */
            this.n._html = function(htmlString) {
                if (this.length) {
                    if (htmlString) {
                        this.foward_iterator(function(x) {

                            x.set_html(htmlString);
                        });
                        return this;
                    } else {

                        return this[0].get_html();
                    }
                } else {
                    return "NoDataAvailable";
                }
            };

            /**
             * This methods sets multiple CSS values on each nodes, or gets the full
             * CSS computedStyle Object on the first element. to perform a get operation
             * send zero arguments
             * @example
             * <pre>
             *   if getting the returned object could be something like
             *     {
             *       backgroungColor :transparent
             *       backgroundImage : none
             *       borderSpacing : 0px 0px
             *       borderTopColor : rgb(0, 0, 255)
             *       .....
             *       ...
             *       .. //till the last rule
             *     }
             *
             *     //if setting you could do it lyk this
             *     var nodes = T.nodes({childNodes: elid})//get the children of some element
             *                                           with id -elld-
             *
             *     //set some CSS properties
             *     nodes.css({"color" : "red","borderRightColor": "almond"})
             * </pre>
             * @param {String} styleMap Object containing style-rules to set, style rul
             * @name TigerJS.nodes#_css
             * @function
             * @type TigerJS.nodes | CSSComputedStyleObject
             */

            this.n._css = function(styleMap) {
                if (!styleMap) { //get

                    return this[0].get_style();
                } else {
                    this.foward_iterator(function(x) {

                        for (i in styleMap) {
                            x.style[i.to_case("-cm")] = styleMap[i];
                        }
                    });
                }
                return this;
            };

            /**
             * Checks if the elements have the given CSS classes
             * @param {String} classList Space delimited list of CSS classes to check for
             * @function
             *  @type Boolean
             * @name TigerJS.nodes#has_class
             */
            this.n._has_class = function(classList) {
                var r = true;
                if (this.length) {
                    this.foward_iterator(function(x) {

                        //match all classes , not single
                        if (!x.has_class(classList, false))
                            r = false;
                    });
                };
                return r;
            };



            /**
             * Removes the specified CSS classes from the elements in the List
             * @param {String} classList Space delimited list of CSS classes to remove
             * @function
             *  @type TigerJS.nodes
             * @name TigerJS.nodes#remove_class
             */
            this.n._remove_class = function(classList) {
                if (this.length) {
                    this.foward_iterator(function(x) {

                        x.remove_class(classList);
                    });
                }
                return this;
            };

            /**
             * Replaces the specified CSS classes from the elements in the List
             * see documentation for {@link TigerJS.$#replace_class }
             * @function
             *  @type TigerJS.nodes
             * @name TigerJS.nodes#replace_class
             * @see  TigerJS.$#replace_class 
             */
            this.n._replace_class = function(classNames, withClassNames) {

                this.foward_iterator(function(x) {

                    x.replace_class(classNames, withClassNames);
                });
                return this;
            };

            /**
             * Toggles the CSS classes on the elements in the list
             * @param {String} classList Space delimited list of CSS classes to toggle
             * @function
             *   @type TigerJS._nodes
             * @name TigerJS.nodes#toggle_class
             * @function
             */
            this.n._toggle_class = function(classList) {
                if (this.length) {
                    this.foward_iterator(function(x) {

                        x.toggle_class(classList);
                    });
                }
                return this;;
            };

            /**
             * Sets up the event handler on all elements in the List
             * see documentation for {@link TigerJS.$#on}
             * @see  TigerJS.$#on
             * @function
             * 
             * @name TigerJS.nodes#_on
             */
            this.n._on = function(eventName, listener, bubble, defAction, once) {

                if (this.length) {
                    this.foward_iterator(function(x) {

                        x.on(eventName, listener, bubble, defAction, once);
                    });
                }
                return this;
            };
            /**
             * Unregisters an event listener on all elements
             * see documentation for {@link TigerJS.$#off}
             * @see  TigerJS.$#off
             * @function
             *  @type TigerJS.nodes
             * @name TigerJS.nodes#_off
             *
             * @param {String} eventName
             * @param {Function} Listener
             */
            this.n._off = function(eventName, listener) {
                if (this.length) {
                    this.foward_iterator(function(x) {
                        x.off(eventName, listener);
                    });
                }
                return this;
            };
            /**
             * Fires an event on all elements
             * see documentation for {@link TigerJS.$#fire}
             * @seeName   TigerJS.$#fire
             * @function
             *  @type TigerJS.nodes
             * @name TigerJS.nodes#_fire
             * @param {String} eventName
             */
            this.n._fire = function(eventName) {
                if (this.length) {
                    this.foward_iterator(function(x) {
                        x.fire(eventName);
                    });
                }
                return this;
            };
            /**
             * Removes the attribute from the elements in the List
             * @param {String} name atribute to remove
             * @name TigerJS.nodes#remove_attr
             * @function
             * @type TigerJS.nodes
             */
            this.n._remove_attr = function(name) {
                this.foward_iterator(function(x) {
                    x.remove_attr(name);
                });
                return this;
            };

            /**
             * Sets or gets the text content of the elements in the list
             * @param {String, Optional} content Content to set, if not given
             * this method returns the text content of the first element
             * @function
             *  @type TigerJS.nodes | String
             * @name TigerJS.nodes#_text
             
             */
            this.n._text = function(content) {
                if (this.length) {
                    if (undefined === content)
                        return this[0].get_text();

                    this.foward_iterator(function(x) {
                        x.set_text(content);
                    });
                }
                return this;
            };
            /**
             * Returns the element-children, of all elements in the list
             * as a new {@link TigerJS.nodes} instance
             * @function
             *  @type lick.nodes
             *
             * @name TigerJS.nodes#_children
             */
            this.n._children = function() {
                var c = T.Iterator;
                this.foward_iterator(function(x) {
                    c.merge(x.element_children());
                });
                return T.nodes(c);
            };

            /**
             * Set the width of all elements in the list
             * @param {Number} size The width to set to
             * @function
             *  @type TigerJS.nodes
             * @name TigerJS.nodes#_width
             */

            this.n._width = function(size) {
                this.foward_iterator(function(x) {
                    x.set_width(size);
                });
                return this;
            };
            /**
             * Set the height of all elements in the list
             * @param {Number} size The width to set to
             * @function
             *  @type TigerJS.nodes
             * @name TigerJS.nodes#_height
             */

            this.n._height = function(size) {
                if (this.length) {
                    this.foward_iterator(function(x) {
                        x.set_height(size);
                    });
                }
                return this;
            };
            /**
             * Set arbitrary data attributes on all elements in the list
             * The HTML5-data attribute is prefixed with (data-tscript-)<br/>
             * This is to comply with the HTML5 specs recommendation advice to
             * library authors. If you omit the <i>val</i> argument this method
             * returns the data value on the first element in the list
             * @param {String} name The data name
             * @param {String} val The data value
             * @function
             * @type TigerJS.nodes | String
             * @name TigerJS.nodes#_data
             * @see TigerJS.$#set_data
             * @see TigerJS.$#_dataset
             */
            this.n._data = function(name, val) {
                if (this.length) {
                    if (!val)
                        return this[0].get_data(name);
                    this.foward_iterator(function(x) {
                        x.set_data(name, val);
                    });
                }
                return this;
            };

            /**
             * Removes custom data attributes on all elements
             * @param {String} name Name of data attribute to remove
             * @function
             * @type TigerJS.nodes
             * @name TigerJS.nodes#_remove_data
             * @see TigerJS.$#set_data
             * @see TigerJS.$#_dataset
             */
            this.n._remove_data = function(name) {
                if (this.length) {
                    this.foward_iterator(function(x) {
                        x.removeAttribute(("data-lick" + name));
                    });
                }
                return this;
            };
            /*
             * @ignore
             */
            this.n.__to_string = function() {
                return "[object TigerJS.nodes]";
            };



        })(config, strictMatch)
        .n; // return the NodeList-ish collection Object
};