<template lang="pug">
div(id="result-overview")
    h3 Result{{results.length > 1 ? "s" : ""}}

    result-detail(v-if="results.length === 1" :result="results[0]")

    template(v-else-if="results.length > 1")
        template(v-if="isCrossProcessed")
            h4 Obfuscators
            //- complex layout to display obfuscatoOr results first and then show deobfuscation results per obfuscator
            simple-result-list(:results="obfuscatorResults" :hidetype="true" :show-all="showAll" @result-clicked="onResultClicked")

            br
            h4 Deobfuscations per obfuscator
            div(class="")
                div(class="" v-for="(res, k) in groupedDeobfuscators")
                    h4 {{k}}
                    simple-result-list(:results="res" :hidetype="true" :show-all="showAll" @result-clicked="onResultClicked")

        //- simple layout treating obfuscator and deobfuscator equally
        simple-result-list(v-else="" :results="results" :show-all="showAll" @result-clicked="onResultClicked")

        modal(v-if="showModal")
            h3(slot="header") {{ selectedResult.toolName }}
            result-detail(slot="body" :result="selectedResult" :show-name="false")
            div(slot="footer")
                button(class="btn primary-btn" @click="toggleModal(false)")
                    | Close

        label(id="show-all-results")
            input(type="checkbox" v-model="showAll")
            | Show all results


    div(v-else="") No results
</template>


<script>
    export default {
        props: ['results', 'isCrossProcessed'],
        data() {
            return {
                selectedResult: null,
                showModal: false,
                showAll: true
            }
        },
        computed: {
            obfuscatorResults() {
                return this.results.filter((r) => { return r.type === 'obfuscator'});
            },
            groupedDeobfuscators() {
                let groupedRes = this.results.reduce((grp, r) => {
                    if (r.type === 'deobfuscator' && r.hasOwnProperty('resultFor')) {
                        let obf = r['resultFor'];
                        (grp[obf.name] = grp[obf.name] || []).push(r);
                    }
                    return grp;
                }, {});

                console.group("calculating deobfuscator groups");
                console.dir(this.results);
                console.dir(groupedRes);
                console.groupEnd();

                return groupedRes;
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
