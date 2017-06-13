<template lang="pug">
div(id="result-overview")
    h3 Result{{results.length > 1 ? "s" : ""}}

    result-detail(v-for="res in results" :key="res.toolName" :result="res")
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
