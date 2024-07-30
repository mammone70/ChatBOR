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
        <NavigationMenu >
            <NavigationMenuList>
                {menuItems.map((menuItem, index) => (
                    <NavigationMenuItem key={index}>
                        <Link href={menuItem.path} legacyBehavior passHref>
                            <NavigationMenuLink 
                                className={`font-bold text-xl p-1 ${pathName == menuItem.path ? "border rounded-md border-primary bg-muted/80 pointer-events-none text-primary" : ""}`}>
                                {menuItem.text}
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
