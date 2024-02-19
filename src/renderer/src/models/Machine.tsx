export default class Machine {

    externalVariables: string;

    machineVariables: string;

    includes: string;

    constructor(externalVariables: string, machineVariables: string, includes: string) {
        this.externalVariables = externalVariables;
        this.machineVariables = machineVariables;
        this.includes = includes;
    }

}