<template lang="pug">

div(id="app")
    h1 {{title}}

    tool-selector(:tools="obfuscators" :tool-title="'Obfuscators'" :prefix="'obf'")
    tool-selector(:tools="deobfuscators" :tool-title="'Deobfuscators'" :prefix="'deobf'")

    sample-selector(:samples="samples" @sample-changed="onSampleChanged")

    input(id="btnObfuscate", type='button', value='Send request', class="btn btn-primary" @click="obfuscate")

    div(id="result_area")
        h3 Result

        p(id="obfuscated_code")

        label(for="compression") Kompressionsrate:
        span(id="compression", class="result_info")
        br
        label(for="time") benötigte Zeit:
        span(id="time", class="result_info")
</template>

<script>
    async function obfuscate() {
        for (let tId in this.obfuscators) {
            if (this.obfuscators.hasOwnProperty(tId)) {
                let tool = this.obfuscators[tId];
                if (tool.isSelected) {
                    let res = await makeRequest("/obfuscate", "POST", {id: tId, code: encodeURIComponent(this.sampleCode), options: tool.options} );
                    this.showResults(res);
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
            obfuscate: obfuscate,
            onSampleChanged: function(sample) {
                if (Number.isInteger(sample)) { // sample Id means the whole sample is used
                    this.sampleCode = this.samples[sample].content;
                } else if(sample instanceof String) {
                    this.sampleCode = sample;
                } else {
                    console.error("Received invalid sample in event: " + JSON.stringify(sample));
                }
            },
            showResults (res) {
                this.results.push(res);

                let resultBox = document.getElementById("result_area");
                resultBox.style.display = "block";      // make display box visible

                // let codeBox = document.getElementById("obfuscated_code");
                let codeBox = resultBox.querySelector("#obfuscated_code");
                codeBox.innerHTML = res.code;

                let comprEl = resultBox.querySelector("#compression");
                comprEl.innerHTML = res.compressionRate;

                let timeEl = resultBox.querySelector("#time");
                timeEl.innerHTML = res.time;
            }
        },
};
</script>