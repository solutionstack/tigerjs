<?php
ini_set('zlib.output_compression_level', 8);


ob_start("ob_gzhandler");
//handle proceessing from our composite request js function
final class compositeRequestClass {

    private $input_array;
    private $input_request_length;
    private $request_executed;
    private $temp_request_array;
    private $result_set = array();

    final public function __construct() {

        $this->input_array = $_POST;
        $this->request_execute_index = 0; //index of the request we ar about to execute
        $this->input_request_length = intval($this->input_array['request_count']);

        //unset the request_count index
        unset($this->input_array['request_count']);

        //chunk up the remainder of the array so its reflects the exact 
        //number of request that came in the post transaction
        $this->temp_request_array = array_chunk($this->input_array, 3);
    }

    final public function process_input() {


        //call the function to the the CURL operations with parameter
        //for a single request instance
        $this->make_request
        ($this->temp_request_array[$this->request_execute_index][0], $this->temp_request_array[$this->request_execute_index][1], $this->temp_request_array[$this->request_execute_index][2]
        );

        $this->request_execute_index += 1; //increment to execute the next index
        if ($this->request_execute_index < $this->input_request_length) {
            $this->process_input();
            //call us again till we're done processing every request
        } else {
            //after all said and done
            $this->pack_result();
        }
    }

    final private function make_request($uri, $postData, $tag) {
       
        $ch = curl_init(); // init curl resource
        curl_setopt($ch, CURLOPT_URL, $uri);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // a true curl_exec return content
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); // leaveout ssl here
        curl_setopt($ch, CURLOPT_USERAGENT, "TigerJS_Curl");
        curl_setopt($ch, CURLOPT_POST, 1);

        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

        if (($this->result_set[$tag] = curl_exec($ch)) === FALSE) { //curl didnt execute succsefully, try again for url errors 
            echo curl_error($ch);
        }
       
    }

    final private function pack_result() {
        //pack into a json string

        echo json_encode($this->result_set);
    }

}

(new compositeRequestClass())->process_input();

