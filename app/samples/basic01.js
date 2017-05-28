/**
 * Created by me on 5/14/17.
 */

/* aspects to handle
* XMLHTTPRequest (with CORS)        ✔
* IIFE                              ✔
* async
* ECMAScript 2016
* WebWorker
* Promise
* browser API
*   * WebStorage
*   * Canvas
*   * FileSystem
*   * Indexed DB
*   * SVG
*   * Sockets
*   * Page Visibility: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
*   * Network: https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
*   * Notification: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
*   * WebRTC: https://www.html5rocks.com/en/tutorials/webrtc/basics/
*   * timeout / interval
* DOM manipulation
* library support like jQuery
*
* */

/**
 * Make an AJAX request to a foreign server (CORS) to load some data.
 * Returns a promise which can be used to streamline the processing of the
 * result
 * @param url of the rest API that should be called
 */
function makeRequest(url) {
    // wrap the AJAX request in a promise, so the caller can handle the
    // response as he wishes
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let method = 'GET';

        xhr.open(method, url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // call the handle function if the request was a success
                    resolve(xhr.responseURL);
                } else {
                    reject(xhr.responseText);
                }
            }
        };

        xhr.send();
    });
}

function greet() {
    alert('Hello there!');
}

/**
 *  Build an URL which can be called to retrieve an image of a kitty
 * @returns {string}
 */
function getKittyUrl() {
    const api_key = "MTgzMzU3";
    const url = "http://thecatapi.com/api/images/get";
    const params = {
        "format": "src",
        "api_key": api_key,
        "type": "jpg,gif,png"
    };

    let payload = Object.keys(params).reduce((res, k) => {
        return res + "&" + k + "=" + params[k];
    }, "");

    return url + payload.replace("&", "?");
}


/**
 * Make an AJAX Request to get a new kitty image
 */
function sendRequest() {
    let res = makeRequest(getKittyUrl());
    res.then((respUrl) => {     // handler for a successful request
        let el = document.getElementById("cat_pic");
        if (el) {
            el.setAttribute("src", respUrl)
        }
    }, () => {      // handler for a failed request
        alert('Failed to load an image!');
        }
    );
}


/**
 * Immediately-invoked function expression: this code is execute as soon as
 * the interpreter reads it in
 */
(function showImgElement() {
   let el = document.getElementById("cat_pic");
   if (el) {
       // attach eventhandler to make the image visible as soon as
       // an image is loaded
       el.addEventListener('load', () => {
           el.style.display = "inline-block";
       });
   }
})();
