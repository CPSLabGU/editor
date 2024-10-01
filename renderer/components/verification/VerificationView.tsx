import Machine from "../machines/Machine";

interface VerificationViewParameters {
    machine: Machine;
    setMachine: (newMachine: Machine) => void;
}

export default function VerificationView({ machine, setMachine }: VerificationViewParameters): JSX.Element {
    return (
        <div>View</div>
    );
}
