<template lang="pug">

div(id="app")
    h1 {{title}}

    tool-selector(:tools="obfuscators" :tool-title="'Obfuscators'" :prefix="'obf'")
    tool-selector(:tools="deobfuscators" :tool-title="'Deobfuscators'" :prefix="'deobf'")

    sample-selector(:samples="samples" @sample-changed="onSampleChanged")

    input(id="btnObfuscate", type='button', value='Send request', class="btn btn-primary" @click="process(obfuscators, 'obfuscate')")
    input(id="btnDeObfuscate", type='button', value='Deobufscate', class="btn btn-primary" @click="process(deobfuscators, 'deobfuscate')")


    result-overview(v-if="results && results.length > 0" id="result_area" :results="results")
</template>

<script>
    async function process(tools, cmd) {
        for (let tId in tools) {
            if (tools.hasOwnProperty(tId)) {
                let tool = tools[tId];
                if (tool.isSelected) {
                    try {
                        let res = await makeRequest("/process", "POST", {id: tId, code: encodeURIComponent(this.sampleCode), options: tool.options, cmd: cmd});
                        this.showResults(res);
                    } catch (exc) {
                        console.error("Couldn't process request: " + exc.message);
                    }

                }
            }
        }
    }
    export default {
        data() {
            return {
                sampleCode: "",
                results: [],
            }
        },
        methods: {
            process: process,
            onSampleChanged: function(sample) {
                if (Number.isInteger(sample)) { // sample Id means the whole sample is used
                    this.sampleCode = this.samples[sample].content;
                } else if(typeof sample === 'string') {
                    this.sampleCode = sample;
                } else {
                    console.error("Received invalid sample in event: " + JSON.stringify(sample));
                }
            },
            showResults (res) {
                console.log("Received results: " + JSON.stringify(res));
                this.results.push(res);

//                let resultBox = document.getElementById("result_area");
//                resultBox.style.display = "block";      // make display box visible
//
//                // let codeBox = document.getElementById("obfuscated_code");
//                let codeBox = resultBox.querySelector("#obfuscated_code");
//                codeBox.innerHTML = res.code;
//
//                let comprEl = resultBox.querySelector("#compression");
//                comprEl.innerHTML = res.compressionRate;
//
//                let timeEl = resultBox.querySelector("#time");
//                timeEl.innerHTML = res.time;
            }
        },
};
</script>