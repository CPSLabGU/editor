import { ScrollArea } from "../ui/scroll-area";

export default function SidePanel({ children }: { children: JSX.Element[] }): JSX.Element {
  return (
    <div className="fixed top-0 right-0 h-screen bg-secondary text-secondary-foreground w-1/4">
      <ScrollArea className="flex space-y-4 h-full p-4">
        {children}
      </ScrollArea>
    </div>
  );
}
