/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

////////////////////////////STRING /////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @namespace
 */
//just for the docs
String = function ()
{
    return String;
}();
/**
 * Add backslahes to single and double quote characters, this function return a new string
 * @example
 *    var str = "Your name is O'reilly";
 *    var q_str  = str.escQuote(); //returns "Your name is O\'reilly";
 * @return {String} The Quoted string
 *
 */

String.prototype.escQuote = function ()
{

    return this.replace(/\'/g, "\\'").replace(/\"/g, '\\"');
};
/**
 * Truncates a string to the given length and appends a suffix to it
 * This method doesnot modify strings which are shorter than the specified length.
 If unspecified, the length parameter defaults to 20 and the suffix to "...".
 *
 * @param {Number} [length = 20] Length of the final string including
 *        suffix
 * @param {String} [suffix = ...] The sufix to use
 * @return {String} Returns the truncated string.
 */

String.prototype.truncate = function (length, suffix)
{

    var maxLength = length ? length : 20,
            suffix_str = suffix || "...",
            t = this.toString();
    if (maxLength < 1)
        return "";
    if (maxLength <= this.length)
    {
        t = this.toString().substring(0, maxLength).insert_ch(suffix_str);
    }

    return t;
};
/**
 * Remove backslahes added by escQuote
 * @example
 *    var str = "Your name is O\'reilly";
 *    var q_str  = str.unEscQuote(); //returns "Your name is O'reilly";
 * @return {String} The Quoted string
 *
 */

String.prototype.unEscQuote = function ()
{

    return this.replace(/\\'/g, "\'").replace(/\\"/g, '\"');
};
/**
 * Split a string by string, returning a array of strings, each of which is a substring of the input string,
 * formed by splitting it on its boundaries formed by the string delimiter. This method already exists as the native ecma split method,
 * however it differs in how it handles the limit argument, favouring a more PHP approach by putting the rest of the string in the last 
 * index once we reach the allowed limits 
 * @param {string} del The character delimiter, can be any character
 * @param {Number} [lim] If limit is set and the returned array will contain a maximum of
 * limit indexes with the last index containing the rest of string.
 * @return {Array} Returns an array of string s created by splitting the string parameter on
 *                   boundaries formed by the delimiter.
 *
 */


String.prototype.explode = function (del, lim)
{

    var c = 0,
            r = [],
            s = this; // c is the cuurent position in the string
    while (c < s.length)
    {

        for (var i = c; i < s.length; i++)
        {


            if (lim && r.length === lim - 1)
            { //if we have reached the limit of the array just append the
                if (c < s.length - 1)

                { //remaining string and return the array
                    r[r.length] = s.substring(c);
                    return r;
                }
            }

            //check for the delimiter being the last char
            if (s.charAt(i) === del && i === s.length - 1)
            { //ok. so we're using chartAt to solve issues for IE
                //unable to access strings using square brackets
                r[r.length] = s.substring(c, i);
                return r;
            }
            //check for the delimiter being the first char
            if (s.charAt(i) === del && i === 0)
            {
                c++; //move off the delimeter and re-loop
                continue;
            }

            if (s.charAt(i) === del && i !== s.length - 1)
            { //if we have reached a delimeter and we'renot at the end,
                // extract from the last 'c' point, upto but not including the
                // delimeter offset
                r[r.length] = s.substring(c, i);
                c = i + 1; //increment the current point to a char past this delimeter, so we search further
                //on the string
            }

            if (i === s.length - 1)
            { //end of string and no other delimeter, extract whats left..

                r[r.length] = s.substring(c, s.length);
                return r;
            }
        }
    }
    return r;
};
/**
 * Join elements of an array or collection object, seperating them with a string
 * @param {string} del The delimeter to seperate the return string
 * @param {Array} e Array or Collection Object
 * @example
 *     s = ["ser","tre","typ",hgf","hhy"];
 *
 *      s.implode("-", s);
 *  print(s)
 *    //--would give
 *                   ser-tre-typ-hgf-hhy
 *
 *
 * @return {String} The joined string
 */

String.prototype.implode = function (del, e)
{
    var s = "",
            r = e;
    for (var i in e)
    {

        (parseInt(i) === (r.length - 1)) ? s += r[i] : s += r[i] + del;
    }

    return s;
};
/**
 *
 * Counts the number of occurrences of every byte-value (0..255) This function is case sensitive i.e. E != e,
 * so aEeiou, would return 1 value for 'E' and 1 value for 'e', instead of two E's.<p/> All white-space characters
 * \n \t \r would all map to " " in the result, although they still retain their original byte values
 * @param {String} s the string to count its characters, defaults to the internal string
 * @return  {Array} A multidimensional array containing in which each index contains an array where [i][0] are charcters
 *                  and [i][1] are frequencies.
 * @example
 *
 *        var str = " aA e iou zz' : ooo) ppp PQW";
 *        r = str.count_ch();
 *
 *       for(var i=0; i< r.length; i++){
 *
 *
 *           document.write("There are "+ r[i][1] +"  instance(s) of \"" +r[i][0]+"\"<br/>")
 *   }
 * ///would yeild
 *                  There are 8 instance(s) of " "
 *                  There are 1 instance(s) of "a"
 *                  There are 1 instance(s) of "A"
 *                  There are 1 instance(s) of "e"
 *                  There are 1 instance(s) of "i"
 *                  There are 4 instance(s) of "o"
 *                  There are 2 instance(s) of "z"
 *                  There are 1 instance(s) of "'"
 *                  There are 1 instance(s) of ":"
 *                  There are 1 instance(s) of ")"
 *                  There are 3 instance(s) of "p"
 *                  There are 1 instance(s) of "P"
 *                  There are 1 instance(s) of "Q"
 *                  There are 1 instance(s) of "W"
 *                  @TODO EXPAND THE CODE-POINTS HANDLED BY THIS FUNCTION
 */

String.prototype.count_ch = function (s)
{
    s = s || this;
    var _l = T.Iterator(s), //put all chars in a list
            //use an instance of TigerJS.Map  to map each character in the string to its frequency
            _m = T.Map(),
            i;
    do {

        if (_m.containsKey(_l.current()))
        {

            _m.replace(_l.current(), _m.at(_l.current()) + 1); //if the character is already in the map increase its frequency

        } else
        {

            _m.put(_l.current(), 1); //else, put a character in the map with frequency 1 (i.e. first match)
        }

    } while (_l.next())

    var chr = _m.keys(),
            f = _m.values(),
            r = [];
    //create the result array

    for (i = 0; i < f.length; i++)
    {

        r[r.length] = [chr[i], f[i]];
    }

    return r; //#FIXME - optimize ME!!
};
/**
 * Replaces every occurences of the 'serach' argument in 'subject with the given 'replace' value
 *
 * @param {String | Array} se String or array of strings to search for
 * @param {String | Arrray} [su = this] String or Array to perform the search on, if not given, defaults to the calling string, pass null in this case
 * @param {String | Array} re Replaement values to use for matched searches, if 'replace' is an array, it
 should strictly be the same length as 'search' which should be given as an array, so that
 each index of 'search' that is matched in subject, would be replaced by the equivalent
 index in replace, also if repated values are found in 'search' or 'replace' ,when
 given as arrays, only the first of such value(s) is used
 * @param {Boolean} [case] If given and true true, the search will be case-sensitive, defaults to case-insensitive
 * @param {Boolean} [case] If given and true, the search will be case-sensitive, defaults to case-insensitive
 * @return {String | Array} The result of the replacement as a srting or an array if subject was an array.
 * @example
 *
 * //1-serach and replace are strings subject is an array, case is insensitive
 * v = ''.str_replace( "tt",[ "foofoo batt cow 12 12 Tatao tt tT","tT tt 12 13"] , "11");
 * document.write(v);
 *  ------------yeilds:::
 *          v[0] = [ "foofoo ba11 cow 12 12 Tatao 11 11"]
 *           v[1] =  ["11 11 12 13"]
 *
 *
 * //2-serach and replace are strings subject is an array, case is sensitive
 * v = ''.str_replace( "tt",[ "foofoo batt cow 12 12 Tatao tt tT","tT tt 12 13"] , "11", true);
 * document.write(v);
 *  ------------yeilds:::
 *          v[0] = [ "foofoo ba11 cow 12 12 Tatao 11 tT"]
 *          v[1] =  ["tT 11 12  13"]
 *
 * //serach and replace are arrays subject is an array, case is insensitive
 * v = ''.str_replace( ["tt","12"],[ "foofoo batt cow 12 12 Tatao tt tT","tT tt 12 13"] , ["11","xx"]);
 * document.write(v);
 *  ------------yeilds:::
 *          v[0] = [ "foofoo ba11 cow xx xx Tatao 11 11"]
 v[1] =  ["11 11 xx 13"]
 
 * //serach and replace are arrays, subject is a string, case is sensitive
 * v = ''.str_replace( ["tt","12"], "foofoo batt cow 12 12 Tatao tt tT tT tt 12 13" , ["11","xx"], true);
 * document.write(v);
 *  ------------yeilds:::
 *
 *                v = "foofoo ba11 cow xx xx Tatao 11 tT tT 11 xx 13" ;//note tT is not replaced, due to case-sensitivity
 
 */

String.prototype.str_replace = function (se, su, re, st)
{ //search, subject, replace, strict
    var r, _v, _t, i;
    su = su || this; //result ;


    ///CASE :1 //////////////////////////////////////////////////////////////////////////
    //   both serach and replace are strings , subject could be either ,do a raw replace
    if (T.is_string(se) && T.is_string(re))
    {
        if (T.is_array(su))
        {

            //subject is an array others are strings
            var c = 0;
            _t = new T.Iterator(su);
            do {

                if (!st)
                {
                    _v = _t.current().replace(new RegExp(se, "gi"), re);
                    _t.set(c, _v);
                } else
                {
                    _v = _t.current().replace(new RegExp(se, "g"), re);
                    _t.set(c, _v);
                }
                c++;
            } while (_t.next())
            r = _t.to_array();
        } else
        {

            if (!st)
            { //subject is not an array and se and re are strings
                r = su.replace(new RegExp(se, "gi"), re);
            } else
            {
                r = su.replace(new RegExp(se, "g"), re);
            }
        }
    }
    //END CASE 1////////////////////////////////////////////////////////////////////

    //CASE :2 ///////////////////////////////////////////////////////////////////////
    // serach is an array but  replace is string  , subject could be either, use each of serach's index to test for a match
    //
    if (T.is_array(se) && T.is_string(re))
    {

        if (T.is_array(su))
        { //1st case subject is array


            _t = T.Iterator(su);
            do {

                for (i = 0; i < se.length; i++)
                {


                    if (!st)
                    {
                        _v = _t.current().replace(new RegExp(se[i], "gi"), re);
                        _t.set(_t.key, _v);
                    } else
                    {
                        _v = _t.current().replace(new RegExp(se[i], "g"), re);
                        _t.set(_t.key, _v);
                    }

                }
            } while (_t.next())
            r = _t.to_array();
        } //..
        else
        { //su is not array

            for (i = 0; i < se.length; i++)
            {


                if (!st)
                {
                    r = i > 0 ? r.replace(new RegExp(se[i], "gi"), re) : su.replace(new RegExp(se[i], "gi"), re);



                } else
                {
                    r = i > 0 ? r.replace(new RegExp(se[i], "g"), re) : su.replace(new RegExp(se[i], "g"), re);
                }

            }

        }

    }
    //END CASE 2//////////////////////////////////////////////////////////////////////////////

    //CASE :3 //////////////////////////////////////////////////////////////////////////////////////
    //serach and replace are both arrays of equal length (should be, if this is to work right)

    if (T.is_array(se) && T.is_array(re))
    {
        if (T.is_array(su))
        {

            //subject is an array others are arrays

            _t = T.Iterator(su);
            do {

                for (i = 0; i < se.length; i++)
                {


                    if (!st)
                    {
                        _v = _t.current().
                                replace(new RegExp(se[i], "gi"), re[i]);
                        _t.set(_t.key, _v);
                    } else
                    {
                        _v = _t.current().
                                replace(new RegExp(se[i], "g"), re[i]);
                        _t.set(_t.key, _v);
                    }

                }
            } while (_t.next())
            r = _t.to_array();
        } //..
        else
        { //subject is not array

            for (i = 0; i < se.length; i++)
            {


                if (!st)
                { //subject is not an array and se and re are strings
                    r = i > 0 ? r.replace(new RegExp(se[i], "gi"), re[i]) : su.replace(new RegExp(se[i], "gi"), re[i]);



                } else
                {
                    r = i > 0 ? r.replace(new RegExp(se[i], "g"), re[i]) : su.replace(new RegExp(se[i], "g"), re[i]);
                }

            }

        }

    }



    ///END CASE 3//////////////////////////////////////////////////////////////////////////////////////
    return r; // 2.5hrs to get this right..phew!!

};
/**
 * Manipulate the case of a string
 * @param {string} flag Any of the following flags
 *    -uf --> make the first character uppercase
 *    -ul --> make the last character uppercase
 *    -ufl --> make the first character uppercase, others lower case
 *    -ull --> make the last character uppercase, others lower case
 *    -lf --> make the first character lowercase
 *    -ll --> make the last character lowercase
 *    -tol --> all characters to lower case
 *    -tou -->  all characters to uppercase
 *    -toux --> upper case the first character of each word
 *    -tolx --> lower case the first character of each word
 *    -cm   --> (camelize) change string to camel case, (expects ur string 2 be dasherized)
 *    -d    --> (dasherize) converts all uppercase characters, to lower and puts an underscore before the charater
 * @return {String} the converted string.
 */

String.prototype.to_case = function (flag)
{

    var str_ = this.toString(),
            _t, i;
    switch (flag)
    {

        case '-d':
            var l = T.Iterator(str_).forward_iterator(function (x)
            {

                if (x.toLowerCase() !== x)
                {
                    this[this.key] = x.toLowerCase();
                    this.insert_at("-", this.key);
                }

            });
            return l.join("");
            break;
        case '-cm':

            var str = str_.split('-'),
                    cml;
            cml = str[0];
            for (i = 1; i < str.length; i++)
                cml += str[i].charAt(0).toUpperCase() + str[i].substring(1);
            return cml;
            break;
            //first char in string to upper case
        case '-uf':
            _t.set(0, str_.charAt(0).toUpperCase());
            return _t.join("");
            break;
            //first char in string to upper case, other characters to lower case
        case '-ufl':
            _t = T.Iterator(str_).forward_iterator(function (x)
            {

                this[this.key] = x.toLowerCase();
            });
            _t.set(0, str_.charAt(0).toUpperCase());
            return _t.join("");
            break;
            //last char in string to upper case
        case '-ul':
            _t = T.Iterator(str_);
            _t.set(_t.size() - 1, str_.charAt(_t.size() - 1).toUpperCase());
            return _t.join("");
            break;
            //last char in string to upper case, other characters to lower case
        case '-ull':
            _t = T.Iterator(str_).forward_iterator(function (x)
            {

                this[this.key] = x.toLowerCase();
            });
            _t.set(_t.size() - 1, str_.charAt(_t.size() - 1).toUpperCase());
            return _t.join("");
            break;
            //first char in string to lower case
        case '-lf':
            _t = T.Iterator(str_);
            _t.set(0, str_.charAt(0).toLowerCase());
            return _t.join("");
            break;
            //last char in string to lower case
        case '-ll':
            _t = T.Iterator(str_);
            _t.set(_t.size() - 1, str_.charAt(_t.size() - 1).toLowerCase());
            return _t.join("");
            break;
            //all chars in string to lower case
        case '-tol':
            return str_.toLowerCase();
            break;
            //all chars in string to upper case
        case '-tou':
            return str_.toUpperCase();
            break;
            //First char of each word to lower case
        case '-tolx':
            _t = T.Iterator(str_);
            _t.set(0, str_.charAt(0).toLowerCase());
            for (i = 0; i < str_.length; i++)
            { //gat to use these native loops to support IE


                try
                {
                    if (str_.charAt(i - 1) === " " || str_.charAt(i - 1) === "\n" || str_.charAt(i - 1) === "\t" || str_.charAt(i - 1) === "\r")
                    {
                        _t.set(i, str_.charAt(i).toLowerCase());
                    }

                } catch (e)
                {
                }

            }
            return _t.join("");
            break;
            //First char of each word to upper case
        case '-toux':
            _t = T.Iterator(str_);
            _t.set(0, str_.charAt(0).toUpperCase());
            for (i = 0; i < str_.length; i++)
            { //gat to use these native loops to support IE


                try
                {
                    if (str_.charAt(i - 1) === " " || str_.charAt(i - 1) === "\n" || str_.charAt(i - 1) === "\t" || str_.charAt(i - 1) === "\r")
                    {
                        _t.set(i, str_.charAt(i).toUpperCase());
                    }

                } catch (e)
                {
                }

            }
            return _t.join("");
            break;
    }
};
//#FIXME - optimize ME!!

/** Returns a version of str with a backslash character (\) before every character that is among these:
 * . \ + * ? [ ^ ] ( $ ) / , this could be useful in-cases whereby these characters need to be matched in reg-exeps
 * or used in URL's
 * @param {String} str The String to be quoted, defaults to the calling string!!!
 * @return {String} The Result..!!!
 */

String.prototype.quotemeta = function (str)
{
    var str_ = str || this;
    return (str_.replace("", "").replace("\\", new String("\\" + "\u005c")).
            replace(/(\+)/g, "\\+").replace(/(\?)/g, "\\?").
            replace(/(\[)/g, "\\[").replace(/(\^)/g, "\\^").
            replace(/(\( )/g, "\\(").replace(/(\$)/g, "\\$").
            replace(/(\))/g, "\\)").replace(/(\*)/g, "\\*").
            replace(/(\])/g, "\\]").replace(/(\/)/g, "\\/").
            replace(/(\.)/g, "\\."));
};


/*@private
 *  HTML-related entities conversion, cant use full Entities like in PHP
 *  >>>TODO OK maybe WE_CAN
 */
TigerJS.jx_html_table = {//s
    " ": "&nbsp;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&#039;"
            //TODO , ADD UNICODE-CODE POINTS mapping FOR COMPLETE UTF-8, ISO-88591, 8859-2 compatibility

};


/**
 *
 * Certain characters have special significance in HTML, and should be represented by HTML entities if
 * they are to preserve their meanings. This function returns a string with some of these conversions made;
 * @param {String} str The string being converted, if not given the calling string is used
 * @return {String} The convertd String.
 */

//PHP copy cat
String.prototype.html_chars = function (str)
{
    var _h = T.jx_html_table,
            str_ = str || this,
            i;
    var set = T.Iterator(str_);
    for (i in _h)
    {
        set.rewind();
        do {
            if (i === set.current())
            {

                set.set(set.indexOf(i), _h[i]);
            }

        } while (set.next() === true)

    }

    return set.join(""); //return the string
};


/**
 * This functions returns the input string padded on the left, the right, or both sides to the specified
 * padding length. If the optional argument pad_string is not supplied, the input is padded with spaces,
 * otherwise it is padded with characters from pad_string up to the limit.
 * @param {Number} pad_length Pad length, should be greater than zero
 * @param {String} pad_str    String to pad the input with.
 * @param {String] [pad_type = STR_PAD_LEFT} argument pad_type can be STR_PAD_RIGHT, STR_PAD_LEFT, or STR_PAD_BOTH.
 *                                   .
 * @return {String} The padded String
 */

String.prototype.str_pad = function (pad_length, pad_str, pad_type)
{

    var str_ = T.Iterator(this),
            l = pad_length,
            p = pad_str || " ",
            t = pad_type || "STR_PAD_LEFT",
            i; //default padding

    switch (t)
    {

        case 'STR_PAD_LEFT':
            for (i = 0; i < l; i++)
            {

                str_.add(p, true);
            }
            break;
        case 'STR_PAD_RIGHT':
            for (i = 0; i < l; i++)
            {
                str_.push(p);
            }
            break;
        case 'STR_PAD_BOTH':
            for (i = 0; i < l; i++)
            {
                str_.add(p, true);
            }

            for (i = 0; i < l; i++)
            {
                str_.push(p);
            }

            break;
    }

    return str_.join("");
};



/**
 *Returns input repeated multiplier times.
 *@param {Number} n Number of times to repeat
 * @return {String} The result !!!...
 */

String.prototype.str_repeat = function (n)
{
    var _stemp = "",
            i;
    for (i = 0; i < n; i++)
    {

        _stemp += this;
    }

    return _stemp;
};


T._alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
T._alphaB = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
/**
 * Performs a character rotaional  encoding on the str argument and returns the resulting string.
 * The rotX function simply shifts every letter by X  places in the alphabet while leaving non-alpha
 * characters untouched, encoding and decoding is done by the same function,
 * @param {Number} [X=13] The number of places to shift characters ( between 13-24), defaults to 13
 * @return {String} The resulting string
 * @comment Yeah, i know this could be done in a more simpler (Sensible!!) way, but what da heck :>
 */


String.prototype.rotX = function (X)
{
    var str = T.Iterator(this.toString()),
            x = X || 13,
            alphaS = T.Iterator(T._alpha),
            alphaB = T.Iterator(T._alphaB);
    do {

        var c = str.current(),
                a_getB = null,
                a_getS = null;
        //deal with upper case
        if (alphaB.contains(c))
        {

            if (alphaB.indexOf(c) + x > alphaB.size() - 1)
            {

                if ((x - alphaB.indexOf(c)) >= 0)
                {
                    a_getB = (x - alphaB.indexOf(c));
                } else if ((x - alphaB.indexOf(c)) < 0)
                {
                    a_getB = (x - alphaB.indexOf(c)) * (-1);
                }
            } else
            {

                a_getB = alphaB.indexOf(c) + x;
            }
        }

        //deal with lower case
        if (alphaS.contains(c))
        {

            if (alphaS.indexOf(c) + x > alphaS.size() - 1)
            {

                if ((x - alphaS.indexOf(c)) >= 0)
                {
                    a_getS = (x - alphaS.indexOf(c));
                } else if ((x - alphaS.indexOf(c)) < 0)
                {
                    a_getS = (x - alphaS.indexOf(c)) * (-1);
                }
            } else
            {

                a_getS = alphaS.indexOf(c) + x;
            }
        }


        if (a_getB === 0 || a_getB)
        { //ok.. 0 evaluates to false so have to be strict ===, the other a_getB
            // would evaluate to true for 1 and above but false for 0

            str.set(str.key, alphaB.at(a_getB));
        }
        if (a_getS || a_getS === 0)
        {

            str.set(str.key, alphaS.at(a_getS));
        }


    } while (str.next())


    return str.join("");
};
/**
 *
 * Returns the numeric-index position of the first occurrence of needle in the string, indexing starts from zero
 * This method is case- sensitive
 * @param {string} needle What to search for
 * @param {Number} offset A positive index to start the search from, the return value would be relative to this offset
 *                 unlike the native indexOf, which even if an offset is given the return val would still be relative
 *                 to the start of the string .
 *
 * @return {Number} The p   osition, if found as an integer or -1
 */

String.prototype.strpos = function (needle, offset)
{


    return offset ? this.substring(offset).
            indexOf(needle) : this.indexOf(needle);
};
/**
 * Returns a boolean, indicating whether or not the object string
 * starts with the specified substring.
 * @param {String} substring the string to search for.
 * <br/>
 * The method is case-sensitive
 *  * <br/> adapted from <a href='http://www.prototypejs.org/'> prototype framework</a>
 
 */
String.prototype.startsWith = function (substring)
{
    return this.last_index_of(substring, 0) === 0;
};

/**
 * Returns a boolean, indicating whether or not the object string
 * ends with the specified substring.
 * @param {String} substring the string to search for.
 * <br/>
 * The method is case-sensitive
 * <br/> adapted from <a href='http://www.prototypejs.org/'> prototype framework</a>
 */
String.prototype.ends_with = function (substring)
{
    var d = this.length - substring.length;
    return d >= 0 && this.indexOf(substring, d) === d;
};

/**
 *
 * Case insensitive version of {@link String.strpos}
 * @param {string} needle What to search for
 * @param {Number} offset A positive index to start the search from, the return value would be relative to this offset
 *                 unlike the native indexOf, which even if an offset is given the return val would still be relative
 *                 to the start of the string .
 *                 @return {Number} The position, if found as an integer or -1
 */

String.prototype.stripos = function (needle, offset)
{
    var r, re = new RegExp(needle, "gi"),
            ar = offset ? re.exec(this.substring(offset)) : re.exec(this);
    return ar ? ar.index : -1;
};

/**
 *
 * Returns the numeric position of the last occurrence of needle in the string
 * This method is case- sensitive
 * @param {string} needle What to search for
 * @param {Number} offset A positive index to start the search from, the return value would be relative to this offset
 *                 unlike the native indexOf, which even if an offset is given the return val would still be relative
 *                 to the start of the string
 *
 * @return {Number} The position, if found as an integer or -1
 */

String.prototype.strrpos = function (needle, offset)
{


    return offset ? this.substring(offset).
            lastIndexOf(needle) : this.lastIndexOf(needle);

};

/**
 *
 * Case insensitive version of {@link String.strrpos}
 * @param {string} needle What to search for
 * @param {Number} offset A positive index to start the search from, the return value would be relative to this offset
 *                 unlike the native indexOf, which even if an offset is given the return val would still be relative
 *                 to the start of the string
 *                 @return {Number} The position, if found as an integer or -1
 */

String.prototype.strripos = function (needle, offset)
{
    var r, re = new RegExp(needle, "gi"),
            ar, pos;
    //we need to get the last match so call exec iteratively, until it returns null then  use the last value
    do {
        ar = offset ? re.exec(this.substring(offset)) : re.exec(this);
        if (ar)
        {
            pos = ar.index;
        } //last match position


    } while (ar)

    return pos || pos === 0 ? pos : -1;
};

/**
 * Returns part of string string from the first occurrence of needle to the end, or begining of String.
 * This method is case- sensitive
 * @param {string} needle The search string
 * @param {Boolean} b4needle if true returns part of the string before the needle was found, i.e. to the begining of
 *                           string.
 * @return {String | Boolean} Returns the portion of string, or FALSE if needle is not found.
 *
 */

String.prototype.strstr = function (needle, b4needle)
{

    var pos = this.strpos(needle);
    if (b4needle && pos > -1)
    {

        return this.substring(0, pos);
    }

    if (!b4needle && pos > -1)
    {

        return this.substring(pos, this.length);
    }

    return false;
};

/**
 * Case insensitive version of {@link String.strstr}
 * @param {string} needle The search string
 * @param {Boolean} b4needle if true returns part of the string before the needle was found, i.e. to the begining of
 *                           string.
 * @return {String | Boolean} Returns the portion of string, or FALSE if needle is not found.
 */
String.prototype.stristr = function (needle, b4needle)
{
    var pos = this.stripos(needle);
    if (b4needle && pos > -1)
    {

        return this.substring(0, pos);
    }

    if (!b4needle && pos > -1)
    {

        return this.substring(pos, this.length);
    }

    return false;
};

/**
 * substr_count() returns the number of times the needle substring occurs in the string.
 *
 * @param {string} needle  The search string
 * @param {Boolean} nocase If true, executes a case in-sensitive search, defaults to case-sensitive
 * @return {Number} The number of matches of the substring, 0 denotes no match
 */


String.prototype.substr_count = function (needle, nocase)
{

    var re = nocase ? new RegExp(needle, "gi") : new RegExp(needle, "g"),
            m = false,
            n = 0;
    do {
        m = re.test(this);
        if (m)
            n++; //last match position


    } while (m)

    return n;
};


/**
 * Strip whitespace characters from the beginning and(or) end of a string and returns a new string
 * White space matching is equivalent to [ \f\n\r\t\u00A0\u2028\u2029].
 * @param {String} [where = BOTH] Where to strip white-spaces, use BEGIN, END or BOTH, to denote stripping white-spaces
 *                         from the begining, end, or from both sides of the string, defaults to BOTH
 * @return {String} The stripped string.
 */

String.prototype.trim = function (where)
{

    var str = T.Iterator(this),
            re = /^\s/;
    where = where || "BOTH";
    switch (where)
    {
        case 'BEGIN':
            do {

                if (str.peek().search(re) !== -1)
                {


                    str.unset(0);
                } else
                    break;
            } while (str.next());
            break;
        case 'END':
            str.key = str.length - 1;
            //delete whitespaces from the end of the string
            do {
                if (str.current().search(re) !== -1 || str.current() === " ")
                {
                    str.unset(str.size() - 1);
                } else
                    break;

            } while (str.prev())


            break;
        case 'BOTH':

            //this optimisation from http://blog.stevenlevithan.com/archives/faster-trim-javascript
            return this.replace(/^\s*((?:[\S\s]*\S)?)\s*$/, '$1');
            break;
    }
    return str.join("");
};

/**
 * Insert a sequence of a characters or the string representation of an object into the calling string
 * @param {Mixed} o  <pre>Object to insert as a string into - str -. Note this method calls the toString() method on 'arg'
 *                    You should therefore be watchful of objects that get converted to strings like "{Object | Array}Function]"
 *                   Adequately this argument should be Objects like Strings, Numbers , Arrays Date e.t.c which values
 *                   can be represented as a valid string, If Arrays or (Collection) objects are sent as argument
 *                  Each of their index is treated as a string and appended to  the calling string </pre>
 *
 * @param {Number} [offset] If given it denotes the position in  - str - at which to start inserting characters
 *                                  else insertion starts at the end of - str -
 * @return {String} The new String
 */


String.prototype.insert_ch = function (o, offset)
{

    //get the string value from our 'o' object
    o = T.Iterator(o.toString());
    var str_l = T.Iterator(this); //add the main sstring
    if (offset >= 0)
    {

        str_l.insert_at(o, offset);
    } else
    {
        str_l.add_all(o);
    }
    return str_l.join("");
};



/**
 * Insert the first n characters of a sequence of characters or the string representation of an object into the calling string
 * @param {Mixed} o <pre>Object to insert as a string into - str -. Note this method calls the toString() method on 'arg'
 *                    You should therefore be watchful of objects that get converted to strings like "{Object | Array}Function]"
 *                   Adequately this argument should be Objects like Strings, Numbers , Arrays Date e.t.c which values
 *                   can be represented as a valid string, If Arrays or (Collection) objects are sent as argument
 *                  Each of their index is treated as a string and appended to  the calling string </pre>
 *
 * @param {Number} [n] The number of characters from 'o' to insert, or all if not
 * specified
 * @param {Number} [offset] If given it denotes the position in  - str -
 *                                   at which to start inserting characters
 *                                  else insertion starts at the end of - str -
 * @return {String} The new String
 */


String.prototype.insert_n = function (o, n, offset)
{

    var str_l = T.Iterator(o.substr(0, (n - 1 ? n : o.length))), //...
            this_str = T.Iterator(this);
    if (offset)
    {
        //INSERT CHARS AT THE PARTICULAR OFFSET
        this_str.insert_at(str_l, offset);
    } else
    { // ELSE JUST ADD EM'ALL
        this_str.add_all(o);
    }

    return this_str.join("");
};

/**
 * Insert a sequence o characters, a character at a time, a tidle (`) character is used for line breaks
 * @param {String} data The character string to be inserted
 * @param {HTMLELement | String} node The element the strings are to be inserted into
 * @param {Boolean} [alignTextNode = false] Adding strings dynamically can affect the positioning of an element within its
 * parent, setting this flag to true ensure the text node stays aligned
 */
String.prototype.drizzle = function (data, node, alignTextNode) {

    data = this.length ? this : data; //use the calling string contents if avaialable

    var node = T.$(node);
    node.innerHTML = "";

    T.Iterator(data).timed_iterator(function (char) {
        if (char === '`') {
            node.innerHTML += "<br/>";
        } else {
            node.innerHTML += (char);
        }
        //reposition the text-node on veritcally and horizontally in the parent
        //so it remains centered
        if (alignTextNode && alignTextNode === true) {

            node.style.marginTop = (node.parentNode.offsetHeight - node.offsetHeight) * .5 + "px";
            node.style.marginLeft = (node.parentNode.offsetWidth - node.offsetWidth) * .5 + "px";

        }

    }, 80);

};

/**
 * Delete a sequence of characters From a string.
 * @param {Number} start Index to start deleteing from, if end is not given, only the character at start is deleted.
 * @param {Number} [end] If given it denotes the end offset to stop deleting charcters
 * @return {String} The new String after deleting charcters from 'start' to 'end'
 */
String.prototype.delete_ch = function (start, end)
{
    //stuff, wow writing a library takes time, and am not even half waY, Y!! not just use jQuery, simple cuz its dumb!!!???
    var str = new T.Iterator(this);
    do {


        if (start >= 0 && start === str.key && !end)
        { //we have only a start index
            str.unset(str.key);
            break;
        }


        if (start === end)
        { //the value start and end, ar equal, either bcuz it was set that way
            str.unset(start); //or we succesfully reduced end,  so delete the last value and exit
            break;
        }
        if (start >= 0)
        {
            if (end >= 0)
            {
                str.unset(start); //start should always point to the next char in-line
                end = end - 1; //update the end-value as we are now one string less
                //HOPE I'LL BE ABLE TO GET THIS SIX MONTHS FROM NOW'
            }
        }
    } while (str.next())



    return str.join("");
};

/**
 * Returns a string produced according to the formatting string format. This implementation try's to be as close to the
 * C specs as possible ( a notable exception is the &quot;<b>g</b>&quot; conversion specification which for now uses JavaScript's toPrecision..
 *  &lt;Big Thanks to the PHPJS TEAM for their wonderful functions  www.phpjs.com &gt;
 * In using this method, conversion specifiers and format directives are placed in the string itself
 * while the replacement values are used as arguments, the method is then called directly on the string instance
 * 
 *
 
 
 
 *
 * @param {...replacement-variables} args Variable length number of argumments that should match the number of conversion specifications
 *  <pre> Explanation -
 *  The calling string is composed of zero or more ordinary characters (excluding %)
 that are copied directly to the result, and conversion specifications, each of which results in fetching its own
 parameter.
 
 Each conversion specification consists of a percent sign (%), followed by one or more of these elements,
 in order:
 
 1 - An optional sign specifier that forces a sign (- or +) to be used on a number. By default, only the - sign is used on a number if it's negative.
 2 - An optional padding specifier that says what character will be used for padding the results to the right string size.
 This may be a space character or a 0 (zero character). The default is to pad with spaces. An alternate padding
 character can be specified by prefixing it with a single quote ('). See the examples below.
 
 3 - An optional alignment specifier that says if the result should be left-justified or right-justified. The default
 is right-justified; a - character here will make it left-justified.
 
 4 - An optional number, a width specifier that says how many characters (minimum) this conversion should result in.
 
 5 - An optional precision specifier in the form of a period (`.') followed by an optional decimal digit string that
 says how many decimal digits should be displayed for floating-point numbers. When using this specifier on a string,
 it acts as a cutoff point, setting a maximum character limit to the string.
 
 6 - A type specifier that says what type the argument data should be treated as. Possible types:
 
 % - a literal percent character. No argument is required.
 b - the argument is treated as an integer, and presented as a binary number.
 c - the argument is treated as an integer, and presented as the character with that ASCII value.
 d - the argument is treated as an integer, and presented as a (signed) decimal number.
 e - the argument is treated as scientific notation (e.g. 1.2e+2).
 E - like %e but uses uppercase letter (e.g. 1.2E+2).
 u - the argument is treated as an integer, and presented as an unsigned decimal number.
 f - the argument is treated as a float, and presented as a floating-point number
 
 g - shorter of %e and %f (but unlike the behavior in C would include trailing zero's).
 G - shorter of %E and %f (but unlike the behavior in C would include trailing zero's).
 o - the argument is treated as an integer, and presented as an octal number.
 s - the argument is treated as and presented as a string.
 x - the argument is treated as an integer and presented as a hexadecimal number (with lowercase letters).
 X - the argument is treated as an integer and presented as a hexadecimal number (with uppercase letters).
 
 *</pre>
 *
 * @return {String} The string after inserting replacement values and applying the conversion specs
 * 
 * @example
 *
 *  This example is used to prove similar behaviour with the version used in PHP
 *  more examples are welcomed
 *
 *
 "%%b = '%b'\n".sprintf(43951789); // binary representation
 "%%c = '%c'\n".sprintf(65); // print the ascii character, same as chr() function
 "%%d = '%d'\n".sprintf(43951789); // standard integer representation
 "%%e = '%e'\n".sprintf(43951789); // scientific notation
 "%%u = '%u'\n".sprintf(-43951789); // unsigned integer representation of a positive integer
 "%%u = '%u'\n".sprintf(-43951789); // unsigned integer representation of a negative integer
 "%%f = '%f'\n".sprintf(43951789); // floating point representation
 "%%o = '%o'\n".sprintf(43951789); // octal representation
 "%%s = '%s'\n".sprintf(43951789); // string representation
 "%%x = '%x'\n".sprintf(43951789); // hexadecimal representation (lower-case)
 "%%X = '%X'\n".sprintf(43951789); // hexadecimal representation (upper-case)
 
 "%%+d = '%+d'\n".sprintf(43951789); // sign specifier on a positive integer
 "%%+d = '%+d'\n".sprintf(-43951789); // sign specifier on a negative integer
 
 ;
 
 "%.3e".sprintf(362525200); // outputs 3.625e+8
 
 The above example will output the following STRINGS:
 
 %b = '10100111101010011010101101'
 %c = 'A'
 %d = '43951789'
 %e = '4.39518e+7'
 %u = '43951789'
 %u = '4251015507'
 %f = '43951789.000000'
 %o = '247523255'
 %s = '43951789'
 %x = '29ea6ad'
 %X = '29EA6AD'
 %+d = '+43951789'
 %+d = '-43951789'
 3.625e+8
 
 "[%s]\n".sprintf('monkey'); // standard string output
 "[%10s]\n".sprintf('monkey'); // right-justification with spaces
 "[%-10s]\n".sprintf('monkey'); // left-justification with spaces
 "[%010s]\n".sprintf('monkey'); // zero-padding works on strings too
 "[%'#10s]\n".sprintf('monkey'); // use the custom padding character '#'
 "[%10.10s]\n".sprintf('many monkeys'); // left-justification but with a cutoff of 10 characters
 " Your name is %s %s".sprintf('foo', 'bar'); using multiple conversion specifiers
 ?>
 The above example will output:
 
 [monkey]
 [    monkey]
 [monkey    ]
 [0000monkey]
 [####monkey]
 [many monke]
 Your name is foo bar
 */
String.prototype.sprintf = function (args)
{

    //incantation, wow!!!
    return T.sprintf.apply(this, T.Iterator().add(this.toString()).
            add_all(arguments).to_array());
};

/**
 *@ignore
 */

TigerJS.sprintf = function ()
{
    var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
    var a = arguments,
            i = 0,
            format = a[i++]; //original, a[0], contains the format, while a[1] the string to be formated

    // pad()
    var pad = function (str, len, chr, leftJustify)
    {
        if (!chr)
        {
            chr = ' ';
        }
        var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).
                join(chr);
        return leftJustify ? str + padding : padding + str;
    };
    // justify()
    var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar)
    {
        var diff = minWidth - value.length;
        if (diff > 0)
        {
            if (leftJustify || !zeroPad)
            {
                value = pad(value, minWidth, customPadChar, leftJustify);
            } else
            {
                value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
        }
        return value;
    };
    // formatBaseX()
    var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad)
    {
        // Note: casts negative numbers to positive ones
        var number = value >>> 0;
        prefix = prefix && number &&
                {
                    '2': '0b',
                    '8': '0',
                    '16': '0x'
                }
        [base] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };
    // formatString()
    var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar)
    {
        if (precision !== null)
        {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };
    // doFormat()
    var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type)
    {
        var number;
        var prefix;
        var method;
        var textTransform;
        var value;
        if (substring === '%%')
        {
            return '%';
        }

        // parse flags
        var leftJustify = false,
                positivePrefix = '',
                zeroPad = false,
                prefixBaseX = false,
                customPadChar = ' ';
        var flagsl = flags.length;
        for (var j = 0; flags && j < flagsl; j++)
        {
            switch (flags.charAt(j))
            {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case "'":
                    customPadChar = flags.charAt(j + 1);
                    break;
                case '0':
                    zeroPad = true;
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
            }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if (!minWidth)
        {
            minWidth = 0;
        } else if (minWidth === '*')
        {
            minWidth = +a[i++];
        } else if (minWidth.charAt(0) === '*')
        {
            minWidth = +a[minWidth.slice(1, -1)];
        } else
        {
            minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0)
        {
            minWidth = -minWidth;//min width should not be -ve
            leftJustify = true;
        }

        if (!isFinite(minWidth))
        {
            throw new Error('TigerJS.sprintf <> sprintf: (minimum-)width must be finite');
        }

        if (!precision)
        {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
        } else if (precision === '*')
        {
            precision = +a[i++];
        } else if (precision.charAt(0) === '*')
        {
            precision = +a[precision.slice(1, -1)];
        } else
        {
            precision = +precision;
        }

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
        switch (type)
        {
            case 's':
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).
                        toUpperCase();
            case 'u':
                return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = (+value) | 0;
                prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            case 'e':
            case 'E':
            case 'f':
            case 'F':
            case 'g':
            case 'G':
                number = +value;
                prefix = number < 0 ? '-' : positivePrefix;
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + Math.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
        }
    };
    return format.replace(regex, doFormat);
};

/**
 *Searches within this <i>string</i>, beginning at 'pos',
 *for the position of the first character that is equal to any character within '<i>s</i>'.
 * @param {string} s String which each character is compared against
 * @param {Number} [pos] Optional position to start searching from, defaults to start of string
 *                               If pos is given returned position is reltive to pos
 * @type Number
 * @return Retuns the position the character was found or -1
 */
String.prototype.find_first_of = function (s, pos)
{
    var _this = T.Iterator(this),
            _s = T.Iterator(s);
    if (pos)
        _this.empty().add_all(this.substring(pos));
    do {
        if (_s.indexOf(_this.current()) !== false)
        {

            return _this.key;
        }


    } while (_this.next());
    return -1;
};


/**
 *Searches within this <i>string</i>, beginning at 'pos',
 *for the position of the first character that is not equal to
 * any character within '<i>s</i>'.
 * @param {string} s String which each character is compared against
 * @param {Number} [pos] Optional position to start searching from, defaults to start of string
 * If pos is given returned position is reltive to pos
 * @type Number
 * @return Retuns the position the character was found or -1
 */

String.prototype.find_first_not_of = function (s, pos)
{
    var _this = T.Iterator(this),
            _s = T.Iterator(s);
    if (pos)
        _this.empty().add_all(this.substring(pos));
    do {
        if (_s.indexOf(_this.current()) === false)
        {

            return _this.key;
        }


    } while (_this.next());
    return -1;
};

/**
 *Searches within this <i>string</i>, beginning at 'pos',
 *for the position of the last character that is equal to
 * any character within '<i>s</i>'.
 * @param {string} s String which each character is compared against
 * @param {Number} [pos] Optional position to start searching from, defaults to start of string
 * If pos is given returned position is reltive to pos
 * @type Number
 * @return Retuns the position the character was found or -1
 */

String.prototype.find_last_of = function (s, pos)
{
    var _this = T.Iterator(this),
            _s = T.Iterator(s),
            key = -1;
    if (pos)
        _this.empty().add_all(this.substring(pos));
    do {
        if (_s.indexOf(_this.current()) !== false)
        {

            key = _this.key;
        }


    } while (_this.next());
    return key;
};

/**
 *Searches within this <i>string</i>, beginning at 'pos',
 *for the position of the last character that is not equal to
 * any character within '<i>s</i>'.
 * @param {string} s String which each character is compared against
 * @param {Number} [pos] Optional position to start searching from, defaults to start of string
 * If pos is given returned position is reltive to pos
 * @type Number
 * @return Retuns the position the character was found or -1
 */

String.prototype.find_last_not_of = function (s, pos)
{
    var _this = T.Iterator(this),
            _s = T.Iterator(s),
            key = -1;
    if (pos)
        _this.empty().add_all(this.substring(pos));

    do {
        if (_s.indexOf(_this.current()) === false)
        {

            key = _this.key;
        }


    } while (_this.next());
    return key;
};

/**
 * Replaces placeholders in a string with data from an object
 * @param {Object} data Object containing the data to be merged in to the string template
 <p>The object can contain nested data objects and arrays, with nested object properties and array elements are accessed using dot notation. eg foo.bar or foo.0.</p>
 <p>The data labels in the object cannot contain characters used in the template delimiters, so if the data must be allowed to contain the default { and } delimiters, the delimters must be changed using the option below.</p>
 * @param {Object} opts Options object
 * @param {String} [opts.delimiter = "{}"] Alternative label delimiter(s) for the template
 * The first character supplied will be the opening delimiter, and the second the closing. If only one character is supplied, it will be used for both ends.
 * @param {Boolean} [opts.escapeHtml=false] Escape any special html characters found in the data object
 * Use this to safely inject data from the user into an HTML template.
 <p style='color:blue'> adapted from the <b><i>Glow javascript Library</i></b>
 - Copyright 2010 British Broadcasting Corporation</p>
 *
 @example
 var data = {
 name: "Domino",
 colours: ["black", "white"],
 family: {
 mum: "Spot",
 dad: "Patch",
 siblings: []
 }
 };
 var my_string_template = "My cat's name is {name}. His colours are {colours.0} & {colours.1}. His mum is {family.mum}, his dad is {family.dad} and he has {family.siblings.length} brothers or sisters.";
 var result = my_string_template.interpolate( data);
 // result === "My cat's name is Domino. His colours are black & white. His mum is Spot, his dad is Patch and he has 0 brothers or sisters."
 
 @example
 var data = {
 name: 'Haxors!!1 <script src="hackhackhack.js"></script>'
 }
 var my_string_template = '<p>Hello, my name is {name}</p>';
 var result = my_string_template.interpolate( data, {
 escapeHtml: true
 });
 // result === '<p>Hello, my name is Haxors!!1 &lt;script src="hackhackhack.js"&gt;&lt;/script&gt;</p>'
 */
String.prototype.interpolate = function (data, opts)
{
    var placeHolderRx, regexEscape = /([$^\\\/()|?+*\[\]{}.-])/g,
            leftDelimiter,
            rightDelimiter;
    opts = opts ||
            {};
    if (opts.delimiter === undefined)
    {
        placeHolderRx = /\{[^{}]+\}/g;
    } else
    {
        leftDelimiter = opts.delimiter.substr(0, 1).
                replace(regexEscape, "\\$1");
        rightDelimiter = opts.delimiter.substr(1, 1).
                replace(regexEscape, "\\$1") || leftDelimiter;
        placeHolderRx = new RegExp(leftDelimiter + "[^" + leftDelimiter + rightDelimiter + "]+" + rightDelimiter, "g");
    }

    return this.replace(placeHolderRx, function (placeholder)
    {
        var key = placeholder.slice(1, -1),
                keyParts = key.split("."),
                val,
                i = 0,
                len = keyParts.length;
        if (key in data)
        {
            // need to be backwards compatible with "flattened" data.
            val = data[key];
        } else
        {
            // look up the chain
            val = data;
            for (; i < len; i++)
            {
                if (keyParts[i] in val)
                {
                    val = val[keyParts[i]];
                } else
                {
                    return placeholder;
                }
            }
        }

        if (opts.escapeHtml)
        {
            val = val.html_chars();
        }
        return val;
    });
};