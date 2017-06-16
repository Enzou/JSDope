<template lang="pug">
div(class="sample-selector selector-container")
    h3(class="samples-header") Select Samples
    div(class="sample-list-container list-container")
        ul(class="sample-list")
            li(v-for="s in samples" v-bind:class="selectedId == s.id ? 'selected' : ''" @click="selectSample(s.id)")   {{s.name}}

    textarea(class="sample-content detail-container" v-model="sampleCode" v-on:change="onCodeChanged")

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
        created() {
            let sample = null;
            for (let sId in this.samples) {
                if (this.samples.hasOwnProperty(sId)) {
                    sample = this.samples[sId];
                    sample.isSelected = sample.isSelected || false;     // set default value for selections
                }
            }
        },
        methods: {
            // TODO add feature to use only selected code within the content
            selectSample: function(id) {
                let sample = this.samples[id];
                this.sampleCode = decodeURIComponent(sample.content);
                this.selectedId = id;

                this.$emit('sample-changed', this.selectedId);
            },
            onCodeChanged: function() {
                this.selectedId = -1;
                this.$emit('sample-changed', this.sampleCode);
            }
        }
    }
</script>


<style>
    .sample-selector .sample-list {
        padding-left: 10px;
    }

    .sample-content {
        height: 300px;

    }

    .selected {
        background-color: rgba(100,100,100,0.2);
    }
</style>