<script lang="ts">
    import { scaleBand, type ScaleBand, type ScaleLinear } from 'd3-scale'
    import { getContext } from 'svelte'
    import { createStyle, createConfig } from '@splitflow/designer'
    import { number } from '@splitflow/core/definition'
    import { ChartModule } from '../../module'

    export let group: Record<string, Record<string, number>>
    export let nameScale: ScaleBand<string>
    export let valueScale: ScaleLinear<number, number>

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Bar', module.designer)
    const config = createConfig('Bar', module.designer)

    const spacingDef = number({ min: 0, max: 100, step: 5, unit: '%', nullable: true })
    const radiusDef = number({ min: 0, max: 50, step: 5, unit: 'px', nullable: true })

    $: groupSpacing = $config.root.groupSpacing(undefined, spacingDef) ?? 10
    $: barSpacing = $config.root.barSpacing(undefined, spacingDef) ?? 10

    $: _nameScale = nameScale.paddingInner(groupSpacing / 100).paddingOuter(groupSpacing / 2 / 100)

    $: seriesScale = scaleBand(Object.keys(group), [0, _nameScale.bandwidth()])
        .paddingInner(barSpacing / 100)
        .paddingOuter(barSpacing / 2 / 100)
</script>

{#each _nameScale.domain() as name}
    <g class={style.root$svg()} transform="translate({_nameScale(name)}, 0)">
        {#each Object.entries(group) as [seriesName, series], index}
            {#if series[name]}
                <rect
                    class={style.bar$svg({ [`series${index + 1}`]: true })}
                    x={seriesScale(seriesName)}
                    y={valueScale(series[name])}
                    height={valueScale(0) - valueScale(series[name])}
                    width={seriesScale.bandwidth()}
                    rx={$config.bar.cornerRadius(undefined, radiusDef)}
                />
            {/if}
        {/each}
    </g>
{/each}
