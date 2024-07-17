import { Separator } from "../ui/separator";
import { ExcerptProps } from "./transcript-excerpts";

interface ExcerptDisplayProps {
  excerpt: ExcerptProps | null
}

export function ExcerptDisplay(props : ExcerptDisplayProps) {
    return (
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
              <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
                {props.excerpt.content}
              </div>
              <Separator className="mt-auto" />
              <div className="p-4">
                
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No Excerpt Selected
            </div>
          )}
        </div>
    )
}

