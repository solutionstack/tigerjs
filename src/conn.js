/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library
 * @@https://sourceforge.net/p/tigerjs> */
/**
 *
 *
 * @class Base Object for network monitoring and reporting interfaces
 * @class
 */
TigerJS.Conn = {
  /**
   * Current network state [offline | online].<br/>
   * instead of querying this propertry directly, it is
   * recomended to subscribe to network state events
   */
  state: null,
  /**
   *@ignore
   */
  SubscrptionList:
      T.Iterator(),  // list of functions to report network state activity to

  /**
   * Subscribe to network state events.
   *
   *This method allows the monitoring of network activities, just send a comma
   *seperated
   *list of functions references and this functions would be called whwnever a
   *network state changes
   *An object is sent to the functions, whenever a supported network event is
   *detected,
   *Currently it only detects changes in the network offline and online states,
   *so a simple
   *Object with one feild 'state' which value is either offline or
   *online is sent as argument depending on the state of the network
   *@param {...Function} args A variable list of function references
   */
  subscribe: function(args) {  // subscribe to the net monitor event

    this.SubscrptionList.add_all(arguments);
  },
  /**
   *Unsubscribe from network state events.
   *
   *Unsubscribe a list of functions registered with {@link
   *T.net.monitor.subbscribe},
   *so they don't receive any more network events messages
   *@param {...Function} args A variable list of function references
   */

  unSubscribe: function(args) {  // unsubscribe from the net monitor event

    this.SubscrptionList = this.SubscrptionList.without(T.Iterator(arguments));
  },
  /**
   *@ignore
   *Method to periodically update properties of the network state
   *
   */
  update: function() {

    var client = new XMLHttpRequest(), d = new Date(), t;
    // make a head request to this page, taking care not to duplicate the -?-
    // (question mark)
    // in the url if its already there, also avoid caching by using a timestamp
    try {
      client.open("HEAD", window.location);
      client.send();
      d = null;
    } catch (e) {
    }

    /*f*
     *@ignore
     */
    client.onreadystatechange = function() {  //

      try {
        // IE and related
        // sometimes checking for the 12029 code in IE dosent work for unknown
        // reasons
        // so we back it up with statusText which would be unknown when the
        // connection is down
        if (window.ActiveXObject &&
            (this.status === 12029 || this.statusText === "Unknown")) {
          client.abort();
          // update functions that are mean to recieve this event
          if (true === T.Conn.state ||
              T.Conn.state === null) {  // send info to callbacks only when the
                                        // state changes, or its the first time
                                        // (i.e null)
            if (T.Conn.SubscrptionList.size()) {  // if we have a non-zero size
                                                  // meaning functions have been
                                                  // registered
              T.Conn.SubscrptionList.walk(function(x) {

                x({state: 'offline'});

              });
            }
          }

          T.Conn.state = false;
          setTimeout(T.Conn.update, 1500);
          return;
        }

        if ((this.readyState === 4 &&
             this.status === 0)) {  // no connection, standard

          client.abort();

          // update functions that are mean to recieve this event
          if (true === T.Conn.state ||
              T.Conn.state ===
                  null) {  // send info to callbacks only when the state changes

            if (T.Conn.SubscrptionList.size()) {  // if we have a non-zero size
                                                  // meaning functions have been
                                                  // registered
              T.Conn.SubscrptionList.walk(function(x) {

                x({state: 'offline'});


              });
            }
          }

          T.Conn.state = false;
          setTimeout(T.Conn.update, 1500);
          return;
        }

        if (((this.status >= 200 && this.status <= 226) ||
             this.status === 304) &&
            this.readyState === 4) {  // OK

          client.abort();
          // update functions that are mean to recieve this event
          if (!T.Conn.state) {  // send info to callbacks only when the state
                                // was previously false/null, and now changing
                                // to true

            if (T.Conn.SubscrptionList.size()) {  // if we have a non-zero size
                                                  // meaning functions have been
                                                  // registered
              T.Conn.SubscrptionList.walk(function(x) {
                x({state: 'online'});
              });
            }
          }

          T.Conn.state = true;
          setTimeout(T.Conn.update, 2000);
          return;
        }

      } catch (e) {
        // alert(e);
      }

    };
  }
};
/**
 * The current network state
 *  can be either constants _T_NET_ONLINE  or _T_NET_OFFLINE
 *
 *
 */
TigerJS.NETWORK_STATE = null;
/*
 *@ignore
 **/
var _T_NET_ONLINE = "ONLINE",  // should we be using globals?, no indulging now,
                               // jim!!!.???:), who's jim??.
    _T_NET_OFFLINE = "OFFLINE";