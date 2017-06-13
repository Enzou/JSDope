<template lang="pug">

div(id="app")
    h1(class="main-title") {{title}}

    tool-selector(:tools="obfuscators" :tool-title="'Obfuscators'" :prefix="'obf'")
    tool-selector(:tools="deobfuscators" :tool-title="'Deobfuscators'" :prefix="'deobf'")

    sample-selector(:samples="samples" @sample-changed="onSampleChanged")

    input(id="btnProcess" type='button' value='Process' class="btn primary-btn" @click="process")

    template(v-if="canCrossProcess()")
        label
            input(type="checkbox" v-model="isCrossProcess")
            | Process every obfuscator output as deobfuscator input

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
                            this.showResults(res, tool);
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
            console.error("Couldn't send request: " + exc);
        }
    }

    export default {
        data() {
            return {
                sampleCode: "",
                results: [],
                isCrossProcess: false
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
            showResults (res, tool) {
                if (res.code) {
                    res.toolName = tool.name;
                    console.log("--- received result: " + JSON.stringify(res));
                    this.results.push(res);
                }
            },
            canCrossProcess() {
                console.log(" Obfs " + JSON.stringify(this.obfuscators));
                let isSelectedFn = (tool) => {
                    return tool.isSelected
                };
//                return this.obfuscators.filter(isSelectedFn).length > 0 &&
//                    this.deobfuscators.filter(isSelectedFn).length > 0;
                return true;
            }
        },
};
</script>