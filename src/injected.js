(function(xhr) {
    console.log("function xhr");
    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();

        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function(header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function(postData) {

        this.addEventListener('load', function() {
            var endTime = (new Date()).toISOString();
            var myUrl = this._url ? this._url.toLowerCase() : this._url;
            if(myUrl) {
                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
                            this._requestHeaders = postData;    
                        } catch(err) {
                            console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
                            console.log(err);
                        }
                    } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
                            // do something if you need
                    }
                }

                // here you get the RESPONSE HEADERS
                var responseHeaders = this.getAllResponseHeaders();
                if ( this.responseType != 'blob' && this.responseText) {
                    try {
                        // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
                        if(this._url.includes('single-product?')){
                            console.log("check response ==>", JSON.parse(this.responseText));
                            let element = document.getElementById("product_color_id");
                            if(element)
                            	element.parentNode.removeChild(element);
                            let productData = JSON.parse(this.responseText);
	                        element = document.getElementById('kss-price');
							para = document.createElement("P");
							para.setAttribute("id", "product_color_id");
							para.setAttribute("style", "border: 2px solid #ddd;font-weight: bold;font-size: 1.2em;padding: 5px;");
							para.innerHTML = "Product.Color id = <span style='color: red;'>"+productData.attributes.product_id+"."+productData.facets.product_color_html.id+ "</span>"
							element.insertAdjacentElement("afterend", para);
                        }
                    } catch(err) {
                        console.log("Error in responseType try catch");
                        console.log(err);
                    }
                }
            }
        });
        return send.apply(this, arguments);
    };

})(XMLHttpRequest);