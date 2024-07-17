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

import { Separator } from "../ui/separator"
import { Input } from "../ui/input"
import { Search } from "lucide-react"
import ExcerptList from "./excerpt-list"
import { ExcerptDisplay } from "./excerpt-display"
import { useState } from "react"

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
    transcriptId: string,
    transcriptName: string,
    chunkId: string,
    pageNumber: number,
    fromLine: number,
    toLine: number,
    content: string,
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
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <TabsContent value="all" className="m-0">
            {/* <MailList items={mails} /> */}
            <ExcerptList 
              excerpts={testExcerpts}
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
          excerpt={testExcerpts.find((excerpt) => excerpt.chunkId === selected) || null}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default TranscriptExcerpts