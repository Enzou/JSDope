<template lang="pug">
div(id="result-overview")
    h3 Result

    result-detail(v-if="results.length === 1" :result="results[0]")

    div(v-else="")
        span Tset

</template>


<script>
    export default {
        props: ['results'],
        data() {
            return {

            }
        }
    }
</script>


<style>
#obfuscated_code {
    border: 1px solid gray;
    border-radius: 5px;
    padding: 10px;
    overflow-wrap: break-word;
}

.result_info {
    margin-left: 3px;
}
</style>