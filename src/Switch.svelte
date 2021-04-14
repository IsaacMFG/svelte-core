<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let id: string = null;
    export let value: boolean = false;
    export let style: string = null;
    export let backStyle: string = null;
    export let frontStyle: string = null;
    export let labelStyle: string = null;

    const dispatch = createEventDispatcher();

    const handleChange = () => {
        dispatch('input', { value });
    };
</script>

<div class="switch" {style}>
    <input
        type="checkbox"
        {id}
        bind:checked={value}
        on:change
        on:change={handleChange}
    />
    <span class="back" style={backStyle} />
    <span class="front" style={frontStyle} />
    <label class="label" style={labelStyle} for={id}>
        <slot />
    </label>
</div>

<style lang="scss">
    @use 'theme';

    .switch {
        background: none !important;
        margin: 0 !important;
        position: relative;
        display: flex;

        .label {
            margin: 0px 0 0 10px;
            display: flex;
            height: 20px;
            align-items: center;
            cursor: pointer;
        }

        input[type='checkbox'] {
            opacity: 0 !important;
            width: 50px;
            height: 20px;
            margin: 0;
            z-index: 99;
            position: absolute;
            transform: translateX(-2.5px);
            cursor: pointer;

            &:checked {
                & + .back {
                    background: var(--theme-lighter, #{theme.$lighter});
                    box-shadow: inset 0 2px 9px
                            var(
                                --theme-primary-transparent,
                                #{theme.$primary-transparent}
                            ),
                        inset 0 -2px 6px var(--primary-transparent, #{theme.$primary-transparent});
                }

                & + .back + .front {
                    background: var(--theme-primary, #{theme.$primary});
                    box-shadow: inset 0 2px 9px
                            var(
                                --theme-lighter-transparent,
                                #{theme.$lighter-transparent}
                            ),
                        inset 0 -2px 6px var(--theme-lighter-transparent, #{theme.$lighter-transparent});
                    left: 25px;
                }
            }

            &:not(:checked) {
                & + .back {
                    background-color: rgba(0, 0, 0, 0.38);
                    box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
                        inset 0 -2px 6px rgba(0, 0, 0, 0.2);
                    box-sizing: border-box;
                }
                & + .back + .front {
                    background-color: #fafafa;
                    box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
                        inset 0 -2px 6px rgba(0, 0, 0, 0.21);
                    left: -5px;
                }
            }
        }

        .back {
            width: 40px;
            height: 20px;
            display: block;
            border-radius: 25px;
            transition: all 400ms;
        }

        .front {
            width: 22px;
            height: 22px;
            display: block;
            border-radius: 25px;
            position: absolute;
            left: 0;
            top: -1px;
            transition: all 400ms;
            cursor: pointer;
        }
    }
</style>
