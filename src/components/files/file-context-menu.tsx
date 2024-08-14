import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from "@/components/ui/tooltip"

import { FileDown, Trash2 } from "lucide-react"

interface FileContextMenuProps {
    children : React.ReactNode,
    className? : string,
    tooltip? : string,
}

function FileContextMenu(props : FileContextMenuProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger className={props.className}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            {props.children}
                        </TooltipTrigger>
                        <TooltipContent side="top">{props.tooltip}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem><FileDown className="mr-2"/>Download</ContextMenuItem>
                <ContextMenuItem><Trash2 className="mr-2"/>Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default FileContextMenu