<script lang="ts">
    import { scaleLinear, type ScaleLinear } from 'd3-scale'
    import { getContext } from 'svelte'
    import { createConfig, createStyle } from '@splitflow/designer'
    import { number } from '@splitflow/core/definition'
    import { X, Y, Z } from '../../line-chart'
    import { dot } from '../../shape'
    import { ChartModule } from '../../module'

    export let group: Record<string, [number, number, number][]>
    export let domain: [[number, number], [number, number], [number, number]]
    export let xScale: ScaleLinear<number, number>
    export let yScale: ScaleLinear<number, number>

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Bubble', module.designer)
    const config = createConfig('Bubble', module.designer)

    const radiusDef = number({ min: 0, max: 100, step: 5, unit: 'px', nullable: true })

    $: zScale = domain
        ? scaleLinear(domain[Z], [
              $config.bubble.minRadius(10, radiusDef),
              $config.bubble.maxRadius(30, radiusDef)
          ])
        : undefined

    $: path = dot<[number, number, number]>(
        (d) => xScale(d[X]),
        (d) => yScale(d[Y]),
        (d) => zScale(d[Z])
    )
</script>

{#if group}
    <g class={style.root$svg()}>
        {#each Object.values(group) as series, index}
            <path class={style.bubble$svg({ [`series${index + 1}`]: true })} d={path(series)} />
        {/each}
    </g>
{/if}
