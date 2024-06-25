<svelte:options immutable />

<script lang="ts">
    import type { ScaleLinear } from 'd3-scale'
    import { getContext } from 'svelte'
    import { createStyle } from '@splitflow/designer'
    import { X, Y } from '../../line-chart'
    import { bar } from '../../shape'
    import { ChartModule } from '../../module'

    export let group: Record<string, [number, number][]>
    export let xScale: ScaleLinear<number, number>
    export let yScale: ScaleLinear<number, number>

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Bar', module.designer)

    const MIN = 0

    $: path = bar(
        (d) => xScale(d[X]),
        yScale.range()[MIN],
        (d) => yScale(d[Y])
    )
</script>

{#if group}
    <g class={style.root$svg()}>
        {#each Object.values(group) as series}
            <path class={style.bar$svg()} d={path(series)} />
        {/each}
    </g>
{/if}
