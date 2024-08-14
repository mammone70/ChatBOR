import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface FileContextMenuProps {
    children : React.ReactNode,
}

function FileContextMenu(props : FileContextMenuProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>{props.children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Profile</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default FileContextMenu