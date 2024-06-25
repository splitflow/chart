
import type { SeriesNode } from './stores/datasource'

export const NAME = 0;
export const VALUE = 1;

export function list(series: SeriesNode): [string, number][] {
    if (!series) return undefined

    const result = []
    for (const [key, value] of Object.entries(series)) {
        if (Array.isArray(value)) {
            result.push([key, value[1]])
        } else {
            result.push([key, value])
        }
    }
    return result
}