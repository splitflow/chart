
export function dot<Datum = [number, number]>(
    x: (d: Datum) => number,
    y: (d: Datum) => number,
    r: (d: Datum) => number
) {
    // https://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
    return (data: Datum[]) => {
        const tokens: string[] = []
        for (const d of data) {
            const _r = r(d)
            tokens.push(
                `M ${x(d)}, ${y(d)} m ${r(d)}, 0 a ${_r},${_r} 0 1,0 -${_r * 2},0 a ${_r},${_r} 0 1,0 ${_r * 2},0`
            )
        }
        return tokens.join(' ')
    }
}

export function bar<Datum = [number, number]>(
    x: (d: Datum) => number,
    y0: number,
    y1: (d: Datum) => number
) {
    return (data: Datum[]) => {
        const tokens: string[] = []
        for (const d of data) {
            tokens.push(`M ${x(d)} ${y0} L ${x(d)} ${y1(d)}`)
        }
        return tokens.join(' ')
    }
}

export function barY<Datum = [number, number]>(
    y: (d: Datum) => number,
    x0: number,
    x1: (d: Datum) => number
) {
    return (data: Datum[]) => {
        const tokens: string[] = []
        for (const d of data) {
            tokens.push(`M ${x0} ${y(d)} L ${x1(d)} ${y(d)}`)
        }
        return tokens.join(' ')
    }
}