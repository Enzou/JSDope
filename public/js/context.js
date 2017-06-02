class Context {
    async loadTools() {
        try {
            this.tools = await Context.makeRequest('/tools');
            return true;
        } catch(e) {
            console.error("Couldn't load tools");
            return false;
        }
    }

    static makeRequest(path, method = "GET", args = {}) {
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

}
