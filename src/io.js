/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

/**
 *@class
 * Object {@link TigerJS.io}, this object is the base object, abstracting, differences
 * between  browser's http-request implementations, in addition to being the base class
 * for all other IO sub-objects
 *  @param {Object} configObj A confugiration object for the {@link TigerJS.io} object
 *  @param {String} [configObj.uri = window.location] The uri of the request,
 *  this could be absolute, or relative to the current page,  default to the windows url.
 *   If giving a relative url, prepend the url with "/"
 *  @param {String} [configObj.method = POST] The http-request method to use.
 *  @param {Object | DOMDocument | HTMLFormElement | HTMLInputELement | T.Map}  configObj.postData  Initial POST data to attach to this request
 *  @param {Object | HTMLFormElement} configObj.queryData. An object containing name/value pairs
 * of variables to add, or a form object in which each elements name and value
 * are added as form parameters, this would be used as the initial get parameters
 *  @param {Object} configObj.subscribe   An object holding references to user callback
 *  functions to handle various io events
 *  @param {Function} configObj.subscribe.onloadstart Function to be called with the
 *  loadstart event
 *  @param {Function} configObj.subscribe.onprogress Function to be called with the
 *  progress event
 *  @param {Function} configObj.subscribe.onload Function to be called with the
 *  load event
 *  @param {Function} configObj.subscribe.onerror Function to be called with the
 *  error event.
 *  <br/>
 *  When a catchable error occurs, the onerror function would recieve two arguments
 *  <br/> -- The first argument would contain a string indicating the type of error
 *        -- The second would contain an error number
 *
 *  @param {Function} configObj.subscribe.ontimeout Function to be called with the
 *  timeout event
 *  @param {Function} configObj.subscribe.onabort Function to be called with the
 *  abort event
 *  @param {Function} configObj.subscribe.uploadloadstart Function to be called with the
 *  loadstart event on the upload object
 *  @param {Function} configObj.subscribe.uploadprogress Function to be called with the
 *  progress event on the upload object, recives the percentage data uploaded as its first argument
 
 *  @throws NullArgumentError, WrongArgumentTypeError,NoObjectSupportError,
 *  SecurityError, InvalidMethodError, WrongArgumentCountError
 *
 * @type TigerJS.io
 *
 */

TigerJS.io = function (configObj) {

    var rval = function (configObj) {
        this.configObj = configObj; //make public for subclasses to access
        //PARSE CONFIG OBJECT
        var err_str;
        if (!configObj) {
            err_str = " NullArgumentError<> Constructor TigerJS.io Expects at least ONE argument, Zero given";
            throw new Error(err_str);
        }
        if (!(T.is_object(configObj))) {
            err_str = " WrongArgumentTypeError<> Constructor TigerJS.io Expects an Object as its argument, * " + T.type(configObj) + " * given";
            throw new Error(err_str);
        }

        //The Object
        var _object = new XMLHttpRequest(),
                uri = "",
                method = "",
                default_uri_parts = (T.Parser.parse_uri(window.location.href.toString())),
                //get the uri components
                uri_parts = configObj.uri ? T.Parser.parse_uri(configObj.uri) :
                default_uri_parts,
                socket_timeout = 0, //time out for this instance: default, ->browser defaults
                socket_timeout_counter = 0,
                socket_timeout_counter_id; //setTimeoutId variable to timeout the connection



        if (!_object) {

            err_str = " NoObjectSupportError<> The XMLHttpRequest Object is not supported by your BROWSER";
            throw new Error(err_str);
        }

        //////////////ERRORS FOR USER FUNCTIONS////////////////////////////////////
        if (!T.dom_ready()) {
            if (configObj.subscribe.onerror)
                configObj.subscribe.onerror("ObjectError", "0x1"); //call onerror handler
            return;
        }
        if (T.NETWORK_STATE === "OFFLINE") {
            if (configObj.subscribe.onerror) {
                configObj.subscribe.onerror("NETWORK_ERROR", 0); //call onerror handler

                return;
            }
        }


        var methodBlackList = T.Iterator(
                ["CONNECT",
                    "TRACE",
                    "TRACK"
                ]
                );


        //method checks

        if (configObj.method && !/post|get|head|delete|put|head|options|move|lock|unlock|update|label|merge|checkout|checkin|acl|baseline-control/i.test(configObj.method)) {
            if (methodBlackList.contains(configObj.method)) { //risky

                err_str = " SecurityError <> Constructor TigerJS.io" +
                        "method name [" + configObj.method + "] is ILLEGAL";
                throw new Error(err_str);
            }
            err_str = "InvalidMethodError <> Constructor TigerJS.io " +
                    "method name [" + configObj.method + "] is UNKNOWN";
            throw new Error(err_str);

        } else {
            method = configObj.method ? configObj.method.toUpperCase() : "POST"; //default to post
        }

        ///check host origins
        if (configObj.uri) { //Config object has a uri set

            //if host detected in uri check if it matches with the origin

            if (uri_parts.host && uri_parts.host !== default_uri_parts.host) { //origins/hosts dont match

                err_str = "SecurityError <> Constructor TigerJS.io " +
                        "The Request HOST (" + uri_parts.host + ") doesnt match its ORIGIN (" + default_uri_parts.host + ")";
                throw new Error(err_str);

                //hosts match
            } else if (uri_parts.host && uri_parts.host === default_uri_parts.host) {

                //the complete uri plus any get vars
                uri = uri_parts.source;
            } else if (!uri_parts.host) { //no host detected in uri , should be a relative uri
                //so absolutionize it
                //the final absolute url could contain '//'
                //so we change it to a single slash

                uri = (default_uri_parts.authority +
                        default_uri_parts.directory + configObj.uri).replace("//", "/");
            }
        } else { // no uri given in argument Object

            //use the page's url
            uri = (uri_parts.authority +
                    uri_parts.directory + uri_parts.file).replace("//", "/");
        }

        //append protocol to uri
        if (!T.Parser.parse_uri(uri).protocol) {
            uri = uri_parts.host ? uri_parts.protocol + "://" + uri :
                    default_uri_parts.protocol + "://" + uri;
        }



        /**
         * Method to add GET queries to the request object, The request method is
         * implicitly set to GET
         * @param {Object | HTMLFormElement} data An object containing name/value pairs
         * of variables to add, or a form object in which each elements name and value
         * are added as form parameters
         * @return {TigerJS.io}
         *
         */


        this.add_query_data = function (data) {
            if (this.add_query_data.length !== arguments.length) {
                err_str = " WrongArgumentCountError <> Function TigerJS.io#add_query_data " +
                        "Epects one {1} argument,  {" + arguments.length + "} given";
                throw new Error(err_str);
            }

            uri += "&" + T.http_build_query(data);
            return this;
        };
        /**
         * Sets the GET queries to the request object, overiding any previous values.
         * The request method is implicitly set to GET
         * @param {Object | HTMLFormElement} data An object containing name/value pairs
         * of variables to set as query parameters, or a form object in which each
         *  elements name and value are added as form parameters
         * @return {TigerJS.io}
         *
         */

        this.set_query_data = function (data) {
            if (this.set_query_data.length !== arguments.length) {
                err_str = " WrongArgumentCountError <> Function TigerJS.io#set_query_data " +
                        "Epects one {1} argument,  {" + arguments.length + "} given";
                throw new Error(err_str);
            }

            method = "GET";
            //remove previous GET variables
            uri = uri.indexOf("?") > -1 ? uri.substring(0, uri.indexOf("?")) : uri;
            uri += "?" + T.http_build_query(data);

            return this;
        };
        /** Returns the GET Query data in the form of an urlencoded query string.
         *@return {String}
         */
        this.get_query_data = function () {

            return encodeURI(uri.substring(uri.indexOf("?") + 1));
        };
        /**
         *Sets the request method
         *@param {String} _method A String denoting a valid HTTP method
         *@return {TigerJS.io}
         */

        this.set_request_method = function (_method) {

            if (!/post|get|head|delete|put|head|options|move|lock|unlock|update|label|merge|checkout|checkin|acl|baseline-control/i.test(_method)) {
                if (methodBlackList.contains(_method)) { //risky

                    err_str = " SecurityError <> Function TigerJS.io#set_request_method " +
                            "method name [" + _method + "] is ILLEGAL";
                    throw new Error(err_str);
                }
                err_str = "InvalidMethodError <> Function TigerJS.io#set_request_method " +
                        "method name [" + _method + "] is UNKNOWN";
                throw new Error(err_str);
            }

            method = _method.toUpperCase();
            return this;
        };
        /**
         * Returns the HTTP-Request method
         * @return {String}
         */
        this.get_query_data = function () {
            return method;
        };
        /**
         * Sets the timeout for the request, whent this time expires the ontimeout
         * callback is called
         * @param {Number} [timeout =0] The number of milliseconds to timeout
         *@return {TigerJS.io}
         *
         */
        this.setTimeout = function (timeout) {

            try { //seems IE < 11 doenst support this
                _object.timeout = timeout;

                socket_timeout = timeout;
            } catch (e) {
                return;
                //
            }

            return;
        };

        /**
         * Alias for #setTimeout
         * @function 
         */
        this.set_timeout = function (n) {
            return this.setTimeout(n)

        }

        /**
         * Returns the timeout set for this request object
         * @return {Number}
         *
         */

        this.get_timeout = function () {
            return socket_timeout;
        };

        /**
         *  Send the request
         *  @return {TigerJS.io}
         */
        this.send = function () {

            _object.open(method, uri, true);


            //set Event Listeners, that are set
            if (configObj.subscribe) {

                for (var i in configObj.subscribe) {
                    switch (i) {

                        //load start handler
                        case 'onloadstart':

                            _object.addEventListener("loadstart", configObj.subscribe.onloadstart, false);
                            break;
                        case 'ontimeout':

                            _object.addEventListener("timeout", configObj.subscribe.ontimeout, false);
                            break;
                        case 'onprogress':
                            //progress handler
                            _object.addEventListener("progress", configObj.subscribe.onprogress, false);
                            break;
                        case 'onabort':
                            //abort handler
                            _object.addEventListener("abort", configObj.subscribe.onabort, false);
                            break;
                        case 'onerror':
                            //error handler
                            _object.addEventListener("error", this.handle_request_errors_internally, false);
                            break;

                        case 'onload':
                            //we would delegate the load event internally
                            _object.addEventListener("load", this.handle_request_load_internally, false);
                            break;
                        case 'onloadend':

                            _object.addEventListener("loadend", configObj.subscribe.onloadend, false);
                            break;
                        case 'uploadloadstart':
                            //upload start handler
                            _object.upload.addEventListener("loadstart", configObj.subscribe.uploadloadstart, false);
                            break;
                        case 'uploadprogress':
                            //upload progress handler
                            _object.upload.addEventListener("progress", this.handle_upload_progress_events, false);
                            break;
                        case 'uploadload':
                            //upload completed handler
                            _object.upload.addEventListener("load", configObj.subscribe.uploadload, false);
                            break;
                    }
                }

            }
            if (this.postDataFeilds) {
                _object.send(this.postDataFeilds);
            } else {
                _object.send();

            }
            return this;
        };

        /*
         * handle server errors
         * @ignore
         */
        this.handle_request_errors_internally = function () {
            //check to see if we're offline
            if (T.NETWORK_STATE === "OFFLINE") {
                if (configObj.subscribe.onerror)
                    configObj.subscribe.onerror.apply(this, ["NETWORK_LOST_ERROR", 1]);
            } else {
                //WE'RE ONLINE PROBABLY A DNS, PROXY OR GATEWAY ERROR
                if (configObj.subscribe.onerror)
                    configObj.subscribe.onerror.apply(this, ["NETWORK_UNKNOWN_ERROR", 1]);

            }

        };
        /*
         * Handle netork related errors
         * @ignore
         */
        this.handle_request_load_internally = function () {
            var error_codes = T.Iterator(["400", '401', "403", '410', "501", "502", "503", "504", "505", "500", "302", "303"]);
            if (error_codes.indexOf(this.status.toString())) {
                if (configObj.subscribe.onerror)
                    configObj.subscribe.onerror.apply(this, ["SERVER_ERROR", this.status]);
                return;
            }
            if ("404" === this.status.toString()) {
                if (configObj.subscribe.onerror)
                    configObj.subscribe.onerror.apply(this, ["URI_NOT_FOUND", this.status]);
                return;
            }
            configObj.subscribe.onload.apply(this); //call onload
        };

        /*
         * handle upload progress calls
         * @ignore
         */
        this.handle_upload_progress_events = function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                configObj.subscribe.uploadprogress.apply(this, [percentComplete]); //
                return;
            }
            configObj.subscribe.uploadprogress.apply(this); //

        };

        /**
         * Appends post data for this request
         * @param {Object | DOMDocument | HTMLFormElement | HTMLInputELement | T.Map} data . If the argument is a document
         * it could be either an HTML or XML document, in-which case the serever, recieves all
         * document data as numreric based POST indexes
         *
         * @return {TigerJS.io}
         *
         */
        this.add_data_feilds = function (data) {

            if (this.add_data_feilds.length !== arguments.length) {
                err_str = " WrongArgumentCountError <> Function TigerJS.io#add_data_feilds " +
                        "Epects one {1} argument,  {" + arguments.length + "} given";
                throw new Error(err_str);
            }
            if (!this.postDataFeilds) { //It has to be existing, to add to
                err_str = "InvalidMethodCall <> Function TigerJS.io#add_data_feilds " +
                        "Cannot Add Data to NULL, No POST data previously SET";
                throw new Error(err_str);
            }
            var dataType = T.type(data),
                    i, j, postDocumentDataCount = 1;


            switch (dataType) {
                case "TigerJS.Map":

                    for (i = 0; i < data.keys().length; i++) {
                        this.postDataFeilds.append(data.keys()[i], data.values()[i]);
                    }


                    break;

                case "Object":
                    if (data.documentElement) { //its a document
                        this.postDataFeilds.append(postDocumentDataCount++, data.documentElement.textContent);

                    }
                    //else its a native object
                    for (i in data) {
                        if (data[i].nodeType) // a node refrenced in the object
                        {
                            this.add_data_feilds(data[i]);
                        } else {
                            this.postDataFeilds.append(i, data[i]);
                        }
                    }

                    break;

                case "HTMLFormElement":

                for (i = 0; i < data.elements.length; i++) {
                    //append elements with their values
                    this.postDataFeilds.append(data.elements[i].name, data.elements[i].value);

                    if (data.elements[i].getAttribute("type") === "file") { //if its a file element
                        //loop for multiple files selected
                        for (j = 0; j < data.elements[i].files.length; j++) {
                            this.postDataFeilds.append(data.elements[i].files[j].name, data.elements[i].files[j]);

                        }
                    }

                }

                case "HTMLInputElement":
                    if (data.getAttribute("type") === "file") { //if its a file element
                        //loop for multiple files selected
                        for (j = 0; j < data.files.length; j++) {
                            this.postDataFeilds.append(data.files[j].name, data.files[j]);

                        }
                    } else {
                        this.postDataFeilds.append(data.name, data.value);
                    }
                    break;


            }
            return this;

        };


        /**
         * Sets post data for this request
         * @param {Object | DOMDocument | HTMLFormElement | HTMLInputELement | T.Map} data . If the argument is a document
         * it could be either an HTML or XML document, in-which case the serever, recieves all
         * document data as POST data named numerically from 0 (zero)
         *
         * @return {TigerJS.io}
         *
         */
        this.set_data_feilds = function (data) {
            var i, j;
            if (this.set_data_feilds.length !== arguments.length) {
                err_str = " WrongArgumentCountError <> Function TigerJS.io#set_data_feilds " +
                        "Expects one {1} argument,  {" + arguments.length + "} given";
                throw new Error(err_str);
            }
            var dataType = T.type(data),
                    i, j;
            this.postDataFeilds = new FormData();


            switch (dataType) {
                case "TigerJS.Map":

                    for (i = 0; i < data.keys().length; i++) {
                        this.postDataFeilds.append(data.keys()[i], data.values()[i]);
                    }


                    break;

                case "Object":
                    if (data.documentElement) { //its a document
                        this.postDataFeilds.append("0", data.documentElement.textContent);

                    }
                    //else its a native object
                    for (i in data) {
                        if (data[i].nodeType) // a node refrenced in the object
                        {

                            this.add_data_feilds(data[i]);
                        } else {
                            this.postDataFeilds.append(i, data[i]);
                        }
                    }

                    break;

                case "HTMLFormElement":

                for (i = 0; i < data.elements.length; i++) {
                    //append elements with their values
                    this.postDataFeilds.append(data.elements[i].name, data.elements[i].value);

                    if (data.elements[i].getAttribute("type") === "file") { //if its a file element
                        //loop for multiple files selected
                        for (j = 0; j < data.elements[i].files.length; j++) {
                            this.postDataFeilds.append(data.elements[i].files[j].name, data.elements[i].files[j]);

                        }
                    }

                }

                case "HTMLInputElement":
                    if (data.getAttribute("type") === "file") { //if its a file element
                        //loop for multiple files selected
                        for (j = 0; j < data.files.length; j++) {
                            this.postDataFeilds.append(data.files[j].name, data.files[j]);

                        }
                    } else {
                        this.postDataFeilds.append(data.name, data.value);
                    }
                    break;


            }


        };
        //see if we have any initial request data to append
        if (configObj.postData) {
            this.set_data_feilds(configObj.postData);
        }
        if (configObj.queryData) {
            this.set_query_data(configObj.queryData);
        }

        /**
         
         *Abort the request
         *@return {TigerJS.io}
         */
        this.abort = function () {
            _object.abort();
            return this;
        };
        ////////etag and if not match stuff, and last modified stuff
        ///////////////////////////////////


        /*
         * @ignore
         */
        this.toString = function () {
            return "[object TigerJS.io]";
        };

    };
    return new rval(configObj); // strictly no need for new keyword by user
};

/**
 *
 * @class
 * The Serial request objects enables, the execution of multiple
 * request that are guranted to Run in sequence, each subsequent request are only executed on completion of the previous.
 * An operationComplete event is fired as each request is completed, and a complete event is fired
 * when all requests are completed, each request also has full XHR2 event support so you could
 * subscribe to all standard events
 * @param {Function} load This function is called with two arguments, each time
 * a Request in the list completes, the first argument is the text (load), and the second
 * is the numerical index of the request on the queue stating from 0 (zero),
 * <p/> When the queue runs to completion this function is called with the arguments
 *  load("loadcomplete", -1)
 *  @param {Function} error This function is called whenever an error occurs in the queue
 *  It is called with three parameters
 *  <br/>1. The error type This could be any of NETWORK_ERROR SERVER_ERROR or ObjectError
 *  <br/>2. An Error code
 *  <br/>3. The zero based index of the request that caused the error on the queue
 *
 *  @param {Function} progress This function would be called each time an upload progress
 *  event occurs during a request, it would be called with the the percentage data uploaded,
 *  and the index of the request
 
 *   @name TigerJS.io.SerialRequestQueue
 */
TigerJS.io.SerialRequestQueue = function (load, error, progress) {

    return new function () {
        //this array would hold all request instances
        var _io_queue = T.Iterator(),
                err_str,
                QUEUE_RUNNING = 0, //if the queue is in progress
                ERROR_STATE = 0, //an error occured on one of the request
                QUEUE_DONE = 0, // all said and done
                CURRENT_REQUEST_INDEX = null; //index of the current running request

        /**
         * Append data for a new request to the queue
         * @param {Object} configObj A confugiration object containing parameters
         * for this request, see the {@link TigerJS.io} documentation for details
         * @type TigerJS.io.SerialRequestQueue
         * @name TigerJS.io.SerialRequestQueue#appendRequest
         */

        this.appendRequest = function (configObj) {

            _io_queue[(_io_queue.size())] = configObj;

            //intercept standard events sending them to our internal callback
            //intercept error and complete events on thie current object
            if (_io_queue[_io_queue.size() - 1].subscribe.onload) {
                _io_queue[_io_queue.size() - 1].subscribe.deferedLoadEventHandler = _io_queue[_io_queue.size() - 1].subscribe.onload;
            }
            //add our own method to get the standard onload event
            _io_queue[_io_queue.size() - 1].subscribe.onload = this.registeredEvents.onload;

            if (_io_queue[_io_queue.size() - 1].subscribe.onerror) {
                _io_queue[_io_queue.size() - 1].subscribe.deferedErrorEventHandler = _io_queue[_io_queue.size() - 1].subscribe.onerror;
            }
            //add our own method to get the standard onerror event
            _io_queue[_io_queue.size() - 1].subscribe.onerror = this.registeredEvents.onerror;


            //also intercept the standard upload progress event
            if (_io_queue[_io_queue.size() - 1].subscribe.uploadprogress) {
                _io_queue[_io_queue.size() - 1].subscribe.deferedProgressEventHandler = _io_queue[_io_queue.size() - 1].subscribe.uploadprogress;
            }
            //add our own method to get the standard uploadprogress event
            _io_queue[_io_queue.size() - 1].subscribe.uploadprogress = this.registeredEvents.uploadprogress;

            _io_queue[_io_queue.size() - 1] = T.io(configObj);

            return this;
        };

        /**
         * Sends the requests in the queue
         
         * @name TigerJS.io.SerialRequestQueue#send
         *  @type TigerJS.io.SerialRequestQueue
         */

        this.send = function () {
            _io_queue.current().send();
            CURRENT_REQUEST_INDEX = _io_queue.key;
            QUEUE_RUNNING = 1;

            return this;
        };
        var send = this.send;

        /**
         * Abort the Queue cancelling any running requests, and deleteing
         * all attached requests
         * @type TigerJS.io.SerialRequestQueue
         * @name TigerJS.io.SerialRequestQueue#abortQueue
         
         */
        this.abortQueue = function () {

            _io_queue.current().abort();
            QUEUE_DONE = 0;

            CURRENT_REQUEST_INDEX = null;
            _io_queue = T.Iterator(); //reset to an empty queue
            return this;
        };
        var abortQueue = this.abortQueue;
        /*
         * We intercept xhr events here
         * @ignore
         */
        this.registeredEvents = {};

        /*
         *
         * @ignore
         */
        this.registeredEvents.onload = function () {
            //first see if we have  server error
            var error_codes = T.Iterator(["400", '401', "403", "404", '410', "501", "502", "503", "504", "505", "500", "302", "303"]);
            if (error_codes.indexOf(this.status.toString())) {
                abortQueue();

                if (error) //call general error handler
                    error("SERVER_ERROR", this.status, _io_queue.key);

                //call the on error handler for this request
                if (_io_queue.current().configObj.subscribe.deferedErrorEventHandler)
                    _io_queue.current().configObj.subscribe.deferedErrorEventHandler.apply(this, ["SERVER_ERROR", this.status]);
                ERROR_STATE = 1;
            } else {

                if (load)
                    load('load', _io_queue.key); //call the global load handler, if there is one

                //call the onload handler for this request
                if (_io_queue.current().configObj.subscribe.deferedLoadEventHandler)
                    _io_queue.current().configObj.subscribe.deferedLoadEventHandler.apply(this);

                if (_io_queue.next()) { //if there are more request's, send them
                    send();
                } else {
                    if (load) //wrap up
                        load('loadcomplete', -1);
                    QUEUE_DONE = 1;
                }
            }
        };

        /*
         *
         * @ignore
         */
        this.registeredEvents.onerror = function () {

            //check to see if we're offline
            if (T.NETWORK_STATE === "OFFLINE") {
                if (error)
                    error("NETWORK_ERROR", 0, _io_queue.key);

                if (_io_queue.current().configObj.subscribe.deferedErrorEventHandler)
                    _io_queue.current().configObj.subscribe.deferedErrorEventHandler.apply(this, ["NETWORK_ERROR", 0]);
            } else {

                if (error)
                    error(this.status ? "SERVER_ERROR" : "NETWORK_ERROR", this.status || 0, _io_queue.key);

                if (_io_queue.current().configObj.subscribe.deferedErrorEventHandler)
                    _io_queue.current().configObj.subscribe.deferedErrorEventHandler.apply(this, [this.status ? "SERVER_ERROR" : "NETWORK_ERROR", this.status || 1]);

            }
            abortQueue();
            ERROR_STATE = 1;
        };

        this.registeredEvents.uploadprogress = function (percentComplete) {

            if (progress) //if we have a progress function
                progress(percentComplete, _io_queue.key);
            if (_io_queue.current().configObj.subscribe.deferedProgressEventHandler)
                _io_queue.current().configObj.subscribe.deferedProgressEventHandler
                        .apply(this, [percentComplete, [CURRENT_REQUEST_INDEX]]); //



        };
    };
};
/**
 *
 * @class
 * The {@link TigerJS.io}.CompositeRequest object, allows multiple request to be sent
 * using a single XMLHttpRequest Object, and should be used when  when multiple resources needs
 * to be refreshed from the server possibly continously.
 * @param {...Object} configObjArgs A variable list configuration object(s) that specifies parameters
 * for request instances
 *  @param {String} [configObjArgs.uri = DOCUMENT URI] Each configObjArgs object must contain a uri for that request instance
 *  @param {Object | DOMDocument | HTMLFormElement | HTMLInputELement }  configObjArgs.postData  
 *  Post data for the particular request instance
 
 *
 * @param {Function} callback A function to be sent the result of the request
 * @param {String} configObjArgs.tag A string to tag or refer to this request instance
 * @param {Boolean} [configObjArgs.uniqueID = false] In cases where each configuration object could have identical tags, force a random value to be appended to each tag to make it unique
 * @return {Object} An object containing the result of all the request's sent, the properties would be named according to the tags used in the configuration objects
 * if the response contains an error and cant be converted to JSON the callback doesnt get called 
 *
 *
 *<pre>
 *Also note that in your server script the useragent would be set to TigerJS_Curl
 *</pre>
 *
 *
 * @requires PHP-ENABLED-WEB-SERVER
 * @name TigerJS.io.CompositeRequest
 *
 * @example
 *  //Assuming you have three scripts on the server, that recive XHR request, you can use thet T.io.CompositeRequest Object, to send a request to ALL three in just one request
 *
 *  //first create three objects that would hold properties (configurationdata) for each request
 *  
 *
 *  var configObj1 = {
 *    uri :"proccessor1.php", //the first server script,
 *    postData : {a: "hi", b:"bye"}, // the server script would see the post data with the keys a and b, so assuming in PHP u might use $_POST['a]' and $_POST['b']
 *    tag : "request_1"  // a tag to represent this request
 *  }
 *  
 var configObj2 = {
 *    uri :"proccessor2.php", //the first server script,
 *    postData : {a: "hee", b:"hoo"}, // the server script would see the post data with the keys a and b, so assuming in PHP u might use $_POST['a]' and $_POST['b']
 *    tag : "request_2"  // a tag to represent this request
 *  }
 *  
 var configObj3 = {
 *    uri :"proccessor2.php", //the first server script,
 *    postData : {a: 22, b:44}, // the server script would see the post data with the keys a and b, so assuming in PHP u might use $_POST['a]' and $_POST['b']
 *    tag : "request_3",  // a tag to represent this request
 *    
 *  }
 *  
 
 //put the three config objects in an array
 var req_data = [configObj1, configObj2, configObj3];
 
 //add a function to be called with the response when the request completes
 req_data[req_data.length] = function(resultObj){
 
 //the result object would contain properties corresponding to the tags used in each configObj above
 //so we would have three properties
 resultObj[request_1] ; //holding the output of the first request i.e from proccessor1.php
 resultObj[request_2] ; //holding the output of the second request i.e from proccessor2.php
 resultObj[request_3] ; //holding the output of the third request i.e from proccessor3.php
 }
 
 //next create the T.io.CompositeRequest Object
 //and send the  config-data
 var rq = T.io.CompositeRequest.apply(null, req_data );
 *  rq.send();
 *
 *
 *  //what has happened here is that the three server scipts has been called with one request (instead of three, which you would normally use manually)
 *
 * //they could be cases where the tags used in each configObj could be identical, in cases like this add a uniqueID property to each configObj
 * // when you do a value generated with Math.random(), would be concantated with the tag, so as to make it unique
 * //so for instance, configObj1 above could be created as thus
 *  var configObj1 = {
 *    uri :"proccessor1.php", //the first server script,
 *    postData : {a: "hi", b:"bye"}, // the server script would see the post data with the keys a and b, so assuming in PHP u might use $_POST['a]' and $_POST['b']
 *    tag : "request_1"  ,// a tag to represent this request
 *    uniqueID : true// force the tag to be unique
 *    
 *  }
 *
 * //After which in the call-back function
 * //the returned result-object might have a property like
 * resultObj[request_10.09897869868];// with random values appnded to the tag
 *  
 */
TigerJS.io.CompositeRequest = function () {

    var arguments_ = T.Iterator(arguments),
            arg = arguments; //save a reference to the request args.

    arguments_ = arguments_.slice(0, arguments_.length - 1); // pop d call back from the list as we dont need it here

    return new function () {
        var loopRequest, rePoll_timeout, xhr, cancelRequest = false,
                loopRequestCounter = 1, //default, perform the request only once
                postDataFeilds;


        /**
         * Should the rquest be looped, takes a positive numerical value or
         * -1 to loop forever
         *  @name TigerJS.io.CompositeRequest#loopRequest
         *  @function
         *  @param {Number] [val = 0}
         *  @type TigerJS.io.CompositeRequest
         *  
         */
        this.loopRequest = function (val) {
            loopRequest = val;
            return this;
        };



        var request_container = (T.Iterator()).
                add_all(arguments_), // hold references to all requests arguments to be sent
                globalConfigObj = {}, // a mashup-up of all configObj's for each request
                request_index_counter = 0;
        //get the details out of each config obj
        request_container.foward_iterator(
                function (x) {


                    //set the tag for the current request args as a pointer to a sub object,
                    //that would hold the details for that request


                    globalConfigObj[request_index_counter + "_" + x.tag + "_uri"] = x.uri || location.href; //save the uri for this virtual request instance
                    globalConfigObj[request_index_counter + "_" + x.tag + "_postData"] = x.postData ?
                            T.http_build_query(x.postData) : ""; //save the post-data for this virtual request instance
                    globalConfigObj[request_index_counter + "_" + x.tag] = x.tag || request_index_counter + "_tag_";


                    //add some randomness to the tags as various request instances could have similar tags   
                    globalConfigObj[request_index_counter + "_" + x.tag] += x.uniqueID === true ? Math.random().
                            toString() : "";
                    request_index_counter++;

                });
        //The number of rquests we're processing
        globalConfigObj.request_count = request_index_counter;

        //create the request object
        xhr = new XMLHttpRequest(),
                // add the data
                postDataFeilds = new FormData();


        for (var i in globalConfigObj) {
            postDataFeilds.append(i, globalConfigObj[i]);
        }
        xhr.open("POST", T.library_installation_path + "/asset/php/compositeRequestClass.php", true);

        xhr.addEventListener("load", function () { // parse the response and send to the cb

            //send the result object to the call back
            try {
                if (T.is_function(arg[arg.length - 1]))
                    arg[arg.length - 1](JSON.parse(this.responseText));//send the result to the user call-back function
            } catch (e) {

                xhr.abort();
                return;
            }

        });


        xhr.addEventListener("loadend", function () { // see if we are to iterate (poll)  the request several times
            if ((loopRequest && loopRequestCounter < loopRequest) || loopRequest === -1) {

                if (!cancelRequest) {
                    rePoll_timeout = setTimeout(rePoll, 5000); //leave a little delay
                } else {
                    if (rePoll_timeout) {
                        clearTimeout(rePoll_timeout);
                    }

                }



            } else {
                return; //end polling
            }
        });

        function rePoll() {
            var postDataFeilds = new FormData();


            for (var i in globalConfigObj) {
                postDataFeilds.append(i, globalConfigObj[i]);
            }
            xhr.open("POST", T.library_installation_path + "/asset/php/compositeRequestClass.php", true);
            xhr.send(postDataFeilds);

            ++loopRequestCounter; // increment this to reflect the num of request's made

        }

        xhr.addEventListener("error", function () { // parse the response and send to the cb
            //call the call back function
            (arg[arg.length - 1])({
                ERROR: "NET_ERR"
            });

        });

        /**
         *  Send the request
         *  @name TigerJS.io.CompositeRequest#send
         *  @function
         *  @type {TigerJS.io.CompositeRequest}
         */

        this.send = function () {
            xhr.send(postDataFeilds);
            return this;
        };
        /** 
         * 
         * Kill the object
         */
        this.abort = function () {

            xhr.abort();
            cancelRequest = true;

            return;

        };

    };

};