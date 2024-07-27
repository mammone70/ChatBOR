"use client"

import { CornerDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"

/*
    Button that shows loading indicator based on status
*/

interface StatusButtonProps {
    isPending? : boolean;
    classes? : string;
}

export const StatusButton = ({
    isPending = false,
    classes,
} : StatusButtonProps) => {
    
    return (
        <>
            {!isPending 
            ?
                <Button type="submit" size="sm" className={classes}>
                    Send Message
                    <CornerDownLeft className="size-3.5" />
                </Button>
            :
                <Button disabled size="sm" className={classes}>
                    Asking ...
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                </Button>
            }
        </>
    )
}