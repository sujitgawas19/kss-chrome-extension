console.log("background.js");

var home_pages = ['http://localhost:8000/','http://localhost:8000/newhome', 'https://test.stage.kidsuperstore.in/', 'https://www.kidsuperstore.in/', 'https://pre-prod.stage.kidsuperstore.in/', 'http://localhost:8000/shop/boys', 'http://localhost:8000/shop/girls', 'http://localhost:8000/shop/infants', 'https://test.stage.kidsuperstore.in/shop/boys', 'https://test.stage.kidsuperstore.in/shop/girls', 'https://test.stage.kidsuperstore.in/shop/infants', 'https://www.kidsuperstore.in/shop/boys', 'https://www.kidsuperstore.in/shop/girls', 'https://www.kidsuperstore.in/shop/infants', 'https://pre-prod.stage.kidsuperstore.in/shop/boys', 'https://pre-prod.stage.kidsuperstore.in/shop/girls', 'https://pre-prod.stage.kidsuperstore.in/shop/infants', "https://pre-prod.stage.kidsuperstore.in/newhome", "https://www.kidsuperstore.in/newhome"];

var draft_pages = [ 'http://localhost:8000/drafthome', 'https://test.stage.kidsuperstore.in/drafthome', 'https://www.kidsuperstore.in/drafthome', 'https://pre-prod.stage.kidsuperstore.in/drafthome', 'http://localhost:8000/draft/boys', 'http://localhost:8000/draft/girls', 'http://localhost:8000/draft/infants', 'https://test.stage.kidsuperstore.in/draft/boys', 'https://test.stage.kidsuperstore.in/draft/girls', 'https://test.stage.kidsuperstore.in/draft/infants', 'https://www.kidsuperstore.in/draft/boys', 'https://www.kidsuperstore.in/draft/girls', 'https://www.kidsuperstore.in/draft/infants', 'https://pre-prod.stage.kidsuperstore.in/draft/boys', 'https://pre-prod.stage.kidsuperstore.in/draft/girls', 'https://pre-prod.stage.kidsuperstore.in/draft/infants'];

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