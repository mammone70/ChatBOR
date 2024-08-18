import { Transcript } from "@/data/transcripts"
import FileCard from "@/components/files/file-card"
import FileContextMenu from "@/components/files/file-context-menu"

interface FileCardsProps {
  files : Transcript[]
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