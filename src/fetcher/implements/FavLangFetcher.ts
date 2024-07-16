import { Fetcher } from '../Fetcher'
import { fetch } from 'undici'
import { FetcherRegistrar } from '../FetcherRegistrar'

export class FavLangFetcher implements Fetcher {
  public readonly key = 'favlang'

  public readonly fetch = async (): Promise<any> => {
    let totalCount = 0
    let cursor = ''
    const languages = new Map<string, number>()

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
                repositories(first: 100${cursor !== '' ? `, after: "${cursor}"` : ''}) {
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                  nodes {
                    primaryLanguage {
                      name
                    }
                  }
                }
              }
            }
          `
        })
      }).then(async (res) => await res.json()) as any

      const repositories =
        data.viewer.repositories.nodes
          .filter((v: any) => v.primaryLanguage !== null)

      totalCount += repositories.length as number

      for (const repository of repositories) {
        const prevValue = languages.get(repository.primaryLanguage.name) ?? 0
        languages.set(repository.primaryLanguage.name, prevValue + 1)
      }

      if (data.viewer.repositories.pageInfo.hasNextPage === false) {
        break
      }

      cursor = data.viewer.repositories.pageInfo.endCursor
    }

    let result = [] as Array<{ name: string, percent: number, colon: boolean }>
    for (const [name, count] of languages) {
      result.push({
        name,
        percent: Math.floor(count / totalCount * 1000) / 10,
        colon: true
      })
    }

    result.sort((a, b) => a.percent - b.percent)
    result = result.reverse().slice(0, 10)
    result[result.length - 1].colon = false

    return result
  }
}

FetcherRegistrar
  .getInstance()
  .register(new FavLangFetcher())
