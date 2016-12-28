<?php

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

//after succesfully uploading a file (or individual parts) by the FileUploadWidget module
//this file combines uploaded chunks back into the original file
//and sends them to the registered users upload handler script

ini_set("memory_limit", "2048M"); //this script could potentially eat-up memory
set_time_limit(0);
//we could be long running


$url_components = parse_str($_SERVER['QUERY_STRING'], $arr);

$user_script = $arr['user_script']; //the file name being uploaded

if (isset($arr['uploadArgs'])) {
    $uploadArgs = $arr['uploadArgs'];
}

$files_ = [];
$hasChunks = FALSE;
$uploadPath = "temp_upload/" . $arr["sess_id"];



//read the files/chunks from the temporary upload location
if (($handle = opendir($uploadPath))) {


    while (false !== ($entry = readdir($handle))) {
        if ($entry == "." || $entry == ".." || is_dir($uploadPath . "/" . $entry)) {//is_dir needs to have the parent directory prepended to work
            continue;
        }
        $files_[count($files_)] = $entry;
    }
    asort($files_);
    closedir($handle);
}


$filesOrChunksGarbageCollector = []; //add files/chunks we have processed here so they can be deleted afterwards

function mergeFileChunks() {
//get the file at index 0

    global $files_, $uploadPath, $hasChunks, $filesOrChunksGarbageCollector, $arr, $user_script;
    $current_file = $files_[0];

    $hasChunks = FALSE; //reset every time we enter
//get the file extension
    $file_ext = substr($current_file, 0, strlen($current_file) - 2); //the -2 leaves out the chunk index from the file name
    $file_ext2 = substr($file_ext, strrpos($file_ext, "_") + 1); // the extension would start from the last occurence of an underscore

    $filename_only = substr($current_file, 0, strlen($current_file) - 2);
    $filename_only2 = str_replace("_" . $file_ext2, "", $filename_only); //remove the underscore and extension introduced in the file name 
    //when chunking
//read the first file/chunk
    $handle = fopen($uploadPath . "/" . $current_file, "rb");

    //create a file with the original filename and append the first chunk
    $new_file = fopen($uploadPath . "/" . $filename_only2 . "." . trim($file_ext2), "a");
    fwrite($new_file, fread($handle, filesize($uploadPath . "/" . $current_file)));

    $filesOrChunksGarbageCollector[count($filesOrChunksGarbageCollector)] = $files_[0]; //add this file to be garbage collected
    //
//look for other chunks belonging to this file and append their binary content
    for ($i = 1; $i < count($files_); $i++) {

//see if they have the same file name and extension, stripping out chunk value
        if (substr($files_[$i], 0, strlen($files_[$i]) - 1) == substr($current_file, 0, strlen($current_file) - 1)) {
            $hasChunks = TRUE;

            //if we find chunks for this file, merge its content with the first file chunk
            $handle_temp = fopen($uploadPath . "/" . $files_[$i], "rb");

            fwrite($new_file, fread($handle_temp, filesize($uploadPath . "/" . $files_[$i])));

            fclose($handle_temp); //close temp handle
            //add file chunk to garbage collector
            $filesOrChunksGarbageCollector[count($filesOrChunksGarbageCollector)] = $files_[$i];
        }
    }

    fclose($handle);
    fclose($new_file);



//delete file chunks registered in GC
    for ($i = 0; $i < count($filesOrChunksGarbageCollector); $i++) {
        unlink($uploadPath . "/" . $filesOrChunksGarbageCollector[$i]);
        unset($files_[$i]);
    }

//reset array keys, because we always loop from index 0, to keep the GC and $files_ array in sync
    sort($files_);


    if (count($files_) > 0) { //if we still have more files/chunks to process
        $filesOrChunksGarbageCollector = []; //reset
        mergeFileChunks(); //loop again
//
    } else {
//if done processing all files, send files to user script

        $files = []; //initialize
//read the recombined files into an array
        if (($handle = opendir($uploadPath))) {


            while (false !== ($entry = readdir($handle))) {
                if ($entry == "." || $entry == "..") {
                    continue;
                }
                $files[count($files)] = $entry;
            }
            asort($files);
            closedir($handle);
        }
//send to user script with CURL
        $ch = curl_init();

        $options = array(
            CURLOPT_URL => $user_script,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_HEADER => FALSE, //dont return headers
            CURLOPT_POST => TRUE, //
            CURLOPT_FOLLOWLOCATION => TRUE,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_SSL_VERIFYPEER => FALSE
        );


        curl_setopt_array($ch, $options);
        $postData = array();

        if (isset($GLOBALS["uploadArgs"])) {//extra post args
            $postData["uploadArgs"] = $GLOBALS["uploadArgs"];
        }

        foreach ($files as $i) {//create a curl file object for each temp file
            $cfile = new CURLFile(str_replace("\\", "/", realpath($uploadPath) . "/" . $i));
            //curl needs an absolute path, so realpath-

            $postData[$i] = $cfile; //add the file
        }

        //also send the sesion_id along
        $postData["upload_session_id"] = $arr["sess_id"];

        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);


        if (($r = curl_exec($ch)) === false) {
            echo 'Curl error: ' . curl_error($ch);
        } else {

            //delete temporary uploads, need to supress errors here file's atimes afail to unlink
            foreach ($files as $i) {
                @unlink($uploadPath . "/" . $i);
            }

            rmdir($uploadPath);



            echo $r; //tell em we done, and send them the output of their server script
            exit;
        }


        curl_close($ch);
    }
}

mergeFileChunks();



