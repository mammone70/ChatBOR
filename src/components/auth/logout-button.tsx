"use client";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/logout";
import { startTransition } from "react";

interface LogoutButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
}

export const LogoutButton = ({
    children,
    mode = "redirect",
    asChild
}: LogoutButtonProps) => {
    const router = useRouter();
    
    const onClick = () => {
        startTransition(() => {
            logout()
                .then((data) => {
                    router.push("/auth/login");
                })
                //TODO
                .catch(() => {});
        });
    }   

    if (mode === "modal") {
        return (
            <span>
                TODO: Implement Modal
            </span>
        )
    }
    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}