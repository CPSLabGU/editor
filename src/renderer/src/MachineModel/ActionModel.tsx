export default interface ActionModel {
  name: string
  code: string
}

export function instanceOfActionModel(obj: object): obj is ActionModel {
  return (
    'name' in obj && 'code' in obj && typeof obj.name === 'string' && typeof obj.code === 'string'
  )
}
