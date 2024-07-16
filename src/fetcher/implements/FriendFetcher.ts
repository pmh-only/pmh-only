import { Fetcher } from '../Fetcher'
import { FetcherRegistrar } from '../FetcherRegistrar'

export class FriendFetcher implements Fetcher {
  public readonly key = 'friends'

  public readonly fetch = async (): Promise<any> => {
    const follower = {
      cursor: undefined as string | undefined,
      isFinished: false,
      ids: [] as string[]
    }

    const following = {
      cursor: undefined as string | undefined,
      isFinished: false,
      ids: [] as string[]
    }

    for (;;) {
      const { data } = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PF_GITHUB_TOKEN ?? ''}`
        },
        body: JSON.stringify({
          query: `
            {
              viewer {
                ${!follower.isFinished
                  ? `
                    followers(first: 100${follower.cursor !== '' ? `, after: "${follower.cursor ?? ''}"` : ''}) {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        databaseId
                      }
                    }`
                  : ''}

                ${!following.isFinished
                  ? `
                    following(first: 100${following.cursor !== '' ? `, after: "${following.cursor ?? ''}"` : ''}) {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      nodes {
                        databaseId
                      }
                    }`
                  : ''}
              }
            }
          `
        })
      }).then(async (res) => await res.json())

      if (!follower.isFinished) {
        follower.ids.push(...data.viewer.followers.nodes.map((v: any) => v.databaseId))
        follower.isFinished = !(data.viewer.followers.pageInfo.hasNextPage as boolean)
        follower.cursor = data.viewer.followers.pageInfo.endCursor as string
      }

      if (!following.isFinished) {
        following.ids.push(...data.viewer.following.nodes.map((v: any) => v.databaseId))
        following.isFinished = !(data.viewer.following.pageInfo.hasNextPage as boolean)
        following.cursor = data.viewer.following.pageInfo.endCursor as string
      }

      if (follower.isFinished && following.isFinished) {
        break
      }
    }

    return following.ids.filter((v) => follower.ids.includes(v))
  }
}

FetcherRegistrar
  .getInstance()
  .register(new FriendFetcher())
