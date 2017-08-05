/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2016 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */

/**
 * @class
 * This class implements a file upload widget that supports upload accelerateion capabilities,
 * the decision to accelerate utilizing parallel file chunks or proceed in serial mode
 * is taken automatically
 * @param {Object} configurationOptions  An object contaning configuration parameters for this widget
 * @param {Object} configurationOptions.args  Object containing extra data to be recieved by the user script on the server,
 *                                            the object would be recieved in JSON format in a POST variable uploadArgs
 * <pre>
 *  //assuming your server script specified in the action parameter is a PHP file
 *  //you'll access the args object as
 *
 *  $_POST["uploadArgs"]; //the data here is in JSON format, so should be JSON decoded
 *
 * // and all other files
 *  in the $_FILES Super Gblobal
 *  
 *  //this server script also recieves a unique id representing this upload session as
 *  $_POST["upload_session_id"];
 *  
 *  </pre>
 
 *
 * @param {Number} [configurationOptions.uploadLimit = 300]  Maximum size in (MB) of all uploads must be less than or equal to 300
 * @param {Function} configurationOptions.onuploadStart  Function to call When the file-upload process begins
 * @param {Function} configurationOptions.onuploadComplete  The upload stage has completed, but files are still being merged on the sever
 * @param {Function} configurationOptions.onsuccess  Upload to the server and file-merging have completed on the server side also the user 
 *                                                    defined script has recieved the files, the output from
 *                                                    the user defined server script (as sent in the <font color='red' >configurationOptions.action</font>)
 *                                                   is returned to this Callback
 * @param {Function} configurationOptions.onerror   Function to call on error state
 *  @param {String} [configurationOptions.accept = all] The category of files to allow  
 * <pre>
 *  possible values are
 *  image | audio | video | all
 *
 *        </pre>
 
 * @param {Boolean} [configurationOptions.noDropZone = false] Control if the drop zone is allowed, The drop zone is automatically disabled for mobile devices
 * @param {CSSColor} [configurationOptions.progressColor=#00008B] The color of the upload-progress bars
 * @param {URL} configurationOptions.action A user implemented server script to be called, and sent the uploaded files.
 *                                          This script only sees the final files, when each chunk has been uploaded/recombined
 *                                          on the server. <font color='red' >This file must be given as absolute path  </font >
 *
 *
 
 *
 * @extends TigerJS.UI.Widget
 * <pre>
 * Note<font style='color:red'>*</font>
 * Combined file size is currently limited to 300MB for performance
 *
 * Also the uploaded chunks are handle by a PHP script (for now, to be replaced by a C++ CGI script)
 * so ensure your you set the Memory limit for running PHP script High enough - I recommend a minimum of 512MB, 1GB of Ram or more is prefarable 
 * </pre>
 *
 */

TigerJS.UI.Widget.FileUploadWidget = function(configurationOptions) {

    function __fileUploadWidget(configurationOptions) {

        var fileCategory = configurationOptions && configurationOptions.accept ?
            configurationOptions.accept : "all",
            progBarColor = configurationOptions && configurationOptions.progressColor ?
            configurationOptions.progressColor : "#00008B",
            isDropZoneAllowed = configurationOptions && configurationOptions.noDropZone ?
            !configurationOptions.noDropZone : true,
            actionURL = configurationOptions && configurationOptions.action ?
            configurationOptions.action : false,
            successCB = configurationOptions && configurationOptions.onsuccess ?
            configurationOptions.onsuccess : false,
            uploadStartCallback = configurationOptions && configurationOptions.onuploadStart ?
            configurationOptions.onuploadStart : false,
            onuploadComplete = configurationOptions && configurationOptions.onuploadComplete ?
            configurationOptions.onuploadComplete : false,
            errorCallback = configurationOptions && configurationOptions.onerror ?
            configurationOptions.onerror : false,
            uploadArgs = configurationOptions && configurationOptions.args ?
            configurationOptions.args : false,
            uploadLimit = configurationOptions.uploadLimit && parseInt(configurationOptions.uploadLimit) <= 300 ?
            configurationOptions.uploadLimit : 300;
        //
        if (T.ua.isMOBILE)
            isDropZoneAllowed = false; //no drop zone needed on phone

        switch (fileCategory) {
            case "image":
                fileCategory = "image/*";
                break;
            case "audio":
                fileCategory = "audio/*";
                break;
            case "video":
                fileCategory = "video/*";
                break;
            default:
                fileCategory = "*/*";
                break;
        }


        //create the main element  container for the slider(s)
        var baseWidget = T.UI.Widget(),
            fileFormats = {
                audio: [".mp3", ".ogg", ".wav", ".wma", ".amr"],
                video: [".mp4", ".ogg", ".webm", ".wmv", "3gp"],
                image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"]
            };
        ///////////////////////////////////////////////////////////////////////////
        //reset The familyId and instance Id for this Widget
        ///All Widgets in this library should have a family and instance ID

        baseWidget.FamilyID = "FileUploadWidget";
        if (T.globalWidgetCache[baseWidget.FamilyID]) {
            T.globalWidgetCache[baseWidget.FamilyID] =
                T.globalWidgetCache[baseWidget.FamilyID] += 1;
        } else {
            T.globalWidgetCache[baseWidget.FamilyID] = 1;
        }

        //Set the Instance Id for this  Widget Instance
        baseWidget.InstanceID = baseWidget.FamilyID +
            ("%02X".sprintf(T.globalWidgetCache[baseWidget.FamilyID]));

        //set the widget's id to the instance id
        baseWidget._widgetElement.id = baseWidget.InstanceID;

        /////////////////// //set some HTML5 data, just for fun.. ////////////////////////////
        //the _widgetElement is the actual DOM Element so..
        baseWidget._widgetElement.set_data(baseWidget.FamilyID, baseWidget.InstanceID);
        baseWidget._widgetElement.set_style({ //style the container
            width: isDropZoneAllowed ? "95%" : "90%",
            backgroundColor: "#fff",
            textAlign: "center",
            padding: "10px",
            borderRadius: "0px",
            position: "relative",
            left: "0",
            top: "0",
            minHeight: "0em",
            height: "auto"
        });

        //next create the dropzone
        var dz = T.$(document.createElement("DIV"));
        dz.set_style({
            display: "inline-block",
            minWidth: "0em",
            width: "97%",
            padding: isDropZoneAllowed ? "15px" : "5px",
            marginLeft: isDropZoneAllowed ? "-15px" : "-5px",
            border: "#ccc 3px dashed ",
            fontSize: "1.3em",
            fontWeight: "bold",
            textAlign: "center",
            color: "#666"


        });
        if (isDropZoneAllowed && !T.ua.isMOBILE) {
            dz.innerHTML = "DROP FILES HERE OR";
            dz.addEventListener("dragover", function(e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = "link";
                e.target.style.borderColor = "red";
            });
            dz.addEventListener("drop", function(e) {
                e.stopPropagation();
                e.preventDefault();
                e.target.style.borderColor = "#ccc";
                preProcessFiles(e);
            });
        }
        //create alternate upload button
        var uButton = T.$(document.createElement("SPAN"));

        uButton.set_style({
            width: "8.5em",
            height: "auto",
            padding: ".3em",
            marginLeft: '5%',
            backgroundColor: "#666",
            fontSize: "85%",
            border: "solid 1px #666",
            color: "#ccc",
            display: "inline-block",
            textAlign: "center",
            cursor: "pointer",
            transition: "all .5s"
        });
        uButton.on("mouseover touchstart", function() {
            this.target.set_style({
                backgroundColor: "#fff",
                color: "#666"
            });
        });
        //

        uButton.on("mouseout touchend touchcancel", function() {
            this.target.set_style({
                backgroundColor: "#666",
                color: "#ccc"
            });
        });
        //

        uButton.on("click", function() { //create the file selection dialog when we click the button
            if (filePreparationInProgress)
                return; //still working on previous files

            var fSelector = document.createElement("INPUT");
            fSelector.style.display = "none";
            fSelector.type = "file";
            fSelector.multiple = true;
            fSelector.accept = fileCategory;
            baseWidget._widgetElement.appendChild(fSelector); //add the file dialog to the body

            fSelector.click(); //init the dialog window


            //IE 10 sometimes doesnt fire the change event as at when due soo..
            if (fSelector.attachEvent)
                fSelector.addEventListener("input",
                    preProcessFiles, false);
            else
                fSelector.addEventListener("change", preProcessFiles, false);
        });
        uButton.innerHTML = "select files";
        dz.appendChild(uButton);

        //
        //
        var filePreparationInProgress = false,
            noOfFilesToUpload = 0, //total number of files for upload in the current session
            preProcessingCount = 0, // how many files have been succesfully preprocessed
            compositeFileStructure = {}; //would contain all the file properties after filtering
        var currentFilesForUploadIndex = 0;
        var fileUploadInProgress = null;
        var fileId = []; //global fileID for tracking purposes

        var worker_array = [];

        var fileReaderInstances = T.Iterator();
        var timeout;
        var uploadErrorFlag = 0,
            upload_session_id = [], //unique session id
            sizeLimit = 0;;


        var preparing__ = T.$(document.createElement("SPAN"));

        function preProcessFiles(e) { //validate file type, size, etc
            e.stopPropagation();
            uploadErrorFlag = 0; // a new file selection so reset eror flag


            if (fileUploadInProgress || filePreparationInProgress) {
                var lastError = document.querySelector("." + baseWidget._widgetElement.id + "_upload_in_progress ");
                if (lastError) //we already have an error notifier in DOM
                    lastError.WidgetObj.show();

                else {
                    var notifyW = T.UI.Widget.NotifyWidget({
                        width: "20%",
                        height: "2.2em",
                        style: "scale-lt",
                        timer: "3"

                        //
                    });
                    notifyW.append_to_element(document.body);
                    notifyW.Node.innerHTML = "Upload in progress!!";
                    notifyW.Node.style.left = "40%";
                    notifyW.Node.className += " " + baseWidget._widgetElement.id + "_upload_in_progress ";

                    notifyW.show();

                }
                return;
            }


            var fList = e.target.files ? e.target.files : e.dataTransfer.files;
            noOfFilesToUpload = fList.length;
            //
            //

            preparing__.set_style({
                display: "block"
            });
            baseWidget._widgetElement.appendChild(preparing__);
            preparing__.innerHTML = "preparing files...";
            filePreparationInProgress = true;


            //work within our upload limits, check total file(s) size
            for (var i = 0; i < fList.length; i++) {

                if ((sizeLimit += ((fList[i].size / 1024) / 1024)) >= uploadLimit + 1) {
                    showErrorAndReset("Upload size exceed's limit of " + uploadLimit + " MB ");
                    preparing__.innerHTML = "";
                    return;

                }
            }

            //get the ccategory of the selected file(s) i.e image/audio/video/*
            var itemGeneralCatergory = fileCategory.substring(0, fileCategory.stripos("/"));


            for (var i = 0; i < fList.length; i++) { //first filter based on mime type

                if (!fList[i].type.startsWith(itemGeneralCatergory) && itemGeneralCatergory !== "*") {
                    noOfFilesToUpload -= 1;
                    continue; //skip files with mismatched mime types, but dont skip when we are to match all files i.e (*)
                }
                if (fList[i].name.substr(fList[i].name.last_index_of(".") + 1) === "lnk") { //window links
                    noOfFilesToUpload -= 1;
                    continue; //
                }

                compositeFileStructure[i] = {};
                compositeFileStructure[i]["name"] = fList[i].name;
                compositeFileStructure[i]["ext"] = fList[i].name.substr(fList[i].name.last_index_of(".") + 1);

                compositeFileStructure[i]["lastModified"] = fList[i].lastModified;
                compositeFileStructure[i]["size"] = fList[i].size;
                compositeFileStructure[i]["id"] = T.Hash.sha256(fList[i].name); //set a file id
                fileId[fileId.length] = compositeFileStructure[i]["id"]; //ad ID to global file-id cache


                //next we get the raw binary data content of each file
                //create the reader for the file at this index
                fileReaderInstances[fileReaderInstances.length] = new FileReader();
                var this_reader = fileReaderInstances[fileReaderInstances.length - 1];

                this_reader.currentFileIndex = i;
                //
                //when the binary content is read, we send the result to the setFileBufferInCompositeObj function
                //along with the index of this file as referenced by the FileReader object
                this_reader.addEventListener("load", setFileBufferInCompositeObj.bind(null, this_reader, this_reader.currentFileIndex));

                //is readAsBinaryStringMoreEfficient here????
                this_reader.readAsArrayBuffer(fList[i]); //read the file content as arraybuffer
            }

            if (noOfFilesToUpload === 0) { //all files were filtered out
                preparing__.innerHTML = "";
                filePreparationInProgress = false;
            }
            for (var d = 0; d != fList.length; d++) {

                fList[d] = null; //Garbage Collect


            }
            fList = null;
        }

        function setFileBufferInCompositeObj(reader, index) {

            compositeFileStructure[index]["buffer"] = reader.result; //result is an array buffer (note could have read as a Blob as well., using readAdBinayString
            preProcessingCount += 1;

            if (preProcessingCount === noOfFilesToUpload) { //check for preprocessing done
                filePreProcessingDone();
                preparing__.innerHTML = "";
                filePreparationInProgress = false;
            }
        }


        var fileBufferChunks = [];
        var totalFileChunksUploaded = 0; //the number of chunks for a file that has been succesfully uploaded
        var totalFileChunks = null; //the number of chunks for the current file being processed
        function filePreProcessingDone() {
            //2nd stage processing

            //here we work a bit more on the buffers, since we intend to accelerate the file uploads
            //we break the buffers (those greater than 500kb in byte length) into three chunks
            for (var i in compositeFileStructure) {


                if ((compositeFileStructure[i].buffer.byteLength / 1024) / 1024 > .5) { //files larger than 500kb, are split into three chunks
                    // 
                    //we break the file size into 4 chunks
                    //each subsequent chunk starts from the last index of the previous chunk
                    //because e.g buffer.slice(0,3) would slice from 0-2 (i.e) as the end value is exclusive
                    //so the next slice needs to start from (3) else we'll be missing some bytes of data
                    //hair pulling days /=

                    var chunk1 = [0, Math.floor(compositeFileStructure[i].buffer.byteLength / 4)],
                        chunk2 = [(chunk1[1]), chunk1[1] * 2],
                        chunk3 = [(chunk2[1]), chunk2[1] + (chunk2[1] * .5)],
                        chunk4 = [(chunk3[1]), compositeFileStructure[i].buffer.byteLength];

                    //seperate the current ArrayBuffer into chunks based on the calulated offsets
                    fileBufferChunks[fileBufferChunks.length] = [
                        compositeFileStructure[i].buffer.slice(chunk1[0], chunk1[1]),
                        compositeFileStructure[i].buffer.slice(chunk2[0], chunk2[1]),
                        compositeFileStructure[i].buffer.slice(chunk3[0], chunk3[1]),
                        compositeFileStructure[i].buffer.slice(chunk4[0], chunk4[1])
                    ];

                } else { //buffer less than 500kb
                    //just store the entire chunk

                    fileBufferChunks[fileBufferChunks.length] = [
                        compositeFileStructure[i].buffer.slice(0)
                    ];
                }
            }

            //create progreess bars for all files
            for (var i = 0; i < fileBufferChunks.length; i++) {

                createUploadProgressBar(i, fileBufferChunks[i].length);
            }



            //create a unique ID for this upload session
            for (var i = 0; i < 6; i++)
                upload_session_id[upload_session_id.length] = Math.floor(Math.random() * (9 - 0)) + 0;

            upload_session_id = upload_session_id.join("");

            //call the upload started callback, just before we proceed with the uploads
            //so the client could take care of any pre-initialization steps, or notify the user we are about to upload
            //etc
            if (uploadStartCallback) {
                uploadStartCallback();

                setTimeout(fileUploadLoop, 1000); //initialize the upload process
            } else {
                fileUploadLoop();
            }
        }


        function fileUploadLoop() { //recursively send each file/file-chunks over for upload

            if (T.NETWORK_STATE === _T_NET_OFFLINE) { //network error
                showErrorAndReset();
                return;

            }
            if (uploadErrorFlag && timeout) {
                clearTimeout(timeout);
                return;
            }
            if (fileUploadInProgress === null) { //first call

                //set the total chunks for this upload
                totalFileChunks = fileBufferChunks[currentFilesForUploadIndex].length;

                //start the upload
                initUploadProcess(fileBufferChunks[currentFilesForUploadIndex]);
                timeout = setTimeout(fileUploadLoop, 200);


            }
            if (fileUploadInProgress === true) { //in progress
                clearTimeout(timeout);
                timeout = setTimeout(fileUploadLoop, 200);

            } else if (fileUploadInProgress === false) { //no upload in progress, send next file
                clearTimeout(timeout);


                if (currentFilesForUploadIndex < noOfFilesToUpload) {

                    //set the total chunks for the next upload
                    totalFileChunks = fileBufferChunks[currentFilesForUploadIndex].length;

                    //send the next file for upload
                    initUploadProcess(fileBufferChunks[currentFilesForUploadIndex]);
                    timeout = setTimeout(fileUploadLoop, 200);

                }
            }
            if (currentFilesForUploadIndex === noOfFilesToUpload) { //all uploads completed
                clearTimeout(timeout);

                fileUploadInProgress = null; //reset all variables for a fresh upload list
                fileBufferChunks = [];
                totalFileChunksUploaded = 0;
                totalFileChunks = null;
                filePreparationInProgress = false;
                noOfFilesToUpload = 0;
                preProcessingCount = 0;
                compositeFileStructure = {};
                currentFilesForUploadIndex = 0;
                fList = null;
                fileId = [];
                sizeLimit = 0;
                fileReaderInstances.empty();



                for (var i = 0; i < worker_array.length; i++)
                    worker_array[i].terminate();

                //lastly post the uploaded user file to the user's server script
                postFilesToUserLand();
                return true;
            }
        }


        var update_progress_text = null;
        //loop through the chunk list and upload one after the other
        function initUploadProcess(fileBufferChunksIndex) {
            //upldate the progress percentage indicator
            if (update_progress_text === null)
                update_progress_text = setTimeout(progress_text_updater, 50);


            fileUploadInProgress = true;

            //
            //here we create web workers and upload each chunk in a seperate workers

            for (var j = 0; j < fileBufferChunksIndex.length; j++) {

                //create workers corresponding to the number of chunks for this file
                worker_array[j] = new Worker(T.library_installation_path + "/asset/workers/FileUploadModuleWorker_a.js");

                //send the chunk to be uploaded to the worker instance alongside the file index and id
                worker_array[j].postMessage({
                    bufferData: fileBufferChunksIndex[j],
                    fileIndexInList: currentFilesForUploadIndex,
                    fileID: fileId[currentFilesForUploadIndex],
                    fileChunkIndex: j,
                    fileName: compositeFileStructure[currentFilesForUploadIndex].name,
                    fileExt: compositeFileStructure[currentFilesForUploadIndex].ext,
                    sess_id: upload_session_id
                });

                worker_array[j].onmessage = updateProgressBar;
                worker_array[j].onerror = function(e) {
                    showErrorAndReset();

                };

            }
        }


        var progressArray = []; //this would contain our progress bars
        var totalProgressLevel = 0; //the total level of all progress bars 
        function createUploadProgressBar(fileIndex, chunksLength) { //create progress bar(s) for this file upload instance

            var pBarBox = T.$(document.createElement("DIV")); //container for the progress bars
            pBarBox.className += " TFileUploadProgress"; //class for the progress bars
            pBarBox.set_style({
                width: "100%",
                height: "1em",
                backgroundColor: "transparent",
                display: "inline-block",
                border: "solid 1px #ccc",
                textAlign: "left",
                position: "relative",
                top: ".5em"
            });
            pBarBox.id = compositeFileStructure[fileIndex].id;

            var progText = T.$(document.createElement("SPAN"));
            progText.set_style({
                display: "block",
                position: "relative",
                padding: ".2em",
                color: "#000",
                //whiteSpace: "nowrap",
                fontSize: ".8em",
                textAlign: "left"


            });
            progText.className += " __smartProgressText";
            progText.id = compositeFileStructure[fileIndex].name; //set the id to the file its representing
            progText.innerHTML = compositeFileStructure[fileIndex].name.truncate(60) + " &nbsp; &nbsp;<b>" +
                "%.1f".sprintf((compositeFileStructure[fileIndex].size / 1024) / 1024) + "MB</b>";

            var progLevel = T.$(document.createElement("SPAN"));
            progLevel.set_style({
                display: "inline-block",
                padding: ".2em",
                color: "#000",
                //whiteSpace: "nowrap",
                fontSize: ".8em",
                marginLeft: ".5em"


            });
            progLevel.innerHTML = "0%";
            progText.appendChild(progLevel);


            var prevProgressBar;

            //always insert a new progress bar before the previous one
            if ((prevProgressBar = document.querySelector("#" + baseWidget._widgetElement.id + " .TFileUploadProgress")) !== null) {
                baseWidget._widgetElement.insertBefore(pBarBox, prevProgressBar);
                baseWidget._widgetElement.insertBefore(progText, prevProgressBar);


            } else {
                baseWidget._widgetElement.appendChild(pBarBox);
                baseWidget._widgetElement.appendChild(progText);

            }


            //crreate the actual progres bars based on no of chunks for this upload 
            for (var i = 0; i < chunksLength; i++) {
                progressArray[i] = T.$(document.createElement("DIV"));

                //style the progress bar(s) sections
                progressArray[i].className += " TFileUploadProgressChunk";
                progressArray[i].set_style({
                    width: 1 + "px",
                    height: "100%",
                    display: "inline-block",
                    position: "absolute",
                    top: '0px',
                    //position them in respect to their buffer length, so they are divided
                    //equally 
                    left: i === 0 ? 0 + "px" : ((100 / chunksLength) * i) + "%",
                    backgroundColor: progBarColor
                });

                pBarBox.appendChild(progressArray[i]);


            }
        }




        function updateProgressBar(e) { //update upload progress bars


            if (e.data.error) { //an error occured

                showErrorAndReset();
                return;
            }


            //update the progress bars based on recieved values
            //first get the progress bar, by its DOM id

            var progBarIndex = document.getElementById(e.data.fileID);
            if (!progBarIndex)
                return;

            //then the chunk section
            var chunkIndex = progBarIndex.childNodes.item(e.data.chunkOrdinalIndex);

            //update the width of the chunk section to correspond to the percentage upload
            chunkIndex.style.width = e.data.uploadValue / fileBufferChunks[e.data.fileOrdinalIndex].length + "%";


            if (parseInt(e.data.uploadValue) === 100) { //a chunk is complete
                totalFileChunksUploaded += 1;


                if (totalFileChunksUploaded === totalFileChunks) { //all chunks uploaded, signal complete for this file

                    totalFileChunksUploaded = 0; //reset chunks count
                    currentFilesForUploadIndex += 1; //move the upload index to the next file
                    fileUploadInProgress = false; //cuurently done so allow for next upload

                }

            }




        }


        function progress_text_updater() {
            //get the width of all the progress bars for this file
            var p = 0;


            var progress_bar = T.$(fileId[currentFilesForUploadIndex]);

            for (var i = 0; i < progress_bar.childNodes.length; i++)
                p += parseFloat(progress_bar.childNodes[i].style.width);

            var progress_percent_text = T.$(compositeFileStructure[currentFilesForUploadIndex].name)
                .first_element_child()
                ._nextElementSibling();
            progress_percent_text.innerHTML = (p / 4) + "%";

            if (p < 100)
                setTimeout(progress_text_updater, 100);
            //            else
            //                progress_percent_text.innerHTML = "100%";



        }

        function showErrorAndReset(error_string) { //show an error toast and reset


            var lastError = document.querySelector("." + baseWidget._widgetElement.id + "_upload_error ");
            if (lastError) //we already have an error notifier in DOM
                lastError.WidgetObj.destroy();

            if (error_string !== null) { //if they sent null do not show aany errors
                var notifyW = T.UI.Widget.NotifyWidget({
                    width: "20%",
                    height: "2.2em",
                    style: "scale-lt",
                    timer: "7"

                    //
                });
                notifyW.append_to_element(document.body);
                notifyW.Node.innerHTML = error_string || "File upload interrupted!!";
                notifyW.Node.style.left = "40%";
                notifyW.Node.className += " " + baseWidget._widgetElement.id + "_upload_error ";

                notifyW.show();

                if (errorCallback)
                    errorCallback();
            }

            try {
                //remove all progress bars
                for (var i = 0; i < fileBufferChunks.length; i++) {

                    baseWidget._widgetElement.
                    removeChild(document.getElementById(compositeFileStructure[i]["id"]));
                }
                T.$c("__smartProgressText")
                    ._destroy(); //destroy the text nodes next to the bars

                //reset all variables
                fileUploadInProgress = null; //reset all variables for a fresh upload list
                fList = null;
                fileBufferChunks = [];
                totalFileChunksUploaded = 0;
                totalFileChunks = null;
                filePreparationInProgress = false;
                noOfFilesToUpload = 0;
                preProcessingCount = 0;
                compositeFileStructure = {};
                currentFilesForUploadIndex = 0;

                fileReaderInstances.empty();
                fileId = [];
                sizeLimit = 0;
                //close the upload session
                upload_session_id = [];

                for (var i = 0; i < worker_array.length; i++)
                    worker_array[i].terminate();


            } catch (e) {

            }
            return;

        }


        function postFilesToUserLand() { //after the entire file list has been uploaded we post thenm to the user script

            if (onuploadComplete)
                onuploadComplete();

            if (actionURL) { //call the postUploadedFiles script on the server to send all uploaded files to the user script
                var xhr = new XMLHttpRequest();

                //force append GET variables
                var userScript = "user_script=" + actionURL;

                if (uploadArgs) { //send extra arguments if available to the user script
                    uploadArgs = JSON.stringify(uploadArgs);

                    xhr.open('POST', T.library_installation_path + "/asset/php/postUploadedFilesToUserScript.php?" + userScript + "&uploadArgs=" + encodeURIComponent(uploadArgs) + "&sess_id=" + upload_session_id, true);

                } else {
                    xhr.open('POST', T.library_installation_path + "/asset/php/postUploadedFilesToUserScript.php?" + userScript + "&sess_id=" + upload_session_id, true);
                }

                xhr.onload = function(e) { //well that went well

                    if (this.responseText.indexOf("Curl error:") === -1) { //call user success func
                        if (successCB)
                            successCB(this.responseText);
                        upload_session_id = []; //close upload session here, as everything went well


                    } else if (this.responseText.indexOf("Curl error:") === 0) {
                        showErrorAndReset();
                    }


                };

                xhr.onerror = function(e) {
                    showErrorAndReset();
                };


                xhr.send();

            }
            return true;
        }

        //->       //ovveride toString
        baseWidget._widgetElement.__to_string = function() {
            return "[object TigerJS.FileUploadWidget]";
        };

        //append dropzone to main widget
        baseWidget._widgetElement.appendChild(dz);
        return baseWidget;
    }

    return new __fileUploadWidget(configurationOptions);
};