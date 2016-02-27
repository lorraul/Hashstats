function sortDecr(obj){
        var sortable = [];
        for (var lang in obj)
            sortable.push([lang, obj[lang]]);
        sortable.sort(function(a, b) {return -(a[1] - b[1])});
        return sortable;
    };

function createPDF(filecontent){
    var marginLeft = 20;
    var marginTop = 25;
    var heading = 18;
    var defaultSize = 12;
    date1 = new Date(filecontent.meta.start*1000);
    date1 = (date1.getMonth()+1)+'/'+date1.getDate()+'/'+date1.getFullYear()+' '+date1.getHours()+':'+date1.getMinutes();
    date2 = new Date(filecontent.meta.end*1000);
    date2 = (date2.getMonth()+1)+'/'+date2.getDate()+'/'+date2.getFullYear()+' '+date2.getHours()+':'+date2.getMinutes();
    var doc = new jsPDF();
    doc.setFontSize(22);
    doc.setFontType("bold");
    doc.text(marginLeft, marginTop, 'Twitter statistics for keyword: ');
    doc.setFontType("italic");
    doc.text(marginLeft+113, marginTop, filecontent.meta.keyword);
    doc.setFontType("normal");
    doc.setFontSize(8);
    doc.text(marginLeft, marginTop+6, 'Created with HashStats, http://sigmagfx.com/hashstats/');
    doc.setFontSize(defaultSize);
    doc.text(marginLeft, marginTop+20, 'Statistics based on '+filecontent.meta.numtweets+' tweets, from '+date1+' to '+date2+'.');
    doc.setFontType("bold");
    doc.setFontSize(heading);
    doc.text(marginLeft, marginTop+35, 'Sentiment');
    doc.setFontType("normal");
    doc.setFontSize(defaultSize);
    doc.text(marginLeft, marginTop+45, 'Sentiment of analyzed tweets using DatumBox. It classifies the tweets as positive, negative\r\nor neutral depending on their context.');
    
    doc.setTextColor(141, 182, 0);
    doc.setFontSize(30);
    doc.setFontType("bold");
    doc.text(marginLeft+10, marginTop+68, Math.round((filecontent.sentiment.positive*100)/filecontent.meta.numtweets)+'%');
    doc.setFontSize(defaultSize);
    doc.setFontType("normal");
    doc.text(marginLeft+13, marginTop+73, 'positive');
    
    doc.setTextColor(253, 182, 0);
    doc.setFontSize(30);
    doc.setFontType("bold");
    doc.text(marginLeft+50, marginTop+68, Math.round((filecontent.sentiment.neutral*100)/filecontent.meta.numtweets)+'%');
    doc.setFontSize(defaultSize);
    doc.setFontType("normal");
    doc.text(marginLeft+53, marginTop+73, 'neutral');
    
    doc.setTextColor(220, 20, 60);
    doc.setFontSize(30);
    doc.setFontType("bold");
    doc.text(marginLeft+90, marginTop+68, Math.round((filecontent.sentiment.negative*100)/filecontent.meta.numtweets)+'%');
    doc.setFontSize(defaultSize);
    doc.setFontType("normal");
    doc.text(marginLeft+93, marginTop+73, 'negative');
    
    doc.setTextColor(144, 123, 59);
    doc.setFontSize(30);
    doc.setFontType("bold");
    doc.text(marginLeft+130, marginTop+68, Math.round((filecontent.sentiment.undefined*100)/filecontent.meta.numtweets)+'%');
    doc.setFontSize(defaultSize);
    doc.setFontType("normal");
    doc.text(marginLeft+133, marginTop+73, 'undefined');
    
    var sentbar = 170;
    var sentbarY = marginTop+85;
    var sentbarHeight = 10;
    
    doc.setDrawColor(0);
    doc.setFillColor(141, 182, 0);
    doc.rect(20, sentbarY, (filecontent.sentiment.positive*sentbar)/filecontent.meta.numtweets, sentbarHeight, 'F');
    var sentbarX = 20 + ((filecontent.sentiment.positive*sentbar)/filecontent.meta.numtweets);
    doc.setFillColor(253, 182, 0);
    doc.rect(sentbarX, sentbarY, (filecontent.sentiment.neutral*sentbar)/filecontent.meta.numtweets, sentbarHeight, 'F');
    sentbarX = sentbarX + ((filecontent.sentiment.neutral*sentbar)/filecontent.meta.numtweets);
    doc.setFillColor(220, 20, 60);
    doc.rect(sentbarX, sentbarY, (filecontent.sentiment.negative*sentbar)/filecontent.meta.numtweets, sentbarHeight, 'F');
    sentbarX = sentbarX + ((filecontent.sentiment.negative*sentbar)/filecontent.meta.numtweets);
    doc.setFillColor(144, 123, 59);
    doc.rect(sentbarX, sentbarY, (filecontent.sentiment.undefined*sentbar)/filecontent.meta.numtweets, sentbarHeight, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontType("bold");
    doc.setFontSize(heading);
    doc.text(marginLeft, marginTop+110, 'Languages');
    doc.setFontType("normal");
    doc.setFontSize(defaultSize);
    doc.text(marginLeft, marginTop+120, 'Top 10 languages of analyzed tweets based on Twitter account settings.');
    
    doc.line(20, marginTop+190, 190, marginTop+190);
    
    var lang = sortDecr(filecontent.lang);
    var langtext = '';
    var i = 1;
    
    for (element in lang) {
        if (i === 11) { break; }
        doc.setFillColor(0, 153, 255);
        doc.rect(marginLeft+10+((i-1)*15), marginTop+190-((60*lang[element][1])/lang[0][1]), 10, (60*lang[element][1])/lang[0][1], 'F'); 
        doc.text(marginLeft+13+((i-1)*15), marginTop+200, lang[element][0]);
        doc.text(marginLeft+13+((i-1)*15), marginTop+205, '(' + lang[element][1].toString() + ')');
        langtext += lang[element][1] + ', ';
        i++;
    }
    
    doc.setFontType("normal");
    doc.text(marginLeft, marginTop+215, '(und: undefined)');
    
    doc.addPage();
    
    doc.setFontType("bold");
    doc.setFontSize(heading);
    doc.text(marginLeft, marginTop, 'Words');
    doc.setFontType("normal");
    doc.setFontSize(defaultSize);
    doc.text(marginLeft, marginTop+10, 'Word frequency in analyzed tweets.');
    
    i = 0;
    
    for (word in filecontent.word_count) {
        if ( Math.floor(i/40) >= 4 ) {
            doc.addPage();
            i = 0;
        }
        doc.text(marginLeft+40*Math.floor(i/40), marginTop+25+((i % 40)*6), word + ' (' + filecontent.word_count[word].toString() + ')');
        i++;
    }
    
    /*
    doc.addPage();
    
    doc.setFontType("bold");
    doc.setFontSize(heading);
    doc.text(marginLeft, marginTop, 'Tweets');
    doc.setFontType("normal");
    doc.setFontSize(defaultSize);
    doc.text(marginLeft, marginTop+10, 'List of analyzed tweets. Number of tweets: ' + filecontent.meta.numtweets.toString() + '.');
    
    var tweetY = marginTop+25;
    var splitTitle;
    
    for (i = 0; i < filecontent.tweets.length; i++) { 
        doc.text(marginLeft, tweetY, filecontent.tweets[i][0].toString() + ' - ' + filecontent.tweets[i][1].toString() + ' - ' + filecontent.tweets[i][2].toString());
        tweetY += 10;
        splitTitle = doc.splitTextToSize(filecontent.tweets[i][3].toString(), 80);
        doc.text(marginLeft, tweetY, splitTitle);
        tweetY += 5 + (splitTitle.length*5);
    }
    */
    doc.save('twitterstat.pdf');
    return 'created';
};