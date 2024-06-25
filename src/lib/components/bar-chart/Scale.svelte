<script lang="ts">
    import type { ScaleBand, ScaleLinear } from 'd3-scale'
    import { getContext } from 'svelte'
    import { createConfig, createStyle } from '@splitflow/designer'
    import { enumeration, number } from '@splitflow/core/definition'
    import { bar, barY } from '../../shape'
    import { anchor } from '../../utils'
    import { ChartModule } from '../../module'

    export let height: number
    export let nameScale: ScaleBand<string>
    export let valueScale: ScaleLinear<number, number>

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Scale', module.designer)
    const config = createConfig('Scale', module.designer)

    const MIN = 0
    const MAX = 1

    const offsetDef = number({ min: -100, max: 100, step: 5, unit: 'px', nullable: true })
    const anchorDef = enumeration(['start', 'center', 'end'])

    $: valueTicks = valueScale.ticks()

    $: xGridPath = bar<string>(
        (l) => nameScale(l),
        valueScale.range()[MIN],
        (d) => valueScale.range()[MAX]
    )

    $: yGridPath = barY<number>(
        (v) => valueScale(v),
        nameScale.range()[MIN],
        (d) => nameScale.range()[MAX]
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
            <path class={style.grid$svg({ xAxis: true })} d={xGridPath(nameScale.domain())} />
            <path class={style.grid$svg({ yAxis: true })} d={yGridPath(valueTicks)} />
        {/if}
        {#if $config.axis.enabled()}
            <line
                class={style.axis$svg({ xAxis: true })}
                x1={nameScale.range()[MIN]}
                x2={nameScale.range()[MAX]}
                y1={valueScale.range()[MIN]}
                y2={valueScale.range()[MIN]}
            />
            <line
                class={style.axis$svg({ yAxis: true })}
                x1={nameScale.range()[MIN]}
                x2={nameScale.range()[MIN]}
                y1={valueScale.range()[MIN]}
                y2={valueScale.range()[MAX]}
            />
        {/if}
        {#if $config.labelXAxis.enabled()}
            {#each nameScale.domain() as name}
                <text
                    class={style.label$svg({ xAxis: true })}
                    x={xLabelXAnchor(nameScale(name), nameScale(name) + nameScale.bandwidth())}
                    y={xLabelYAnchor(valueScale.range()[MIN], height)}
                >
                    {name}
                </text>
            {/each}
        {/if}
        {#if $config.labelYAxis.enabled()}
            {#each valueTicks as tick}
                <text
                    class={style.label$svg({ yAxis: true })}
                    x={yLabelXAnchor(0, nameScale.range()[MIN])}
                    y={yLabelYAnchor(valueScale(tick))}
                >
                    {tick}
                </text>
            {/each}
        {/if}
    </g>
{/if}
