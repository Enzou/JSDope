<template lang="pug">
doctype html
html
    head
        title= title
        link(rel='stylesheet', href='/css/style.css')
        link(rel="stylesheet" href="/css/bootstrap.min.css")
        script(src='/js/context.js')
        script(src='/js/main.js')
        script(src='https://unpkg.com/vue')

    body
        | {{{app}}}
        | {{{script}}}
</template>

<script>
</script>

<style>
</style>