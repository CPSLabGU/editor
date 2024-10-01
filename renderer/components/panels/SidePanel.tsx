import { ScrollArea } from "../ui/scroll-area";

export default function SidePanel({ children }: { children: JSX.Element[] }): JSX.Element {
  return (
    <div className="h-full bg-secondary text-secondary-foreground">
      <ScrollArea className="flex space-y-4 h-full p-4">
        {children}
      </ScrollArea>
    </div>
  );
}
