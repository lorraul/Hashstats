<?php
ini_set('max_execution_time', 200);
ini_set('default_charset', 'UTF-8');

define ('TWITTER_CONSUMER_KEY','');
define ('TWITTER_CONSUMER_SECRET','');
define ('OAUTH_TOKEN','');
define ('OAUTH_TOKEN_SECRET','');

define ('PAGENUM', 4); // search/tweets api responses
define ('PAGESIZE', 200); // tweets per api response/ twitter search/tweets api limit 100

define ('MIN_FOLLOWERS', 10); //excluding users from stats
define ('MIN_WORDCOUNT', 2); //min appearances of words returned in word count
?>