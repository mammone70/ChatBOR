import { Transcript } from "@/data/transcripts"
import FileCard from "./file-card"

interface FileCardsProps {
  files : Transcript[]
}

function FileCards(props : FileCardsProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {
        props.files.map(
          (file) => (
            <FileCard file={file} key={file.id}></FileCard>  
          ) 
        )
      }
    </div>
  )
}

export default FileCards