<script lang="ts">
    import { Component } from 'mfg-core';
</script>

<main>
    <Component name="World" />
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
