<template lang="pug">

div(id="app")
    h1(class="main-title") {{title}}

    tool-selector(:tools="obfuscators" :tool-title="'Obfuscators'" :prefix="'obf'")
    tool-selector(:tools="deobfuscators" :tool-title="'Deobfuscators'" :prefix="'deobf'")

    sample-selector(:samples="samples" @sample-changed="onSampleChanged")

    input(id="btnProcess", type='button', value='Process', class="btn primary-btn" @click="process")

    result-overview(v-if="results && results.length > 0" id="result_area" :results="results")
</template>

<script>
    async function process() {
        let processTools = async function(tools, cmd) {
            for (let tId in tools) {
                if (tools.hasOwnProperty(tId)) {
                    let tool = tools[tId];
                    if (tool.isSelected) {
                        try {
                            let res = await makeRequest("/process", "POST", {id: tId, code: this.sampleCode, options: tool.options, cmd: cmd});
                            this.showResults(res);
                        } catch (exc) {
                            console.error("Couldn't process request: " + exc.message);
                        }

                    }
                }
            }
        };

        // clear previous results
        this.results = [];
        try {
            await processTools.call(this, this.obfuscators, 'obfuscate');
            await processTools.call(this, this.deobfuscators, 'deobfuscate');
        } catch (exc) {
            console.error("Coudln't send request: " + exc);
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
            process2: process2,
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