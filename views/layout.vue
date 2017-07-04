<template lang="pug">
//- basic layout for the front end. The other vue parts will be rendered into the body
doctype html
html
    head
        title= title
        link(rel='stylesheet', href='/css/style.css')
        link(rel="stylesheet" href="/css/bootstrap.min.css")
        script(src='https://unpkg.com/vue')

    body
        | {{{app}}}
        | {{{script}}}
</template>

<script>
</script>

<style>
</style>