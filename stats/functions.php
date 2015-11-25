<?php

//Convert tweet text to array of words delimited by multiple characters
function multiexplode($delimiters,$string) {
    $text = str_replace($delimiters, $delimiters[0], $string);
    $exploded = explode($delimiters[0], $text);
    return  $exploded;
}

//Remove urls, twitter slang, screen names, and one-letter words from word cloud
function remove_flag_words($words){
    foreach ($words as $arrkey => $word){
        if (strlen($word)==1) unset($words[$arrkey]);
    }
    return array_filter($words, "flag_words");
}

//Callback funtion for remove_special_words(). Returns false if flag word found.
function flag_words($element){
    
    //Include words you want to be removed from array
    $sp_words = array("rt", "mt", "a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the");
    
    //Include substrings of container words you want to be removed from array
    $sp_substr = array("http", "@");
    
    if ( spword_search($element, $sp_words) ) return FALSE;
    if ( multiple_stripos($element, $sp_substr) ) return FALSE;
    return TRUE;
}

//Check if an element is a flag word, case insensitive
function spword_search($element, $sp_words) {
    foreach($sp_words as $sp_word) {
        if ( strtolower($sp_word) == strtolower($element) ) return $found='1';
    }
    return $found='0';
}

//Check if an element has a flag substring
function multiple_stripos($element, $sp_substrs ) {
    foreach($sp_substrs as $sp_substr) {
        if ( stripos($element, $sp_substr)!==FALSE ){
            return $found = '1';
        }
    }
    return $found='0';
}


//Converting foreign characters to ASCII
function toASCII($string){
    return strtr(utf8_decode($string), utf8_decode('ŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ'), 'SOZsozYYuAAAAAAACEEEEIIIIDNOOOOOOUUUUYsaaaaaaaceeeeiiiionoooooouuuuyy');
}

?>