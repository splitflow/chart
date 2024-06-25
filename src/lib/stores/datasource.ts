import { writable, type Readable } from "svelte/store"

export interface DatasourceNode {
    [seriesName: string]: SeriesNode
}

export interface SeriesNode {
    [value: string]: number | number[]
}

export interface DatasourceStore extends Readable<DatasourceNode> {
    set(value: DatasourceNode): void
}

export default function createDatasourceStore(): DatasourceStore {

    const { subscribe, set } = writable<DatasourceNode>()

    return {
        subscribe,
        set
    }
}