<template lang="pug">
div(class="sample-selector")
    h3(class="samples-header") Select Samples
    div(class="sample-list-container")
        ul(class="sample-list")
            li(v-for="s in samples" v-bind:class="selectedId == s.id ? 'selected' : ''" @click="selectSample(s.id)")   {{s.name}}

    textarea(class="sample-content" v-model="sampleCode")

</template>


<script>
    export default {
        props: ['samples'],
        data() {
            return {
                sampleCode: "",
                selectedId: -1
            }
        },
        methods: {
            // TODO add feature to use only selected code within the content
            selectSample: function(id) {
                let sample = this.samples[id];
                this.sampleCode = sample.content;
                this.selectedId = id;
            }
        }
    }
</script>


<style>
    .sample-selector {
        display: flex;
        flex-flow: row wrap;
        align-items: stretch;
    }

    .sample-selector > * {
        flex: 1 100%;
        padding: 10px;
    }

    .sample-list-container {
        flex: 0 0 200px;
        margin: 0 10px 0 0;
        padding-left: 10px;
    }

    .sample-content {
        flex: 4 0;
        height: 300px;
        margin: auto;

        background-color: #1f1f1f;
        color: #a0a0a0;
    }

    .selected {
        background-color: rgba(100,100,100,0.2);
    }
</style>