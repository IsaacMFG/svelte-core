<script lang="ts">
    export let min: number = 1;
    export let max: number = 100;
    export let value: number = 1;
    export let id: string = null;
    export let name: string = null;

    let input: HTMLInputElement;

    $: percentage = Math.round(((value - min) * 100) / Math.round(max - min));
</script>

<div class="slider">
    <span>
        <input
            {id}
            {min}
            {max}
            {name}
            type="range"
            bind:this={input}
            bind:value
        />
        <span class="container">
            <span class="bar">
                <span style="width: {percentage}%;" />
            </span>
            <span class="label" style="left: {percentage}%;">
                <span>{value}</span>
            </span>
        </span>
    </span>
</div>

<style lang="scss">
    @use 'theme';

    .slider {
        margin: 0 10px;

        & > span {
            display: inline-block;
            width: 100%;
            box-sizing: border-box;
            position: relative;
            padding: 2.5rem 0 1rem;

            & > input {
                opacity: 0;
                width: calc(100% + 20px);
                position: absolute;
                left: -10px;
                top: 17px;
                cursor: pointer;
                z-index: 2;
                -webkit-appearance: none;
                appearance: none;

                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    z-index: 100;
                    position: relative;
                    width: 50px;
                    height: 30px;
                    border-radius: 10px;
                }
            }

            & > .container {
                display: inline-block;
                width: 100%;
                position: absolute;
                left: 0;
                z-index: 1;

                & > .bar {
                    background-color: #000;
                    display: inline-block;
                    position: absolute;
                    z-index: 1;
                    top: 0;
                    left: 0;
                    height: 5px;
                    width: 100%;
                    overflow: hidden;
                    border-radius: 10px;

                    & > span {
                        background: var(--theme-primary, #{theme.$primary});
                        display: flex;
                        height: 5px;
                        width: 0%;
                    }
                }

                & > .label {
                    display: flex;
                    position: absolute;
                    font-weight: bold;
                    text-align: center;
                    top: -2.35rem;

                    &:after {
                        content: '';
                        background-color: var(
                            --theme-primary,
                            #{theme.$primary}
                        );
                        border-radius: 100%;
                        width: 20px;
                        height: 20px;
                        position: absolute;
                        top: 1.8rem;
                        z-index: 1;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.8);
                        left: 50%;
                        transform: translateX(-50%);
                    }

                    & > span {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);

                        &:before {
                            content: '';
                            border-width: 4px;
                            border-style: solid;
                            border-color: #333 transparent transparent;
                            position: absolute;
                            top: 1.25rem;
                            left: 50%;
                            transform: translateX(-50%);
                        }
                    }
                }
            }
        }
    }
</style>
