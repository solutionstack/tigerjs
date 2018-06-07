/* global TigerJS, T */
/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */


/**
 
 * @class This Object contains information on the browsers enviroment.
 * Typically it should contain the following feilds
 
 *
 * <pre>
 * 'OS' : The operating system in use //could be
 *         WINDOWS | WINDOWS_MOBILE | MAC | LINUX | ANDRIOD | SYMBIAN | IOS | WEBOS | BLACKBERRY | BSD
 *
 * 'BROWSER' : The browser in use, any of
 *         FIREFOX | EXPLORER | CHROME | COMMODO | OPERA | FLOCK |
 *          SAFARI |  NETSCAPE | AVANT | K_MELEON | FENNEC  |
 *          MOBILE_EXPLORER | MOBILE_SAFARI | MOBILE_OPERA
 | AMAYA | CAMINO | CHROMEPLUS | ICEAPE | ICECAT | ICEWEASEL |
 KONQUEROR | AMERICAN_ONLINE | AOL | ARORA | BONECHO |
 CHESIRE | EPIPHANY | GALEON| IRON | KAHEHAKSE | MOZILLA |
 SEAMONKEY | SHIIRA | KKMAN |THEWORLD | BSALSA | SMART_BRO
 | SLEIPNIR | SLIMBROWSER | ACOO | DEEPNET | LUNASCAPE |
 MAXTHON | CRAZY_BROWSER | WYZO |  MINEFIELD| SHIRETOKO | MIDORI
 
 * 'ENGINE' : The browser enfine
 *            TRIDENT | GECKO | PRESTO | WEBKIT
 * 'VERSION' : The browser version (float);
 
 * 'HTML5_API ' : If HTML5 API's are fully supported
 * 'SVG' : Boolean true if SVG is supported
 * 'isMOBILE : Boolean ti indicate if we're in a mobile enviroment
 *
 * //you can also test for the browser by doing
 *
 * if(T.ua.BROWSER_NAME) e.g. if(T.ua.FIREFOX)
 *
 * The {@link TigerJS.ua} object is static so you could simply access its properties.
 *
 * </pre>
 * @class
 */

TigerJS.ua = function () {
//    //
//....Quick and Dirty
    var doc = document, wn = window;
    this.BROWSER = "";
    this.VERSION = "undefined";
    this.isMOBILE = false;
   
    this.SelectorsAPI = false;
    this.HTML5_API = false;
    
    //lets get the HTML5 stuff out of the way
    if (!!document.createElement('canvas').getContext && !!document.createElement('video').canPlayType &&
            !!('localStorage' in window && window['localStorage']) && !!window.Worker && !!navigator.geolocation &&
            !!(window.history && history.pushState)
            ) {
        this.HTML5_API = true;
    }

//SVG
    !!(doc.createElementNS && !!doc.createElementNS("http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect)
            ? this.SVG = true
            : this.SVG = false;
    this.SelectorsAPI = !!doc.querySelector;
    doc = null;
    /// detect OS
    //
    //
    var ua = wn.userAgent;
    if ((/windows|win32/i).test(ua) && !(/ce/i).test(ua)) {
//ce stands for mobile , right???!!
        this.OS = 'WINDOWS';
    } else if ((/macintosh|mac_powerpc|mac/i).test(ua)) {

        this.OS = 'MAC';
    } else if ((/android/i).test(ua)) {
        this.isMOBILE = true;
        this.OS = 'ANDRIOD';
    } else if ((/symbos|symbian/i).test(ua)) {
        this.OS = 'SYMBIAN';
        this.isMOBILE = true;
    } else if ((/linux/i).test(ua)) {
        this.OS = 'LINUX';
    }
    if ((/iphone|ipod|ipad|silk|mobile safari/i).test(ua)) {
        this.OS = 'IOS';
        this.isMOBILE = true;
    }
    if ((/windows ce| wm\d\b| IEMobile|PIE/i).test(ua)) {
        this.OS = 'WINDOWS_MOBILE';
        this.isMOBILE = true;
    }
    if ((/webos/i).test(ua)) {
        this.OS = 'WEBOS';
        this.isMOBILE = true;
    }
    if ((/rim|blackberry|playbook|BB/i).test(ua)) {
        this.OS = 'BLACKBERRY';
        this.isMOBILE = true;
    } else if ((/bsd/i).test(ua)) {//free, open , blah!!
        this.OS = 'BSD';
    }
    if (/fennec/i.test(ua)) {

        this.isMOBILE = true;
    }





    this.ENGINE = null;
    //DETECT ENGINE
    //we use presto for any opera version old or new
    if (/opera|opr/ig.test(ua))
        this.ENGINE = "PRESTO";
    //GECKO, webkits ususally come as (like gecko), and opera spooks atimes
    if (/gecko/i.test(ua) && !(/like gecko/i).test(ua))
        this.ENGINE = "GECKO";
    //webkit
    //detect browser and browser version
    if (/webkit/i.test(ua) && !(this.ENGINE === "GECKO"))
        this.ENGINE = "WEBKIT";
    if (/msie|trident/i.test(ua) && !(this.ENGINE === "PRESTO"))
        this.ENGINE = "TRIDENT";
    //and finally get the browser, lots 'a' stuff


    ///IE AND OPERA FAMILY---
    //
    //IE could also match with any of its many clones, so we filter
    // as much as we can
    if (/msie/i.test(ua)
            && !(/opera|theworld|bsalsa|smart bro|Sleipnir|SlimBrowser|acoo|america online|aol|deepnet|kkman|lunascape|maxthon|Crazy Browser/i.test(ua))) {

        this.VERSION = /MSIE (\d{1,}.\d{1,})\b/.exec(ua)[1];
        if (this.OS === "WINDOWS_MOBILE") {
            this.BROWSER = "MOBILE_EXPLORER";
        } else {
            this.BROWSER = "EXPLORER";
        }
//check if we have a clone
    } else if (!!(z = (/theworld|bsalsa|smart bro|Sleipnir|SlimBrowser|acoo|america online|aol|kkman|lunascape|maxthon|Crazy Browser/i.exec(ua)))) {
        this.BROWSER = z[0].toUpperCase().replace(" ", "_"); //no spaces allowed

        if (this.BROWSER === "SLEIPNIR") {//unique case
//get the version number after the name
            this.VERSION = parseFloat(/Sleipnir\/(\d{1,}.*)*\b/.exec(ua)[1]);
        }

    }
//get versions for opera'ssss;; yes 'sss
//THE BELOVED OPERA MINI, shoutout to all ya'll -mod- fans  outthere!! :)
    if (/mini|mobi|mobile/.test(ua) && this.ENGINE === "PRESTO") {
        this.isMOBILE = true;
        this.BROWSER = "MOBILE_OPERA";
    }
    if (/Opera\/9.80/.test(ua) || /Opera Mobi/.test(ua)) {
//for 9.80 or mobile, version number is after the Version string
        this.VERSION = /Version\/(\d{1,2}.\d{1,2})\b/.exec(ua)[1];
        this.BROWSER = "OPERA";
    }

//opera 10 alpha and lower
    if ((z = /Opera\/(\d{1,2}.\d{1,2})\b/.exec(ua))) {

        if (z[1] !== "9.80")
            this.VERSION = z[1];
        this.BROWSER = "OPERA";
    }
//more recent webkit based operas
    if (z = /OPR\/(\d{1,2}.\d{1,2})/gi.exec(ua)) {
        this.VERSION = z[1];
        this.BROWSER = "OPERA";
    }


//for opera in spook mode, yeah playing mozilla or IE
    if (!!(z = /Opera (\d{1,2}.\d{1,2})\b/.exec(ua))) {
        this.VERSION = z[1];
    }
//and lastly for opera mini
    if (/Opera Mini/.test(ua)) {
        this.VERSION = parseFloat(ua.substr(ua.indexOf("Opera Mini") + 11, 4));
    }
    z = null;
//now llets get firefoxy
//

    if (this.ENGINE === "GECKO") {

//this are usually based on gecko
        if (!!(z = /K-Meleon|palemoon|galeon|camino|epiphany|wyzo|seamonkey|shiretoko|navigator|iceweasel|icecap|iceape|lunascape|midori|minefield|Sleipnir|fennec/i.exec(ua))) {

            this.VERSION = parseFloat(ua.substr(ua.indexOf(z[0]) + z[0].length + 1, 4));
            this.BROWSER = z[0].toUpperCase().replace("-", "_"); //the name

        } else if (/firefox|firebird/i.test(ua) && !z) {
//non of the clones matched above lets get firefox
            this.VERSION = parseFloat(ua.substr(ua.indexOf("Firefox/") + 8, 4));
            this.BROWSER = /firebird/.test(ua) ? "FIREBIRD" : "FIREFOX";
        } else {//default BIG BROTHER MOZIIIIIILLLLAAAA!!!

            this.VERSION = parseFloat(ua.substr(ua.indexOf("rv:") + 4, 4));
            this.BROWSER = "MOZILLA";
        }
        z = null;
    }//end gecko browsers/version detection



//lastly detect webkit/khtml browsers and their versions
    if (this.ENGINE === "WEBKIT") {

        if (/Version/.test(ua) && !(/epiphany|Comodo_Dragon|ChromePlus|Chrome/i.test(ua))) {
            this.BROWSER = /omniweb/i.test(ua) ? "OMNIWEB" : "SAFARI";
            this.VERSION = parseFloat(ua.substr(ua.indexOf("Version/") + 8, 4));
        }
        if (!(/opr/i.test(ua)) && (/silk|epiphany|Comodo_Dragon|ChromePlus|Chrome/i.test(ua)) && !/Version/.test(ua)) {

            z = /silk|epiphany|Comodo_Dragon|ChromePlus|Chrome/i.exec(ua)[0];
            this.BROWSER = z.toUpperCase();
            this.VERSION = parseFloat(ua.substr(ua.indexOf(z) + z.length + 1, 4));
        }
        if (this.isMOBILE) {


            if (!/rim|playbook|android|blackberry|bb/gi.exec(ua))
                this.BROWSER = /silk/i.exec(ua) ? "Silk" : "MOBILE_SAFARI"; //iStuff


            z = null;
        }
    }


//#todo: other browsers as they come
//4got UC-WEB

//set the current browser as a PROPERTY so we could do
//if T.ua.K_MELEON or if T.ua.SAFARI
//
    this[this.BROWSER] = true;
    //return  the funky (super, duuper) userAgent Object


};
TigerJS.ua = new TigerJS.ua();
