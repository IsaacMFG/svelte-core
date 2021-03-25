<script lang="ts">
    import { onMount } from 'svelte';

    export let id: string = null;
    export let checked: boolean = false;

    onMount(() => {
        if (!id) throw new Error('Checkbox must have an ID to work properly.');
    });
</script>

<div>
    <input type="checkbox" {id} bind:checked on:change />
    <label for={id}>
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
                line-height: 1.7;
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
                    top: 0.545em;
                    left: 0.15em;
                    font-size: 1.375em;
                    color: var(--theme-primary, #{theme.$primary});
                    line-height: 0;
                    transition: all 0.2s;
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
