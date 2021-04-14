<script lang="ts">
    import css from './css';

    export let size: number = 128;
    export let colour: string = null;
    export let show: boolean = true;
    export let center: boolean = true;
    export let style: string = null;
    export let svgStyle: string = null;

    let className: string = '';
    export { className as class };
</script>

<div
    class={className}
    class:center
    {style}
    use:css={{ size: `${size}px`, colour }}
>
    {#if show}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            style={svgStyle}
        >
            <circle cx="26" cy="26" r="25" fill="none" />
            <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
    {/if}
</div>

<style lang="scss">
    div {
        --size: 128px;
        --colour: #7ac142;

        &.center {
            margin: auto;
            text-align: center;
        }

        svg {
            width: var(--size);
            height: var(--size);
            border-radius: 50%;
            display: block;
            stroke-width: 2;
            stroke: white;
            stroke-miterlimit: 10;
            box-shadow: inset 0px 0px 0px var(--colour);
            animation: fill 400ms ease-in-out 400ms forwards,
                scale 300ms ease-in-out 900ms both;

            circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                stroke-width: 2;
                stroke-miterlimit: 10;
                stroke: var(--colour);
                fill: none;
                animation: stroke 600ms cubic-bezier(0.65, 0, 0.45, 1) forwards;
            }

            path {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                animation: stroke 300ms cubic-bezier(0.65, 0, 0.45, 1) 800ms
                    forwards;
            }
        }
    }

    @keyframes stroke {
        100% {
            stroke-dashoffset: 0;
        }
    }

    @keyframes scale {
        0%,
        100% {
            transform: none;
        }
        50% {
            transform: scale3d(1.1, 1.1, 1);
        }
    }

    @keyframes fill {
        100% {
            box-shadow: inset 0px 0px 0px 70px var(--colour);
        }
    }
</style>
