import { Transcript } from "@/dao/documents"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import PDFIcon from "../../../../components/icons/pdf-icon"

interface FileCardProps {
    file : Transcript
}

function FileCard(props : FileCardProps) {
    return (
        <TooltipProvider>
            <Card className="h-56 w-56 border border-foreground flex flex-col justify-between">
                <CardHeader className="relative">
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <CardTitle className="flex gap-2 text-primary text-base font-normal truncate">
                            <div className="flex justify-center"><PDFIcon /></div>{" "}
                            {props.file.name}
                        </CardTitle>
                        </TooltipTrigger>
                        <TooltipContent side="top">{props.file.name}</TooltipContent>
                    </Tooltip>
                </CardHeader>
                <CardContent className="flex justify-center">

                </CardContent>
                <CardFooter className="flex flex-col">
                    <span className="text-primary">{props.file.totalPages ? props.file.totalPages : 0} pages</span>
                    <div className="text-xs text-gray-700">
                        Uploaded *date* {/*{formatRelative(new Date(file.createdAt), new Date())} */}
                    </div>
                </CardFooter>
            </Card>
        </TooltipProvider>
    )
}

export default FileCard