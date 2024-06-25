import {
    getDefaultApp,
    type Error,
    type Gateway,
    type SplitflowApp,
    type SplitflowAppKit
} from '@splitflow/app'
import {
    SplitflowDesigner,
    createDesigner,
    createDesignerKit,
    type SplitflowDesignerKit
} from '@splitflow/designer'
import { isChartBundle, type ChartBundle } from './loaders'
import type { ChartStore } from './stores/chart'
import createChartStore from './stores/chart'
import createChartDefStore, { type ChartDefNode, type ChartDefStore } from './stores/chart-def'
import { camelCase } from './utils'

export interface ChartConfig {
    accountId?: string
    moduleType?: 'line-chart' | 'bar-chart' | 'pie-chart'
    moduleName?: string
    moduleId?: string
    local?: boolean
}

export function createChartModule(init: ChartConfig | ChartBundle, app?: SplitflowApp) {
    app ??= getDefaultApp()

    const bundle = isChartBundle(init) ? init : undefined
    const config = isChartBundle(init)
        ? init.config
        : { ...app.config, moduleType: 'line-chart', moduleName: camelCase(init.moduleType ?? 'line-chart'), ...init } as ChartConfig

    const designer = createDesigner(
        bundle ?? { ...config, remote: true },
        undefined,
        undefined,
        app.designer
    )

    const { datasource } = app

    let chartDef: ChartDefStore
    const stores: Stores = {
        chartDef: chartDef = createChartDefStore(),
        chart: createChartStore(chartDef, datasource)
    }

    return new ChartModule(designer, stores, config, bundle)
}

export function createLineChartModule(init: ChartConfig | ChartBundle, app?: SplitflowApp) {
    if (isChartBundle(init)) {
        if (init.config.moduleType !== 'line-chart') throw new Error('inconsistent moduleType')
    } else {
        init = { ...init, moduleType: 'line-chart' }
    }

    return createChartModule(init, app)
}

export function createBarChartModule(init: ChartConfig | ChartBundle, app?: SplitflowApp) {
    if (isChartBundle(init)) {
        if (init.config.moduleType !== 'bar-chart') throw new Error('inconsistent moduleType')
    } else {
        init = { ...init, moduleType: 'bar-chart' }
    }

    return createChartModule(init, app)
}

export function createPieChartModule(init: ChartConfig | ChartBundle, app?: SplitflowApp) {
    if (isChartBundle(init)) {
        if (init.config.moduleType !== 'pie-chart') throw new Error('inconsistent moduleType')
    } else {
        init = { ...init, moduleType: 'pie-chart' }
    }

    return createChartModule(init, app)
}

interface Stores {
    chartDef: ChartDefStore
    chart: ChartStore
}

export class ChartModule {
    constructor(designer: SplitflowDesigner, stores: Stores, config: ChartConfig, bundle: ChartBundle) {
        this.designer = designer
        this.stores = stores
        this.config = config
        this.bundle = bundle
    }

    designer: SplitflowDesigner
    stores: Stores
    config: ChartConfig
    bundle: ChartBundle
    #initialize: Promise<{ chart?: ChartModule; error?: Error }>

    async initialize(): Promise<{ chart?: ChartModule; error?: Error }> {
        return (this.#initialize ??= (async () => {
            // chart bundle contains only designer data for now
            // designer will do the loading itself if no bundle as been pre-fetched

            const { error } = await this.designer.initialize()
            if (error) return { error }

            this.bundle = undefined
            return { chart: this }
        })())
    }

    destroy() {
        this.designer.destroy()
    }

    updateDefinition(definition: ChartDefNode) {
        this.stores.chartDef.set(definition)
    }
}

export function createChartKit(config: ChartConfig, app: SplitflowAppKit) {
    config = { ...app.config, moduleType: 'line-chart', moduleName: camelCase(config.moduleType ?? 'line-chart'), ...config }

    const { gateway } = app
    const designer = createDesignerKit(
        { ...config, remote: true },
        undefined,
        app.designer
    )

    return {
        gateway,
        designer,
        config
    }
}

export function createLineChartKit(config: ChartConfig, app: SplitflowAppKit) {
    return createChartKit({ ...config, moduleType: 'line-chart' }, app)
}

export function createBarChartKit(config: ChartConfig, app: SplitflowAppKit) {
    return createChartKit({ ...config, moduleType: 'bar-chart' }, app)
}

export function createPieChartKit(config: ChartConfig, app: SplitflowAppKit) {
    return createChartKit({ ...config, moduleType: 'pie-chart' }, app)
}

export interface ChartKit {
    gateway: Gateway
    designer: SplitflowDesignerKit
    config: ChartConfig
}
