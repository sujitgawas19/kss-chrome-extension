console.log("size chart config js");

getFormTemplate();
fetchFacets();
var facets, brands, genders, subtypes;
var domain = window.location.origin;


function getFormTemplate(response){
	console.log("inside getFormTemplate");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	removeUpdateElementModal();
	        var div = document.createElement('div');
	        div.setAttribute("class", "update-element-modal");
	        div.innerHTML = this.responseText;
	        document.body.insertBefore(div, document.body.firstChild);
	        // createForm(response);
	        document.getElementById("modal-trigger-button").click();
	        document.getElementById("form_popup").classList.add('show');
	        document.getElementsByClassName("modal-backdrop")[0].classList.add('show');
	    }
	};
	xhttp.open("GET", chrome.extension.getURL("/size_chart_popup.html"), true);
	xhttp.send();
}

function removeUpdateElementModal(){
	if(document.body.firstElementChild.classList.contains('update-element-modal')){
		document.body.firstElementChild.remove();
	}
}

function fetchFacets(){
	console.log("inside fetch facets");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4){
			if(this.status == 200){
				facets = JSON.parse(this.responseText);
				populateFacets();
				console.log("facets ==>", facets);	
			}
			else{				
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
     //            	setTimeoutVariable();
					// let element = document.querySelector(".kss-alert");
					// element.innerHTML ='Failed to fetch the element data';
	    //             element.classList.add('kss-alert--failure');
	    //             element.classList.add('is-open');
                }
			}
		}
	};
	// var url = domain + "/api/rest/v1/get-page-element/"+id +"?type="+static_element_type+'&page_slug='+static_element_page_slug;
	var url = 'https://demo8558685.mockable.io/size_config';
	xhttp.open("GET", url , true);
	xhttp.setRequestHeader('Authorization' , 'Bearer '+getCookie('token') );
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
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

function populateFacets(){
	console.log(facets.data[0].facet_name);
	for(var i = 0; i < facets.data.length; i++){
		if(facets.data[i].facet_name == "product_brand")
			brands = facets.data[i].facet_values
		if(facets.data[i].facet_name == "product_gender")
			genders = facets.data[i].facet_values
		if(facets.data[i].facet_name == "product_subtype")
			subtypes = facets.data[i].facet_values
	}
	console.log("check ==>",brands, genders, subtypes);
	var ele = document.getElementById('brands');
        for (var i = 0; i < brands.length; i++) {
            // POPULATE SELECT ELEMENT WITH JSON.
            ele.innerHTML =  ele.innerHTML +
                '<option value="' + brands[i]['slug'] + '">' + brands[i]['display_name'] + '</option>';
        }

        ele = document.getElementById('gender');
        for (var i = 0; i < genders.length; i++) {
            // POPULATE SELECT ELEMENT WITH JSON.
            ele.innerHTML =  ele.innerHTML +
                '<option value="' + genders[i]['slug'] + '">' + genders[i]['display_name'] + '</option>';
        }

        ele = document.getElementById('subtype');
        for (var i = 0; i < subtypes.length; i++) {
            // POPULATE SELECT ELEMENT WITH JSON.
            ele.innerHTML =  ele.innerHTML +
                '<option value="' + subtypes[i]['slug'] + '">' + subtypes[i]['display_name'] + '</option>';
        }
}
