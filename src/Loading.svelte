<script lang="ts">
    import css from './css';

    export let loading: boolean = true;
    export let maxWidth: number = 150;

    const missingSpinner = () => {
        throw new Error('LOADING: Missing spinner gif @ `images/spinner.gif`.');
    };
</script>

{#if loading}
    <div class="loader">
        <img
            src="images/spinner.gif"
            alt="Spinner Gif"
            use:css={{ 'max-width': `${maxWidth}px` }}
            on:error={missingSpinner}
        />
    </div>
{/if}

<style lang="scss">
    .loader {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(128, 128, 128, 0.4);
        z-index: 99;

        & > img {
            --max-width: 150px;

            max-width: var(--max-width);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            position: absolute;
        }
    }
</style>
