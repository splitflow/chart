<svelte:options immutable />

<script lang="ts">
    import { scaleLinear } from 'd3-scale'
    import { getContext } from 'svelte'
    import { createConfig, createStyle } from '@splitflow/designer'
    import { ChartModule } from '../../module'
    import { consolidate, consolidateZ, domain, domainZ, list, listZ, X, Y } from '../../line-chart'
    import { map } from '../../utils'
    import Scale from './Scale.svelte'
    import Line from './Line.svelte'
    import Area from './Area.svelte'
    import Bar from './Bar.svelte'
    import Bubble from './Bubble.svelte'
    import { number } from '@splitflow/core/definition'

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Chart', module.designer)
    const config = createConfig('Chart', module.designer)

    const paddingDef = number({
        min: 0,
        max: 100,
        step: 5,
        precision: 1,
        unit: 'px',
        nullable: true
    })

    const { chart } = module.stores

    let width = 0
    let height = 0

    $: paddingLeft = $config.root.paddingLeft(undefined, paddingDef) ?? 30
    $: paddingRight = $config.root.paddingRight(undefined, paddingDef) ?? 0
    $: paddingTop = $config.root.paddingTop(undefined, paddingDef) ?? 0
    $: paddingBottom = $config.root.paddingBottom(undefined, paddingDef) ?? 30

    $: lineGroup = map($chart.line, list)
    $: areaGroup = map($chart.area, list)
    $: barGroup = map($chart.bar, list)
    $: bubbleGroup = map($chart.bubble, listZ)

    $: lineDomain = consolidate(map(lineGroup, domain))
    $: areaDomain = consolidate(map(areaGroup, domain))
    $: barDomain = consolidate(map(barGroup, domain))
    $: bubbleDomain = consolidateZ(map(bubbleGroup, domainZ))
    $: chartDomain = consolidate([lineDomain, areaDomain, barDomain, bubbleDomain])

    $: xScale = chartDomain
        ? scaleLinear(chartDomain[X], [paddingLeft, width - paddingRight])
        : undefined
    $: yScale = chartDomain
        ? scaleLinear(chartDomain[Y], [height - paddingBottom, paddingTop])
        : undefined
</script>

{#if chartDomain}
    <div
        class={style.root()}
        style="display: flex; min-height: 100px; min-width: 100px;"
        bind:clientWidth={width}
        bind:clientHeight={height}
    >
        <svg style="flex: 1;">
            <Scale {height} {xScale} {yScale} />
            <Line group={lineGroup} {xScale} {yScale} />
            <Area group={areaGroup} {xScale} {yScale} />
            <Bar group={barGroup} {xScale} {yScale} />
            <Bubble group={bubbleGroup} domain={bubbleDomain} {xScale} {yScale} />
        </svg>
    </div>
{/if}
