import { RequestInit } from 'undici'
import { DataFetcher } from './DataFetcher'

export class DataFetcherBuilder<D> {
  private url: string = ''
  private readonly options: RequestInit = {}

  public setUrl (url: string): this {
    this.url = url
    return this
  }

  public addHeader (key: string, value: string): this {
    this.options.headers = {
      ...(this.options.headers ?? {}),
      [key]: value
    }

    return this
  }

  public readonly build = (): DataFetcher<D> =>
    new DataFetcher<D>(this.url, this.options)
}
