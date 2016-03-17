//get previous summary text
chrome.storage.sync.get('sText', function(items){
if (items.sText == null)
{
	document.getElementById('outputDiv').innerHTML = "";
}
else
{
	document.getElementById('outputDiv').innerHTML = items.sText;
}
});

//get previous article text
chrome.storage.sync.get('aText', function(items){
if (items.aText == null)
{
	document.getElementById('inputArea').innerHTML = "";
}
else
{
	document.getElementById('inputArea').value = items.aText;
}
});

//get previous trim number
chrome.storage.sync.get('tN', function(items){
if (items.tN == null)
{
	document.getElementById('trimNumber').innerHTML = "";
}
else
{
	document.getElementById('trimNumber').value = items.tN;
}

});

//get previous link
chrome.storage.sync.get('urlLink', function(items){
if (items.urlLink == null)
{
	document.getElementById('links').innerHTML = "";
}
else
{
	document.getElementById('links').innerHTML = items.urlLink;
}

});





//takes in article text and the trim number and summarizes the text. The larger the trim
//number the shorter the summary will be
function summary(text, num)
{
	var summaryString = "";
	var articleString = text;
	var l = articleString.length;

	var x = num;
	var y = 1;
	
	//loops through the sentences of the article text
	while (y <= 1000)
	{
		var i = articleString.indexOf('.') + 1;
	
		//pulls sentences from the article and adds them to the summary
		if ((x % num) == 0)
		{
		
			summaryString = summaryString + articleString.substring(0, i);
		
		}
	
		articleString = articleString.substring(i, l);
		x = x + 1;
		y = y + 1;
	}

	//stores summary text in chrome browser storage
	chrome.storage.sync.set({'sText': summaryString}, function() {
	});

	//output summary in extension page
	document.getElementById('outputDiv').innerHTML = summaryString;
}





function getLink()
{
	chrome.tabs.query (
		{ currentWindow: true, active: true }, 
		function(tabs) {
		
			//get url of the article
			var activeTab = tabs[0];
			var urlString = activeTab.url;
			
			//create the url string
			var i = urlString.indexOf('.') + 1;
			var l = urlString.length;
			
			urlString = urlString.substring(i, l);
			
			var x = urlString.indexOf('.');
			
			urlString = urlString.substring(0, x);
			urlString = "https://en.wikipedia.org/wiki/" + urlString;
			
			//store the string in storage
			chrome.storage.sync.set({'urlLinkString': urlString}, function() {
			});
			
			urlString = urlString.link(urlString);
			
			//store the link in storage
			chrome.storage.sync.set({'urlLink': urlString}, function() {
			});

			//display the link
			document.getElementById('links').innerHTML = urlString;
			});
}






//wait for submit button to be clicked
document.getElementById("submitButton").addEventListener("click", function(){
//get input text and the trim number
var articleText = document.getElementById("inputArea").value;
var trimN = document.getElementById("trimNumber").value;
trimN = parseInt(trimN);

//store the article text in chrome browser storage
chrome.storage.sync.set({'aText': articleText}, function() {
});

//store the trim number in chrome browser storage
chrome.storage.sync.set({'tN': trimN}, function() {
});

getLink();
summary(articleText, trimN);
});  





//wait for the link to be clicked
document.getElementById("links").addEventListener("click", function(){
	//retrieve url string
	chrome.storage.sync.get('urlLinkString', function(items){
	var s = items.urlLinkString;
	//open new tab with the url string
	chrome.tabs.create({ url: s });

});
});  
      




//wait for clear button to be clicked
document.getElementById("clearButton").addEventListener("click", function(){
	document.getElementById("inputArea").value = "";
	document.getElementById("trimNumber").value = "";
	document.getElementById("outputDiv").innerHTML = "";
	document.getElementById("links").innerHTML = "";
}); 



