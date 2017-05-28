
function processFn() {
    let ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        // the request has been answered
        if (ajax.readyState === XMLHttpRequest.DONE) {

            // 200 is HTTP status code for OK
            if (ajax.status === 200) {
                console.log(ajax.responseText);
            } else {    // the request failed for whatever reason
                console.log('There was a problem with the request.');
            }
        }
    };

    // set the request method and the URL which should be called
    ajax.open('POST', '/');
// send the request to the server
    ajax.send();
    console.log('clicked!')
}