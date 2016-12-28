
/* global TigerJS, T */

/*   This file is part of the TigerJS Javascript Library 
 * <https://sourceforge.net/p/tigerjs> <https://github.com/solutionstack/tigerjs> */
/* copyright 2014-2016 Olubodun Agbalaya. <s.stackng@gmail.com>, <agbalaya@users.sourceforge.net> */

//this worker handle uploads of arbitrary file data chunks, on behalf of module:: FileUploadWidget
onerror = function () {
    postMessage({
        error: 1

    });
};

onmessage = function (e) {
    try {
        var buffer = new Blob([e.data.bufferData]), //the buffer
                fileId = e.data.fileID, //the Hash-ID for the file we are uploading
                fileIndex = e.data.fileIndexInList, //The file index on the file list
                chunkIndex = e.data.fileChunkIndex, //the index for this chunk part of the file (files larger than 500kb are split into three chunks
                fileName = encodeURIComponent(e.data.fileName.substring(0, e.data.fileName.lastIndexOf("."))), //we are URI encoding this as the filename could have special chars
                fileType = e.data.fileExt,
                sess_id = e.data.sess_id;


        function uploadBinaryData() {
            var progressValue;

            var xhr = new XMLHttpRequest();

            //force append GET variables
            var getVars = "fileName=" + fileName + "&fileExt=" + fileType + "&chunkIndex=" + chunkIndex + "&sess_id=" + sess_id;

            xhr.open('PUT', "../php/FileUploadModule_ChunkUploader.php?" + getVars, true);

            xhr.onload = function (e) {//we dont need this, as we're already sending onprogress so we would detect when we are at 100%
            };

            xhr.onerror = function (e) { //network errors
                postMessage({
                    error: 1

                });
            };


            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    progressValue = (e.loaded / e.total) * 100;
                    postMessage({
                        uploadValue: progressValue,
                        fileOrdinalIndex: fileIndex,
                        chunkOrdinalIndex: chunkIndex,
                        fileID: fileId

                    });
                }
            };

            xhr.send(buffer);

        }
        uploadBinaryData();//upload the buffer
    } catch (e) {
        postMessage({
            error: e.message

        });
    }
};

