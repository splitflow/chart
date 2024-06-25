<script lang="ts">
    import { scaleBand, scaleLinear } from 'd3-scale'
    import { getContext } from 'svelte'
    import { createConfig, createStyle } from '@splitflow/designer'
    import { consolidate, domain as _domain, NAME, VALUE, mapSerie } from '../../bar-chart'
    import { ChartModule } from '../../module'
    import { map } from '../../utils'
    import Bar from './Bar.svelte'
    import { number } from '@splitflow/core/definition'
    import Scale from './Scale.svelte'

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Chart', module.designer)
    const config = createConfig('Chart', module.designer)

    const paddingDef = number({ min: 0, max: 300, step: 5, unit: 'px', nullable: true })

    let width = 500
    let height = 200

    const { chart } = module.stores

    $: paddingLeft = $config.root.paddingLeft(undefined, paddingDef) ?? 30
    $: paddingRight = $config.root.paddingRight(undefined, paddingDef) ?? 0
    $: paddingTop = $config.root.paddingTop(undefined, paddingDef) ?? 0
    $: paddingBottom = $config.root.paddingBottom(undefined, paddingDef) ?? 30

    $: group = map($chart.bar, mapSerie)
    $: domain = consolidate(map(group, _domain))

    $: nameScale = domain ? scaleBand(domain[NAME], [paddingLeft, width - paddingRight]) : undefined
    $: valueScale = domain
        ? scaleLinear([0, domain[VALUE][1]], [height - paddingBottom, paddingTop])
        : undefined
</script>

{#if domain}
    <div
        class={style.root()}
        style="display: flex; min-height: 100px; min-width: 100px;"
        bind:clientWidth={width}
        bind:clientHeight={height}
    >
        <svg style="flex: 1;">
            <Scale {height} {nameScale} {valueScale} />
            <Bar {group} {nameScale} {valueScale} />
        </svg>
    </div>
{/if}
