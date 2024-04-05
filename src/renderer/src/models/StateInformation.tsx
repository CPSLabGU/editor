import Point2D from './Point2D'
import StateProperties from './StateProperties'

export default class StateInformation {
  id: string
  properties: StateProperties
  position: Point2D

  constructor(id: string, properties: StateProperties, position: Point2D) {
    this.id = id
    this.properties = properties
    this.position = position
  }
}
