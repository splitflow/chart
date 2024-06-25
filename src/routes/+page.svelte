<script lang="ts">
    import '@splitflow/css-reset'
    import { createSplitflowApp } from '@splitflow/app'
    import { createBarChartModule, createLineChartModule, createPieChartModule } from '$lib/module'
    import { createDatasourceModule } from '$lib/datasource-module'
    import LineChart from '$lib/components/line-chart/LineChart.svelte'
    import PieChart from '$lib/components/pie-chart/PieChart.svelte'
    import BarChart from '$lib/components/bar-chart/BarChart.svelte'
    import theme from './assets/theme.json'
    import pieChartStyle from './assets/pie-chart/style.json'
    import pieChartConfig from './assets/pie-chart/config.json'
    import barChartStyle from './assets/bar-chart/style.json'
    import barChartConfig from './assets/bar-chart/config.json'
    import lineChartStyle from './assets/line-chart/style.json'
    import lineChartConfig from './assets/line-chart/config.json'
    import {
        barChartSampleDatasource,
        barChartSampleDefinition,
        lineChartSampleDatasource,
        lineChartSampleDefinition,
        pieChartSampleDatasource,
        pieChartSampleDefinition
    } from '$lib'
    import { createTheme } from '@splitflow/designer'

    const browser = typeof document !== 'undefined'

    let lineChartId: string
    let barChartId: string
    let pieChartId: string
    if (browser) {
        lineChartId = localStorage.getItem('line-chart-id')
        barChartId = localStorage.getItem('bar-chart-id')
        pieChartId = localStorage.getItem('pie-chart-id')
        if (!lineChartId) {
            lineChartId = crypto.randomUUID()
            localStorage.setItem('line-chart-id', lineChartId)
            localStorage.setItem(
                `sf/accounts/_/pods/${lineChartId}/style.json`,
                JSON.stringify(lineChartStyle)
            )
            localStorage.setItem(
                `sf/accounts/_/pods/${lineChartId}/config.json`,
                JSON.stringify(lineChartConfig)
            )
        }
        if (!barChartId) {
            barChartId = crypto.randomUUID()
            localStorage.setItem('bar-chart-id', barChartId)
            localStorage.setItem(
                `sf/accounts/_/pods/${barChartId}/style.json`,
                JSON.stringify(barChartStyle)
            )
            localStorage.setItem(
                `sf/accounts/_/pods/${barChartId}/config.json`,
                JSON.stringify(barChartConfig)
            )
        }
        if (!pieChartId) {
            pieChartId = crypto.randomUUID()
            localStorage.setItem('pie-chart-id', pieChartId)
            localStorage.setItem(
                `sf/accounts/_/pods/${pieChartId}/style.json`,
                JSON.stringify(pieChartStyle)
            )
            localStorage.setItem(
                `sf/accounts/_/pods/${pieChartId}/config.json`,
                JSON.stringify(pieChartConfig)
            )
        }

        localStorage.setItem(`sf/accounts/_/theme.json`, JSON.stringify(theme))
    }

    const app = createSplitflowApp({ devtool: true, local: true })
    const lightTheme = createTheme('Light', app.designer)

    const lineChartDatasourceModule = createDatasourceModule(
        { datasourceName: 'LineChartSample' },
        app
    )
    const barChartDatasourceModule = createDatasourceModule(
        { datasourceName: 'BarChartSample' },
        app
    )
    const pieChartDatasourceModule = createDatasourceModule(
        { datasourceName: 'PieChartSample' },
        app
    )

    const lineChartModule = createLineChartModule({ moduleId: lineChartId }, app)
    const barChartModule = createBarChartModule({ moduleId: barChartId }, app)
    const pieChartModule = createPieChartModule({ moduleId: pieChartId }, app)

    const promise = (async () => {
        const { error: error0 } = await app.initialize()
        if (error0) return { error: error0 }

        const { error: error1 } = await lineChartModule.initialize()
        if (error1) return { error: error1 }

        const { error: error2 } = await barChartModule.initialize()
        if (error2) return { error: error2 }

        const { error: error3 } = await pieChartModule.initialize()
        if (error3) return { error: error3 }

        lineChartDatasourceModule.updateDatasource(lineChartSampleDatasource)
        lineChartModule.updateDefinition(lineChartSampleDefinition)

        barChartDatasourceModule.updateDatasource(barChartSampleDatasource)
        barChartModule.updateDefinition(barChartSampleDefinition)

        pieChartDatasourceModule.updateDatasource(pieChartSampleDatasource)
        pieChartModule.updateDefinition(pieChartSampleDefinition)

        return {}
    })()
</script>

{#await promise then { error }}
    {#if error}
        {error.message}
    {:else}
        <main class={lightTheme()}>
            <div>
                <LineChart module={lineChartModule} />
            </div>
            <div>
                <BarChart module={barChartModule} />
            </div>
            <div>
                <PieChart module={pieChartModule} />
            </div>
        </main>
    {/if}
{/await}

<style>
    :global(body) {
        margin: 0;
        background-color: lightgray;
    }

    main {
        all: unset;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding-top: 4rem;
        padding-bottom: 4rem;
        padding-left: 4rem;
        padding-right: 4rem;
        box-sizing: border-box;
        font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
        font-size: 16px;
        font-weight: 400;
    }

    div {
        all: unset;
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        border-radius: 0.5rem;
        min-height: 400px;
    }
</style>
