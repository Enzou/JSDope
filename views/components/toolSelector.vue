<template lang="pug">
div(class="tool-selector")
    h2 ToolSelector
    ul(v-if="tools && Object.keys(tools) > 0" v-bind:id="prefix + '_list'")
        li(v-for="t in tools")
            label #[input(type="checkbox" v-bind:name="prefix + '_sel'" v-bind:id="prefix + '_' + t.id")] {{t.name}}
    p(v-else="") No data available

</template>


<script>
    export default {
        props: ['tools', 'prefix'],
    }
</script>

