<template>
    <div id="app">
        <hi>Main {{title}}</hi>

        <tool-selector :tools="obfuscators" :prefix="obf"></tool-selector>
        <tool-selector :tools="deobfuscators" :prefix="deobf"></tool-selector>

        <input type="button" class="btn btn-primary" value="Send Request">

    </div>
</template>

<script>
    export default {
        data() {
            return {
                title: 'JavaScript Deobfuscator Comperator',
                obf: "obf"
            }
        },
        created() {
            console.log('created > ' + Date.now().toString());
        },
        methods: {
        },
};
</script>