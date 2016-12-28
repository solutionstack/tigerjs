<?php

/*   This file is part of the TigerJS Javascript Library @@https://sourceforge.net/p/tigerjs> */

//so here we write the chunks uploaded by FileUploadWidget to a temp file, later
//each temp file would be concantated to reproduce the original file
ini_set("memory_limit", "512M"); //this script could potentially eatup memory
set_time_limit(0); {
    //even though the request is coming in as a PUT request, we append get variables to the URI so,
    //the variables contain the file name, extension and chunkindex for files uploaded in multiple chunks


    $url_components = parse_str($_SERVER['QUERY_STRING'], $arr);

    $file_name = $arr['fileName']; //the file name being uploaded
    $file_ext = $arr['fileExt']; //the file extension
    $file_chunk_index = $arr['chunkIndex']; //the current chunk index
    $upload_sess_id = $arr['sess_id'];

    $session_dir = "temp_upload/" . $upload_sess_id;  //create a unique directory for this upload
    mkdir($session_dir, 0777, true);

    $file_name_for_fopen = $file_name . "_" . $file_ext . "_" . $file_chunk_index;

    $fp = fopen($session_dir . "/" . $file_name_for_fopen, 'wb'); //create the file (binary mode)

    $st = file_get_contents("php://input"); //get the uploaded raw binary content

    fwrite($fp, $st); //write the binary content for this file/chunk


    fclose($fp);
}

