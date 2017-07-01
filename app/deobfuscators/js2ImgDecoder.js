const atob = require('atob');
const {PNG} = require('pngjs');

//
// myimage.decode(function (pixels) {
//     //Pixels is a 1D array containing pixel data
// });

function unescapeA2B(data) {
    return unescape(decodeURIComponent(atob(data)))
}

function decodeRoutine(imgData, nums) {
    let res = "";

    for(let i = nums[2]; i < imgData.length; i+=4)
        res += (imgData[i] !== nums[1]) ? String.fromCharCode(imgData[i]) : "";
    res = res.trim();

    return unescapeA2B(res);
}

function extractSnippets(str) {
    let start = str.indexOf('=[ \'') + 3;
    if (start < 3) {
        throw new Error("Couldn't find beginning of snippets!");
    }
    let end = str.indexOf('];', start) - 1;

    let subStr = str.substring(start, end);
    return subStr.split(', ').map((s) => {
       return s.slice(1, -1);
    });
}

function decode(str) {
    let snippets = extractSnippets(str);
    // let imgType = unescapeA2B(snippets[7]).slice(8, -2);        // drop enclosing return '{...}';
    // let imgStr = imgType +   snippets[9];
    let imgBuffer = new Buffer(snippets[9], 'base64');
    let img = PNG.sync.read(imgBuffer);

    return decodeRoutine(img.data, [0, 255, 2]);
}

async function process(str) {
    let code = "";

    try {
        code = decode(str) || "";
        // compressionRate =  str.length + "/" + code.length + " = " + (str.length / code.length).toFixed(2);
    } catch (exc) {
        console.warn("[JS2img] Couldn't decode string: " + exc);
    }

    return {
        code: code,
    };
}

module.exports = {
    name: 'JS2Image Decoder',
    process: process
};
