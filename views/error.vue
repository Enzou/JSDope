<template>
    <h1>{{title}}</h1>
    <h2>Error!</h2>
    <h2>{{code}} {{message}}</h2>
    <pre>
        {{error.stack}}
    </pre>
</template>

<script>
export default {
    data() {
        return {};
    }
}
</script>

<style>
</style>