/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */
/**
 *
 * @class
 * This object represents a highly optimized and feature filled generic iterator
 * that could be used to intuitively iterate Objects and Arrays, and other
 * enumerable types, The Iterator supports 'set' and 'get' operations using
 * array square-bracket notation
 * @param {Array | String | Object | DOMNodeList | HTMLCollection, Optional} elements  A valid enumerable object type, to serve as the initial elements, of the Iterator
 
 
 * @example
 * <pre>Most Iterator Operations are chainable, execpt those returning Boolean
 *  or a new Iterator instance.
 
 var myItr = T.Iterator([1,2,3,3,4,5]);
 myItr.shuffle().walk_recursive(callback_func, user_data).unique().
 insert_at([9,10,''],0).next().empty().add_all(obj);
 
 //access an element
 var el = myItr[2];
 or
 var el = myItr.at(2);
 </pre>
 *
 * @class
 */

TigerJS.Iterator = function (elements) {
    var el = elements || [];
    /**
     *  @ignore
     * real Iterator starts here
     */
    var f = function () {

        this.obj = [];
        var x_obj = this.obj,
                i;
        /**
         *Current position
         */
        this.obj.key = 0;
        /*
         * Populate our internal object
         */
        try {
            for (i in el) {

                // for Arrays an array Likes, that is Collections and nodeLists
                if (el.length && !T.is_object(el)) {

                    if (T.is_number(parseInt(i)) || i === "0") { //retrive only numeric indexes, leaving any Object property, lyk item nameditem e.t.c.
                        this.obj[this.obj.length] = el[i];
                    }

                } else if (T.is_object(el)) { //native Object

                    this.obj[this.obj.length] = el[i];
                }
            }
        } catch (e) {
        }

        try { //using if(! this.obj.length) wont work here
            if (this.obj.length === 0) { //IE and safari wont iterate arrays with for so..

                for (i = 0; i < el.length; i++) {
                    this.obj[this.obj.length] = el.charAt ? el.charAt(i) : el[i];
                }


            }

        } catch (e) {
        }


        /**
         * Returns the current size of the Iterator, reflecting the number of elements
         * @type Number
         * @name TigerJS.Iterator#size
         *  @function
         */
        this.obj.size = function () {
            return this.length;
        };

        /**
         * Returns true if the Iterator is empty
         * @type Boolean
         * @function
         * @name TigerJS.Iterator#is_empty
         */
        this.obj.is_empty = function () {
            return !this.length;
        };
        /**
         * Empties the Iterator
         * @function
         * @name TigerJS.Iterator#empty
         * @type TigerJS.Iterator
         */
        this.obj.empty = function () {

            for (var i = 0; i < this.length; i++)
                this[i] = null;//Force GC, incase indexes hold references to objects

            this.splice(0, this.length);
            return this;
        };

        /** if the iterator contains an element
         * @param el {Mixed} element to search for
         * @function
         * @type Boolean
         * @return Boolean
         * @name TigerJS.Iterator#contains
         *  
         */
        this.obj.contains = function (el) {

            if (this.indexOf(el) || this.indexOf(el) === 0) {

                return true;
            } else {

                return false;
            }
            ;
        };


        /**
         * Add a single element to the iterator
         * @param {mixed} scalar The item to add to the collection
         * @param {Boolean} _prepend If set elements are added to the top of the List instead of the bottom
         * @name TigerJS.Iterator#add
         *  @function
         * @type TigerJS.Iterator
         */
        this.obj.add = function (scalar, _prepend) {
            _prepend ? this.unshift(scalar) : this.push(scalar);
            return this;
        };
        /**
         * Method -> add_all
         * This method provides functionality to add all indexes or properties from another
         * <br/>object directly to the Iterator, like appending an entire array to the list
         * or<br/> an object hash or even a string, whereby each charcters of the string become<br/> elements
         * in the set
         * @param {Object | Array | String | HTMLCollection | nodeList | TigerJS.Iterator} Obj An object String , array or collection
         *          object to recursively add its offsets[nodes/indexes] to this Iterator
         * @name TigerJS.Iterator#add_all
         * @type TigerJS.Iterator
         *  @function
         */
        this.obj.add_all = function (Obj) {
            var i = '_null_';
            for (i in Obj) {

                // for Arrays an array Likes, that is Collections and nodeLists
                if (Obj.length && !T.is_object(Obj)) {

                    if (T.is_number(parseInt(i)) || i === "0") { //retrive only numeric indexes, leaving any Object property, lyk item nameditem e.t.c.
                        this.push(Obj[i]);
                    }

                } else { //native Object

                    this.push(Obj[i]);
                }

            }
            try {
                if (i === '_null_') { //IE and safari wont iterate arrays with for so..


                    for (i = 0; i < Obj.length; i++) {
                        this[this.length] = Obj.charAt ? Obj.charAt(i) : Obj[i];
                    }
                }
            } catch (e) {
            }
            return this;
        };

        /**
         * Method -> add_r
         * This method provides functionality to add indexes or properties from another
         * <br/>object directly to the Iterator, starting at a specific index or Key
         * If the index or key is given and not found no new Elements are added to the iteratorx
         * Similar to {@link #add_all}
         * @param {Object | Array | String | HTMLCollection | nodeList | TigerJS.Iterator} Obj An object String , array or collection
         *          object to recursively add its offsets[nodes/properties] to this Iterator
         * @param {Number | String} [start = fisrt index, or key] Numeric index or Object key to start adding elements of c.
         *
         * @param {Number | String} [end] Numeric index or Object key stop adding elements from c, if not given all Elements are added
         *  @function
         * @name TigerJS.Iterator#add_r
         * @type TigerJS.Iterator
         */


        this.obj.add_r = function (Obj, start, end) {
            var search = false, s = start, e = end,
                    i = '_null_',
                    j;
            if (T.is_object(Obj)) {

                if (s) { // we have a start key
                    for (j in Obj) {
                        if (j === s) {

                            search = true;
                        }
                        if (search) {
                            this.add(Obj[j]);
                            if (e && j === e)
                                break;
                        }

                    }
                } else { //no start key
                    for (j in Obj) {
                        this.add(Obj[j]);
                        if (e && j === e)
                            break;
                    }

                }
            }

            //we, were'nt sent a native [Object   {Function | Object}] so it must be an array like
            //object, like array, collectionn, nodelist, get it..
            else {
                if (s || s === 0) { // we have a start index
                    for (j = 0; j < Obj.length; j++) { //shuld hav a length
                        if (j === s - 1)
                            search = true;
                        if (search) {
                            this.add(Obj[j]);
                            if (e && j === e - 1)
                                break;
                        }

                    }
                } else { //no start key
                    for (j = 0; j < Obj.length; j++) {
                        this.add(Obj[j]);
                        if (e && j === e - 1)
                            break;
                    }

                }


            }

            return this;
        };

        /**
         * Method -> insert_at
         *        This method adds nodes to the Iterator from a specified offset
         * @param {Object| Array | String | HTMLCollection | nodeList | TigerJS.Iterator} Obj An object String , array or collection
         *          object to recursively add its offsets to this list
         * @param {Number} offset Offset to begin adding to the list, if zero, then the behavior is similar<br/> to add_all
         * @function
         * @name TigerJS.Iterator#insert_at
         * @type TigerJS.Iterator
         */

        this.obj.insert_at = function (Obj, offset) {
            var o = offset,
                    i;
            if (o >= this.size()) {
                return this.add_all(Obj);
            }
            //need to increment the offset else elements get inserted in
            // reverse order
            for (i = 0; i < Obj.length; i++, o++)
                this.splice(o, 0, Obj[i]);
            return this;
        };

        /** The current element, pointed to by the internal pointer.
         *  @type Mixed
         *  @return {Mixed} Returns the item at the current offset of this Iterator
         * @name TigerJS.Iterator#current
         * @function
         */
        this.obj.current = function () {
            return this[this.key];
        };


        /**
         * Move the iterator to the next node,
         * @return {Boolean}  returns false if we have reached the last node, else true
         *  @function
         * @name TigerJS.Iterator#next
         
         */
        this.obj.next = function () {
            if (this.is_empty())
                return false;

            var k = this.key;
            if (++k > this.size() - 1) //if the next index isnt valid, dont iterate
            {
                return false;
            }
            this.key = k;
            return true;
        };

        /**
         * Returns an Iterator contaning the values of this iterator from the current position
         * to the last element of the iterator
         * @param {Number} max If Given only max numbers of elements would be returned
         * @return {TigerJS.Iterator} An Iterator Containing the needed range of elements, or an empty Iterator if no elements
         * @function
         * @name TigerJS.Iterator#next_all
         
         */
        this.obj.next_all = function (max) {
            max = max || this.length - this.key; //its minus key so that if key is at 2 we take length as 2 to array length and not from 0
            var r = [];
            for (var i = this.key; r.length < max; i++) {

                r[r.length] = this[i];
            }
            return TigerJS.Iterator(r);
        };

        /**
         * Move the iterator to the previous  node,
         * @return {Boolean} returns false if we are at the first node, else returns true
         * @name TigerJS.Iterator#prev
         * @function
         */
        this.obj.prev = function () {


            if (this.is_empty() || this.key === 0) {
                return false;
            }

            this.key = --this.key;
            return true;
        };

        /**
         * Merges  one or more enumerable objets with this Iterator
         * @param {...Iteratable} args A variable list of mixed arguments to merge
         * @name TigerJS.Iterator#merge
         * @function
         * @type TigerJS.Iterator
         */

        this.obj.merge = function (args) {
            for (var i = 0; i < arguments.length; i++) {
                this.add_all(arguments[i]); //we use add_all so we dont add unecessary properties and feilds, lyk namedItem...
            }

            return this;
        };


        /**
         * Returns an Iterator contaning the values of this iterator from the current position
         * to the first element of the iterator
         * @param {Number} [max] If given only [max] numbers of elements would be returned
         * @return {TigerJS.Iterator} An Iterator Containing the needed range of elements, or an empty Iterator if no elements
         * @name TigerJS.Iterator#prev_all
         *  @function
         */
        this.obj.prev_all = function (max) {
            max = max || this.key + 1;
            var r = [];
            for (var i = this.key; r.length < max; i--) {

                r[r.length] = this[i];
            }
            return TigerJS.Iterator(r);
        };

        /**
         * Rewind the internal pointer to the top of the list
         * @name TigerJS.Iterator#rewind
         * @function
         * @type TigerJS.Iterator
         */
        this.obj.rewind = function () {

            ///
            this.key = 0;
            return this;
        };
        /**
         * Check if the offset exists
         * @param {Number} x Numeric offset to check
         * @return {Boolean} True if the offset exists as an index in this collection.
         * @function
         * @name TigerJS.Iterator#is_index
         */
        this.obj.is_index = function (x) {
            //we check for the number zero, in case the value at the index is actually zero,
            //which otherwise would return false
            return (this[x]) || this[x] === 0 ? true : false; //..now is this mootools or dojo style??
        };



        /**
         *  Sets an offset to a given value, overwriting a previous element
         * @param {Number} x the index/offset to set
         * @param {Mixed} v the offset value
         * @function
         * @name TigerJS.Iterator#set
         * @type TigerJS.Iterator
         */
        this.obj.set = function (x, v) {
            if (this.is_empty())
                return this;

            if (!this.is_index(x)) {
                return this;
            }

            this[x] = v;
            return this;
        };

        /**
         *  Gets the value at a given offset
         * @param {Number} x the index/offset to get
         * @function
         * @name TigerJS.Iterator#at
         * @return Returns the value at the specified index else returns undefined
         */
        this.obj.at = function (x) {
            if (this.is_empty())
                return undefined;

            if (!this.is_index(x)) {
                return undefined;
            }

            return this[x];
        };

        /**
         * Duplicates the node of the bottom of the Iterator and pushes it back on top so the <br/>first two
         * elements are the same
         * @name TigerJS.Iterator#duplicate
         * @function
         * @type TigerJS.Iterator
         */
        this.obj.duplicate = function () {
            if (this.is_empty())
                return this;
            var top = this.peek();
            this.push(top);
            return this;
        };


        /** Inverts the position of X no of element indexes on the Iterator, that is if u pass
         * 4 as your argument it inverts the position of the first 4 elementa, that is
         * the fourth becomes the first and vice-versa
         * @type TigerJS.Iterator
         * @param {Number} X
         * @function
         * @name TigerJS.Iterator#rotate
         */
        this.obj.rotate = function (X) {
            if (X > this.size() || this.length === 0) {
                return this;
            }
            //get the requred nodes
            var temp = [];
            temp = this.slice(0, X); //slice of the required nodes into a temporary array
            temp.reverse(); //reverse their indexing

            for (var i = 0; i < X; i++) {
                this[i] = temp[i]; //overwrite the reversed indexes in our internal object

            }
            return this;
        };

        /**
         * Returns a random value from the Iterator or null if the Iterator is empty
         * #TODO : Do we need a better random number Generator
         * @function
         * @name TigerJS.Iterator#rand
         */
        this.obj.rand = function () {
            if (this.is_empty())
                return null;
            var s = Math.round(Math.random() * this.length - 1);
            return this[(s < 0 ? 0 : s)];
        };

        /**
         * Cleans out duplicate elements from the Iterator
         * @function
         * @name TigerJS.Iterator#unique
         * @type TigerJS.Iterator
         */
        this.obj.unique = function () {
            if (this.is_empty())
                return this;
            var itr = T.Iterator(),
                    count = 0,
                    el;
            while (1) {

                //if we havent added the element previously
                if (!itr.contains((el = this.at(count)))) {
                    itr.add(el);
                }
                if (count === this.length - 1)
                    break; //next index or break if at tail
                else
                    ++count;
            }
            //empty the Iterator and add the uniqued!! list
            this.empty();
            this.add_all(itr);
            return this;
        };
        /*
         * @ignore
         *
         */
        function splice(i) {
            x_obj.splice(i, 1);
            return this;
        }



        /**
         *  Deletes an offset/index in the iterator
         * @param {Number} x The offset to delete.
         * @name TigerJS.Iterator#unset
         * @function
         * @type TigerJS.Iterator
         */


        this.obj.unset = function (x) {
            if (this.is_empty())
                return this;
            this.splice(x, 1);
            return this;
        };

        /**
         * Return a native array containing this Iterators elements
         * @type Array
         * @function
         * @name TigerJS.Iterator#to_array
         */
        this.obj.to_array = function () {
            return [].concat(this);
        };


        /**
         * Removes the last element from the Iterator and returns It
         * @function
         */
        this.pop = function () {
        }; //already implemented in native, so this just for the docs


        /**
         *  Pushes one or more element to the end Of the Iterator list, returning the new length of the iterator
         *  @param {Mixed..} args variable argument list
         *  @function
         */
        this.push = function (args) {

        };

        /**
         * Removes the first element from the Iterator and returns It
         *  @function
         *  @type mixed
         */
        this.shift = function () {
        };

        /**
         *  Adds one or more element to the top Of the Iterator list, returning the new length of the iterator
         *  @param {...Mixed} args Variable argument list
         *  @type Number
         *  @function
         */
        this.unshift = function (args) {
        };
        /**
         *  Transposes the elements of the Iterator the first array element becomes the last and the last becomes the first.
         *  @type TigerJS.Iterator
         *  @function
         */
        this.reverse = function ( /** variable argument list */ ) {
        };
        /**
         *  Joins all elements of the Iterator into a string
         * @param {String} sep An optional string to seperate each elements of the string, defaults to a comma.
         *
         *  @function
         */
        this.join = function (sep) {
        };
        /**
         * Changes the content of an array, adding new elements while removing old elements.
         * @param {Number} index Index at which to start schanging the array
         * @param {Number} re An integer indicating the number of old array elements to remove. If <b><i>re</b></i> is 0, no elements are removed.
         *                       In this case, you should specify at least one new element.
         * @param {...Number} [add] A variable list of elements to add to the array. If you don't specify any elements,
         *                                  splice simply removes elements from the array.
         *  @function
         */
        this.splice = function (index, re, add) {
        };
        /**
         *
         *  Alias for {@link #merge}
         *  @function
         *  @type T.Iterator
         *  @param {Array,...} args A variable list of Arrays
         *  @name TigerJS.Iterator#concat
         */
        this.obj.concat = function (args) {


            return this.merge.apply(this, arguments);
        };
        /**
         *  Returns an Iterator containing the sequence of elements from the Iterator as specified by the offset and length parameters.
         *  This function resets the Iterator pointer, back to the top.
         *  @param {Number} offset Integer Offset to begin extraction
         *  If <i>offset</i> is non-negative, the sequence will start at that offset in the Iterator.
         *  @param {Number} {length} length If <i>length</i> is given and is positive, then the sequence will have that many elements in it.
         *                        If <i>length</i> is given and is negative then the sequence will stop that many elements from the end of the Iterator. If it is omitted,
         *                        then the sequence will have everything from offset up until the end of the array.
         *  @function
         *  @type TigerJS.Iterator
         */

        this.slice = function (offset, length) {
            if (this.is_empty())
                return this;
            return (TigerJS.Iterator(this.slice(offset, length)));
        };

        /**
         * Make a one level deep copy of this Iterator elements and returns a new Iterator
         * @type TigerJS.Iterator
         *  @function
         * @name TigerJS.Iterator#clone
         */
        this.obj.clone = function ( /** variable argument list */ ) {
            if (this.is_empty())
                return TigerJS.Iterator();
            return (TigerJS.Iterator(this));
        };
        /**
         * Applies the user-defined function <i>funcname</i> to each element of the array array.
         * walk() is not affected by the internal array pointer of Iterator, and will walk through the entire Iterator regardless of pointer position.
         * @param {Function} funcname funcname A function to be used as the callback when walking the array, Typically, <i>funcname</i> takes on two parameters.
         *                            The array parameter's value being the first, and the key/index second
         * @param {Array} [userdata] Extra parameters to be sent to the callback function when walking, sent as the third parameter
         *  @function
         *  @name TigerJS.Iterator#walk
         *  @type TigerJS.Iterator
         */
        this.obj.walk = function (funcname, userdata) {
            if (this.is_empty())
                return this;

            var _key = this.key;
            this.key = 0;
            do {

                funcname(this.current(), this.key, userdata || null);
            } while (this.next());
            this.key = _key; //reset to initial value
            return this;
        };
        /**
         * Applies the user-defined function <i>funcname</i> to each element of the array array. This function will recur into deeper arrays and array like structures
         * walk_recursive() is not affected by the internal array pointer of Iterator, and will walk through the entire Iterator regardless of pointer position.
         * @param {Function} funcname funcname A function to be used as the callback when walking the array.
         * @param {Mixed} [userdata]  Extra parameter to be sent to the callback function when walking, sent as the second parameter
         *  @function
         *  @name TigerJS.Iterator#walk_recursive
         *   @type TigerJS.Iterator
         */
        this.obj.walk_recursive = function (funcname, userdata) {
            if (this.is_empty())
                return this;
            var _key = this.key;
            this.key = 0;
            do {

                for (var i in this.current()) { //if this index/sub-item is enumerable recurse it
                    if (T.is_enumerable(this.current())) {

                        TigerJS.Iterator(this.current()).
                                walk_recursive(funcname, userdata || null);
                        if (!this.next()) {
                            return this;
                        } // normally after iterating a sub-item we need to move foward to avoid a repitition
                    }

                }
                if (!T.is_enumerable(this.current())) {
                    //leave out enumerables for the above logic
                    funcname(this.current(), userdata || null);
                }


            } while (this.next())
            this.key = _key; //reset to initial value
            return this;
        };
        /**
         * Return the First Item item on the Iterator or null if empty
         * @function
         * @name TigerJS.Iterator#peek
         */

        this.obj.peek = function () {
            if (this.is_empty())
                return null;
            return this[0];
        };


        /**
         * Return the Last Item item on the Iterator, or null if empty
         * @function
         * @name TigerJS.Iterator#last
         */

        this.obj.last = function () {
            if (this.is_empty())
                return null;
            return this[this.length - 1];
        };




        /**
         * Return the index of a particular item in the iterator, this function might not work when searching for part of a string value,
         * for that use  {@link TigerJS.Iterator#str_index_of}
         * @param {Mixed} x The item to serach for
         * @function
         * @name TigerJS.Iterator#indexOf
         * @return {Number | Boolean} The integer offset if found, else false
         */
        this.obj.indexOf = function (x) {
            if (this.is_empty())
                return false;


            for (var i = 0, j = this.length; i < j; i++) {

                if (this[i] === x) {

                    return i;

                }

            }
            return false;
        };

        /**
         * Alias of TigerJS.Iterator#indexOf
         * @name TigerJS.Iterator#index_of
         * @param {Mixed} x The item to serach for
         * @function
         */
        this.obj.index_of = function (x) {
            return this.indexOf(x);
        } //migrating;

        /**
         * Assuming this Iterator is made up of strings, this method returns the first index
         * that contains the argument as a substring
         * @param {string} needle String to search for in all Iterator indexes
         * @function
         * @name TigerJS.Iterator#str_index_of
         * @return {Number} The integer offset if found, else -1
         */
        this.obj.str_index_of = function (needle) {
            if (this.is_empty())
                return -1;
            for (var i = 0, j = this.length; i < j; i++) {

                if (this[i].indexOf && this[i].indexOf(needle) > -1) {

                    return i;
                }


            }
            return -1;
        };
        /**
         * Return the last index at which  a particular element was found in the iterator
         * @param {Mixed} x The item to serach for
         * @function
         * @name TigerJS.Iterator#last_index_of
         * @return {Number | Boolean} The integer offset if found, else false
         */
        this.obj.last_index_of = function (x) {
            if (this.is_empty())
                return false;
            var index = -1;
            for (var i = 0, j = this.length; i < j; i++) {
                if (this[i] === x) {
                    index = i;
                }


            }
            return index;
        };

        /**
         * Assuming this Iterator is made up of strings, this method returns the last index
         * that contains the argument as a substring
         * @param {string} needle String to search for in all Iterator indexes
         * @function
         * @name TigerJS.Iterator#str_last_indexOf
         * @return {Number} The integer offset if found, else -1
         */
        this.obj.str_last_index_of = function (needle) {
            var index = -1;
            for (var i = 0, j = this.length; i < j; i++) {
                if (this[i].indexOf && this[i].indexOf(needle) > -1) {
                    index = i;
                }


            }
            return index;
        };

        /**
         * Fills the Iteraor with -num- entries of the value of the -val- parameter,
         * starting at the optional -start_index- parameter
         * @param {Number} num Number of elements to insert
         * @param {Mixed}  val Value to use for filling, If a function is sent it is called and its return value used.
         * @param {Number} [start_index = 0] Non-negative index to start fill
         * @name TigerJS.Iterator#fill
         * @type TigerJS.Iterator
         * @function
         * @return TigerJS.Iterator
         */
        this.obj.fill = function (num, val, start_index) {
            try {

                var t = [],
                        si;
                if (!!(si = (start_index || this.length)) < 0)
                    return this;
                while (num) {
                    if (T.is_function(val)) {
                        this.splice(si, 0, val());
                    } else {
                        this.splice(si, 0, val);
                    }
                    num = num - 1;
                    si = si + 1;
                }
                return this;
            } catch (e) {
                return this;
            }
        };

        /**
         * Returns an Iterator consisting of even indexes of this Iterator
         * @return  An array consisting of all even number index of the calling array
         * @function
         *@type TigerJS.Iterator
         * @name TigerJS.Iterator#even
         */
        this.obj.even = function () {
            if (this.is_empty())
                return T.Iterator();
            var r = [],
                    x = [].concat(this);
            for (var i in x) {

                if (i === 0 || !(i % 2)) { //shouldnt have any remainder ;
                    r[r.length] = x[i];
                }
            }
            return T.Iterator(r);
        };

        /**
         * Returns an Iterator consisting of odd indexes of this Iterator
         * @return An array consisting of all odd number index of the calling array
         * @function
         * @type TigerJS.Iterator
         * @name TigerJS.Iterator#odd
         */
        this.obj.odd = function () {
            if (this.is_empty())
                return T.Iterator();
            var r = [],
                    x = [].concat(this);
            for (var i in x) {

                if (i > 0 && (i % 2)) { //should have any remainder ;
                    r[r.length] = x[i];
                }
            }
            return T.Iterator(r);
        };

        /**
         * Iterates over every element of our Iterator, sending them to a call back function
         * @param {Function} f The function to execute
         * @return [Boolean] Returns true if the function returns true for some Iterator element sent
         * @function
         * @name TigerJS.Iterator#some
         */
        this.obj.some = function (f) {
            if (this.is_empty())
                return false;
            var _key = this.key;
            this.key = 0;
            var itr = T.Iterator([].concat(this));
            do {
                if (f(itr.current())) {
                    return true;
                }

            } while (itr.next());
            this.key = _key;
            return false;
        };

        /**
         * ;Iterates over every element of our Iterator, sending them to a call back function
         * @param {Function} f The function to execute
         * @return Boolean Returns true if the function returns true for every Iterator element sent
         * @function
         * @name TigerJS.Iterator#every
         */

        this.obj.every = function (f) {
            if (this.is_empty())
                return false;
            var _key = this.key;
            this.key = 0;
            var itr = T.Iterator([].concat(this));
            do {
                if (!f(itr.current())) {
                    return false;
                }
            } while (itr.next());
            this.key = _key;
            return true;
        };

        /**
         * Returns a new copy of the Iterator without any holes in it. I.E. null/undefined values
         * @type TigerJS.Iterator
         * @function
         * @name TigerJS.Iterator#compact
         */

        this.obj.compact = function () {
            if (this.is_empty())
                return T.Iterator();
            var _key = this.key; //cache key
            this.key = 0;
            var re = TigerJS.Iterator();
            do {

                if (this.current() !== null && this.current() !== undefined) {
                    re.add(this.current());
                }
            } while (this.next())
            this.key = _key;
            return re;
        };

        /**
         * Recursively add sub-dimension elements of a multidimensional Iterator, into its main element tree, converting the Iterator
         * into a one dimensional tree, this function removes undefined and null values from the Iterator, and also resets the internal pointer
         * @function
         * @name TigerJS.Iterator#flatten
         * @type TigerJS.Iterator
         */

        this.obj.flatten = function () {
            if (this.is_empty())
                return T.Iterator();
            var x = this.compact(),
                    _temp = [];
            var f = function (val) {
                _temp[_temp.length] = val;
            };
            x.walk_recursive(f);
            this.empty();
            this.add_all(_temp);
            this.key = 0;
            return this;
        };


        /** Processes the Iterator removing  any of the specified values. 
         * @type TigerJS.Iterator
         * @param {Array}  list An array containing a variable list of values to omit from the Iterator
         * @name TigerJS.Iterator#without
         * @function
         * @type TigerJS.Iterator
         */
        this.obj.without = function (list) {
            if (this.is_empty())
                return T.Iterator();

            var a = T.Iterator(list), b = T.Iterator().add_all(this);
            this.empty();

            while (b.index_of(a.current()) !== false) {
                b.unset(b.index_of(a.current()));
                if (b.index_of(a.current()))
                    continue; //still more matches, dont move to next index yet
                a.next();
            }

            this.add_all(b.compact());
            return this;
        };


        /**
         * Executes the supplied function on each item in the Iterator. Map doesnt recur into deeper elements
         * @param {Function} f  The function to execute on each item.
         *
         * @return {TigerJS.Iterator} A new Iterator containing the return value
         * of the supplied function for each item in the original
         * array.
         * @function
         * @name TigerJS.Iterator#map
         */
        this.obj.map = function (f) {
            if (this.is_empty())
                return T.Iterator();

            var _key = this.key;
            this.key = 0;
            var r = [];
            do {
                r[r.length] = f(this.current());
            } while (this.next());
            this.key = _key;
            return TigerJS.Iterator(r);
        };


        /**
         * Returns an Iterator containing the elements of this Iterator that returned a truth value when sent to the callback, if you need to recur into deeper
         * elements you should flatten the iterator first
         * @param {Function} f The function to execute [callback}
         * @return {TigerJS.Iterator} An Iterator containing the items on which the supplied function returned a (truthy) value
         * @function
         *@name TigerJS.Iterator#filter
         */
        this.obj.filter = function (f) {
            if (this.is_empty())
                return T.Iterator();
            var _key = this.key,
                    r = [];
            this.key = 0;
            do {
                if (f(this.current())) {
                    r[r.length] = this.current();
                }
            } while (this.next());
            this.key = _key;
            return TigerJS.Iterator(r);
        };

        /**
         * Returns an Iterator containing the elements of this Iterator that returned a false value when sent to the callback, (opposite of filter)
         * This method doesnt recur recursively, so if you need to recur into deeper elements you should flatten the iterator first
         * @param {Function} f The function to execute [callback}
         * @return {TigerJS.Iterator} The items on which the supplied function returned a (truthy) value
         * @function
         * @name TigerJS.Iterator#reject
         */
        this.obj.reject = function (f) {
            if (this.is_empty())
                return T.Iterator();
            var _key = this.key,
                    r;
            this.key = 0;
            r = [];
            do {
                if (!f(this.current())) {
                    r[r.length] = this.current();
                }
            } while (this.next());
            this.key = _key;
            return TigerJS.Iterator(r);
        };

        /**
         * replace() replaces the values of the Iterator with the same values from all the Objects arguments.  If several Objects are passed for replacement,
         * they will be processed in order, the later Objects overwriting the previous values.
         * @param {Array | Object | TigerJS.Iterator | NodeList | HTMLCollections | String} args Any number of the specified type
         * @function
         * @name TigerJS.Iterator#replace
         * @type TigerJS.Iterator
         */

        this.obj.replace = function (args) {
            if (this.is_empty())
                return T.Iterator();
            var _key = this.key,
                    f;
            for (var i in arguments) {
                this.key = 0; //reset the key on each Iteration

                f = TigerJS.Iterator(arguments[i]); //temp Iterator for each argument
                do {
                    this[this.key] = f.current();
                    this.key++;
                } while (f.next());
            }

            this.key = _key;
            return this;
        };

        /**
         * replace_from() replaces the values of the Iterator with the same values from all the Objects arguments starting from the specified index.
         *  If several Objects are passed for replacement,they will be processed in order, the later Objects overwriting the previous values.
         * @param {Number} start_index A positive integer not greater than the (size-1) of the Iterator, specifying where the replacement should start
         * @param {Array | Object | TigerJS.Iterator | NodeList | HTMLCollections | String} args Any number of the specified type
         * @function
         *@name TigerJS.Iterator#replace_from
         * @type TigerJS.Iterator
         */

        this.obj.replace_from = function (start_index, args) {
            if (this.is_empty())
                return T.Iterator();
            var _key = this.key,
                    f;
            if (start_index < 0 || start_index > this.size - 1)
                return this; //bad start index

            for (var i = 1; i < arguments.length; i++) {
                this.key = start_index; //reset the key to the start_index on each Iteration

                f = TigerJS.Iterator(arguments[i]); //temp Iterator for each argument
                do {
                    this[this.key] = f.current();
                    this.key++;
                } while (f.next());
            }

            this.key = _key;
            return this;
        };

        /**
         * Returns an instance of {@link TigerJS.Iterator},Create an arra containing a range of elements, currently this method
         * accepts only characters and positive integers as start and end offsets,
         * if the start ofsset is Greater than the end offset, the resulting element set would be in descending order
         * @param {Number | String} sv The start character or Number
         * @param {Number | String} ev The end character or Number
         * @param {Number} [step =1] If a step value is given, it will be used as the increment between elements in the sequence.
         * step should be given as a positive number.
         * @function
         * @name TigerJS.Iterator#range
         * @type TigerJS.Iterator
         */
        this.obj.range = function (sv, ev, step) {
            if (!sv || !ev) {
                return this.clone();
            }
            var s, e,
                    r = T.Iterator();
            if (T.is_number(sv)) { //range is numerical
                if (sv < ev) {
                    r.add(sv);
                    while (r.last() < ev) {
                        if ((step && step + r.last()) > ev || r.last() + 1 > ev) {
                            break;
                        }
                        r.add((step ? step + sv++ : sv++));
                        //sv = sv + r.last();

                    }

                } else if (sv > ev) {

                    r.add(sv);
                    while (sv >= ev) {
                        if ((step && r.last() - step) < ev || r.last() - 1 < ev) {
                            break;
                        }
                        r.add((step ? (sv--) - step : sv--));
                    }
                }
            }
            if (T.is_string(sv)) { //range is alphabetical

                if (sv.charCodeAt(0) < ev.charCodeAt(0)) {
                    r.add(sv);
                    s = sv.charCodeAt(0);
                    e = ev.charCodeAt(0);
                    while (r.last().charCodeAt(0) < ev.charCodeAt(0)) {
                        if ((step && step + r.last().
                                charCodeAt(0) > e) || r.last().
                                charCodeAt(0) + 1 > e) {
                            break;
                        }
                        r.add((step ? String.fromCharCode(step + s++) : String.fromCharCode(s++)));
                    }

                } else if (sv.charCodeAt(0) > ev.charCodeAt(0)) {

                    r.add(sv);
                    s = sv.charCodeAt(0);
                    e = ev.charCodeAt(0);
                    while (s >= e) {
                        if ((step && r.last().
                                charCodeAt(0) - step) < e || (r.last().
                                charCodeAt(0) - 1) < e) {
                            break;
                        }
                        r.add((step ? String.fromCharCode(r.last().
                                charCodeAt(0) - step) : String.fromCharCode(s--)));
                    }

                }

            }

            return r.unique();
        }; //end range

        /**
         *  Computes the intersection of this iterator's elements set and another collection or objects and returns the resulting set as an Iterator
         * @param {Object} c1 object to be compared against
         * @type TigerJS.Iterator
         * @name TigerJS.Iterator#intersect
         * @function
         * @return returns the resulting intersection
         */

        this.obj.intersect = function (c1) {
            if (this.is_empty())
                return T.Iterator();
            var result = T.Iterator(),
                    //get iterator interface for argument
                    i1 = T.Iterator(c1);
            //..do the loop stuff

            do {
                if (this.contains(i1.current())) //if the collections intersect at the offset
                {

                    result.add(i1.current()); //add the element to the resulting set
                }
            } while (i1.next())

            return result; //a set containing the intersection of this.object and c1
        };
        /**
         *  Computes the difference of this Iterator's elements and another collection or object and returns the resulting set as an Iterator
         *  It checks for elements in this Iterator that are not in the argument
         * @param {Object} c1 object to be compared against
         * @type TigerJS.Iterator
         * @name TigerJS.Iterator#diff
         * @function
         */
        this.obj.diff = function (c1) {
            if (this.is_empty())
                return T.Iterator();
            var _key = this.key,
                    result = T.Iterator(),
                    //get iterator interface for argument
                    i1 = T.Iterator(c1);
            //..do the loop stuff
            this.key = 0;
            do {
                if (!i1.contains(this.current())) //if the collections intersect at the offset
                {

                    result.add(this.current()); //add the element to the resulting set
                }
            } while (this.next())
            this.key = _key;
            return result; //a set containing the intersection of this.object and c1
        };
        /**
         * Evaluates if a set/collection is a subset of this Iterator's elements set
         * @param {Object} c1 object to compare
         * @type Boolean
         * @function
         * @name TigerJS.Iterator#is_subset
         */
        this.obj.is_subset = function (c1) {

            //get iterator interface for argument
            var i1 = T.Iterator(c1);
            do {
                if (!this.contains(i1.current())) {
                    return false;
                }

            } while (i1.next())

            return true;
        };

        /**
         * Evaluates if a set/collection is a superset of this Iterator's elements set
         * @param {Object} c1 object to compare
         * @type Boolean
         * @function
         * @name TigerJS.Iterator#is_superset
         */
        this.obj.is_superset = function (c1) {
            var _key = this.key,
                    i1;
            //get iterator interface for argument
            i1 = T.Iterator(c1);
            //..do the loop stuff
            this.key = 0;
            do {
                if (!i1.contains(this.current())) //if the collections intersect at the offset
                {

                    return false;
                }
            } while (this.next())
            this.key = _key;
            return true;
        };



        /**
         * Shuffles the elements of the Iterator
         * @function
         * @name TigerJS.Iterator#shuffle
         * @type TigerJS.Iterator
         */
        this.obj.shuffle = function () {
            var _t = T.Iterator([].concat(this));
            this.empty();
            for (var i = 0, j = _t.length; i < j; i++) {
                this[i] = _t.rand();
                _t.unset(_t.indexOf(this[i]));
            }
            return this;


        };

        /**
         * Partitions the elements of this Iterator in two groups: those regarded as true, and those considered false,
         * as each elements are passed to the callback function, The two groups are stored in two arrays and returned in an Iterator
         * as its first and second elements.
         * @param {Function} f
         * This is a preferred solution to using both filter and reject: as it only loops through the elements once!
         * @function
         * @type TigerJS.Iterator
         * @name TigerJS.Iterator#partition
         */

        this.obj.partition = function (f) {
            if (this.is_empty())
                return T.Iterator();

            var _key = this.key,
                    ar_0 = [],
                    ar_1 = [];
            this.key = 0;
            do {
                if (f(this.current())) {
                    ar_0[ar_0.length] = this.current();
                } else if (!f(this.current())) {

                    ar_1[ar_1.length] = this.current();
                }
            } while (this.next());
            this.key = _key;
            var r = TigerJS.Iterator().add(ar_0).add(ar_1);
            return r;
        };

        /**
         * Sorts a data table by a given key
         * A data table is an array of arrays, where each array type element represents a row of data in the table
         * @example
         *
         *var
         fruits = [
         ['Apples',52,13.81,2.4],
         ['Avocados',160,8.53,6.7],
         ['Bananas',89,22.84,2.6],
         ['Dates',277,74.97,6.7],
         ['Grapefruits',42,10.66,1.6]
         ]
         * Array fruits is a data-table containing information of fruits, to sort it with this method, using say its
         second index ( i.e. Array[1]), invoke this line
         * var sortedResult = (T.Iterator()).sort_by(dt,1) results in the array
         *
         [
         ['Grapefruits',42,10.66,1.6]
         ['Apples',52,13.81,2.4],
         ['Bananas',89,22.84,2.6],
         ['Avocados',160,8.53,6.7],
         ['Dates',277,74.97,6.7],
         ]
         * @param {Array} dt The data table to sort
         * @param {Number} index Index by which to sort by
         * @type Array
         * @function
         * @name TigerJS.Iterator#sort_by
         */

        this.obj.sort_by = function (dt, index) {


            //quick and fast
            if (!dt || (!index && index !== 0)) {
                return dt ? [] : undefined;
            }
            // get all elements at the index to sort by
            var indx_arr = T.Iterator(),
                    re = [];
            for (var i = 0, j = dt.length; i < j; i++) {

                indx_arr[i] = dt[i][index];
            }
            //sort the array, depending on the type of elements
            if (T.is_string(indx_arr[0])) {

                indx_arr.sort();
            } else {
                indx_arr.sort(function (a, b) {
                    return a - b;
                });
            }

            do { //create the result array based on the sorted indexes
                for (i = 0; i < dt.length; i++) {

                    if (dt[i][index] === indx_arr.current()) {
                        re.push(dt[i]);
                    }
                }
            } while (indx_arr.next());

            return re;
        };



        /**
         * Advances the Iterator's pointer by a distance of <i><b> n </i></b>equivalent to
         * calling Iterator.next() n times, if the 'Reverse' flag is set, its equivalent to calling
         * Iterator.previous() n times, The operations  never go below the first index i.e.
         * Iterator[0], or the highest index. if n === 0, the call has no effect.
         *  @type TigerJS.Iterator
         *  @name TigerJS.Iterator#advance
         *  @function
         *  @param {Interger} n Distance to increment or decrement the Iterator's pointer
         *  @param {Boolean} [Reverse] Performs the operation in reverse order
         */

        this.obj.advance = function (n, Reverse) {
            if (this.is_empty())
                return T.Iterator();
            if (!n)
                return this;
            if (Reverse) {

                while (this.key > 0 && n) {
                    this.key--;

                    n--;
                }
                return this;
            }

            while (this.key < (this.length - 1) && n) { //increment
                this.key++;

                n--;
            }
            return this;
        };


        /**
         * This method transverses the Iterator in a foward order, sending each element to a callback function, removing the need
         * to use manual loops, the Iterator instance is passed as an execution context to the call-back
         * @param {Function} cb function to accept each element
         * @param {Number} jump Optional argument if given indicates the number of junps to take while moving foward
         * @param {Array} extra_args An array of extra arguments to send to the callback
         *  @type TigerJS.Iterator
         *  @name TigerJS.Iterator#foward_iterator
         *  @function
         */


        this.obj.foward_iterator = function (cb, jump, extra_args) {
            if (this.is_empty())
                return this;

            if (!T.is_function(cb)) {
                err_str = " WrongArgumentTypeError<> Method TigerJS.Iterator#foward_iterator" +
                        "Expects a function as its first argument, * " + T.type(cb) + " * given";
                throw new Error(err_str);
            }

            var _key = this.key;
            this.key = 0;
            do {

                if (jump) {
                    this.key += jump - 1; //if we're incementing by a specific size
                }
                cb.apply(this, [this.current()].concat(extra_args || []));
                ++this.key;

            } while (this.key < this.size());

            this.key = _key;
            return this;
        };

        /**
         * This method transverses the Iterator in a reverse order, sending each element to a callback function, removing the need
         * to use manual loops,  the Iterator instance is passed as an execution context to the call-back
         * @param {Function} cb function to accept each element
         * @param {Number} jump Optional argument if given indicates the number of junps to take while moving backward
         * @param {Array} extra_args An array of extra arguments to send to the callback
         *  @type TigerJS.Iterator
         *  @name TigerJS.Iterator#reverse_iterator
         *  @function
         */


        this.obj.reverse_iterator = function (cb, jump, extra_args) {
            if (this.is_empty())
                return this;

            if (!T.is_function(cb)) {
                err_str = " WrongArgumentTypeError<> Method TigerJS.Iterator#reverse_iterator" +
                        "Expects a function as its first argument, * " + T.type(cb) + " * given";
                throw new Error(err_str);
            }

            var _key = this.key;
            this.key = this.size() - 1;
            do {
                cb.apply(this, [this.current()].concat(extra_args || []));

                if (jump) {
                    this.key -= (jump - 1);
                }
            } while (this.prev())


            this.key = _key;
            return this;
        };



        /**
         *  Send each element of the iterator to a callback function, transversing the iterator in a random order.
         *  The Iterator instance is passed as an execution context to the call-back
         * @param {Function} cb function to accept each random element
         * @param {Array} extra_args An array of extra arguments to send to the callback
         *  @type TigerJS.Iterator
         *  @name TigerJS.Iterator#random_access_iterator
         *  @function
         */


        this.obj.random_access_iterator = function (cb, extra_args) {
            if (this.is_empty())
                return this;

            if (!T.is_function(cb)) {
                err_str = " WrongArgumentTypeError<> Method TigerJS.Iterator#random_access_iterator" +
                        "Expects a function as its first argument, * " + T.type(cb) + " * given";
                throw new Error(err_str);
            }

            var i = this.clone(),
                    r;
            do {
                r = i.rand(); //get a random element
                
              
                cb.apply(this, [r].concat(extra_args || [] ));

                i.unset(i.indexOf(r));
            } while (i.size())


            return this;
        };
        /**
         *  Send each element of the iterator to a callback function, at specific timed intervals
         *  the Iterator instance is passed as an execution context to the call-back
         * @param {Function} cb function to accept the elements,
         * @param {Number} delay milliseconds to wait before sending the next element to the call back
         *  @type TigerJS.Iterator
         *  @name TigerJS.Iterator#timed_iterator
         *  @function
         */


        this.obj.timed_iterator = function (cb, delay) {
            if (this.is_empty())
                return this;


            if (!T.is_function(cb)) {
                err_str = " WrongArgumentTypeError<> Method TigerJS.Iterator#timed_iterator" +
                        "Expects a function as its first argument, * " + T.type(cb) + " * given";
                throw new Error(err_str);
            }

            if (!T.is_number(delay)) {
                err_str = " WrongArgumentTypeError<> Method TigerJS.Iterator#timed_iterator" +
                        "Expects an integer as its second argument, * " + T.type(delay) + " * given";
                throw new Error(err_str);
            }

            var _key = 0;
            var _isize = this.size() - 1;
            var itr = this;

            setTimeout(z, delay);

            function z() {
                if (_key <= _isize) {
                    cb(itr[_key++]);

                    setTimeout(z, delay);
                    return;
                }
            }
            return this;

        };

        /**
         * Unsets/Deletes a range of elements in the Iterator
         * @param {Array} arr An array containing the start-range as its first index and its end range as its second index
         * @name TigerJS.Iterator#unset_r
         * @type TigerJS.Iterator
         * @function
         */

        this.obj.unset_r = function (arr) {
            if (this.is_empty())
                return this;
            var c = (arr[1] - arr[0]) + 1; //get the range size

            while (c) {
                this.unset(arr[0]); //unset the topmost element, the internal pointer, automatically
                //points to the next element
                c = c - 1; //keep decreasing the range size till its zero

            }
            return this;
        };

        /**
         * Unsets/Deletes a range of elements in the Iterator, only  if elements in the range validate against a predicate
         * @param {Array} arr An array containing the start-range as its first index and its end range as its second index
         * @param {Function} pred A function to test each member in the range to be unset, only elements that return a truth value are unset
         * @name TigerJS.Iterator#unset_r_if
         * @type TigerJS.Iterator
         * @function
         */

        this.obj.unset_r_if = function (arr, pred) {
            if (this.is_empty())
                return this;
            var _t = this.clone();
            _t.key = arr[0];
            do {

                if (pred(_t.current())) {
                    delete _t[_t.key]; //undefine un-needed indexes
                }

            } while (_t.next() && _t.key <= arr[1]);
            return this.empty().add_all();
        };


        /**
         *  Deletes an offset/index in the Iterator, if it satisfies a predicate
         * @param {Number} x The offset to delete.
         * @param {Funcion} pred A function to test the element at offet 'x
         * @name TigerJS.Iterator#unset_if
         * @function
         * @type TigerJS.Iterator
         */


        this.obj.unset_if = function (x, pred) {
            if (this.is_empty())
                return this;
            if (pred(x)) {
                this.splice(x, 1);
            }
            return this;
        };

        /**
         * Compares the elements of this Iterator that of another collection object, and returns true if each
         * element  by element comparison are equal, both objects being compared must be of equal length.
         * @param {Object | Array | String | HTMLCollection | nodeList | TigerJS.Iterator} el A collection to compare against
         * @function
         * @type Boolean
         * @param {Number} [start_index] An optional number denoting the offset where conparisn should start from
         * @name TigerJS.Iterator#equal
         */

        this.obj.equal = function (el, start_index) {
            var v;
            if (this.size() !== (v = T.Iterator(el)).size())
                return false; //make sure both are of the same length

            var _key = this.key;
            this.key = start_index || 0;
            do {
                if (this.current() !== v[this.key])
                    return false;
            } while (this.next());
            this.key = _key;
            return true;
        };

        /**
         * Swap elements or a range of two Iterators, Iterators should be off the same size
         * @param {TigerJS.Iterator} itr An Iterator to swap elements with
         * @param {Array} [r] An array containing the ranges as numbers to swap, Array can contain just one element, inwhich case, swapping
         will take place from that offset to the end of the Iterator, or two elements, whereby swapping is done
         within the range specified by the array, start end ranges can be equal, whereby only one element is swapped
         * @function
         * @name TigerJS.Iterator#swap
         * @type TigerJS.Iterator
         * @example
         itr_a = T.Iterator([0,1,2,3,4,5]);
         itr_b = T.Iterator([10,11,12,13,14,15]);
         
         itr_b.swap(a);
         
         //yeilds, if you inspect the elements
         T.dump(itr_b.to_array());         ==> 0,1,2,3,4,5
         and
         T.dump(itr_a.to_array());         ==> 10,11,12,13,14,15
         
         *
         */
        //todo, iterators dont have to be equal size, ..then swap up to the shorter length
        this.obj.swap = function (itr, r) {

            var clone1 = this.clone(),
                    clone2 = itr.clone();
            if (!r) {
                itr.empty();
                itr.merge(clone1);
                this.empty();
                this.merge(clone2);
            } else {

                var itr_ = itr.clone();
                r[1] = !r[1] ? this.size() : r[1]; //if we only have a start offset, set the end offset to Iterator size, so we swap till end

                for (var i = r[0]; i <= r[1]; i++) {

                    itr[i] = this[i]; //swap elements at range  this[ r[0] , r[1]  ] with argument itr[ r[0], r[1]  ]
                    this[i] = itr_[i];
                }
            }
            return this;
        };

        /**
         * This method returns the position in the ordered range Iterator[first, last] where 'value' could be inserted without
         * violating the ordering. It expects the Iterator to contain only numerical elements, though this is not a strict requirement,
         * The iterator pointer position is not affected
         * @param {Number} value Value to check for its lowest posssible position within the Iterator
         * @param {Boolean} sort Whether to sort the numeric values in the iterator, before computing
         *  note this,
         * implicitly resets the the iterators key
         * @function
         * @type Number
         * @name TigerJS.Iterator#ipos
         */
        //todo verify
        this.obj.ipos = function (value, sort) {
            var key = this.key;
            if (sort) {
                this.sort(function (a, b) {
                    return a - b;
                });
                key = 0; //reset pointer on sort
            }
            do {
                if (T.is_number(this.current()) && this.current() >= value - 1) {

                    return this.last_index_of(this.current()) + 1;
                }

            } while (this.next());
            this.key = key;
            return this;
        };

        /**
         * Computes the sum of all Numeric values in the Iterator, returning the sum or Not A Number 'NaN', if there are no numbers to add
         * @type Number | NaN
         * @name TigerJS.Iterator#sum
         * @function
         */
        this.obj.sum = function () {
            if (this.is_empty())
                return Number.NaN;
            var re = 0,
                    _key = this.key,
                    nc = true;
            this.key = 0;
            do {
                if (T.is_number(this.current())) {
                    re += this.current();
                    nc = false;
                }

            } while (this.next());
            this.key = _key;
            return nc ? Number.NaN : re;
        };

        /**
         * Computes the product of all Numeric values in the Iterator,
         * returning the product or Not A Number 'NaN', if there are no numbers
         * to multiply
         * @type Number | NaN
         * @name TigerJS.Iterator#product
         * @function
         */
        this.obj.product = function () {
            if (this.is_empty())
                return Number.NaN;
            var re = 1,
                    _key = this.key,
                    nc = true;
            this.key = 0;
            do {
                if (T.is_number(this.current())) {
                    re *= this.current();
                    nc = false;
                }

            } while (this.next());
            this.key = _key;
            return nc ? Number.NaN : re;
        };
        /**
         * @ignore
         */
        this.obj.__to_string = function () {
            return "[object TigerJS.Iterator]";
        };

    };

    return (new f()).obj; //return the enhanced array object
};
