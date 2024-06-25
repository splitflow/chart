import { writable, type Readable } from "svelte/store";

export interface ChartDefNode {
  datasourceName: string,
  series: ChartSeriesDefNode
}

export interface ChartSeriesDefNode {
  [seriesName: string]: SeriesDefNode
}

export interface SeriesDefNode {
  type: 'pie' | 'line' | 'area' | 'bar' | 'bubble'
  visible?: boolean
}

export interface ChartDefStore extends Readable<ChartDefNode> {
  set(value: ChartDefNode): void
}

export default function createChartDefStore(): ChartDefStore {

  const { subscribe, set } = writable<ChartDefNode>(undefined)

  return {
    subscribe,
    set
  }
}

export function equalDatasource(chartDef1: ChartDefNode, chartDef2: ChartDefNode) {
  if (!chartDef1 || !chartDef2) return false
  return chartDef1.datasourceName === chartDef2.datasourceName
}