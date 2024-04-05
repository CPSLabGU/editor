import BezierPath from './BezierPath'
import Clock from './Clock'
import MachineModel, { instanceOfMachineModel } from '../parsing/MachineModel'
import StateModel from '../parsing/StateModel'
import StateLayout from '../parsing/StateLayout'
import ActionModel from '../parsing/ActionModel'
import TransitionLayout from '../parsing/TransitionLayout'
import TransitionModel from '../parsing/TransitionModel'
import Point2D from './Point2D'
import StateInformation from './StateInformation'
import TransitionProperties from './TransitionProperties'
import { v4 as uuidv4 } from 'uuid'
import StateProperties from './StateProperties'
import ClockModel from '@renderer/parsing/ClockModel'

export default class Machine {
  _states: { [id: string]: StateInformation }

  _transitions: { [id: string]: TransitionProperties }

  _edittingState: string | null

  _externalVariables: string

  _machineVariables: string

  _includes: string

  _initialState: string

  _suspendedState: string | undefined

  _clocks: Clock[]

  get states(): { [id: string]: StateInformation } {
    return this._states
  }

  get transitions(): { [id: string]: TransitionProperties } {
    return this._transitions
  }

  get edittingState(): string | null {
    return this._edittingState
  }

  get externalVariables(): string {
    return this._externalVariables
  }

  get machineVariables(): string {
    return this._machineVariables
  }

  get includes(): string {
    return this._includes
  }

  get initialState(): string {
    return this._initialState
  }

  get suspendedState(): string | undefined {
    return this._suspendedState
  }

  get clocks(): Clock[] {
    return this._clocks
  }

  static get defaultMachine(): Machine {
    const initialStates: { [id: string]: StateInformation } = {}
    const initialTransitions: { [id: string]: TransitionProperties } = {}
    function addState(...states: StateInformation[]): void {
      for (let i = 0; i < states.length; i++) {
        initialStates[states[i].id] = states[i]
      }
    }
    addState(
      new StateInformation(
        uuidv4(),
        new StateProperties(
          'Initial',
          200,
          100,
          false,
          [],
          { OnEntry: '', OnExit: '', Internal: '' },
          '',
          ''
        ),
        new Point2D(0, 0)
      ),
      new StateInformation(
        uuidv4(),
        new StateProperties(
          'Suspended',
          200,
          100,
          false,
          [],
          { OnEntry: '', OnExit: '', Internal: '' },
          '',
          ''
        ),
        new Point2D(0, 200)
      )
    )
    const initialState = Object.keys(initialStates).find(
      (id) => initialStates[id].properties.name == 'Initial'
    )
    const suspendedState = Object.keys(initialStates).find(
      (id) => initialStates[id].properties.name == 'Suspended'
    )
    // Create default transitions.
    const newUUID = uuidv4()
    initialTransitions[newUUID] = new TransitionProperties(
      initialState!,
      suspendedState!,
      'true',
      new BezierPath(
        new Point2D(100, 100),
        new Point2D(100, 200),
        new Point2D(100, 135),
        new Point2D(100, 170)
      ),
      'white'
    )
    initialStates[initialState!].properties.transitions = [newUUID]
    const machine = new Machine(
      initialStates,
      initialTransitions,
      null,
      '',
      '',
      '',
      initialState!,
      suspendedState,
      new Array<Clock>()
    )
    return machine
  }

  get shallowCopy(): Machine {
    return new Machine(
      { ...this.states },
      { ...this.transitions },
      this.edittingState,
      this.externalVariables,
      this.machineVariables,
      this.includes,
      this.initialState,
      this.suspendedState,
      [...this.clocks]
    )
  }

  get toModel(): MachineModel {
    const models: { stateModel: StateModel; transitionModels: TransitionModel[] }[] = Object.keys(
      this.states
    ).map((id) => {
      const state = this.states[id]!
      const stateLayout: StateLayout = {
        position: state.position.toModel,
        dimensions: { x: state.properties.w, y: state.properties.h }
      }
      const actions: ActionModel[] = Object.keys(state.properties.actions).map((actionName) => {
        return {
          name: actionName,
          code: state.properties.actions[actionName] || ''
        }
      })
      const stateModel: StateModel = {
        name: state.properties.name,
        variables: state.properties.variables,
        externalVariables: state.properties.externalVariables,
        actions: actions.toSorted((a: ActionModel, b: ActionModel) => {
          return a.name < b.name ? -1 : 1
        }),
        layout: stateLayout
      }
      const transitionModels: TransitionModel[] = state.properties.transitions.flatMap(
        (transitionID) => {
          const stateTransition = this.transitions[transitionID]
          if (!stateTransition) return []
          const target = this.states[stateTransition.target]?.properties.name
          if (!target) return []
          const layout: TransitionLayout = {
            path: stateTransition.path.toModel
          }
          return [
            {
              source: state.properties.name,
              target: target,
              condition: stateTransition.condition,
              layout: layout
            }
          ]
        }
      )
      return { stateModel: stateModel, transitionModels: transitionModels }
    })
    const stateModels: StateModel[] = models.map((models) => {
      return models.stateModel
    })
    const transitionModels: TransitionModel[] = models.flatMap((models) => {
      return models.transitionModels
    })
    let initialState: string
    if (this.states[this.initialState]) {
      initialState = this.states[this.initialState]!.properties.name
    } else {
      const firstState = Object.values(this.states)[0].properties.name
      console.log('No initial state defined, choosing: ', firstState)
      initialState = firstState
    }
    const suspendedState = this.suspendedState
      ? this.states[this.suspendedState]?.properties.name
      : undefined
    return {
      states: stateModels,
      externalVariables: this.externalVariables,
      machineVariables: this.machineVariables,
      includes: this.includes,
      transitions: transitionModels,
      initialState: initialState,
      suspendedState: suspendedState,
      clocks: this.clocks.map((clock: Clock): ClockModel => clock.toModel)
    }
  }

  constructor(
    states: { [id: string]: StateInformation },
    transitions: { [id: string]: TransitionProperties },
    edittingState: string | null,
    externalVariables: string,
    machineVariables: string,
    includes: string,
    initialState: string,
    suspendedState: string | undefined = undefined,
    clocks: Clock[]
  ) {
    this._states = states
    this._transitions = transitions
    this._edittingState = edittingState
    this._externalVariables = externalVariables
    this._machineVariables = machineVariables
    this._includes = includes
    this._initialState = initialState
    this._suspendedState = suspendedState
    this._clocks = clocks
  }

  static fromData(data: string): Machine | null {
    const parsedModel = JSON.parse(data)
    if (!(typeof parsedModel === 'object')) return null
    if (!instanceOfMachineModel(parsedModel as object)) return null
    const model = parsedModel as MachineModel
    return Machine.fromModel(model)
  }

  static fromModel(model: MachineModel): Machine {
    const states: { [id: string]: StateInformation } = {}
    model.states.forEach((stateModel) => {
      const stateID = uuidv4()
      const actions: { [action: string]: string } = {}
      stateModel.actions.forEach((action) => {
        actions[action.name] = action.code
      })
      const stateProperties = StateProperties.fromModel(stateModel)
      const information = new StateInformation(
        stateID,
        stateProperties,
        Point2D.fromModel(stateModel.layout.position)
      )
      states[stateID] = information
    })
    const transitions: { [id: string]: TransitionProperties } = {}
    model.transitions.forEach((transitionModel) => {
      const id: string = uuidv4()
      const sourceID = Object.keys(states).find(
        (key) => states[key].properties.name == transitionModel.source
      )
      if (!sourceID) return
      const properties: TransitionProperties = new TransitionProperties(
        sourceID,
        Object.keys(states).find((key) => states[key].properties.name == transitionModel.target)!,
        transitionModel.condition,
        BezierPath.fromModel(transitionModel.layout.path),
        'white'
      )
      transitions[id] = properties
      states[sourceID].properties.transitions.push(id)
    })
    let initialState: string
    if (Object.keys(states).length > 0) {
      initialState = Object.keys(states).find(
        (key) => states[key].properties.name == model.initialState
      ) || states[Object.keys(states)[0]].properties.name
    } else {
      initialState = ''
    }

    let suspendState: string
    if (Object.keys(states).length > 0) {
      suspendState = Object.keys(states).find(
        (key) => states[key].properties.name == model.suspendedState
      ) || states[Object.keys(states)[0]].properties.name
    } else {
      suspendState = ''
    }
    
    return new Machine(
      states,
      transitions,
      null,
      model.externalVariables,
      model.machineVariables,
      model.includes,
      initialState,
      suspendState,
      model.clocks.map(Clock.fromModel)
    )
  }

  addState(newState: StateInformation): Machine {
    const newMachine = this.shallowCopy
    newMachine.states[newState.id] = newState
    return newMachine
  }

  addTransition(id: string, transition: TransitionProperties): Machine {
    const newMachine = this.shallowCopy
    newMachine.transitions[id] = transition
    const sourceState = this.states[transition.source]
    if (!sourceState) return newMachine
    if (
      sourceState.properties.transitions.find((v) => {
        return v == id
      }) === undefined
    ) {
      sourceState.properties.transitions.push(id)
    }
    return newMachine
  }

  delete(objects: Set<string>): Machine {
    const newMachine = this.shallowCopy
    const newStates: { [id: string]: StateInformation } = {}
    Object.keys(newMachine.states).forEach((id) => {
      if (!objects.has(id)) {
        newStates[id] = newMachine.states[id]
        newStates[id].properties.transitions = newStates[id].properties.transitions.filter(
          (v) => !objects.has(v)
        )
      }
    })
    const newTransitions: { [id: string]: TransitionProperties } = {}
    Object.keys(newMachine.transitions).forEach((id) => {
      if (
        !objects.has(id) &&
        !objects.has(newMachine.transitions[id].source) &&
        !objects.has(newMachine.transitions[id].target)
      ) {
        newTransitions[id] = newMachine.transitions[id]
      }
    })
    newMachine._states = newStates
    newMachine._transitions = newTransitions
    return newMachine
  }

  deleteState(stateId: string): Machine {
    const newMachine = this.shallowCopy
    delete newMachine.states[stateId]
    const newTransitions: { [id: string]: TransitionProperties } = {}
    Object.keys(newMachine.transitions).forEach((id) => {
      if (
        newMachine.transitions[id].source != stateId &&
        newMachine.transitions[id].target != stateId
      ) {
        newTransitions[id] = newMachine.transitions[id]
      }
    })
    newMachine._transitions = newTransitions
    return newMachine
  }

  deleteTransition(transitionId: string): Machine {
    const transition = this.transitions[transitionId]
    if (!transition) return this
    const stateID = transition.source
    const state = this.states[stateID]
    const newMachine = this.shallowCopy
    delete newMachine.transitions[transitionId]
    if (!state) return newMachine
    state.properties.transitions = state.properties.transitions.filter((v) => v != transitionId)
    return newMachine
  }

  setEdittingState(edittingState: string | null): Machine {
    const newMachine = this.shallowCopy
    newMachine._edittingState = edittingState
    return newMachine
  }

  setExternalVariables(externalVariables: string): Machine {
    const newMachine = this.shallowCopy
    newMachine._externalVariables = externalVariables
    return newMachine
  }

  setMachineVariables(machineVariables: string): Machine {
    const newMachine = this.shallowCopy
    newMachine._machineVariables = machineVariables
    return newMachine
  }

  setIncludes(includes: string): Machine {
    const newMachine = this.shallowCopy
    newMachine._includes = includes
    return newMachine
  }

  setInitialState(initialState: string): Machine {
    const newMachine = this.shallowCopy
    newMachine._initialState = initialState
    return newMachine
  }

  setSuspendedState(suspendedState: string | undefined): Machine {
    const newMachine = this.shallowCopy
    newMachine._suspendedState = suspendedState
    return newMachine
  }

  setClocks(clocks: Clock[]): Machine {
    const newMachine = this.shallowCopy
    newMachine._clocks = clocks
    return newMachine
  }

  setState(id: string, state: StateInformation): Machine {
    const newMachine = this.shallowCopy
    newMachine.states[id] = state
    return newMachine
  }

  setStates(states: { [id: string]: StateInformation }): Machine {
    const newMachine = this.shallowCopy
    newMachine._states = states
    return newMachine
  }

  setStateTransitions(id: string, transitions: string[]): Machine {
    const state = this.states[id]
    if (!state) return this
    const newMachine = this.shallowCopy
    state.properties.transitions = transitions
    return newMachine
  }

  setTransition(id: string, transition: TransitionProperties): Machine {
    const newMachine = this.shallowCopy
    newMachine.transitions[id] = transition
    return newMachine
  }

  setTransitions(transitions: { [id: string]: TransitionProperties }): Machine {
    const newMachine = this.shallowCopy
    newMachine._transitions = transitions
    return newMachine
  }
}
