export interface WakatimeTotalStaticsData {
  data: Array<{
    grand_total: {
      total_seconds: number
    }
    range: {
      text: string
    }
  }>
}
