<svelte:options immutable />

<script lang="ts">
    import { pie, arc } from 'd3-shape'
    import { getContext } from 'svelte'
    import { createConfig, createStyle } from '@splitflow/designer'
    import { number } from '@splitflow/core/definition'
    import { VALUE } from '../../pie-chart'
    import { perc, toRad } from '../../utils'
    import { ChartModule } from '../../module'

    export let series: [string, number][]

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Pie', module.designer)
    const config = createConfig('Pie', module.designer)

    const padAngleDef = number({ min: 0, max: 360, step: 5, unit: '°', nullable: true })
    const startEndAngleDef = number({ min: -360, max: 360, step: 5, unit: '°', nullable: true })
    const cornerRadiusDef = number({ min: 0, max: 100, step: 1, unit: 'px', nullable: true })
    const inOutRadiusDef = number({ min: 0, max: 100, step: 5, unit: '%', nullable: true })

    let width = 0
    let height = 0

    $: maxRadius = Math.min(width, height) / 2

    $: _pie = pie<[string, number]>()
        .value((d) => d[VALUE])
        .padAngle(toRad($config.root.padAngle(undefined, padAngleDef) ?? 0))
        .startAngle(toRad($config.root.startAngle(undefined, startEndAngleDef) ?? 0))
        .endAngle(toRad($config.root.endAngle(undefined, startEndAngleDef) ?? 360))

    $: _arc = arc()
        .innerRadius(perc($config.root.innerRadius(undefined, inOutRadiusDef) ?? 0, maxRadius))
        .outerRadius(perc($config.root.outerRadius(undefined, inOutRadiusDef) ?? 100, maxRadius))
        .cornerRadius($config.root.cornerRadius(undefined, cornerRadiusDef) ?? 0)
</script>

<div
    class={style.root()}
    style="display: flex; min-height: 100px; min-width: 100px;"
    bind:clientWidth={width}
    bind:clientHeight={height}
>
    {#if width}
        <svg style="flex: 1;">
            <g transform={`translate(${width / 2}, ${height / 2})`}>
                {#each _pie(series) as slice, index}
                    <path
                        class={style.slice$svg({ [`slice${index + 1}`]: true })}
                        d={_arc(slice)}
                    />
                {/each}
            </g>
        </svg>
    {/if}
</div>