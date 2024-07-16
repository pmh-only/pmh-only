export interface Fetcher {
  key: string
  fetch: () => Promise<any>
}
