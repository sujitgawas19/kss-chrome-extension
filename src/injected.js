let element = document.getElementById('kss-price');
// var btn = document.createElement("BUTTON");

para = document.createElement("P");
para.setAttribute("style", "border: 2px solid #ddd;font-weight: bold;font-size: 1.2em;padding: 5px;");
para.innerHTML = "Product.Color id = <span style='color: red;'>"+parent_id+"."+selected_color_id+ "</span>"
// var btn_name = "Product.Color id = "+parent_id+"."+selected_color_id;
// var text = document.createTextNode(btn_name);
// btn.appendChild(text);
element.parentNode.insertBefore(para, element.nextSibling);