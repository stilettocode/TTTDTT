export interface MetricWarningAlert {
  id?: string
  valuename: string
  value: number
  severity: 'PREDICTIVE' | 'WARNING' | string
  breach: 'LOW' | 'HIGH' | string
  threshold: number
  unit: string
  message: string
  notes: string
  local_timestamp?: string
}
