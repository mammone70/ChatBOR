import { Transcript } from "@/data/transcripts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import PDFIcon from "../icons/pdf-icon"

interface FileCardProps {
    file : Transcript
}

function FileCard(props : FileCardProps) {
    return (
        <TooltipProvider>
            <Card className="h-56 w-56 border border-foreground">
                <CardHeader className="relative">
                <Tooltip>
                    <TooltipTrigger asChild>
                    <CardTitle className="flex gap-2 py-4 text-primary text-base font-normal truncate">
                        <div className="flex justify-center"><PDFIcon /></div>{" "}
                        {props.file.name}
                    </CardTitle>
                    </TooltipTrigger>
                    <TooltipContent side="top">{props.file.name}</TooltipContent>
                </Tooltip>
                </CardHeader>
                <CardContent className="h-[100px] flex justify-center items-center">

                </CardContent>
                <CardFooter className="flex flex-col justify-between">
                    <span className="text-primary">{props.file.totalPages}</span>
                    <div className="text-xs text-gray-700">
                        Uploaded *date* {/*{formatRelative(new Date(file.createdAt), new Date())} */}
                    </div>
                </CardFooter>
            </Card>
        </TooltipProvider>
    )
}

export default FileCard