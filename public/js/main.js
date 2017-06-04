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


function makeRequest(path, method = "GET", args = {}) {
    // wrap the AJAX request in a promise, so the caller can handle the
    // response as he wishes

    if (!path.startsWith('/api')) {
        path = "/api" + path;
    }

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // call the handle function if the request was a success
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr.responseText);
                    console.warn('There was a problem with the request: ' + path);
                }
            }
        };

        xhr.open(method, path);
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(args));
    });
}
