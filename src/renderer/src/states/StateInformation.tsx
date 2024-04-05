import Point2D from '../util/Point2D'
import StateProperties from './StateProperties'

export default class StateInformation {
  id: string
  properties: StateProperties
  position: Point2D

  get copy(): StateInformation {
    return new StateInformation(this.id, this.properties.copy, this.position.copy)
  }

  constructor(id: string, properties: StateProperties, position: Point2D) {
    this.id = id
    this.properties = properties
    this.position = position
  }
}
