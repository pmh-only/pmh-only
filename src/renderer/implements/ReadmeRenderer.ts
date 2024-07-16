import { readFile, writeFile } from 'fs/promises'
import { FetcherRegistrar } from '../../fetcher/FetcherRegistrar'
import { Renderer } from '../Renderer'
import { RendererRegistrar } from '../RendererRegistrar'
import Mustache from 'mustache'

export class ReadmeRenderer implements Renderer {
  public readonly render = async (): Promise<void> => {
    const data = await FetcherRegistrar
      .getInstance()
      .requestData()

    const templateData = await readFile('./README.mustache')
    const rendered = Mustache.render(templateData.toString(), data)

    await writeFile('./README.md', rendered, 'utf-8')
  }
}

RendererRegistrar
  .getInstance()
  .register(new ReadmeRenderer())
