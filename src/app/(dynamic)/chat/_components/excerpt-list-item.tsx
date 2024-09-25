import { ExcerptProps } from "@/app/providers"
import { cn } from "@/lib/utils"
import { Dispatch, SetStateAction } from "react";

interface ExcerptListItemProps {
    excerpt: ExcerptProps,
    setSelected : Dispatch<SetStateAction<string>> | null;
    //setSelected(id : string | null) : void,
    selectedId : string | null,
}

function ExcerptListItem(props : ExcerptListItemProps) {
    return (
        <button
            key={props.excerpt.chunkId}
            className={cn(
            "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-primary/30",
                props.selectedId === props.excerpt.chunkId && "bg-primary/50"
            )}
            onClick={() => {
                if (props.setSelected) {
                    props.setSelected(props.excerpt.chunkId || "")
                }
            }}
        >
            <div className="flex w-full flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="font-semibold">
                        {props.excerpt.documentName}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span>Page {props.excerpt.pageNumber}</span>
                <span>Lines {props.excerpt.fromLine} to {props.excerpt.toLine}</span>
            </div>
            <div className="line-clamp-2 text-xs">
                {props.excerpt.content?.substring(0, 300)}
            </div>
        </button>
  )
}

export default ExcerptListItem