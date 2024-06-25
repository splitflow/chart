<script lang="ts">
    import type { ScaleLinear } from 'd3-scale'
    import { area, curveCardinal, line } from 'd3-shape'
    import { getContext } from 'svelte'
    import { createConfig, createStyle } from '@splitflow/designer'
    import { number } from '@splitflow/core/definition'
    import { X, Y } from '../../line-chart'
    import { ChartModule } from '../../module'

    export let group: Record<string, [number, number][]>
    export let xScale: ScaleLinear<number, number>
    export let yScale: ScaleLinear<number, number>

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Area', module.designer)
    const config = createConfig('Area', module.designer)

    const MIN = 0

    const tensionDef = number({ min: 0, max: 100, step: 5, unit: '%', nullable: true })

    $: areaPath = area(
        (d) => xScale(d[X]),
        yScale.range()[MIN],
        (d) => yScale(d[Y])
    ).curve(curveCardinal.tension($config.area.tension(5, tensionDef) / 100))

    $: linePath = line(
        (d) => xScale(d[X]),
        (d) => yScale(d[Y])
    ).curve(curveCardinal.tension($config.area.tension(5, tensionDef) / 100))
</script>

{#if group}
    <g class={style.root$svg()}>
        {#each Object.values(group) as series, index}
            {#if $config.line.enabled()}
                <path
                    class={style.line$svg({ [`series${index + 1}`]: true })}
                    d={linePath(series)}
                    fill="none"
                />
            {/if}
            <path class={style.area$svg({ [`series${index + 1}`]: true })} d={areaPath(series)} />
        {/each}
    </g>
{/if}
