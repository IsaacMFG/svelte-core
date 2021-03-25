<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';

    // Types.
    type FileEvent = Event & {
        currentTarget: EventTarget & HTMLInputElement;
    };

    type FileDragEvent = DragEvent & {
        currentTarget: EventTarget & HTMLDivElement;
    };

    // Exported variables.
    export let multiple: boolean = false;
    export let duplicates: boolean = false;
    export let dragAndDrop: boolean = false;
    export let dragging: boolean = false;
    export let accept: string = null;
    export let maxSize: number = null;
    export let files: File[] = [];

    // Reactives.
    $: acceptArray = accept.split(',');

    // Variables.
    const dispatch = createEventDispatcher();
    let input: HTMLInputElement;
    let dragAndDropElement: HTMLDivElement;

    // Functions.
    const onFile = (event: FileEvent | File[]) => {
        dragging = false;

        // Get the files and reset the input value.
        const currentFiles =
            event instanceof Event
                ? event.currentTarget.files
                    ? [...event.currentTarget.files]
                    : []
                : event;
        input.value = '';

        // If no files.
        if (!currentFiles.length) return;

        let pushed: File[] = [];

        if (!multiple) {
            // If invalid.
            if (!validFile(currentFiles[0])) return;

            // If not multiple and already something in files, replace it.
            files = [currentFiles[0]];
            pushed.push(currentFiles[0]);
        } else {
            // If multiple and not already in the files (or duplicate enabled), append.
            for (let i = 0; i < currentFiles.length; i++) {
                const file = currentFiles[i];

                // If no duplicates and is a duplicate or is too big.
                if (!validFile(file)) continue;

                // Append.
                files[files.length] = file;
                pushed.push(file);
            }
        }

        // If any were pushed, dispatch.
        if (pushed.length) dispatch('input', { files: pushed });
    };

    const onDrop = (event: FileDragEvent) => {
        const droppedFiles =
            event.dataTransfer.files && event.dataTransfer.files.length
                ? [...event.dataTransfer.files]
                : [...event.dataTransfer.items]
                      .filter((i) => i.type === 'file')
                      .map((i) => i.getAsFile());

        onFile(droppedFiles);
    };

    const validFile = (file: File) => {
        // For both.
        const tooBig = isTooBig(file);
        const valid = acceptArray.includes(file.type);

        // If not multiple.
        if (!multiple) return !tooBig && valid;

        // If multiple.
        return (duplicates || !isDuplicate(file)) && !tooBig && valid;
    };

    const isDuplicate = (file: File) => {
        return !!files.find((f) => f.name === file.name);
    };

    const isTooBig = (file: File) => {
        // If no max.
        if (!maxSize) return false;

        // Calculate.
        return file.size > maxSize;
    };
</script>

<div class="container">
    <input
        type="file"
        {multiple}
        {accept}
        bind:this={input}
        on:input={onFile}
    />

    {#if dragAndDrop}
        <div
            class="drag-and-drop"
            class:dragging
            bind:this={dragAndDropElement}
            on:drop|preventDefault|stopPropagation={onDrop}
            on:dragover|preventDefault|stopPropagation={() => (dragging = true)}
            on:dragenter|preventDefault|stopPropagation={() =>
                (dragging = true)}
            on:dragleave|preventDefault|stopPropagation={() =>
                (dragging = false)}
            on:dragend|preventDefault|stopPropagation={() => (dragging = false)}
            on:drag|preventDefault|stopPropagation={() => {}}
            on:dragstart|preventDefault|stopPropagation={() => {}}
            on:click={() => input.click()}
        >
            <slot name="drag-and-drop">
                <div class="inner pe">
                    {#if dragging}
                        <div>
                            <span>Drop to Add File(s)</span>
                        </div>
                    {:else}
                        <div>
                            <span class="choose">Choose a file</span>
                            &nbsp;or drag here.
                        </div>
                    {/if}
                </div>
            </slot>
        </div>
    {:else}
        <slot name="button">
            <Button on:click={() => input.click()}>
                Select File{multiple ? 's' : ''}
            </Button>
        </slot>
    {/if}

    <slot name="files" />
</div>

<style lang="scss">
    @use 'theme';

    .container {
        position: relative;

        input[type='file'] {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }

        .drag-and-drop {
            cursor: pointer;

            *:not(.pe) {
                pointer-events: none;
            }

            &.dragging {
                .inner {
                    background: rgba(128, 128, 128, 0.3);
                }
            }

            .inner {
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid black;
                padding: 4rem 8rem;
                font-size: 1.2rem;

                @media screen and (max-width: 530px) {
                    padding: 2rem 4rem !important;

                    & > div {
                        flex-direction: column;
                    }
                }

                & > div {
                    display: flex;

                    & > .choose {
                        color: var(--theme-primary, #{theme.$primary});

                        &::after {
                            content: '';
                            position: relative;
                            display: block;
                            height: 2px;
                            width: 100%;
                            background: var(--theme-primary, #{theme.$primary});
                            transform: scaleX(0);
                            transform-origin: top left;
                            transition: transform 250ms ease;
                        }
                    }
                }

                &:hover > div > .choose::after {
                    transform: scaleX(1);
                    opacity: 1;
                }
            }
        }
    }
</style>
