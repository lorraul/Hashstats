<?php

require "config.php";

//Create stats
$stats = array();
$stats['pagenum'] = PAGENUM;
$stats['pagesize'] = PAGESIZE;

if (PAGESIZE > 100) { $stats['estimatedtime'] = (100 * PAGENUM * 1.4)+2; }
else { $stats['estimatedtime'] = (PAGESIZE * PAGENUM * 1.4)+2; }

$stats['minfollowers'] = MIN_FOLLOWERS;
$stats['minwordcount'] = MIN_WORDCOUNT;

header('Content-type: application/json');

echo json_encode($stats);

?>