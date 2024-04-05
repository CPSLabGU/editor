import ActionModel, { instanceOfActionModel } from './ActionModel'
import StateLayout, { instanceOfStateLayout } from './StateLayout'

export default interface StateModel {
  name: string
  variables: string
  externalVariables: string
  actions: ActionModel[]
  layout: StateLayout
}

export function instanceOfStateModel(obj: object): obj is StateModel {
  return (
    'name' in obj &&
    'variables' in obj &&
    'externalVariables' in obj &&
    'actions' in obj &&
    'layout' in obj &&
    typeof obj.name === 'string' &&
    typeof obj.variables === 'string' &&
    typeof obj.externalVariables === 'string' &&
    Array.isArray(obj.actions) &&
    (obj.actions as unknown[]).find(
      (element: unknown): boolean =>
        !(typeof element === 'object') || !instanceOfActionModel(element as object)
    ) === undefined &&
    instanceOfStateLayout(obj.layout as object)
  )
}
