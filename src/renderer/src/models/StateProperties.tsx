export default interface StateProperties {
  name: string
  w: number
  h: number
  expanded: boolean
  transitions: string[]
  actions: { [action: string]: string }
}
