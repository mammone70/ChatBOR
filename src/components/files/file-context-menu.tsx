"use client";

import { deleteFile } from "@/actions/file-actions";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from "@/components/ui/tooltip"

import { DeleteFileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { FileDown, Loader2, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

interface FileContextMenuProps {
    children : React.ReactNode,
    className? : string,
    tooltip? : string,
    fileId : string,
}

function FileContextMenu(props : FileContextMenuProps) {
    const { toast } = useToast()
    // const [confirmDeleteDialogClosed, setConfirmDeleteDialogClosed] = useState<Boolean>()
    const form = useForm<z.infer<typeof DeleteFileSchema>>({
        resolver: zodResolver(DeleteFileSchema),
        defaultValues: {
            id: props.fileId,
        },
    });

    async function onSubmit(values: z.infer<typeof DeleteFileSchema>) {
        try {
            const deleteFileStatus = await deleteFile(values);

            toast({
                title: "File Deleted",
                description: deleteFileStatus.success,
            });
          } catch (err) {
            console.log(err);
            toast({
              variant: "destructive",
              title: "Something went wrong",
              description: "Your file could not be uploaded, try again later",
            });
          }    
    }

    return (
        <Dialog>
            <ContextMenu>
                <ContextMenuTrigger className={props.className}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                {props.children}
                            </TooltipTrigger>
                            <TooltipContent side="top">{props.tooltip}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem><FileDown className="mr-2"/>Download</ContextMenuItem>
                    <DialogTrigger asChild>
                        <ContextMenuItem><Trash2 className="mr-2"/>Delete</ContextMenuItem>
                    </DialogTrigger>
                </ContextMenuContent>
            </ContextMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this file from our servers?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                <DialogClose>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <Button 
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting && (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                Confirm
                            </Button>
                        </form>
                    </Form>
                </DialogClose>
                </div>
            </DialogContent>
        </Dialog>     
    );
}

export default FileContextMenu