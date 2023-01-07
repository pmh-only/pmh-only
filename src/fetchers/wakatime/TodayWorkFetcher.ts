import { WAKATIME_TOTAL_STATICS_URL } from '../../consts'
import { WakatimeTotalStaticsData } from './entity/WakatimeTotalStaticsData'
import { DataFetcherBuilder } from '../DataFetcherBuilder'
import { IFetcher } from '../IFetcher'

export interface TodayWorkData {
  today: number
}

export class TodayWorkFetcher implements IFetcher<TodayWorkData> {
  private readonly fetcher =
    new DataFetcherBuilder<WakatimeTotalStaticsData>()
      .setUrl(WAKATIME_TOTAL_STATICS_URL)
      .addHeader('Content-Type', 'application/json')
      .build()

  private readonly calcTotalSeconds = (data: WakatimeTotalStaticsData): TodayWorkData =>
    ({ today: data.data.find((v) => v.range.text === 'Today')?.grand_total.total_seconds ?? 0 })

  public readonly fetch = async (): Promise<TodayWorkData> =>
    await this.fetcher.fetch().then(this.calcTotalSeconds)
}
