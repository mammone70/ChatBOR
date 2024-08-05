import { ExcerptProps } from "@/app/providers";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExcerptDisplayProps {
  excerpt: ExcerptProps | null
}

export function ExcerptDisplay(props : ExcerptDisplayProps) {
    return (
      <ScrollArea className="h-screen">
        <div className="flex h-full flex-col">
          <div className="flex items-center p-2">              
            <h1 className="text-xl font-bold">
              Selected Transcript Excerpt
            </h1>
          </div>
          <Separator />
          {props?.excerpt ? (
            <div className="flex flex-1 flex-col">                
              <Separator />
              <div className="flex-1 whitespace-pre-wrap p-4 text-lg font-semibold overflow-scroll">
                {props.excerpt.content}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No Excerpt Selected
            </div>
          )}
        </div>
      </ScrollArea>
    )
}

