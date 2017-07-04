<template lang="pug">

div(id="app")
    h1(class="main-title") {{title}}

    tool-selector(:tools="obfuscators" :tool-title="'Obfuscators'" :prefix="'obf'")
    tool-selector(:tools="deobfuscators" :tool-title="'Deobfuscators'" :prefix="'deobf'")

    sample-selector(ref="sampleSelector" :samples="samples" @sample-changed="onSampleChanged")

    input(id="btn-process" type='button' value='Process' class="btn primary-btn" @click="process" :disabled="!readyToProcess")

    template()
        label(title="Use the result of every obfuscation as input for every deobfuscator")
            input(type="checkbox" v-model="isCrossProcess")
            | Process every obfuscator output as deobfuscator input

    result-overview(v-if="results && results.length > 0" id="result_area" :results="results" :is-cross-processed="isCrossProcess" @sample-changed="updateSampleCode")
</template>

<script>
    function makeRequest(path, method = "GET", args = {}) {
        // wrap the AJAX request in a promise, so the caller can handle the
        // response as he wishes

        if (!path.startsWith('/api')) {
            path = "/api" + path;
        }

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        // call the handle function if the request was a success
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.responseText);
                        console.warn('There was a problem with the request: ' + path);
                    }
                }
            };

            xhr.open(method, path);
            // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(args));
        });
    }

    /**
     *
     * @returns {Promise.<void>}
     */
    async function process() {
        let processTools = async function(tools, code = this.sampleCode, callbackFn = (res, tool) => { console.warn('no operation specified!') }) {
            for (let tId in tools) {
                if (tools.hasOwnProperty(tId)) {
                    let tool = tools[tId];
                    if (tool.isSelected) {
                        try {
                            let cmd = (tool.type === "obfuscator"  ? "obfuscate" : "deobfuscate");
                            let res = await this.makeRequest("/process", "POST", {id: tId, code: code, options: tool.options, cmd: cmd});
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
                    await processTools.call(this, deobfs, encodeURIComponent(obfRes.code), (deobfRes, deobf) => {
                        // link the deobfuscation result with the used obfuscator
                        deobfRes.resultFor = obf;
                        showResFn(deobfRes, deobf);
                    });
                };

                await processTools.call(this, this.obfuscators, this.sampleCode, callDeobfs.bind(this, this.deobfuscators, this.showResults));
            } else {    // use same sample for each tool
                await processTools.call(this, this.obfuscators, this.sampleCode, this.showResults);
                await processTools.call(this, this.deobfuscators, this.sampleCode, this.showResults);
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
                isCrossProcess: false
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
        methods: {
            process: process,
            makeRequest: makeRequest,
            countSelected(tools) {
                return Object.values(tools).some((t) => { return t.isSelected });
            },
            /**
             *
             */
            onSampleChanged: function(sample) {
                if (Number.isInteger(sample)) { // sample Id means the whole sample is used
                    this.sampleCode = this.samples[sample].content;
                } else if(typeof sample === 'string') {
                    this.sampleCode = sample;
                } else {
                    console.error("Received invalid sample in event: " + JSON.stringify(sample));
                }
            },
            /**
             * Update the sample code in the sample selector
             * @param {string} sampleCode - the new code which should be 'selected'
             */
            updateSampleCode(sampleCode) {
                let selector = this.$refs.sampleSelector; // get reference to the sample-selector component
                if (selector) {
                    selector.setSample(sampleCode);
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