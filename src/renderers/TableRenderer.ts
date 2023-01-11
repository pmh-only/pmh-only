import { IRenderer } from './IRenderer'

export interface TableData {
  linkHref: string
  imageUrl: string
  label: string
}

export class TableRenderer implements IRenderer {
  private tableWidth: number = 10
  private imageWidth: number = 100
  private tableData: TableData[] = []

  public setTableWidth (width: number): this {
    this.tableWidth = width
    return this
  }

  public setImageWidth (width: number): this {
    this.imageWidth = width
    return this
  }

  public setTableData (tableData: TableData[]): this {
    this.tableData = tableData
    return this
  }

  private readonly renderItem = (data: TableData, index: number): string =>
    '<td align="center">' +
      `<a href="${data.linkHref}">` +
        `<img src="${data.imageUrl}&s=${this.imageWidth}" width="${this.imageWidth}px" height="${this.imageWidth}">` +
        '<br />' +
        data.label +
      '</a>' +
    '</td>' +
    ((index + 1) % this.tableWidth === 0 ? '</tr><tr>' : '')

  public render (): string {
    const rendered =
      '<table><tr>' +
      this.tableData.map(this.renderItem).join('') +
      '</tr></table>'

    return rendered
  }
}
