<svelte:options immutable />

<script lang="ts">
    import { createConfig, createStyle } from '@splitflow/designer'
    import { NAME, VALUE } from '../../pie-chart'
    import { ChartModule } from '../../module'
    import { getContext } from 'svelte'

    export let series: [string, number][]

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Legend', module.designer)
    const config = createConfig('Legend', module.designer)
</script>

{#if $config.root.enabled()}
    <menu class={style.root()}>
        {#each series as data, index}
            <li class={style.data()}>
                <i class={style.marker({ [`slice${index + 1}`]: true })} />
                <span class={style.name()}>{data[NAME]}</span>
                <span class={style.value()}>{data[VALUE]}</span>
            </li>
        {/each}
    </menu>
{/if}
