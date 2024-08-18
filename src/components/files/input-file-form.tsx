"use client";

import { Input } from "@/components/ui/input"
import { UploadFileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface InputFileFormProps {
    labelText : string,
}

export function InputFileForm(props : InputFileFormProps) {
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof UploadFileSchema>>({
    resolver: zodResolver(UploadFileSchema),
    defaultValues: {
      // title: "",
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
      // await createFile({
      //   name: values.title,
      //   fileId: storageId,
      //   orgId,
      //   type: types[fileType],
      // });

      // await uploadFile(formData);
      // form.reset();
      // setIsFileDialogOpen(false);

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
                <FormLabel>{props.labelText}</FormLabel>
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
  )
}
