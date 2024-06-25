import { getDefaultApp, type Datasource, type SplitflowApp } from "@splitflow/app"
import createDatasourceStore, {type DatasourceNode, type DatasourceStore } from "./stores/datasource"


export interface DatasourceConfig {
    datasourceName: string
}

export function createDatasourceModule(config: DatasourceConfig, app?: SplitflowApp) {
    app ??= getDefaultApp()

    const { datasource } = app

    const stores: Stores = {
        datasource: createDatasourceStore()
    }

    return new DatasourceModule(config, datasource, stores)
}

interface Stores {
    datasource: DatasourceStore
}

export class DatasourceModule {
    constructor(config: DatasourceConfig, datasource: Datasource, stores: Stores) {
        this.config = config
        this.datasource = datasource
        this.stores = stores

        this.datasource.addResourceHandler(this.config.datasourceName, () => this.stores.datasource)
    }

    config: DatasourceConfig
    datasource: Datasource
    stores: Stores

    updateDatasource(datasource: DatasourceNode) {
        this.stores.datasource.set(datasource)
    }
}