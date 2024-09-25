import { ExcerptProps } from "@/app/providers";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "../../../../components/ui/button";

interface ExcerptDisplayProps {
  excerpt: ExcerptProps | null
}

export function ExcerptDisplay(props : ExcerptDisplayProps) {
    return (
      <ScrollArea className="h-screen">
        <div className="flex h-full flex-col">
          <div className="flex items-center p-2">              
            <h1 className="text-xl font-bold">
              Selected Document Excerpt
            </h1>
          </div>
          <Separator />
          {props?.excerpt ? (
            <div className="flex flex-1 flex-col p-4">                
              <div className="flex w-full flex-col gap-4 bg-muted rounded px-1">
                <div className="flex items-center font-bold">
                  {props.excerpt.documentName}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted rounded px-1">
                  <span>Page {props.excerpt.pageNumber}</span>
                  <span>Lines {props.excerpt.fromLine} to {props.excerpt.toLine}</span>
                  <Button size="icon" className="mx-2 h-5 w-5" onClick={
                            async (event) => {
                                await navigator.clipboard.writeText(
                                                `${props?.excerpt?.documentName}\n` +
                                                `Page ${props?.excerpt?.pageNumber}\n` +
                                                `Lines ${props?.excerpt?.fromLine} to ${props?.excerpt?.toLine}\n\n` +
                                                `${props?.excerpt?.content}\n`
                                );
                            }
                        }>
                            <span className="sr-only">Copy</span>
                            <CopyIcon className="h-3 w-3" />
                        </Button>
              </div>
              <div className="flex-1 bg-secondary-foreground text-secondary rounded px-2 whitespace-pre-wrap mt-2 text-lg font-semibold overflow-scroll">
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

