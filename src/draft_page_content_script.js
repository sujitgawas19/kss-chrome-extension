var draft_script_injected = true; 
var domain = window.location.origin;
var api_domain = domain == "https://www.kidsuperstore.in" ? "https://api.kidsuperstore.in" : "https://api.stage.kidsuperstore.in";

if(isLoggedInUser()){
	addPublishSection(true);
}
else{	
	alert("You are not logged in to the site. Please login to enable update the elements and reload the page.");
	var url = window.location.href.split("#")[0] + '#/account';
    window.location = url;
    addPublishSection(false);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isLoggedInUser(){
    if(getCookie('token'))
        return true;
    return false;
}

function addPublishSection(logged_in){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var div = document.createElement('div');
	        div.setAttribute("id", "publish-section");
	        div.setAttribute("style","position: fixed;top: 0;z-index: 1031;width:100%");
	        if(!logged_in)
	        	div.setAttribute("style", "display:none");
	        else{
	        	document.getElementsByClassName('header')[0].setAttribute("style", "top:54px");
	        	document.getElementsByTagName("body")[0].setAttribute("style", "padding-top:104px");
	        }
	        div.innerHTML = this.responseText;
	        document.body.insertBefore(div, document.body.firstChild);
        	document.getElementById('publish-btn').addEventListener('click', function(){
				displayConfirmationPopup();
			});
	    }
	};
	xhttp.open("GET", chrome.extension.getURL("/publish_section.html"), true);
	xhttp.send();
}

function displayConfirmationPopup(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var div = document.createElement('div');
	        div.setAttribute("id", "confirmation_popup");
	        div.innerHTML = this.responseText;
	        document.body.insertBefore(div, document.body.firstChild);
	        listenToPublishChanges();
	        document.getElementById('confimation-modal-trigger-button').click();	        
	    }
	};
	xhttp.open("GET", chrome.extension.getURL("/confirmation_popup.html"), true);
	xhttp.send();
}

function listenToPublishChanges(){
	document.getElementById('confirm-publish-btn').addEventListener('click',function(){
		publish();
	});
}

function publish(){
	document.getElementsByTagName("body")[0].classList.add('full-page-loader');	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {		
	    if (this.readyState == 4){	    	
	     	if(this.status == 200){
	     		document.getElementById("confirmation-close-button").click();
               	let element = document.querySelector(".kss-alert");
	     		setTimeoutVariable();
	     		element.innerHTML ='Changes published successfully';
                element.classList.add('kss-alert--success');
                element.classList.add('is-open');
                redirectToPublishedPage();
	     	}
	     	else{
	     		document.getElementById("confirmation-close-button").click();
	     		console.log("display error toast");	     		
                if(this.status == 401){
                	userLogout();
                	window.location.reload();
                }
                else if(this.status == 403){
                	setTimeout(()=>{
                		alert("You do not have permissions to edit home page elements. Please ask the admin to grant permissions.");	
                	},100);                	
                }
                else{
                	let element = document.querySelector(".kss-alert");
		     		setTimeoutVariable();
		     		element.innerHTML ='Failed to publish the changes';
	                element.classList.add('kss-alert--failure');
	                element.classList.add('is-open');
                }
	     	}
	     	document.getElementsByTagName("body")[0].classList.remove('full-page-loader');	                
	    }
	};
	var url = api_domain + '/api/rest/v2/publish-page-element';
	xhttp.open("GET", url, true);
	xhttp.setRequestHeader('Authorization' , 'Bearer '+getCookie('token') );
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.setRequestHeader("X-Chrome-Extension", "KSS");
	xhttp.send();	
}

function setTimeoutVariable() {
	let element = document.querySelector(".kss-alert");

    kss_alert_timeout = setTimeout(function()
    {
        element.classList.remove('is-open', 'kss-alert--success', 'kss-alert--failure', );
        clearTimeout(kss_alert_timeout);
    }, 2500);
}

function userLogout(){
    document.cookie = "cart_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function redirectToPublishedPage(){
	//var pathname = window.location.pathname;
	//if(pathname == '/drafthome')
	//window.location = domain;
	// else if(pathname == '/draftboys')
	// 	window.location = domain+'/boys';
	// else if(pathname == '/draftgirls')
	// 	window.location = domain+'/girls';
	// else if(pathname == '/draftinfants')
	// 	window.location = domain+'infants'
}