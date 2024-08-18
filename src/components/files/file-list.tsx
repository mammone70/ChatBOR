import { Transcript } from "@/data/transcripts"
import PDFIcon from "../icons/pdf-icon"

import FileContextMenu from "./file-context-menu"

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
                  <FileContextMenu 
                    className={`px-8 py-2 truncate${index % 2 === 0 ? " bg-muted" : ""}`}
                    tooltip={file.name}
                    fileId={file.id}
                  >
                    {file.name}
                  </FileContextMenu>
    
                  <FileContextMenu fileId={file.id} className={`px-8 py-2${index % 2 === 0 ? " bg-muted" : ""}`}><PDFIcon></PDFIcon></FileContextMenu>
                  <FileContextMenu fileId={file.id} className={`px-8 py-2${index % 2 === 0 ? " bg-muted" : ""}`}>0</FileContextMenu>
                </>
              )
            )
          }
      </div>
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