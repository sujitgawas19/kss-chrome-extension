console.log("hide element script");

var elements = document.getElementsByClassName('update-element-btn');

for(var i=elements.length-1; i>=0; i--){
	// elements[i].parentNode.removeChild(elements[i]);
	elements[i].setAttribute("class", "update-element-btn btn btn-danger btn-lg pulsing d-none");
}

var edit_enabled_element = document.getElementById('edit-enabled-element');
if(edit_enabled_element)
	edit_enabled_element.style.display = "none";

// window.location.reload();

var draft_page_element = document.getElementById('publish-section')
if(draft_page_element)
	draft_page_element.style.display = "none";