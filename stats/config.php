<?php
ini_set('max_execution_time', 2000);
ini_set('default_charset', 'UTF-8');

define ('TWITTER_CONSUMER_KEY','');
define ('TWITTER_CONSUMER_SECRET','');
define ('OAUTH_TOKEN','');
define ('OAUTH_TOKEN_SECRET','');

define ('DATUMBOX_API','');
//datumbox api limit 1000/day
//for more requests you will need to create your own service running the Datumbox Machine Learning Framework

define ('PAGENUM', 1); // search/tweets api requests, change if you want more than 100 tweets
define ('PAGESIZE', 20); // tweets per api tequest/ twitter search/tweets api limit 100

define ('MIN_FOLLOWERS', 10); //excluding users from stats
define ('MIN_WORDCOUNT', 2); //min appearances of words returned in word count
?>