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
import { CornerDownLeft, Mic, Paperclip, Search } from "lucide-react"
import ExcerptList from "./excerpt-list"
import { ExcerptDisplay } from "./excerpt-display"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { ChatSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Button } from "@/components/ui/button"
import { searchEmbeddings } from "@/actions/search-embeddings"

const testExcerpts = [
    {
      "transcriptId": "f2737596-aa09-472e-88be-26ff2929e909",
      "transcriptName": "Hamson BOR Transcript - 01.19.2023 - Full Complete CERTIFIED COPY.pdf",
      "chunkId": "fd17b575-c3a1-4aee-a6cd-38c3beaed875",
      "pageNumber": 31,
      "fromLine": 20,
      "toLine": 22,
      "content": "20 these legal issues and Constitutional issues are not\n21 before the board, rather the proper venue for any such\n22 challenges is in state and federal court. In fact,"
    },
    {
      "transcriptId": "2560fc3e-f1c6-4074-b38f-25990650c157",
      "transcriptName": "Hamson BOR Transcript - 02.01.2023 - Full Complete CERTIFIED COPY.pdf",
      "chunkId": "5ef5cc5a-bf76-4f6f-9335-4adaaa87ee65",
      "pageNumber": 113,
      "fromLine": 23,
      "toLine": 24,
      "content": "23 And it says support the Constitution of the United\n24 States of America and the United States of California, State of"
    },
    {
      "transcriptId": "4889cd24-2693-40aa-a865-634c11098736",
      "transcriptName": "Hamson BOR Transcript - 04.12.2023 - Full Complete CERTIFIED COPY.pdf",
      "chunkId": "cc7decb2-fcca-427b-a79d-1b19c902ae84",
      "pageNumber": 43,
      "fromLine": 24,
      "toLine": 25,
      "content": "24 document. That's something that could be addressed in\n25 court of law. That is not within our purview. We are"
    },
    {
      "transcriptId": "4889cd24-2693-40aa-a865-634c11098736",
      "transcriptName": "Hamson BOR Transcript - 04.12.2023 - Full Complete CERTIFIED COPY.pdf",
      "chunkId": "9b8e0b09-3647-40a7-8103-4e68726633b3",
      "pageNumber": 55,
      "fromLine": 1,
      "toLine": 3,
      "content": "1 testimony that was presented after the objections were\n2 sustained be stricken. Also to clarify for the fact\n3 that Board of Rights decision does not establish"
    },
    {
      "transcriptId": "31c5f695-957e-4602-80f8-9139a9ae6e70",
      "transcriptName": "Hamson BOR Transcript - 05.09.2023 - Full Complete CERTIFIED COPY.pdf",
      "chunkId": "056330e7-37b6-4381-89b7-1711cc19a4b7",
      "pageNumber": 25,
      "fromLine": 5,
      "toLine": 7,
      "content": "5 referred to as a Constitutional exemption. Why was this\n6 request tendered?\n7 A Because our Constitution says it's we, the people"
    },
    {
      "transcriptId": "31c5f695-957e-4602-80f8-9139a9ae6e70",
      "transcriptName": "Hamson BOR Transcript - 05.09.2023 - Full Complete CERTIFIED COPY.pdf",
      "chunkId": "8cdbcb49-41a0-4b66-9ca8-ea9aa7d1e17d",
      "pageNumber": 53,
      "fromLine": 25,
      "toLine": 25,
      "content": "25 Constitution and to be fair and transparent and to protect"
    },
    {
      "transcriptId": "31c5f695-957e-4602-80f8-9139a9ae6e70",
      "transcriptName": "Hamson BOR Transcript - 05.09.2023 - Full Complete CERTIFIED COPY.pdf",
      "chunkId": "dca4ed05-0301-4fbf-b746-ba5493e6686e",
      "pageNumber": 56,
      "fromLine": 12,
      "toLine": 14,
      "content": "12 A In the totality of the email. It's a mere\n13 representation of the email stating that I have a\n14 Constitutional exemption given to me by God."
    },
    {
      "transcriptId": "31c5f695-957e-4602-80f8-9139a9ae6e70",
      "transcriptName": "Hamson BOR Transcript - 05.09.2023 - Full Complete CERTIFIED COPY.pdf",
      "chunkId": "795e37ca-57a2-485a-b708-0064d9cbb08e",
      "pageNumber": 59,
      "fromLine": 5,
      "toLine": 8,
      "content": "5 A I redacted everything that was repugnant to the\n6 Constitution.\n7 Q Very good. Thank you very much. And to\n8 acknowledge, you did answer question number one on the"
    },
    {
      "transcriptId": "31c5f695-957e-4602-80f8-9139a9ae6e70",
      "transcriptName": "Hamson BOR Transcript - 05.09.2023 - Full Complete CERTIFIED COPY.pdf",
      "chunkId": "f6ac95cd-3e75-42c5-8de0-0ddb22a77ba9",
      "pageNumber": 62,
      "fromLine": 1,
      "toLine": 3,
      "content": "1 just the start. If we don't get back to our Constitution\n2 of being men, we're going to lose this country. And I'm\n3 sorry. I've only got one job to give. Remember Patrick"
    },
    {
      "transcriptId": "31c5f695-957e-4602-80f8-9139a9ae6e70",
      "transcriptName": "Hamson BOR Transcript - 05.09.2023 - Full Complete CERTIFIED COPY.pdf",
      "chunkId": "7ad77702-58d4-4e57-bfb1-b12e1e1ec6bc",
      "pageNumber": 62,
      "fromLine": 11,
      "toLine": 13,
      "content": "11 permission -- for permission to be a sovereign human\n12 being. That's granted in the Constitution long before\n13 there was case law. that first guy had to stand on our"
    }
  ];

export interface ExcerptProps {
    transcriptId: string | null,
    transcriptName: string | null,
    chunkId: string | null,
    pageNumber: number,
    fromLine: number,
    toLine: number,
    content: string | null,
}

interface TranscriptExcerptProps {
    defaultLayout: number[] | undefined
    defaultCollapsed?: boolean
    navCollapsedSize?: number
  }
  
function TranscriptExcerpts({
    defaultLayout = [650, 650],
    defaultCollapsed = false,
    navCollapsedSize = 0,
} : TranscriptExcerptProps) {

  const [selected, setSelected] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [excerpts, setExcerpts] = useState<ExcerptProps[] | null>([]);

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
                    setExcerpts(data.chunks);
                    setSuccess(data.success);
                }

                // if(data?.twoFactor) {
                //     setShowTwoFactor(true);
                // }
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
        className="h-full max-h-[800px] items-stretch"
    >
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
        <Tabs defaultValue="all">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Transcript Excerpts</h1>
            {/* <TabsList className="ml-auto">
              <TabsTrigger
                value="all"
                className="text-zinc-600 dark:text-zinc-200"
              >
                All mail
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Unread
              </TabsTrigger>
            </TabsList> */}
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
                              <Button type="submit" size="sm" className="ml-auto gap-1.5">
                                  Send Message
                                  <CornerDownLeft className="size-3.5" />
                              </Button>
                          </div>
                      </form>
                  </Form>
            </div>
          </div>
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

export default TranscriptExcerpts