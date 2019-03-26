console.log("size chart config js");

getFormTemplate();
fetchFacets();
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
				listenToApplyFacets();
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
	// var params = ['product_brand', 'product_subtype', 'product_gender'];
	// console.log("params ==>", params, encodeURIComponent(JSON.stringify(params)));
	// var url = domain + "/api/rest/v1/facets?type="+encodeURIComponent(JSON.stringify(params));
	// console.log("check url ==>", url)
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

function addEventListeners(){
	console.log("addEventListeners function");
	listenToSubmitForm();

	port_img = document.getElementById("form-popup-portrait-img");
	landscape_img = document.getElementById("form-popup-landscape-img");

	port_img.addEventListener('change', function(){
		console.log("mobile image change listner");
		previewFile('portrait')
	});
	landscape_img.addEventListener('change', function(){
		console.log("desktop image change listner");
		previewFile('landscape')
	});

	document.getElementById('remove_portrait_image').addEventListener('click', function(){
		removeImage('portrait');
	});

	document.getElementById('remove_landscape_image').addEventListener('click', function(){
		removeImage('landscape');
	});
}

function populateFacets(){
	addEventListeners();
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
                '<option value="' + brands[i]['facet_value'] + '">' + brands[i]['display_name'] + '</option>';
        }

        ele = document.getElementById('gender');
        for (var i = 0; i < genders.length; i++) {
            // POPULATE SELECT ELEMENT WITH JSON.
            ele.innerHTML =  ele.innerHTML +
                '<option value="' + genders[i]['facet_value'] + '">' + genders[i]['display_name'] + '</option>';
        }

        ele = document.getElementById('subtype');
        for (var i = 0; i < subtypes.length; i++) {
            // POPULATE SELECT ELEMENT WITH JSON.
            ele.innerHTML =  ele.innerHTML +
                '<option value="' + subtypes[i]['facet_value'] + '">' + subtypes[i]['display_name'] + '</option>';
        }
}

function listenToApplyFacets(){
	document.getElementById('apply-facets').addEventListener('click',function(){
		console.log("apply facets")
		this.classList.add('disabled');
		document.getElementById('apply-button-loader').classList.remove('d-none');

		var ele = document.getElementById('brands');
		var brand = ele.options[ele.selectedIndex].value;
		ele = document.getElementById('subtype');
		var subtype = ele.options[ele.selectedIndex].value;
		ele = document.getElementById('gender');
		var gender = ele.options[ele.selectedIndex].value;
		callGetSizeChartApi(brand, subtype, gender);
	});
}

function listenToSubmitForm(){
	document.getElementById('submit-button').addEventListener('click',function(){
		this.classList.add('disabled');
		document.getElementById('submit-button-loader').classList.remove('d-none');
		// document.getElementById('submit-button-loader').classList.add('d-block');
		callSaveApi();
	});
}


function callGetSizeChartApi(brand, subtype, gender){
	console.log("params ==>", brand, subtype, gender);

	console.log("inside fetchElement function");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4){
			if(this.status == 200){
				sizeChartData = JSON.parse(this.responseText);
				sizeChartData = sizeChartData.data;
				displaySizeChart();			
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
			document.getElementById('apply-button-loader').classList.add('d-none');
			document.getElementById('apply-facets').classList.remove('disabled');
		}
	};
	var url = domain + "/api/rest/v1/get-size-charts?product_brand="+brand+'&product_subtype='+subtype+'&product_gender='+gender;
	url = "https://demo8558685.mockable.io/size_chart";
	xhttp.open("GET", url , true);
	xhttp.setRequestHeader('Authorization' , 'Bearer '+getCookie('token') );
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
}

function displaySizeChart(){
	console.log("sizeChartData", sizeChartData);
	document.getElementById('form-image-section').classList.add('d-block');
	document.getElementById('modal-footer').classList.add('d-block');

	if(sizeChartData.images.mobile.original){
		var ele = document.getElementById('mobile_size_chart');
		ele.innerHTML = "<a href='" + sizeChartData.images.mobile.original + "'  target='_blank'>Existing size chart </a>"
	}
	else{
		var ele = document.getElementById('mobile_size_chart');
		ele.innerHTML = "No Existing size chart"
	}

	if(sizeChartData.images.desktop.original){
		var ele = document.getElementById('desktop_size_chart');
		ele.innerHTML = "<a href='" + sizeChartData.images.desktop.original + "'  target='_blank'>Existing size chart </a>"
	}
	else{
		var ele = document.getElementById('desktop_size_chart');
		ele.innerHTML = "No Existing size chart"
	}
}


function callSaveApi(){
	if(port_img.value || landscape_img.value){
			sizeChartData.images = {};
			console.log("inside save ==>", sizeChartData);
			if(port_img.value){
				getBase64(port_img.files[0]).then((data)=>{
					sizeChartData.images.mobile = data.split(',')[1];
					
					if(landscape_img.value){

						getBase64(landscape_img.files[0]).then((data2)=>{
							sizeChartData.images.desktop = data2.split(',')[1];
							saveElement();
						})

					}
					else{
						saveElement();
					}

				})
			}
			else{
				getBase64(landscape_img.files[0]).then((data2)=>{
					sizeChartData.images.desktop = data2.split(',')[1];
					saveElement();
				})
			}			
	}
	else{
		console.log("no data to save");
		document.getElementById('submit-button-loader').classList.add('d-none');
		document.getElementById('submit-button').classList.remove('disabled');
		document.getElementById('error-msg-main').classList.add('d-block');
	}
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function saveElement(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			let element = document.querySelector(".kss-alert");
			// setTimeoutVariable();
			if(this.status == 200){
				// console.log("request complete");
				// element.innerHTML = 'Element saved successfully';
    //            	element.classList.add('kss-alert--success');
    //             element.classList.add('is-open');
    //             document.getElementById("close-button").click();
			}
			else{
				console.log("request failed");				
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
                	// element.innerHTML ='Failed to save the element';
	                // element.classList.add('kss-alert--failure');
	                // element.classList.add('is-open');
                }
			}
		// document.getElementsByTagName("body")[0].classList.remove('full-page-loader');
		// document.getElementById('submit-button-loader').classList.remove('d-block');
		document.getElementById('submit-button-loader').classList.add('d-none');
		document.getElementById('submit-button').classList.remove('disabled');
		}
	};
	var url = domain + '/api/rest/v1/save-sizechart-images';
	console.log("save url ==>", url);
	xhttp.open("POST", url , true);
	xhttp.setRequestHeader('Authorization' , 'Bearer '+getCookie('token') );
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	console.log("inside saveElement function",sizeChartData);
	var formattedJsonData = JSON.stringify(sizeChartData);
	xhttp.send(formattedJsonData);
}



function previewFile(type) {
	console.log("previewFile", type);
	var preview, file;
	if(type == 'portrait'){
		preview = document.getElementById('portrait_preview');
		file    = port_img.files[0];		
	}
	else{
		preview = document.getElementById('landscape_preview');
		file    = landscape_img.files[0];	
	}
	var reader  = new FileReader();

	reader.addEventListener("load", function () {
		console.log("file ==>",file);
		if(type == 'portrait'){			
			var image = new Image();
			image.src = reader.result;
			image.onload = function(){
				console.log("height ==>", this.height);
				console.log("width ==>", this.width);
				preview.src = reader.result;
				document.getElementsByClassName('img-info')[0].classList.add('d-flex');
				document.getElementById('port_file_name').innerHTML = port_img.files[0].name;
				portrait_img_error.style.display = "none";
				document.getElementsByClassName('portrait-uploader')[0].classList.add('d-none');
				document.getElementsByClassName('portrait-uploader')[0].classList.remove('d-block');
			}
		}
		else{
			preview.src = reader.result;
			landscape_img_error.style.display = "none";
			document.getElementsByClassName('img-info-land')[0].classList.add('d-flex');
			document.getElementById('land_file_name').innerHTML = landscape_img.files[0].name;
			document.getElementsByClassName('landscape-uploader')[0].classList.add('d-none');
			document.getElementsByClassName('landscape-uploader')[0].classList.remove('d-block');

		}
	}, false);

	if (file) {
		reader.readAsDataURL(file);
	}
}

function removeImage(type){
	if(type == 'portrait'){
		port_img.value = "";
		document.getElementById('portrait_preview').src = "";
		document.getElementsByClassName('img-info')[0].classList.add('d-none');
		document.getElementsByClassName('img-info')[0].classList.remove('d-flex');
		document.getElementsByClassName('portrait-uploader')[0].classList.add('d-block');
	}
	else{
		landscape_img.value = "";
		document.getElementById('landscape_preview').src = "";
		document.getElementsByClassName('img-info-land')[0].classList.add('d-none');
		document.getElementsByClassName('img-info-land')[0].classList.remove('d-flex');
		document.getElementsByClassName('landscape-uploader')[0].classList.add('d-block');
	}
}