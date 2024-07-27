"use client"

import {
    CornerDownLeft,
    Mic,
    Paperclip,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip"

import { chat } from "@/actions/chat"
import { useForm } from "react-hook-form"
import { ChatSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import { useState, useTransition } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { readStreamableValue } from "ai/rsc"
import { ReloadIcon } from "@radix-ui/react-icons"

export default function ChatInteraction() {
    // const [isPending, startTransition] = useTransition();
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [chatHistory, setChatHistory] = useState<string | undefined>("");
    
    const form = useForm<z.infer<typeof ChatSchema>>({
        resolver: zodResolver(ChatSchema),
        defaultValues: {
            message : "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ChatSchema>) => {
        // setError("");
        // setSuccess("");
        setChatHistory("");
        setIsPending(true);

        const { status } = await chat(values);

        for await (const chunk of readStreamableValue(status!)) {
            // console.log(value);
            setChatHistory((currentHistory) => `${currentHistory}${chunk}`);
        }
        
        // startTransition(() => {
        //     chat(values)
        //         .then(async ({status}) => {
        //             for await (const chunk of readStreamableValue(status!)) {
        //                 setChatHistory((currentHistory) => `${currentHistory}${chunk}`);
        //             }

        //             // if(data?.error) {
        //             //     // form.reset();
        //             //     setError(data.error);
        //             // }

        //             // if(data?.success) {
        //             //     // form.reset();
        //             //     setChatHistory(data.chunks);
        //             //     setSuccess(data.success);
        //             // }
        //         })
        //         .catch(() => setError("Something went wrong."));
        // });
        setIsPending(false);
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <main className="h-screen py-4 w-3/5">
                <div className="border border-white relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/80 p-4 lg:col-span-2">
                    <Badge variant="outline" className="absolute right-3 top-3 border-primary">
                        Output
                    </Badge>
                    <div className="flex-1 overflow-y-auto pt-5">
                        {chatHistory}
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="border-white relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring" x-chunk="dashboard-03-chunk-1"
                        >
                            <FormField
                                control={form.control}
                                name="message"
                                render={( {field} )=> (
                                    <FormItem>
                                        <FormLabel className="sr-only">
                                            Message
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Type your message here..."
                                                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center p-3 pt-0">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Paperclip className="size-4" />
                                            <span className="sr-only">Attach file</span>
                                        </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Attach File</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Mic className="size-4" />
                                            <span className="sr-only">Use Microphone</span>
                                        </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Use Microphone</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {!isPending 
                                ?
                                    <Button type="submit" size="sm" className="ml-auto gap-1.5">
                                        Send Message
                                        <CornerDownLeft className="size-3.5" />
                                    </Button>
                                :
                                    <Button disabled size="sm" className="ml-auto gap-1.5">
                                        Asking ...
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    </Button>
                                }
                            </div>
                        </form>
                    </Form>
                </div>
            </main>
        </div>
    )
}