<template lang="pug">
table(class="result-table")
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
            td {{ res.compressionRate }}
            td {{ res.time }}
            td {{ formatType(res.type) }}
            td(class="code-preview")
                textarea {{ res.code }}
</template>


<script>
    export default {
        props: ['results'],
        computed: {
            sortedResults: function() {
                let sortByName = (a, b) => {
                    return a.toolName > b.toolName;
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
            }
        }
    }
</script>
