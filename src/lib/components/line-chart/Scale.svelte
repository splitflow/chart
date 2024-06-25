<script lang="ts">
    import type { ScaleLinear } from 'd3-scale'
    import { getContext } from 'svelte'
    import { createConfig, createStyle } from '@splitflow/designer'
    import { enumeration, number } from '@splitflow/core/definition'
    import { bar, barY } from '../../shape'
    import { anchor } from '../../utils'
    import { ChartModule } from '../../module'

    export let height: number
    export let xScale: ScaleLinear<number, number>
    export let yScale: ScaleLinear<number, number>

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Scale', module.designer)
    const config = createConfig('Scale', module.designer)

    const MIN = 0
    const MAX = 1

    const offsetDef = number({ min: -100, max: 100, step: 5, unit: 'px', nullable: true })
    const anchorDef = enumeration(['start', 'center', 'end'])

    $: xTicks = xScale.ticks(3)
    $: yTicks = yScale.ticks()

    $: xGridPath = bar<number>(
        (v) => xScale(v),
        yScale.range()[MIN],
        (d) => yScale.range()[MAX]
    )

    $: yGridPath = barY<number>(
        (v) => yScale(v),
        xScale.range()[MIN],
        (d) => xScale.range()[MAX]
    )

    $: xLabelXAnchor = anchor('center', $config.labelXAxis.offsetX(undefined, offsetDef))
    $: xLabelYAnchor = anchor(
        $config.labelXAxis.anchor('end', anchorDef),
        $config.labelXAxis.offsetY(undefined, offsetDef)
    )
    $: yLabelXAnchor = anchor(
        $config.labelYAxis.anchor('start', anchorDef),
        $config.labelYAxis.offsetX(undefined, offsetDef)
    )
    $: yLabelYAnchor = anchor('start', $config.labelYAxis.offsetY(undefined, offsetDef))
</script>

{#if $config.root.enabled()}
    <g class={style.root$svg()}>
        {#if $config.grid.enabled()}
            <path class={style.grid$svg({ xAxis: true })} d={xGridPath(xTicks.slice(1))} />
            <path class={style.grid$svg({ yAxis: true })} d={yGridPath(yTicks)} />
        {/if}
        {#if $config.axis.enabled()}
            <line
                class={style.axis$svg({ xAxis: true })}
                x1={xScale.range()[MIN]}
                x2={xScale.range()[MAX]}
                y1={yScale.range()[MIN]}
                y2={yScale.range()[MIN]}
            />
            <line
                class={style.axis$svg({ yAxis: true })}
                x1={xScale.range()[MIN]}
                x2={xScale.range()[MIN]}
                y1={yScale.range()[MIN]}
                y2={yScale.range()[MAX]}
            />
        {/if}
        {#if $config.labelXAxis.enabled()}
            {#each xTicks as tick}
                <text
                    class={style.label$svg({ xAxis: true })}
                    x={xLabelXAnchor(xScale(tick))}
                    y={xLabelYAnchor(yScale.range()[MIN], height)}
                >
                    {tick}
                </text>
            {/each}
        {/if}
        {#if $config.labelYAxis.enabled()}
            {#each yTicks as tick}
                <text
                    class={style.label$svg({ yAxis: true })}
                    x={yLabelXAnchor(0, xScale.range()[MIN])}
                    y={yLabelYAnchor(yScale(tick))}
                >
                    {tick}
                </text>
            {/each}
        {/if}
    </g>
{/if}
