"use client"

import { auth } from "@/auth";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Folders, MessageSquare, NotebookText } from "lucide-react";
import { useSession } from "next-auth/react";

import Link from "next/link"

import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathName = usePathname();
    const { data: session, status } = useSession();
    
    return (
        <>
            { status === "authenticated" && 
            <footer className="sticky bottom-0 z-50 md:hidden flex items-center top-3">
                <nav className="flex w-screen justify-evenly gap-1 p-1 border-white/15 border-t backdrop-blur">
                    <div className={`px-4 py-1.5 rounded-xl ${pathName == "/files" ? "bg-white/15 pointer-events-none" : ""}`}>
                        <Link href="/files">
                            <Folders className="h-8 w-8" />
                        </Link>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl ${pathName == "/chat" ? "bg-white/15 pointer-events-none" : ""}`}>
                        <Link href="/chat">
                            <MessageSquare className="h-8 w-8" />
                        </Link>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl ${pathName == "/excerpts" ? "bg-white/15 pointer-events-none" : ""}`}>
                        <Link href="/excerpts">
                            <NotebookText className="h-8 w-8" />
                        </Link>
                    </div>
                </nav>
            </footer>
                // <footer className="sticky bottom-0 z-50 py-2 border-t border-muted-foreground/15 md:hidden">
                //     <div className="">
                //         <div className="flex justify-between items-center">
                //             <div className={`pl-4 w-1/3 ${pathName == "/files" ? "bg-muted/80 pointer-events-none" : ""}`}>
                //                 <Link href="/files">
                //                     <Folders className="h-8 w-8" />
                //                 </Link>
                //             </div>
                //             <div className={`${pathName == "/chat" ? "bg-muted/80 pointer-events-none" : ""}`}>
                //                 <Link href="/chat">
                //                     <MessageSquare className="h-8 w-8" />
                //                 </Link>
                //             </div>
                //             <div className={`${pathName == "/excerpts" ? "bg-muted/80 pointer-events-none" : ""}`}>                            
                //                 <Link href="/excerpts">
                //                     <NotebookText className="h-8 w-8" />
                //                 </Link>
                //             </div>
                //         </div>
                //     </div>
                // </footer>
            }
        </>
    );
}
