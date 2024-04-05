export default interface ClockModel {
  name: string
  frequency: string
}

export function instanceOfClockModel(obj: object): obj is ClockModel {
  return (
    'name' in obj &&
    'frequency' in obj &&
    typeof obj.name === 'string' &&
    typeof obj.frequency === 'string'
  )
}
