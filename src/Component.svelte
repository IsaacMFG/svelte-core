<script lang="ts">
    import { onMount } from 'svelte';
    import css from './css';

    // Exported variables.
    export let href: string = null;
    export let background: string = null;
    export let color: string = null;
    export let hover: string = null;
    export let a: boolean = false;
    export let type: string = null;

    // Variables.
    let aElement: HTMLAnchorElement;
    let buttonElement: HTMLButtonElement;
    let form: HTMLFormElement = null;

    onMount(() => (form = (aElement || buttonElement).closest('form')));

    const unfocus = () => {
        // Blur both.
        if (aElement) aElement.blur();
        if (buttonElement) buttonElement.blur();
    };
</script>

<svelte:window on:mouseup={unfocus} />

{#if a || href}
    <a
        bind:this={aElement}
        use:css={{ background, color, hover }}
        on:click
        {href}
        tabindex="0"
        role="button"
    >
        <slot />
    </a>
{:else}
    <button
        type={!!form && !type ? 'submit' : type || 'button'}
        bind:this={buttonElement}
        use:css={{ background, color, hover }}
        on:click
    >
        <slot />
    </button>
{/if}

<style lang="scss">
    a,
    button {
        --background: var(--primary-blue);
        --color: white;
        --hover: #0f85b3;

        display: inline-block;
        background: var(--background);
        color: var(--color);
        border-radius: 4px;
        font-size: 14px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        user-select: none;
        outline: none;
        border: none;

        &:hover,
        &:focus {
            background: var(--hover);
        }
    }
</style>
