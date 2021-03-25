<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import css from './css';

    // Types.
    type KeyboardEvent = globalThis.KeyboardEvent & {
        currentTarget: EventTarget & Window;
    };

    // Exported variables.
    export let isOpen: boolean = false;
    export let disableClose: boolean = false;
    export let hasBackdrop: boolean = true;
    export let autoFocus: boolean = true;
    export let escapeToClose: boolean = true;
    export let backdropClasses: string = '';
    export let bodyClasses: string = '';
    export let bodyBackground: string = 'white';
    export let bodyPadding: number = 15;

    let className: string = '';
    export { className as class };

    // Exported functions.
    export const open = () => {
        // Set isOpen to true.
        isOpen = true;

        // Set window overflow to hidden.
        lastWindowOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';

        // Dispatch events.
        dispatch('open');
        dispatch('openStart');
        setTimeout(() => dispatch('openEnd'), 500);
    };

    export const close = (value: any = undefined) => {
        // Set variables.
        isOpen = false;
        finishedClosing = false;

        // Set window overflow to null.
        document.documentElement.style.overflow = lastWindowOverflow;

        // Dispatch events.
        dispatch('close', { value });
        dispatch('closeStart');
        setTimeout(() => {
            dispatch('closeEnd');
            finishedClosing = true;
        }, 500);
    };

    onMount(() => {
        // Handle auto focus.
        handleAutoFocus();
    });

    // Variables.
    const dispatch = createEventDispatcher();
    let container: HTMLDivElement;
    let finishedClosing: boolean = true;
    let lastWindowOverflow: string;

    // Functions.
    const handleKeyup = (e: KeyboardEvent) => {
        // Close the dialog on escape if needed.
        if (disableClose || !escapeToClose || !isOpen || e.key !== 'Escape') {
            return;
        }

        close();
    };

    const handleAutoFocus = () => {
        // If disabled.
        if (!autoFocus) return;

        // Get all focusable elements and then select the first one if possible.
        const focusable = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) focusable[0].focus();
    };
</script>

<svelte:window on:keyup={handleKeyup} />

<div class="container {className}" class:open={isOpen} bind:this={container}>
    {#if hasBackdrop}
        <div
            class="backdrop {backdropClasses}"
            on:click={() => !disableClose && close()}
        />
    {/if}

    <div
        class="body {bodyClasses}"
        use:css={{ background: bodyBackground, padding: `${bodyPadding}px` }}
    >
        {#if isOpen || !finishedClosing}
            <slot />
        {/if}
    </div>
</div>

<style lang="scss">
    .container {
        position: fixed;
        z-index: 50;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        visibility: hidden;
        user-select: none;
        pointer-events: none;
        transition: all 500ms;

        &.open {
            opacity: 1;
            visibility: visible;
            user-select: auto;
            pointer-events: auto;
        }

        .backdrop {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(128, 128, 128, 0.4);
        }

        .body {
            --background: white;
            --padding: 15px;

            position: relative;
            max-width: 70vw;
            max-height: 70vh;
            background: var(--background);
            padding: var(--padding);
            border-radius: 10px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            overflow: auto;
            display: flex;
            align-items: center;
        }
    }
</style>
