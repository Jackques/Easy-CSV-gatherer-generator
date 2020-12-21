function getDOMTableIssueList(){
	var someArray = [];

	// $('#main-content > div.table-wrap:last table tbody tr')
	$('#main-content > div.table-wrap table tbody tr').each(function( index, element ) {
				someArray.push({
					title: sanitizeText(element.children[0].innerText),
					reproductie: sanitizeText(element.children[1].innerText),
					categorie: sanitizeText(element.children[2].innerText),
					description: element.children[3].innerText.replace(/"/g, "").replace(/\\/g, ''),
					screensinhtml: getAllTheScreens(element.children[4]),
					melder: sanitizeText(element.children[5].innerText)
				})
	});
	return someArray;
}
function sanitizeText(text){
	return text.replace(/"/g, "").replace(/,/g, '').replace(/\\/g, '');
}

function getAllTheScreens(DOMelement){
	myArray = [];
	$(DOMelement).find('img').each(function( index, element ) {
	  myArray.push(element.src);
	});
	return myArray;
}

function createDiv(){
	var $div = $("<div>", {id: "jack", "style": "position:absolute;z-index: 10;background-color:salmon;width: 1200px;padding: 10px;right: 200px;"});
	$("body").append($div);
}

function createCSV(anArray){
	csvString = "Summary,Priority,Creator,Labels,Labels,Description"+"<br/>";
	
	//with attachments (which Jira will not map, unless i import the eventual .csv file as admin)
	//csvString = "Summary,Priority,Creator,Attachment,Labels,Labels,Description"+"<br/>";
	
	$(anArray).each(function( index, element ) {
	  csvString = csvString + 
		//with attachments (which Jira will not map, unless i import the eventual .csv file as admin)
		//`[${element.categorie}] ${element.title},low,jackg,"https://confluence.anva.nl/download/attachments/75766057/image2020-12-8_7-22-20.png?version=1&modificationDate=1607408541006&api=v2",UX/UI,doorkliksessie-nieuwe-fr,"*Uitdaging:*${specialCharacters()}${element.description}${specialCharacters(2)}*Melder:*${specialCharacters()}${element.melder}${specialCharacters(2)}*Reproductie:*${specialCharacters()}${element.reproductie}${specialCharacters(2)}*Schermprinten:*${specialCharacters()}${displayScreenshots(element.screensinhtml)}"<br/>`;
		
		`[${element.categorie}] ${element.title},low,jackg,UX/UI,doorkliksessie-nieuwe-fr,"*Uitdaging:*${specialCharacters()}${element.description}${specialCharacters(2)}*Melder:*${specialCharacters()}${element.melder}${specialCharacters(2)}*Reproductie:*${specialCharacters()}${element.reproductie}${specialCharacters(2)}*Schermprinten:*${specialCharacters()}${displayScreenshots(element.screensinhtml)}"<br/>`;
	});
	return csvString;
	
	/*
	NOTE:
	- Due to known bug in Jira CSV, it took me a while to try out that i should NOT check Map field value on the 'description field' (on the .csv mapping page right after importing & selecting a project in Jira. ). This f*cked up my markup inside the descriptiontext (the.. JIRA SPECIFIC (bold text asterixs, the double qoutes to indicate a long string/text, etc.)).
	I tried using backslashes first many times, but that had JS problems of it's own...
	https://community.atlassian.com/t5/Jira-questions/Jira-import-issues-via-CSV-Embedded-newlines-in-text-fields-are/qaq-p/905477
	- I also tried but could not import an attachment either (apparantly admin's can?)
	https://community.atlassian.com/t5/Jira-questions/import-attachments-from-csv-file/qaq-p/245071
	https://community.atlassian.com/t5/Jira-questions/How-to-import-attachments-using-the-CSV-importer/qaq-p/327051
	https://confluence.atlassian.com/adminjiraserver072/importing-data-from-csv-829827152.html#ImportingdatafromCSV-howRunningtheCSVfileimportwizard
	*/
}
function specialCharacters(amount){
	if(amount === 2){
		return '<br/><br/>';
	}
	return '<br/>';
}
function displayScreenshots(anArray){
	var str = '';
	if(anArray && anArray.length){
		$(anArray).each(function( index, element ) {
		 str = str + `!${element}!${specialCharacters(2)}`;
		});
	}
	str = str === '' ? '-' : str;
	return str;
}
function main(){
	createDiv();
	$('#jack').html(createCSV(getDOMTableIssueList()));
	
	/* todo: 
	put it in seperate project for future chrome extension? 
	(wild idea: maybe with select-it-yourself-columns (or even cells) with a nice graphical user interface to create/generate your own .csv file easily!).
	We can easily scour the web, select&store any data as a columnheader(e.g. summarytextLABEL/KEY) or columndata (e.g. summarytextDATA/VALUE) & generate a .csv file when we want!
	Maybe temporarily save the data mentioned above in cookies or localstorage? or otherwise (e.g. my personal webserver)?
*/
}
main();