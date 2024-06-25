
import { extent, max, min } from 'd3-array'
import type { SeriesNode } from './stores/datasource'

export const NAME = 0
export const VALUE = 1

export function mapSerie(series: SeriesNode): Record<string, number> {
    if (!series) return undefined

    const result = {}
    for (const [key, value] of Object.entries(series)) {
        if (Array.isArray(value)) {
            result[key] = value[1]
        } else {
            result[key] = value
        }
    }
    return result
}

export function domain(series: Record<string, number>): [string[], [number, number]] {
    const list = Object.entries(series)
    return [list.map((d) => d[NAME]), extent(list, (d) => d[VALUE])]
}

export function consolidate(domains: Record<string, [string[], [number, number]]> | [string[], [number, number]][]): [string[], [number, number]] {
    domains = Array.isArray(domains) ? domains : domains ? Object.values(domains) : undefined
    domains = domains?.filter((d) => !!d)

    if (domains?.length > 0) {
        return [
            [...new Set(domains.map((d) => d[NAME]).flat())],
            [
                min(domains, (d) => d[VALUE][0]),
                max(domains, (d) => d[VALUE][1]),
            ]]
    }
}