
import { extent, max, min } from 'd3-array'
import type { SeriesNode } from './stores/datasource'

export const X = 0;
export const Y = 1;
export const Z = 2;

export function list(series: SeriesNode): [number, number][] {
    if (!series) return undefined

    const result = []
    for (const [key, value] of Object.entries(series)) {
        if (Array.isArray(value)) {
            if (value[0] === undefined) {
                result.push([Number(key), value[1]])
            } else {
                result.push(value)
            }
        } else {
            result.push([Number(key), value])
        }
    }
    return result
}

export function listZ(series: SeriesNode): [number, number, number][] {
    if (!series) return undefined

    const result = []
    for (const [key, value] of Object.entries(series)) {
        if (Array.isArray(value)) {
            if (value[0] === undefined) {
                result.push([Number(key), value[1], value[2]])
            } else {
                result.push(value)
            }
        } else {
            result.push([Number(key), value])
        }
    }
    return result
}

export function domain(series: [number, number][]): [[number, number], [number, number]] {
    return [extent(series, (d) => d[X]), extent(series, (d) => d[Y])]
}

export function domainZ(series: [number, number, number][]): [[number, number], [number, number], [number, number]] {
    return [extent(series, (d) => d[X]), extent(series, (d) => d[Y]), extent(series, (d) => d[Z])]
}

export function consolidate(domains: Record<string, [[number, number], [number, number], [number, number]?]> | [[number, number], [number, number], [number, number]?][]): [[number, number], [number, number]] {
    domains = Array.isArray(domains) ? domains : domains ? Object.values(domains) : undefined
    domains = domains?.filter((d) => !!d)

    if (domains?.length > 0) {

        return [[
            min(domains, (d) => d[X][0]),
            max(domains, (d) => d[X][1]),
        ],
        [
            min(domains, (d) => d[Y][0]),
            max(domains, (d) => d[Y][1]),
        ]]
    }
}

export function consolidateZ(domains: Record<string, [[number, number], [number, number], [number, number]]> | [[number, number], [number, number], [number, number]][]): [[number, number], [number, number], [number, number]] {
    domains = Array.isArray(domains) ? domains : domains ? Object.values(domains) : undefined
    domains = domains?.filter((d) => !!d)

    if (domains?.length > 0) {

        return [[
            min(domains, (d) => d[X][0]),
            max(domains, (d) => d[X][1]),
        ],
        [
            min(domains, (d) => d[Y][0]),
            max(domains, (d) => d[Y][1]),
        ],
        [
            min(domains, (d) => d[Z][0]),
            max(domains, (d) => d[Z][1]),
        ]]
    }
}