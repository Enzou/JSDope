<template lang="pug">
div(id="result-overview")
    h3 Result

    result-detail(v-if="results.length === 1" :result="results[0]")

    div(v-else="")
        span Test
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
