import { Document } from "@/dao/documents"
import FileCard from "@/app/(dynamic)/files/_components/file-card"
import FileContextMenu from "@/app/(dynamic)/files/_components/file-context-menu"

interface FileCardsProps {
  files : Document[]
}

function FileCards(props : FileCardsProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {
        props.files.map(
          (file) => (
            <FileContextMenu fileId={file.id} key={file.id}>
              <FileCard file={file}></FileCard>  
            </FileContextMenu>
          ) 
        )
      }
    </div>
  )
}

export default FileCards