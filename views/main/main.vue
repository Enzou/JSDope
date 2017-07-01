<template lang="pug">

div(id="app")
    h1(class="main-title") {{title}}

    tool-selector(:tools="obfuscators" :tool-title="'Obfuscators'" :prefix="'obf'")
    tool-selector(:tools="deobfuscators" :tool-title="'Deobfuscators'" :prefix="'deobf'")

    sample-selector(:samples="samples" @sample-changed="onSampleChanged")

    input(id="btn-process" type='button' value='Process' class="btn primary-btn" @click="process" :disabled="!readyToProcess")

    template()
        label(title="Use the result of every obfuscation as input for every deobfuscator")
            input(type="checkbox" v-model="isCrossProcess")
            | Process every obfuscator output as deobfuscator input

    result-overview(v-if="results && results.length > 0" id="result_area" :results="results" :is-cross-processed="isCrossProcess")
</template>

<script>
    async function process() {
        let processTools = async function(tools, code = this.sampleCode, callbackFn = (res, tool) => { console.warn('no operation specified!') }) {
            for (let tId in tools) {
                if (tools.hasOwnProperty(tId)) {
                    let tool = tools[tId];
                    if (tool.isSelected) {
                        try {
                            let cmd = (tool.type === "obfuscator"  ? "obfuscate" : "deobfuscate");
                            let res = await makeRequest("/process", "POST", {id: tId, code: code, options: tool.options, cmd: cmd});
                            callbackFn(res, tool);
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
            if (this.isCrossProcess) {
                // use the resulting code of each obfuscator as samplecode for the deobufscators
                let callDeobfs = async function(deobfs, showResFn, obfRes, obf) {
                    showResFn(obfRes, obf);  // show result of the obfuscation as well

                    // call all the deobufscators on the output of the obfuscator
                    await processTools(deobfs, encodeURIComponent(obfRes.code), (deobfRes, deobf) => {
                        // link the deobfuscation result with the used obfuscator
                        deobfRes.resultFor = obf;
                        showResFn(deobfRes, deobf);
                    });
                };

                await processTools(this.obfuscators, this.sampleCode, callDeobfs.bind(this, this.deobfuscators, this.showResults));
            } else {    // use same sample for each tool
                await processTools(this.obfuscators, this.sampleCode, this.showResults);
                await processTools(this.deobfuscators, this.sampleCode, this.showResults);
            }

        } catch (exc) {
            console.error("Couldn't send request: " + exc);
        }
    }

    export default {
        data() {
            return {
                sampleCode: "",
                results: [],
                isCrossProcess: true
            }
        },
        computed: {
            readyToProcess() {
                return this.sampleCode && (this.countSelected(this.obfuscators) || this.countSelected(this.deobfuscators));
            },
            canCrossProcess() {
                return this.countSelected(this.obfuscators) && this.countSelected(this.deobfuscators);
            }
        },
        created() {
            this.isCrossProcess = Object.values(this.obfuscators).length > 0 && Object.values(this.deobfuscators).length > 0;
        },
        methods: {
            process: process,
            countSelected(tools) {
                return Object.values(tools).some((t) => { return t.isSelected });
            },
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
                res.id = (tool.type === "obfuscator" ? tool.id : tool.id + 9000);       // use id as key for sorting and list obfuscator results first

                res.toolName = tool.name;
                res.type = tool.type;

                if (!res.code) {
                    res.failed = true;
                }

                this.results.push(res);
            },
        },
};
</script>