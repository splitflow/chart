import { loadSplitflowDesignerBundle, type DesignerBundle } from '@splitflow/designer'
import type { ChartConfig, ChartKit } from './module'

export interface ChartBundle extends DesignerBundle {
    config: ChartConfig
}

export function isChartBundle(bundle: ChartBundle | ChartConfig): bundle is ChartBundle {
    return !!(bundle as any).config
}

export async function loadChartBundle(kit: ChartKit): Promise<ChartBundle> {
    const bundle1 = await loadSplitflowDesignerBundle(kit.designer)
    return { config: kit.config, ...bundle1 }
}
