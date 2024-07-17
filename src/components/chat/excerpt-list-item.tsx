import { ExcerptProps } from "@/components/chat/transcript-excerpts"
import { cn } from "@/lib/utils"

interface ExcerptListItemProps {
    excerpt: ExcerptProps,
    setSelected(id : string) : void,
    selectedId : string | null,
}

function ExcerptListItem(props : ExcerptListItemProps) {
    return (
        <button
            key={props.excerpt.chunkId}
            className={cn(
            "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                props.selectedId === props.excerpt.chunkId && "bg-muted"
            )}
            onClick={() =>
                props.setSelected(props.excerpt.chunkId)
            }
        >
            <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                <div className="flex items-center gap-2">
                    <div className="font-semibold">{props.excerpt.transcriptName}</div>
                    {/* {!item.read && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )} */}
                    </div>
                    <div
                        // className={cn(
                        //     "ml-auto text-xs",
                        //     excerpt.chunkId === selected
                        //       ? "text-foreground"
                        //       : "text-muted-foreground"
                        // )}
                        >
                        {/* {formatDistanceToNow(new Date(item.date), {
                            addSuffix: true,
                        })} */}
                    </div>
                </div>
            {/* <div className="text-xs font-medium">{item.subject}</div> */}
            </div>
            <div className="flex items-center gap-2">
                <span>Page {props.excerpt.pageNumber}</span>
                <span>Lines {props.excerpt.fromLine} to {props.excerpt.toLine}</span>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
                {props.excerpt.content.substring(0, 300)}
            </div>
            {/* {item.labels.length ? (
            <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                </Badge>
                ))}
            </div>
            ) : null} */}
        </button>
  )
}

export default ExcerptListItem