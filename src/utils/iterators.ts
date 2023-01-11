import { DataFetcher } from '../fetchers/DataFetcher'

export type FetcherBulder<T> = (page: number) => DataFetcher<T>

export function fetcherBuilderToAsyncIterable<T extends unknown[]> (fetcherBuilder: FetcherBulder<T>): AsyncIterable<T> {
  let page = 1

  return {
    [Symbol.asyncIterator]: () => ({
      next: async () => {
        const fetcher = fetcherBuilder(page)
        const value = await fetcher.fetch()
        page++

        return {
          value,
          done: value.length < 1
        }
      }
    })
  }
}

export async function getAllOnAsyncIterable<T extends unknown[]> (iterable: AsyncIterable<T>): Promise<T> {
  const data = [] as unknown[]

  for await (const interated of iterable) {
    data.push(...interated)
  }

  return data as T
}
