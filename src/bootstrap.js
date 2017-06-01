/* global TigerJS, T, _T_NET_OFFLINE, _T_NET_ONLINE */
/******************************* START BOOTSTRAP*************************************/
(function () {

    //set the localinstallation path
    ////library base path

    for (var i = 0; i < document.scripts.length; i++) {
        if (document.scripts[i].src.strpos("tiger") !== -1) {


            T.library_installation_path = document.scripts[i].src.substr(0,
                    document.scripts[i].src.strrpos("/"));

        }
    }


    //insert our css base-file before the dom is ready
    var css_base = T.library_installation_path + "/asset/css/tiger.min.css";
    T.Parser.parse_css("<link rel='stylesheet' type='text/css' href='" + css_base + "' />", true);



    //subscribe to network state monitoring...
    T.Conn.subscribe(function (x) {

        if (x.state === "online") {
            TigerJS.NETWORK_STATE = _T_NET_ONLINE;
        } else if (x.state === "offline") {
            TigerJS.NETWORK_STATE = _T_NET_OFFLINE;
        }
    });
    //initialize network monitoring routine
    T.Conn.update();

    //execute registered startup routines, once the page loads ..(onDomReady)
    T.poll(T.dom_ready, T.execute_startup_routines);
    T.poll(T.dom_ready, insert_svg_icons);
    ///...... more bootstrap actions

})();


/**********************************END   BOOTSTRAP **********************************/

//insert icon moon glyphs
//#Deprecated iconmoon font file , on 9/24/2016, by Olubodun Agbalaya <s.stackng@gmail.com><agbalaya@users.sourceforge.net>
// well I included tons of SVG files to replace the font files as the tiny (<5kb) svg files would be quicker to load
// than the .woff of .ttf files, would need to put it in the docs so users know how to access the svg files in their projects
// from html they'll need use the class T-icons-...
// so for instance the 'person' icon might be used as class="T-icons-person " and the substitution/insertion of the actual SVG file would take place on page load
// 
/**    
 * 
 * 
 leave this here for now (or for prosperity.. :/)
 T.Parser.parse_css("<link rel='stylesheet' type='text/css' href='" + glyph_base + "' />", true);
 **/

function insert_svg_icons() { //insert SVG icons refrenced in HTMLElements class values as T-icons-*

    //get all images
    var docImages = T.Iterator(document.querySelectorAll("[class*='T-icons']"));


    var svgImages = T.Iterator();

    //loop through iterator checking for svg links in images 
    var requestConfigurationData = []; // data for the io.CompositeRequest object

    docImages.walk(function (x) {
        x = T.$(x);

        //make sure we havent done the svg replacement for this node before
        if (x.nodeName === "svg" || x.first_element_child().nodeName === "svg")
            return;


        //put the classes for this element into an iterator and get the value for the icon class
        var T_ICON_CLASS = T.Iterator(x.className.split(" ")).at(T.Iterator(x.className.split(" ")).str_index_of("T-icons-"));


        requestConfigurationData[requestConfigurationData.length] = {
            uri: T.library_installation_path + "/asset/font/" + T_ICON_CLASS + ".svg",
            tag: T_ICON_CLASS.substring(T_ICON_CLASS + 2),
            //use the image's name as our tag
            uniqueID: true

        };
        svgImages.add(x);


    });


    if (svgImages.length === 0) { //if they are no images to swap
        return;
    }


    //create a call back as the last element on the configuration array
    requestConfigurationData[requestConfigurationData.length] =
            function (responseData) {

                var SVGNodesArray = T.Iterator();
                //once the json data has arrived
                //parse the svg markup and create svg elements
                for (var i in responseData) {


                    responseData[i] = ((new DOMParser()).parseFromString(responseData[i], "image/svg+xml")).firstElementChild;
                    SVGNodesArray.add(responseData[i]);

                    if (undefined === responseData[i]) { //some browsers might not implement the DOMParser API to spec
                        responseData[i] = T.create(responseData[i]).firstElementChild; // use T.create to convert each string markup to a corresponding SVG dom node

                        SVGNodesArray.add(responseData[i]);
                    }



                }

                var w, h;


                for (var i = 0; i < svgImages.length; i++) {   /** remove any internal stylesheets from the SVG markup*/
                    var _curPlaceHolderStyle = svgImages[i].get_style();
                    try {


                        for (var j = 0; j < SVGNodesArray[i].children.length; j++) {

                            if (SVGNodesArray[i].children[j].hasAttribute("style")) {
                                SVGNodesArray[i].children[j].removeAttribute("style");
                            }
                            if (SVGNodesArray[i].children[j].hasAttribute("fill")) {
                                SVGNodesArray[i].children[j].removeAttribute("fill");
                            }


                            if (SVGNodesArray[i].children[j].nodeName === "style") {
                                SVGNodesArray[i].children[j].parentNode.removeChild(SVGNodesArray[i].children[j]);

                            }
                            if (SVGNodesArray[i].children[j].children.length) { //recure into deeper into the svg structure to search for style sheets



                                for (var k = 0; k < SVGNodesArray[i].children[j].children.length; k++) {

                                    if (SVGNodesArray[i].children[j].children[k].nodeName === "style")
                                        SVGNodesArray[i].children[j].children[k].parentNode.removeChild(SVGNodesArray[i].children[j].children[k]);


                                    if (SVGNodesArray[i].children[j].children[k].hasAttribute("style")) {
                                        SVGNodesArray[i].children[j].children[k].removeAttribute("style");
                                    }
                                    if (SVGNodesArray[i].children[j].children[k].hasAttribute("fill")) {
                                        SVGNodesArray[i].children[j].children[k].removeAttribute("fill");
                                    }
                                }
                            }
                            //:) sweet recursion

                        }

                        if (svgImages[i].id) {

                            SVGNodesArray[i].id = svgImages[i].id;
                        }
                        if (svgImages[i].className) {

                            SVGNodesArray[i].setAttribute("class", svgImages[i].className);
                        }



                        if (svgImages[i].style["width"])
                            SVGNodesArray[i].setAttribute("width", svgImages[i].style["width"]);
                        else
                            SVGNodesArray[i].setAttribute("width", "20px");

                        if (svgImages[i].style["height"])
                            SVGNodesArray[i].setAttribute("height", svgImages[i].style["height"]);
                        else
                            SVGNodesArray[i].setAttribute("height", "20px");

                        SVGNodesArray[i].style.setProperty("vertical-align", "text-top");
                        ;

                        /** insert the SVG icons */
                        if (svgImages[i].nodeName === "IMG") {//for image tags replace the actual image elements
                            svgImages[i].parentNode.replaceChild(SVGNodesArray[i], svgImages[i]);

                        } else {

                            if (svgImages[i].firstChild)
                                svgImages[i].insertBefore(SVGNodesArray[i], svgImages[i].firstChild); //for all others just add as a first-child
                            else {

                                svgImages[i].appendChild(SVGNodesArray[i]);

                            }

                        }

                        /** inherit CSS properties from the placeholder element like fill/color and size i.e width height */
                        /** make the inheritance recursive */
                        if (_curPlaceHolderStyle ["fill"]) {

                            for (var j = 0; j < SVGNodesArray[i].children.length; j++)
                                SVGNodesArray[i].children[j].style.setProperty("fill", _curPlaceHolderStyle ["fill"], "important");

                        } else if (_curPlaceHolderStyle ["color"]) {
                            for (var j = 0; j < SVGNodesArray[i].children.length; j++)
                                SVGNodesArray[i].children[j].style.setProperty("fill", _curPlaceHolderStyle ["color"], "important");

                        }


                    } catch (e) {

                    }
                }

                ;
            };


    //create the request object to get the data, in this case the real SVG tags
    var r = T.io.CompositeRequest.apply(window, requestConfigurationData);
    r.send(); //send the composite request
}


T.insert_svg_icons = insert_svg_icons; //so we can reference it globally