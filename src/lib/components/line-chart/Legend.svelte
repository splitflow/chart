<svelte:options immutable />

<script lang="ts">
    import { isNotEmpty } from '@splitflow/core/utils'
    import { createConfig, createStyle } from '@splitflow/designer'
    import { getContext } from 'svelte'
    import { ChartModule } from '../../module'

    const module = getContext<ChartModule>(ChartModule)

    const { chart } = module.stores

    const style = createStyle('Legend', module.designer)
    const config = createConfig('Legend', module.designer)

    $: groups = Object.values($chart)
</script>

{#if $config.root.enabled() && isNotEmpty(groups)}
    <menu class={style.root()}>
        {#each groups as group}
            {#each Object.keys(group) as seriesName, index}
                <li class={style.series()}>
                    <i class={style.marker({ [`series${index + 1}`]: true })} />
                    <span class={style.name()}>{seriesName}</span>
                </li>
            {/each}
        {/each}
    </menu>
{/if}
