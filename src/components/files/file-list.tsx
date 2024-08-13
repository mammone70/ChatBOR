import { Transcript } from "@/data/transcripts"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

interface FileListProps {
  files : Transcript[]
}

function FileList(props : FileListProps) {
  return (
    <Table>
      <TableCaption>All of your transcripts</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="text-right">Pages</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          props.files.map(
            (file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium truncate">{file.name}</TableCell>
                <TableCell className="text-right">{file.totalPages}</TableCell>
              </TableRow>
            )
          )
        }
      </TableBody>
    </Table>

  )
}

export default FileList