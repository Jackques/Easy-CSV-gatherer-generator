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