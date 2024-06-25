import type { Datasource } from "@splitflow/app";
import { writable, type Readable } from "svelte/store";
import { equalDatasource, type ChartDefNode, type ChartDefStore } from "./chart-def";
import type { DatasourceNode, SeriesNode } from "./datasource";
import { merge } from "@splitflow/core/utils";

export interface ChartNode {
  pie?: ChartGroupNode
  line?: ChartGroupNode
  area?: ChartGroupNode
  bar?: ChartGroupNode
  bubble?: ChartGroupNode
}

export interface ChartGroupNode {
  [seriesName: string]: SeriesNode;
}

export interface ChartStore extends Readable<ChartNode> { }

export default function createChartStore(chartDef: ChartDefStore, sfDatasource: Datasource): ChartStore {

  let value: ChartNode = {}

  const { subscribe, set: setInternal } = writable(value, () => {
    let _chartDef: ChartDefNode
    let _datasource: DatasourceNode

    let unsubscribe1: () => void
    let unsubscribe2: () => void

    function run1($chartDef: ChartDefNode) {
      if (equalDatasource(_chartDef, $chartDef)) {
        _chartDef = $chartDef

        if (_datasource) {
          setImmutable(mergeChart(value, define(_datasource, _chartDef)));
        }
        return
      }

      _chartDef = $chartDef

      unsubscribe2?.()
      if (_chartDef) {
        unsubscribe2 = sfDatasource.fetchResource({ name: _chartDef.datasourceName })?.subscribe(run2)
      }
    }

    function run2($datasource: DatasourceNode) {
      _datasource = $datasource

      if (_chartDef) {
        setImmutable(mergeChart(value, define(_datasource, _chartDef)));
      }

    }

    unsubscribe1 = chartDef.subscribe(run1)
    return () => {
      unsubscribe1?.()
      unsubscribe2?.()
    }
  })

  function setImmutable(nextValue: ChartNode) {
    if (nextValue !== value) {
      value = nextValue;
      setInternal((value = nextValue));
    }
  }

  return { subscribe }
}

export function firstSeries(group: ChartGroupNode) {
  return group ? Object.values(group)[0] : undefined
}

function define(datasource: DatasourceNode, chartDef: ChartDefNode) {
  let value: ChartNode = {}

  if (chartDef) {
    for (const [seriesName, seriesDef] of Object.entries(chartDef.series)) {
      if (datasource[seriesName] && (seriesDef.visible ?? true)) {
        value[seriesDef.type] ??= {}
        value[seriesDef.type][seriesName] = datasource[seriesName]
      }
    }
  }

  return value
}

function mergeChart(value: ChartNode, chart: ChartNode) {

  return merge(value, chart, { deleteNullProps: true }) ?? {};
}