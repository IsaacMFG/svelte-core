<script lang="ts">
    import { createEventDispatcher, tick } from 'svelte';
    import css from './css';

    // Interfaces.
    interface SelectOption {
        text: string;
        value: any;
    }

    // Types.
    type WindowClickEvent = MouseEvent & {
        currentTarget: EventTarget & Window;
    };
    type SpanKeyboardEvent = KeyboardEvent & {
        currentTarget: EventTarget & HTMLSpanElement;
    };
    type DivKeyboardEvent = KeyboardEvent & {
        currentTarget: EventTarget & HTMLDivElement;
    };

    // Exported variables.
    export let id: string = '';
    export let placeholder: string;
    export let options: SelectOption[];
    export let value: any;
    export let selected: SelectOption;
    export let required: boolean = false;
    export let autocomplete: string = undefined;
    export let style: string = null;
    export let wrapperStyle: string = null;
    export let placeholderStyle: string = null;
    export let valueStyle: string = null;
    export let optionsStyle: string = null;
    export let optionStyle: string = null;

    // Variables.
    const dispatch = createEventDispatcher();
    let wrapperElement: HTMLDivElement;
    let selectElement: HTMLDivElement;
    let optionsElement: HTMLDivElement;
    let open: boolean = false;
    let keySearch: string = '';
    let keySearchTime: number;
    let keySearchInterval: number = 300;

    // Reactives.
    $: selectedIndex =
        selected && options && options.findIndex((o) => o == selected);

    const onWindowClick = (e: WindowClickEvent) => {
        // If inside the select.
        if (selectElement.contains(e.target as Node)) return;

        // Else, close and fix height.
        open = false;
    };

    export const chooseOption = (option: SelectOption) => {
        // Check if the value did not change.
        if (option === selected) return;

        // Change selected and value, then dispatch change event.
        selected = option;
        value = selected.value;
        dispatch('change', { value: selected });
    };

    const handleKeyDown = async (e: DivKeyboardEvent) => {
        // If tab.
        if (e.key === 'Tab') {
            open = false;
            return;
        }

        const focusFirst = async () => {
            await tick();
            const span = e.currentTarget.querySelector<HTMLElement>(
                '.options .option:first-child'
            );
            span.focus();
        };

        // Only if space or enter.
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            open = !open;
            if (open) await focusFirst();
        }

        const handleArrowKey = (up: boolean) => {
            // Prevent default and stop propagation.
            e.stopPropagation();
            e.preventDefault();

            let index = selectedIndex ?? -1;
            if (up) {
                // Subtract and min to 0.
                index--;
                if (index < 0) index = 0;
            } else {
                // Add and max to final option.
                index++;
                if (index >= options.length) index = options.length - 1;
            }

            // Select new index, or ignore if not new.
            if (index === selectedIndex) return;
            chooseOption(options[index]);
        };

        // If arrow up or arrow down, cycle.
        if (e.key === 'ArrowUp') handleArrowKey(true);
        if (e.key === 'ArrowDown') handleArrowKey(false);

        // If a single letter key.
        if (e.key.length !== 1) return;

        // Prevent default and stop propagation.
        e.stopPropagation();
        e.preventDefault();

        // Lowercase the key.
        const key = e.key.toLowerCase();

        // Check if we need to cycle if we typed the same key.
        if (keySearch.length > 0 && keySearch[keySearch.length - 1] === key) {
            // Cycle.
            let first: SelectOption;
            let next: SelectOption;
            for (let i = 0; i < options.length; i++) {
                // Check if first and next are both set.
                if (first && next) break;

                // Get the first char and check if it matches our key.
                const char = options[i].text[0].toLowerCase();
                if (char !== key) continue;

                // If we need to set first.
                if (!first && (!selectedIndex || i < selectedIndex)) {
                    first = options[i];
                    continue;
                }

                // If we need to set next.
                if (!next && (!selectedIndex || i > selectedIndex)) {
                    next = options[i];
                }
            }

            // If we need to select.
            if (first || next) chooseOption(next || first);

            // Update.
            keySearch = key;
            keySearchTime = performance.now();
            return;
        }

        // If not the same one, add to the search string and search.
        const temp =
            !keySearchTime ||
            performance.now() - keySearchTime > keySearchInterval
                ? key
                : `${keySearch}${key}`;

        // Try to find.
        const option = options.find(
            (o) => o.text.slice(0, temp.length).toLowerCase() === temp
        );
        if (option) chooseOption(option);

        // Update.
        keySearch = temp;
        keySearchTime = performance.now();
    };

    const handleOptionKeyDown = (
        e: SpanKeyboardEvent,
        option: SelectOption
    ) => {
        // Only if space or enter.
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            chooseOption(option);
            wrapperElement.focus();
        }

        const handleOptionChange = (up: boolean, wrap: boolean = false) => {
            e.stopPropagation();
            e.preventDefault();

            // If already first/last.
            const first = e.currentTarget.parentNode.firstElementChild;
            const last = e.currentTarget.parentNode.lastElementChild;
            if (e.currentTarget == (up ? first : last)) {
                // If not wrapping
                if (!wrap) return;

                // If wrapping.
                ((up ? last : first) as HTMLElement).focus();
                return;
            }

            // Go to the previous/next one.
            const previousNext = (up
                ? e.currentTarget.previousElementSibling
                : e.currentTarget.nextElementSibling) as HTMLElement;
            previousNext.focus();
        };

        // Handle option change on up, down, and tab.
        if (e.key === 'ArrowUp') handleOptionChange(true, false);
        if (e.key === 'ArrowDown') handleOptionChange(false, false);
        if (e.key === 'Tab') handleOptionChange(false, true);
    };
</script>

<svelte:window on:click={onWindowClick} />

<select
    {autocomplete}
    on:focus={() => wrapperElement.focus()}
    on:blur={(e) => {
        // If no value.
        if (!e.currentTarget.value) return;

        // Try to find/select the option based on its value.
        const option = options.find((o) => o.value === e.currentTarget.value);
        option && chooseOption(option);
        e.currentTarget.value = '';
    }}
>
    <option value="" />
    {#each options as option}
        <option value={option.value}>{option.text}</option>
    {/each}
</select>

<div
    {id}
    class="wrapper"
    style={wrapperStyle}
    on:click={() => (open = !open)}
    on:keydown={handleKeyDown}
    bind:this={wrapperElement}
    aria-haspopup="listbox"
    tabindex={0}
>
    <div class="select" class:open {style} bind:this={selectElement}>
        <span
            class="placeholder"
            class:raised={open || !!selected}
            style={placeholderStyle}
        >
            {placeholder || ''}
            {required && placeholder ? '*' : ''}
        </span>
        <div class="value" style={valueStyle}>
            <span>{selected?.text || ''}</span>
            <div class="arrow" />
        </div>
        <div
            class="options"
            role="listbox"
            style={optionsStyle}
            use:css={{ 'max-height': `${4 * options.length}rem` }}
            bind:this={optionsElement}
        >
            {#each options as option}
                <span
                    class="option"
                    class:selected={option === selected}
                    style={optionStyle}
                    tabindex={-1}
                    role="option"
                    on:click={() => chooseOption(option)}
                    on:keydown={(e) => handleOptionKeyDown(e, option)}
                >
                    {option.text}
                </span>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    @use 'theme';

    select {
        user-select: none;
        pointer-events: none;
        opacity: 0;
        position: absolute;
        z-index: -1;
    }

    .wrapper {
        position: relative;
        user-select: none;
        width: 100%;
        outline: none;

        &:focus {
            .select {
                border-color: transparent;

                &:after {
                    transform: scaleX(1);
                }
            }
        }

        .select {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 1.5rem;
            cursor: pointer;
            margin: 2rem auto 1rem;
            transition: all 500ms, margin 0ms;
            border-bottom: 2px solid black;

            &:after {
                content: '';
                position: relative;
                display: block;
                height: 4px;
                width: 100%;
                background: linear-gradient(
                    90deg,
                    var(--theme-secondary, #{theme.$secondary}),
                    var(--theme-primary, #{theme.$primary})
                );
                transform: scaleX(0);
                transform-origin: top left;
                transition: transform 0.5s ease;
                top: 0.3rem;
            }

            &.open {
                border-color: transparent;

                &:after {
                    transform: scaleX(1);
                }

                .options {
                    --max-height: 0;

                    pointer-events: all;
                    clip-path: inset(0 0 0 0);
                    max-height: var(--max-height);

                    .option {
                        transition: all 500ms, pointer-events 0ms,
                            visibility 0ms, font-size 0ms;
                        font-size: unset;
                    }
                }

                .value {
                    border-bottom: 0;

                    .arrow {
                        &::before {
                            left: -5px;
                            transform: rotate(-45deg);
                        }

                        &::after {
                            left: 5px;
                            transform: rotate(45deg);
                        }
                    }
                }
            }

            .placeholder {
                position: absolute;
                transform-origin: top left;
                transition: transform 400ms;

                &.raised {
                    transform: scale(0.8) translateY(-1.6rem);
                    color: #646464;
                }
            }

            .value {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 1rem;

                .arrow {
                    position: relative;
                    height: 15px;
                    width: 15px;

                    &::before,
                    &::after {
                        content: '';
                        position: absolute;
                        bottom: 0px;
                        width: 0.15rem;
                        height: 100%;
                        transition: all 500ms;
                        background-color: #919191;
                    }

                    &::before {
                        left: -5px;
                        transform: rotate(45deg);
                    }

                    &::after {
                        left: 5px;
                        transform: rotate(-45deg);
                    }
                }
            }

            .options {
                position: absolute;
                display: block;
                top: calc(100% + 3px);
                left: 0;
                right: 0;
                transition: all 500ms, pointer-events 0ms;
                pointer-events: none;
                z-index: 2;
                background-color: white;
                border: 2px solid #dadada;
                border-top: 0;
                box-sizing: border-box;
                max-height: 0;
                clip-path: inset(0 0 100% 0);

                .option {
                    position: relative;
                    display: block;
                    padding: 0.5rem;
                    cursor: pointer;
                    transition: all 500ms, pointer-events 0ms,
                        font-size 0ms 500ms;
                    outline: none;
                    font-size: 0;

                    &:hover,
                    &:focus,
                    &.selected {
                        background-color: #dadada;
                    }

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>
