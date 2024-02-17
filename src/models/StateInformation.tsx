import StateProperties from './StateProperties';

export default interface StateInformation {
    id: string;
    properties: StateProperties
    expanded: boolean;
}