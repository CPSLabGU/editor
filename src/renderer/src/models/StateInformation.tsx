import Point2D from './Point2D'
import StateProperties from './StateProperties'

export default interface StateInformation {
  id: string
  properties: StateProperties
  position: Point2D
}
