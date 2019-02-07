console.log("add element script");

var elements = document.getElementsByClassName('update-element-btn');

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


if(isLoggedInUser()){
	for(var i=elements.length-1; i>=0; i--){
		// elements[i].parentNode.removeChild(elements[i]);
		elements[i].setAttribute("class", "update-element-btn btn btn-danger btn-lg pulsing d-block");
	}
    
    var edit_enabled_element = document.getElementById('edit-enabled-element');
    if(edit_enabled_element)
        edit_enabled_element.style.display = "block";

    // window.location.reload();

    var draft_page_element = document.getElementById('publish-section')
    if(draft_page_element)
        draft_page_element.style.display = "block";	
}

