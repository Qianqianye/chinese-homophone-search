var input;
var homephoneData;
var foundHomephone=[];

function preload(){
	JSONArray = loadJSON("./sample.json");
}

function setup(){
	homephoneData= JSONArray["dataset"];
}

function buildFoundDivs(filterItem, inList){
	
	const keys = Object.keys(inList)
	var destDiv = select("#searcResultBox")

	for (var key of keys) {
		if(key != 'spell'){
			var valN = inList[key];
			if(valN != filterItem){
				var newDiv = createDiv(valN);
				console.log("add newdiv "+ valN)
				newDiv.class('searchResult');
				destDiv.child(newDiv);
			}	
		}
	}
}

function removeFoundElements(){
	var pdivs = selectAll('.searchResult');
	for (var i = 0; i < pdivs.length; i++) {
		pdivs[i].remove();
	}
	
}

 function searchHomophone(){
	input = document.getElementById('type').value;
	console.log(input);
	for (var i = homephoneData.length - 1; i >= 0; i--) {
		const keys = Object.keys(homephoneData[i])
		// console.log(keys)
		for (const key of keys) {
			var valN = homephoneData[i][key]
			if( input == valN){
				console.log('MATCH FOUND')
				removeFoundElements()
			 	buildFoundDivs(input,homephoneData[i]);
			 	return
			}
		}
	}
 }



