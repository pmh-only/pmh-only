import { Renderer } from './Renderer'

export class RendererRegistrar {
  private readonly registeredRenderer: Renderer[] = []

  private static readonly instance =
    new this()

  public static readonly getInstance = (): RendererRegistrar =>
    RendererRegistrar.instance

  public readonly register = (fetcher: Renderer): void => {
    this.registeredRenderer.push(fetcher)
  }

  public readonly renderAll = async (): Promise<void> => {
    await Promise.all(this.registeredRenderer.map(async (v) => await v.render()))
  }
}
