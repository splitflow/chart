<svelte:options immutable />

<script lang="ts">
    import { setContext } from 'svelte'
    import { createStyle } from '@splitflow/designer'
    import { ChartModule, createLineChartModule } from '../../module'
    import Legend from './Legend.svelte'
    import Chart from './Chart.svelte'

    export let module = createLineChartModule({})

    setContext(ChartModule, module)

    const style = createStyle('LineChart', module.designer)
</script>

<section class={`sf-css-reset ${style.root()}`}>
    <Chart />
    <Legend />
</section>
