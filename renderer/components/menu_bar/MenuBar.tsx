import { cn } from "@/lib/utils";

interface MenuBarParameters {
    className?: string;
    children: JSX.Element[] | JSX.Element | string | number | boolean;
}

export function MenuBarLeftItems({ className, children }: MenuBarParameters): JSX.Element {
    return (
        <div className={cn("h-full w-full flex flex-row items-start p-1 gap-0.5 justify-left", className ?? '')}>
            {children}
        </div>
    );
}

export function MenuBarRightItems({ className, children }: MenuBarParameters): JSX.Element {
    return (
        <div className={cn("h-full w-full flex flex-row items-end p-1 gap-0.5 justify-end", className ?? '')}>
            {children}
        </div>
    );
}


export function MenuBar({ className, children }: MenuBarParameters): JSX.Element {
    return (
        <div className={cn("w-full bg-muted-foreground flex flex-center", className ?? '')}>
          {children}
        </div>
    );
}

