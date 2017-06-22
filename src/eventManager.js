 
/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

/**
 * @ignore
 * @class
 * Event management constructor classs
 * This class provies implementations for cross-browswer event abstraction, creating and firing custom
 * listening to custom avents and much more. You would normally not use this class directly
 * (for DOM Elements) but use methods like {@link TigerJS.$#on} and {@link TigerJS.$#on_key}
 * @constructor
 */
TigerJS.EventManager = function () {

    // Make sure the event object has a hasOwnProperty method
    if (!('hasOwnProperty' in Event.prototype)) {
        addHasOwnProperty(event);
    }
    if (!('stopPropagation' in Event.prototype)) { //IE hack
        Event.prototype.stopPropagation = function () {
            this.cancelBubble = true;
        };
        Event.prototype.stopImmediatePropagation = function () { //IE again
            this.cancelBubble = true;
            this.immediatePropagationStopped = true;
        };
    }
    if (!('preventDefault' in Event.prototype)) {
        Event.prototype.preventDefault = function () {
            this.returnValue = false;
        };
    }

//
//W3C_DOM3_EVENT_KEY MAP. for detecting single key onpress events
    var W3c_key_map = {},
            //combo keys map
            combo_map = {
                metaKey: true,
                altKey: true,
                ctrlKey: true,
                shiftKey: true
            },
            cb, //current callback function
            x_listener, //if its one of our synthetic event, then this would hold the real user callback,
            x_capture,
            _bubble_action,
            x_once, // dispatch event only once,
            x_target, ///the current event target
            x_type, //the event type
            x_keyCommand, //event name part for keyXXX or mouseXXX events
            x_keyVal, //time period for keyXXX or mouseXXX events
            _e_type, //sysnthetic event type
            _keyDown, //helpers
            _keyDownCancel, keyDownTimerObject,
            ////helpers
            _charCode = null,
            _keyCode = null,
            extra_argv = null, // extra arguments for the user call back function
            //standard DOM-2/3/.. EVENTS
            //
            events_std_dom2 = T.Iterator(["focus", "blur", "dblclick", "click", "mousedown", "mouseup",
                "mouseover", "mousemove", "mouseout", "keypress", "mouseleave", "mouseenter", "textinput",
                "keydown", "keyup", "submit", "reset", "select", "change", "resize", "scroll", " abort", "load",
                "focusin", "focusout", "unload", "wheel", "mousewheel", "contextmenu",
                "progress", "loadstart", "timeout", "loadend", "error", "touchstart", "touchend",
                "touchmove", "touchcancel", "animationstart", "animationend", "animationiteration",
                "webkitAnimationStart", "webkitAnimationEnd", "webkitAnimationIteration", "mozAnimationStart",
                "mozAnimationEnd", "mozAnimationIteration", "MSAnimationStart", "MSAnimationEnd", "MSAnimationIteration",
                "transitionend", "webkitTransitionEnd, mozTransitionEnd, oTransitionEnd"]),
            ///private
            ///add Event abstraction Layer, accepts -event type, and callback, cancleBubbleAction,  cancelDefaultValueAction
            ///and once -whch speciies if the event should happen once
            //real listener would only be passed for synthetics..
            /*
             *@ignore
             */
            addListener = function (target, type, callBack, _bubble, once, _h_arg) {
//IE 9 and Above, we dont support attachEvent

                cb = callBack;

                x_target = target;
                _bubble_action = _bubble == false ? false : true; // default action

                x_once = !!once;
                x_type = type;
                extra_argv = _h_arg;

                //add this event plus the callBack to the Event handlers List on the element
                //so the event could be removed later
                //take care not to duplicate
                if (!target.EvHandlers) {
                    target.EvHandlers = T.Iterator();
                    target.EvHandlers.add(callBack); //and add the user function to the list
                    //of registered Handlers

                } else if (!target.EvHandlers.contains(callBack)) {//create if it doesnt exist yet
                    target.EvHandlers.add(callBack);
                }

//here we simulate mouse- enter and leave events cuz it aint supported by all Browsers
                if (target.addEventListener) {
                    if (type === "mouseenter" && !("mouseenter" in target)) {
                        target.mouseSyn = true;
                        target.addEventListener("mouseover", std_callBack_redirect);

                    } else if (type === "mouseleave" && !("mouseleave" in target)) {
                        target.mouseSyn = true;
                        target.addEventListener("mouseout", std_callBack_redirect);


                    } else {

                        target.addEventListener(type, std_callBack_redirect);

                    } //old IE
                } else {
                    if (type === "mouseenter" && !("mouseenter" in target)) {
                        target.mouseSyn = true;
                        target.attachEvent("onmouseover", std_callBack_redirect);

                    } else if (type === "mouseleave" && !("mouseleave" in target)) {
                        target.mouseSyn = true;
                        target.attachEvent("onmouseout", std_callBack_redirect);


                    } else {


                        target.attachEvent("on" + type, std_callBack_redirect);
                    }
                }

            },
            /*
             *@ignore
             */
            normalize_event = function (eventObject) {
                var e = T.clone( eventObject);
                var keys = getKey(e); //normalize the DOM3 key and char values
                e['key'] = keys.key;
                e["char"] = keys["char"];
                e["_char"] = keys["_char"];
                //normalize the event object,
                try {
                    if (e.fromElement) {
                        e.fromElement = T.$(e.fromElement);
                    }
                    if (e.toElement) {
                        e.toElement = T.$(e.toElement);
                    }
                } catch (f) {//assignment to read-only property error

                }
                try {
                   
                    
                    e.relatedTarget = getRT(e);
                    e.timeStamp = (new Date).getTime();
                    e.target = T.$(e.currentTarget || e.srcElement || e.target);
                    e.clientX = e.clientX || e.Y || this.changedTouches[0].pageY;
                    e.clientY = e.clientY || e.X || this.changedTouches[0].pageX;
                    e.defaultPrevented = e.defaultPrevented || e.returnValue;

                } catch (f) {
                }

                return e;
            },
            /*
             *@ignore
             */
//get The key that was depressed
            getKey = function (eventObject) {
                var x, keyCode = eventObject.which || eventObject.keyCode; // firefox doesnt set keyCode, uggghhh

                if ((keyCode >= 65 && keyCode <= 90) //A-Z
                        || (keyCode >= 97 && keyCode <= 122) //a-z. this overlaps some Fx keys
                        || (keyCode >= 48 && keyCode <= 57) //0-9
                        && eventObject.type === "keypress") {

                    eventObject.key = eventObject["char"] = eventObject["_char"] = String.fromCharCode(keyCode);
                }
//match punctuations
                if ((x = String.fromCharCode(keyCode)).search(/\|[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\;\:\'\"\,\<\.\>\/\?\\]/g) !== -1
                        && eventObject.type === "keypress") {

                    eventObject.key = eventObject["char"] = eventObject["_char"] = String.fromCharCode(keyCode);
                }

                if (eventObject.type === "keydown") { //we detect these only on keydown events

                    switch (keyCode) { //according to DOM-3 specs we use unicode characters for "char"
//when a key is a printable control character


                        case 8 :
                            eventObject.key = "BackSpace";
                            eventObject["char"] = "\u0008"; //
                            eventObject["_char"] = "\u0008"; //
                            break;
                        case 9 :
                            eventObject.key = "Tab"; //horizontal
                            eventObject["char"] = "\u0009";
                            eventObject["_char"] = "\u0009";
                            break;
                        case 13 :
                            eventObject.key = "Enter";
                            eventObject["char"] = "\u0013"; //SHOULDNT WE HAVE A NEW LINE AS CAR HERE
                            eventObject["_char"] = "\u0013"; //SHOULDNT WE HAVE A NEW LINE AS CAR HERE
                            break;
                        case 16 :
                            eventObject.key = "Shift";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 17 :
                            eventObject.key = "Control";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 18 :
                            eventObject.key = "Alt";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 20 :
                            eventObject.key = "CapsLock";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 27 :
                            eventObject.key = "Escape";
                            eventObject["char"] = "\u001B";
                            eventObject["_char"] = "\u001B";
                            break;
                        case 32 :
                            eventObject.key = "SpaceBar";
                            eventObject["char"] = "\u0020";
                            eventObject["_char"] = "\u0020";
                            break;
                        case 33 :

                            eventObject.key = "PageUp";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 34 :

                            eventObject.key = "PageDown";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 35 :

                            eventObject.key = "End";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 36 :

                            eventObject.key = "Home";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 37 :

                            eventObject.key = "Left";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 38 :

                            eventObject.key = "Up";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 39 :

                            eventObject.key = "Right";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 40 :

                            eventObject.key = "Down";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 45 :

                            eventObject.key = "Insert";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 46 :

                            eventObject.key = "Delete";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 47 :

                            eventObject.key = "Help";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 93 :

                            eventObject.key = "Select";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 112 :

                            eventObject.key = "F1";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 113 :

                            eventObject.key = "F2";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 114 :

                            eventObject.key = "F3";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 115 :
                            eventObject.key = "F4";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 116 :
                            eventObject.key = "F5";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 117 :
                            eventObject.key = "F6";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 118 :
                            eventObject.key = "F7";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 119 :
                            eventObject.key = "F8";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 120 :
                            eventObject.key = "F9";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 121 :
                            eventObject.key = "F10";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 122 :

                            eventObject.key = "F11";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 123 :

                            eventObject.key = "F12";
                            eventObject["char"] = "";
                            break;
                        case 124 :

                            eventObject.key = "F13";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                        case 125 :

                            eventObject.key = "F14";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                        case 126 :

                            eventObject.key = "F15";
                            eventObject["char"] = "";
                            eventObject["_char"] = "";
                            break;
                            //end key-codes stuff ,phew!!

                    }
                }

                return eventObject;
            },
            //get the related Target
            /*
             *@ignore
             */
            getRT = function (e) {

//qxoodoo based function
                if (e.relatedTarget !== undefined)
                {
// In Firefox the related target of mouse events is sometimes an
// anonymous div (or is it part of the chrome?? inside of a text area, 
// which raises an exception if the nodeType is read. 
// This is why the try/catch block is needed.
                    try {
                        if (e.relatedTarget && e.relatedTarget.nodeType) {
                            return T.$(e.relatedTarget);
                        }
                    } catch (e) {
                        return null;
                    }


                } else if (e.fromElement !== undefined && e.type.search(/(over|enter)$/g !== -1)) {
                    return T.$(e.fromElement);
                } else if (e.toElement !== undefined && e.type.search(/(out|leave)$/g !== -1)) {
                    return T.$(e.toElement);
                }
                return null;
            },
            /*
             *@ignore
             * @private
             */
            std_callBack_redirect = function (e) {//these function handles bubbling, default-action control

//handle event cancellation behaviour defore calling user callback

                //dont prevent default for events like touchmove
                if (_bubble_action === false) {

                    e.stopPropagation();

                }



//normalize
                e = normalize_event(e);
                //check if the handler is still registered, and we also check its an enter/leave event
                //	for those browsers that dont support it natively
                if (x_target.EvHandlers.contains(cb) && x_type.search(/enter|leave/g) !== -1 && e.target.mouseSyn) {

//all this mess is needed to properly simulate
//an enter /leave event
                    if (!e.relatedTarget || e.relatedTarget.tagName.search(/html|body/i) !== -1
                            || (e.relatedTarget === e.target.parentNode) ||
                            T.$(e.target.parentNode).contains_node(e.relatedTarget)) {

                        extra_argv ? cb.apply(e, extra_argv) : cb.apply(e); //call the user call-back using
                        // the event object as the 'this' context

                    }
                } else if (x_target.EvHandlers.contains(cb) && x_type.search(/enter|leave/g) === -1) {
                    extra_argv ? cb.apply(e, extra_argv) : cb.apply(e); //call the user call-back using
                    // the event object as the 'this' context, and pasing extra arguments if available

                }


                if (x_once) {
                    //after calling the callback check if we're to emit this event only once
                    x_target.removeEventListener(x_type, std_callBack_redirect, false);
                    x_target.off(x_type, cb);
                }


            };

///accept initialization parameters from DOM-CLASS, TigerJS.$ -> "on" method
    /*
     * @ignore
     * This method accepts initialization parameters for an event
     */
    this.init = function (target, _type, listener, _bubble, once, extra_arg) {

//first find-out how many events where sent
        var type = _type.explode(" ");


        for (var i = 0; i < type.length; i++) {
//This function accepts this initialization commands for the event
//
//Lets see if its one of our custom functions
            if (events_std_dom2.str_index_of(type[i]) >= 0) { //if its a regular event

                //change click to touchend for mobile
                if (type[i].replace(/^on/, "") === "click") {
                    if ("touchend" in target)
                        type[i] = "touchend";
                }



                //remove the on at the begining of the event name, if one is there
                addListener(target, type[i].replace(/^on/, ""), listener, _bubble, once, (extra_arg || ""));


            } else {//else its a user defined event just add the listener to the cache for that particular event
                if (!target[("event_cache_" + type[i])]) {

                    target[("event_cache_" + type[i])] = T.Iterator().add(listener);
                } else if (!target[("event_cache_" + type[i])].contains(listener)) { //dont duplicate listeners

                    target[("event_cache_" + type[i])].add(listener);

                }
            }



        }
        ;
    };
    return this;
};