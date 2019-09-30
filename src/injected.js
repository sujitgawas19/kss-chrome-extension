let elements = document.getElementsByClassName("product_extension_details");
for (var index = 0; index < elements.length; index++) {
    elements[index].classList.remove("d-none");
}

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

        this.addEventListener('readystatechange', function() {
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
                        if(this._url.includes('/single-product?') || this._url.includes('/product-list')){
                            let elements = document.getElementsByClassName("product_extension_details");
                            for (var index = 0; index < elements.length; index++) {
                                elements[index].classList.remove("d-none");
                            }
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