import { FetcherRegistrar } from '../FetcherRegistrar'

export class AgeFetcher {
  public readonly key = 'age'

  public readonly fetch = async (): Promise<number> =>
    Math.floor((this.now - this.birth) / 365)

  private readonly now =
    Math.floor(new Date().setHours(0, 0, 0, 0) / 24 / 60 / 60 / 1000)

  private readonly birth =
    Math.floor(new Date('2005-01-30T00:00:00').getTime() / 24 / 60 / 60 / 1000)
}

FetcherRegistrar
  .getInstance()
  .register(new AgeFetcher())
