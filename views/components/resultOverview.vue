<template lang="pug">
div(id="result-overview")
    h3 Result{{results.length > 1 ? "s" : ""}}

    result-detail(v-if="results.length === 1" :result="results[0]")

    template(v-else-if="results.length > 1")
        template(v-if="isCrossProcessed")
            //- complex layout to display obfuscatoOr results first and then show deobfuscation results per obfuscator
            simple-result-list(:results="obfuscatorResults")

            div(class="")
                p Overview
                div(class="" v-for="res in results")
                    h4 {{res.toolName}}

        simple-result-list(v-else="" :results="results")

    div(v-else="") No results
</template>


<script>
    export default {
        props: ['results', 'isCrossProcessed'],
        data() {
            return {
            }
        },
        computed: {
            obfuscatorResults() {
                return this.getFilteredResults((r) => { return r.type === 'obfuscator'});
            },
            groupedDeobfuscators() {

            }
        },
        created() {
            console.log("Results: isCrossProcessed: " + (this.isCrossProcessed ? "true" : "false"));
        },
        methods: {
            getFilteredResults(pred) {
                return this.results.some(pred);
            }
        }
    }
</script>
