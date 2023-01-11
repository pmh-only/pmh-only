import { WAKATIME_LANGUAGE_STATICS_URL } from '../../consts'
import { WakatimeLangStaticsData } from './entity/WakatimeLangStaticsData'
import { DataFetcherBuilder } from '../DataFetcherBuilder'
import { IFetcher } from '../IFetcher'

export interface LangListData {
  langs: Array<{
    color: string
    name: string
    percent: number
  }>
}

export class LangListFetcher implements IFetcher<LangListData> {
  private readonly fetcher =
    new DataFetcherBuilder<WakatimeLangStaticsData>()
      .setUrl(WAKATIME_LANGUAGE_STATICS_URL)
      .addHeader('Content-Type', 'application/json')
      .build()

  private readonly sortByPercent = (data: WakatimeLangStaticsData): LangListData =>
    ({ langs: data.data.sort((a, b) => b.percent - a.percent) })

  public readonly fetch = async (): Promise<LangListData> =>
    await this.fetcher.fetch().then(this.sortByPercent)
}
