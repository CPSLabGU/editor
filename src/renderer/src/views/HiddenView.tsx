// @ts-nocheck

export default function HiddenView({hidden=false, children}) {
    if (hidden) {
        return <></>;
    } else {
        return children;
    }
}
