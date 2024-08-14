import { Transcript } from "@/data/transcripts"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import PDFIcon from "../icons/pdf-icon"
import FileContextMenu from "@/components/files/file-context-menu"
import { Separator } from "../ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface FileListProps {
  files : Transcript[]
}

function FileList(props : FileListProps) {
  return (
    <>
      <div className="grid grid-cols-3 w-full">
          <div className="px-8 py-2 border-b">Name</div>
          <div className="px-8 py-2 border-b">Type</div>
          <div className="px-8 py-2 border-b">Pages</div>
          {
            props.files.map(
              (file, index) => (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ContextMenu>
                          <ContextMenuTrigger className={`px-8 py-2 truncate ${index % 2 === 0 ? "bg-muted" : ""}`}>{file.name}</ContextMenuTrigger>
                          <ContextMenuContent>
                              <ContextMenuItem>Profile</ContextMenuItem>
                          </ContextMenuContent>
                      </ContextMenu>
                      </TooltipTrigger>
                      <TooltipContent side="top">{file.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <ContextMenu>
                    <ContextMenuTrigger className={`px-8 py-2 ${index % 2 === 0 ? "bg-muted" : ""}`}><PDFIcon></PDFIcon></ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Profile</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                  <ContextMenu>
                    <ContextMenuTrigger className={`px-8 py-2 ${index % 2 === 0 ? "bg-muted" : ""}`}>0</ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Profile</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </>
              )
            )
          }
      </div>
      <Separator></Separator>
    </>
    // <Table>
    //   <TableCaption>All of your transcripts</TableCaption>
    //   <TableHeader>
    //     <TableRow>
    //       <TableHead>Name</TableHead>
    //       <TableHead>Type</TableHead>
    //       <TableHead>Pages</TableHead>
    //     </TableRow>
    //   </TableHeader>
    //   <TableBody>
    //     {
    //       props.files.map(
    //         (file) => (
    //             <TableRow key={file.id}>
    //               <FileContextMenu>
    //                 <TableCell>{file.name}</TableCell>
    //                 <TableCell><PDFIcon></PDFIcon></TableCell>
    //                 <TableCell>{file.totalPages ? file.totalPages : 0}</TableCell>
    //               </FileContextMenu>
    //             </TableRow>
    //         )
    //       )
    //     }
    //   </TableBody>
    // </Table>

  )
}

export default FileList