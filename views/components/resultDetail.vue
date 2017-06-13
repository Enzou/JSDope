<template lang="pug">
div(class="result-detail")
    h4 {{result.toolName}}
    textarea(class="resulting_code") {{ result.code}}

    label(for="compression") Kompressionsrate:
    span(id="compression", class="result_info") {{ result.compressionRate}}
    br
    label(for="time") benötigte Zeit:
    span(v-once id="time" class="result_info") {{result.time}}
</template>


<script>
    export default {
        props: ['result']
    }
</script>