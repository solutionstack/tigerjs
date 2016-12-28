/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

/**
 *
 *
 *  @class class {@link TigerJS.Map}.  This class provides functionalities of a Map data
 *  structure. An object that maps keys to values. A map cannot contain duplicate keys;
 *  each key can map to at most one value.
 *
 * @class
 
 */

TigerJS.Map = function ()
{
    /**
     * @ignore
     */
    var f = function () {
        this._map = [];
        /**
         * Put a key value pair into this map
         * @param {String | Integer} k A string or integer value to be used as an index in this map
         * @param {Mixed} v Any value to be associated with a key
         * @return [Boolean] returns true if key was succesfully inserted into map, else returns false if the key is not
         * of the required type or it already exist
         */

        this.put = function (k, v)
        {
            if (!(T.isString(k) || T.isNumber(k)))
            {

                return false;
            }
            if (this.containsKey(k))
            {
                return false; //already in map
            }

            this._map[this._map.length] = []; //a new index for this key-value
            this._map[this._map.length - 1][0] = k;
            this._map[this._map.length - 1][1] = v;
            return true;
        };
        /**
         * If this map contains a key
         * @param {String | Integer} k key to search for
         * @return [Boolean] True or false
         */
        this.containsKey = function (k)
        {

            for (var i = 0; i < this._map.length; i++)
            {
                if (this._map[i][0] === k)
                {
                    return true; //key found
                }
            }

            return false;
        };

        /**
         * If this map contains a value
         * @param {Mixed} v Value to search for
         * @return [Boolean] True or false
         */
        this.containsValue = function (v)
        {

            for (var i = 0; i < this._map.length; i++)
            {

                if (this._map[i][1] === v)
                {
                    return true; //val found
                }
            }

            return false;
        };

        /**
         * Get a value by key
         * @param {String | Number} k key for value to retrieve
         * @return {Mixed} Returns the value associated with this key or false if the key doesnt exist
         */

        this.get = function (k)
        {
            if (!this.containsKey(k))
            {
                return false;
            }

            for (var i = 0; i < this._map.length; i++)
            {

                if (this._map[i][0] === k)
                {

                    return this._map[i][1];
                } //key found
            }
            return false;
        };

        /**
         * Returns the keys of this map as a native array
         * @type Array
         */
        this.keys = function ()
        {
            var r = [];
            for (var i = 0; i < this._map.length; i++)
            {

                r[r.length] = this._map[i][0];
            }


            return r;
        };
//#TODO key_set returns the keys as a set veiw

        /**
         * Returns the values of this map as a native array
         * @type Array
         */
        this.values = function ()
        {
            var r = [];
            for (var i = 0; i < this._map.length; i++)
            {

                r[r.length] = this._map[i][1];
            }

            return r;
        };
        /**
         * Returns the number of key-vlue mappings in this map
         */
        this.size = function ()
        {
            var _c = 0;
            for (var i in this._map)
            {
                ++_c;
            }

            return _c;
        };

        /**
         * Empty the map
         *
         */
        this.clear = function ()
        {
            this._map = [];
        };


//#TODO value set returns the values as a set veiw


        /**
         * Removes a key value pair from the map
         * @param k {string}- a key to remove with its associated value
         * @return [Boolean] returns true on success or false, if the key is non existent
         */

        this.remove = function (k)
        {
            if (!this.containsKey(k))
            {
                return false;
            }
            for (var i = 0; i < this._map.length; i++)
            {

                if (this._map[i][0] === k)
                {

                    delete this._map[i];
                }
            }
            var temparray = [];
            for (i = 0; i < this._map.length; i++)
            {
                if (this._map[i])  //make a copy of this.map, skipping the deleted index
                {
                    temparray[temparray.length] = this._map[i];
                }

            }
            this._map = temparray;
            return true;
        };

        /**
         * Replace a given value in a map at an index specified by a key
         * @param {Key} k
         * @param {Mixed} v Mixed value to replace value at key index
         * @return [Boolean] true on success or false if the key was not found
         */
        this.replace = function (k, v)
        {
            if (!this.containsKey(k))
            {
                return false;
            }
            for (var i = 0; i < this._map.length; i++)
            {

                if (this._map[i][0] === k)
                {

                    this._map[i][1] = v;
                }
            }




            return true;
        };

        /**
         * Replace a given value in a map only if it matches an argument
         * @param {string} k key to search for
         * @param {Mixed} ov Old value that must be matched.
         * @param {Mixed} v Mixed value to replace matched value at key index
         * @return [Boolean] true on success or false if the key was not found, or if the value doesnt match
         */

        this.replaceIfValue = function (k, ov, v)
        {

            if (!this.containsKey(k))
            {
                return false;
            }

            for (var i = 0; i < this._map.length; i++)
            {

                if (this._map[i][0] === k)
                {

                    if (this._map[i][1] !== ov)
                    {
                        return false;
                    }

                    this._map[i][1] = v;
                    return true;
                }
            }

            return false;
        };

        /**
         * Returns an instance of T.Iterator containing the keys of this map
         *
         */
        this.keySet = function ()
        {

            return (T.Iterator(this.keys()));
        };

        /**
         * Returns an instance of {@link TigerJS.Iterator} containing the values of this map
         * @type TigerJS.Iterator
         */
        this.valueSet = function ()
        {
            return (T.Iterator(this.values()));
        };

        /**
         * @ignore
         */
        this.__toString = function ()
        {
            return "[object TigerJS.Map]";
        };
    };
    /**
     * @ignore
     */


    return  new f();
};
