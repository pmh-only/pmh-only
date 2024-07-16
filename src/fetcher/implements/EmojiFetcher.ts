import { Fetcher } from '../Fetcher'
import { FetcherRegistrar } from '../FetcherRegistrar'

export class EmojiFetcher implements Fetcher {
  public readonly key = 'emoji'

  private static readonly EMOJI_LIST = [
    'glowing_star',
    'rocket',
    'satellite',
    'satellite_antenna',
    'sparkles',
    'waving_hand'
  ]

  public readonly fetch = async (): Promise<string> =>
    EmojiFetcher.EMOJI_LIST[Math.floor(Math.random() * EmojiFetcher.EMOJI_LIST.length)]
}

FetcherRegistrar
  .getInstance()
  .register(new EmojiFetcher())
