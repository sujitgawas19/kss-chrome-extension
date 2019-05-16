console.log("download sheet upload js");


if(isLoggedInUser()){
	downloadCSV();
}
else{
	alert("You are not logged in to the site. Please login to enable editing the elements and reload the page.");
	var url = window.location.href.split("#")[0] + '#/account';
    window.location = url;
}

function downloadCSV(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			console.log("response ==>", this.responseText);
			let element = document.querySelector(".kss-alert");
			setTimeoutVariable();
			if(this.status == 200){
                saveData(this.responseText, "rank-csv.csv");
				element.innerHTML = 'Ranking CSV downloaded successfully';
               	element.classList.add('kss-alert--success');
                element.classList.add('is-open');
                document.getElementById("close-button").click();
			}
			else{
				element.innerHTML ='Failed to download the CSV';
                element.classList.add('kss-alert--failure');
	            element.classList.add('is-open');
			}
		}
	};
    
	var url = '/api/rest/v2/download-rank-csv';
	xhttp.open("GET", url);
	xhttp.setRequestHeader('Authorization' , 'Bearer '+getCookie('token') );
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
}

// const saveData = (function () {
function saveData(data, fileName){
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    // return function (data, fileName) {
    const blob = new Blob([data], {type: "octet/stream"}),
    url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    // };
  }
// }());

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