"use client"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"

import Link from "next/link"

import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

const menuItems : {text: string, path: string}[] = [
    {
        text: "Files",
        path: "/files",
    },
    {
        text: "Excerpts",
        path: "/excerpts",
    },
    {
        text: "Chat",
        path: "/chat",
    },
]

export default function NavMenu() {
    const pathName = usePathname();
    return (
        <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden">
              <div className="grid gap-4 p-4">
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  Services
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  Contact
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        // <NavigationMenu >
        //     <NavigationMenuList>
        //         {menuItems.map((menuItem, index) => (
        //             <NavigationMenuItem key={index}>
        //                 <Link href={menuItem.path} legacyBehavior passHref>
        //                     <NavigationMenuLink 
        //                         className={`font-bold text-xl p-1 ${pathName == menuItem.path ? "border rounded-md border-primary bg-muted/80 pointer-events-none text-primary" : ""}`}>
        //                         {menuItem.text}
        //                     </NavigationMenuLink>
        //                 </Link>
        //             </NavigationMenuItem>
        //         ))}
        //     </NavigationMenuList>
        // </NavigationMenu>
    );
}
