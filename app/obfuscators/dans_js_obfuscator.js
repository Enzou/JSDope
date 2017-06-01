// let http = require("http");
let request = require('request');



let options = {
    encodings: {        // values for the encoding types are read from the website
        'None': "0",
        'Numeric': "10",
        'Normal': "62",
        'High ASCII': "95"
    },
    fastDecode: true,
    specialChars: false
};



function send_request() {
    let params = {
        url: 'http://www.danstools.com/javascript-obfuscate/index.php',
        // method: 'POST',
        // headers: {
        // }
        form: {
            "ascii_encoding": options.encodings.Normal,
            "fast_decode": "on",
            "special_char": "on",
            "src": '//+create+a+new+request+objectvar+httpRequest+=+new+XMLHttpRequest();//+set+a+handler+function,+which+will+be+called+as+soon+as+the+response+arrives+(or+times+out)httpRequest.onreadystatechange+=+function()+{++++//+the+request+has+been+answered++++if+(httpRequest.readyState+===+XMLHttpRequest.DONE)+{++++++++//+200+is+HTTP+status+code+for+OK++++++++if+(httpRequest.status+===+200)+{++++++++++++alert(httpRequest.responseText);++++++++}+else+{++++//+the+request+failed+for+whatever+reason++++++++++++alert(\'There+was+a+problem+with+the+request.\');++++++++}++++}};//+set+the+request+method+and+the+URL+which+should+be+calledhttpRequest.open(\'GET\',+\'getData\');//+send+the+request+to+the+serverhttpRequest.send();'
        }
    };

    request.post(params, (err, resp, body) => {
        var a = 5;
    });

}

function process(data) {
    send_request();

    console.log('Processing of data not yet implemented!');

    return {
        result: null,
        time: 0,
        compressionRate: 1
    }
}




module.exports = {
    name: "Dan's JavaScript Obfuscator",
    options: options,
    process: process
};