<svelte:options immutable />

<script lang="ts">
    import { setContext } from 'svelte'
    import { createStyle } from '@splitflow/designer'
    import { ChartModule, createPieChartModule } from '../../module'
    import { list } from '../../pie-chart'
    import { firstSeries } from '../../stores/chart'
    import Pie from './Pie.svelte'
    import Legend from './Legend.svelte'

    export let module = createPieChartModule({})

    setContext(ChartModule, module)

    const style = createStyle('PieChart', module.designer)

    const { chart } = module.stores

    $: series = list(firstSeries($chart.pie))
</script>

<section class={`sf-css-reset ${style.root()}`}>
    {#if series}
        <Pie {series} />
        <Legend {series} />
    {/if}
</section>
