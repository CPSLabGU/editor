import { ScrollArea } from "../ui/scroll-area";

export default function SidePanel({ children }: { children: JSX.Element[] }): JSX.Element {
  return (
    <div className="bg-secondary text-secondary-foreground h-full">
      <ScrollArea className="px-4 h-full">
        {children}
      </ScrollArea>
    </div>
  );
}
