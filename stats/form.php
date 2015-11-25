<html>
    
<head>
    <title>Hashstats</title>
</head>
    
<body ng-app="Top10App">
<h1>Hashstats</h1>

Some predefined variables:<br/>
<small>PAGENUM = 4, PAGESIZE = 200, MIN_FOLLOWERS = 10, MIN_WORDCOUNT = 2</small>
<br/><br/>
<form action="stats.php" method="get">
  Enter keyword or hashtag:<br>
  <input type="text" name="keyword">
  <input type="submit" value="Get stats (json)">
</form> 

<small>Foreign letters may appear encoded</small>
</body>
</html>