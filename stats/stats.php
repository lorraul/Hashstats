<?php

require "config.php";
require "functions.php";
require "../lib/twitteroauth/autoloader.php";
require "../lib/datumbox-api-client-php/DatumboxAPI.php";

use Abraham\TwitterOAuth\TwitterOAuth;

$stats = array();

if ( !isset($_GET["keyword"]) ) $stats['meta'] = 'no keyword';
else {
    $twitteroauth = new TwitterOAuth(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET);

    $tweets = array();

    for ($i=0;$i<=PAGENUM-1;$i++){
        if ( isset($max_id) ){
            $api_response = $twitteroauth->get('search/tweets',array('q' => htmlspecialchars($_GET["keyword"]), 'count' => PAGESIZE, 'max_id' => $max_id));
            $tweets = array_merge($tweets, $api_response->statuses);
        }
        else{
            $api_response = $twitteroauth->get('search/tweets',array('q' => htmlspecialchars($_GET["keyword"]), 'count' => PAGESIZE));

            //print_r($api_response);
            $tweets = $api_response->statuses;
        }
        $max_id = bcsub(end($tweets)->id_str,1,0);
    }

    $meta = array('keyword'=>htmlspecialchars(strtolower($_GET["keyword"])), 'numtweets'=>count($tweets), 'start'=>'', 'end'=>'');
    $words = array();
    $lang = array();
    $tweetsdata = array();
    $sentiment = array(
        'positive' => 0,
        'neutral' => 0,
        'negative' => 0,
        'undefined' =>0
        );

    $DatumboxAPI = new DatumboxAPI(DATUMBOX_API);

    for ($i=0;$i<=count($tweets)-1;$i++){   

        // Excluding users under MIN_FOLLOWERS
        if ( $tweets[$i]->user->followers_count < MIN_FOLLOWERS ) { $meta['numtweets']--; continue; }

        if ( $meta['start'] == '' ) $meta['start'] = strtotime($tweets[$i]->created_at);
        if ( $meta['end'] == '' ) $meta['end'] = strtotime($tweets[$i]->created_at);
        if ( strtotime($tweets[$i]->created_at) < $meta['start'] ) $meta['start'] = strtotime($tweets[$i]->created_at);
        if ( strtotime($tweets[$i]->created_at) > $meta['end'] ) $meta['end'] = strtotime($tweets[$i]->created_at);

        //Create an array of all words, non alphanumeric chars as word separators removed
        $words = array_merge($words, multiexplode(array(" ","\n","\r"), preg_replace('/[^\p{L}\p{M}#@0-9 ]/u', ' ', strtolower($tweets[$i]->text))));

        //Get tweet language
        if ( array_key_exists($tweets[$i]->lang, $lang) ) $lang[$tweets[$i]->lang]++;
        else $lang[$tweets[$i]->lang]=1;

        //Get tweets id, screenname, screenname
        $tweetsdata[] = array($tweets[$i]->id_str, strtotime($tweets[$i]->created_at), $tweets[$i]->user->screen_name, $tweets[$i]->text);


        //Get tweet sentiment
        $tweet_sentiment = $DatumboxAPI->SentimentAnalysis($tweets[$i]->text);
        if ( $tweet_sentiment ) $sentiment[$tweet_sentiment]++;
        else $sentiment['undefined']++;

    }

    unset($DatumboxAPI);

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
    $stats['meta'] = $meta;
    $stats['word_count'] = $word_count;
    $stats['lang'] = $lang;
    $stats['sentiment'] = $sentiment;
    $stats['tweets'] = $tweetsdata;

    //echo '<pre>'; print_r($stats); echo '</pre>';
}

header('Content-type: application/json');

echo json_encode($stats);


?>