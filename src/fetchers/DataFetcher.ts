import { fetch, RequestInit, Response } from 'undici'
import { IFetcher } from './IFetcher'

export class DataFetcher<D> implements IFetcher<D> {
  private readonly url: string
  private readonly option: RequestInit

  constructor (url: string, option: RequestInit) {
    this.url = url
    this.option = option
  }

  private readonly parseJson = async (res: Response): Promise<D> =>
    await res.json() as D

  public readonly fetch = async (): Promise<D> =>
    await fetch(this.url, this.option).then(this.parseJson)
}
