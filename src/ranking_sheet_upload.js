console.log("ranking sheet upload js");


if(isLoggedInUser()){
	getFormTemplate();
}
else{
	alert("You are not logged in to the site. Please login to enable editing the elements and reload the page.");
	var url = window.location.href.split("#")[0] + '#/account';
    window.location = url;
}


var facets, brands, genders, subtypes, sizeChartData;
var domain = window.location.origin;
var port_img, landscape_img;

function getFormTemplate(response){
	console.log("inside getFormTemplate");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	if(document.getElementById('close-modal'))
		    	document.getElementById('close-modal').click();
	    	removeUpdateElementModal();
	        var div = document.createElement('div');
	        div.setAttribute("class", "update-element-modal");
	        div.innerHTML = this.responseText;
	        document.body.insertBefore(div, document.body.firstChild);
	        // createForm(response);
	        document.getElementById("modal-trigger-button").click();
	        document.getElementById("form_popup").classList.add('show');
	        document.getElementsByClassName("modal-backdrop")[0].classList.add('show');
	        addEventListener();
	    }
	};
	xhttp.open("GET", chrome.extension.getURL("/ranking_sheet_upload.html"), true);
	xhttp.send();
}

function removeUpdateElementModal(){
	if(document.body.firstElementChild.classList.contains('update-element-modal')){
		document.body.firstElementChild.remove();
	}
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

function addEventListener(){
	var csv_file = document.getElementById('form-csv-upload');
	csv_file.addEventListener('change', function(){
		console.log("csv file uploaded");
		console.log("check ==>", csv_file.files)
	})

	document.getElementById('submit-button').addEventListener('click', function(){
		console.log("upload file clicked");
		uploadCSV();
	})
}

function uploadCSV(){
	var xhttp = new XMLHttpRequest();
	// xhttp.onreadystatechange = function() {
	// 	if (this.readyState == 4) {
	// 		let element = document.querySelector(".kss-alert");
	// 		setTimeoutVariable();
	// 		if(this.status == 200){
	// 			// console.log(this.responseText)
	// 		}
	// 	}
	// };
	xhttp.addEventListener('load', function () {
        console.log('Response:', this.responseText);
    });
    
	var csv=document.getElementById('form-csv-upload');
	var formData = new FormData();
	console.log(formData);
	formData.append("csv",csv.files[0]);
	var url = '/api/rest/v1/save-rank-csv';

	xhttp.open("POST", url);
	xhttp.setRequestHeader('Authorization' , 'Bearer '+getCookie('token') );
	xhttp.setRequestHeader("Accept", "application/json");
	// xhttp.setRequestHeader("Content-type", "multipart/form-data");
	xhttp.send(formData);
}