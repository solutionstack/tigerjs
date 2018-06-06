/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

/**
 *
 * @class
 * Static Parser object to help with filtering out special strings from text
 * @since 0.1alpha build 10
 */

TigerJS.Parser = {
    /**
     *
     * Parse a uri to its component part
     * @param {String} arg The uri to parse
     * @type Object
     * @return {Object} returns an Object containing the following information about this uri
     *                  {"source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"}
     */

    parse_uri: function (arg)
    {
        var o = T.Parser.options,
                m = o.parser[o.strictMode ? "strict" : "loose"].exec(arg),
                uri = {},
                i = 14;
        while (i--)
            uri[o.key[i]] = m[i] || "";
        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2)
        {
            if ($1)
                uri[o.q.name][$1] = $2;
        });
        //since we currently only do loose mode, emulate some criteria of strict mode
        //to validate our url
        return uri;
    },
    /**
     * @ignore
     * This provides options for T.parser.parse_uri
     */
    options:
            {
                strictMode: false,
                key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
                q:
                        {
                            name: "queryKey",
                            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                        },
                parser:
                        {//for now we dont expose this optoins, and default to loose
                            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                        }
            },
    /**
     * Extract Email addresses or Site URL's  from a block of text
     * Returning the result as an array, valid web addresses must contain the protocol part and(or) www
     * @param {string} address_type The type of address to Extraxt, either web or mail
     * @param {string} arg String Block Containing  addreses to extract
     * @return {Array} An array containing extracted addresses [An empty array if no extraction was made]
     * @static
     * #Todo This some times lockes up the UI
     */

    parse_address: function (address_type, arg)
    {

        /******************* UNIVERSAL EMAIL MATCHING ***************************************************/
        var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
        var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
        var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
        var sQuotedPair = '\\x5c[\\x00-\\x7f]';
        var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
        var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
        var sDomain_ref = sAtom;
        var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
        var sWord = '(' + sAtom + '|' + sQuotedString + ')';
        var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
        var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
        var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
        var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

        var reValidEmail = new RegExp(sValidEmail, "gi");


        //
        // Regular Expression for URL validation
        //
        // Author: Diego Perini
        // Updated: 2010/12/05
        // License: MIT
        //
        // Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
        //
        // Permission is hereby granted, free of charge, to any person
        // obtaining a copy of this software and associated documentation
        // files (the "Software"), to deal in the Software without
        // restriction, including without limitation the rights to use,
        // copy, modify, merge, publish, distribute, sublicense, and/or sell
        // copies of the Software, and to permit persons to whom the
        // Software is furnished to do so, subject to the following
        // conditions:
        //
        // The above copyright notice and this permission notice shall be
        // included in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
        // EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
        // OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
        // NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
        // HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
        // WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        // FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
        // OTHER DEALINGS IN THE SOFTWARE.
        //
        // the regular expression composed & commented
        // could be easily tweaked for RFC compliance,
        // it was expressly modified to fit & satisfy
        // these test for an URL shortener:
        //
        //   http://mathiasbynens.be/demo/url-regex
        //
        // Notes on possible differences from a standard/generic validation:
        //
        // - utf-8 char class take in consideration the full Unicode range
        // - TLDs have been made mandatory so single names like "localhost" fails
        // - protocols have been restricted to ftp, http and https only as requested
        //
        // Changes:
        //
        // - IP address dotted notation validation, range: 1.0.0.0 - 223.255.255.255
        //   first and last IP address of each class is considered invalid
        //   (since they are broadcast/network addresses)
        //
        // - Added exclusion of private, reserved and/or local networks ranges
        //
        // - Added punycode support in the host/tld/domain part.
        // - Added support for dashes in punycoded parts: xn----stqb.tld / к-п.tld
        // - Limit punycode to 63 - 'xn--' = 59 bytes, due to max label size in DNS
        //    the other label sizes are harder to limit properly
        // - Some size limits added to the other labels in the DNS domain
        // - Added IPv6 support
        // - Added a single commonly used reserved domain: localhost
        //
        // Compressed one-line versions:
        //
        // Javascript version
        //
        // 
        //
        // PHP version
        //
        // With a few modifications from the TigerJS Library Authours
        //
        var re_weburl = new RegExp(
                "^" +
                // protocol identifier
                "(?:(?:https?|ftps?)://)" +
                // user:pass authentication
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                // IP address exclusion
                // private & local networks
                "(?!10(?:\\.\\d{1,3}){3})" +
                "(?!127(?:\\.\\d{1,3}){3})" +
                "(?!169\\.254(?:\\.\\d{1,3}){2})" +
                "(?!192\\.168(?:\\.\\d{1,3}){2})" +
                "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                // IP address dotted notation octets
                // excludes loopback network 0.0.0.0
                // excludes reserved space >= 224.0.0.0
                // excludes network & broacast addresses
                // (first & last IP address of each class)
                "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                // IPv6 RegEx - http://stackoverflow.com/a/17871737/273668
                "\\[(" +
                "([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|" + // 1:2:3:4:5:6:7:8
                "([0-9a-fA-F]{1,4}:){1,7}:|" + // 1::                              1:2:3:4:5:6:7::
                "([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|" + // 1::8             1:2:3:4:5:6::8  1:2:3:4:5:6::8
                "([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|" + // 1::7:8           1:2:3:4:5::7:8  1:2:3:4:5::8
                "([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|" + // 1::6:7:8         1:2:3:4::6:7:8  1:2:3:4::8
                "([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|" + // 1::5:6:7:8       1:2:3::5:6:7:8  1:2:3::8
                "([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|" + // 1::4:5:6:7:8     1:2::4:5:6:7:8  1:2::8
                "[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|" + // 1::3:4:5:6:7:8   1::3:4:5:6:7:8  1::8  
                ":((:[0-9a-fA-F]{1,4}){1,7}|:)|" + // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8 ::8       ::  
                "fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|" + // fe80::7:8%eth0   fe80::7:8%1     (link-local IPv6 addresses with zone index)
                "::(ffff(:0{1,4}){0,1}:){0,1}" +
                "((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}" +
                "(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|" + // ::255.255.255.255   ::ffff:255.255.255.255  ::ffff:0:255.255.255.255  (IPv4-mapped IPv6 addresses and IPv4-translated addresses)
                "([0-9a-fA-F]{1,4}:){1,4}:" +
                "((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}" +
                "(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])" + // 2001:db8:3:4::192.0.2.33  64:ff9b::192.0.2.33 (IPv4-Embedded IPv6 Address)
                ")\\]" +
                "|" +
                "localhost" +
                "|" +
                // host name
                "(?:xn--[a-z0-9\\-]{1,59}|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?){0,62}[a-z\\u00a1-\\uffff0-9]{1,63}))" +
                // domain name
                "(?:\\.(?:xn--[a-z0-9\\-]{1,59}|(?:[a-z\\u00a1-\\uffff0-9]+-?){0,62}[a-z\\u00a1-\\uffff0-9]{1,63}))*" +
                // TLD identifier
                "(?:\\.(?:xn--[a-z0-9\\-]{1,59}|(?:[a-z\\u00a1-\\uffff]{2,63})))" +
                ")" +
                // port number
                "(?::\\d{2,5})?" +
                // resource path
                "(?:/[^\\s]*)?" +
                "$", "ig");

        var rawemail = [];

        if (address_type === "web")
        {

            var possible_addresses = arg.split(/[\s;,]+/),
                    m, i; // split on any combination of whitespace, comma, or semi-colon

            for (i = 0; i < possible_addresses.length; i++)
            { //loop through the arguments and try to match
                if ((m = possible_addresses[i].match(re_weburl)))
                    rawemail[rawemail.length] = m[0];

            }

        } else
        {

            var possible_mails = arg.split(/[\s;,]+/),
                    m, i; // split on any combination of whitespace, comma, or semi-colon

            for (i = 0; i < possible_mails.length; i++)
            { //loop through the arguments and try to match
                if ((m = possible_mails[i].match(reValidEmail)))
                    rawemail[rawemail.length] = m[0];

            }
        }


        if (rawemail === null)
            return []; // no address matches


        rawemail.sort(); // Sort the array

        return (rawemail);
    },
    /**
     * Parses out script tags in a text block and Optionally executes them, in global scope of the document
     * @param {string} txt Text block contaning scripts to parse out
     * @param {Boolean} exec Optional Flag indicating wheteher to execute the found scripts, defaults to false
     * @return {String} Returns a copy of the -txt- argument with all scripts stripped out
     * @static
     */

    parse_scripts: function (txt, exec)
    {
        exec = (exec) || false;
        var scr_re = new RegExp("<\s*script[^>]*>\n*\t*\f*\r*(.*?)<\s*/\s*script>", "gi"),
                r = [],
                s;
        do {


            r[r.length] = (scr_re.exec(txt));
        } while (r[r.length - 1]);
        for (var i = 0; i < r.length - 1; i++)
        {
            s = document.createElement('script');
            try
            {


                if (r[i][0].indexOf("src=") > -1)
                { //see if its an external script

                    var re = /<\s*\w*\s*src\s*=\s*\'?\s*([\w\s%#\/\.;:_-]*)\s*\'?.*?>/, //this would parse out the src attribute

                            b = (r[i][0].replace(/\"/g, "'")); //attributes can come in single or double quotes so we normalize to single quote

                    s.src = (re.exec(b)[1]); //add the src value to our script element so its automatically loaded

                }

                s.innerHTML = r[i][1] || ";"; //add the script content W3C


            } catch (e)
            {

                s.text = r[i][1] || ";"; //add the script content, IE and related

            }
            if (exec)
            { //ie we're to execute the scripts
                document.documentElement.firstChild.appendChild(s);
            }
        }


        return txt.replace(scr_re, "");
    }

    ,
    /**
     * Parses out numbers whether positive/negative/decimals e.t.c
     * @param {string} arg Text block contaning numbers to parse out
     * @return {Array} An Array of matches
     * @static
     */
    //attributed to http://stackoverflow.com/users/18078/david-leppik
    parse_number: function (arg)
    {
        var numberReSnippet = "([NaN|+|-]?(?:(?:\\d+|\\d*\\.\\d+)(?:[E|e][+|-]?\\d+)?|Infinity))";
        var matchOnlyNumberRe = new RegExp("^(" + numberReSnippet + ")$"),
                possible_numbers = arg.split(/[\s;,]+/),
                m, i, numbers = []; // split on any combination of whitespace, comma, or semi-colon

        for (i = 0; i < possible_numbers.length; i++)
        { //loop through the arguments and try to match
            if ((m = possible_numbers[i].match(matchOnlyNumberRe)))
                numbers[numbers.length] = m[0];

        }
        return numbers;
    },
    /**
     * Parses out text, stripping out any numeric values
     * @param {string} arg Text 
     * @return {String} The text argument with all numbers stripped out
     * @static
     */
    parse_text_only: function (arg)
    {
        var num_Matches = this.parse_number(arg); //first match numbers

        //then remove the matched numbers from the text
        for (var i = 0; i < num_Matches.length; i++)
        {
            arg = arg.replace(num_Matches[i], "");

        }

        return arg.match(/(\w)+(\W)+/gi).join(" "); // return the readable (non-numeric) characters word characters and return    

    },
    /**
     * Parses out any xml conformant tag
     * @param {string} txt Text block contaning tag content to parse out
     * @param {String} tag The tag name to parse 
     * @return {String} Returns the extracted tag
     * @static
     */

    parse_any: function (txt, tag)
    {
        //not using regex here to allow for nested tags
        //first search for the tag within the text block
        var startTag = txt.stripos("<" + tag),
                //end tag
                endTag = txt.stripos(tag + ">", startTag);

        //the tag lenght here is neccesary so we extract to the length of the tag name
        return (txt.substring(startTag, (startTag + endTag + 1) + tag.length));

    },
    /**
     * Parses out style  tags and link tags referencing external stylesheets in a text block and optionally includes then into  the document
     * @param {string} txt Text block contaning style content to parse out
     * @param {Boolean} exec Optional Flag indicating wheteher to include the stylesheets in the document
     * @return {String} Returns a copy of the -txt- argument with all style sheets stripped out
     * @static
     */

    parse_css: function (txt, exec)
    {

        exec = (exec) || false;
        var style_re = new RegExp("<\s*style[^>]*>\n*\t*\f*\r*(.*?)<\s*/\s*style>", "gi"),
                r = [],
                s = [],
                link_re = new RegExp("<\s*link.*?>", "g"),
                _s, b, i;

        do {

            r[r.length] = (style_re.exec(txt)); //get <style>

        } while (r[r.length - 1]);

        s = txt.match(link_re); //get <link rel="stylesheet" type="text/css" href="..stuff">

        for (i = 0; i < r.length - 1; i++)
        {
            _s = document.createElement('style');
            try
            {

                _s.innerHTML = r[i][1] || ";"; //add the style content

            } catch (e)
            {

                _s.text = r[i][1] || ";"; //add the style content, IE and related

            }

            if (exec)
            { //ie we're to execute the css
                document.querySelector("head").appendChild(_s);
            }

        }

        /// insert external stylesheets

        for (i = 0; i < s.length; i++)
        {
            _s = document.createElement('link');

            if (s[i].indexOf("text/css") > -1)
            { //see if its an external stylesheet

                //this would parse out the href attribute
                //this regex would be /href="([^\'\"]+)/g 
                //if the link where surrounded by double quoted
                var re = /href='([^\'\"]+)/g,
                        b = (s[i].replace(/\"/g, "'")); //attributes can come in single or double quotes so we normalize to single quote


                _s.href = (re.exec(b)[1]); //add the href value to our link element to load the css file
                _s.type = "text/css";
                _s.rel = "stylesheet";
            }

            if (exec)
            { //ie we're to execute the css

                document.documentElement.firstChild.appendChild(_s);
            }

        }
        return txt.replace(style_re, "").replace(link_re, "");
    }
};