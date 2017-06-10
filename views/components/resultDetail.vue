<template lang="pug">
    p(id="obfuscated_code")

    label(for="compression") Kompressionsrate:
    span(id="compression", class="result_info")
    br
    label(for="time") benötigte Zeit:
    span(id="time", class="result_info")
</template>


<script>
    export default {
        props: ['result']
    }
</script>