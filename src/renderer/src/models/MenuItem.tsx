export default class MenuItem {

    id: string;
    label: string;
    action: () => void;

    constructor(id: string, label: string, action: () => void) {
        this.id = id;
        this.label = label;
        this.action = action;
    }

}