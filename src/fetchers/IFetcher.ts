export interface IFetcher<D> {
  fetch: () => Promise<D>
}
