checkbox = document.getElementById("checkbox");
var bgPage = chrome.extension.getBackgroundPage();

chrome.storage.sync.get('editing_enabled', function(data) {
    console.log("data ==>", data);
    if(data.editing_enabled == "true")
    	document.getElementById("checkbox").checked = true;
});

checkbox.addEventListener('change', function(e) {
  if(checkbox.checked){
  	chrome.storage.sync.set({ editing_enabled: "true" });
  	bgPage.checkActiveTab();
  }
  else{
  	chrome.storage.sync.set({ editing_enabled: "false" });
  	chrome.tabs.executeScript({
		file: 'remove_element.js'
    });
  }
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log("message recieved", request);
      sendResponse({farewell: "goodbye"});
});