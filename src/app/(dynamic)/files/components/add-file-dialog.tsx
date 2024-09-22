"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

import { Loader2 } from "lucide-react";


import { FilePlus } from "lucide-react"
import { useState } from "react";
import { useToast } from "../../../../components/ui/use-toast";

import { UploadFileSchema } from "@/schemas";
import { uploadFile } from "@/app/(dynamic)/files/actions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


export function AddFileDialog() {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof UploadFileSchema>>({
    resolver: zodResolver(UploadFileSchema),
    defaultValues: {
      files: undefined,
    },
  });

  const fileRef = form.register("files");

  async function onSubmit(values: z.infer<typeof UploadFileSchema>) {
    
    const formData = new FormData();
    // formData.append("title", values.title);

    Array.from(values.files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      await uploadFile(formData);
      form.reset();
      setIsFileDialogOpen(false);

      toast({
        title: "File Uploaded",
        description: "Now everyone can view your file",
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
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <FilePlus />
        </Button>
      </DialogTrigger>
      <DialogClose onClick={(e) => setIsFileDialogOpen(false)}></DialogClose>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Select File
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <FormField
                    control={form.control}
                    name="files"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            className="cursor-pointer" 
                            multiple={true} 
                            type="file" 
                            {...fileRef} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="flex gap-1"
                  >
                    {form.formState.isSubmitting && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Upload
                  </Button>
                </form>
              </Form>
            {/* <Label htmlFor={props.inputName}>{props.labelText}</Label>
            <Input id={props.inputName} type="file" /> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
