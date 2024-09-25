"use client"

import { 
    ResizableHandle, 
    ResizablePanel, 
    ResizablePanelGroup 
} from "@/components/ui/resizable"

import { 
    Tabs, 
    TabsContent, 
    TabsList 
} from "@/components/ui/tabs"

import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Mic, Paperclip } from "lucide-react"
import ExcerptList from "./excerpt-list"
import { ExcerptDisplay } from "./excerpt-display"
import { useContext, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { ChatSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { searchEmbeddings } from "@/actions/search-embeddings"
import { StatusButton } from "../../../../components/status-button"
import { ExcerptsContext } from "@/app/providers"
import ExcerptResultsPopover from "./excerpt-results-dialog";

interface DocumentExcerptProps {
    defaultLayout: number[] | undefined
    defaultCollapsed?: boolean
    navCollapsedSize?: number
  }
  
function DocumentExcerpts({
    defaultLayout = [650, 650],
    defaultCollapsed = false,
    navCollapsedSize = 0,
} : DocumentExcerptProps) {

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const { 
    excerpts, 
    setExcerpts,
    selected,
    setSelected
  } = useContext(ExcerptsContext);

  const form = useForm<z.infer<typeof ChatSchema>>({
      resolver: zodResolver(ChatSchema),
      defaultValues: {
          message : "",
      },
  });

  const onSubmit = (values: z.infer<typeof ChatSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
        searchEmbeddings(values)
            .then((data) => {
                if(data?.error) {
                    // form.reset();
                    setError(data.error);
                }

                if(data?.success) {
                    // form.reset();
                    if(setExcerpts) setExcerpts(data.chunks);
                    setSuccess(data.success);
                }
            })
            .catch(() => setError("Something went wrong."));
    });
  };
  
  return (
    <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
        )}`
        }}
        className="h-full items-stretch"
    >
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
        <Tabs defaultValue="all">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Document Excerpts</h1>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="relative">
              {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" /> */}
              <Form {...form}>
                      <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring" x-chunk="dashboard-03-chunk-1"
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
                                              placeholder="Type your search here..."
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
                              <StatusButton classes="ml-auto gap-1.5" isPending={isPending}/>
                          </div>
                      </form>
                  </Form>
            </div>
          </div>
          {
            (excerpts && excerpts.length > 0) 
              && 
              <div className="flex bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <span className="p-2">{excerpts.length} Excerpts </span>
                <ExcerptResultsPopover excerpts={excerpts}></ExcerptResultsPopover>
              </div>
          }
          <TabsContent value="all" className="m-0">
            {/* <MailList items={mails} /> */}
            <ExcerptList 
              excerpts={excerpts}
              selectedId={selected}
              setSelected={setSelected}>

            </ExcerptList>
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            {/* <MailList items={mails.filter((item) => !item.read)} /> */}
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]}>
        <ExcerptDisplay
          excerpt={excerpts?.find((excerpt) => excerpt.chunkId === selected) || null}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default DocumentExcerpts