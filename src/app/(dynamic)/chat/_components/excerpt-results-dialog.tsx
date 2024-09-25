
import { ExcerptProps } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
} from "@/components/ui/dialog";

import { CopyIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react";

interface ExcerptResultsDialogProps {
    excerpts : ExcerptProps[],
}

function ExcerptResultsDialog(props : ExcerptResultsDialogProps) {
    useEffect(() => {
        setCopied(false);
    }, [props]);

    const [ copied, setCopied ] = useState<boolean>(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>View Full</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        All Excerpts 
                        <Button disabled={copied} size="icon" className="mx-2 h-5 w-5" onClick={
                            async (event) => {
                                await navigator.clipboard.writeText(
                                    props.excerpts.map(
                                        (excerpt) => {
                                            return (
                                                `${excerpt.documentName}\n` +
                                                `Page ${excerpt.pageNumber}\n` +
                                                `Lines ${excerpt.fromLine} to ${excerpt.toLine}\n` +
                                                `${excerpt.content}\n`
                                            );
                                        }
                                    ).join('\n\n')
                                );
                                setCopied(true);
                            }
                        }>
                            <span className="sr-only">Copy</span>
                            <CopyIcon className="h-3 w-3" />
                        </Button>
                        <span hidden={!copied} className="text-primary">Copied!</span>
                    </DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div id="excerptsContent" className="flex flex-col h-[80vh] overflow-auto">
                    {
                        props.excerpts && 
                        props.excerpts.map(
                            (excerpt) => (
                                <div key={excerpt.chunkId}>
                                    <div className="flex w-full flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <div className="font-semibold">
                                                {excerpt.documentName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>Page {excerpt.pageNumber}</span>
                                        <span>Lines {excerpt.fromLine} to {excerpt.toLine}</span>
                                    </div>
                                    <div className="flex-1 whitespace-pre-wrap p-4 text-lg font-semibold overflow-scroll">
                                        {excerpt.content}
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ExcerptResultsDialog