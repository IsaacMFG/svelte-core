<script lang="ts">
    let headerTop: HTMLDivElement;
    let headerBottom: HTMLDivElement;
    let imgContainer: HTMLDivElement;
    let headerExpanded: boolean = false;
    let ul: HTMLUListElement;
    let innerWidth: number;
    let scrollY: number;

    $: if (headerExpanded) onResize();

    const onResize = () => {
        if (innerWidth > 1150) return;

        // Get the top header height.
        const headerTopHeight = headerTop.getBoundingClientRect().height;

        // Get the img height.
        const imgHeight = imgContainer.getBoundingClientRect().height;

        // Set the UL to be based on their heights.
        ul.style.top = `${headerTopHeight + imgHeight + 30}px`;
    };
</script>

<svelte:window bind:innerWidth bind:scrollY on:resize={onResize} />

<header>
    <div class="header-top" class:scrolled={scrollY > 0} bind:this={headerTop}>
        <div class="header-top-container">
            <p>
                <a href="https://www.maritimefun.com/about-us"> About Us </a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="https://www.maritimefun.com/join-our-team">
                    Join Our Team
                </a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="https://www.maritimefun.com/mfg-in-the-community">
                    MFG In The Community
                </a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="https://www.maritimefun.com/contact"> Contact Us </a>
            </p>
        </div>
    </div>

    <div
        class="header-bottom"
        class:scrolled={scrollY > 0}
        class:header-expanded={headerExpanded}
        bind:this={headerBottom}
    >
        <div class="header-bottom-container">
            {#if innerWidth <= 1150}
                <div
                    class="header-hamburger block"
                    on:click={() => (headerExpanded = !headerExpanded)}
                >
                    <i class="material-icons">dehaze</i>
                </div>
            {/if}
            <div class="header-img" bind:this={imgContainer}>
                <a href="https://www.maritimefun.com">
                    <img src="images/logo.png" alt="Logo" />
                </a>
            </div>
            <div class="flex-1" />
            <ul bind:this={ul}>
                <li>
                    <a href="https://www.maritimefun.com/properties">
                        <span>
                            Properties
                            <span class="header-underline" />
                        </span>
                    </a>
                </li>
                <li>
                    <a href="https://store.maritimefun.com">
                        <span>
                            Buy Passes
                            <span class="header-underline" />
                        </span>
                    </a>
                </li>
                <li>
                    <a href="https://www.maritimefun.com/whats-new">
                        <span>
                            What's New
                            <span class="header-underline" />
                        </span>
                    </a>
                </li>
                <li>
                    <a href="https://www.maritimefun.com/family-fun-blog">
                        <span>
                            Family Fun Blog
                            <span class="header-underline" />
                        </span>
                    </a>
                </li>
                <li>
                    <a href="https://www.maritimefun.com/jobs">
                        <span>
                            Jobs
                            <span class="header-underline" />
                        </span>
                    </a>
                </li>
                <li>
                    <a href="https://www.maritimefun.com/groups">
                        <span>
                            Groups
                            <span class="header-underline" />
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</header>

<style lang="scss">
    @use 'theme';

    .flex-1 {
        flex-grow: 1;
    }

    .block {
        display: block !important;
    }

    header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        font-size: 16px;
        overflow: hidden;
        max-width: 100vw;

        .header-top {
            padding: 0;
            opacity: 1;
            transition: all 200ms ease;
            background-color: var(
                --theme-primary,
                #{theme.$primary}
            ) !important;

            &.scrolled {
                height: 0 !important;
                opacity: 0 !important;

                .header-top-container p {
                    pointer-events: none;
                }
            }

            .header-top-container {
                padding: 0 80px;
                margin: auto;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                & > p {
                    font-weight: 800;
                    color: white;
                    margin: 0;
                    letter-spacing: -1px;
                    line-height: 33px;

                    a {
                        color: white;
                        text-decoration: none;
                        letter-spacing: -0.75px;
                        font-weight: 600;
                        cursor: pointer;
                    }
                }
            }
        }

        .header-bottom {
            height: 100px;
            padding: 0 80px;
            transition: all 200ms ease;
            background-color: var(
                --theme-secondary,
                #{theme.$secondary}
            ) !important;

            &.scrolled {
                height: 60px;
                background-color: var(
                    --theme-primary,
                    #{theme.$primary}
                ) !important;

                .header-bottom-container {
                    .header-img {
                        height: 54px;
                    }
                }
            }

            .header-bottom-container {
                display: flex;
                height: 100%;

                .header-hamburger {
                    display: none;
                    color: white;
                    user-select: none;
                    cursor: pointer;
                    margin: auto 30px auto 0;
                    align-self: center;

                    & > i {
                        display: block;
                    }
                }

                .header-img {
                    height: 90px;
                    margin: auto 0;
                    width: fit-content;
                    transition: height 200ms ease, margin 200ms ease 150ms;

                    img {
                        height: 100%;
                        width: auto;
                        object-fit: contain;
                    }
                }

                & > ul {
                    list-style-type: none;
                    color: white;
                    margin: 0;
                    padding: 0;
                    align-self: center;
                    display: flex;
                    height: 100%;
                    transition: visibility 250ms;

                    li {
                        height: 100%;

                        &:hover a span {
                            opacity: 0.8;

                            .header-underline {
                                opacity: 1;
                            }
                        }

                        a {
                            color: white;
                            margin: 0 0 0 20px;
                            text-decoration: none;
                            font-size: 21px;
                            font-weight: 800;
                            letter-spacing: -1px;
                            display: flex;
                            height: 100%;
                            flex-direction: column;
                            justify-content: center;

                            span {
                                position: relative;
                                opacity: 1;
                                transition: opacity 300ms ease;

                                .header-underline {
                                    opacity: 0;
                                    background-color: white;
                                    position: absolute;
                                    bottom: -50%;
                                    left: 50%;
                                    transform: translate(-50%);
                                    width: 100%;
                                    height: 3px;
                                    transition: opacity 300ms ease;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    @media screen and (max-width: 1150px) and (min-width: 385px) {
        .header-bottom.header-expanded .header-bottom-container {
            .header-img {
                height: 90px !important;
                margin: 5px 0 !important;
            }

            .header-hamburger {
                margin: 45px 30px auto 0 !important;
            }
        }
    }

    @media screen and (max-width: 1150px) {
        .header-bottom {
            &.header-expanded {
                height: 23rem !important;

                &.scrolled .header-bottom-container > ul {
                    top: 35%;
                }

                .header-bottom-container {
                    & > ul {
                        display: flex !important;
                        left: 60px;
                        visibility: visible;
                    }
                }
            }

            .header-bottom-container {
                & > ul {
                    flex-direction: column;
                    position: absolute;
                    visibility: hidden;

                    li {
                        height: auto !important;
                        margin: 0 0 10px 0;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 520px) {
        .header-bottom,
        .header-top .header-top-container {
            padding: 0 15px !important;
        }
    }

    @media screen and (max-width: 385px) {
        .header-bottom:not(.scrolled) {
            .header-img {
                height: 70px !important;
                margin: 15px 0 !important;
            }

            .header-hamburger {
                margin: 45px 30px auto 0 !important;
            }
        }

        .header-bottom.scrolled.header-expanded {
            .header-img {
                margin: 3px 0 !important;
            }

            .header-hamburger {
                margin: 18px 30px auto 0 !important;
            }
        }
    }
</style>
