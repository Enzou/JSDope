
const sample = `function makeRequest(url) {
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
}`;

function processFn() {
    let ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        // the request has been answered
        if (ajax.readyState === XMLHttpRequest.DONE) {

            // 200 is HTTP status code for OK
            if (ajax.status === 200) {
                showResults(JSON.parse(ajax.responseText));
            } else {    // the request failed for whatever reason
                console.log('There was a problem with the request.');
            }
        }
    };

    // set the request method and the URL which should be called
    ajax.open('POST', '/api');
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// send the request to the server
    ajax.send('code='+encodeURIComponent(sample));
}

function showResults(result) {
    let resultBox = document.getElementById("result_area");
    resultBox.style.display = "block";      // make display box visible

    // let codeBox = document.getElementById("obfuscated_code");
    let codeBox = resultBox.querySelector("#obfuscated_code");
    codeBox.innerHTML = result.code;

    let comprEl = resultBox.querySelector("#compression");
    comprEl.innerHTML = result.compressionRate;

    let timeEl = resultBox.querySelector("#time");
    timeEl.innerHTML = result.time;
}