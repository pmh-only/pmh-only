import { GITHUB_FOLLOWER_LIST_URL, GITHUB_FOLLOWING_LIST_URL } from '../../consts'
import { fetcherBuilderToAsyncIterable, getAllOnAsyncIterable } from '../../utils/iterators'
import { DataFetcher } from '../DataFetcher'
import { DataFetcherBuilder } from '../DataFetcherBuilder'
import { IFetcher } from '../IFetcher'
import { GithubFollowData } from './entity/GithubFollowData'

export interface FriendsData {
  friends: Array<{
    login: string
    avatar_url: string
  }>
}

export class FriendsFetcher implements IFetcher<FriendsData> {
  private readonly buildFollowerFetcher = (page: number): DataFetcher<GithubFollowData> =>
    new DataFetcherBuilder<GithubFollowData>()
      .setUrl(GITHUB_FOLLOWER_LIST_URL(page))
      .addHeader('Content-Type', 'application/json')
      .build()

  private readonly buildFollowingFetcher = (page: number): DataFetcher<GithubFollowData> =>
    new DataFetcherBuilder<GithubFollowData>()
      .setUrl(GITHUB_FOLLOWING_LIST_URL(page))
      .addHeader('Content-Type', 'application/json')
      .build()

  private readonly followerIterable =
    fetcherBuilderToAsyncIterable(this.buildFollowerFetcher)

  private readonly followingIterable =
    fetcherBuilderToAsyncIterable(this.buildFollowingFetcher)

  private readonly calcDuplication = (a: GithubFollowData, b: GithubFollowData): FriendsData =>
    ({ friends: [...a.filter((a) => b.find((b) => a.login === b.login))] })

  public readonly fetch = async (): Promise<FriendsData> =>
    this.calcDuplication(
      await getAllOnAsyncIterable(this.followerIterable),
      await getAllOnAsyncIterable(this.followingIterable))
}
