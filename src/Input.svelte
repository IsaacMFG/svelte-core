<script lang="ts">
    import type { ValidationError } from 'yup';

    // Types.
    type InputEvent = Event & {
        currentTarget: EventTarget & (HTMLInputElement | HTMLTextAreaElement);
    };
    type HintErrorCallback = (value: any) => string;

    // Exported variables.
    export let textarea: boolean = false;
    export let id: string = '';
    export let placeholder: string = '';
    export let name: string = '';
    export let value: any = '';
    export let type: string = 'text';
    export let autocomplete: string = undefined;
    export let required: boolean = false;
    export let disabled: boolean = false;
    export let valid: boolean = true;
    export let validation: any = null;
    export let validationError: string = '';
    export let error: string | HintErrorCallback = '';
    export let hint: string | HintErrorCallback = '';
    export let maxLength: number = null;
    export let cols: number = 1;
    export let rows: number = 5;
    export let transform: (
        val: string | number
    ) => string | number | Promise<string> | Promise<number> = null;

    // Variables.
    let bindInputElement: HTMLInputElement | HTMLTextAreaElement;

    // Reactives.
    $: spanShown =
        !!(!valid && (error || (validation && validationError))) || !!hint;

    $: hasMaxLength = maxLength && type !== 'number' && type !== 'range';

    // Functions.
    const handleInput = async (e: InputEvent) => {
        // If number/range, we need to convert to a number.
        if (type === 'number' || type === 'range') {
            value = +e.currentTarget.value;
        } else {
            value = e.currentTarget.value;
        }

        // If transform.
        if (transform) value = await Promise.resolve(transform(value));

        // If maxLength.
        if (hasMaxLength && value.length > maxLength) {
            value = value.slice(0, maxLength);
        }

        // Validate with no validation.
        if (!validation) {
            valid = e.currentTarget.validity.valid;
            return;
        }

        // Validate with yup.
        try {
            await validation.validate(value);
            valid = true;
        } catch (e) {
            valid = false;
            validationError = (e as ValidationError).message;
        }
    };
</script>

<div
    class="input"
    class:textarea
    class:input-invalid={!valid}
    class:input-disabled={disabled}
    class:input-span-shown={spanShown}
    on:click={() => bindInputElement.focus()}
>
    {#if !textarea}
        <input
            {id}
            {type}
            {name}
            {value}
            {required}
            {disabled}
            {autocomplete}
            class="input-input"
            placeholder=" "
            bind:this={bindInputElement}
            on:input={handleInput}
        />
    {:else}
        <textarea
            {id}
            {name}
            {cols}
            {rows}
            {value}
            {required}
            {disabled}
            {autocomplete}
            class="input-input"
            placeholder=" "
            bind:this={bindInputElement}
            on:input={handleInput}
        />
    {/if}
    <label for={id}>{placeholder} {required ? '*' : ''}</label>
    {#if hasMaxLength}
        <span class="input-hint-text max-length">
            {value.length} / {maxLength}
        </span>
    {/if}
</div>

{#if !valid && (error || (validation && validationError))}
    <span class="input-error-text" class:has-max-length={hasMaxLength}>
        {validation && validationError
            ? validationError
            : typeof error === 'string'
            ? error
            : error(value)}
    </span>
{:else if hint}
    <span class="input-hint-text" class:has-max-length={hasMaxLength}>
        {typeof hint === 'string' ? hint : hint(value)}
    </span>
{/if}

<style lang="scss">
    @use 'theme';

    .input {
        width: 100%;
        position: relative;
        border-bottom: 2px solid black;
        margin: 2rem auto 1rem;
        transition: all 500ms, margin 0ms;
        height: 1.5rem;

        &.textarea {
            height: auto;
        }

        &.input-span-shown {
            margin: 2rem auto 0rem;
        }

        &.input-disabled {
            border-bottom-style: dotted;
            opacity: 0.7;
        }

        &.input-invalid {
            border-bottom-color: var(
                --theme-error-colour,
                #{theme.$error-colour}
            ) !important;

            & > label {
                color: var(--theme-error-colour, #{theme.$error-colour});
            }
        }

        &::after {
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
            transition: transform 500ms ease;
            top: 2px;
        }

        &:focus-within {
            border-color: transparent;

            &::after {
                transform: scaleX(1);
                opacity: 1;
            }
        }

        & > .input-input {
            outline: none;
            border: none;
            overflow: hidden;
            margin: 0;
            width: 100%;
            background: none;
            color: black;
            transition: border 500ms;

            &:invalid,
            &:-moz-submit-invalid,
            &:-moz-ui-invalid {
                box-shadow: none;
            }
        }

        & > textarea {
            resize: vertical;
            overflow: auto !important;
        }

        & > label {
            color: black;
            z-index: -1;
            position: absolute;
            transform: translateY(-2rem);
            transform-origin: top left;
            transition: transform 400ms;
            left: 0;
            top: 2rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            height: fit-content;
        }

        &:focus-within > label,
        & > .input-input:not(:placeholder-shown) + label {
            transform: scale(0.8) translateY(-4rem);
            opacity: 1;
            color: #646464;
        }

        .max-length {
            position: absolute;
            right: 0;
            bottom: -1.25rem;
        }
    }

    .input-hint-text,
    .input-error-text {
        font-size: 0.9rem;

        &.has-max-length {
            display: block;
            max-width: 70%;
        }
    }

    .input-error-text {
        color: var(--theme-error-colour, #{theme.$error-colour});
    }
</style>
