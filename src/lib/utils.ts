export function map<U, V>(object: Object, mapper: (v: U) => V) {
    return object ? Object.fromEntries(Object.entries(object).map(([key, value]) => [key, mapper(value)])) : undefined
}

export function anchor(anchor: 'start' | 'center' | 'end' = 'start', offset = 0) {
    return (start: number, end?: number) => {
        end ??= start

        switch (anchor) {
            case 'start':
                return start + offset
            case 'end':
                return end - offset
            case 'center':
                return (start + end) / 2 + offset
        }
    }
}

export function toRad(deg: number) {
    if (deg !== undefined) return deg * (Math.PI / 180)
}

export function perc(perc: number, total: number) {
    if (perc !== undefined) return (perc * total) / 100
}

export function camelCase(value: string) {
    return value.split('-').map((v) => v.charAt(0).toUpperCase() + v.slice(1)).join('')
}