import type { ChartDefNode } from "./stores/chart-def";

export function chartSampleDatasource(moduleType: 'line-chart' | 'bar-chart' | 'pie-chart') {
    switch (moduleType) {
        case 'line-chart': return lineChartSampleDatasource
        case 'bar-chart': return barChartSampleDatasource
        case 'pie-chart': return pieChartSampleDatasource
    }
}

export function chartSampleDatasourceName(moduleType: 'line-chart' | 'bar-chart' | 'pie-chart') {
    switch (moduleType) {
        case 'line-chart': return 'LineChartSample'
        case 'bar-chart': return 'BarChartSample'
        case 'pie-chart': return 'PieChartSample'
    }
}

export function chartSampleDefinition(moduleType: 'line-chart' | 'bar-chart' | 'pie-chart') {
    switch (moduleType) {
        case 'line-chart': return lineChartSampleDefinition
        case 'bar-chart': return barChartSampleDefinition
        case 'pie-chart': return pieChartSampleDefinition
    }
}

export const lineChartSampleDatasource = {
    Canada: {
        '1980': 24515667,
        '1982': 25116942,
        '1984': 25607053,
        '1986': 26100278,
        '1988': 26791747,
        '1990': 27691138,
        '1992': 28371264,
        '1994': 29000663,
        '1996': 29610218,
        '1998': 30155173,
        '2000': 30685730,
        '2002': 31360079,
        '2004': 31940655,
        '2006': 32571174,
        '2008': 33247118,
        '2010': 34004889
    },
    'United States': {
        '1980': 227225000,
        '1982': 231664000,
        '1984': 235825000,
        '1986': 240133000,
        '1988': 244499000,
        '1990': 249623000,
        '1992': 256514000,
        '1994': 263126000,
        '1996': 269394000,
        '1998': 275854000,
        '2000': 282162411,
        '2002': 287625193,
        '2004': 292805298,
        '2006': 298379912,
        '2008': 304093966,
        '2010': 309327143
    }

}

export const barChartSampleDatasource = {
    Canada: {
        '65 and above': 19.034311795393,
        '15-64': 65.3885933304723,
        '0-14': 15.5770948741347
    },
    'United States': {
        '65 and above': 17.1281205454528,
        '15-64': 64.9124413446425,
        '0-14': 17.9594381099047
    }
}

export const pieChartSampleDatasource = {
    'Population': {
        Canada: 38929902,
        'United States': 333287557
    }
}

export const lineChartSampleDefinition: ChartDefNode = {
    datasourceName: 'LineChartSample',
    series: {
        'Canada': { type: 'line' },
        'United States': { type: 'line' }
    }
}

export const barChartSampleDefinition: ChartDefNode = {
    datasourceName: 'BarChartSample',
    series: {
        'Canada': { type: 'bar' },
        'United States': { type: 'bar' }
    }
}

export const pieChartSampleDefinition: ChartDefNode = {
    datasourceName: 'PieChartSample',
    series: {
        'Population': { type: 'pie' }
    }
}