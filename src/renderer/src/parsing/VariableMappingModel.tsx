export default interface VariableMappingModel {
  source: string
  destination: string
}

export function instanceOfVariableMappingModel(obj: object): obj is VariableMappingModel {
  return (
    'source' in obj &&
    'destination' in obj &&
    typeof obj.source === 'string' &&
    typeof obj.destination === 'string'
  )
}
