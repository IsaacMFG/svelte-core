<script lang="ts">
    import {
        Button,
        Checkbox,
        CheckSvg,
        Dialog,
        FileUpload,
        Input,
        Loading,
        Navbar,
        Progress,
        Select,
        Slider,
        Switch,
        css,
    } from '@maritime-fun-group/svelte-core';
    import * as yup from 'yup';

    const schema = yup.string().trim().required();
    const provinces = [
        { name: 'Prince Edward Island', abbreviation: 'PE' },
        { name: 'Alberta', abbreviation: 'AB' },
        { name: 'British Columbia', abbreviation: 'BC' },
        { name: 'Manitoba', abbreviation: 'MB' },
        { name: 'New Brunswick', abbreviation: 'NB' },
        { name: 'Newfoundland and Labrador', abbreviation: 'NL' },
        { name: 'Northwest Territories', abbreviation: 'NT' },
        { name: 'Nova Scotia', abbreviation: 'NS' },
        { name: 'Nunavut', abbreviation: 'NU' },
        { name: 'Ontario', abbreviation: 'ON' },
        { name: 'Quebec', abbreviation: 'QC' },
        { name: 'Saskatchewan', abbreviation: 'SK' },
        { name: 'Yukon Territory', abbreviation: 'YT' },
    ];

    let dialogA: Dialog;
    let files: File[];
    let inputAValue: string;
    let inputBValue: string;
    let loading: boolean = false;
    let progress: number = 50;
    let province: string;
</script>

<Navbar />

<main>
    <!-- Buttons -->
    <h1>Buttons</h1>

    <Button on:click={() => console.log('button clicked')}>
        <span use:css={{ test: 'test' }}>Test</span>
    </Button>
    <Button background="orange" hover="#9a6400">Test</Button>

    <!-- Checkboxes -->
    <h1>Checkboxes</h1>
    <Checkbox id="checkboxA">Checkbox A</Checkbox>

    <!-- CheckSVG -->
    <h1>CheckSVG</h1>
    <CheckSvg size={64} />
    <CheckSvg size={64} colour="red" />

    <!-- Dialogues -->
    <h1>Dialogues</h1>
    <div>
        <Dialog
            bodyClasses="complete-dialog-body"
            bind:this={dialogA}
            on:close={(e) => console.log(e.detail.value)}
        >
            <div class="complete-dialog">
                <h1>Application Submitted</h1>
                <p>
                    Your application has been successfully submitted. Please
                    note that only those selected for an audition will be
                    contacted.
                </p>

                <Button on:click={() => dialogA.close({ test: 'test' })}>
                    OK
                </Button>
            </div>
        </Dialog>
        <Button on:click={dialogA.open}>Open Dialog</Button>
    </div>

    <!-- File Upload -->
    <h1>File Upload</h1>
    <FileUpload
        multiple
        dragAndDrop
        maxSize={10 << 20}
        accept="application/pdf,image/png,image/jpeg"
        bind:files
    >
        <div class="files" slot="files">
            {#if files && files.length > 0}
                <h3>Chosen Files</h3>
                {#each files as file}
                    <p>
                        {file.name}
                        <span
                            on:click={() =>
                                (files = files.filter(
                                    (f) => f.name !== file.name
                                ))}
                        >
                            ×
                        </span>
                    </p>
                {/each}
            {/if}
        </div>
    </FileUpload>

    <!-- Inputs -->
    <h1>Inputs</h1>
    <div class="inputs">
        <div>
            <Input
                id="inputA"
                type="text"
                bind:value={inputAValue}
                placeholder="Input A"
                autocomplete="given-name"
                validation={schema}
                required
            />
        </div>
        <div>
            <Input
                textarea
                id="inputB"
                type="text"
                bind:value={inputBValue}
                placeholder="Input B"
                validation={schema}
                required
            />
        </div>
    </div>

    <!-- Loading -->
    <h1>Loading</h1>
    <div class="loading">
        <Loading bind:loading />
        <Button on:click={() => (loading = !loading)}>Toggle Loading</Button>
    </div>

    <!-- Progress -->
    <h1>Progress</h1>
    <div class="progress">
        <h1>Current Progress</h1>
        <Progress bind:progress text={true} textColor="white" />
    </div>

    <!-- Select -->
    <h1>Select</h1>
    <div class="inputs">
        <Select
            id="province"
            bind:value={province}
            placeholder="Province"
            options={provinces.map((p) => {
                return { text: p.name, value: p.abbreviation };
            })}
            required
        />
    </div>

    <!-- Slider -->
    <h1>Slider</h1>
    <Slider id="slider" min={1} max={6} />

    <!-- Switch -->
    <h1>Switch</h1>
    <div>
        <Switch id="switch">Switch Text</Switch>
    </div>
</main>

<style lang="scss">
    main {
        text-align: center;
        padding: 175px 1em 1em;
        max-width: 240px;
        margin: 0 auto;

        @media (min-width: 640px) {
            max-width: none;
        }
    }

    .inputs {
        text-align: initial;
    }

    .loading {
        position: relative;

        :global {
            :nth-child(2) {
                position: absolute;
                z-index: 1000000;
            }
        }
    }
</style>
