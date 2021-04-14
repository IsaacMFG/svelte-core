<script lang="ts">
    import css from './css';

    export let progress = 0;
    export let height = 15;
    export let background: string;
    export let foreground: string;
    export let text: boolean = false;
    export let textColor: string;
    export let style: string = null;
    export let barStyle: string = null;
    export let textStyle: string = null;
</script>

<div class="progress" {style} use:css={{ background, height: `${height}px` }}>
    <div
        style="width: {progress}%; {barStyle || ''}"
        use:css={{ foreground }}
    />
    {#if text}
        <span style={textStyle} use:css={{ textColor }}>{progress}%</span>
    {/if}
</div>

<style lang="scss">
    @use 'theme';

    .progress {
        --background: #595959;
        --height: auto;

        height: var(--height);
        overflow: hidden;
        background: var(--background);
        display: flex;
        align-items: center;
        border-radius: 20px;
        padding: 7px;
        box-sizing: content-box;
        position: relative;

        &,
        div {
            box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
                inset 0 -2px 6px rgb(0, 0, 0, 0.4);
        }

        div {
            --foreground: var(--theme-primary, #{theme.$primary});

            height: 100%;
            background: var(--foreground);
            border-radius: 20px;
            transition: width 250ms;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        span {
            --textColor: white;

            color: var(--textColor);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>
