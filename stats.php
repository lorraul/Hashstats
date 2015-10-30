<?php

require "config.php";
require "functions.php";
require "lib/twitteroauth/autoload.php";

use Abraham\TwitterOAuth\TwitterOAuth;

$twitteroauth = new TwitterOAuth(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET);

$tweets = array();

for ($i=0;$i<=PAGENUM-1;$i++){
    if ( isset($max_id) ){
        $api_response = $twitteroauth->get('search/tweets',array('q' => htmlspecialchars($_GET["keyword"]), 'count' => PAGESIZE, 'max_id' => $max_id));
        $tweets = array_merge($tweets, $api_response->statuses);
    }
    else{
        $api_response = $twitteroauth->get('search/tweets',array('q' => htmlspecialchars($_GET["keyword"]), 'count' => PAGESIZE));
        $tweets = $api_response->statuses;
    }
    
    $max_id = bcsub(end($tweets)->id_str,1,0);
}

/*
for ($i=0;$i<=count($tweets)-1;$i++){
    echo $tweets[$i]->id_str.' - '.$tweets[$i]->text.'</br>';
}
*/

$words = array();
$lang = array();

mb_regex_encoding("UTF-8"); 

for ($i=0;$i<=count($tweets)-1;$i++){   
    
    // Excluding users under MIN_FOLLOWERS
    if ( $tweets[$i]->user->followers_count < MIN_FOLLOWERS ) continue;
    
    //Create an array of all words, non alphanumeric chars as word separators removed
    $words = array_merge($words, multiexplode(array(" ","\n","\r"), preg_replace('/[^\p{L}\p{M}#@0-9 ]/u', ' ', strtolower($tweets[$i]->text))));
    
    //Get tweet language
    if ( array_key_exists($tweets[$i]->lang, $lang) ) $lang[$tweets[$i]->lang]++;
    else $lang[$tweets[$i]->lang]=1;
}

$words = remove_flag_words($words);
$words = array_values( array_filter($words) );

$word_count = array();

//Counting words
foreach ($words as $word){
    if ( array_key_exists($word, $word_count) ) $word_count[$word]++;
    else $word_count[$word]=1;
}

//Remove words under MIN_WORDCOUNT from words_count
foreach ($word_count as $arrkey => $word){
    if ( $word_count[$arrkey] < MIN_WORDCOUNT ) unset($word_count[$arrkey]);
}

//Create stats
$stats = array();
$stats['word_count'] = $word_count;
$stats['lang'] = $lang;

//echo '<pre>'; print_r($stats); echo '</pre>';

echo json_encode($stats);


?>