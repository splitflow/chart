<svelte:options immutable />

<script lang="ts">
    import type { ScaleLinear } from 'd3-scale'
    import { curveCardinal, line } from 'd3-shape'
    import { getContext } from 'svelte'
    import { createConfig, createStyle } from '@splitflow/designer'
    import { number } from '@splitflow/core/definition'
    import { X, Y } from '../../line-chart'
    import { dot } from '../../shape'
    import { ChartModule } from '../../module'

    export let group: Record<string, [number, number][]>
    export let xScale: ScaleLinear<number, number>
    export let yScale: ScaleLinear<number, number>

    const module = getContext<ChartModule>(ChartModule)

    const style = createStyle('Line', module.designer)
    const config = createConfig('Line', module.designer)

    const tensionDef = number({ min: 0, max: 100, step: 5, unit: '%', nullable: true })
    const radiusDef = number({ min: 0, max: 100, step: 5, unit: 'px', nullable: true })

    $: linePath = line(
        (d) => xScale(d[X]),
        (d) => yScale(d[Y])
    ).curve(curveCardinal.tension($config.line.tension(5, tensionDef) / 100))

    $: dotPath = dot(
        (d) => xScale(d[X]),
        (d) => yScale(d[Y]),
        () => $config.dot.radius(5, radiusDef)
    )
</script>

{#if group}
    <g class={style.root$svg()}>
        {#each Object.values(group) as series, index}
            <path
                class={style.line$svg({ [`series${index + 1}`]: true })}
                d={linePath(series)}
                fill="none"
            />
            {#if $config.dot.enabled()}
                <path class={style.dot$svg({ [`series${index + 1}`]: true })} d={dotPath(series)} />
            {/if}
        {/each}
    </g>
{/if}
