<script lang="ts">
    import { setContext } from 'svelte'
    import { createStyle } from '@splitflow/designer'
    import { ChartModule, createBarChartModule } from '../../module'
    import Legend from './Legend.svelte'
    import Chart from './Chart.svelte'

    export let module = createBarChartModule({})

    setContext(ChartModule, module)

    const style = createStyle('BarChart', module.designer)
</script>

<section class={`sf-css-reset ${style.root()}`}>
    <Chart />
    <Legend />
</section>
