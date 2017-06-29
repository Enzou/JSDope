<template lang="pug">
div(id="result-overview")
    h3 Result{{results.length > 1 ? "s" : ""}}

    result-detail(v-if="results.length === 1" :result="results[0]")

    template(v-else-if="results.length > 1")
        template(v-if="isCrossProcessed")
            h4 Obfuscators
            //- complex layout to display obfuscatoOr results first and then show deobfuscation results per obfuscator
            simple-result-list(:results="obfuscatorResults" @result-clicked="onResultClicked")

            br
            h4 Deobfuscations per obfuscator
            div(class="")
                div(class="" v-for="res in results")
                    h4 {{res.toolName}}

        simple-result-list(v-else="" :results="results")

        modal(v-if="showModal")
            h3(slot="header") {{ selectedResult.toolName }}
            result-detail(slot="body" :result="selectedResult" :show-name="false")
            div(slot="footer")
                button(class="btn primary-btn" @click="toggleModal(false)")
                    | Close

    div(v-else="") No results
</template>


<script>
    export default {
        props: ['results', 'isCrossProcessed'],
        data() {
            return {
                selectedResult: null,
                showModal: false
            }
        },
        created() {
            console.log("results: ");
            console.dir(this.results);
        },
        computed: {
            obfuscatorResults() {
                return this.results.filter((r) => { return r.type === 'obfuscator'});
            },
            groupedDeobfuscators() {

            }
        },
        methods: {
            onResultClicked(result) {
                this.selectedResult = result;
                this.toggleModal(true);
            },
            toggleModal(show) {
                this.showModal = show;
            },
            getFilteredResults(pred) {
                return this.results.filter(pred);
            }
        }
    }
</script>
