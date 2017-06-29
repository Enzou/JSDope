<template lang="pug">
div(class="tool-selector framed")
    div(class="table-row header")
        h3(class="col1 name-header") Select {{toolTitle}}
        h4(class="col2 details-header") Options

    div(v-for="t in tools" class="table-row")
        div(class="col1 tool-name")
            label
                input(type="checkbox" v-bind:name="prefix + '_sel'" v-bind:id="prefix + '_' + t.id" v-model="t.isSelected")
                | {{t.name}}
        div(class="col2 tool-options" v-if="t.isSelected")
            template(v-for="(o, k) in t.options")
                label {{ optionDescr[t.id][k].text }}:
                    select(v-if="getType(t.id, k) === 'selection'" v-model="tools[t.id].options[k]._selected")
                        option(v-for="(val, c) in o" v-if="c !== '_selected'" ) {{ c }}
                    input(v-else-if="getType(t.id, k) === 'checkbox'" type="checkbox" v-model="tools[t.id].options[k]")
                    input(v-else-if="getType(t.id, k) === 'text'" type="text" v-model="tools[t.id].options[k]")
                    span(v-else="") Invalid option type for option: {{ o }}
                br

    div(v-if="!tools" class="table-row") No data available
</template>


<script>
    export default {
        props: ['tools', 'toolTitle', 'prefix'],
        data() {
            return {
                optionDescr: {}
            }
        },
        created() {
            // create description object for all tools, which is needed to render the available options
            let tool = null;
            for (let tId in this.tools) {
                if (this.tools.hasOwnProperty(tId)) {
                    tool = this.tools[tId];
                    tool.isSelected = tool.isSelected || true;     // set default value for selections
                    this.optionDescr[tId] = this.getOptionDescr(tool.options);
                }
            }
        },
        methods: {
            // handler for (de-)selection tools
            getOptionDescr: getOptionDescriptions,
            getType: function(tId, opt) {
                return this.optionDescr[tId][opt].type;
            }
        }
    }

    function getOptionDescriptions(options) {
        let formatText = (orig, singularize=false) => {
            // insert space between capital letters
            let text = orig.replace(/([A-Z])/g, ' $1').trim();
            if (singularize && text.endsWith('s')) {    // trip last s if it should be converted to singular form
                text = text.slice(0, -1);
            }
            return text.charAt(0).toUpperCase() + text.slice(1);  // make first letter uppercase
        };

        let determineOptionType = (opt) => {
            // switch(typeof opt) {}     /* typeof operator won't work in vue - seems to be a bug */
            if (opt instanceof Object) {
                return "selection";
            } else if (opt === true || opt === false) {
                return "checkbox";
            } else {
                return "text";
            }
        };

        let descr = {};

        for (let o in options) {
            if (options.hasOwnProperty(o)) {
                let type = determineOptionType(options[o]);

                descr[o] = {
                    text: formatText(o, type === "selection"),
                    type: type
                };

                // add list of possible choices, if it's a selection element
                if (type === "selection") {
                    let choices = [];
                    for (let c in options[o])
                        if (options[o].hasOwnProperty(c)) {
                            choices.push(c);
                        }
                    descr[o].options = choices;
                }
            }
        }

        return descr;
    }
</script>

<style>
    .tool-selector .table-row .col1 {
        flex: 2 0;
    }

    .tool-selector .table-row .col2 {
        flex: 3 0;
    }

    .tool-selector .table-row.header .details-header {
        margin-top: 25px;
    }

    .table-row {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 100%;
        padding: 0 15px;
    }

    .tool-selector .header h3, .tool-selector .header h4 {
        font-weight: bold;
    }

    .tool-selector .tool-options {
        margin-bottom: 15px;
    }

    .tool-selector .options-box h4 {
        margin-top: 0;
        margin-bottom: 1em;
    }
</style>
