<template lang="pug">
div(id="result-overview")
    h3 Result{{results.length > 1 ? "s" : ""}}

    result-detail(v-if="results.count === 1" :result="sortedResults[0]")

    table(v-else-if="results.count > 1" class="result-table")
        thead
            tr
                th Tool
                th Compression rate
                th Processing time
                th Type
                th Preview
        tbody
            tr(v-for="res in sortedResults" :key="res.id")
                td(class="res_entry-title clickable") {{res.toolName}}
                td {{res.compressionRate}}
                td {{ res.time }}
                td {{ res.type.charAt(0).toUpperCase() + res.type.slice(1) }}
                td(class="code-preview")
                    textarea {{ res.code }}

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
                console.log("getting sorted result");
                let sortByName = (a, b) => {
                    return a.toolName < b.toolName;
                };
                let sortedResults = this.results['obfuscator'].sort(sortByName);
                return sortedResults.concat(this.results['deobfuscator'].sort(sortByName));
            }
        }
    }
</script>
