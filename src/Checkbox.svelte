<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';

    export let id: string = null;
    export let checked: boolean = false;
    export let style: string = null;
    export let innerStyle: string = null;

    const dispatch = createEventDispatcher();

    onMount(() => {
        if (!id) throw new Error('Checkbox must have an ID to work properly.');
    });

    const handleChange = () => {
        dispatch('input', { value: checked });
    };
</script>

<div {style}>
    <input
        type="checkbox"
        {id}
        bind:checked
        on:change
        on:change={handleChange}
    />
    <label for={id} style={innerStyle}>
        <slot />
    </label>
</div>

<style lang="scss">
    @use 'theme';

    div {
        display: flex;
        align-items: center;

        [type='checkbox']:not(:checked),
        [type='checkbox']:checked {
            position: absolute;
            left: 0;
            opacity: 0;
            pointer-events: none;
            user-select: none;

            & + label {
                position: relative;
                padding-left: 2.3em;
                font-size: 1.05em;
                line-height: 1.4em;
                height: calc(1.4em + 2px);
                cursor: pointer;

                &:before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 1.4em;
                    height: 1.4em;
                    border: 1px solid #aaa;
                    background: #fff;
                    border-radius: 0.2em;
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1),
                        0 0 0
                            var(
                                --theme-primary-transparent,
                                #{theme.$primary-transparent}
                            );
                    transition: all 0.275s;
                }

                &:after {
                    content: '✕';
                    position: absolute;
                    top: 0;
                    left: 0;
                    font-size: 1.4em;
                    color: var(--theme-primary, #{theme.$primary});
                    transition: all 0.2s;
                    height: calc(100% + 1px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 1.05em;
                }
            }
        }

        [type='checkbox']:not(:checked) + label:after {
            opacity: 0;
            transform: scale(0) rotate(45deg);
        }

        [type='checkbox']:checked + label:after {
            opacity: 1;
            transform: scale(1) rotate(0);
        }

        [type='checkbox']:disabled:not(:checked) + label:before,
        [type='checkbox']:disabled:checked + label:before {
            box-shadow: none;
            border-color: #bbb;
            background-color: #e9e9e9;
        }

        [type='checkbox']:disabled:checked + label:after {
            color: #777;
        }

        [type='checkbox']:disabled + label {
            color: #aaa;
        }

        [type='checkbox']:checked:focus + label:before,
        [type='checkbox']:not(:checked):focus + label:before {
            animation: 500ms checkbox-ripple;
        }
    }

    @keyframes checkbox-ripple {
        0% {
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1),
                0 0 0 6px
                    var(
                        --theme-primary-transparent,
                        #{theme.$primary-transparent}
                    );
        }
        100% {
            box-shadow: none;
        }
    }
</style>
