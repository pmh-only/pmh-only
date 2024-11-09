import { readFile, writeFile } from 'fs/promises'
import { FetcherRegistrar } from '../../fetcher/FetcherRegistrar'
import { Renderer } from '../Renderer'
import { RendererRegistrar } from '../RendererRegistrar'
import Mustache from 'mustache'

export class FriendsListRenderer implements Renderer {
  public readonly render = async (): Promise<void> => {
    const data = await FetcherRegistrar
      .getInstance()
      .requestData()

    const templateData = await readFile('./FRIENDS.mustache')
    const rendered = Mustache.render(
      templateData.toString(),
      data.friends.map((v: any, i: number) => ({
        ...v,
        enter: i % 5 === 4
      })
    ))

    await writeFile('./FRIENDS.md', rendered, 'utf-8')
  }
}

RendererRegistrar
  .getInstance()
  .register(new FriendsListRenderer())
