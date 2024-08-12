import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { LayoutGrid, List, Search } from "lucide-react"
import FileCards from "@/components/files/file-cards";
import FileList from "@/components/files/file-list";

function FileBrowser() {
    return (
        <>
            <Tabs defaultValue="cards">
                <div className="flex align-text-bottom items-start space-x-4 px-4 py-2">
                    <h1 className="text-xl font-bold pt-1">Files</h1>
                    <TabsList>
                        <TabsTrigger
                            value="cards"
                            className="text-zinc-600 dark:text-zinc-200"
                        >
                            <LayoutGrid />
                        </TabsTrigger>
                        <TabsTrigger
                            value="list"
                            className="text-zinc-600 dark:text-zinc-200"
                        >
                            <List />
                        </TabsTrigger>
                    </TabsList>
                    <form>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-8" />
                        </div>
                    </form>
                </div>
                <Separator />
                <TabsContent value="cards" className="m-0">
                    <FileCards></FileCards>
                </TabsContent>
                <TabsContent value="list" className="m-0">
                    <FileList></FileList>
                </TabsContent>
            </Tabs>
        </>
    )
}

export default FileBrowser