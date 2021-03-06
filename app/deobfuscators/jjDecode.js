/**
 * Original by Jacob Soo: https://github.com/jacobsoo/Decoder-JJEncode
 */

/** Helper Class for managing string substitutions during the decoding process */
class LOTUChecker{

    /**
     * Create a new checker instance by determining all the substitution strings.
     * @param {string} gv - the gv parameter determined by the checkPalindrome function
     */
    constructor(gv) {
        this.str_l = "(![]+\"\")[" + gv + "._$_]+";
        this.str_o = gv + "._$+";
        this.str_t = gv + ".__+";
        this.str_u = gv + "._+";
    }

    /**
     * Check for necessary substitution and if so update the sample code, which is being decoded
     * @param {string} data - sample code being currently processed
     * @returns {{ch: string, newData: *}} Object with the found substitution-string and the updated sample code
     */
    check(data) {
        let ch_lotux = '';
        let newData = null;

        if (0 === data.indexOf(this.str_l)) {
            newData = data.substr(this.str_l.length);
            ch_lotux = "l";
        }
        else if (0 === data.indexOf(this.str_o)) {
            newData = data.substr(this.str_o.length);
            ch_lotux = "o";
        }
        else if (0 === data.indexOf(this.str_t)) {
            newData = data.substr(this.str_t.length);
            ch_lotux = "t";
        }
        else if (0 === data.indexOf(this.str_u)) {
            newData = data.substr(this.str_u.length);
            ch_lotux = "u";
        }

        return {ch: ch_lotux, newData: newData};
    }
}


/**
 * Decode the given string. The whole source is taken from the github-repository of Jacob Soo
 * @param {string} encStr - The code which should be deobfuscated
 * @returns {string} - result after the decoding process
 */
function decode(encStr) {
    // clean string
    encStr = encStr.replace(/^\s+|\s+$/g, "");

    let {startPos, endPos, gv, gvl} = checkPalindrome(encStr);
    if (startPos === endPos) {
        throw new Error("No data!")
    }

    //start decoding
    let data = encStr.substring(startPos, endPos);

    //hex decode string
    let b = ["___+", "__$+", "_$_+", "_$$+", "$__+", "$_$+", "$$_+", "$$$+", "$___+", "$__$+", "$_$_+", "$_$$+", "$$__+", "$$_$+", "$$$_+", "$$$$+"];

    let lotuChecker = new LOTUChecker(gv);

    //0123456789abcdef
    const str_hex = gv + ".";

    //s
    const str_s = '"';
    const gvsig = gv + ".";

    const str_quote = '\\\\\\"';
    const str_slash = '\\\\\\\\';

    const str_lower = "\\\\\"+";
    const str_upper = "\\\\\"+" + gv + "._+";

    const str_end	= '"+'; //end of s loop

    let res = '';

    while(data !== "") {
        //l o t u
        let {ch, newData} = lotuChecker.check(data);
        if (ch) {
            res += ch;
            data = newData;
            continue;
        }

        //0123456789abcdef
        if (0 === data.indexOf(str_hex)) {
            data = data.substr(str_hex.length);

            //check every element of hex decode string for a match
            for (let i = 0; i < b.length; i++) {
                if (0 === data.indexOf(b[i])) {
                    data = data.substr( (b[i]).length );
                    res += i.toString(16);
                    break;
                }
            }
            continue;
        }

        //start of s block
        if (0 === data.indexOf(str_s)) {
            data = data.substr(str_s.length);

            //check if "R
            if (0 === data.indexOf(str_upper)) { // r4 n >= 128
                data = data.substr(str_upper.length); //skip sig

                let ch_str = "";
                for (let j = 0; j < 2; j++) { //shouldn't be more than 2 hex chars
                    //gv + "."+b[ c ]
                    if (0 === data.indexOf(gvsig)) {
                        data = data.substr(gvsig.length); //skip gvsig
                        for (let k = 0; k < b.length; k++) {	//for every entry in b
                            if (0 === data.indexOf(b[k])) {
                                data = data.substr(b[k].length);
                                ch_str += k.toString(16) + "";
                                break;
                            }
                        }
                    }
                    else {
                        break; //done
                    }
                }

                res += String.fromCharCode(parseInt(ch_str,16));
                continue;
            }
            else if (0 === data.indexOf(str_lower)) {//r3 check if "R // n < 128
                data = data.substr(str_lower.length); //skip sig

                let ch_str = "";
                let ch_lotux = "";
                let temp = "";
                let b_checkR1 = 0;
                for (let j = 0; j < 3; j++) { //shouldn't be more than 3 octal chars
                    if (j > 1) { //lotu check
                        let {ch, newData} = lotuChecker.check(data);
                        if (ch) {
                            data = newData;
                            ch_lotux = ch;
                            break;
                        }
                    }

                    //gv + "."+b[ c ]
                    if (0 === data.indexOf(gvsig)) {
                        temp = data.substr(gvsig.length);
                        for (let k = 0; k < 8; k++) {	//for every entry in b octal
                            if (0 !== temp.indexOf(b[k])) {
                            } else {
                                if (parseInt(ch_str + k + "", 8) > 128) {
                                    b_checkR1 = 1;
                                    break;
                                }

                                ch_str += k + "";
                                data = data.substr(gvsig.length); //skip gvsig
                                data = data.substr(b[k].length);
                                break;
                            }
                        }

                        if (1 === b_checkR1) {
                            if (0 === data.indexOf(str_hex)) { //0123456789abcdef
                                data = data.substr(str_hex.length);

                                //check every element of hex decode string for a match
                                for (let i = 0; i < b.length; i++) {
                                    if (0 === data.indexOf(b[i])) {
                                        data = data.substr( (b[i]).length );
                                        ch_lotux = i.toString(16);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    } else {
                        break; //done
                    }
                }

                res += String.fromCharCode(parseInt(ch_str,8)) + ch_lotux;
                continue; //step out of the while loop
            } else { //"S ----> "SR or "S+
                // if there is, loop s until R 0r +
                // if there is no matching s block, throw error

                var match = 0;
                var n;
                //searching for matching pure s block
                while(true) {
                    n = data.charCodeAt( 0 );
                    if (0 === data.indexOf(str_quote)) {
                        data = data.substr(str_quote.length);
                        res += '"';
                        match += 1;
                        continue;
                    } else if (0 === data.indexOf(str_slash)) {
                        data = data.substr(str_slash.length);
                        res += '\\';
                        match += 1;
                        continue;
                    } else if (0 === data.indexOf(str_end)) {	//reached end off S block ? +
                        if (match === 0) {
                            console.warn("+ no match S block: "+data);
                            return;
                        }
                        data = data.substr(str_end.length);

                        break; //step out of the while loop
                    } else if (0 === data.indexOf(str_upper)) { //r4 reached end off S block ? - check if "R n >= 128
                        if (match == 0) {
                            console.warn("no match S block n>128: "+data);
                            return;
                        }

                        data = data.substr(str_upper.length); //skip sig

                        var ch_str = "";
                        var ch_lotux = "";
                        for (j = 0; j < 10; j++) //shouldn't be more than 10 hex chars
                        {

                            if (j > 1) {//lotu check
                                let {ch, newData} = lotuChecker.check(data);
                                if (ch) {
                                    data = newData;
                                    ch_lotux = ch;
                                    break;
                                }
                            }

                            //gv + "."+b[ c ]
                            if (0 === data.indexOf(gvsig)) {
                                data = data.substr(gvsig.length); //skip gvsig
                                for (let k = 0; k < b.length; k++)	//for every entry in b
                                {
                                    if (0 === data.indexOf(b[k])) {
                                        data = data.substr(b[k].length);
                                        ch_str += k.toString(16) + "";
                                        break;
                                    }
                                }
                            } else {
                                break; //done
                            }
                        }


                        res += String.fromCharCode(parseInt(ch_str,16));
                        break; //step out of the while loop
                    } else if (0 === data.indexOf(str_lower)) { //r3 check if "R // n < 128
                        if (match === 0) {
                            console.warn("no match S block n<128: "+data);
                            return;
                        }

                        data = data.substr(str_lower.length); //skip sig

                        var ch_str = "";
                        var ch_lotux = "";
                        var temp = "";
                        var b_checkR1 = 0;
                        for (j = 0; j < 3; j++) { //shouldn't be more than 3 octal chars
                            if (j > 1) { //lotu check
                                let {ch, newData} = lotuChecker.check(data);
                                if (ch) {
                                    data = newData;
                                    ch_lotux = ch;
                                    break;
                                }
                            }

                            //gv + "."+b[ c ]
                            if (0 === data.indexOf(gvsig)) {
                                temp = data.substr(gvsig.length);
                                for (k = 0; k < 8; k++)	{//for every entry in b octal
                                    if (0 === temp.indexOf(b[k])) {
                                        if (parseInt(ch_str + k + "",8) > 128) {
                                            b_checkR1 = 1;
                                            break;
                                        }

                                        ch_str += k + "";
                                        data = data.substr(gvsig.length); //skip gvsig
                                        data = data.substr(b[k].length);
                                        break;
                                    }
                                }

                                if (1 === b_checkR1) {
                                    if (0 === data.indexOf(str_hex)) { //0123456789abcdef
                                        data = data.substr(str_hex.length);

                                        //check every element of hex decode string for a match
                                        var i = 0;
                                        for (i = 0; i < b.length; i++) {
                                            if (0 === data.indexOf(b[i])) {
                                                data = data.substr( (b[i]).length );
                                                ch_lotux = i.toString(16);
                                                break;
                                            }
                                        }
                                    }
                                }
                            } else {
                                break; //done
                            }
                        }
                        res += String.fromCharCode(parseInt(ch_str,8)) + ch_lotux;
                        break; //step out of the while loop
                    } else if( (0x21 <= n && n <= 0x2f) || (0x3A <= n && n <= 0x40) || ( 0x5b <= n && n <= 0x60 ) || ( 0x7b <= n && n <= 0x7f ) ) {
                        res += data.charAt( 0 );
                        data = data.substr( 1 );
                        match += 1;
                    }
                }
                continue;
            }
        }

        console.warn("[jjDecode] no match : " + data);
        break;
    }

    return res;
}

/**
 * Helper function to check whether palindrom feature of JJEncode was used
 * @param {string} str - sample code which should be decoeded
 * @returns {{startPos: *, endPos: *, gv: *, gvl: *}} - object with the determined parameters for the decoding process
 */
function checkPalindrome(str) {
    let startPos;
    let endPos;
    let gv;
    let gvl;

    if (str.indexOf("\"\'\\\"+\'+\",") === 0) {
        //locate jjcode
        startPos	= str.indexOf('$$+"\\""+') + 8;
        endPos		= str.indexOf('"\\"")())()');

        //get gv
        gv	= str.substring((str.indexOf('"\'\\"+\'+",')+9), str.indexOf("=~[]"));
        gvl	= gv.length;
    } else {
        //get gv
        gv	= str.substr(0, str.indexOf("="));
        gvl	= gv.length;

        //locate jjcode
        startPos	= str.indexOf('"\\""+') + 5;
        endPos		= str.indexOf('"\\"")())()');
    }

    return { startPos, endPos, gv, gvl };
}


/**
 * Deobfuscate the given code by applying the reversal of JJEncode
 * @param {string} str - The samplecode which shall be processed
 * @returns {Promise.<{code}>} a promise of an object containing the resulting code of the operation
 */
async function processSample(str) {
    let code = "";

    try {
        code = decode(str);
    } catch (exc) {
        console.warn("Couldn't decode JJEncoded string: " + exc);
    }

   return {
       code: code,
   };
}

module.exports = {
    name: 'JJDecode',
    process: processSample
};

