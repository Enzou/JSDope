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


// function processFn() {
//     let ajax = new XMLHttpRequest();
//
//     ajax.onreadystatechange = function() {
//         // the request has been answered
//         if (ajax.readyState === XMLHttpRequest.DONE) {
//
//             // 200 is HTTP status code for OK
//             if (ajax.status === 200) {
//                 showResults(JSON.parse(ajax.responseText));
//             } else {    // the request failed for whatever reason
//                 console.log('There was a problem with the request.');
//             }
//         }
//     };
//
//     // set the request method and the URL which should be called
//     ajax.open('POST', '/api');
//     ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// // send the request to the server
//     ajax.send('code='+encodeURIComponent(sample));
// }

async function obfuscate(ctx) {
    let obfs = this.tools.obfuscators;

    let obf_arr = document.getElementsByName("obf_sel");
    for(let i = 0; i < obf_arr.length; i++) {
        let obf_el = obf_arr[i];
        if (obf_el.type === "checkbox" && obf_el.checked === true) {
            let id = obf_el.id.replace("obf_", "");
            let obf = obfs[id];
            let res = await Context.makeRequest("/obfuscate", "POST", {id: id, code: encodeURIComponent(sample), options: obf.options} );
            showResults(res);
        }
    }
}

function deobfuscate(ctx) {

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



async function init() {
    let ctx = new Context();
    await ctx.loadTools();

    let clickEvents = {
        "btnObfuscate": obfuscate.bind(ctx),
        "btnDeobfuscate": deobfuscate.bind(ctx)
    };

    // assign click handlers to the elements
    for (var k in clickEvents) {
        if (clickEvents.hasOwnProperty(k)) {
            let el = document.getElementById(k);
            if (el) {
                el.onclick = clickEvents[k];
            }
        }
    }

    // load all available tools
    // let tools = await makeRequest("/tools");
    document.ctx = ctx;
}

// assign initialisation function to be executed once DOM is fully loaded
(function() {
    window.onload = init;
})();