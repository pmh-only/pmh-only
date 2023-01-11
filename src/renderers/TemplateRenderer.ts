import { IRenderer } from './IRenderer'

export class TemplateRenderer implements IRenderer {
  private template = ''
  private readonly data = new Map<string, any>()

  public setData (key: string, value: any): this {
    this.data.set(key, value)
    return this
  }

  public setTemplate (value: string): this {
    this.template = value
    return this
  }

  public render (): string {
    let rendered = this.template

    for (const [key, value] of this.data) {
      rendered = rendered.replace(`{{${key}}}`, String(value))
    }

    return rendered
  }
}
