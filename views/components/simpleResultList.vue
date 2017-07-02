<template lang="pug">
table(class="result-table")
    thead
        tr
            th Tool
            th(v-if="!hidetype") Type
            th Compression rate
            th Processing time
            th Preview
    tbody
        tr(v-for="res in sortedResults" :key="res.id" v-if="showAll || !res.failed" v-bind:class="[{failed: res.failed}, 'result-entry']")
            td(class="res_entry-title clickable" @click="onResultClicked(res)") {{res.toolName}}
            td(v-if="!hidetype") {{ formatType(res.type) }}
            td {{ res.compressionRate }}
            td {{ res.time }}
            td(class="code-preview clickable" @click="onResultClicked(res)")
                p {{ res.code }}
</template>


<script>
    export default {
        props: ['results', 'hidetype', 'show-all'],
        computed: {
            sortedResults: function() {
                let sortByName = (a, b) => {
                    return a.toolName > b.toolName
                };

                let sortedRes = this.results.sort(sortByName);
                sortedRes = sortedRes.sort((a,b) => {
                    if (a.type !== b.type) {
                        return (a.type === 'obfuscator' ? -1 : 1);
                    } else {
                        return 0;
                    }
                });

                return sortedRes;
            }
        },
        methods: {
            formatType(type) {
                return type.charAt(0).toUpperCase() + type.slice(1);
            },
            onResultClicked(result) {
                this.$emit('result-clicked', result);
            }
        }
    }
</script>
