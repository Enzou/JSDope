<template lang="pug">
div(id="result-overview")
    h3 Result{{results.length > 1 ? "s" : ""}}

    result-detail(v-if="results.count === 1" :result="sortedResults[0]")

    template(v-else-if="results.count > 1")
        table(v-if="!isCrossProcessed" class="result-table")
            thead
                tr
                    th Tool
                    th Compression rate
                    th Processing time
                    th Type
                    th Preview
            tbody
                tr(v-for="res in sortedResults" :key="res.id" v-bind:class="[{failed: res.failed}, 'result-entry']")
                    td(class="res_entry-title clickable") {{res.toolName}}
                    td {{res.compressionRate}}
                    td {{ res.time }}
                    td {{ formatType(res.type) }}
                    td(class="code-preview")
                        textarea {{ res.code }}

        div(class="")
            p Overview
            div(class="" v-for="res in results")
                h4

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
            sortedResults: function() {
                let sortByName = (a, b) => {
                    return a.toolName < b.toolName;
                };
                let sortedResults = this.results['obfuscator'].sort(sortByName);
                return sortedResults.concat(this.results['deobfuscator'].sort(sortByName));
            }
        },
        methods: {
            formatType(type) {
                return type.charAt(0).toUpperCase() + type.slice(1);
            }
        }
    }
</script>
