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
              <ExcerptList></ExcerptList>
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              {/* <MailList items={mails.filter((item) => !item.read)} /> */}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]}>
          {/* <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          /> */}
        </ResizablePanel>
      </ResizablePanelGroup>
    )
}

export default TranscriptExcerpts