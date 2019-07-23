console.log("content_script js injected");

var content_script_injected = true; // to check if content_script is already injetced from background.
var href,port_img_name,landscape_img_name,port_img,landscape_img,title,img_alt,remove_portrait,remove_landscape;
var href_error, title_error, img_alt_error, portrait_img_error, landscape_img_error;
var elementData;
var reader  = new FileReader();
var text1, text2, text_error_1, text_error_2, text3, text_error_3;
var kss_alert_timeout;
var product1, product2, product3, product1_error, product2_error, product3_error;
var trending_product, trending_product_error;

var portrait_max_size = 300000;
var portrait_min_height = 933;
var portrait_min_width = 1200;
var landscape_max_size = 300000;
var landscape_min_height = 700; 
var landscape_min_width = 2000;
var gif_max_size;

var sequence_id, static_element_name, static_element_type, static_element_page_slug;
var domain = window.location.origin;
var api_domain = domain == "https://www.kidsuperstore.in" ? "https://api.kidsuperstore.in" : (domain == "https://angular.stage.kidsuperstore.in" ? "https://api.stage.kidsuperstore.in" : "https://api-v2.stage.kidsuperstore.in");

var link, link_error, bg_color, bg_color_error, text_color, text2_color;

var banner_length, static_element_btn;

console.log("domain ==>", domain);

if(isLoggedInUser()){
	findEditableElements(true);
	addEditingEnabledElement(true);
}
else{
	findEditableElements(false);
	addEditingEnabledElement(false);
	alert("You are not logged in to the site. Please login to enable editing the elements and reload the page.");
	var url = window.location.href.split("#")[0] + '#/account';
    window.location = url;
}

// window.onpopstate = function() {
//   console.log("check pathname ==>",window.location.pathname);
//   if(isLoggedInUser() && window.location.pathname == "/"){
//   	document.getElementsByClassName('header')[0].setAttribute("style", "top:54px");
// 	document.getElementsByTagName("body")[0].setAttribute("style", "padding-top:104px");
// 	document.getElementById('edit-enabled-element').style.display = 'block';
//   }
//   else{
//   	console.log("check else")
//   	document.getElementById('edit-enabled-element').setAttribute("style", "display:none");
//   }

// };

function findEditableElements(logged_in){
	setTimeout(()=>{
		var elements = document.getElementsByClassName('kss-extension');
		// console.log("findEditableElements ==>", logged_in, elements.length);
		for(var i = 0; i < elements.length; i++){
			var btn = document.createElement("BUTTON");
			btn.setAttribute("class", "update-element-btn btn btn-danger btn-lg pulsing");
			if(logged_in){
				if(elements[i].getAttribute("static_element-display_type") == "BannerTest")
					btn.setAttribute("style", "visibility:visible;width:auto;position:relative;top: -34vw;left: 90%;");
				else if(elements[i].getAttribute("static_element-display_type") == "Section")
					btn.setAttribute("style", "width:auto;position:absolute;top:-15px;right:0");
				else if(elements[i].getAttribute("static_element-display_type") == "Menu")
					btn.setAttribute("style", "width:auto;position:absolute;z-index: 1;top: 10px");		
				else 
					btn.setAttribute("style", "width:auto;position:absolute;z-index: 1;top: 10px;right:0");
			}
			else{
				if(elements[i].getAttribute("static_element-display_type") == "BannerTest")
					btn.setAttribute("style", "visibility:visible;width:auto;position:relative;top: -34vw;left: 90%;");
				else if(elements[i].getAttribute("static_element-display_type") == "Section")
					btn.setAttribute("style", "width:auto;position:absolute;top:-15px;right:0");
				else
					btn.setAttribute("style", "width:auto;position:absolute;z-index: 1;top: 10px;right:0");	

				btn.setAttribute("class", "update-element-btn btn btn-danger btn-lg pulsing d-none");
			}
			var btn_name = "Edit ";
			if(elements[i].getAttribute("static_element-display_type") !== "Menu")
				btn_name = btn_name+elements[i].getAttribute("static_element-display_type")+ " " +elements[i].getAttribute("static_element-id");

			var text = document.createTextNode(btn_name);
			btn.appendChild(text);
			elements[i].appendChild(btn);
		}

		var config_elements = document.getElementsByClassName('kss-section-config');
		for(var i = 0; i < config_elements.length; i++){
			var btn = document.createElement("BUTTON");
			btn.setAttribute("class", "update-element-btn btn btn-danger btn-lg pulsing");
			if(logged_in){
				btn.setAttribute("style", "width:auto;position:absolute;z-index: 1;top: 140px;right:0");
			}
			else{
				btn.setAttribute("style", "width:auto;position:absolute;z-index: 1;top: 140px;right:0");	

				btn.setAttribute("class", "update-element-btn btn btn-danger btn-lg pulsing d-none");
			}
			var btn_name = "Edit "+config_elements[i].getAttribute("static_element-display_type");

			var text = document.createTextNode(btn_name);
			btn.appendChild(text);
			config_elements[i].appendChild(btn);
		}

		editBanners();
		addEventListner()
	},3000);
}

function editBanners(){
	static_element_btn = document.getElementsByClassName("static_element_edit_btn");
	// console.log("static_element_btn ==>", static_element_btn)
	if(static_element_btn.length){
		for(var i = 0; i < static_element_btn.length; i++){
			static_element_btn[i].classList.add('d-block');
			element_length = static_element_btn[i].getAttribute("static_element_length");
			list_name = static_element_btn[i].getAttribute("static_element-display_type");
			element_name = static_element_btn[i].getAttribute("static_element_name");
			element_type = static_element_btn[i].getAttribute("static_element-type");
			console.log("banner length ==>", element_length);
			elementEditButton(static_element_btn[i],element_length, list_name, element_name, element_type)
		}
	}
}

 function elementEditButton(element,element_length, list_name, element_name, element_type){
 	element.addEventListener('click', function(){
		getEditBannerPopup(element_length, list_name, element_name, element_type);
	})
 }

function getEditBannerPopup(element_length, list_name, element_name, element_type){
	console.log("inside getEditBannerPopup");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	removeUpdateElementModal();
	        var div = document.createElement('div');
	        div.setAttribute("class", "update-element-modal");
	        div.innerHTML = this.responseText;
	        document.body.insertBefore(div, document.body.firstChild);
	        addBannerButtons(element_length, list_name, element_name, element_type)
	        document.getElementById('edit_element_list_popup').innerHTML = list_name + " List" 
	        document.getElementById("modal-trigger-button").click();
	        document.getElementById("form_popup").classList.add('show');
	        document.getElementsByClassName("modal-backdrop")[0].classList.add('show');
	    }
	};
	xhttp.open("GET", chrome.extension.getURL("/edit_banners_popup.html"), true);
	xhttp.send();
}

function addBannerButtons(element_length, list_name, element_name, element_type){
	var length = parseInt(element_length)+1;
	console.log(length)
    for (var i = 1; i < length; i++) {
        ele = document.getElementById('banner-btn-container')
        ele.innerHTML =  ele.innerHTML + '<button class="btn btn-danger btn-lg" sequence='+i+' id="' +"banner_"+i+'">' + element_name + i  + '</button> <br> <br>';
    }

    for(var i= 1; i< length; i++) {
    	let id = "banner_"+i;
        console.log("id==>", id)
        document.getElementById(id).addEventListener('click', function(){
        	console.log("edit banner btn clicked", this.getAttribute("sequence"));
        	document.getElementById('close-modal-banner-popup').click();
        	removeUpdateElementModal();
        	var elements = document.getElementsByClassName("update-element-btn");

	    	for(var j = 0; j<elements.length; j++){
	    		elements[j].classList.add('disabled');
	    	}
	    	for(var k=0; k<static_element_btn.length; k++)
		    	static_element_btn[k].classList.add('disabled');

	    	var span = document.createElement('span');
	    	span.innerHTML = '<i class="fas fa-circle-notch fa-spin fa-lg ml-2"></i>';
	    	for(var k=0; k<static_element_btn.length; k++){
		    	// static_element_btn[k].appendChild(span);
		    	// console.log("static_element_btn check ==>", static_element_btn[k])
	    	}

        	sequence_id = parseInt(this.getAttribute("sequence"))
        	static_element_name = list_name
        	static_element_type = element_type;
	    	static_element_page_slug = 'home';
	    	setTimeout(()=>{
	    		fetchElement(sequence_id,static_element_btn);		
	    	},300);        	
        })
    }
}


function addEditingEnabledElement(logged_in){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var div = document.createElement('div');
	        div.setAttribute("id", "edit-enabled-element");
	        div.setAttribute("style","position: fixed;top: 0;z-index: 1031;width:100%");
	        if(!logged_in){
	        	div.setAttribute("style", "display:none");
	        }
	        else{
	        	document.getElementsByClassName('header')[0].setAttribute("style", "top:54px");
	        	document.getElementsByTagName("body")[0].setAttribute("style", "padding-top:104px");
	        }
	        div.innerHTML = this.responseText;
	        document.body.insertBefore(div, document.body.firstChild);
        	document.getElementById('draft-btn').addEventListener('click', function(){
        		var url;
        		if(window.location.pathname == '/' || window.location.pathname == '/newhome')        		
					url = domain+'/drafthome';
				else
					url = domain+'/draft/' + window.location.pathname.substring(6);
				window.open(url);
				// win.focus();
			});
	    }
	};
	xhttp.open("GET", chrome.extension.getURL("/edit-enabled-section.html"), true);
	xhttp.send();
}

function addEventListner(){
	var elements = document.getElementsByClassName("update-element-btn");
	for (var i = 0; i < elements.length; i++) {
	    elements[i].addEventListener('click',function(){
	    	for(var j = 0; j<elements.length; j++){
	    		elements[j].classList.add('disabled');
	    	}
	    	var span = document.createElement('span');
	    	span.innerHTML = '<i class="fas fa-circle-notch fa-spin fa-lg ml-2"></i>';
	    	this.appendChild(span);
	    	console.log("check ==>", this.parentElement.getAttribute("id"));
	    	sequence_id = this.parentElement.getAttribute("static_element-id");
	    	static_element_name = this.parentElement.getAttribute("static_element-display_type");
	    	static_element_type = this.parentElement.getAttribute("static_element-type");
	    	static_element_page_slug = this.parentElement.getAttribute("page_slug");
			fetchElement(sequence_id, this);
		});
	}
}

function fetchElement(id, element){
	// document.getElementsByTagName("body")[0].classList.add('full-page-loader');
	console.log("inside fetchElement function");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4){
			if(this.status == 200){
				elementData = JSON.parse(this.responseText);
				getFormTemplate(JSON.parse(this.responseText));				
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
                	setTimeoutVariable();
					let element = document.querySelector(".kss-alert");
					element.innerHTML ='Failed to fetch the element data';
	                element.classList.add('kss-alert--failure');
	                element.classList.add('is-open');
                }
			}
			var elements = document.getElementsByClassName("update-element-btn");
			for(var j = 0; j<elements.length; j++){
	    		elements[j].classList.remove('disabled');
	    	}
	    	try{
		    	for(var k=0; k<element.length; k++){
		    		// console.log(element[k]);
		    		// element[k].removeChild(element[k].childNodes[1]); 
			    	element[k].classList.remove('disabled')
		    	}
		    	element.removeChild(element.childNodes[1]); 
		    }
		    catch(error){
		    	console.log("error ==>", error);
		    }
		}
	};
	var url = api_domain + "/api/rest/v2/get-page-element/"+id +"?type="+static_element_type+'&page_slug='+static_element_page_slug;
	// var url = 'https://demo8558685.mockable.io/get-page-element';
	xhttp.open("GET", url , true);
	xhttp.setRequestHeader('Authorization' , 'Bearer '+getCookie('token') );
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.setRequestHeader("X-Chrome-Extension", "KSS");
	xhttp.send(null);
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

function removeUpdateElementModal(){
	if(document.body.firstElementChild.classList.contains('update-element-modal')){
		document.body.firstElementChild.remove();
	}
}

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
	        createForm(response);
	        document.getElementById("modal-trigger-button").click();
	        document.getElementById("form_popup").classList.add('show');
	        document.getElementsByClassName("modal-backdrop")[0].classList.add('show');
	    }
	};
	xhttp.open("GET", chrome.extension.getURL("/form_popup.html"), true);
	xhttp.send();
}

function findFormElements(){
	document.getElementById('formModalLabel').innerHTML = "Edit - " +static_element_name+ " " +sequence_id;
	href = document.getElementById("form-popup-href");
	title = document.getElementById("form-popup-title");
	img_alt = document.getElementById("form-popup-img-alt");
	port_img = document.getElementById("form-popup-portrait-img");
	landscape_img = document.getElementById("form-popup-landscape-img");

	href_error = document.getElementById("href_error");
	title_error = document.getElementById("title_error");
	img_alt_error = document.getElementById("img_alt_error");
	portrait_img_error = document.getElementById("portrait_img_error");
	landscape_img_error = document.getElementById("landscape_img_error");

	text1 = document.getElementById("form-popup-text1");
	text2 = document.getElementById("form-popup-text2");
	text_error_1 = document.getElementById("text1_error");
	text_error_2 = document.getElementById("text2_error");
	text3 = document.getElementById("form-popup-text3");
	text_error_3 = document.getElementById("text3_error");

	product1 = document.getElementById('form-popup-product1');
	product2 = document.getElementById('form-popup-product2');
	product3 = document.getElementById('form-popup-product3');
	product1_error = document.getElementById('product1_error');
	product2_error = document.getElementById('product2_error');
	product3_error = document.getElementById('product3_error');

	trending_product = document.getElementById('form-popup-trending-product');
	trending_product_error = document.getElementById('trending_product_error');

	link = document.getElementById("form-popup-gender-link");
	bg_color = document.getElementById("form-popup-bg-color");
	text_color = document.getElementById("form-popup-text1-color");
	text2_color = document.getElementById("form-popup-text2-color");

	link_error = document.getElementById("gender_link_error");
	bg_color_error = document.getElementById("bg_color_error");
}

function createEventListeners(){
	href.addEventListener('input', function(){
		validateHref();
	});	
	title.addEventListener('input', function(){
		validateTitle();
	});
	img_alt.addEventListener('input', function(){
		validateImgAlt();
	});
	port_img.addEventListener('change', function(){
		previewFile('portrait')
	});
	landscape_img.addEventListener('change', function(){
		previewFile('landscape')
	})

	product1.addEventListener('input', function(){
		validateProducts();
	});
	product2.addEventListener('input', function(){
		validateProducts();
	});
	product3.addEventListener('input', function(){
		validateProducts();
	});

	document.getElementById('remove_portrait_image').addEventListener('click', function(){
		removeImage('portrait');
	});

	document.getElementById('remove_landscape_image').addEventListener('click', function(){
		removeImage('landscape');
	});
	trending_product.addEventListener('input', function(){
		validateTrendingProduct();
	})
}

function createSectionConfigForm(response) {
	if(response.element_data.config){
		let options = response.element_data.config.style
		var ele = document.getElementById('mobile_style');
		ele.innerHTML = '';
        for (var i = 0; i < options.length; i++) {
            ele.innerHTML =  ele.innerHTML +
                '<option value="' + options[i] + '">' + options[i] + '</option>';
        }

        ele.value = response.element_data.mobile_view.style;

        ele = document.getElementById('desktop_style');
		ele.innerHTML = '';
        for (var i = 0; i < options.length; i++) {
            ele.innerHTML =  ele.innerHTML +
                '<option value="' + options[i] + '">' + options[i] + '</option>';
        }
        ele.value = response.element_data.desktop_view.style;

		if(response.element_data.mobile_view.display === 0)
			document.getElementById('mobile_display_false').checked = true;

		if(response.element_data.desktop_view.display === 0)
			document.getElementById('desktop_display_false').checked = true;

	}
	else{
		document.getElementById('form-config-section').style.display="none";
	}
}

function createForm(response){
	findFormElements();
	createEventListeners();
	createSectionConfigForm(response);
	if(response.element_data.image){		
		href.value = response.element_data.image.href;
		title.value = response.element_data.image.title;
		img_alt.value = response.element_data.image.img_alt;		
	}
	else{
		document.getElementById("form-image-section").style.display="none";
	}
	if(response.element_data.text){
		text1.value = response.element_data.text.text1;
		if(response.element_data.text.text2)
			text2.value = response.element_data.text.text2;
		else
			document.getElementById("form-text-section-text2").style.display="none";	

		if(response.element_data.text.text3)
			text3.value = response.element_data.text.text3;
		else
			document.getElementById("form-text-section-text3").style.display="none";	
	}
	else{
		document.getElementById("form-text-section").style.display="none";
	}
	if(response.element_data.products && response.element_data.products.length == 3){
		product1.value = response.element_data.products[0];
		product2.value = response.element_data.products[1];
		product3.value = response.element_data.products[2];
		document.getElementById("text1_label").innerHTML="Banner title";
		document.getElementById("form-text-section_text1").style.display="none";
		document.getElementById("text2_label").innerHTML="Button text";
		text2.setAttribute("maxlength", "14");
	}
	else{
		document.getElementById("form-product-section").style.display="none";
	}

	if(response.element_data.products && response.element_data.products.length == 1){
		trending_product.value = response.element_data.products[0];
	}
	else{
		document.getElementById("form-trending-product").style.display="none";
	}

	if(response.element_data.link){
		link.value = response.element_data.link;		
	}
	else{
		document.getElementById("form-gender-link-section").style.display="none";
	}

	if(response.element_data.bg_color){
		bg_color.value = response.element_data.bg_color;		
	}
	else{
		document.getElementById("form-bg-color-section").style.display="none";
	}

	if(response.element_data.text_color){
		text_color.value = response.element_data.text_color;		
	}
	else{
		document.getElementById("form-text-color1-section").style.display="none";
	}

	if(response.element_data.text2_color){
		text2_color.value = response.element_data.text2_color;		
	}
	else{
		document.getElementById("form-text-color2-section").style.display="none";
	}

	if(response.element_data.display === 1 || response.element_data.display === 0){
		if(response.element_data.display === 0)
			document.getElementById('display_false').checked = true;
	}
	else
		document.getElementById("form-display-section").style.display="none";

	if(response.images){
		if(response.images.portrait){
			var img = new Image();
			img.src = response.images.portrait['1x'];
			img.onload = function(){
				console.log("portrait image loaded");
				document.getElementById('portrait_existing').src = response.images.portrait['1x'];	
				document.getElementById('portrait_img_loader').classList.add('d-none');
			}			
			setImageConfiguration('portrait', response.image_config.portrait);
			// document.getElementById('portrait_existing').src = response.images.portrait['1x'];				
		}
		else if(response.images.default){
			console.log("inside default");
			var img = new Image();
			img.src = response.images.default['1x'];
			img.onload = function(){
				console.log("portrait image loaded");
				document.getElementById('portrait_existing').src = response.images.default['1x'];	
				document.getElementById('portrait_img_loader').classList.add('d-none');
			}			
			setImageConfiguration('portrait', response.image_config.default);
		}
		else{
			console.log("inside else");
			document.getElementById('port_img_section').style.display="none";
		}

		if(response.images.landscape){
			var img2 = new Image();
			img2.src = response.images.landscape['1x'];
			img2.onload = function(){
				console.log("landscape image loaded");
				document.getElementById('landscape_existing').src = response.images.landscape['1x'];
				document.getElementById('landscape_img_loader').classList.add('d-none');
			}
			setImageConfiguration('landscape', response.image_config.landscape);
			// document.getElementById('landscape_existing').src = response.images.landscape['1x'];						
		}
		else{			
			document.getElementById('landscape_img_section').style.display="none";
			document.getElementById('port_img_label').innerHTML = 'Image <span id="portrait_img_config"> (Resolution : 1234x933; File size: 250Kb)</span>';
			setPortaitImageToolTip(response.image_config.default);
		}						
	}
	listenToSubmitForm();
}

function setImageConfiguration(type, config){
	if(type == 'portrait'){
		portrait_max_size = config.size;
		portrait_min_height = config.height;
		portrait_min_width = config.width;
		gif_max_size = config.size_gif;
		setPortaitImageToolTip(config);
	}
	else{
		landscape_max_size = config.size;
		landscape_min_height = config.height;
		landscape_min_width = config.width;
		setLandscapeImageTooltip(config);
	}	
}

function setPortaitImageToolTip(config){
	let msg = getToolTipMsg(config);
	// document.getElementById('port_img_tooltip').title = msg;
	document.getElementById('portrait_img_config').innerHTML = msg;
}

function setLandscapeImageTooltip(config){
	let msg = getToolTipMsg(config);
	// document.getElementById('landscape_img_tooltip').title = msg;
	document.getElementById('landscape_img_config').innerHTML = msg;
}

function getToolTipMsg(config){
	console.log(config);
	if(config){
		var msg = " (Resolution: "+ config.width +"x"+config.height +"; Max file size: "+ config.size/1000 + "Kb";
		if(config.size_gif){
			msg = msg + "; Max gif size: " + config.size_gif/1000 + "Kb";
		}
		msg = msg + " )"
		return msg;
	}
}

function listenToSubmitForm(){
	document.getElementById('submit-button').addEventListener('click',function(){
		this.classList.add('disabled');
		document.getElementById('submit-button-loader').classList.remove('d-none');
		// document.getElementById('submit-button-loader').classList.add('d-block');
		validateForm();
	});
}

function validateForm(){
	console.log("inside validate form");
	console.log(href.value);
	console.log("Check display ==>", document.querySelector('input[name="display"]:checked').value);
	if(elementData.element_data.config){
		elementData.element_data.mobile_view.display = parseInt(document.querySelector('input[name="display_mobile"]:checked').value);
		elementData.element_data.desktop_view.display = parseInt(document.querySelector('input[name="display_desktop"]:checked').value);

		var ele = document.getElementById('mobile_style');
		elementData.element_data.mobile_view.style = ele.options[ele.selectedIndex].value;
		ele = document.getElementById('desktop_style');
		elementData.element_data.desktop_view.style = ele.options[ele.selectedIndex].value;
		elementData.image_upload = {
			upload : false
		}
		saveElement();
	}
	else{
		if(validateHref() && validateTitle() && validateImgAlt() && validateProducts() && validateTrendingProduct()){
			console.log("form is valid", elementData);
			if(elementData.element_data.display === 0 || elementData.element_data.display === 1 )
				elementData.element_data.display = parseInt(document.querySelector('input[name="display"]:checked').value)

			if(elementData.element_data.image){
				elementData.element_data.image.href = href.value;
				elementData.element_data.image.title = title.value;
				elementData.element_data.image.img_alt = img_alt.value;
			}
			if(elementData.element_data.text){
				elementData.element_data.text.text1 = text1.value;
				if(elementData.element_data.text.text2)
					elementData.element_data.text.text2 = text2.value;
				if(elementData.element_data.text.text3)
					elementData.element_data.text.text3 = text3.value;
			}
			if(elementData.element_data.products && elementData.element_data.products.length == 3){
				elementData.element_data.products[0] = product1.value;
				elementData.element_data.products[1] = product2.value;
				elementData.element_data.products[2] = product3.value;
			}
			if(elementData.element_data.products && elementData.element_data.products.length == 1){
				elementData.element_data.products[0] = trending_product.value;
			}

			if(elementData.element_data.bg_color){
				elementData.element_data.bg_color = bg_color.value;
			}

			if(elementData.element_data.link){
				elementData.element_data.link = link.value;
			}

			if(elementData.element_data.text_color){
				elementData.element_data.text_color = text_color.value;
			}

			if(elementData.element_data.text2_color){
				elementData.element_data.text2_color = text2_color.value;
			}

			if(port_img.value || landscape_img.value){
				elementData.image_upload = {
					upload : true,
					images : {}
				}
				if(port_img.value){
					getBase64(port_img.files[0]).then((data)=>{
						if(elementData.images.portrait)
							elementData.image_upload.images.portrait = data.split(',')[1];
						else if(elementData.images.default)
							elementData.image_upload.images.default = data.split(',')[1];
						if(landscape_img.value){

							getBase64(landscape_img.files[0]).then((data2)=>{
								elementData.image_upload.images.landscape = data2.split(',')[1];
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
						elementData.image_upload.images.landscape = data2.split(',')[1];
						saveElement();
					})
				}			
			}
			else{
				elementData.image_upload = {
					upload : false
				}
				saveElement();
			}
			console.log("save api request ==>", elementData);				
		}
		else{
			document.getElementById('error-msg-main').style.display = "block";
			document.getElementById('submit-button-loader').classList.add('d-none');
			document.getElementById('submit-button').classList.remove('disabled');
		}
	}
}

function validateHref(){
	if(!elementData.element_data.image)
		return true;
	if(href.value){
		var pattern = new RegExp('^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%\\:]*)?$','i');

		if(!pattern.test(href.value)){
			console.log("not a valid url");
			href_error.innerHTML = "Not a valid url";
			href_error.style.display = "block";
			return false;
		}
		else{
			href_error.style.display = "none";
			return true;
		}		
	}
	else{
		href_error.innerHTML = "*Required";
		href_error.style.display = "block";
		return false;
	}
}

function validateTitle(){
	if(!elementData.element_data.image)
		return true;
	if(title.value){
		title_error.style.display = "none";
		return true;
	}
	else{
		title_error.style.display = "block";
		return false;
	}
}

function validateImgAlt(){
	if(!elementData.element_data.image)
		return true;
	if(img_alt.value){
		img_alt_error.style.display = "none";
		return true;
	}
	else{
		img_alt_error.style.display = "block";
		return false;
	}
}

function validateText1(){
	// if(!elementData.element_data.text)
	// 	return true;
	// if(text1.value){
	// 	text_error_1.style.display = "none";
	// 	return true;
	// }
	// else{
	// 	text_error_1.style.display = "block";
	// 	return false;
	// }
}

function validateText2(){
	// if(!elementData.element_data.text)
	// 	return true;
	// if(text2.value){
	// 	text_error_2.style.display = "none";
	// 	return true;
	// }
	// else{
	// 	text_error_2.style.display = "block";
	// 	return false;
	// }	
}

function validateProducts(){
	if(!elementData.element_data.products || (elementData.element_data.products && elementData.element_data.products.length != 3))
		return true;
	var error;
	if(!product1.value){
		product1_error.style.display = 'block';
		error = true;
	}
	else{
		product1_error.style.display = 'none';
	}
	if(!product2.value){
		product2_error.style.display = 'block';
		error = true;
	}
	else{
		product2_error.style.display = 'none';
	}
	if(!product3.value){
		product3_error.style.display = 'block';
		error = true;
	}
	else{
		product3_error.style.display = 'none';
	}
	if(error)
		return false;
	return true;	
}

function validateTrendingProduct(){
	if(!elementData.element_data.products || (elementData.element_data.products && elementData.element_data.products.length != 1))
		return true;
	if(!trending_product.value){
		trending_product_error.style.display = 'block'
		return false;
	}
	trending_product_error.style.display = 'none';
	return true;
}

function saveElement(){
	// document.getElementsByTagName("body")[0].classList.add('full-page-loader');	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			let element = document.querySelector(".kss-alert");
			setTimeoutVariable();
			if(this.status == 200){
				console.log("request complete");
				element.innerHTML = 'Element saved successfully';
               	element.classList.add('kss-alert--success');
                element.classList.add('is-open');
                document.getElementById("close-button").click();
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
                	element.innerHTML ='Failed to save the element';
	                element.classList.add('kss-alert--failure');
	                element.classList.add('is-open');
                }
			}
		// document.getElementsByTagName("body")[0].classList.remove('full-page-loader');
		// document.getElementById('submit-button-loader').classList.remove('d-block');
		document.getElementById('submit-button-loader').classList.add('d-none');
		document.getElementById('submit-button').classList.remove('disabled');
		}
	};
	var url = api_domain + '/api/rest/v2/save-page-element/'+sequence_id;
	console.log("save url ==>", url);
	xhttp.open("POST", url , true);
	xhttp.setRequestHeader('Authorization' , 'Bearer '+getCookie('token') );
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.setRequestHeader("X-Chrome-Extension", "KSS");
	delete elementData.image_config;
	delete elementData.images;
	elementData.page_slug = static_element_page_slug;
	console.log("inside saveElement function",elementData);
	var formattedJsonData = JSON.stringify(elementData);
	xhttp.send(formattedJsonData);
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function setTimeoutVariable() {
	let element = document.querySelector(".kss-alert");

    kss_alert_timeout = setTimeout(function()
    {
        element.classList.remove('is-open', 'kss-alert--success', 'kss-alert--failure', );
        clearTimeout(kss_alert_timeout);
    }, 2500);
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
		console.log("file ==>",file, gif_max_size);
		if(type == 'portrait'){			
			if(((port_img.files[0].type == "image/jpeg" || port_img.files[0].type == "image/jpg") && port_img.files[0].size > portrait_max_size) || (gif_max_size && port_img.files[0].type == "image/gif" && port_img.files[0].size > gif_max_size) ){
					portrait_img_error.innerHTML = "File size exceeds the limit";
					removeImage('portrait');
					portrait_img_error.style.display = "block";
					preview.src = "";	
			}
			else if(!gif_max_size && port_img.files[0].type == "image/gif"){
					portrait_img_error.innerHTML = "File type not supported";
					removeImage('portrait');
					portrait_img_error.style.display = "block";
					preview.src = "";	
			}
			else{
				var image = new Image();
				image.src = reader.result;
				image.onload = function(){
					console.log("height ==>", this.height);
					console.log("width ==>", this.width);
					if(this.height != portrait_min_height || this.width != portrait_min_width){		
						removeImage('portrait');
						portrait_img_error.innerHTML = "Image resolution does not match";
						portrait_img_error.style.display = "block";
						preview.src = "";
					}
					else{
						preview.src = reader.result;
						document.getElementsByClassName('img-info')[0].classList.add('d-flex');
						document.getElementById('port_file_name').innerHTML = port_img.files[0].name;
						portrait_img_error.style.display = "none";
						document.getElementsByClassName('portrait-uploader')[0].classList.add('d-none');
						document.getElementsByClassName('portrait-uploader')[0].classList.remove('d-block');
					}
				}
			}
		}
		else{
			if(landscape_img.files[0].size > landscape_max_size){
				landscape_img_error.innerHTML = "File size exceeds the limit";
				landscape_img_error.style.display = "block";
				preview.src = "";
				removeImage('landscape');
			}
			else{
				var image = new Image();
				image.src = reader.result;
				image.onload = function(){
					console.log("height ==>", this.height);
					console.log("width ==>", this.width);
					if(this.height != landscape_min_height || this.width != landscape_min_width){
						landscape_img_error.innerHTML = "Image resolution does not match";
						landscape_img_error.style.display = "block";
						preview.src = "";
						removeImage('landscape');
					}
					else{
						preview.src = reader.result;
						landscape_img_error.style.display = "none";
						document.getElementsByClassName('img-info-land')[0].classList.add('d-flex');
						document.getElementById('land_file_name').innerHTML = landscape_img.files[0].name;
						document.getElementsByClassName('landscape-uploader')[0].classList.add('d-none');
						document.getElementsByClassName('landscape-uploader')[0].classList.remove('d-block');
					}
				}
			}

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

function userLogout(){
    document.cookie = "cart_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}