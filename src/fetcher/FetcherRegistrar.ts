import { Fetcher } from './Fetcher'

export class FetcherRegistrar {
  private readonly registeredFetchers: Fetcher[] = []

  private requestCache: Promise<Record<string, any>> | undefined =
    undefined

  private static readonly instance =
    new this()

  public static readonly getInstance = (): FetcherRegistrar =>
    FetcherRegistrar.instance

  public readonly register = (fetcher: Fetcher): void => {
    this.registeredFetchers.push(fetcher)
  }

  private readonly fetchAll = async (): Promise<Record<string, any>> => {
    const fetchedAsync =
      this.registeredFetchers
        .map(async (v) => ({
          key: v.key,
          value: await v.fetch()
        }))

    const fetched = await Promise.all(fetchedAsync)
    const result = fetched.reduce<Record<string, any>>((prev, curr) => ({
      ...prev, [curr.key]: curr.value
    }), {})

    return result
  }

  public readonly requestData = async (): Promise<Record<string, any>> => {
    if (this.requestCache === undefined) {
      this.requestCache = this.fetchAll()
    }

    return await this.requestCache
  }
}
