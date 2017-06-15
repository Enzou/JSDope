<template lang="pug">
div(class="result-detail")
    h4 {{result.toolName}}
    textarea(class="resulting_code" ref="code-area") {{ result.code}}

    label(for="compression") Compression rate:
    span(id="compression", class="result_info") {{ result.compressionRate}}
    br
    label(for="time") processing time:
    span(v-once id="time" class="result_info") {{result.time}}
</template>


<script>
    export default {
        props: ['result'],
        watch: {
            'result': function(val, oldVal) {
                debugger;
            }
        },
        methods: {
            resize: function(el) {
                el.style.height = "5px";
                el.style.height = (el.scrollHeight)+"px";
            }
        },
        mounted() {
            let el = this.$refs["code-area"] ;
            this.resize(el);
        }
    }
</script>