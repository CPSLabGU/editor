import { cn } from "@/lib/utils";

interface MenuBarItemsParameters {
    className?: string;
    children?: JSX.Element[] | JSX.Element | string | number | boolean;
}

interface MenuBarParameters {
    className?: string;
    children?: JSX.Element[] | JSX.Element | string | number | boolean;
    variant?: 'sm' | 'md' | 'lg'
}

export function MenuBarLeftItems({ className, children }: MenuBarItemsParameters): JSX.Element {
    return (
        <div className={cn("h-full w-full flex flex-row items-start p-1 gap-0.5 justify-left", className ?? '')}>
            {children}
        </div>
    );
}

export function MenuBarRightItems({ className, children }: MenuBarItemsParameters): JSX.Element {
    return (
        <div className={cn("h-full w-full flex flex-row items-end p-1 gap-0.5 justify-end", className ?? '')}>
            {children}
        </div>
    );
}


export function MenuBar({ className, children, variant }: MenuBarParameters): JSX.Element {
    let height = '0';
    switch (variant ?? 'md') {
        case 'sm': {
            height = '6';
            break;
        };
        case 'md': {
            height = '11';
            break;
        };
        case 'lg': {
            height = '16';
            break;
        }
    }
    return (
        <div className={cn("w-full bg-secondary flex flex-center overflow-clip", `h-${height}`, className ?? '')}>
          {children}
        </div>
    );
}

