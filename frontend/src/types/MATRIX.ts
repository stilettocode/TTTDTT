export interface MatrixUpdate {
  data: number[][]
  topleft: {
    x: number
    y: number
  }
  local_timestamp?: string
}
