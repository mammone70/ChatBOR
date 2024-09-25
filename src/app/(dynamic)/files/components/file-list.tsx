import { Transcript } from "@/dao/documents"
import PDFIcon from "../../../../components/icons/pdf-icon"

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
                  <FileContextMenu fileId={file.id} className={`px-8 py-2${index % 2 === 0 ? " bg-muted" : ""}`}>{file.totalPages ? file.totalPages : 0}</FileContextMenu>
                </>
              )
            )
          }
      </div>
    </>

  )
}

export default FileList