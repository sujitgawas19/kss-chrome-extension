console.log("background.js");

var home_pages = [
	'http://localhost:4000/', 'http://localhost:4000/shop/boys', 'http://localhost:4000/shop/girls', 'http://localhost:4000/shop/infants', 
	'https://www.kidsuperstore.in/', 'https://www.kidsuperstore.in/shop/boys', 'https://www.kidsuperstore.in/shop/girls', 'https://www.kidsuperstore.in/shop/infants',
	'https://angular-v2.stage.kidsuperstore.in/', 'https://angular-v2.stage.kidsuperstore.in/shop/boys', 'https://angular-v2.stage.kidsuperstore.in/shop/girls', 'https://angular-v2.stage.kidsuperstore.in/shop/infants', 
	'https://angular.stage.kidsuperstore.in/', 'https://angular.stage.kidsuperstore.in/shop/boys', 'https://angular.stage.kidsuperstore.in/shop/girls', 'https://angular.stage.kidsuperstore.in/shop/infants'
	];

var draft_pages = [
	'http://localhost:4000/drafthome', 'http://localhost:4000/draft/boys', 'http://localhost:4000/draft/girls', 'http://localhost:4000/draft/infants',
	'https://www.kidsuperstore.in/drafthome', 'https://www.kidsuperstore.in/draft/boys', 'https://www.kidsuperstore.in/draft/girls', 'https://www.kidsuperstore.in/draft/infants', 
	'https://angular-v2.stage.kidsuperstore.in/drafthome', 'https://angular-v2.stage.kidsuperstore.in/draft/boys', 'https://angular-v2.stage.kidsuperstore.in/draft/girls', 'https://angular-v2.stage.kidsuperstore.in/draft/infants', 
	'https://angular.stage.kidsuperstore.in/drafthome', 'https://angular.stage.kidsuperstore.in/draft/boys', 'https://angular.stage.kidsuperstore.in/draft/girls', 'https://angular.stage.kidsuperstore.in/draft/infants'
	];

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
	console.log("Updated tab ==>", tabId, changeInfo, tab);
	if(changeInfo.status == 'complete'){
		if(home_pages.includes(tab.url) || draft_pages.includes(tab.url))
			isEditingEnabled(checkActiveTab);
	}
});

function isEditingEnabled(callback){
	chrome.storage.sync.get('editing_enabled', function(data) {
	    console.log("data ==>", data);
	    if(data.editing_enabled == "true"){
	    	callback();
	    }
	});
}

function checkActiveTab(){
	var queryInfo = {
  		active : true,
  		currentWindow: true
  	}
  	chrome.tabs.query(queryInfo, function(result){
  		console.log(result);
  		if(result.length && home_pages.includes(result[0].url) ){
  			executeScript();
  		}
  		if(result.length && draft_pages.includes(result[0].url) ){
  			executeDraftPageScript();
  		}
  	});
}

function executeScript(){
	console.log("inside executeScript function")
	chrome.tabs.executeScript({code: "window.content_script_injected"}, function(result) {
		console.log("check result ==>",result);
		if (!result[0]) {
	    	chrome.tabs.executeScript({
				file: 'content_script.js'
		    });
		}
		else{
			chrome.tabs.executeScript({
				file: 'add_element.js'
		    });
		}
	});	
}

function executeDraftPageScript(){
	console.log("inside executeDraftPageScript function");
	chrome.tabs.executeScript({code: "window.draft_script_injected"}, function(result) {
		console.log("check result ==>",result);
		if (!result[0]) {
	    	chrome.tabs.executeScript({
				file: 'draft_page_content_script.js'
		    });
		}
		else{
			chrome.tabs.executeScript({
				file: 'add_element.js'
		    });
		}
	});	
}

function insertSizeChartConfigJS(){
	chrome.tabs.executeScript({
		file: 'size_chart_config.js'
	});
	// chrome.tabs.executeScript({
	// 	file: 'jquery.js'
	// });
}

function insertRankingSheetJS(){
	chrome.tabs.executeScript({
		file: 'ranking_sheet_upload.js'
	});
}

function insertRankingSheetDownloadJS(){
	chrome.tabs.executeScript({
		file: 'ranking_sheet_download.js'
	});
}