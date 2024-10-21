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
    console.log(session);
    console.log(status);

    return (
        <>
            { status === "authenticated" && 
                <footer className="sticky bottom-0 z-50 py-4 border-t border-muted-foreground/15 md:hidden">
                    <div className="container px-8">
                        <div className="flex justify-between items-center align-bottom">
                            <div>
                                <Link href="/files">
                                    <Folders className="h-8 w-8" />
                                </Link>
                            </div>
                            <div>
                                <Link href="/chat">
                                    <MessageSquare className="h-8 w-8" />
                                </Link>
                            </div>
                            <div>
                                <Link href="/excerpts">
                                    <NotebookText className="h-8 w-8" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            }
        </>
    );
}
